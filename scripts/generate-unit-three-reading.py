"""Extract web-reading text from Unit 3's existing native HTML slides."""
import json
import re
from pathlib import Path
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / 'app/unitThreeNativeSlides.json').read_text())
result = {}
for page, markup in source.items():
    document = html.fromstring(markup)
    objects = document.xpath('.//*[contains(concat(" ", normalize-space(@class), " "), " u3-object-text ")]')
    objects.sort(key=lambda node: (float(node.get('data-u3-y', '0')), float(node.get('data-u3-x', '0'))))
    items = []
    for obj in objects:
        quote = obj.xpath('.//details[contains(concat(" ", normalize-space(@class), " "), " u3-quote ")]')
        if quote:
            for node in quote:
                english = node.xpath('.//span[contains(concat(" ", normalize-space(@class), " "), " u3-english ")]')
                chinese = node.xpath('.//span[contains(concat(" ", normalize-space(@class), " "), " u3-inline-zh ")]')
                if not english: continue
                text = re.sub(r'\s+', ' ', english[0].text_content()).strip()
                translation = re.sub(r'\s+', ' ', chinese[0].text_content()).strip('（） ') if chinese else ''
                if text: items.append({'type': 'quote', 'text': text, 'translation': translation})
            continue
        text_area = obj.xpath('./div[contains(concat(" ", normalize-space(@class), " "), " u3-text ")]')
        if not text_area: continue
        text = re.sub(r'\s+', ' ', text_area[0].text_content()).strip()
        if not text or re.fullmatch(r'\d+', text): continue
        if items and items[-1]['text'] == text: continue
        items.append({'type': 'text', 'text': text})
    result[page] = items
(ROOT / 'app/unitThreeReadingPages.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print('Generated reading text for', len(result), 'Unit 3 pages:', sum(len(x) for x in result.values()), 'text blocks')
