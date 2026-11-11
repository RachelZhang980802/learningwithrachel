#!/usr/bin/env python3
"""Import supplied books without changing their sources.

Reader output is plain HTML/JSON/images: no model or Python is needed to read it.
Requirements for import: pymupdf, Pillow, lxml, pysbd.
"""
import argparse
import collections
import html
import io
import json
import posixpath
import re
import unicodedata
from pathlib import Path
from zipfile import ZipFile

import pymupdf as pdf
import pysbd
from lxml import etree
from PIL import Image

SEGMENTER = pysbd.Segmenter(language="en", clean=False, char_span=True)
META = {
    "good-writing": {"title": "Good Writing", "subtitle": "36 Ways to Improve Your Sentences", "author": "Neal Allen & Anne Lamott", "format": "epub"},
    "college-writing": {"title": "College Writing Skills with Readings", "subtitle": "Eleventh Edition", "author": "Zoé L. Albright & John Langan", "format": "pdf"},
    "descriptosaurus": {"title": "Descriptosaurus", "subtitle": "Supporting Creative Writing for Ages 8–14 · Third Edition", "author": "Alison Wilcox", "format": "pdf"},
}
DESCRIPTO_COVER = [
    ("Descriptosaurus", [(37, 64, 423, 117)]),
    ("Supporting Creative Writing for Ages 8–14", [(37, 127, 423, 157)]),
    ("3rd Edition", [(356, 18, 423, 42)]),
    ("Thick forest", [(65, 177, 120, 190)]),
    ("Spidery tangle of trees, bushes, thorns and gnarled limbs", [(183, 177, 264, 190), (182, 247, 250, 270)]),
    ("Cloaked in mist like ghostly stooped figures", [(301, 177, 376, 190), (302, 244, 376, 265)]),
    ("Quiet...", [(66, 287, 94, 298)]),
    ("He was scared.", [(66, 318, 96, 335)]),
    ("Heart pounded", [(183, 288, 215, 305)]),
    ("Pulse raced", [(183, 305, 215, 320)]),
    ("Eyes widened", [(183, 325, 217, 343)]),
    ("Gasping breath", [(331, 285, 369, 303)]),
    ("Summer’s day", [(65, 394, 119, 406)]),
    ("Sun blazed from a vivid blue sky", [(183, 394, 242, 412)]),
    ("Wispy clouds drifted across the sky", [(183, 412, 265, 428)]),
    ("Blazing carpet of bluebells", [(302, 394, 363, 412)]),
    ("Trees bursting with blossom, symphony of song birds", [(301, 412, 381, 437)]),
    ("Including a companion website with all elements of the book, VCOP coverage, games, planning sheets and vocabulary builders", [(70, 506, 360, 534)]),
    ("Photocopiable", [(364, 531, 388, 538)]),
    ("Companion website", [(390, 507, 419, 537)]),
    ("A David Fulton Book", [(17, 559, 100, 576)]),
    ("Alison Wilcox", [(286, 560, 425, 582)]),
]


def normalize(value):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", value).replace("\u00ad", "")).strip()


def english(value):
    return bool(re.search(r"[A-Za-z]", value))


