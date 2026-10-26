"""Convert the user's selected source slide pages into positioned, selectable HTML.

The PDF is a layout interchange format exported from the original PPTX. Text is
removed from the SVG artwork and rebuilt with the PDF's embedded fonts. Source
pages that contain only raster text use local Vision OCR plus a text-free artwork
layer; these pages remain explicitly marked in the conversion audit.

Usage: python convert-unit-decks.py PROJECT SOURCES_JSON SELECTED_JSON [OCR_JSON]
Requires PyMuPDF, fontTools, brotli, Pillow; cv2 only for image-only source pages.
"""
from pathlib import Path
from io import BytesIO
import base64, hashlib, html, json, math, re, sys, tempfile
import pymupdf
from lxml import etree as E
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools import t1Lib, agl
from fontTools.cffLib import CFFFontSet

PROJECT=Path(sys.argv[1]); SOURCES=json.loads(Path(sys.argv[2]).read_text()); SELECTED=json.loads(Path(sys.argv[3]).read_text())
OCR=json.loads(Path(sys.argv[4]).read_text()) if len(sys.argv)>4 else {}
OUT=PROJECT/'public/narrative-course/decks';OUT.mkdir(parents=True,exist_ok=True)
ASSETS=OUT/'assets';ASSETS.mkdir(exist_ok=True);FONTS=OUT/'fonts';FONTS.mkdir(exist_ok=True)
URL='/narrative-course/decks/'
NS={'s':'http://www.w3.org/2000/svg'}
fontcss=[];fontcache={};assetcache=set();audit={};texts_all={}
imgpat=re.compile(r'data:image/([a-zA-Z0-9.+-]+);base64,\s*([^"\s]+(?:\s+[^"\s]+)*)',re.DOTALL)
def esc(x):return html.escape(str(x),quote=True)
def normfont(x):return re.sub('[^a-z0-9]','',x.split('+')[-1].lower())
def uni_cmap(doc,xref):
 typ,v=doc.xref_get_key(xref,'ToUnicode')
 if typ!='xref':return {}
 raw=doc.xref_stream(int(v.split()[0])).decode('latin1');result={}
 for block in re.findall(r'beginbfchar(.*?)endbfchar',raw,re.S):
  for a,b in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>',block):
   try:result[int(a,16)]=bytes.fromhex(b).decode('utf-16-be')
   except Exception:pass
 for block in re.findall(r'beginbfrange(.*?)endbfrange',raw,re.S):
  for a,b,c in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>',block):
   for offset,code in enumerate(range(int(a,16),int(b,16)+1)):
    try:result[code]=chr(int(c,16)+offset)
    except Exception:pass
  for a,b,c in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[([^\]]+)\]',block):
   for code,value in zip(range(int(a,16),int(b,16)+1),re.findall(r'<([0-9A-Fa-f]+)>',c)):
    try:result[code]=bytes.fromhex(value).decode('utf-16-be')
    except Exception:pass
 return result

