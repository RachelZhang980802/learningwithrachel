"""Recover text embedded in source slide images, including mixed content pages.

Every OCR word keeps its source rectangle. The original PDF text layer is removed
without erasing graphics, then raster-only ink is lifted from the artwork. Logos,
comic lettering, and film subtitles retain their source artwork with accessible
HTML interaction labels rather than destructively repainting the illustration.
"""
from pathlib import Path
from io import BytesIO
import json,html,re,math,hashlib,sys,copy,statistics
import pymupdf,cv2,numpy as np
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools import subset
from lxml import html as LH

PROJECT=Path(sys.argv[1]);OUT=PROJECT/'public/narrative-course/decks';URL='/narrative-course/decks/'
SOURCES=json.loads(Path('/private/tmp/unit-deck-source-paths.json').read_text())
OCR=json.loads(Path('/private/tmp/unit-deck-full-ocr-words.json').read_text())
OLD=json.loads(Path('/private/tmp/unit-deck-ocr.json').read_text())
ART_LABEL_PAGES={(5,30),(5,32),(5,165),(5,166),(5,175)}
ART_LABEL_PAGES|={(3,p) for p in range(1,38) if p!=34}|{(2,p) for p in (5,12,13,36)}|{(4,p) for p in (5,12,21)}|{(5,12),(5,28),(6,5),(6,8),(6,67)}
ART_LABEL_LINES={(4,23):{6},(4,24):set(range(7,11)),(4,30):{0,1,2},(4,31):{16,17},(4,32):{12,13},(4,33):{0,1,2,3,13},(4,44):{1},(4,47):{0,1,2,3},(4,48):{0,1,2},(4,54):{11,12},(4,55):{9},(6,7):set(range(17,25))|{32,33},(6,9):{12,13},(6,19):{0},(6,76):{5,6}}
SKIP_LINES={(4,23):{1},(4,101):{11},(2,111):{25},(1,42):{0},(1,47):{1,6},(2,12):{19,20,21},(3,2):{0},(3,15):{10},(3,19):{8},(3,20):{20},(3,22):{8,9},(3,23):{6},(3,24):{7,18},(3,26):{17,18},(3,28):{2,3,6,12,13,18,19},(4,13):{23,24,25,26,27},(4,15):{13},(4,43):{7},(4,56):{16},(5,28):{6},(6,5):{0,1},(6,8):{18,21},(6,76):{6}}
BLACK_SERIF_PAGES={(4,23),(4,24),(5,167),(5,183),(5,184),(5,185),(5,186)}
corrections={
 (5,30,0):'你愿意的话，我们可以保持这种关系，但我不想让你期待更多。',(5,30,1):'你喜欢他什么？他老夸我，让我觉得我自己很棒。',
 (5,32,0):'我觉得长大像你一样也没什么不好。',(5,32,1):'你的眼睛很美很亮，我喜欢你看着我。',(5,32,2):'你怎么看我都没事，你的眼泪也很好吃。',
 (4,54,4):'Jack, Annie, and Basho joined the crowds crossing the',(4,33,8):'TV is always on in the next room. Tell the others',(4,34,8):"but I don’t feel like going into it,",(4,101,1):'directions he later declared to be “the best',(4,104,8):'understood.”',(4,105,1):'His style added to the aesthetic: using “declarative sentences',(4,105,2):'and direct representations of the visible world” with simple',(4,105,8):'reader is meant to “fill the gaps left by his omissions with',
 (6,11,15):'comes to the Father except',(6,19,0):'Conflict',(6,19,4):'COMPLICATION',
 (5,165,3):'',(5,166,0):'',(5,166,9):'smart',(5,166,11):'LIVE LAUGH LOVE',(5,166,12):'MAKE MORE',
 (5,175,0):'BOOM! WOW! OMG!',(5,175,1):'OOPS!',(5,175,2):'SPLAT! ZAP!',(5,175,3):'POP! WHAM!',(5,175,4):'CRASH!',(5,175,5):'POW!',(5,175,6):'SMASH!',(5,175,7):'POOF!',(5,175,8):'BANG! WTF! HAHA! YEAH!',
 (5,177,0):'The hibernatorial [冬眠] ambitions',(5,177,12):'补充：'
}
def esc(x):return html.escape(str(x),quote=True)
def normal(t):return re.sub(r'[^\w\u4e00-\u9fff]','',t.lower())
def overlap(a,b):
 iw=max(0,min(a[2],b[2])-max(a[0],b[0]));ih=max(0,min(a[3],b[3])-max(a[1],b[1]));return iw*ih