class Importer:
    def __init__(self, book, source, root, tessdata):
        self.id = book
        self.source = source
        self.root = root
        self.dest = root / "public/narrative-course/books/library" / book
        self.dest.mkdir(parents=True, exist_ok=True)
        self.work = root / ".local-preview/writing-library"
        self.work.mkdir(parents=True, exist_ok=True)
        self.data = {"id": book, **META[book], "version": 1, "sentences": {}, "toc": []}
        self.serial = 0
        self.tessdata = tessdata
        self.reference_section = "prose"
        self.report = {"source": source.name, "pages": 0, "sentences": 0, "ocrPages": [], "crossPageJoins": 0, "emptyPages": []}

    def add(self, text, page=None):
        text = normalize(text)
        if not text or not english(text):
            return None
        self.serial += 1
        key = f"{self.id}-{self.serial:06}"
        self.data["sentences"][key] = {"en": text, **({"page": page} if page else {})}
        return key

    def spans(self, text):
        spans = SEGMENTER.segment(text)
        return [(s.start, s.end, s.sent) for s in spans] or [(0, len(text), text)]

    def reference_groups(self, block):
        lines = collections.OrderedDict()
        for word in block:
            lines.setdefault(word[6], []).append(word)
        current = []
        kind = self.reference_section
        for line in lines.values():
            label = normalize(" ".join(word[4] for word in line))
            heading = None
            if re.fullmatch(r"Words|Nouns|Adjectives|Verbs|Adverbs", label, re.I):
                heading = "words"
            elif re.fullmatch(r"Phrases(?:\s*[-–—].+)?", label, re.I):
                heading = "phrase"
            elif re.fullmatch(r"Sentences|Examples|Ideas for (?:Teachers|Writers)", label, re.I):
                heading = "prose"
            if heading is not None or label.startswith("★"):
                if current:
                    yield current, kind
                    current = []
                if heading is not None:
                    yield line, "heading"
                    self.reference_section = heading
                    kind = heading
                    continue
                kind = "phrase"
            current.extend(line)
        if current:
            yield current, kind

    def reference_spans(self, text, kind):
        if kind == "words" and "," in text and not re.search(r"[.!?][”’\"']?$", text):
            start = depth = 0
            for i, character in enumerate(text):
                if character in "([":
                    depth += 1
                elif character in ")]":
                    depth = max(0, depth - 1)
                elif character == "," and depth == 0:
                    yield start, i, text[start:i]
                    start = i + 1
            yield start, len(text), text[start:]
        else:
            for start, end, sentence in self.spans(text):
                yield start, end, sentence.lstrip("★ ")

    def lines_to_units(self, words, width, height, page, row_mode=False, native_blocks=None):
        blocks = collections.OrderedDict()
        for w in words:
            if len(w) < 8 or not normalize(w[4]):
                continue
            blocks.setdefault(w[5], []).append(w)
        units = []
        for block in blocks.values():
            groups = self.reference_groups(block) if row_mode else [(block, "prose")]
            for group, kind in groups:
                chars = []
                positions = []
                for i, w in enumerate(group):
                    token = normalize(w[4])
                    if chars:
                        previous = group[i - 1]
                        wrapped = previous[6] != w[6]
                        if wrapped and chars[-1] == "-" and token[:1].islower():
                            chars.pop()
                            positions.pop()
                        else:
                            chars.append(" ")
                            positions.append(None)
                    chars.extend(token)
                    positions.extend([w] * len(token))
                text = "".join(chars)
                spans = self.reference_spans(text, kind) if row_mode else self.spans(text)
                for start, end, sentence in spans:
                    key = self.add(sentence, page)
                    if not key:
                        continue
                    lines = collections.OrderedDict()
                    for word in positions[start:end]:
                        if word is None:
                            continue
                        identity = (word[5], word[6])
                        line = lines.setdefault(identity, [word[0], word[1], word[2], word[3]])
                        line[0], line[1] = min(line[0], word[0]), min(line[1], word[1])
                        line[2], line[3] = max(line[2], word[2]), max(line[3], word[3])
                    boxes = []
                    for x0, y0, x1, y1 in lines.values():
                        left, right = max(0, x0 / width), min(1, x1 / width)
                        top, bottom = max(0, y0 / height), min(1, y1 / height)
                        if right - left > .000001 and bottom - top > .000001:
                            boxes.append([round(left, 6), round(top, 6), round(right - left, 6), round(bottom - top, 6)])
                    if boxes:
                        unit = {"id": key, "boxes": boxes}
                        if native_blocks is not None and group[0][5] not in native_blocks:
                            unit["ocr"] = True
                        if kind != "prose":
                            unit["reference"] = kind
                        units.append(unit)
                    else:
                        del self.data["sentences"][key]
        return units

    def descriptosaurus_cover(self, page, number):
        # Verify small lettering against the original cover art on both pages.
        image = page.get_image_rects(page.get_images()[0][0])[0]
        x, y = image.x0 / page.rect.width, image.y0 / page.rect.height
        w, h = image.width / page.rect.width, image.height / page.rect.height
        return [
            {"id": self.add(english_text, number),
             "boxes": [[round(x + a / 459 * w, 6), round(y + b / 594 * h, 6),
                        round((c - a) / 459 * w, 6), round((d - b) / 594 * h, 6)] for a,b,c,d in boxes]}
            for english_text, boxes in DESCRIPTO_COVER
        ]

    def join_reference_continuations(self, units):
        joined = []
        for unit in units:
            if joined and not unit.get("ocr") and not unit.get("reference"):
                previous = joined[-1]
                a = self.data["sentences"][previous["id"]]["en"]
                b = self.data["sentences"][unit["id"]]["en"]
                x0, y0, _, h0 = previous["boxes"][-1]
                x1, y1, _, _ = unit["boxes"][0]
                delta = y1 - y0
                if (not previous.get("ocr") and previous.get("reference") in (None, "phrase")
                        and len(a) > 18 and re.search(r"[a-z,;]$", a) and re.match(r"^[a-z]", b)
                        and .65 * h0 < delta < 2.05 * h0 and abs(x1 - x0) < .04):
                    self.data["sentences"][previous["id"]]["en"] = a + " " + b
                    previous["boxes"].extend(unit["boxes"])
                    del self.data["sentences"][unit["id"]]
                    self.report["withinPageJoins"] = self.report.get("withinPageJoins", 0) + 1
                    continue
            joined.append(unit)
        return joined

    def add_reference_contexts(self):
        label = None
        previous_chapter = None
        chapters = [t for t in self.data["toc"] if t["level"] == 3]
        for page in self.data["pages"]:
            chapter = next((t["title"] for t in reversed(chapters) if t["page"] <= page["number"]), None)
            if previous_chapter != chapter:
                label = None
                previous_chapter = chapter
            for unit in page["units"]:
                sentence = self.data["sentences"][unit["id"]]
                en = sentence["en"]
                if unit.get("reference") == "heading":
                    if re.fullmatch(r"Nouns|Adjectives|Verbs|Adverbs", en, re.I):
                        label = en.title()
                    else:
                        label = None
                elif chapter and label and unit.get("reference") == "words" and len(en) < 90:
                    sentence["context"] = re.sub(r"^\d+\s+", "", chapter) + " · " + label

    def ocr_image(self, path):
        pix = pdf.Pixmap(str(path))
        doc = pdf.open("pdf", pix.pdfocr_tobytes(language="eng", tessdata=str(self.tessdata)))
        page = doc[0]
        return self.lines_to_units(page.get_text("words"), page.rect.width, page.rect.height, None)

    def import_epub(self):
        self.data["chapters"] = []
        self.data["images"] = {}
        with ZipFile(self.source) as archive:
            ns = {"c": "urn:oasis:names:tc:opendocument:xmlns:container", "o": "http://www.idpf.org/2007/opf"}
            container = etree.fromstring(archive.read("META-INF/container.xml"))
            opf_path = container.xpath("string(//c:rootfile/@full-path)", namespaces=ns)
            opf = etree.fromstring(archive.read(opf_path))
            manifest = {item.get("id"): item.get("href") for item in opf.xpath("//o:manifest/o:item", namespaces=ns)}
            spine = [item.get("idref") for item in opf.xpath("//o:spine/o:itemref", namespaces=ns)]
            image_paths = {}

            def image_block(node, document):
                source = node.get("src")
                if not source:
                    return ""
                target = posixpath.normpath(posixpath.join(posixpath.dirname(document), source))
                if target not in image_paths:
                    name = Path(target).name
                    image_dir = self.dest / "images"
                    image_dir.mkdir(exist_ok=True)
                    target_file = image_dir / name
                    target_file.write_bytes(archive.read(target))
                    with Image.open(target_file) as im:
                        width, height = im.size
                    if name == "9798217046973_cover.jpg":
                        # The large display type and typewriter artwork confuse OCR.
                        # These six regions were checked directly against the cover.
                        cover_lines = [
                            ("Good Writing", [.12, .045, .77, .29]),
                            ("36 Ways to Improve Your Sentences", [.065, .343, .87, .045]),
                            ("Neal Allen", [.18, .724, .63, .067]),
                            ("Author of Better Days", [.30, .80, .41, .035]),
                            ("Anne Lamott", [.115, .85, .77, .07]),
                            ("Author of Bird by Bird", [.30, .925, .42, .038]),
                        ]
                        units = [{"id": self.add(text), "boxes": [box]} for text, box in cover_lines]
                    else:
                        units = self.ocr_image(target_file)
                        if name.endswith("_title_page.jpg"):
                            for unit in units:
                                original = self.data["sentences"][unit["id"]]["en"]
                                if original == "W | t |":
                                    self.data["sentences"][unit["id"]]["en"] = "Good Writing"
                    self.data["images"][name] = {"src": f"images/{name}", "width": width, "height": height, "units": units, "fullPage": "fill_height" in node.get("class", ""), "heightEm": 2 if "height_2em" in node.get("class", "") else 12}
                    image_paths[target] = name
                    if "cover" in name.lower():
                        self.data["cover"] = f"images/{name}"
                name = image_paths[target]
                full_page = self.data["images"][name]["fullPage"]
                figure_class = "epub-art" if full_page else "epub-art epub-art--inline"
                return f'<figure class="{figure_class}" data-image="{html.escape(name, quote=True)}"><img src="library/{self.id}/images/{html.escape(name, quote=True)}" alt="{html.escape(node.get("alt", "Original book illustration"), quote=True)}"></figure>'

            def paragraph(node):
                chars, styles = [], []

                def add_text(text, italic=False, bold=False):
                    for char in unicodedata.normalize("NFKC", text or ""):
                        if char == "\u00ad":
                            continue
                        if char.isspace():
                            if chars and chars[-1] != " ":
                                chars.append(" ")
                                styles.append((italic, bold))
                        else:
                            chars.append(char)
                            styles.append((italic, bold))

                def inline(element, italic=False, bold=False):
                    if element.get("aria-hidden") == "true":
                        return
                    tag = etree.QName(element).localname if isinstance(element.tag, str) else ""
                    italic = italic or tag in ("i", "em") or "char-i" in element.get("class", "")
                    bold = bold or tag in ("b", "strong")
                    add_text(element.text, italic, bold)
                    for child in element:
                        if isinstance(child.tag, str) and etree.QName(child).localname == "br":
                            add_text(" ", italic, bold)
                        else:
                            inline(child, italic, bold)
                        add_text(child.tail, italic, bold)

                inline(node)
                while chars and chars[-1] == " ":
                    chars.pop(); styles.pop()
                text = "".join(chars)
                if not text:
                    return ""
                parts = []
                for start, end, sentence in self.spans(text):
                    runs = []
                    cursor = start
                    while cursor < end:
                        finish = cursor + 1
                        while finish < end and styles[finish] == styles[cursor]:
                            finish += 1
                        content = html.escape(text[cursor:finish])
                        italic, bold = styles[cursor]
                        if italic: content = f"<em>{content}</em>"
                        if bold: content = f"<strong>{content}</strong>"
                        runs.append(content)
                        cursor = finish
                    content = "".join(runs)
                    key = self.add(sentence)
                    parts.append(f'<span class="book-sentence" role="button" tabindex="0" data-sentence="{key}">{content}</span>' if key else content)
                tag = etree.QName(node).localname
                tag = tag if tag in ("h1", "h2", "h3", "h4", "p", "li", "dt", "dd", "figcaption") else "p"
                if tag in ("dt", "dd", "li"): tag = "p"
                classes = []
                original_class = node.get("class", "")
                if "para-cst" in original_class: classes.append("book-subtitle")
                if any(x in original_class for x in ("para-ext", "para-ex", "para-qt", "para-poem")): classes.append("book-example")
                return f'<{tag} class="{" ".join(classes)}">{"".join(parts)}</{tag}>'

            for number, ref in enumerate(spine):
                document = posixpath.normpath(posixpath.join(posixpath.dirname(opf_path), manifest[ref]))
                root = etree.fromstring(archive.read(document))
                body = root.xpath('//*[local-name()="body"]')[0]
                title = normalize(" ".join(root.xpath('//*[local-name()="title"]/text()'))).removesuffix(", Good Writing")
                content = []

                def walk(node):
                    if not isinstance(node.tag, str): return
                    if node.get("aria-hidden") == "true": return
                    tag = etree.QName(node).localname
                    if tag == "img":
                        content.append(image_block(node, document))
                    elif tag in ("h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "dt", "dd", "figcaption", "td", "th"):
                        if node.xpath('.//*[local-name()="img"]'):
                            for image in node.xpath('.//*[local-name()="img"]'): content.append(image_block(image, document))
                        else:
                            content.append(paragraph(node))
                    else:
                        for child in node: walk(child)
                walk(body)
                chapter_id = f"chapter-{number + 1}"
                self.data["chapters"].append({"id": chapter_id, "title": title, "html": "".join(content)})
                self.data["toc"].append({"title": title, "chapter": chapter_id, "level": 1})
                print(f"{self.id}: chapter {number+1}/{len(spine)} · {len(self.data['sentences'])} units", flush=True)
        self.report["chapters"] = len(self.data["chapters"])

    def import_pdf(self):
        doc = pdf.open(self.source)
        self.data["pages"] = []
        self.data["toc"] = [{"level": min(level, 3), "title": normalize(title), "page": page} for level, title, page in doc.get_toc() if page > 0]
        page_dir = self.dest / "pages"
        page_dir.mkdir(exist_ok=True)
        previous_candidates = []
        for index, page in enumerate(doc):
            number = index + 1
            width, height = page.rect.width, page.rect.height
            words = page.get_text("words")
            native_blocks = {w[5] for w in words}
            is_reference_cover = self.id == "descriptosaurus" and number <= 2
            if not is_reference_cover and page.get_images() and (index > 0 or sum(len(w[4]) for w in words) < 16):
                native_words = list(words)
                text_page = page.get_textpage_ocr(language="eng", dpi=150, full=False, tessdata=str(self.tessdata))
                combined = page.get_text("words", textpage=text_page)
                words = list(native_words)
                for candidate in combined:
                    rect = pdf.Rect(candidate[:4])
                    if rect.is_empty:
                        continue
                    # Keep native glyphs where an image's OCR overlaps them.
                    covered = 0
                    duplicate = False
                    for original in native_words:
                        overlap = rect & pdf.Rect(original[:4])
                        if overlap.is_empty:
                            continue
                        fraction = overlap.get_area() / max(.01, rect.get_area())
                        covered += fraction
                        if fraction > .3 and normalize(candidate[4]).casefold() == normalize(original[4]).casefold():
                            duplicate = True
                            break
                    if not duplicate and covered < .7:
                        words.append(candidate)
                self.report["ocrPages"].append(number)
            image_name = f"pages/{number:04}.webp"
            image_file = self.dest / image_name
            if not image_file.exists():
                scale = 1800 / max(width, height)
                pix = page.get_pixmap(matrix=pdf.Matrix(scale, scale), alpha=False, colorspace=pdf.csRGB)
                image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                image.save(image_file, "WEBP", quality=87, method=4)
            units = self.descriptosaurus_cover(page, number) if is_reference_cover else self.lines_to_units(
                words, width, height, number, self.id == "descriptosaurus", native_blocks
            )
            if self.id == "descriptosaurus" and not is_reference_cover:
                units = self.join_reference_continuations(units)
            # Join a sentence that genuinely continues across a page boundary.
            candidates = [u for u in units if not is_reference_cover and not u.get("reference") and u["boxes"][0][1] > .065 and u["boxes"][0][1] < .92 and len(self.data["sentences"][u["id"]]["en"]) > 35]
            candidates = [u for u in candidates if not u.get("ocr")] or candidates
            candidates.sort(key=lambda u: (min(box[1] for box in u["boxes"]), min(box[0] for box in u["boxes"])))
            if previous_candidates and candidates:
                before = max(previous_candidates, key=lambda u: max(box[1] + box[3] for box in u["boxes"]))
                after = candidates[0]
                a = self.data["sentences"][before["id"]]["en"]
                b = self.data["sentences"][after["id"]]["en"]
                if re.search(r"[a-z,;\-]$", a) and re.match(r"^[a-z]", b) and len(a) + len(b) < 2200:
                    joined = a[:-1] + b if a.endswith("-") else a + " " + b
                    self.data["sentences"][before["id"]]["en"] = joined
                    del self.data["sentences"][after["id"]]
                    after["id"] = before["id"]
                    self.report["crossPageJoins"] += 1
            previous_candidates = candidates
            if not units:
                self.report["emptyPages"].append(number)
            self.data["pages"].append({"number": number, "width": width, "height": height, "image": image_name, "units": units})
            if number == 1:
                self.data["cover"] = image_name
            if number % 20 == 0 or number == len(doc):
                print(f"{self.id}: page {number}/{len(doc)} · {len(self.data['sentences'])} units", flush=True)
        self.data["pageCount"] = len(doc)
        self.report["pages"] = len(doc)
        if self.id == "descriptosaurus":
            self.add_reference_contexts()

    def run(self):
        if self.data["format"] == "epub": self.import_epub()
        else: self.import_pdf()
        self.report["sentences"] = len(self.data["sentences"])
        target = self.work / f"{self.id}-source.json"
        staged = target.with_suffix(".json.tmp")
        staged.write_text(json.dumps(self.data, ensure_ascii=False, separators=(",", ":")))
        staged.replace(target)
        (self.work / f"{self.id}-import-report.json").write_text(json.dumps(self.report, ensure_ascii=False, indent=2))
        print(json.dumps({"book": self.id, "sourceData": str(target), **self.report}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", choices=META, required=True)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--tessdata", type=Path, required=True)
    args = parser.parse_args()
    Importer(args.book, args.source, args.root, args.tessdata).run()
