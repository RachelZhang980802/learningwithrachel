"use client";
import { useState } from "react";

type Chapter = "contents" | "preamble" | "articles" | "amendments";
const goals = ["form a more perfect Union","establish Justice","insure domestic Tranquility","provide for the common defence","promote the general Welfare","secure the Blessings of Liberty"];
const articleTopics = [
  {title:"Two Houses", label:"BICAMERAL CONGRESS", question:"Why does Congress have two houses instead of one?", body:"The House represents people according to state population. The Senate gives every state two seats. Together, they balance population and state equality.", visual:<div className="houses"><div><b>HOUSE</b><strong>435</strong><span>population · 2 years</span></div><i>+</i><div><b>SENATE</b><strong>100</strong><span>2 per state · 6 years</span></div></div>},
  {title:"Separation of Powers", label:"THREE BRANCHES", question:"How can power be divided without stopping government from working?", body:"Legislative power makes laws, executive power enforces them, and judicial power interprets them. Checks and balances connect the three branches.", visual:<div className="branches-v"><span>LEGISLATIVE<small>makes laws</small></span><span>EXECUTIVE<small>enforces laws</small></span><span>JUDICIAL<small>interprets laws</small></span></div>},
  {title:"Federalism", label:"TWO LEVELS", question:"Why divide authority between the nation and the states?", body:"Federalism distributes governmental power between the national government and state governments. Some powers are national, some are reserved to states, and some are shared.", visual:<div className="federal"><span>FEDERAL<br/>GOVERNMENT</span><i>↔</i><span>STATE<br/>GOVERNMENTS</span></div>}
];
const amendments = {
  "1":{year:"1791",title:"Five Freedoms",keys:["religion","speech","press","assembly","petition"],body:"Protects five fundamental freedoms from government interference."},
  "2":{year:"1791",title:"Keep and Bear Arms",keys:["arms","militia","interpretation"],body:"Connects the right to keep and bear arms with the historical language of a “well regulated Militia.” Its interpretation remains contested."},
  "13":{year:"1865",title:"Abolition",keys:["slavery","involuntary servitude","exception"],body:"Abolished slavery and involuntary servitude, except as punishment for a crime."},
  "14":{year:"1868",title:"Citizenship and Equality",keys:["citizenship","due process","equal protection"],body:"Defined national citizenship and prohibited states from denying due process or equal protection of the laws."},
  "15":{year:"1870",title:"Race and Voting Rights",keys:["race","color","previous servitude"],body:"Prohibited denying the right to vote on account of race, color, or previous condition of servitude—although discriminatory practices continued."},
  "19":{year:"1920",title:"Sex and Voting Rights",keys:["sex","vote","suffrage"],body:"Prohibited denying the right to vote on account of sex."},
  "27":{year:"1992",title:"Congressional Pay",keys:["1789 proposal","election","1992 ratification"],body:"Congressional salary changes cannot take effect until after an election. It took more than 200 years to ratify."}
};

