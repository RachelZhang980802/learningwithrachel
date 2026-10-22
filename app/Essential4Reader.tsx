"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UniversityFooter } from "./UniversityFooter";
import "./essential4.css";

type Topic={id:string;title:string;units:number[];extras:string[];note?:string;coverage?:string};
type Article={id:string;unit:number;title:string;topics:Topic[]};
type Run={text:string;box:number[];size:number;bold:boolean;italic:boolean;color:string;blank?:boolean};
type Answer={id:string;exercise:string;number:string;x:number;y:number;after:number;answer:string;keyPages:number[];note:string};
type Page={pdf:number;unit:number;kind:string;width:number;height:number;spans:Run[];controls:Answer[];top?:number;bottom?:number;label?:string};
type Data={edition:string;articles:Article[];pages:Record<string,Page>;extraPages:Record<string,Page>};
const base="/essential-grammar-4/";
function BookPage({page,onSource}:{page:Page;onSource:(n:number)=>void}){
 const [open,setOpen]=useState<Set<string>>(new Set());const ref=useRef<HTMLDivElement>(null);
 const start=page.top??0;const end=page.bottom??page.height;
 const cuts=[...new Set([start,...page.controls.map(c=>Math.min(end,Math.max(start,c.after))),end])].sort((a,b)=>a-b);
 useEffect(()=>{setOpen(new Set());},[page.pdf]);
 useEffect(()=>{
  const fit=()=>ref.current?.querySelectorAll<HTMLElement>('.eg4-run').forEach(el=>{const text=el.firstElementChild as HTMLElement;if(!text)return;text.style.transform='none';const target=el.getBoundingClientRect().width;const natural=text.getBoundingClientRect().width;if(natural>0)text.style.transform=`scaleX(${target/natural})`;});
  fit();const ro=new ResizeObserver(fit);if(ref.current)ro.observe(ref.current);return()=>ro.disconnect();
 },[page]);
 return <div className="eg4-viewport" tabIndex={0} aria-label="Text edition of the original page; scroll horizontally on small screens"><div ref={ref} className="eg4-paper" data-pdf-page={page.pdf}>
 {cuts.slice(0,-1).map((top,i)=>{const bottom=cuts[i+1];const answers=page.controls.filter(c=>Math.min(end,Math.max(start,c.after))===bottom);return <Fragment key={`${page.pdf}-${top}`}>
 <div className="eg4-fragment" style={{aspectRatio:`${page.width} / ${bottom-top}`,backgroundImage:`url(${base}assets/art-${page.pdf}.webp)`,backgroundSize:`100% ${page.height/(bottom-top)*100}%`,backgroundPosition:`0 ${top===0?0:top/(page.height-(bottom-top))*100}%`}}>
 {page.spans.filter(s=>s.box[1]>=top&&s.box[1]<bottom).map((s,j)=><span className={`eg4-run${s.blank?" eg4-blank":""}`} key={j} style={{left:`${s.box[0]/page.width*100}%`,top:`${(s.box[1]-top)/(bottom-top)*100}%`,width:`${(s.box[2]-s.box[0])/page.width*100}%`,fontSize:`${s.size/page.width*100}cqw`,fontWeight:s.bold?700:400,fontStyle:s.italic?'italic':'normal',color:s.color}}><span>{s.blank?" ":s.text}</span></span>)}
 {page.controls.filter(c=>c.y>=top&&c.y<bottom).map(c=><button className="eg4-flag" key={c.id} type="button" style={{left:`${c.x/page.width*100}%`,top:`${(c.y-top)/(bottom-top)*100}%`}} aria-label={`Answer ${c.exercise}, item ${c.number}`} aria-expanded={open.has(c.id)} aria-controls={`eg4-answer-${c.id}`} onClick={()=>setOpen(old=>{const next=new Set(old);next.has(c.id)?next.delete(c.id):next.add(c.id);return next;})}>⚑</button>)}
 </div>
 {answers.map(c=><div className="eg4-answer" id={`eg4-answer-${c.id}`} key={c.id} hidden={!open.has(c.id)} data-answer-id={c.id}><strong>Answer · {c.exercise}{c.number==='group'?'':` (${c.number})`}</strong>{c.note&&<small>{c.note}</small>}<p>{c.answer}</p><button type="button" onClick={()=>onSource(c.keyPages[0])}>PDF answer key · page {c.keyPages.join(', ')} ↗</button></div>)}
 </Fragment>})}
 </div></div>
}
type InlineSlot=Answer&{sx:number;ex:number;sy:number};
type InlineRow={top:number;bottom:number;spans:Run[];slots:InlineSlot[]};
function InlineBookPage({page}:{page:Page&{inlineRows?:InlineRow[];inlineSpans?:Run[];inlineArt?:string}}){
 const [open,setOpen]=useState<Set<string>>(new Set());
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{setOpen(new Set());},[page]);
 useEffect(()=>{const fit=()=>ref.current?.querySelectorAll<HTMLElement>('.eg4-run,.eg4-flow-text').forEach(el=>{const t=el.firstElementChild as HTMLElement;if(!t)return;t.style.transform='none';const w=t.getBoundingClientRect().width;if(w)t.style.transform=`scaleX(${el.getBoundingClientRect().width/w})`;});fit();const ro=new ResizeObserver(fit);if(ref.current)ro.observe(ref.current);return()=>ro.disconnect();},[page]);
 const start=page.top??0,end=page.bottom??page.height;
 const image=`${base}assets/${page.inlineArt||`inline-${page.pdf}.webp`}`;
 const art=(top:number,bottom:number)=>({aspectRatio:`${page.width} / ${bottom-top}`,backgroundImage:`url(${image})`,backgroundSize:`100% ${page.height/(bottom-top)*100}%`,backgroundPosition:`0 ${top===0?0:top/(page.height-(bottom-top))*100}%`});
 const grid=(x:number,x2:number)=>({gridColumn:`${Math.max(1,Math.round(x/page.width*1000)+1)} / ${Math.min(1001,Math.max(Math.round(x/page.width*1000)+2,Math.round(x2/page.width*1000)+1))}`,gridRow:1});
 const spans=page.inlineSpans||[];
 const fragment=(a:number,b:number)=><div className="eg4-fragment" style={art(a,b)} key={`f-${a}`}>
 {spans.filter(s=>s.box[1]>=a&&s.box[1]<b).map((s,i)=><span className="eg4-run" key={i} style={{left:`${s.box[0]/page.width*100}%`,top:`${(s.box[1]-a)/(b-a)*100}%`,width:`${(s.box[2]-s.box[0])/page.width*100}%`,fontSize:`${s.size/page.width*100}cqw`,fontWeight:s.bold?700:400,fontStyle:s.italic?'italic':'normal',color:s.color}}><span>{s.text}</span></span>)}
 </div>;
 const children=[];let cursor=start;
 for(const row of page.inlineRows||[]){
  const top=Math.max(cursor,row.top);if(top>cursor)children.push(fragment(cursor,top));
  children.push(<div className="eg4-flow-row" key={`r-${row.top}`} style={{minHeight:`${(row.bottom-top)/page.width*100}cqw`}}>
   <div className="eg4-row-art" aria-hidden style={{...art(top,row.bottom)}}/>
   {row.spans.map((s,i)=><span className="eg4-flow-text" key={i} style={{...grid(s.box[0],s.box[2]),marginTop:`${Math.max(0,s.box[1]-top)/page.width*100}cqw`,fontSize:`${s.size/page.width*100}cqw`,fontWeight:s.bold?700:400,fontStyle:s.italic?'italic':'normal',color:s.color}}><span>{s.text}</span></span>)}
   {row.slots.map(c=><Fragment key={c.id}><button type="button" className="eg4-inline-flag" style={{...grid(c.sx,c.sx+7),marginTop:`${Math.max(0,c.sy-top)/page.width*100}cqw`}} aria-label={`Answer ${c.exercise}, item ${c.number}`} aria-expanded={open.has(c.id)} aria-controls={`eg4-inline-${c.id}`} title={`${c.exercise} (${c.number})${c.note?' · '+c.note:''}`} onClick={()=>setOpen(old=>{const n=new Set(old);n.has(c.id)?n.delete(c.id):n.add(c.id);return n;})}>⚑</button><span className="eg4-inline-slot" style={{...grid(c.sx+8,Math.max(c.sx+10,c.ex)),marginTop:`${Math.max(0,c.sy-top)/page.width*100}cqw`}}>
    <span className="eg4-live-line"><span id={`eg4-inline-${c.id}`} className="eg4-inline-answer" hidden={!open.has(c.id)}>{c.answer}</span></span>
   </span></Fragment>)}
  </div>);cursor=Math.max(cursor,row.bottom);
 }
 if(cursor<end)children.push(fragment(cursor,end));
 return <div className="eg4-viewport" tabIndex={0} aria-label="Original exercise page; scroll horizontally on small screens"><div ref={ref} className="eg4-paper eg4-inline-paper" data-pdf-page={page.pdf}>{children}</div></div>;
}

