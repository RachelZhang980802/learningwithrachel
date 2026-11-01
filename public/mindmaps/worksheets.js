import { designs } from './atlas-designs.js?v=source-branches-20261101';

const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const button=(cls,text)=>{const el=make('button',cls,text);el.type='button';return el;};
const NS='http://www.w3.org/2000/svg';
const svgEl=(tag,attrs={})=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el;};
const paragraphLabel=ids=>{const sorted=[...new Set(ids)].sort((a,b)=>a-b),r=[];for(let i=0;i<sorted.length;i++){const start=sorted[i];let end=start;while(sorted[i+1]===end+1)end=sorted[++i];r.push(start===end?start:`${start}–${end}`);}return `¶ ${r.join(', ')}`;};
let cleanup=()=>{};

export function renderWorksheet(host,data,source={}){
 cleanup();host.replaceChildren();
 const design=designs[data.id],figure=data.figure,gaps=[],panels=[],parts=[];
 const paper=make('article',`reading-atlas figure-atlas atlas-${design.pattern}`);
 paper.lang='en';paper.dataset.article=data.id;paper.dataset.pattern=design.pattern;
 design.palette.forEach((c,i)=>paper.style.setProperty(`--colour-${i+1}`,c));
 design.fills.forEach((c,i)=>paper.style.setProperty(`--fill-${i+1}`,c));
 const header=make('header','figure-header');
 header.append(make('span','figure-issue',`READING MAP / ${data.id}`),make('h2',null,data.title));
 const route=make('div','figure-route');route.setAttribute('aria-label','Main writing branches');
 figure.sections.forEach((s,i)=>{const chip=make('span','figure-route-step');colour(chip,s.colour);chip.append(make('b',null,String(i+1).padStart(2,'0')),make('span',null,s.title));route.append(chip);});
 header.append(route);
 const toolbar=make('div','figure-toolbar'),progress=make('span','figure-progress'),reset=button('figure-action','重置');
 toolbar.append(make('span','figure-hint','10 个空格 · 点击空格显隐答案 · 点击分支标题查看中文'),progress,reset);
 header.append(toolbar);paper.append(header);
 const graph=make('div','figure-graph atlas-graph');graph.setAttribute('aria-label','Reading framework with clickable answer gaps');paper.append(graph);
 const status=make('span','screen-reader-only');status.setAttribute('role','status');
 function colour(el,n){el.style.setProperty('--node-colour',`var(--colour-${n})`);el.style.setProperty('--node-fill',`var(--fill-${n})`);el.dataset.colour=n;}
 function update(){progress.textContent=`${gaps.filter(g=>g.open).length} / ${gaps.length}`;reset.disabled=!gaps.some(g=>g.open)&&!panels.some(p=>!p.content.hidden);}
 function setGap(g,open){g.open=open;g.el.classList.toggle('is-revealed',open);g.el.setAttribute('aria-pressed',String(open));g.answer.setAttribute('aria-hidden',String(!open));g.el.setAttribute('aria-label',open?`收起第 ${g.number} 空答案：${g.value}`:`显示第 ${g.number} 空答案`);}
 function fillText(host,text){
  const re=/\[\[([^\]]+)\]\]/g;let start=0,m;
  while((m=re.exec(text))){
   host.append(document.createTextNode(text.slice(start,m.index)));
   const number=gaps.length+1,el=button('figure-gap'),answer=make('span','figure-answer',m[1]),label=make('span','figure-gap-number',String(number).padStart(2,'0'));
   label.setAttribute('aria-hidden','true');el.append(answer,label);
   const gap={el,answer,number,value:m[1],open:false};gaps.push(gap);setGap(gap,false);
   el.onclick=()=>{setGap(gap,!gap.open);update();};host.append(el);start=re.lastIndex;
  }
  host.append(document.createTextNode(text.slice(start)));
 }
 function bullets(items){
  const ul=make('ul','figure-bullets');
  for(const item of items){const li=make('li',item.children?'figure-bullet-group':null),text=make('span','figure-bullet-text');fillText(text,item.text);li.append(text);if(item.children)li.append(bullets(item.children));ul.append(li);}
  return ul;
 }
 function attachTranslation(trigger,container,item){
  const content=make('div','figure-translation');content.id=`${item.id}-zh`;content.hidden=true;
  const zh=make('p','figure-zh',item.zh);zh.lang='zh-CN';content.append(zh);
  const excerpt=make('details','atlas-original'),summary=make('summary',null,`查看对应原文 · ${paragraphLabel(item.paragraphs)}`),body=make('div');
  excerpt.append(summary,body);content.append(excerpt);container.append(content);
  excerpt.addEventListener('toggle',()=>{if(!excerpt.open||body.childElementCount)return;for(const p of item.paragraphs){if(!source.paragraphs?.[p-1])continue;const quote=make('blockquote');quote.append(make('small',null,`¶ ${p}`),make('p',null,source.paragraphs[p-1]));body.append(quote);}});
  trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',content.id);
  trigger.onclick=()=>{
   const open=content.hidden;
   for(const panel of panels){panel.content.hidden=true;panel.trigger.setAttribute('aria-expanded','false');panel.container.classList.remove('is-selected');panel.excerpt.open=false;}
   content.hidden=!open;trigger.setAttribute('aria-expanded',String(open));container.classList.toggle('is-selected',open);
   status.textContent=open?item.zh:'译文已收起';update();
  };
  panels.push({content,trigger,container,excerpt});
 }
 function card(item,i,section){
  const el=make('section',`figure-node source-card${item.wide?' is-wide':''}`);el.dataset.stage=item.id;el.dataset.sourceIds=item.sourceIds.join(' ');colour(el,item.colour);
  const head=make('div','figure-node-heading'),title=button('figure-node-title');
  title.append(make('span','branch-order',`${section+1}.${i+1}`),make('span',null,item.title));
  head.append(title);el.append(head);
  const content=make('div','figure-node-content');content.append(make('span','branch-evidence',paragraphLabel(item.paragraphs)),bullets(item.bullets));el.append(content);
  attachTranslation(title,el,item);return el;
 }
 figure.sections.forEach((section,i)=>{
  const part=make('section',`source-part layout-${section.layout}`);part.dataset.part=section.id;part.dataset.sourceIds=section.sourceIds.join(' ');colour(part,section.colour);
  const svg=svgEl('svg',{class:'part-connections','aria-hidden':'true'});part.append(svg);
  const heading=make('header','source-part-heading');heading.append(make('span','part-number',`PART ${String(i+1).padStart(2,'0')}`),make('h3',null,section.title),make('span','part-evidence',paragraphLabel(section.paragraphs)));
  part.append(heading);
  const branchHost=make('div',`source-branches columns-${section.columns}`);part.append(branchHost);
  if(section.layout==='comparison'){
   branchHost.classList.add('source-comparison');
   const table=make('table','comparison-table');
   const caption=make('caption'),toggle=button('figure-node-title','The same details · two readings');caption.append(toggle);table.append(caption);
   const thead=make('thead'),tr=make('tr');section.headers.forEach((text,i)=>{const th=make('th',null,text);th.scope='col';colour(th,section.pairColours[i]);tr.append(th);});thead.append(tr);table.append(thead);
   const tbody=make('tbody');section.pairs.forEach(pair=>{const row=make('tr');['left','right'].forEach((key,i)=>{const td=make('td');colour(td,section.pairColours[i]);const ul=make('ul','figure-bullets'),li=make('li');fillText(li,pair[key]);ul.append(li);td.append(ul);row.append(td);});tbody.append(row);});table.append(tbody);branchHost.append(table);
   attachTranslation(toggle,branchHost,section);
  }else section.cards.forEach((item,j)=>branchHost.append(card(item,j,i)));
  graph.append(part);parts.push({part,heading,branchHost,svg,section});
 });
 reset.onclick=()=>{gaps.forEach(g=>setGap(g,false));panels.forEach(p=>{p.content.hidden=true;p.trigger.setAttribute('aria-expanded','false');p.container.classList.remove('is-selected');p.excerpt.open=false;});update();};
 const footer=make('footer','figure-footer'),sourceButton=button('figure-source','原始导图 ↗');
 sourceButton.onclick=()=>document.dispatchEvent(new CustomEvent('atlas-source-map'));
 footer.append(make('span',null,'主分支 → 子分支 → 要点 / 例证'),sourceButton);paper.append(footer,status);host.append(paper);update();
 let frame;
 function draw(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
  for(const {part,heading,branchHost,svg,section}of parts){
   const base=part.getBoundingClientRect(),relative=el=>{const r=el.getBoundingClientRect();return {x:r.x-base.x,y:r.y-base.y,w:r.width,h:r.height};},a=relative(heading);
   svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);svg.replaceChildren();
   const cards=[...branchHost.children].filter(el=>el.matches('.source-card,.comparison-table'));
   const boxes=cards.map(relative),stacked=getComputedStyle(branchHost).gridTemplateColumns.split(' ').length===1,narrow=getComputedStyle(part).display==='block';
   const add=(d,c,kind='branch')=>{const path=svgEl('path',{d,class:`figure-edge edge-${kind}`,fill:'none',stroke:`var(--colour-${c})`});svg.append(path);};
   for(let j=0;j<boxes.length;j++){
    const b=boxes[j],c=section.cards[j]?.colour||section.colour,previous=boxes[j-1];
    if(section.layout==='sequence'&&j>0){
     if(Math.abs(previous.y-b.y)<3){const x1=previous.x+previous.w+2,x2=b.x-3,y=b.y+Math.min(previous.h,b.h)/2;add(`M${x1},${y} H${x2} m-5,-4 5,4 -5,4`,c,'sequence');}
     else{const x=b.x+b.w/2,y1=previous.y+previous.h+2,y2=b.y-3;add(`M${x},${y1} V${y2} m-4,-5 4,5 4,-5`,c,'sequence');}
    }else if(narrow&&stacked&&window.innerWidth<=760){
     const rail=8,start=a.y+a.h+2,end=b.y+b.h/2;add(`M${rail},${start} V${end} H${b.x-3}`,c);
    }else{
     const targetX=b.x+b.w/2,top=b.y-15;
     if(narrow){const startX=a.x+a.w/2,startY=a.y+a.h+2;if(b.y>boxes[0].y+3)add(`M${startX},${startY} V${startY+8} H-8 V${top} H${targetX} V${b.y-3}`,c);else add(`M${startX},${startY} V${top} H${targetX} V${b.y-3}`,c);}
     else{const startX=a.x+a.w+2,startY=a.y+a.h/2,rail=startX+14;add(`M${startX},${startY} H${rail} V${top} H${targetX} V${b.y-3}`,c);}
    }
   }
  }
 });}
 const observer=new ResizeObserver(draw);observer.observe(graph);parts.forEach(p=>{observer.observe(p.part);observer.observe(p.branchHost);});
 draw();cleanup=()=>{observer.disconnect();cancelAnimationFrame(frame);};
 return gaps.length;
}