def prepare_font(doc,font):
 xref,ext,kind,base,*_=font
 key=(doc.name,xref)
 if key in fontcache:return fontcache[key]
 name,ext,_,data=doc.extract_font(xref)
 if not data:fontcache[key]=None;return None
 digest=hashlib.sha256(data+str(uni_cmap(doc,xref)).encode()).hexdigest()[:16];alias='DeckFont'+digest
 uni=uni_cmap(doc,xref)
 try:
  if ext in ('pfa','pfb','cff'):
   if ext=='cff':
    cff=CFFFontSet();cff.decompile(BytesIO(data),TTFont());top=cff[cff.fontNames[0]];order=top.charset;gs=top.CharStrings
    encoding=getattr(top,'Encoding',[]);encoding=encoding if isinstance(encoding,list) else order
    cidmap={int(g[3:]):g for g in order if g.startswith('cid') and g[3:].isdigit()}
   else:
    tmp=Path('/private/tmp')/('deck-font-'+digest+'.'+ext);tmp.write_bytes(data);t=t1Lib.T1Font(str(tmp));gs=t.getGlyphSet();order=list(gs);encoding=t['Encoding'];cidmap={}
   cmap={}
   for code,value in uni.items():
    glyph=cidmap.get(code) or (encoding[code] if code<len(encoding) else '.notdef')
    if len(value)==1 and glyph in gs and glyph!='.notdef':cmap[ord(value)]=glyph
   if not cmap:
    for glyph in order:
     value=agl.toUnicode(glyph)
     if len(value)==1:cmap[ord(value)]=glyph
   charstrings={};metrics={}
   for glyph in order:
    pen=T2CharStringPen(0,gs);gs[glyph].draw(pen);width=getattr(gs[glyph],'width',0);pen._width=width
    charstrings[glyph]=pen.getCharString(private=None,globalSubrs=None);metrics[glyph]=(round(width),0)
   fb=FontBuilder(1000,isTTF=False);fb.setupGlyphOrder(order);fb.setupCharacterMap(cmap)
   fb.setupCFF(alias,{'FullName':alias,'FamilyName':alias,'Weight':'Regular'},charstrings,{})
   fb.setupHorizontalMetrics(metrics);fb.setupHorizontalHeader(ascent=1000,descent=0)
   fb.setupNameTable({'familyName':alias,'styleName':'Regular','uniqueFontIdentifier':alias,'fullName':alias,'psName':alias})
   fb.setupOS2(sTypoAscender=1000,sTypoDescender=0,usWinAscent=1000,usWinDescent=0);fb.setupPost();tt=fb.font
  else:
   tt=TTFont(BytesIO(data));best=tt.getBestCmap() or {};order=tt.getGlyphOrder();source={}
   for table in tt['cmap'].tables:source.update(table.cmap)
   cmap=dict(best)
   if not uni and not cmap:
    for code,glyph in source.items():
     value=agl.toUnicode(glyph)
     if len(value)!=1 and code<256:
      try:value=bytes([code]).decode('mac_roman')
      except Exception:value=''
     if len(value)==1:cmap[ord(value)]=glyph
   # Simple PDF subsets often have only a Macintosh encoded cmap. Repair it
   # from ToUnicode so the exact source glyphs can render normal HTML strings.
   gidmap=None
   typ,v=doc.xref_get_key(xref,'DescendantFonts')
   if typ=='array':
    m=re.search(r'(\d+) 0 R',v)
    if m:
     gt,gv=doc.xref_get_key(int(m.group(1)),'CIDToGIDMap')
     if gt=='xref':gidmap=doc.xref_stream(int(gv.split()[0]))
   for code,value in uni.items():
    if len(value)!=1:continue
    if gidmap is not None:
     start=code*2;idx=int.from_bytes(gidmap[start:start+2],'big');glyph=order[idx] if idx<len(order) else None
    else:glyph=best.get(ord(value)) or source.get(code) or (order[code] if code<len(order) else None)
    if glyph and glyph!='.notdef':cmap[ord(value)]=glyph
   cmap={c:g for c,g in cmap.items() if g in tt['hmtx'].metrics}
   cm=newTable('cmap');cm.tableVersion=0;tab=CmapSubtable.newSubtable(12);tab.platformID=3;tab.platEncID=10;tab.language=0;tab.cmap=cmap;cm.tables=[tab];tt['cmap']=cm
  units=tt['head'].unitsPerEm
  if 'name' not in tt:tt['name']=newTable('name');tt['name'].names=[]
  for nameid,value in [(1,alias),(2,'Regular'),(4,alias),(6,alias)]:tt['name'].setName(value,nameid,3,1,0x409)
  # Fixed line metrics make the HTML baseline equal to the PDF baseline.
  tt['hhea'].ascent=units;tt['hhea'].descent=0;tt['hhea'].lineGap=0
  if 'OS/2' in tt:
   tt['OS/2'].sTypoAscender=units;tt['OS/2'].sTypoDescender=0;tt['OS/2'].sTypoLineGap=0;tt['OS/2'].usWinAscent=units;tt['OS/2'].usWinDescent=0
  cmap=tt.getBestCmap() or {};widths={c:tt['hmtx'][g][0]/units for c,g in cmap.items()}
  filename=digest+'.woff2';tt.flavor='woff2';tt.save(FONTS/filename)
  fontcss.append(f'@font-face{{font-family:"{alias}";src:url("{URL}fonts/{filename}") format("woff2");font-weight:400;font-style:normal;font-display:block;ascent-override:100%;descent-override:0%;line-gap-override:0%;}}')
  item={'alias':alias,'name':normfont(base),'chars':set(cmap),'widths':widths};fontcache[key]=item;return item
 except Exception as e:
  print('FONT FAILURE',base,ext,str(e),flush=True);fontcache[key]=None;return None