export function Essential4Reader({articleId,mode}:{articleId:string;mode:"notes"|"exercise"}){
 const[data,setData]=useState<Data|null>(null);const[error,setError]=useState('');const[topicId,setTopicId]=useState('');const[unit,setUnit]=useState(0);const[extra,setExtra]=useState('');const[source,setSource]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{fetch(base+'inline-data.json').then(r=>{if(!r.ok)throw Error('Could not load the fourth-edition pages.');return r.json();}).then(d=>{setData(d);const a=d.articles.find((x:Article)=>x.id===articleId);const id=location.hash.slice(1);const t=a.topics.find((x:Topic)=>x.id===id)||a.topics[0];const u=Number(new URLSearchParams(location.search).get('unit'));setTopicId(t.id);setUnit(t.units.includes(u)?u:t.units[0]);const e=new URLSearchParams(location.search).get('extra')||'';setExtra(t.extras.includes(e)?e:'');}).catch(e=>setError(e.message));},[articleId]);
 useEffect(()=>{const fn=()=>{const a=data?.articles.find(a=>a.id===articleId);const t=a?.topics.find(t=>t.id===location.hash.slice(1));if(t){setTopicId(t.id);setUnit(t.units[0]);setExtra('');}};window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn);},[data,articleId]);
 useEffect(()=>{if(source!==null)dialog.current?.showModal();else dialog.current?.close();},[source]);
 if(error)return <main className="eg4"><p role="alert">{error}</p></main>;
 const article=data?.articles.find(a=>a.id===articleId);const topic=article?.topics.find(t=>t.id===topicId);
 if(!data||!article||!topic)return <main className="eg4"><p>Loading Essential Grammar in Use · Fourth Edition…</p></main>;
 const normalPage=unit*2+(mode==='notes'?9:10);const page=extra&&mode==='exercise'?data.extraPages[extra]:data.pages[String(normalPage)];const n=page?.pdf||normalPage;
 function select(t:Topic,u:number){setTopicId(t.id);setUnit(u);setExtra('');history.replaceState(null,'',`?unit=${u}#${t.id}`);}
 const route=typeof window!=='undefined'&&location.pathname.includes('essential-grammar-preview')?'essential-grammar-preview':'grammar';
 const target=mode==='notes'?`/${route}/${articleId}/quiz`:`/${route}/${articleId}`;
 return <main className="eg4">
 <header className="eg4-header"><nav><Link href={`/?article=${articleId}&open=reading#text`}>← Return to reading</Link><span>UNIT {article.unit} · {article.title}</span></nav><p className="eg4-edition">ESSENTIAL GRAMMAR IN USE · FOURTH EDITION · RAYMOND MURPHY</p><h1>{mode==='notes'?'Deeper Analysis':'Supplementary Quizzes'}</h1><p>{mode==='notes'?'Original explanations, rebuilt as selectable HTML text.':'Original exercises and the answers from this edition. Select a small red flag to reveal only its corresponding answer.'}</p></header>
 <div className="eg4-layout"><aside className="eg4-index" aria-label="Grammar topics">{article.topics.map(t=><button key={t.id} type="button" aria-current={t.id===topic.id?'page':undefined} onClick={()=>select(t,t.units[0])}>{t.title}{t.coverage==='related'&&<small>Related foundations</small>}</button>)}<a href={base+'review.html'}>Edition & coverage record ↗</a></aside>
 <section className="eg4-reading"><h2>{topic.title}</h2>{topic.note&&<p className="eg4-coverage"><strong>{topic.coverage==='related'?'Related foundation — no direct unit in this edition.':'Coverage note.'}</strong> {topic.note}</p>}
 <nav className="eg4-units" aria-label="Book units">{topic.units.map(u=><button type="button" key={u} aria-current={!extra&&u===unit?'page':undefined} onClick={()=>select(topic,u)}>Unit {u}</button>)}{mode==='exercise'&&topic.extras.map(e=><button type="button" key={e} aria-current={extra===e?'page':undefined} onClick={()=>{setExtra(e);history.replaceState(null,'',`?extra=${e}#${topic.id}`);}}>{data.extraPages[e]?.label||e}</button>)}</nav>
 <div className="eg4-pagebar"><span>{extra&&mode==='exercise'?page?.label:`Unit ${unit}`} · PDF page {n} · HTML text</span><button type="button" onClick={()=>setSource(n)}>Compare original ↗</button><Link href={`${target}?unit=${unit}#${topic.id}`}>{mode==='notes'?'Exercises →':'← Explanation'}</Link></div>
 {page?(mode==='exercise'?<InlineBookPage page={page}/>:<BookPage page={page} onSource={setSource}/>):<p>Page pending verification.</p>}
 <footer className="eg4-next"><button type="button" disabled={topic.units.indexOf(unit)===0} onClick={()=>select(topic,topic.units[topic.units.indexOf(unit)-1])}>← Previous unit</button><Link href={`${target}?unit=${unit}#${topic.id}`}>{mode==='notes'?'Practise this unit →':'Review this explanation →'}</Link><button type="button" disabled={topic.units.indexOf(unit)===topic.units.length-1} onClick={()=>select(topic,topic.units[topic.units.indexOf(unit)+1])}>Next unit →</button></footer>
 </section></div>
 <UniversityFooter/>
 <dialog className="eg4-source" ref={dialog} onCancel={()=>setSource(null)} onClick={e=>{if(e.target===e.currentTarget)setSource(null);}}><header><strong>Original PDF · page {source}</strong><button type="button" onClick={()=>setSource(null)}>Close ×</button></header>{source&&<img src={`${base}assets/original-${source}.webp`} alt={`Original supplied PDF, page ${source}`}/>}</dialog>
 </main>;
}
