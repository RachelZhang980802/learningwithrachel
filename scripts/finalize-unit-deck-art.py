"""Apply reviewed source-art and OCR corrections after deck conversion.

These are page-specific repairs, tied to inspected source rectangles rather than
heuristic deletion of slide graphics. Run after recover-unit-deck-image-text.py.
"""
from pathlib import Path
import json,sys,re,hashlib,html
import pymupdf,cv2,numpy as np
from lxml import html as LH,etree as ET
P=Path(sys.argv[1]);OUT=P/'public/narrative-course/decks';URL='/narrative-course/decks/'
S=json.loads(Path('/private/tmp/unit-deck-source-paths.json').read_text());docs={};data={str(u):json.loads((OUT/f'unit-{u}.json').read_text()) for u in range(1,7)}
def page(u,n):return next(p for p in data[str(u)]['pages'] if p['page']==n)
def saveart(u,n,image):
 p=page(u,n);path=OUT/f'unit-{u}-page-{n:03d}-mixed.webp';cv2.imwrite(str(path),image,[cv2.IMWRITE_WEBP_QUALITY,96]);p['art']=URL+path.name

def replace_text(tid,new):
 u,n=map(int,re.match(r'u(\d+)-p(\d+)',tid).groups());p=page(u,n);t=next((t for t in p['texts'] if t['id']==tid),None)
 if not t:return
 t['text']=new;root=LH.fragment_fromstring(p['html'],create_parent=True);els=root.xpath(f'.//*[@data-deck-text-id="{tid}"]')
 if not els:return
 el=els[0];el.set('aria-label',new);span=el[0] if len(el) else el
 # Book artwork retains its source pixels; the text label is only its precise
 # interactive transcription. Visible OCR lines keep one source-fitted line.
 style=span.get('style','')
 if t.get('artLabel') and 'color:transparent' not in style:style+='color:transparent;'
 if not t.get('artLabel'):style+='color:#222222;'
 for ch in list(span):span.remove(ch)
 span.text=new;span.set('style',style);p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root)

repairs=json.loads(Path('/private/tmp/unit14-source-mismatch-repairs.json').read_text())
for tid,repair in repairs.items():
 text=repair['previous']
 if tid=='u4-p103-img8':text='surface elements without explicitly'
 if tid=='u3-p34-img10':text='Use Sensory Detail to Bring Setting to'
 replace_text(tid,text)
for tid,tx in {
'u5-p168-ocr4':'Boreas and','u5-p168-ocr5':'bluecoats, seemed to','u5-p168-ocr17':'补充：',
'u6-p15-ocr6':'made','u6-p15-ocr15':'supernatural',
'u6-p17-ocr2':'There are 7 types','u6-p17-ocr4':'INTERNAL VS',
}.items():
 t=next((t for t in page(*map(int,re.match(r'u(\d+)-p(\d+)',tid).groups()))['texts'] if t['id']==tid),None)
 if not t:continue
 if tid=='u6-p15-ocr6':tx=t['text'].replace('maae','made')
 if tid=='u6-p15-ocr15':tx=t['text'].replace('supematural','supernatural')
 replace_text(tid,tx)
t=next(t for t in page(6,17)['texts'] if t['id']=='u6-p17-ocr8');replace_text(t['id'],t['text'].replace('compeling','compelling'))

# Clear the interiors of the original white writing papers only; preserve
# frames, source paper edges, illustrations, and exercise ruling.
for n,rect in [(172,(714,136,1303,714)),(178,(76,167,1363,765)),(179,(76,165,1363,765))]:
 p=page(5,n);im=cv2.imread(str(P/'public'/p['art'].lstrip('/')));h,w=im.shape[:2];x0,y0,x1,y1=rect;cv2.rectangle(im,(round(x0*w/1440),round(y0*h/810)),(round(x1*w/1440),round(y1*h/810)),(255,255,255),-1);saveart(5,n,im)
