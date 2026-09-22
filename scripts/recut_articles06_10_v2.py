#!/usr/bin/env python3
"""Re-cut Articles 06–10 from the untouched full recordings.

This script intentionally does not claim semantic verification.  Existing
manifest timings are used only as alignment candidates; clips are rendered
from the full source MP3s with conservative speech-safe padding.  Every
record remains ``needsReview`` until a human compares the clip with the
sentence text.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path


ABBREVIATIONS = (
    "U.S.", "L.A.", "R.", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.",
    "e.g.", "i.e.", "etc.",
)

SOURCES = {
    "06": ("public/audio-reading-benjamin-franklin.mp3", "Reading", "Benjamin Franklin"),
    "07": ("public/audio-cities-jared-diamond.mp3", "What We Gain or Lose in Cities", "Jared Diamond"),
    "08": ("public/audio-foodie-rachel-kuo.mp3", "The Guide to Being a Foodie Without Being Culturally Appropriative", "Rachel Kuo"),
    "09": ("public/audio-travel-mari-uyehara.mp3", "Stop Telling Me to Travel like a Local, Okay?", "Mari Uyehara"),
    "10": ("public/audio-river-mark-twain.mp3", "Two Ways of Seeing a River", "Mark Twain"),
}


def split_sentences(paragraph: str) -> list[str]:
    text = re.sub(r"^\d+\s+", "", paragraph.strip())
    text = re.sub(r"\s+", " ", text)
    for abbreviation in ABBREVIATIONS:
        text = text.replace(abbreviation, abbreviation.replace(".", "\x00"))
    out: list[str] = []
    start = 0
    for match in re.finditer(r"[.!?]+(?:[\"”’')\]]+)?(?=\s|$)", text):
        end = match.end()
        sentence = text[start:end].replace("\x00", ".").strip()
        if sentence:
            out.append(sentence)
        start = end
        while start < len(text) and text[start].isspace():
            start += 1
    tail = text[start:].replace("\x00", ".").strip()
    if tail:
        out.append(tail)
    return out


def duration(path: Path) -> float:
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1", str(path),
    ], text=True).strip())


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def cut(source: Path, start: float, end: float, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-ss", f"{start:.3f}", "-to", f"{end:.3f}", "-i", str(source),
        "-map_metadata", "-1", "-codec:a", "libmp3lame", "-q:a", "2",
        str(target),
    ], check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--articles", type=Path, default=Path("../articles06-10.json"))
    parser.add_argument("--version", default="v2")
    opts = parser.parse_args()
    repo = opts.repo.resolve()
    articles_path = opts.articles if opts.articles.is_absolute() else (repo / opts.articles)
    articles = json.loads(articles_path.read_text(encoding="utf-8"))
    if len(articles) != 5:
        raise ValueError("Expected five article records (06–10)")

    for offset, article in enumerate(articles, 6):
        article_id = f"{offset:02d}"
        source_rel, title, author = SOURCES[article_id]
        source = repo / source_rel
        manifest_path = repo / "public" / "audio" / f"article-{article_id}" / "manifest.json"
        if not source.exists() or not manifest_path.exists():
            raise FileNotFoundError(f"Missing source or candidate manifest for article {article_id}")
        old = json.loads(manifest_path.read_text(encoding="utf-8"))
        old_records = old.get("sentences", [])
        # Candidate timings are never read from the generated clips.  They are
        # mapped to the corrected source-text sentence list below.
        old_by_text = {re.sub(r"\s+", " ", r["text"].strip()): r for r in old_records}
        sentences: list[tuple[int, int, str]] = []
        for paragraph_number, paragraph in enumerate(article["paragraphs"], 1):
            for sentence_number, text in enumerate(split_sentences(paragraph), 1):
                sentences.append((paragraph_number, sentence_number, text))

        # Sequentially consume old records, allowing abbreviation-safe merges
        # (U.S., L.A., R. Burton) that prior manifests split incorrectly.
        candidates: list[tuple[float, float]] = []
        cursor = 0
        for _, _, text in sentences:
            norm = re.sub(r"\s+", " ", text.strip())
            found: list[dict] = []
            joined = ""
            while cursor < len(old_records) and re.sub(r"\s+", " ", joined) != norm:
                record = old_records[cursor]
                found.append(record)
                joined = (joined + " " + record["text"]).strip()
                cursor += 1
                if re.sub(r"\s+", " ", joined) == norm:
                    break
                if len(joined) > len(norm) + 40:
                    raise ValueError(f"Could not align sentence text for {article_id}: {text[:80]}")
            if not found or re.sub(r"\s+", " ", joined) != norm:
                raise ValueError(f"Sentence text mismatch for {article_id}: {text[:100]}")
            candidates.append((float(found[0]["startTime"]), float(found[-1]["endTime"])))
        if cursor != len(old_records):
            raise ValueError(f"Unused old sentence records remain for article {article_id}: {len(old_records)-cursor}")

        source_duration = duration(source)
        out_dir = repo / "public" / "audio" / f"article-{article_id}-{opts.version}"
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True)
        records = []
        for index, ((paragraph_number, sentence_number, text), (candidate_start, candidate_end)) in enumerate(zip(sentences, candidates)):
            # Retain a small amount of context around candidate boundaries.
            # This intentionally permits tiny overlaps; it is safer than
            # clipping an initial consonant or final intonation contour.
            start = max(0.0, candidate_start - 0.30)
            end = min(source_duration, candidate_end + 0.50)
            if index and start > candidates[index - 1][1] + 0.50:
                start = max(0.0, candidates[index - 1][1] - 0.30)
            sid = f"a{article_id}-p{paragraph_number:02d}-s{sentence_number:02d}"
            # The versioned directory busts browser caches while preserving
            # the audit tool's required filename == sentenceId convention.
            filename = f"{sid}.mp3"
            cut(source, start, end, out_dir / filename)
            records.append({
                "sentenceId": sid,
                "paragraphId": f"a{article_id}-p{paragraph_number:02d}",
                "text": text,
                "audioSrc": f"/audio/article-{article_id}-{opts.version}/{filename}",
                "startTime": round(start, 3),
                "endTime": round(end, 3),
                "verified": False,
                "needsReview": True,
            })
        manifest = {
            "articleId": article_id,
            "title": title,
            "author": author,
            "sourceAudio": f"/{source_rel.replace('public/', '')}",
            "sourceSha256": sha256(source),
            "paragraphCount": len(article["paragraphs"]),
            "sentenceCount": len(records),
            "segmentationVersion": opts.version,
            "semanticMatchChecked": False,
            "sentences": records,
        }
        (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{article_id}: {len(article['paragraphs'])} paragraphs, {len(records)} sentences -> {out_dir.relative_to(repo)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
