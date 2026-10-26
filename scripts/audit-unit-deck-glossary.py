"""Check translated coverage against the actual selected source-deck text blocks.

Run: python3 scripts/audit-unit-deck-glossary.py
The report distinguishes readable English missing a gloss from existing Chinese.
No approximate/fuzzy matching or generic translation fallback is used.
"""
from pathlib import Path
import json,re,unicodedata
ROOT=Path(__file__).resolve().parents[1]
def compact(text):
    return ''.join(c for c in unicodedata.normalize('NFKC',text).lower() if c.isalnum())
def read(path):
    return json.loads(path.read_text())
def main():
    glossary=read(ROOT/'app/unitDeckGlossary.json')
    by_id=read(ROOT/'app/unitDeckGlossaryById.json')
    lookup={compact(en):zh for en,zh in glossary.items()}
    manifest=read(ROOT/'app/unitDeckSources.json')
    invalid=[key for key,value in glossary.items() if not key.strip() or not value.strip() or not re.search('[\u3400-\u9fff]',value)]
    invalid.extend(key for key,value in by_id.items() if not value.get('sourceEnglish','').strip() or not re.search('[\u3400-\u9fff]',value.get('translation','')))
    units={};mismatches=[];all_ids=set()
    for unit,meta in manifest.items():
        deck=read(ROOT/'public'/meta['dataUrl'].lstrip('/'))
        english=[];covered=[];missing=[];other=[]
        for page in deck['pages']:
            for block in page['texts']:
                block_id,text=block['id'],block['text'];all_ids.add(block_id)
                if block_id in by_id and compact(text) not in compact(by_id[block_id]['sourceEnglish']):
                    mismatches.append(block_id)
                if re.search('[a-zA-Z]{2}',text) and not re.search('[\u3400-\u9fff]',text):
                    english.append(block)
                    if block_id in by_id or compact(text) in lookup:
                        covered.append(block)
                    else:
                        missing.append({'page':page['page'],'id':block_id,'text':text})
                else:
                    other.append(block)
        units[unit]={'selectedPages':len(deck['pages']),'englishBlocks':len(english),'translatedEnglishBlocks':len(covered),'englishCharacters':sum(len(b['text']) for b in english),'translatedEnglishCharacters':sum(len(b['text']) for b in covered),'otherBlocks':len(other),'missingEnglishBlocks':missing}
    report={'glossaryEntries':len(glossary),'contextualEntries':len(by_id),'invalidEntries':invalid,'contextMismatches':mismatches,'unusedContextIds':sorted(set(by_id)-all_ids),'units':units}
    report_path=ROOT/'docs/unit-deck-glossary-audit.json'
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    for unit,result in units.items():
        print(f"Unit {unit}: {result['translatedEnglishBlocks']}/{result['englishBlocks']} English blocks have Chinese glosses; {result['selectedPages']} selected pages")
    print(f"Invalid entries: {len(invalid)}; source/context mismatches: {len(mismatches)}")
    if invalid or mismatches:raise SystemExit(1)
if __name__=='__main__':main()
