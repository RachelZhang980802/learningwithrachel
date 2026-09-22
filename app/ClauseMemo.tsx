"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { structureDiagram, type StructureNode } from "./structureDiagram";

type Pair = readonly [string, string];
type Labels = { clauseChinese:(label:string)=>string; functionEnglish:(label:string)=>string; functionClass:(label:string)=>string; sourceText?:string };

function clauseTitle(label: string) {
  if (/^[A-Z _-]+$/.test(label)) return label.toLowerCase().replace(/^./, character => character.toUpperCase());
  if (/宾语|内容/.test(label) && /从句/.test(label)) return "Object clause";
  if (/定语|关系/.test(label) && /从句/.test(label)) return "Relative clause";
  if (/时间/.test(label) && /从句/.test(label)) return "Temporal clause";
  if (/条件/.test(label) && /从句/.test(label)) return "Conditional clause";
  if (/让步/.test(label) && /从句|结构/.test(label)) return "Concessive clause";
  if (/原因/.test(label) && /从句/.test(label)) return "Causal clause";
  if (/比较/.test(label) && /从句/.test(label)) return "Comparative clause";
  if (/目的/.test(label) && /从句/.test(label)) return "Purpose clause";
  if (/地点/.test(label) && /从句/.test(label)) return "Locative clause";
  if (/方式/.test(label) && /从句/.test(label)) return "Manner clause";
  if (/并列主句/.test(label)) return "Coordinate main clause";
  if (/主句/.test(label)) return "Main clause";
  if (/插入/.test(label)) return "Parenthetical clause";
  if (/直接引语|引语/.test(label)) return "Direct speech";
  if (/祈使/.test(label)) return "Imperative clause";
  if (/感叹/.test(label)) return "Exclamative";
  if (/疑问|问句/.test(label)) return "Interrogative clause";
  if (/报告/.test(label)) return "Reporting clause";
  return "Clause";
}

function omittedRestoration(node: StructureNode) {
  const excerpt = node.excerpt ?? "";
  const restored = [
    ...[...excerpt.matchAll(/\[([^\]]+)\]/g)].map(match => match[1]),
    ...[...excerpt.matchAll(/（后省略\s*([^）]+)）|\(后省略\s*([^)]+)\)/g)].map(match => match[1] || match[2]),
    ...[...excerpt.matchAll(/=\s*([^，,；;]+)/g)].map(match => match[1]),
  ].map(value => value.trim()).filter(Boolean);
  if (restored.length) return restored.map(value => `（${value}）`).join(" ");
  return /省略/.test(node.label) ? "（省略）" : "";
}

// Both observers run on real text boxes, including after web fonts load or a resize.
function useBoxMeasure(ref: React.RefObject<HTMLElement | null>, measure:()=>void) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    for (const child of element.querySelectorAll('[data-word], .constituent-tag')) observer.observe(child);
    schedule();
    document.fonts.ready.then(schedule);
    // The flip transform changes visual coordinates without resizing the boxes.
    document.addEventListener("transitionend",schedule,true);
    document.addEventListener("animationend",schedule,true);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener("transitionend",schedule,true); document.removeEventListener("animationend",schedule,true); };
  }, [ref, measure]);
}