def save_image(m):
 mime,encoded=m.group(1),re.sub(r'\s+','',m.group(2));data=base64.b64decode(encoded);digest=hashlib.sha256(data).hexdigest()[:20]
 ext={'jpeg':'jpg','svg+xml':'svg'}.get(mime,mime);name=digest+'.'+ext
 if name not in assetcache:(ASSETS/name).write_bytes(data);assetcache.add(name)
 return URL+'assets/'+name

def render_page(doc,unit,number):
 page=doc[number-1];w,h=page.rect.width,page.rect.height;raw=page.get_text('dict',flags=0);texts=[];markup=[];styles=[]
 fonts=[v for f in page.get_fonts() if (v:=prepare_font(doc,f))]
 svg=page.get_svg_image(text_as_path=False);svg=imgpat.sub(save_image,svg);root=E.fromstring(svg.encode())
 for node in root.xpath('.//s:text',namespaces=NS):node.getparent().remove(node)
 filename=f'unit-{unit}-page-{number:03d}.svg';(OUT/filename).write_bytes(E.tostring(root,encoding='utf-8',xml_declaration=True))
 for bi,block in enumerate(raw['blocks']):
  if block['type']!=0:continue
  value='\n'.join(''.join(s['text'] for s in l['spans']) for l in block['lines']).strip()
  if not value:continue
  if unit==5 and number in (169,170):value=value.replace('Understatemen','Understatement') if 'Understatement' not in value else value
  if unit==1 and number==156:value=value.replace('\ufffd','').replace('Tha t','That')
  tid=f'u{unit}-p{number}-b{bi}';bx,by,bx1,by1=block['bbox'];runs=[]
  for line in block['lines']:
   angle=math.degrees(math.atan2(line['dir'][1],line['dir'][0]))
   for span in line['spans']:
    text=span['text']
    if unit==5 and number in (169,170):text=text.replace('Understatemen','Understatement') if 'Understatement' not in text else text
    if unit==1 and number==156:text=text.replace('\ufffd','').replace('Tha t','That')
    if not text:continue
    candidates=[f for f in fonts if f['name']==normfont(span['font'])]
    chars=set(map(ord,text));candidates.sort(key=lambda f:len(chars&f['chars']),reverse=True)
    candidates=candidates or fonts
    primary=candidates[0] if candidates else None
    family=','.join('"'+f['alias']+'"' for f in candidates)+(',serif' if candidates else 'serif')
    ox,oy=span['origin'];size=span['size'];original_size=size;color=f'#{span["color"]:06x}';scale=1
    if unit==5 and number==3 and text.strip()=='Learning Objectives':oy-=17;size*=.9
    if oy-size<0:oy=size+h*.012
    if ox<0:ox=w*.012
    if primary and abs(angle)<.01:
     natural=sum(next((f['widths'][ord(c)] for f in candidates if ord(c) in f['widths']),1 if '\u4e00'<=c<='\u9fff' else .5) for c in text)*size
     width=(span['bbox'][2]-span['bbox'][0])*(size/original_size)
     width=min(width,max(w*.01,w*.985-ox))
     if natural>0:scale=width/natural
    st=f'left:{(ox-bx)/w*100:.6f}cqw;top:{(oy-by-size)/w*100:.6f}cqw;font-size:{size/w*100:.6f}cqw;font-family:{family};color:{color};opacity:{span.get("alpha",255)/255:.4f};'
    st+=f'transform-origin:0 100%;transform:rotate({angle:.6f}deg) scaleX({scale:.6f});'
    runs.append(f'<span class="ud-source-run" style="{esc(st)}">{esc(text)}</span>')
  extra=''
  markup.append(f'<div class="ud-source-text" data-deck-text-id="{tid}" tabindex="0" role="button" aria-label="{esc(value)}" style="left:{bx/w*100:.6f}%;top:{by/w*100:.6f}cqw;width:{(bx1-bx)/w*100:.6f}cqw;height:{(by1-by)/w*100:.6f}cqw;{extra}">{"".join(runs)}</div>')
  texts.append({'id':tid,'text':value,'x':bx,'y':by,'width':bx1-bx,'height':by1-by,'bbox':list(block['bbox'])})
 recovered=False
 if not texts and OCR.get(f'u{unit}-p{number}.png'):
  recovered=True
  import cv2,numpy as np
  image=cv2.imread(f'/private/tmp/unit-deck-ocr/u{unit}-p{number}.png');ih,iw=image.shape[:2];mask=np.zeros((ih,iw),np.uint8)
  for i,line in enumerate(OCR[f'u{unit}-p{number}.png']):
   text=line['text'].strip()
   if not text:continue
   x,y,bw,bh=[line[k] for k in ('x','y','width','height')];x0=max(0,int(x*iw)-2);x1=min(iw,int((x+bw)*iw)+2);y0=max(0,int(y*ih)-2);y1=min(ih,int((y+bh)*ih)+2)
   crop=image[y0:y1,x0:x1];gray=cv2.cvtColor(crop,cv2.COLOR_BGR2GRAY);threshold=max(50,min(235,float(np.percentile(gray,80))-25));ink=gray<threshold
   if ink.sum()>3:color=np.median(crop[ink],axis=0).astype(int);color=f'#{color[2]:02x}{color[1]:02x}{color[0]:02x}'
   else:color='#202020'
   mask[y0:y1,x0:x1]=cv2.dilate((ink*255).astype(np.uint8),np.ones((3,3),np.uint8))
   tid=f'u{unit}-p{number}-ocr{i}';fs=bh*h*.88
   st=f'left:{x*100:.5f}%;top:{y*h/w*100:.5f}cqw;width:{bw*100:.5f}%;height:{bh*h/w*100:.5f}cqw;font-size:{fs/w*100:.5f}cqw;color:{color};'
   markup.append(f'<div class="ud-source-text ud-source-ocr" data-deck-text-id="{tid}" data-source-width="{bw*w:.5f}" role="button" tabindex="0" style="{st}"><span>{esc(text)}</span></div>')
   texts.append({'id':tid,'text':text,'x':x*w,'y':y*h,'width':bw*w,'height':bh*h,'bbox':[x*w,y*h,(x+bw)*w,(y+bh)*h],'recovered':True})
  repaired=cv2.inpaint(image,mask,3,cv2.INPAINT_TELEA);filename=f'unit-{unit}-page-{number:03d}-art.webp';cv2.imwrite(str(OUT/filename),repaired,[cv2.IMWRITE_WEBP_QUALITY,94])
 return {'page':number,'width':w,'height':h,'art':URL+filename,'html':''.join(markup),'texts':texts,'recoveredFromImage':recovered}

