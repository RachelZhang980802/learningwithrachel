"""Final, inspected text-panel cleanup; keeps every frame and illustration."""
from pathlib import Path
import json,re,sys,html,hashlib
import cv2,numpy as np
from lxml import html as LH
P=Path(sys.argv[1]);O=P/'public/narrative-course/decks';URL='/narrative-course/decks/'
D={str(u):json.loads((O/f'unit-{u}.json').read_text()) for u in range(1,7)}
def page(u,n):return next(p for p in D[str(u)]['pages'] if p['page']==n)
def image(u,n):return cv2.imread(str(P/'public'/page(u,n)['art'].lstrip('/')))
def save(u,n,im):
 p=page(u,n);path=O/f'unit-{u}-page-{n:03d}-mixed.webp';cv2.imwrite(str(path),im,[cv2.IMWRITE_WEBP_QUALITY,96]);p['art']=URL+path.name

def solid(u,n,rect,color=None):
 im=image(u,n);src=cv2.imread(f'/private/tmp/unit-deck-full-ocr/u{u}-p{n}.png');H,W=im.shape[:2];x0,y0,x1,y1=rect
 if color is None:
  patch=src[y0:y1,x0:x1];flat=patch.reshape(-1,3);grey=cv2.cvtColor(patch,cv2.COLOR_BGR2GRAY).ravel();color=np.median(flat[grey>np.percentile(grey,60)],axis=0).astype(int).tolist()
 cv2.rectangle(im,(round(x0*W/1440),round(y0*H/810)),(round(x1*W/1440)-1,round(y1*H/810)-1),color,-1);save(u,n,im)
solid(4,34,(572,218,1297,670),(255,255,255));solid(4,39,(0,23,1096,789));solid(4,104,(245,188,1284,742),(77,255,245));solid(4,105,(256,214,1191,714),(77,255,245))
src=cv2.imread('/private/tmp/unit-deck-full-ocr/u4-p101.png');gray=cv2.cvtColor(src,cv2.COLOR_BGR2GRAY);cs,_=cv2.findContours((gray<45).astype(np.uint8)*255,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
boxes=[cv2.boundingRect(c) for c in cs];box=max((b for b in boxes if b[2]>300 and b[3]>200),key=lambda b:b[2]*b[3]);x,y,w,h=box;solid(4,101,(x+17,y+17,x+w-17,y+h-17))
# Bubble fill is sampled from the actual source. Its external contour preserves
# the exact speech-bubble outline and tail while clearing former text/underlines.
boxes={50:[(138,157,503,500),(522,120,910,426),(929,181,1326,480)],51:[(18,51,437,441),(459,8,890,358),(900,61,1415,417)],52:[(144,65,507,407),(526,27,911,333),(930,89,1318,386)]}
for n,rects in boxes.items():
 src=cv2.imread(f'/private/tmp/unit-deck-full-ocr/u4-p{n}.png');im=image(4,n);h,w=im.shape[:2]
 for x0,y0,x1,y1 in rects:
  crop=src[y0:y1,x0:x1];b,g,r=cv2.split(crop);candidate=(b.astype(int)-r.astype(int)>18)&(b>150)&(g>130)&(r>120)
  color=np.median(crop[candidate],axis=0).astype(int);dist=np.max(abs(crop.astype(int)-color),axis=2);mask=(dist<32).astype(np.uint8)*255
  contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);contour=max(contours,key=cv2.contourArea).astype(np.float64);contour[:,:,0]=(contour[:,:,0]+x0)*w/1440;contour[:,:,1]=(contour[:,:,1]+y0)*h/810
  cv2.fillPoly(im,[contour.astype(np.int32)],color.tolist())
 save(4,n,im)
solid(6,11,(978,446,1364,810),(0,0,0));p=page(6,11);root=LH.fragment_fromstring(p['html'],create_parent=True)
for el in root.xpath('.//*[@data-deck-text-id]'):
 tid=el.get('data-deck-text-id');m=re.match(r'u6-p11-img(\d+)$',tid)
 if m and 21<=int(m.group(1))<=28:
  for sp in el.iter('span'):sp.set('style',sp.get('style','')+';color:#fff!important;')
p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root)
# Preserve Sirius's full original visible photograph, with clean source white
# text panels and a normal flowing paragraph inside that existing panel.
p=page(2,16);im=cv2.imread('/private/tmp/unit-deck-full-ocr/u2-p16.png');cv2.rectangle(im,(391,227),(1394,810),(255,255,255),-1);cv2.rectangle(im,(0,346),(390,499),(255,255,255),-1);save(2,16,im)
title=next(t for t in p['texts'] if t['id']=='u2-p16-img-title');body=next(t for t in p['texts'] if t['id']=='u2-p16-img-definition');root=LH.fragment_fromstring(p['html'],create_parent=True)
for t,x,y,bw,bh,fs in [(title,.008,.536,.27,.08,3.65),(body,.292,.294,.665,.68,2.04)]:
 el=root.xpath(f'.//*[@data-deck-text-id="{t["id"]}"]')[0];el.set('style',f'left:{x*100}%;top:{y*p["height"]/p["width"]*100}cqw;width:{bw*100}cqw;height:{bh*p["height"]/p["width"]*100}cqw;');el[0].set('style',re.sub('font-size:[^;]+',f'font-size:{fs}cqw',el[0].get('style')));t.update(x=x*p['width'],y=y*p['height'],width=bw*p['width'],height=bh*p['height'],bbox=[x*p['width'],y*p['height'],(x+bw)*p['width'],(y+bh)*p['height']])
p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root)
# Consolidate a two-line logo so either word opens its complete meaning.
p=page(2,12);root=LH.fragment_fromstring(p['html'],create_parent=True)
for el in root.xpath('.//*[@data-deck-text-id="u2-p12-img15"]'):el.getparent().remove(el)
p['texts']=[t for t in p['texts'] if t['id']!='u2-p12-img15'];p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root)
p=page(4,34);tx="but I don't feel like going into it, if you want to know the truth.";t=next(t for t in p['texts'] if t['id']=='u4-p34-img8');t['text']=tx;root=LH.fragment_fromstring(p['html'],create_parent=True);el=root.xpath('.//*[@data-deck-text-id="u4-p34-img8"]')[0];el.set('aria-label',tx)
sp=el[0]
for ch in list(sp):sp.remove(ch)
sp.text=tx;p['html']=''.join(LH.tostring(el,encoding='unicode') for el in root)
for u,j in D.items():(O/f'unit-{u}.json').write_text(json.dumps(j,ensure_ascii=False,separators=(',',':')))
M=json.loads((P/'app/unitDeckSources.json').read_text())
for u,m in M.items():
 digest=hashlib.sha256((O/f'unit-{u}.json').read_bytes())
 for p in D[u]['pages']:digest.update((P/'public'/p['art'].lstrip('/')).read_bytes())
 m['version']=digest.hexdigest()[:12]+'-art7'
(P/'app/unitDeckSources.json').write_text(json.dumps(M,ensure_ascii=False,indent=2));Path('/private/tmp/unit-deck-selected-texts.json').write_text(json.dumps({u:{'pages':[{'page':p['page'],'texts':p['texts']} for p in j['pages']]} for u,j in D.items()},ensure_ascii=False));print('Final reviewed panels: art7')