function Constituent({node,labels}:{node:StructureNode;labels:Labels}) {
  const ref = useRef<HTMLDivElement>(null);
  const [geometry,setGeometry] = useState({left:0,right:0,center:0});
  const measure = useMemo(() => () => {
    const element = ref.current, word = element?.querySelector('[data-word]');
    if (!element || !word) return;
    const range = document.createRange(); range.selectNodeContents(word);
    const box = range.getBoundingClientRect(), parent = element.getBoundingClientRect();
    const next = {left:box.left-parent.left,right:box.right-parent.left,center:(box.left+box.right)/2-parent.left};
    setGeometry(old => Math.abs(old.left-next.left)+Math.abs(old.right-next.right)<.5 ? old:next);
  },[]);
  useBoxMeasure(ref,measure);
  const text = node.text.trim();
  if (!text) return null;
  let en = labels.functionEnglish(node.label), zh = node.label, role = labels.functionClass(node.label);
  if (/^(and|but|or|yet|nor)[,;:]?$/i.test(text)) { en="Coordinating conjunction";zh="并列连词";role="linker"; }
  else if (/^that$/i.test(text) && /引导词|补语标记/.test(node.label)) { en="Complementizer";zh="补语标记";role="linker"; }
  else if (/定语从句/.test(node.label)) { en="Modifier";zh="后置定语";role="modifier"; }
  else if (/比较从句引导词/.test(node.label)) { en="Subordinator";zh="比较从句引导词";role="linker"; }
  else if (/^not only$/i.test(text)) { en="Correlative marker";zh="关联标记";role="linker"; }
  else if (/不定式.*补语|补语.*不定式/.test(node.label)) { en="Infinitival complement";role="complement"; }
  else if (/系动词/.test(node.label)) en="Linking verb";
  else if (/^表语/.test(node.label)) en="Predicative";
  else if (/^动词/.test(node.label)) { en="Verb";role="predicate"; }
  const multi = text.split(/\s+/).length>1;
  const hasQuote = /["“”]/.test(text);
  return <div ref={ref} className={`sentence-constituent ${role}`} data-constituent={node.id}>
    <span className={`sentence-diagram-text${hasQuote ? " has-quote" : ""}`} data-word={node.id}>{text}</span>
    <span className="constituent-pointer-lane" aria-hidden="true"><svg className="constituent-pointer" height="23">
      {multi && <path d={`M ${geometry.left} 2 H ${geometry.right}`} />}
      <path d={`M ${geometry.center} ${multi?2:0} V 19 m -4 -5 l 4 5 l 4 -5`} />
    </svg></span>
    <span className="sentence-diagram-tag constituent-tag"><strong lang="en">{en}</strong><small lang="zh-CN">{zh}</small></span>
  </div>;
}

function Clause({node,labels,number}:{node:StructureNode;labels:Labels;number:string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [geometry,setGeometry] = useState({path:"",vertical:false,width:0,height:0});
  const measure = useMemo(() => () => {
    const element = ref.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const rectangles = [...element.querySelectorAll('[data-word]')].flatMap(word => {
      const range = document.createRange();range.selectNodeContents(word);return [...range.getClientRects()];
    }).filter(box=>box.width>0);
    if (!rectangles.length) return;
    const lines:number[] = [];
    for (const box of rectangles) if (!lines.some(y=>Math.abs(y-box.top)<5)) lines.push(box.top);
    const vertical = lines.length>1;
    const top = Math.min(...rectangles.map(r=>r.top))-bounds.top-9;
    const left = Math.min(...rectangles.map(r=>r.left))-bounds.left;
    const right = Math.max(...rectangles.map(r=>r.right))-bounds.left;
    const leaves = [...element.querySelectorAll('.sentence-constituent')].map(el=>el.getBoundingClientRect());
    const bottom = Math.max(...leaves.map(r=>r.bottom))-bounds.top;
    const path = vertical ? `M 9 ${top} H 2 V ${bottom} H 9` : `M ${left} ${top+7} V ${top} H ${right} V ${top+7}`;
    const next = {path,vertical,width:bounds.width,height:bounds.height};
    setGeometry(old=>old.path===next.path&&old.width===next.width&&old.height===next.height?old:next);
  },[]);
  useBoxMeasure(ref,measure);
  const tone = /MAIN|主句/.test(node.label)?"main":/RELATIVE|定语|关系/.test(node.label)?"relative":/PARENTHETICAL|插入/.test(node.label)?"parenthetical":"content";
  const en = node.label === "CONTENT CLAUSE" ? "Object clause" : node.label === "EXPLANATORY MAIN CLAUSE" ? "Main clause" : node.label === "PARENTHETICAL COMPARISON" ? "Parenthetical clause" : clauseTitle(node.label);
  const governingVerb = labels.sourceText?.slice(0,node.start).match(/\b([A-Za-z]+)\s*$/)?.[1] ?? "";
  const clauseZh = node.label === "CONTENT CLAUSE" ? (governingVerb ? `${governingVerb} 的宾语从句` : "宾语从句") : node.label === "EXPLANATORY MAIN CLAUSE" ? "主句" : labels.clauseChinese(node.label);
  const antecedent = /RELATIVE CLAUSE|定语从句|关系词/.test(node.label) ? (node.excerpt?.match(/修饰\s+([^，,；;]+)/)?.[1]?.trim() ?? labels.sourceText?.slice(Math.max(0,node.start-64),node.start).match(/\b(?:the|a|an)\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,5}\s*$/)?.[0]?.trim() ?? "前面的名词") : "";
  const omission = omittedRestoration(node);
  return <section className={`sentence-clause ${tone}${geometry.vertical?" is-multiline":""}`} data-clause-id={node.id} data-clause-label={node.label}>
    <div className="sentence-clause-heading"><span className="sentence-diagram-tag clause-tag"><b>{number}</b><span lang="en">{en}</span><small lang="zh-CN">{clauseZh}</small></span>{omission && <span className="clause-omission" lang="en">{omission}</span>}{antecedent && <span className="relative-attachment"><span lang="en">modifies</span><small lang="zh-CN">先行词：{antecedent}</small></span>}</div>
    <div ref={ref} className="sentence-clause-frame">
      <svg className="clause-bracket" aria-hidden="true" width={geometry.width} height={geometry.height}><path d={geometry.path}/></svg>
      <NodeSequence nodes={node.children} labels={labels} prefix={number} />
    </div>
  </section>;
}

function Connector({node,labels}:{node:StructureNode;labels:Labels}) {
  return <div className="sentence-clause-connector" aria-label="Coordinating conjunction">
    <span className="connector-word" lang="en">{node.text.trim()}</span>
    <span className="connector-stem" aria-hidden="true">↓</span>
    <span className="sentence-diagram-tag constituent-tag"><strong lang="en">Coordinating conjunction</strong><small lang="zh-CN">并列连词</small></span>
  </div>;
}

function NodeSequence({nodes,labels,prefix=""}:{nodes:StructureNode[];labels:Labels;prefix?:string}) {
  const displayNodes = nodes.map((node, index) => {
    const previous = nodes[index - 1];
    const next = nodes[index + 1];
    if (node.kind !== "unit") return node;
    const opening = previous?.kind === "unit" ? previous.text.match(/(["“])\s*$/)?.[1] : undefined;
    if (opening) return { ...node, text: `${opening}${node.text}` };
    if (next?.kind === "unit" && /["“]\s*$/.test(node.text)) return { ...node, text: node.text.replace(/(["“])\s*$/, "") };
    return node;
  });
  const groups:(StructureNode|StructureNode[])[]=[];
  for (const node of displayNodes) {
    if (node.kind==="clause") groups.push(node);
    else {const last=groups.at(-1);if(Array.isArray(last))last.push(node);else groups.push([node]);}
  }
  let clauseIndex = 0;
  return <>{groups.map((group,index)=>Array.isArray(group) ? (group.length === 1 && /^(and|but|or|yet|nor)$/i.test(group[0].text.trim()) ? <Connector key={index} node={group[0]} labels={labels}/> : <div className="sentence-constituent-run" key={index}>{group.flatMap((node, unitIndex) => [unitIndex > 0 && /定语从句②|RELATIVE CLAUSE 2/i.test(node.label) && /^(and|but|or|yet|nor)[,;:]?$/i.test(group[unitIndex - 1].text.trim()) ? <span className="sentence-line-break" aria-hidden="true" key={`break-${node.id}`}/> : null, node.text.trim() === "—" ? <span className="sentence-punctuation" key={node.id}>—</span> : <Constituent key={node.id} node={node} labels={labels}/>])}</div>) : (() => { clauseIndex += 1; const number = prefix ? `${prefix}.${clauseIndex}` : `${clauseIndex}`; return <Clause key={group.id} node={group} labels={labels} number={number}/>; })())}</>;
}

export function StructureDiagram({parts,clauses,...labels}:{parts:readonly Pair[];clauses:readonly Pair[]}&Labels) {
  const nodes=useMemo(()=>structureDiagram(parts,clauses),[parts,clauses]);
  const sourceText = parts.map(([, text])=>text).join("");
  return <div className="sentence-diagram" aria-label="Sentence structure and grammatical functions">
    <div className="sentence-diagram-memo" aria-hidden="true">memo</div>
    <NodeSequence nodes={nodes} labels={{...labels,sourceText}}/>
  </div>;
}
