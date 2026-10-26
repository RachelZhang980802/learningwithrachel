from pathlib import Path
import json,re,hashlib
import cv2
from lxml import html as LH
P=Path('/Users/rachel/Downloads/网页设计/learningwithrachel');O=P/'public/narrative-course/decks';M=json.loads((P/'app/unitDeckSources.json').read_text())
for u in (1,5):
 j=json.loads((O/f'unit-{u}.json').read_text())
 if u==1:
  p=next(p for p in j['pages'] if p['page']==156);tree=LH.fragment_fromstring(p['html'],create_parent=True);el=tree.xpath('.//*[@data-deck-text-id="u1-p156-b2"]')[0];el[1].text='into the Scene That';el[3].text=' you’ve ';p['html']=''.join(LH.tostring(el,encoding='unicode') for el in tree)
 else:
  p=next(p for p in j['pages'] if p['page']==168);im=cv2.imread(str(P/'public'/p['art'].lstrip('/')))
  for x0,y0,x1,y1 in [(24,176,425,211),(24,221,363,255)]:cv2.rectangle(im,(x0,y0),(x1,y1),(248,245,240),-1)
  cv2.imwrite(str(P/'public'/p['art'].lstrip('/')),im,[cv2.IMWRITE_WEBP_QUALITY,96]);tree=LH.fragment_fromstring(p['html'],create_parent=True)
  for tid,term,after in [('u5-p168-ocr4','Boreas [古希腊神话中北风之神]',' and'),('u5-p168-ocr5','bluecoats [指蓝制服警察],',' seemed to')]:
   t=next(t for t in p['texts'] if t['id']==tid);t['text']=term+after;el=tree.xpath(f'.//*[@data-deck-text-id="{tid}"]')[0];el.set('aria-label',t['text']);sp=el[0]
   for child in list(sp):sp.remove(child)
   sp.text='';sp.set('style','position:static;white-space:pre;font-family:Arial,"PingFang SC",sans-serif;font-size:1.67cqw;transform:none;color:#222!important;')
   m=LH.Element('mark');m.set('style','background:#111;color:#fff!important;');m.text=term;sp.append(m);a=LH.Element('span');a.set('style','color:#222!important');a.text=after;sp.append(a)
  p['html']=''.join(LH.tostring(el,encoding='unicode') for el in tree)
 (O/f'unit-{u}.json').write_text(json.dumps(j,ensure_ascii=False,separators=(',',':')))
for u,m in M.items():
 digest=hashlib.sha256((O/f'unit-{u}.json').read_bytes());j=json.loads((O/f'unit-{u}.json').read_text())
 for p in j['pages']:digest.update((P/'public'/p['art'].lstrip('/')).read_bytes())
 m['version']=digest.hexdigest()[:12]+'-final8'
(P/'app/unitDeckSources.json').write_text(json.dumps(M,ensure_ascii=False,indent=2))
