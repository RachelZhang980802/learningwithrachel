import { designs } from './atlas-designs.js?v=article02-evaluation-v2';

const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const button=(cls,text)=>{const el=make('button',cls,text);el.type='button';return el;};
const NS='http://www.w3.org/2000/svg';
const svgEl=(tag,attrs={})=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el;};
const paragraphLabel=ids=>{const sorted=[...new Set(ids)].sort((a,b)=>a-b),r=[];for(let i=0;i<sorted.length;i++){const start=sorted[i];let end=start;while(sorted[i+1]===end+1)end=sorted[++i];r.push(start===end?start:`${start}–${end}`);}return `¶ ${r.join(', ')}`;};
const referenceLabel = ([paragraph, start, end = start]) => {
 if (start === undefined) return String(paragraph);
 const range = start === end ? start : `${start}–${end}`;
 return `${paragraph}[${range}]`;
};
const evidenceLabel = ({ paragraphs, references }) => references?.some(([, start]) => start !== undefined)
 ? `¶ ${references.map(referenceLabel).join(', ')}`
 : paragraphLabel(paragraphs);
let cleanup=()=>{};

export function renderWorksheet(host,data,source={}){
 cleanup();host.replaceChildren();
 const design=designs[data.id],figure=data.figure,gaps=[],panels=[],parts=[];
 const argument=figure.presentation==='argument';
 const englishOnly=data.id==='02';
 const paper=make('article',`reading-atlas figure-atlas atlas-${design.pattern}${argument?' argument-atlas':''}`);
 paper.lang='en';paper.dataset.article=data.id;paper.dataset.pattern=design.pattern;
 design.palette.forEach((c,i)=>paper.style.setProperty(`--colour-${i+1}`,c));
 design.fills.forEach((c,i)=>paper.style.setProperty(`--fill-${i+1}`,c));
 const header=make('header','figure-header');
 header.append(make('span','figure-issue',`READING MAP / ${data.id}`),make('h2',null,data.title));
 const route=make(argument?'nav':'div','figure-route');route.setAttribute('aria-label','Main writing branches');
 if(argument)header.append(make('p','argument-deck','Phenomenon → PEEE → Conclusion'));
 figure.sections.forEach((s,i)=>{
  const chip=argument?jumpLink('figure-route-step',s.title,s.id):make('span','figure-route-step',s.title);
  colour(chip,s.colour);
  chip.prepend(make('b',null,String(i+1).padStart(2,'0')));route.append(chip);
 });
 header.append(route);
 const toolbar=make('div','figure-toolbar'),progress=make('span','figure-progress'),reset=button('figure-action',englishOnly?'Reset':'重置');
 toolbar.append(make('span','figure-hint',englishOnly?'10 blanks · click a blank to reveal the answer · use parent headings to hide or show the next layer':'10 个空格 · 点击空格显隐答案 · 点击分支标题查看中文'),progress,reset);
 header.append(toolbar);paper.append(header);
 const graph=make('div','figure-graph atlas-graph');graph.setAttribute('aria-label','Reading framework with clickable answer gaps');paper.append(graph);
 const status=make('span','screen-reader-only');status.setAttribute('role','status');
 function anchor(el,id){el.id=`map-${id}`;el.tabIndex=-1;}
 function jumpLink(cls,label,id){
  const link=make('a',cls,label);
  const targetId=`map-${id}`;link.href=`#${targetId}`;
  link.onclick=event=>{
   const target=document.getElementById(targetId);
   if(!target)return;
   event.preventDefault();
   target.focus({preventScroll:true});
   target.scrollIntoView({block:'start'});
  };
  return link;
 }
 function zhLabel(cls,label){const el=make('span',cls,label);el.lang='zh-CN';return el;}
 function transition({cue,label}){
  const el=make('p','argument-transition');
  el.append(make('i','argument-cue',cue),make('span','argument-label',label));return el;
 }
 function colour(el,n){el.style.setProperty('--node-colour',`var(--colour-${n})`);el.style.setProperty('--node-fill',`var(--fill-${n})`);el.dataset.colour=n;}
 function update(){progress.textContent=`${gaps.filter(g=>g.open).length} / ${gaps.length}`;reset.disabled=!gaps.some(g=>g.open)&&!panels.some(p=>!p.content.hidden);}
 function setGap(g,open){g.open=open;g.el.classList.toggle('is-revealed',open);g.el.setAttribute('aria-pressed',String(open));g.answer.setAttribute('aria-hidden',String(!open));g.el.setAttribute('aria-label',open?`Hide answer ${g.number}: ${g.value}`:`Reveal answer ${g.number}`);}
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
  for (const item of items) {
   const li=make('li',item.children?'figure-bullet-group':null),text=make('span','figure-bullet-text');
   if(item.id)anchor(li,item.id);
   fillText(text,item.text);
   li.append(text);
   if(item.cue)li.append(make('i','argument-cue',item.cue));
   if (item.references) {
    const paragraphs = item.references.map(([paragraph]) => paragraph);
    li.append(make('span','figure-bullet-evidence',evidenceLabel({ paragraphs, references: item.references })));
   }
   if (item.children) {
    const childList=bullets(item.children),toggle=button('figure-bullet-toggle','−');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Hide child points');
    const childId=`bullet-children-${gaps.length}-${Math.random().toString(36).slice(2)}`;
    toggle.setAttribute('aria-controls',childId);childList.id=childId;
    toggle.onclick=()=>{
     const hidden=childList.hidden;
     childList.hidden=!hidden;
     toggle.textContent=hidden?'＋':'−';
     toggle.setAttribute('aria-expanded',String(hidden));
     toggle.setAttribute('aria-label',hidden?'Show child points':'Hide child points');
    };
    li.append(toggle,childList);
   }
   if(item.related){
    const link=jumpLink('argument-related',item.related.label,item.related.target);
    li.append(link);
   }
   ul.append(li);
  }
  return ul;
 }
 function attachTranslation(trigger,container,item){
  if(englishOnly) return;
  const content=make('div','figure-translation');content.id=`${item.id}-zh`;content.hidden=true;
  const zh=make('p','figure-zh',item.zh);zh.lang='zh-CN';content.append(zh);
  const excerpt=make('details','atlas-original'),summary=make('summary',null,`查看对应原文 · ${evidenceLabel(item)}`),body=make('div');
  excerpt.append(summary,body);content.append(excerpt);container.append(content);
  excerpt.addEventListener('toggle', () => {
   if (!excerpt.open || body.childElementCount) return;
   const references = item.references ?? item.paragraphs.map(paragraph => [paragraph]);
   for (const reference of references) {
    const [paragraph, start, end = start] = reference;
    const original = source.paragraphs?.[paragraph - 1];
    if (!original) continue;
    const starts = figure.sentenceStarts?.[paragraph - 1];
    const text = start === undefined || !starts ? original : original.slice(starts[start - 1], starts[end]).trim();
    const quote = make('blockquote');
    quote.append(make('small',null,`¶ ${referenceLabel(reference)}`), make('p',null,text));
    body.append(quote);
   }
  });
  trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',content.id);
  trigger.onclick=()=>{
   const open=content.hidden;
   for(const panel of panels){panel.content.hidden=true;panel.trigger.setAttribute('aria-expanded','false');panel.container.classList.remove('is-selected');panel.excerpt.open=false;}
   content.hidden=!open;trigger.setAttribute('aria-expanded',String(open));container.classList.toggle('is-selected',open);
   status.textContent=open?item.zh:'译文已收起';update();
  };
  panels.push({content,trigger,container,excerpt});
 }
 function card(item,i,section,grouped=false){
  const el=make('section',`figure-node source-card${item.wide?' is-wide':''}`);el.dataset.stage=item.id;el.dataset.sourceIds=item.sourceIds.join(' ');colour(el,item.colour);
  if(argument)anchor(el,item.id);
  if(item.comparison)el.classList.add('argument-comparison');
  const head=make(argument?(grouped?'h5':'h4'):'div','figure-node-heading'),title=button('figure-node-title');
  if(!argument)title.append(make('span','branch-order',`${section+1}.${i+1}`));
  title.append(make('span',null,item.title));
  head.append(title);el.append(head);
  const content=make('div','figure-node-content');content.id=`${item.id}-content`;content.append(make('span','branch-evidence',evidenceLabel(item)),bullets(item.bullets));el.append(content);
  if(englishOnly && argument){
   title.setAttribute('aria-expanded','true');title.setAttribute('aria-controls',content.id);
   title.onclick=()=>{const hidden=content.hidden;content.hidden=!hidden;title.setAttribute('aria-expanded',String(hidden));};
  }else attachTranslation(title,el,item);
  return el;
 }
 figure.sections.forEach((section,i)=>{
  const part=make('section',`source-part layout-${section.layout}`);part.dataset.part=section.id;part.dataset.sourceIds=section.sourceIds.join(' ');colour(part,section.colour);
  const svg=argument?null:svgEl('svg',{class:'part-connections','aria-hidden':'true'});
  if(svg)part.append(svg);
  if(argument)anchor(part,section.id);
  const heading=make('header','source-part-heading');
  heading.append(make('span','part-number',argument?String(i+1).padStart(2,'0'):`PART ${String(i+1).padStart(2,'0')}`),make('h3',null,section.title));
  if(section.label)heading.append(make('span','argument-stage-label',section.label));
  heading.append(make('span','part-evidence',evidenceLabel(section)));
  const branchHost=make('div',`source-branches columns-${section.columns}`);branchHost.id=`${section.id}-branches`;
  if(argument){
   const toggle=button('figure-section-toggle','−');
   toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-controls',branchHost.id);toggle.setAttribute('aria-label','Hide this layer');
   toggle.onclick=()=>{const hidden=branchHost.hidden;branchHost.hidden=!hidden;toggle.textContent=hidden?'＋':'−';toggle.setAttribute('aria-expanded',String(hidden));toggle.setAttribute('aria-label',hidden?'Show this layer':'Hide this layer');};
   heading.append(toggle);
  }
  part.append(heading,branchHost);
  if(section.layout==='comparison'){
   branchHost.classList.add('source-comparison');
   const table=make('table','comparison-table');
   const caption=make('caption'),toggle=button('figure-node-title','The same details · two readings');caption.append(toggle);table.append(caption);
   const thead=make('thead'),tr=make('tr');section.headers.forEach((text,i)=>{const th=make('th',null,text);th.scope='col';colour(th,section.pairColours[i]);tr.append(th);});thead.append(tr);table.append(thead);
   const tbody=make('tbody');section.pairs.forEach(pair=>{const row=make('tr');['left','right'].forEach((key,i)=>{const td=make('td');colour(td,section.pairColours[i]);const ul=make('ul','figure-bullets'),li=make('li');fillText(li,pair[key]);ul.append(li);td.append(ul);row.append(td);});tbody.append(row);});table.append(tbody);branchHost.append(table);
   attachTranslation(toggle,branchHost,section);
  }else if(section.groups){
   branchHost.classList.add('argument-groups');
   for(const group of section.groups){
    const lane=make('section','argument-group');colour(lane,group.colour);
    const groupHeading=make('header','argument-group-heading');
    groupHeading.append(make('h4',null,group.title),make('span','argument-label',group.label));
    const groupBody=make('div','argument-group-body'),groupToggle=button('figure-group-toggle','−');
    groupToggle.setAttribute('aria-expanded','true');groupToggle.setAttribute('aria-label','Hide this layer');
    groupHeading.append(groupToggle);lane.append(groupHeading);
    for(const [j,item] of section.cards.entries()){
     if(!group.cards.includes(item.id))continue;
     if(item.transition)lane.append(transition(item.transition));
     if(item.transition)groupBody.append(lane.lastElementChild);
     groupBody.append(card(item,j,i,true));
    }
    groupBody.id=`${section.id}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    groupToggle.setAttribute('aria-controls',groupBody.id);
    groupToggle.onclick=()=>{const hidden=groupBody.hidden;groupBody.hidden=!hidden;groupToggle.textContent=hidden?'＋':'−';groupToggle.setAttribute('aria-expanded',String(hidden));groupToggle.setAttribute('aria-label',hidden?'Show this layer':'Hide this layer');};
    lane.append(groupBody);
    branchHost.append(lane);
   }
  }else section.cards.forEach((item,j)=>branchHost.append(card(item,j,i)));
  if(section.transition)graph.append(transition(section.transition));
  graph.append(part);
  if(svg)parts.push({part,heading,branchHost,svg,section});
 });
 reset.onclick=()=>{gaps.forEach(g=>setGap(g,false));panels.forEach(p=>{p.content.hidden=true;p.trigger.setAttribute('aria-expanded','false');p.container.classList.remove('is-selected');p.excerpt.open=false;});update();};
 const footer=make('footer','figure-footer'),sourceButton=button('figure-source',englishOnly?'Source map ↗':'原始导图 ↗');
 sourceButton.onclick=()=>document.dispatchEvent(new CustomEvent('atlas-source-map'));
 footer.append(make('span',null,argument?'Phenomenon → PEEE → Conclusion':'主分支 → 子分支 → 要点 / 例证'),sourceButton);paper.append(footer,status);host.append(paper);update();
 if(!parts.length){cleanup=()=>{};return gaps.length;}
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
