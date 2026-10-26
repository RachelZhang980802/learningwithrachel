"""Rebuild the selected Unit Three PPTX pages as native HTML text and source artwork.
Usage: python3 scripts/convert-unit-three.py SOURCE.pptx OUTPUT_DIRECTORY
The output is generated offline; the website does not need PowerPoint or Python.
"""
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E
import json, html, posixpath, sys, struct, hashlib, copy, colorsys
SOURCE=Path(sys.argv[1]); OUT=Path(sys.argv[2]); OUT.mkdir(parents=True,exist_ok=True)
ASSETS=OUT/'assets';ASSETS.mkdir(exist_ok=True)
z=ZipFile(SOURCE)
NS={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
R='{'+NS['r']+'}'; A='{'+NS['a']+'}'
W,H=18288000,10287000
theme=E.fromstring(z.read('ppt/theme/theme1.xml'))
COLORS={E.QName(e).localname: '#'+e[0].get('val',e[0].get('lastClr','000000')) for e in theme.find('a:themeElements/a:clrScheme',NS)}
COLORS.update({k:COLORS[v] for k,v in {'bg1':'lt1','bg2':'lt2','tx1':'dk1','tx2':'dk2'}.items()})
PAGES=list(range(2,21))+list(range(22,35))+[36,37]
URL='/narrative-course/theory/unit-3/html/assets/'
PROJECT=Path(__file__).resolve().parents[1]
QUOTE_CONFIG=json.loads((PROJECT/'app/unitThreeQuoteTranslations.json').read_text())
page_quotes={}
quote_audit={}
def esc(x):return html.escape(str(x),quote=True)
def find(el,path):return el.find(path,NS) if el is not None else None
def attr(el,k,d=None):return el.get(k,d) if el is not None else d
def num(el,k,d=0):return float(attr(el,k,d))
def cw(v):return f'{v/W*100:.5f}cqw'
def col(el,default='transparent'):
 if el is None or not len(el):return default
 c=el[0];v=c.get('val','');typ=E.QName(c).localname
 if typ=='srgbClr':s='#'+v
 elif typ=='schemeClr':s=COLORS.get(v,default)
 elif typ=='prstClr':s={'yellow':'#ffff00','cyan':'#00ffff','red':'#ff0000','black':'#000000','white':'#ffffff','green':'#008000'}.get(v,v)
 elif typ=='sysClr':s='#'+c.get('lastClr','000000')
 else:return default
 if s.startswith('#') and len(s)==7:
  rgb=[int(s[k:k+2],16)/255 for k in (1,3,5)];hh,ll,ss=colorsys.rgb_to_hls(*rgb)
  lm=find(c,'a:lumMod')
  if lm is not None:ll*=num(lm,'val',100000)/100000
  s='#'+''.join(f'{round(x*255):02x}' for x in colorsys.hls_to_rgb(hh,ll,ss))
 return s

def rels(page):
 name=f'ppt/slides/_rels/slide{page}.xml.rels'
 return {e.get('Id'):posixpath.normpath('ppt/slides/'+e.get('Target')) for e in E.fromstring(z.read(name)) if e.get('TargetMode')!='External'}
assets=set(); textaudit={}; issues=[]
def asset(name):
 dst=ASSETS/Path(name).name
 if not dst.exists():dst.write_bytes(z.read(name))
 assets.add(dst.name);return URL+dst.name

def paint_image(fill,rs):
 bl=find(fill,'a:blip')
 if bl is None:return ''
 embeds=bl.xpath('.//*[local-name()="svgBlip"]')
 rid=(embeds[0].get(R+'embed') if embeds else bl.get(R+'embed'))
 if rid not in rs:return ''
 src=asset(rs[rid]);crop=find(fill,'a:srcRect');l,t,r,b=[num(crop,k)/100000 for k in ('l','t','r','b')];ww=max(.001,1-l-r);hh=max(.001,1-t-b)
 alpha=find(bl,'a:alphaModFix');opacity=num(alpha,'amt',100000)/100000
 return f'<span class="u3-art" aria-hidden="true"><img src="{esc(src)}" alt="" loading="lazy" decoding="async" style="width:{100/ww:.5f}%;height:{100/hh:.5f}%;left:{-100*l/ww:.5f}%;top:{-100*t/hh:.5f}%;opacity:{opacity}" /></span>'

def drawing(pr):
 fill=col(find(pr,'a:solidFill'));ln=find(pr,'a:ln');stroke=col(find(ln,'a:solidFill'));sw=num(ln,'w',12700)
 if fill=='transparent' and stroke=='transparent':return ''
 paths=find(pr,'a:custGeom/a:pathLst'); geom=find(pr,'a:prstGeom');parts=[]
 if paths is not None:
  for path in paths:
   pw=num(path,'w',1);ph=num(path,'h',1);d=[]
   for cmd in path:
    typ=E.QName(cmd).localname;pts=cmd.findall('a:pt',NS);xy=' '.join(f'{num(p,"x")} {num(p,"y")}' for p in pts)
    if typ in ['moveTo','lnTo','cubicBezTo','quadBezTo']:d.append({'moveTo':'M','lnTo':'L','cubicBezTo':'C','quadBezTo':'Q'}[typ]+xy)
    elif typ=='close':d.append('Z')
    else:issues.append('path '+typ)
   parts.append(f'<svg viewBox="0 0 {pw} {ph}" preserveAspectRatio="none"><path d="{" ".join(d)}" fill="{fill if path.get("fill")!="none" else "none"}" stroke="{stroke}" stroke-width="{sw}" /></svg>')
 else:
  radius='border-radius:1cqw;' if attr(geom,'prst')=='roundRect' else ''
  parts.append(f'<span class="u3-fill" style="background:{fill};border:{cw(sw)} solid {stroke};{radius}"></span>')
 return ''.join(parts)

def runstyle(rp,default,scale):
 def get(k,d):return attr(rp,k,attr(default,k,d))
 sz=float(get('sz',2400));size=sz/100*12700*scale
 latin=find(rp,'a:latin');latin=latin if latin is not None else find(default,'a:latin');font=attr(latin,'typeface','Times New Roman')
 family='"U3 Balmy", Impact, sans-serif' if font=='Balmy' else ('Arial, "PingFang SC", sans-serif' if font=='Corbel' else '"Times New Roman", "Songti SC", SimSun, serif')
 fill=find(rp,'a:solidFill');fill=fill if fill is not None else find(default,'a:solidFill')
 st=f'font-size:{cw(size)};font-family:{family};font-weight:{"700" if get("b","0")=="1" else "400"};font-style:{"italic" if get("i","0")=="1" else "normal"};color:{col(fill,"#000000")};'
 if get('u','none')!='none':st+='text-decoration:underline;'
 hl=find(rp,'a:highlight')
 if hl is not None:st+='background-color:'+col(hl)+';'
 return st,size

def merge(*nodes):
 out=E.Element('properties')
 for node in nodes:
  if node is None:continue
  out.attrib.update(node.attrib)
  for child in node:
   for old in list(out):
    if old.tag==child.tag:out.remove(old)
   out.append(copy.deepcopy(child))
 return out

def textblock(el,sx,sy,page,shapeid):
 body=find(el,'p:txBody');bp=find(body,'a:bodyPr');paragraphs=[]
 translations=page_quotes.get(shapeid,[]);translation_index=0
 for p in body.findall('a:p',NS):
  level=int(attr(find(p,'a:pPr'),'lvl',0))+1
  pp=merge(find(body,'a:lstStyle/a:defPPr'),find(body,f'a:lstStyle/a:lvl{level}pPr'),find(p,'a:pPr'))
  default=merge(find(body,f'a:lstStyle/a:lvl{level}pPr/a:defRPr'),find(p,'a:endParaRPr'),find(pp,'a:defRPr'));runs=[];sizes=[]
  for r in p:
   typ=E.QName(r).localname
   if typ=='br':runs.append('<br>')
   elif typ in ('r','fld'):
    t=find(r,'a:t');txt=t.text or '' if t is not None else '';sty,size=runstyle(find(r,'a:rPr'),default,sy);sizes.append(size if txt.strip() else 0);runs.append(f'<span style="{esc(sty if txt.strip() else "font-size:inherit;")}">{esc(txt)}</span>')
  if not runs:
   sty,size=runstyle(find(p,'a:endParaRPr'),default,sy);sizes=[size];runs=[f'<span style="{esc(sty)}"><br></span>']
  sizes=[s for s in sizes if s] or [24*12700*sy];line=find(pp,'a:lnSpc/a:spcPts');pct=find(pp,'a:lnSpc/a:spcPct')
  lh=cw(num(line,'val')/100*12700*sy) if line is not None else (str(num(pct,'val')/100000) if pct is not None else '1.12')
  align={'ctr':'center','r':'right','just':'justify'}.get(attr(pp,'algn'),'left');st=f'text-align:{align};font-size:{cw(max(sizes))};line-height:{lh};'
  for k,css in [('spcBef','margin-top'),('spcAft','margin-bottom')]:
   pt=find(pp,f'a:{k}/a:spcPts');pct=find(pp,f'a:{k}/a:spcPct')
   if pt is not None:st+=f'{css}:{cw(num(pt,"val")/100*12700*sy)};'
   elif pct is not None:st+=f'{css}:{cw(num(pct,"val")/100000*max(sizes))};'
  if pp is not None and pp.get('marL'):st+='padding-left:'+cw(num(pp,'marL')*sx)+';'
  if pp is not None and pp.get('indent'):st+='text-indent:'+cw(num(pp,'indent')*sx)+';'
  bullet=find(pp,'a:buAutoNum')
  prefix=f'<span class="u3-auto-number" aria-hidden="true" style="font-weight:700">{chr(96+int(attr(bullet,"startAt","1"))) if attr(bullet,"type","").startswith("alphaLc") else attr(bullet,"startAt","1")}. </span>' if bullet is not None else ''
  if translations and ''.join(p.xpath('.//a:t/text()',namespaces=NS)).strip():
   zh=translations[translation_index];translation_index+=1
   paragraphs.append(f'<details class="u3-quote" data-u3-quote="{page}-{shapeid}-{translation_index}"><summary style="{esc(st)}"><span class="u3-english" lang="en">{prefix}{"".join(runs)}</span><span class="u3-inline-zh" lang="zh-CN">（{esc(zh)}）</span></summary></details>')
  else:
   paragraphs.append(f'<p style="{esc(st)}">{prefix}{"".join(runs)}</p>')
 if translations:assert translation_index==len(translations),(page,shapeid,translation_index,len(translations))
 if not paragraphs:return ''
 padding=' '.join(cw(num(bp,k,d)*s) for k,d,s in [('tIns',45720,sy),('rIns',91440,sx),('bIns',45720,sy),('lIns',91440,sx)])
 anchor={'ctr':'center','b':'flex-end'}.get(attr(bp,'anchor'),'flex-start')
 return f'<div class="u3-text{" u3-quote-text" if translations else ""}" data-source-shape="{shapeid}" style="padding:{padding};justify-content:{anchor};white-space:{'pre' if attr(bp,'wrap')=='none' else 'pre-wrap'}">{"".join(paragraphs)}</div>'

def render(el,rs,page,tr=(1,1,0,0)):
 kind=E.QName(el).localname;sx,sy,tx,ty=tr
 if kind not in ('grpSp','sp','pic'):return ''
 pr=find(el,'p:grpSpPr' if kind=='grpSp' else 'p:spPr');xf=find(pr,'a:xfrm')
 if xf is None:issues.append(f'No position {page}');return ''
 off=find(xf,'a:off');ext=find(xf,'a:ext');x=num(off,'x');y=num(off,'y');w=num(ext,'cx');h=num(ext,'cy')
 if kind=='grpSp':
  co=find(xf,'a:chOff');ce=find(xf,'a:chExt');gsx=w/max(1,num(ce,'cx'));gsy=h/max(1,num(ce,'cy'));tr2=(sx*gsx,sy*gsy,tx+sx*(x-num(co,'x')*gsx),ty+sy*(y-num(co,'y')*gsy))
  children=''.join(render(c,rs,page,tr2) for c in el)
  transforms=[]
  if num(xf,'rot'):transforms.append(f'rotate({num(xf,"rot")/60000}deg)')
  if xf.get('flipH')=='1':transforms.append('scaleX(-1)')
  if xf.get('flipV')=='1':transforms.append('scaleY(-1)')
  if transforms:
   origin=f'{cw(tx+sx*(x+w/2))} {cw(ty+sy*(y+h/2))}'
   return f'<div class="u3-transform" style="transform:{" ".join(transforms)};transform-origin:{origin}">{children}</div>'
  return children
 left=tx+x*sx;top=ty+y*sy;width=w*sx;height=h*sy
 text=el.xpath('.//a:t/text()',namespaces=NS);nv=el.find('.//p:cNvPr',NS);shapeid=attr(nv,'id','')
 if page==3 and shapeid=='18':return ''
 if shapeid in {v.get('sourceChineseShape') for v in QUOTE_CONFIG.get(str(page),{}).values()}:return ''
 if page==3 and shapeid in ['19','20','21','27','28']:width=min(width,12500000-left)
 if page==3 and shapeid in ['19','20','21','22','23','24','25','26','27','28']:top-=1300000
 # Correct the original overlapping text boxes without changing any lesson text.
 if page==18 and shapeid=='2':left=W*.56;top=W*.37;width=W*.18715;height=W*.19
 if page==18 and shapeid=='19462':top=W*.37;width=W*.11907;height=W*.19
 if page==20 and shapeid=='3074':left=W*.82;top=W*.405;width=W*.14;height=W*.14
 if page==31 and shapeid=='32':top=3500000;height=1900000
 if page==31 and shapeid=='34':top=8850000;height=1350000
 if page==33 and shapeid=='32':top=3300000;height=950000
 if page==34 and shapeid=='26':top=3200000;height=2400000
 if page==37 and shapeid=='9218':top=2100000
 if page==34 and shapeid in ['30','32']:
  note={'30':'Use Sensory Detail to Bring Setting to Life','32':'To write great fiction, you need to create powerful settings that immerse your readers in your world!'}[shapeid]
  family='cursive' if shapeid=='30' else 'Arial,sans-serif'
  size=2.0 if shapeid=='30' else 2.15
  return f'<div class="u3-object u3-note" data-source-image-text="{shapeid}" style="left:{left/W*100:.5f}%;top:{cw(top)};width:{width/W*100:.5f}%;font:{size}cqw/1.2 {family};padding:.5cqw;box-sizing:border-box;color:#171717">{note}</div>'
 inner='';fill=find(el,'p:blipFill') if kind=='pic' else find(pr,'a:blipFill')
 if fill is not None:
  inner+=paint_image(fill,rs)
  if find(pr,'a:ln') is not None:inner+=drawing(pr)
 else:inner+=drawing(pr)
 if text:inner+=textblock(el,sx,sy,page,shapeid)
 if not inner:return ''
 transforms=[]
 if num(xf,'rot'):transforms.append(f'rotate({num(xf,"rot")/60000}deg)')
 if xf.get('flipH')=='1':transforms.append('scaleX(-1)')
 if xf.get('flipV')=='1':transforms.append('scaleY(-1)')
 column_layout=QUOTE_CONFIG.get(str(page),{}).get(shapeid,{}).get('layout')=='columns'
 column_style=''
 if column_layout:
  bp=find(el,'p:txBody/a:bodyPr')
  english_width=width-(num(bp,'lIns',91440)+num(bp,'rIns',91440))*sx
  column_style=f'--u3-english-width:{cw(english_width)};'
  width=W*.97-left
 style=column_style+f'left:{left/W*100:.5f}%;top:{cw(top)};width:{width/W*100:.5f}%;height:{cw(height)};'
 if transforms:style+='transform:'+' '.join(transforms)+';'
 return f'<div class="u3-object{" u3-object-text" if text else ""}{" u3-quote-object" if shapeid in page_quotes else ""}{" u3-quote-columns" if column_layout else ""}" data-u3-y="{top/W}" data-u3-x="{left/W}" data-u3-width="{width/W}" data-u3-height="{height/W}" style="{style}">{inner}</div>'

# The deck embeds Balmy as an uncompressed OpenType font in an EOT envelope.
f=z.read('ppt/fonts/font1.fntdata');n=struct.unpack_from('<I',f,4)[0];assert f[-n:-n+4]==b'OTTO';(ASSETS/'balmy.otf').write_bytes(f[-n:])
result={}
for page in PAGES:
 root=E.fromstring(z.read(f'ppt/slides/slide{page}.xml'));rs=rels(page)
 page_quotes={}
 for shapeid,config in QUOTE_CONFIG.get(str(page),{}).items():
  translations=config.get('translations')
  if translations is None:
   chinese=root.xpath('.//p:sp[p:nvSpPr/p:cNvPr[@id="'+config['sourceChineseShape']+'"]]',namespaces=NS)
   assert len(chinese)==1,(page,config)
   translations=[''.join(chinese[0].xpath('.//a:t/text()',namespaces=NS)).strip()]
  page_quotes[shapeid]=translations
 if page_quotes:quote_audit[str(page)]=page_quotes
 bg=col(find(root,'p:cSld/p:bg/p:bgPr/a:solidFill'),'#ffffff');content=''.join(render(e,rs,page) for e in find(root,'p:cSld/p:spTree'))
 result[str(page)]=f'<div class="u3-native-scroll" tabindex="0" aria-label="Unit Three, page {page}"><div class="u3-native-slide" data-native-page="{page}" style="background-color:{bg}">{content}</div></div>'
 texts=root.xpath('.//p:spTree//a:t/text()',namespaces=NS);textaudit[str(page)]={'textRuns':len(texts),'text':''.join(texts)}
(OUT/'slides.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
(OUT/'audit.json').write_text(json.dumps({'source':str(SOURCE),'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'pages':PAGES,'assets':sorted(assets),'issues':issues,'inlineTranslations':quote_audit,'requestedRemovals':['Page 3 shape 18: duplicate Teaching Objectives heading.'],'layoutRepairs':['Page 3: keep objectives clear of the right illustration.','Pages 6, 12, 15, 16, 18 and 20: show Chinese translations to the right of the English; page 20 book cover sits below the translations.','Page 31: separate the definition from its heading and keep the Chinese paragraph inside the page.','Pages 33–34: separate the heading and following paragraph.','Page 37: lower the book cover clear of the title.'],'imageText':{'34':{'30':'Use Sensory Detail to Bring Setting to Life','32':'To write great fiction, you need to create powerful settings that immerse your readers in your world!'}},'text':textaudit},ensure_ascii=False,indent=2))
print(json.dumps({'pages':len(result),'assets':len(assets),'issues':issues}))

# Also produce a standalone HTML document when run from this repository.
stylesheet=Path(__file__).resolve().parents[1]/'app/unit-three-native.css'
if stylesheet.exists():
 css=stylesheet.read_text().replace(URL,'assets/')
 navigation=''.join(f'<a href="#page-{page}">{page}</a>' for page in result)
 sections=''.join(f'<section id="page-{page}"><h2>Page {page}</h2>{markup.replace(URL,"assets/")}</section>' for page,markup in result.items())
 document='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unit Three · Growth and Maturity</title><style>body{margin:0;background:#f5efdf}main{max-width:1200px;margin:auto;padding:24px}h1,h2,nav{font-family:Georgia,serif}nav{display:flex;flex-wrap:wrap;gap:12px}section{margin:50px 0}'+css+'</style><main class="narrative-course"><h1>Unit Three · Growth and Maturity</h1><nav>'+navigation+'</nav>'+sections+'</main></html>'
 interaction=PROJECT/'app/unitThreeInteractions.js'
 (OUT/'interactions.js').write_text(interaction.read_text())
 document=document.replace('</main></html>', '</main><script type="module">import { initUnitThreeQuotes } from "./interactions.js"; initUnitThreeQuotes(document.querySelector("main"));</script></html>')
 (OUT/'lesson.html').write_text(document)