# Fixed baseline metrics and exact outline bounds keep OCR ink inside its box.
ocrchars=set(c for lines in OCR.values() for line in lines for c in line['text'])|set('冬眠补充：')|set(''.join(corrections.values()))
fonts={};fontcss=[]
for key,name in [('sans','Arial.ttf'),('bold','Arial Bold.ttf'),('serif','Times New Roman.ttf'),('cjk','Arial Unicode.ttf')]:
 font=TTFont('/System/Library/Fonts/Supplemental/'+name);cmap=font.getBestCmap();upm=font['head'].unitsPerEm;glyphs=font.getGlyphSet();metrics={}
 for ch in ocrchars:
  glyph=cmap.get(ord(ch))
  if not glyph:continue
  pen=BoundsPen(glyphs);glyphs[glyph].draw(pen);metrics[ch]={'advance':font['hmtx'][glyph][0]/upm,'bounds':tuple(n/upm for n in pen.bounds) if pen.bounds else(0,0,0,0)}
 opts=subset.Options();sub=subset.Subsetter(options=opts);sub.populate(text=''.join(ocrchars));sub.subset(font)
 font['hhea'].ascent=upm;font['hhea'].descent=0;font['hhea'].lineGap=0
 font['OS/2'].sTypoAscender=upm;font['OS/2'].sTypoDescender=0;font['OS/2'].sTypoLineGap=0;font['OS/2'].usWinAscent=upm;font['OS/2'].usWinDescent=0
 alias='DeckOCR'+key;filename='ocr-'+key+'.woff2';font.flavor='woff2';font.save(OUT/'fonts'/filename)
 fonts[key]={'alias':alias,'metrics':metrics}
 fontcss.append(f'@font-face{{font-family:"{alias}";src:url("{URL}fonts/{filename}?v=20261026-word-box-2") format("woff2");font-display:block;ascent-override:100%;descent-override:0%;line-gap-override:0%;}}')