export default function Home(){
  const [chapter,setChapter]=useState<Chapter>("contents"); const [article,setArticle]=useState(0); const [amendment,setAmendment]=useState<keyof typeof amendments>("1"); const [reveal,setReveal]=useState(false); const item=amendments[amendment];
  const go=(next:Chapter)=>{setChapter(next);setReveal(false);window.scrollTo({top:0,behavior:"smooth"})};
  return <main className="shell">
    <header><div className="book">▥</div><div><b>SCHOLAR’S CATALOGUE</b><span>A Close Reading of the American Constitution</span></div><button onClick={()=>go("contents")}>CONSTITUTION · CONTENTS</button></header>
    {chapter==="contents"&&<section className="contents">
      <div className="title"><p>CONSTITUTION MAP</p><h1>The American Constitution</h1><span>Begin with the document’s architecture. Open a section to read more closely.</span></div>
      <div className="toc-folio">
        <button className="toc-page pre" onClick={()=>go("preamble")}><small>PART I</small><h2>Preamble</h2><em>The Promise</em><p>What does the nation promise?</p><div className="script">We the People</div><strong>OPEN PREAMBLE →</strong></button>
        <button className="toc-page art" onClick={()=>go("articles")}><small>PART II</small><h2>Seven Articles</h2><em>The Structure</em><p>How is government organized?</p><div className="mini-tree"><i/><span>LEGISLATIVE</span><span>EXECUTIVE</span><span>JUDICIAL</span></div><strong>EXPLORE 3 IDEAS →</strong></button>
        <button className="toc-page amend" onClick={()=>go("amendments")}><small>PART III</small><h2>27 Amendments</h2><em>The Change</em><p>How have rights and rules changed?</p><div className="selected"><span>1</span><span>2</span><span>13</span><span>14</span><span>15</span><span>19</span><span>27</span></div><strong>READ 7 SELECTED →</strong></button>
      </div>
    </section>}

    {chapter==="preamble"&&<section className="chapter preamble-chapter">
      <ChapterHead no="I" label="THE PROMISE" title="Preamble" back={()=>go("contents")}/>
      <div className="preamble-grid"><article className="document"><p className="script">We the People</p><p>of the United States, in Order to <mark>form a more perfect Union</mark>, <mark>establish Justice</mark>, <mark>insure domestic Tranquility</mark>, <mark>provide for the common defence</mark>, <mark>promote the general Welfare</mark>, and <mark>secure the Blessings of Liberty</mark> to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.</p></article><aside><p className="eyebrow">READING THE PREAMBLE</p><h3>Authority. Purpose. Promise.</h3><dl><div><dt>Source of authority</dt><dd>“We the People”</dd></div><div><dt>Purpose</dt><dd>Six constitutional goals</dd></div><div><dt>Promise</dt><dd>A more united, just, peaceful, and free political community</dd></div></dl></aside></div>
      <div className="goal-strip">{goals.map((g,i)=><div key={g}><span>0{i+1}</span>{g}</div>)}</div>
      <div className={`think ${reveal?"revealed":""}`}><p>THINK</p><h3>Did “We the People” describe a political reality—or an unfinished promise?</h3>{reveal&&<div><b>REVEAL</b><p>The words sound universal, but political participation in 1787 excluded many people. The Constitution’s later amendments would repeatedly redefine who belonged and what equality required.</p></div>}<button onClick={()=>setReveal(!reveal)}>{reveal?"CLOSE REVEAL":"REVEAL READING NOTE"}</button></div>
    </section>}

    {chapter==="articles"&&<section className="chapter articles-chapter">
      <ChapterHead no="II" label="THE STRUCTURE" title="Seven Articles" back={()=>go("contents")}/><p className="intro">The seven Articles establish the federal government. For this brief reading, explore three structural ideas rather than every Article clause by clause.</p>
      <nav className="subnav">{articleTopics.map((t,i)=><button className={article===i?"active":""} onClick={()=>setArticle(i)} key={t.title}><span>0{i+1}</span>{t.title}</button>)}</nav>
      <article className="concept"><div><p className="eyebrow">{articleTopics[article].label}</p><h2>{articleTopics[article].title}</h2><p>{articleTopics[article].body}</p><blockquote>{articleTopics[article].question}</blockquote></div><div className="concept-visual">{articleTopics[article].visual}</div></article>
    </section>}

    {chapter==="amendments"&&<section className="chapter amendments-chapter">
      <ChapterHead no="III" label="THE CHANGE" title="Selected Amendments" back={()=>go("contents")}/><p className="intro">The Constitution has 27 amendments. This reading follows seven that changed American rights, citizenship, voting, and the rules of government.</p>
      <nav className="timeline-nav">{Object.entries(amendments).map(([n,a])=><button key={n} className={amendment===n?"active":""} onClick={()=>{setAmendment(n as keyof typeof amendments);setReveal(false)}}><span>{a.year}</span><b>{n}</b><small>{n==="1"?"st":n==="2"?"nd":n==="13"?"th":n==="14"?"th":n==="15"?"th":n==="19"?"th":"th"}</small></button>)}</nav>
      <article className="amendment-card"><div className="amendment-number"><span>AMENDMENT</span><strong>{amendment}</strong><em>{item.year}</em></div><div className="amendment-copy"><p className="eyebrow">WHAT CHANGED?</p><h2>{item.title}</h2><p>{item.body}</p><div className="keywords">{item.keys.map(k=><span key={k}>{k}</span>)}</div></div></article>
      {amendment==="13"&&<section className="context-file"><div><p className="eyebrow">HISTORICAL CONTEXT · BEFORE ABOLITION</p><h2>The Three-Fifths Compromise</h2><p>The original Constitution counted enslaved people as three-fifths of a person for representation and direct taxation. They were counted to increase political representation, but they were not represented as rights-bearing citizens.</p><small>Article I, Section 2, Clause 3—not part of the 13th Amendment.</small></div><div className="fraction"><strong>3</strong><i/><strong>5</strong><span>counted<br/>not represented</span></div><button onClick={()=>setReveal(!reveal)}>{reveal?"CLOSE":"THINK →"}</button>{reveal&&<blockquote>Were enslaved people being represented—or being used to increase the political power of slaveholding states?</blockquote>}</section>}
      {amendment==="27"&&<div className="surprise"><span>PROPOSED</span><strong>1789</strong><i>→ more than 200 years →</i><strong>1992</strong><span>RATIFIED</span></div>}
    </section>}
  </main>
}

function ChapterHead({no,label,title,back}:{no:string,label:string,title:string,back:()=>void}){return <div className="chapter-head"><button onClick={back}>← CONTENTS</button><p>PART {no} · {label}</p><h1>{title}</h1></div>}
