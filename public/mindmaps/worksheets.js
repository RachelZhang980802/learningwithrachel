const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const NS='http://www.w3.org/2000/svg';
function svgEl(tag,attrs){const el=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));return el;}
function fillText(text,counter){
  const frag=document.createDocumentFragment();let start=0;
  for(const match of text.matchAll(/\[\[([^\]]+)\]\]/g)){
    frag.append(document.createTextNode(text.slice(start,match.index)));
    const number=counter.value++,answer=match[1],button=make('button','atlas-gap');button.type='button';
    const index=make('sup','atlas-gap-number',String(number).padStart(2,'0'));index.setAttribute('aria-hidden','true');
    const answerText=make('span','atlas-gap-answer','\u00a0');button.append(index,answerText);button.setAttribute('aria-pressed','false');button.setAttribute('aria-label',`Reveal answer ${number}`);
    button.onclick=()=>{const open=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(open));button.setAttribute('aria-label',open?`Hide answer ${number}: ${answer}`:`Reveal answer ${number}`);answerText.textContent=open?answer:'\u00a0';};
    frag.append(button);start=match.index+match[0].length;
  }
  frag.append(document.createTextNode(text.slice(start)));return frag;
}
function connectStage(grid,kind,key){
  const svg=svgEl('svg',{'aria-hidden':'true',class:'atlas-links'});grid.prepend(svg);
  const draw=()=>{
    const bounds=grid.getBoundingClientRect();if(!bounds.width)return;
    const cards=[...grid.querySelectorAll('.atlas-node')].map(el=>{const r=el.getBoundingClientRect();return{x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height};});
    const width=bounds.width,height=bounds.height;svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.replaceChildren();
    const defs=svgEl('defs',{}),marker=svgEl('marker',{id:`atlas-arrow-${key}`,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'});marker.append(svgEl('path',{d:'M1 1 L9 5 L1 9',fill:'none',stroke:'currentColor','stroke-width':1.8}));defs.append(marker);svg.append(defs);
    const line=(d,arrow=true)=>svg.append(svgEl('path',{d,fill:'none',stroke:'currentColor','stroke-width':1.35,...(arrow?{'marker-end':`url(#atlas-arrow-${key})`}:{})}));
    const stacked=cards.length>1&&Math.abs(cards[0].x-cards[1].x)<2;
    if(kind==='sequence'){
      cards.slice(0,-1).forEach((r,i)=>{const b=cards[i+1];line(stacked?`M${r.x+r.w/2},${r.y+r.h+3} V${b.y-5}`:`M${r.x+r.w+3},${r.y+r.h/2} H${(r.x+r.w+b.x)/2} V${b.y+b.h/2} H${b.x-5}`);});
    }else if(cards.length>1){
      if(stacked){
        const x=10;line(`M${x},${cards[0].y+cards[0].h/2} V${cards.at(-1).y+cards.at(-1).h/2}`,false);
        cards.forEach(r=>line(`M${x},${r.y+r.h/2} H${r.x-5}`,false));
      }else{
        const centers=cards.map(r=>r.x+r.w/2),mid=width/2,top=10,bottom=height-10;
        line(`M${mid},0 V${top} M${centers[0]},${top} H${centers.at(-1)}`,false);
        cards.forEach((r,i)=>{line(`M${centers[i]},${top} V${r.y-5}`);line(`M${centers[i]},${r.y+r.h+3} V${bottom}`,false);});
        line(`M${centers[0]},${bottom} H${centers.at(-1)} M${mid},${bottom} V${height}`,false);
      }
    }
  };
  const observer=new ResizeObserver(draw);observer.observe(grid);grid.querySelectorAll('.atlas-node').forEach(el=>observer.observe(el));
  requestAnimationFrame(draw);return ()=>observer.disconnect();
}
let cleanup=[];
export function renderWorksheet(host,data){
  cleanup.forEach(fn=>fn());cleanup=[];host.replaceChildren();const counter={value:1};
  const paper=make('article','reading-atlas');paper.lang='en';
  const header=make('header','atlas-header');const meta=make('div','atlas-meta');meta.append(make('span',null,`READING ATLAS / ${data.id}`),make('span',null,'TRACE · CONNECT · RECALL'));
  header.append(meta,make('h2',null,data.title),make('p','atlas-subtitle',data.subtitle));
  header.append(make('p','atlas-help','Click a gap to reveal its answer. Click again to hide it.'));paper.append(header);
  for(const [i,stage] of data.stages.entries()){
    if(i){const bridge=make('div','atlas-bridge');bridge.append(make('span',null,stage.relation||'leads to'));paper.append(bridge);}
    const section=make('section',`atlas-stage atlas-stage-${stage.kind}`);section.setAttribute('aria-labelledby',`${stage.id}-heading`);
    const heading=make('header','atlas-stage-heading'),title=make('h3',null,stage.title.replace(/^\d+\s*·\s*/,''));title.id=`${stage.id}-heading`;
    heading.append(make('span','atlas-stage-index',String(i+1).padStart(2,'0')),title);
    if(stage.kind!=='sequence')heading.append(make('span','atlas-stage-kind',stage.kind==='contrast'?'COMPARISON':'READ TOGETHER'));
    section.append(heading);const grid=make('div',`atlas-nodes atlas-nodes-${stage.kind}`);grid.style.setProperty('--columns',String(stage.nodes.length));
    stage.nodes.forEach((n,j)=>{const node=make('div',`atlas-node atlas-tone-${n.tone||'blue'}`);node.dataset.node=n.id;const label=make('div','atlas-node-label');label.append(make('span','atlas-node-index',stage.kind==='sequence'?String(j+1).padStart(2,'0'):String.fromCharCode(65+j)),make('h4',null,n.label));const p=make('p');p.append(fillText(n.text,counter));node.append(label,p);grid.append(node);});
    section.append(grid);paper.append(section);
  }
  const footer=make('footer','atlas-footer');footer.append(make('span',null,`${counter.value-1} gaps · ${data.stages.length} connected stages`),make('span',null,'Return to the text. Follow the evidence.'));paper.append(footer);host.append(paper);
  paper.querySelectorAll('.atlas-nodes').forEach((grid,i)=>cleanup.push(connectStage(grid,data.stages[i].kind,`${data.id}-${i}`)));
  return counter.value-1;
}