added={};audit={};alltexts={}
for unit in range(1,7):
 data=json.loads((OUT/f'unit-{unit}.json').read_text());doc=pymupdf.open(SOURCES[str(unit)]['pdf']);added[str(unit)]=[];audit[str(unit)]=[]
 for record in data['pages']:
  n=record['page'];page=doc[n-1];w,h=record['width'],record['height'];original_ocr=record.get('recoveredFromImage',False)
  if not original_ocr:
   record['art']=URL+f'unit-{unit}-page-{n:03d}.svg'
   tree=LH.fragment_fromstring(record['html'],create_parent=True)
   for el in tree.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," ud-image-text ")]'):el.getparent().remove(el)
   record['html']=''.join(LH.tostring(el,encoding='unicode') for el in tree);record['texts']=[t for t in record['texts'] if not t.get('recovered')]
  if unit==4 and n==26:
   svgfile=OUT/'unit-4-page-026.svg';svg=svgfile.read_text();svg=re.sub(r'<path[^>]+d="M264\.6099 164\.4H403\.4849V186\.4H264\.6099Z"[^>]*/>','',svg);svgfile.write_text(svg)
   if '<mark' not in record['html']:record['html']=record['html'].replace('literary critic Wayne C. Booth in his 1961 </span>','literary critic <mark style="background:#ffff00;color:inherit">Wayne C. Booth</mark> in his 1961 </span>')
  raw=page.get_text('dict',flags=0);native_spans=[sp for b in raw['blocks'] if b['type']==0 for li in b['lines'] for sp in li['spans']]
  native_boxes=[sp['bbox'] for sp in native_spans];nativetext=' '.join(sp['text'] for sp in native_spans);native_norm=normal(nativetext)
  lines=OCR.get(f'u{unit}-p{n}.png',[]);recovered=[];mask_only=[]
  if original_ocr:
   detailed=lines;lines=copy.deepcopy(OLD.get(f'u{unit}-p{n}.png',lines))
   for oldline in lines:
    a=(oldline['x'],oldline['y'],oldline['x']+oldline['width'],oldline['y']+oldline['height'])
    matches=sorted(detailed,key=lambda ll:overlap(a,(ll['x'],ll['y'],ll['x']+ll['width'],ll['y']+ll['height'])),reverse=True)
    if matches:oldline['words']=matches[0].get('words',[])

  for i,line in enumerate(lines):
   if i in SKIP_LINES.get((unit,n),set()):continue
   x,y,bw,bh=[line[k] for k in ('x','y','width','height')];rect=(x*w,y*h,(x+bw)*w,(y+bh)*h);area=max(.1,bw*w*bh*h);text=line['text'].strip();norm=normal(text)
   covered=sum(overlap(rect,b) for b in native_boxes)/area
   source_match=len(norm)>7 and norm in native_norm
   if not original_ocr and (covered>.4 or source_match):
    # Some PDF slides contain a flattened copy of the title behind the real
    # text. Lift only these known duplicate baked headings from the artwork.
    if unit==4 and n in (8,9,10,11) and y<.25:mask_only.append(line)
    continue
   if not text or (len(norm)<2 and not original_ocr):continue
   recordid=f'u{unit}-p{n}-'+('ocr' if original_ocr else 'img')+str(i)
   line=copy.deepcopy(line)
   if (unit,n,i) in corrections:
    text=corrections[unit,n,i]
    if not text:continue
    line['text']=text;line['words']=[]
   if unit==5 and n==178 and i in (6,7):
    term='Hyperbole' if i==6 else 'Personification';line['words']=[word for word in line.get('words',[]) if word['text']!=term];line['text']=line['text'].removesuffix(' '+term)
   line['preserve']=(unit,n) in ART_LABEL_PAGES or i in ART_LABEL_LINES.get((unit,n),set())
   recovered.append((recordid,line))
  if not recovered and not mask_only:continue
  # Keep existing IDs on the 28 previously recovered slides.
  if original_ocr:
   record['html']='';record['texts']=[]
  image=cv2.imread(f'/private/tmp/unit-deck-full-ocr/u{unit}-p{n}.png');ih,iw=image.shape[:2]
  temp=pymupdf.open();temp.insert_pdf(doc,from_page=n-1,to_page=n-1);clean=temp[0]
  for box in native_boxes:clean.add_redact_annot(pymupdf.Rect(box),fill=False,cross_out=False)
  if native_boxes:clean.apply_redactions(images=0,graphics=0,text=0)
  pix=clean.get_pixmap(matrix=pymupdf.Matrix(iw/w,iw/w));base=np.frombuffer(pix.samples,np.uint8).reshape(pix.height,pix.width,pix.n)
  base=cv2.cvtColor(base,cv2.COLOR_RGB2BGR) if pix.n==3 else cv2.cvtColor(base,cv2.COLOR_RGBA2BGR)
  mask=np.zeros((ih,iw),np.uint8);htmlparts=[];newtexts=[]
  def ink_for(box,preserve=False):
   x,y,bw,bh=[box[k] for k in ('x','y','width','height')];x0=max(0,int(x*iw)-1);x1=min(iw,int((x+bw)*iw)+2);y0=max(0,int(y*ih)-1);y1=min(ih,int((y+bh)*ih)+2)
   crop=image[y0:y1,x0:x1]
   if not crop.size:return '#202020',box
   gray=cv2.cvtColor(crop,cv2.COLOR_BGR2GRAY);bg=float(np.percentile(gray,65));bright=bg<190 and float(np.percentile(gray,95))-bg>45
   threshold=min(240,max(120,bg+45)) if bright else max(25,min(220,float(np.percentile(gray,85))-32))
   ink=gray>threshold if bright else gray<threshold
   if ink.sum()>3:
    color=np.percentile(crop[ink],80 if bright else 20,axis=0).astype(int);color=f'#{color[2]:02x}{color[1]:02x}{color[0]:02x}'
   else:color='#202020'
   if not preserve:mask[y0:y1,x0:x1]=np.maximum(mask[y0:y1,x0:x1],cv2.dilate((ink*255).astype(np.uint8),np.ones((3,3),np.uint8)))
   refined=dict(box)
   rows=np.flatnonzero(np.sum(ink,axis=1)>max(1,crop.shape[1]*.025))
   if len(rows)>1:
    refined['y']=(y0+rows[0])/ih;refined['height']=(rows[-1]-rows[0]+1)/ih
   return color,refined
  for line in mask_only:ink_for(line)
  for tid,line in recovered:
   x,y,bw,bh=[line[k] for k in ('x','y','width','height')];text=line['text'];words=line.get('words') or [{'text':text,'x':x,'y':y,'width':bw,'height':bh}];runs=[]
   # Labels in photographed artworks and comic marks remain illustrations;
   # their native text controls expose the meaning without repainting them.
   preserve=line.get('preserve',False)
   wordparts=[];sizes=[];bases=[]
   key='cjk' if any('\u4e00'<=c<='\u9fff' for c in text) else 'serif' if (unit,n) in BLACK_SERIF_PAGES else 'sans'
   f=fonts[key];m=f['metrics']
   for word in words:
    tx=word['text'];color,wordbox=ink_for(word,preserve);wx,wy,ww,wh=[wordbox[k] for k in ('x','y','width','height')]
    parts=[m[c] for c in tx if c in m];miny=min((p['bounds'][1] for p in parts),default=0);maxy=max((p['bounds'][3] for p in parts),default=.72)
    candidate=wh*h/max(.35,maxy-miny)
    if len(tx)>2:sizes.append(candidate)
    wordparts.append((tx,color,wy,wh,miny))
   fontsize=statistics.median(sizes) if sizes else bh*h/.8
   fontsize=max(bh*h*.75,min(bh*h*1.6,fontsize))
   baseline=statistics.median((wy+wh)*h+fontsize*miny for tx,color,wy,wh,miny in wordparts)
   fulltext=' '.join(part[0] for part in wordparts);advance=sum(m.get(c,{'advance':.5})['advance'] for c in fulltext)*fontsize;scalex=bw*w/max(.1,advance)
   style=f'left:0;top:{(baseline-fontsize-y*h)/w*100:.6f}cqw;font-size:{fontsize/w*100:.6f}cqw;font-family:"{f["alias"]}";transform:scaleX({scalex:.6f});transform-origin:left top;'
   content=' '.join(f'<span style="color:{"transparent" if preserve else color}">{esc(tx)}</span>' for tx,color,wy,wh,miny in wordparts)
   runs.append(f'<span class="ud-image-word" style="{esc(style)}">{content}</span>')
   htmlparts.append(f'<div class="ud-source-text ud-image-text{" ud-image-art-label" if preserve else ""}" data-deck-text-id="{tid}" tabindex="0" role="button" aria-label="{esc(text)}" style="left:{x*100:.6f}%;top:{y*h/w*100:.6f}cqw;width:{bw*100:.6f}cqw;height:{bh*h/w*100:.6f}cqw">{" ".join(runs)}</div>')
   newtexts.append({'id':tid,'text':text,'x':x*w,'y':y*h,'width':bw*w,'height':bh*h,'bbox':[x*w,y*h,(x+bw)*w,(y+bh)*h],'recovered':True,'artLabel':preserve})
  art=cv2.inpaint(base,mask,3,cv2.INPAINT_TELEA) if np.any(mask) else base
  def manual(tid,text,x,y,bw,bh,size,color='#222222',bold=False):
   style=f'left:{x*100}%;top:{y*h/w*100}cqw;width:{bw*100}cqw;height:{bh*h/w*100}cqw;'
   run=f'position:static;display:block;white-space:normal;font-family:Arial,sans-serif;font-size:{size}cqw;line-height:1.25;color:{color};font-weight:{700 if bold else 400};'
   htmlparts.append(f'<div class="ud-source-text ud-image-text" data-deck-text-id="{tid}" role="button" tabindex="0" style="{style}"><span class="ud-image-word" style="{run}">{esc(text)}</span></div>')
   newtexts.append({'id':tid,'text':text,'x':x*w,'y':y*h,'width':bw*w,'height':bh*h,'bbox':[x*w,y*h,(x+bw)*w,(y+bh)*h],'recovered':True})
  if unit==2 and n==15:
   art[int(.60*ih):int(.90*ih),:]=255;htmlparts=[];newtexts=[]
   manual('u2-p15-ocr0','Warner Bros.',.012,.567,.15,.04,1.75)
   manual('u2-p15-img-title','Albus Dumbledore',.045,.615,.9,.09,4.2,bold=True)
   manual('u2-p15-img-definition','Headmaster Albus Dumbledore: His first name is from the Latin word alba, “white.” His last name, according to Rowling interviews, is Old English for “bumblebee.” In color symbolism, white often stands for purity, so the headmaster’s name suggests honor and a hard-working nature (“busy as a bee”).',.045,.735,.90,.18,2.05)
  if unit==5 and n==13:
   cv2.rectangle(art,(int(.075*iw),int(.365*ih)),(int(.918*iw),int(.963*ih)),(0,0,0),-1);htmlparts=[];newtexts=[]
   manual('u5-p13-img3','THEME',.105,.435,.245,.06,3.0,'#f5df92',True)
   manual('u5-p13-img5','A lesson or a message to take out of the story',.105,.57,.24,.31,2.8,'#f5df92')
   manual('u5-p13-img4','MAIN IDEA',.38,.435,.25,.06,3.0,'#a4b0f2',True)
   manual('u5-p13-img6','What the story is all about',.38,.57,.24,.31,2.8,'#a4b0f2')
   manual('u5-p13-img12','SUMMARY',.67,.435,.23,.06,3.0,'#b8e7d9',True)
   manual('u5-p13-img13','The events of the story',.67,.57,.22,.31,2.8,'#b8e7d9')
  if unit==6 and n==76:
   keep=[i for i,t in enumerate(newtexts) if t['id'].endswith('-img5')];htmlparts=[htmlparts[i] for i in keep];newtexts=[newtexts[i] for i in keep]
   polygon=np.array([[893,345],[1269,410],[1205,778],[831,713]],np.float64)*[iw/1440,ih/810]
   cv2.fillConvexPoly(art,polygon.astype(np.int32),(18,218,255))
   manual('u6-p76-img7','Unity = Every sentence in a paragraph relates to the topic sentence.',.634,.452,.225,.43,3.25,'#1034bf',True)
   htmlparts[-1]=htmlparts[-1].replace('style="left:','style="transform:rotate(10deg);transform-origin:top left;left:',1)
  if unit==6 and n==19:
   manual('u6-p19-img18','CONFLICT',.49,.515,.08,.04,1.04,'#ffffff')
  filename=f'unit-{unit}-page-{n:03d}-mixed.webp';cv2.imwrite(str(OUT/filename),art,[cv2.IMWRITE_WEBP_QUALITY,96])
  record['art']=URL+filename;record['html']+=''.join(htmlparts);record['texts']+=newtexts;record['imageTextRecovered']=len(newtexts)
  added[str(unit)].append({'page':n,'texts':newtexts});audit[str(unit)].append({'page':n,'recoveredLines':len(newtexts),'artLabelsPreserved':(unit,n) in ART_LABEL_PAGES})
  print('mixed',unit,n,len(newtexts),flush=True)
 (OUT/f'unit-{unit}.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
 alltexts[str(unit)]={'pages':[{'page':p['page'],'texts':p['texts']} for p in data['pages']]}
css=(OUT/'fonts.css').read_text();css=re.sub(r'@font-face\{font-family:"DeckOCR[^\n]+\n?','',css);css+='\n'+'\n'.join(fontcss)
css=re.sub(r'(fonts/[^"?]+\.woff2)(?:\?v=[^"\)]+)?',r'\1?v=20261027-fixed-fonts-5',css);(OUT/'fonts.css').write_text(css)
Path('/private/tmp/unit-deck-added-image-texts.json').write_text(json.dumps(added,ensure_ascii=False))
Path('/private/tmp/unit-deck-selected-texts.json').write_text(json.dumps(alltexts,ensure_ascii=False))
(PROJECT/'docs/unit-deck-image-text-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
manifest=json.loads((PROJECT/'app/unitDeckSources.json').read_text())
for u,meta in manifest.items():meta['version']=hashlib.sha256((OUT/f'unit-{u}.json').read_bytes()).hexdigest()[:12]+'-lines5'
(PROJECT/'app/unitDeckSources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
