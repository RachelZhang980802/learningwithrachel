"""Turn selected PDF/PPTX teaching pages into positioned HTML text with source artwork.
Run with the Codex bundled Python and PyMuPDF installed in PYTHONPATH. PPTX sources
are converted to PDF by LibreOffice in a temporary directory before this script.
"""
from pathlib import Path
import base64, hashlib, html, json, re, sys
import pymupdf
from lxml import etree

project=Path(__file__).resolve().parents[1]
source_paths={
 4:Path('/Users/rachel/Downloads/cwnu课程课件/narrative writing/课件/Unit 4/Unit 4-Narrative Writing-Truth and Interpretation.pdf'),
 5:Path('/private/tmp/native-units/sources/Unit 5-Narrative Writing-Dream and Faith.pdf'),
 6:Path('/private/tmp/native-units/sources/Unit 6-Narrative Writing-Conflict and Harmony.pdf'),
}
selected={4:list(range(2,57))+list(range(100,107)),5:list(range(2,19))+list(range(22,34))+list(range(161,176))+list(range(177,187)),6:list(range(2,20))+list(range(66,78))}
base=project/'public/narrative-course/theory/native';base.mkdir(parents=True,exist_ok=True)
assetdir=base/'assets';assetdir.mkdir(exist_ok=True)
imgpat=re.compile(r'data:image/([a-zA-Z0-9.+-]+);base64,\s*([^"\s]+(?:\s+[^"\s]+)*)',re.DOTALL)
results={};audits={};seen={}
image_text=json.loads((project/'app/unitTheoryImageText.json').read_text())
for unit in (4,5,6):
 doc=pymupdf.open(source_paths[unit]); pages={};counts={}; fonts={};empty=[]
 for number in selected[unit]:
  page=doc[number-1];width,height=page.rect.width,page.rect.height
  svg=page.get_svg_image(text_as_path=False)
  def save_image(m):
   mime,encoded=m.group(1),re.sub(r'\s+','',m.group(2))
   data=base64.b64decode(encoded);digest=hashlib.sha256(data).hexdigest()[:20]
   ext={'jpeg':'jpg','svg+xml':'svg'}.get(mime,mime);name=f'{digest}.{ext}'
   if name not in seen:(assetdir/name).write_bytes(data);seen[name]=len(data)
   return '/narrative-course/theory/native/assets/'+name
  svg=imgpat.sub(save_image,svg)
  root=etree.fromstring(svg.encode())
  ns={'s':'http://www.w3.org/2000/svg'}
  for node in root.xpath('.//s:text',namespaces=ns):node.getparent().remove(node)
  # The slide artwork is kept as vector paths and individual source images.
  svgname=f'unit-{unit}-page-{number:03d}.svg'
  (base/svgname).write_bytes(etree.tostring(root,encoding='utf-8',xml_declaration=True))
  text=[];chars=0
  for block in page.get_text('dict')['blocks']:
   if block['type']!=0:continue
   for line in block['lines']:
    for span in line['spans']:
     value=span['text']
     if not value.strip():continue
     chars+=len(value);box=span['bbox'];r,g,b=((span['color']>>16)&255,(span['color']>>8)&255,span['color']&255)
     weight=700 if ('Bold' in span['font'] or span['flags']&16) else 400
     italic='italic' if ('Italic' in span['font'] or span['flags']&2) else 'normal'
     family='Arial,sans-serif' if any(x in span['font'] for x in ['Arial','Sans','Carlito','Dekko','Ballpoint','Chalkduster','Itim']) else 'Georgia,"Times New Roman",serif'
     if 'FangSong' in span['font']:family='FangSong,Songti SC,serif'
     left,top,size=box[0],box[1],span['size']
     extra=''
     if unit==5 and number==3:
      if value=='Learning Objectives':top=20;size=32
      elif top>=60:top+=13
     if unit==6 and number==3 and value.strip()=='Learning Objectives':extra='transform:scaleX(.73);transform-origin:left top;'
     style=f'left:{left/width*100:.5f}%;top:{top/width*100:.5f}cqw;font-size:{size/width*100:.5f}cqw;font-weight:{weight};font-style:{italic};font-family:{family};color:rgb({r},{g},{b});{extra}'
     text.append(f'<span class="ut-native-text" style="{style}" lang="{"zh-CN" if any("\u4e00"<=c<="\u9fff" for c in value) else "en"}">{html.escape(value)}</span>')
  if not chars:empty.append(number)
  recovered=image_text.get(str(unit),{}).get(str(number),[]) if not chars else []
  recovered_markup='<div class="ut-native-image-text" aria-label="Text in the illustration">'+''.join(f'<p>{html.escape(line)}</p>' for line in recovered)+'</div>' if recovered else ''
  counts[str(number)]={'characters':chars,'spans':len(text)}
  pages[str(number)]=f'<div class="ut-native-scroll" tabindex="0" aria-label="Unit {unit}, page {number}"><div class="ut-native-slide" data-native-unit="{unit}" data-native-page="{number}" style="aspect-ratio:{width}/{height}"><object class="ut-native-art" type="image/svg+xml" data-src="/narrative-course/theory/native/{svgname}" aria-hidden="true" tabindex="-1"></object>{"".join(text)}</div>{recovered_markup}</div>'
 results[str(unit)]=pages;audits[str(unit)]={'source':str(source_paths[unit]),'pages':len(pages),'emptyTextPages':empty,'counts':counts}
 print(f'unit {unit}: {len(pages)} pages, {sum(v["characters"] for v in counts.values())} characters, {len(empty)} textless')
(project/'app/unitTheoryNativeSlides.json').write_text(json.dumps(results,ensure_ascii=False,separators=(',',':')))
(project/'docs/unit-theory-native-audit.json').write_text(json.dumps({'units':audits,'assets':len(seen),'totalAssetBytes':sum(seen.values())},ensure_ascii=False,indent=2))
