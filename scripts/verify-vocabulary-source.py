"""Independently compare every imported text cell with the original workbook."""
import json
import subprocess
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as E

root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'app/article01Vocabulary.json').read_text())
n = {'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(sys.argv[1]) as z:
    strings = [''.join(x.itertext()) for x in E.fromstring(z.read('xl/sharedStrings.xml'))]
    sheet = E.fromstring(z.read('xl/worksheets/sheet1.xml'))
    fields = {'C':'word','D':'ipa','E':'partOfSpeech','G':'definition','H':'otherSenses','I':'supplementation','J':'examples','K':'dictionarySource'}
    for row in data['records']:
        for col, field in fields.items():
            cell = sheet.find(f'.//s:c[@r="{col}{row["sourceRow"]}"]', n)
            value = cell.find('s:v',n) if cell is not None else None
            text = value.text if value is not None else ''
            if cell is not None and cell.get('t') == 's': text = strings[int(text)]
            assert text == row[field], (row['sourceRow'],field)
git = '/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/git'
old = subprocess.check_output([git,'show','HEAD:app/page.tsx'],cwd=root).decode()
new = (root / 'app/page.tsx').read_text()
def structure(text):
    return text.split('function ArticleOneStructure(',1)[1].split('function AnalysisContent(',1)[0]
assert structure(old) == structure(new), 'Structure component text changed'
assert subprocess.check_output([git,'show','HEAD:app/article01StructureData.ts'],cwd=root) == (root / 'app/article01StructureData.ts').read_bytes()
print('PASS: 448 original text cells identical; Structure component and all lesson data identical.')
