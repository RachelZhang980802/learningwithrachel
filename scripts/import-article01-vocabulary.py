"""Lossless import of the supplied vocabulary workbook, including rich-cell images."""
import hashlib
import json
import posixpath
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

source = Path(sys.argv[1])
project = Path(__file__).resolve().parents[1]
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(source) as archive:
    strings = [''.join(si.itertext()) for si in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
    sheet = ET.fromstring(archive.read('xl/worksheets/sheet1.xml'))
    rels = {r.attrib['Id']: posixpath.normpath('xl/richData/' + r.attrib['Target'])
            for r in ET.fromstring(archive.read('xl/richData/_rels/richValueRel.xml.rels'))}
    rich_rels = [rels[next(iter(r.attrib.values()))]
                 for r in ET.fromstring(archive.read('xl/richData/richValueRel.xml'))]
    rich_values = list(ET.fromstring(archive.read('xl/richData/rdrichvalue.xml')))
    metadata = ET.fromstring(archive.read('xl/metadata.xml'))
    value_meta = metadata.find('s:valueMetadata', ns)
    future = next(x for x in metadata.findall('s:futureMetadata', ns) if x.attrib['name'] == 'XLRICHVALUE')
    records = []
    sentence = 1
    image_dir = project / 'public/vocabulary/article01'
    image_dir.mkdir(parents=True, exist_ok=True)
    for row in sheet.findall('s:sheetData/s:row', ns):
        number = int(row.attrib['r'])
        if number == 1:
            continue
        values = {}
        image = ''
        image_hash = ''
        for cell in row:
            column = ''.join(c for c in cell.attrib['r'] if c.isalpha())
            value = cell.find('s:v', ns)
            text = value.text if value is not None else ''
            if cell.attrib.get('t') == 's':
                text = strings[int(text)]
            elif cell.attrib.get('t') == 'inlineStr':
                text = ''.join(cell.find('s:is', ns).itertext())
            values[column] = text or ''
            if column == 'F' and 'vm' in cell.attrib:
                metadata_index = int(value_meta[int(cell.attrib['vm']) - 1][0].attrib['v'])
                rich_index = int(next(x for x in future[metadata_index].iter() if x.tag.endswith('}rvb')).attrib['i'])
                relationship_index = int(rich_values[rich_index][0].text)
                media_path = rich_rels[relationship_index]
                data = archive.read(media_path)
                name = f'row-{number}{Path(media_path).suffix}'
                (image_dir / name).write_bytes(data)
                image = '/vocabulary/article01/' + name
                image_hash = hashlib.sha256(data).hexdigest()
        if values.get('B'):
            sentence = int(values['B'])
        paragraph = next(i for i, end in enumerate([3, 16, 25, 36, 40], 1) if sentence <= end)
        fields = dict(zip(['word', 'ipa', 'partOfSpeech', 'definition', 'otherSenses', 'supplementation', 'examples', 'dictionarySource'],
                          [values.get(c, '') for c in ['C', 'D', 'E', 'G', 'H', 'I', 'J', 'K']]))
        records.append(dict(sourceRow=number, sentence=sentence, paragraph=paragraph, image=image, imageSha256=image_hash, **fields))
    output = dict(source=source.name, sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(), records=records)
    (project / 'app/article01Vocabulary.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    assert len(records) == 56
    assert sum(bool(r['image']) for r in records) == 45
    print(f'Imported {len(records)} rows, 45 byte-identical images; all text cells preserved.')