p=page(5,180);im=cv2.imread(str(P/'public'/p['art'].lstrip('/')));h,w=im.shape[:2]
for t in p['texts']:
 if '-img' not in t['id']:continue
 x0,y0,x1,y1=t['bbox'];cv2.rectangle(im,(int(x0/p['width']*w)-3,int(y0/p['height']*h)-3),(int(x1/p['width']*w)+3,int(y1/p['height']*h)+3),(255,255,255),-1)
saveart(5,180,im)

# The two longest exercise lines originally shared a bitmap with the answer.
# Their answer has become a separate native node: retain only the prompt width.
p=page(5,178);root=LH.fragment_fromstring(p['html'],create_parent=True)
for ident,width in [('u5-p178-img6',486.0),('u5-p178-img7',398.0)]:
 t=next(t for t in p['texts'] if t['id']==ident);old=t['width'];t['width']=width;t['bbox'][2]=t['x']+width
 el=root.xpath(f'.//*[@data-deck-text-id="{ident}"]')[0];el.set('style',re.sub(r'width:[^;]+',f'width:{width/p["width"]*100}cqw',el.get('style','')))
 sp=el[0];style=sp.get('style','');m=re.search(r'scaleX\(([-\d.]+)\)',style)
 if m:style=style[:m.start()]+f'scaleX({float(m.group(1))*width/old})'+style[m.end():];sp.set('style',style)
p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root)

# A source photograph had already been covered by the source text screenshot.
# Preserve the unobscured photo and put its complete description in the paper.
p=page(2,16);doc=pymupdf.open(S['2']['pdf']);temp=pymupdf.open();temp.insert_pdf(doc,from_page=2,to_page=2);clean=temp[0]
for b in clean.get_text('dict')['blocks']:
 if b['type']==0:clean.add_redact_annot(b['bbox'],fill=False,cross_out=False)
clean.apply_redactions(images=0,graphics=0,text=0);pix=clean.get_pixmap(matrix=pymupdf.Matrix(2,2));base=cv2.cvtColor(np.frombuffer(pix.samples,np.uint8).reshape(pix.height,pix.width,3),cv2.COLOR_RGB2BGR)
original=cv2.imread('/private/tmp/unit-deck-full-ocr/u2-p16.png');base[:227,:865]=original[:227,:865]
saveart(2,16,base)
def add_manual(p,tid,tx,x,y,w,h,fs,bold=False):
 p['html']+=f'<div class="ud-source-text ud-image-text" data-deck-text-id="{tid}" role="button" tabindex="0" aria-label="{html.escape(tx,quote=True)}" style="left:{x*100}%;top:{y*p["height"]/p["width"]*100}cqw;width:{w*100}cqw;height:{h*p["height"]/p["width"]*100}cqw"><span class="ud-image-word" style="position:static;display:block;white-space:normal;font-family:Arial,sans-serif;font-size:{fs}cqw;font-weight:{700 if bold else 400};line-height:1.25;color:#222">{html.escape(tx)}</span></div>'
 p['texts'].append({'id':tid,'text':tx,'x':x*p['width'],'y':y*p['height'],'width':w*p['width'],'height':h*p['height'],'bbox':[x*p['width'],y*p['height'],(x+w)*p['width'],(y+h)*p['height']],'recovered':True})
definition=' '.join(t['text'] for t in p['texts'] if '-ocr' in t['id'] and t['id']!='u2-p16-ocr0')
p['html']='';p['texts']=[];add_manual(p,'u2-p16-img-title','Sirius Black',.055,.33,.89,.09,4.2,True);add_manual(p,'u2-p16-img-definition',definition,.055,.445,.89,.46,2.08)