manifest={}
for unit,source in SOURCES.items():
 doc=pymupdf.open(source['pdf']);pages=[]
 for number in SELECTED[unit]:
  pages.append(render_page(doc,int(unit),number));print('converted',unit,number,flush=True)
 sourcepath=Path(source['pptx'] or source['pdf']);title=sourcepath.stem.split('-')[-1]
 result={'unit':int(unit),'title':title,'source':sourcepath.name,'sourceKind':'pptx' if source['pptx'] else 'pdf','width':doc[0].rect.width,'height':doc[0].rect.height,'pages':pages}
 (OUT/f'unit-{unit}.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
 manifest[unit]={k:v for k,v in result.items() if k!='pages'};manifest[unit].update(pageCount=len(pages),dataUrl=URL+f'unit-{unit}.json',sourcePages=SELECTED[unit])
 audit[unit]={'source':str(sourcepath),'layoutSource':source['pdf'],'sourcePageCount':len(doc),'selectedPages':SELECTED[unit],'recoveredImagePages':[p['page'] for p in pages if p['recoveredFromImage']],'textlessPages':[p['page'] for p in pages if not p['texts']],'textBlocks':sum(len(p['texts']) for p in pages)}
 texts_all[unit]={'pages':[{'page':p['page'],'texts':p['texts']} for p in pages]}
(OUT/'fonts.css').write_text('\n'.join(dict.fromkeys(fontcss)))
(PROJECT/'app/unitDeckSources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(PROJECT/'docs/unit-deck-conversion-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
Path('/private/tmp/unit-deck-selected-texts.json').write_text(json.dumps(texts_all,ensure_ascii=False))
print(json.dumps({'pages':sum(v['pageCount'] for v in manifest.values()),'fonts':len(fontcss),'assets':len(assetcache)}),flush=True)