# The equation is art made of three circles. Lift only the words in its three
# circles; leave the drawn plus/equality signs and circle artwork intact.
p=page(6,19);im=cv2.imread(str(P/'public'/p['art'].lstrip('/')));h,w=im.shape[:2];mask=np.zeros((h,w),np.uint8)
for x0,y0,x1,y1 in [(.14,.51,.20,.57),(.295,.50,.405,.575),(.48,.51,.58,.57)]:
 a,b,c,d=int(x0*w),int(y0*h),int(x1*w),int(y1*h);crop=im[b:d,a:c];gray=cv2.cvtColor(crop,cv2.COLOR_BGR2GRAY);ink=gray>195;mask[b:d,a:c]=cv2.dilate(ink.astype(np.uint8)*255,np.ones((3,3),np.uint8))
im=cv2.inpaint(im,mask,4,cv2.INPAINT_TELEA);saveart(6,19,im)
root=LH.fragment_fromstring(p['html'],create_parent=True)
for ident in ['u6-p19-img2','u6-p19-img4','u6-p19-img18']:
 for el in root.xpath(f'.//*[@data-deck-text-id="{ident}"]'):el.getparent().remove(el)
p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root);p['texts']=[t for t in p['texts'] if t['id'] not in ['u6-p19-img2','u6-p19-img4','u6-p19-img18']]
for tid,tx,x,width in [('u6-p19-img2','GOAL',.144,.055),('u6-p19-img4','COMPLICATION',.298,.108),('u6-p19-img18','CONFLICT',.488,.077)]:
 add_manual(p,tid,tx,x,.527,width,.045,.97,False);p['html']=p['html'].replace('color:#222">'+tx,'color:white">'+tx)

# Selected Chinese paragraphs were reflowed for readability; remove just their
# old yellow bands, not heading highlights or other slide decoration.
for n in (31,32,34):
 p=page(4,n);doc=pymupdf.open(S['4']['pdf']);src=doc[n-1];im=cv2.imread(str(P/'public'/p['art'].lstrip('/')));h,w=im.shape[:2];mask=np.zeros((h,w),np.uint8)
 for d in src.get_drawings():
  fill=d.get('fill');b=d['rect']
  if not(fill and fill[0]>.8 and fill[1]>.8 and fill[2]<.3):continue
  if n==31 and b.y0<250:continue
  a,c=int(b.x0/src.rect.width*w)-1,int(b.x1/src.rect.width*w)+2;b0,d0=int(b.y0/src.rect.height*h)-1,int(b.y1/src.rect.height*h)+2;mask[max(0,b0):min(h,d0),max(0,a):min(w,c)]=255
 im=cv2.inpaint(im,mask,8,cv2.INPAINT_TELEA);saveart(4,n,im)

# Shift only the original pen/book vector group down, retaining the adjacent
# cyan highlights at their text coordinates.
svg=OUT/'unit-2-page-002.svg';tree=ET.parse(str(svg));ns={'s':'http://www.w3.org/2000/svg'}
for node in tree.xpath('.//s:g[@clip-path="url(#clip_3)"]/s:path[not(@fill)]',namespaces=ns):
 tr=node.get('transform','')
 if not tr.startswith('translate'):node.set('transform','translate(0,23) '+tr)
svg.write_bytes(ET.tostring(tree,encoding='utf-8',xml_declaration=True))

for u,j in data.items():(OUT/f'unit-{u}.json').write_text(json.dumps(j,ensure_ascii=False,separators=(',',':')))
manifest=json.loads((P/'app/unitDeckSources.json').read_text())
for u,m in manifest.items():
 digest=hashlib.sha256((OUT/f'unit-{u}.json').read_bytes())
 for p in data[u]['pages']:digest.update((P/'public'/p['art'].lstrip('/')).read_bytes())
 m['version']=digest.hexdigest()[:12]+'-art6'
(P/'app/unitDeckSources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
Path('/private/tmp/unit-deck-selected-texts.json').write_text(json.dumps({u:{'pages':[{'page':p['page'],'texts':p['texts']} for p in j['pages']]} for u,j in data.items()},ensure_ascii=False))
print('final source/art review complete: art6')
