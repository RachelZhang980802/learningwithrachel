"use client";
import { Fragment, useState } from "react";
import "./american-constitution.css";

type Chapter = "contents" | "preamble" | "articles" | "amendments";
type ArticleLesson = "houses" | "separation" | "federalism";
const goals = [
  { english: "Form a more perfect Union", chinese: "建立一个更加完善的联邦" },
  { english: "Establish Justice", chinese: "确立正义" },
  { english: "Insure domestic Tranquility", chinese: "保障国内安宁" },
  { english: "Provide for the common defence", chinese: "提供共同防卫" },
  { english: "Promote the general Welfare", chinese: "促进公共福祉" },
  { english: "Secure the Blessings of Liberty", chinese: "保障当代人及后代享有自由之福祉" },
];
const washingtonReading = [
  "In 1784, five years before he became president of the United States, George Washington, 52, was nearly toothless. So he hired a dentist to transplant nine teeth into his jaw – having extracted them from the mouths of his slaves.",
  "That’s a far different image from the cherry-tree-chopping George most people remember from their history books. But recently, many historians have begun to focus on the role slavery played in the lives of the founding generation. They have been spurred in part by DNA evidence made available in 1998, which almost certainly proved Thomas Jefferson had fathered at least one child with his slave Sally Hemings. And only over the past 30 years have scholars examined history from the bottom up. Works of several historians reveal the moral compromises made by the nation’s early leaders and the fragile nature of the country’s infancy. More significantly, they argue that many of the Founding Fathers knew slavery was wrong – and yet most did little to fight it.",
  "More than anything, the historians say, the founders were hampered by the culture of their time. While Washington and Jefferson privately expressed distaste for slavery, they also understood that it was part of the political and economic bedrock of the country they helped to recreate.",
  "For one thing, the South could not afford to part with its slaves. Owning slaves was “like having a large bank account,” says Wiencek, author of An Imperfect God: George Washington, His Slaves, and the Creation of America. The southern states would not have signed the Constitution without protections for the “peculiar institution,” including a clause that counted a slave as three fifths of a man for purposes of congressional representation.",
  "And the statesmen’s political lives depended on slavery. The three-fifths formula handed Jefferson his narrow victory in the presidential election of 1800 by inflating the votes of the southern states in the Electoral College. Once in office, Jefferson extended slavery with the Louisiana Purchase in 1803; the new land was carved into 13 states, including three slave states.",
  "Still, Jefferson freed Hemings’s children – though not Hemings herself or his approximately 150 other slaves. Washington, who had begun to believe that all men were created equal after observing the bravery of the black soldiers during the Revolutionary War, overcame the strong opposition of his relatives to grant his slaves their freedom in his will. Only a decade earlier, such an act would have required legislative approval in Virginia.",
];
const washingtonParagraphMarkers = ["➊", "➋", "➌", "➍", "➎", "➏"];
const washingtonQuestions = [
  {
    prompt: "George Washington’s dental surgery is mentioned to",
    answerIndex: 3,
    choices: [
      "show the primitive medical practice in the past.",
      "demonstrate the cruelty of slavery in his days.",
      "stress the role of slaves in U.S. history.",
      "reveal some unknown aspect of his life.",
    ],
  },
  {
    prompt: "We may infer from the second paragraph that",
    answerIndex: 1,
    choices: [
      "DNA technology has been widely applied to history research.",
      "in its early days the U.S. was confronted with delicate situations.",
      "historians deliberately made up some stories of Jefferson’s life.",
      "political compromises are easily found throughout U.S. history.",
    ],
  },
  {
    prompt: "What do we learn about Thomas Jefferson?",
    answerIndex: 2,
    choices: [
      "His political view changed his attitude towards slavery.",
      "His status as a father made him free the child slaves.",
      "His attitude towards slavery was complex.",
      "His affair with a slave stained his prestige.",
    ],
  },
  {
    prompt: "Which of the following is true according to the text?",
    answerIndex: 0,
    choices: [
      "Some Founding Fathers benefit politically from slavery.",
      "Slaves in the old days did not have the right to vote.",
      "Slave owners usually had large savings accounts.",
      "Slavery was regarded as a peculiar institution.",
    ],
  },
  {
    prompt: "Washington’s decision to free slaves originated from his",
    answerIndex: 1,
    choices: [
      "moral considerations.",
      "military experience.",
      "financial conditions.",
      "political stand.",
    ],
  },
];
const amendments = {
  "1":{year:"1791",ordinal:"st",title:"Five Freedoms",keys:["religion","speech","press","assembly","petition"],body:"The First Amendment protects freedom of religion, speech, the press, peaceful assembly, and petition. It limits Congress and other government actors from abridging these freedoms.",chinese:"第一修正案保障宗教、言论、出版、和平集会和请愿五项自由。它限制国会及其他政府机构，不得无理削弱这些基本自由。"},
  "2":{year:"1791",ordinal:"nd",title:"Keep and Bear Arms",keys:["arms","militia","interpretation"],body:"The Second Amendment protects the right to keep and bear arms. Its text also refers to a well regulated militia, and its modern scope remains the subject of constitutional debate.",chinese:"第二修正案保障人民持有和携带武器的权利。条文同时提到“纪律严明的民兵”，其在今天的适用范围仍是宪法争论的一部分。"},
  "13":{year:"1865",ordinal:"th",title:"Abolition",keys:["slavery","involuntary servitude","exception"],body:"The Thirteenth Amendment abolished slavery and involuntary servitude throughout the United States. It allows involuntary servitude as punishment for a crime after conviction.",chinese:"第十三修正案在美国废除了奴隶制和非自愿劳役。被定罪后作为犯罪惩罚的强制劳动仍属于条文允许的例外。"},
  "14":{year:"1868",ordinal:"th",title:"Citizenship and Equality",keys:["citizenship","due process","equal protection"],body:"The Fourteenth Amendment made all people born or naturalized in the United States citizens. It bars states from denying due process or equal protection of the laws.",chinese:"第十四修正案规定，在美国出生或归化的人都是美国公民。它禁止各州剥夺正当法律程序，或拒绝给予法律的平等保护。"},
  "15":{year:"1870",ordinal:"th",title:"Race and Voting Rights",keys:["race","color","previous servitude"],body:"The Fifteenth Amendment bars the federal government and the states from denying a citizen’s vote because of race, color, or previous condition of servitude. Later laws and court decisions were needed to enforce that guarantee.",chinese:"第十五修正案禁止联邦政府和各州因种族、肤色或曾受奴役的状况而拒绝公民投票。后来仍需通过法律和法院判决，才能落实这项保障。"},
  "19":{year:"1920",ordinal:"th",title:"Sex and Voting Rights",keys:["sex","vote","suffrage"],body:"The Nineteenth Amendment bars the United States or any state from denying a citizen’s vote on account of sex. It recognized women’s suffrage as a constitutional right, though access remained unequal in practice.",chinese:"第十九修正案禁止美国或任何州因性别而拒绝公民投票。它把妇女参政权确认为宪法权利，但现实中的投票机会仍不平等。"},
  "27":{year:"1992",ordinal:"th",title:"Congressional Pay",keys:["1789 proposal","election","1992 ratification"],body:"The Twenty-Seventh Amendment delays congressional pay changes until after an intervening election in the House. Congress proposed it in 1789, and the states finally ratified it in 1992.",chinese:"第二十七修正案规定，国会议员薪酬的变更必须等到一次众议院选举之后才能生效。国会在1789年提出它，各州直到1992年才最终批准。"}
};

export function AmericanConstitution(){
  const [chapter,setChapter]=useState<Chapter>("contents"); const [article,setArticle]=useState<ArticleLesson>("houses"); const [amendment,setAmendment]=useState<keyof typeof amendments>("1"); const [reveal,setReveal]=useState(false); const [goalFlips,setGoalFlips]=useState<boolean[]>(() => goals.map(() => false));
  const [housesRevealed,setHousesRevealed]=useState(false); const [separationStage,setSeparationStage]=useState<"think"|"answer"|"branches"|"checks">("think"); const [structureOpen,setStructureOpen]=useState(false); const [federalismStage,setFederalismStage]=useState(0); const [federalBasisOpen,setFederalBasisOpen]=useState(false); const [federalReadingOpen,setFederalReadingOpen]=useState(false); const [readingPracticeOpen,setReadingPracticeOpen]=useState(false); const item=amendments[amendment];
  const go=(next:Chapter)=>{setChapter(next);setReveal(false);setReadingPracticeOpen(false);window.scrollTo({top:0,behavior:"smooth"})};
  const chooseArticle=(next:ArticleLesson)=>{setArticle(next);setHousesRevealed(false);setSeparationStage("think");setStructureOpen(false);setFederalismStage(0);setFederalBasisOpen(false);setFederalReadingOpen(false)};
  return <main className={`constitution-archive shell constitution-${chapter}`}>
    <header><div className="book">▥</div><div><b>SCHOLAR’S CATALOGUE</b><span>A Close Reading of the American Constitution</span></div><button onClick={()=>go("contents")}>CONSTITUTION · CONTENTS</button></header>
    {chapter==="contents"&&<section className="contents">
      <div className="title"><p>CONSTITUTION MAP</p><h1>The American Constitution</h1><span>Begin with the document’s architecture. Open a section to read more closely.</span></div>
      <div className="toc-folio">
        <button className="toc-page pre" onClick={()=>go("preamble")}><small>PART I</small><h2>Preamble</h2><em>The Promise</em><p>What does the nation promise?</p><div className="script">We the People</div><strong>OPEN PREAMBLE →</strong></button>
        <button className="toc-page art" onClick={()=>go("articles")}><small>PART II</small><h2>Seven Articles</h2><em>The Structure</em><p>How is government organized?</p><div className="mini-tree"><i/><span>LEGISLATIVE</span><span>EXECUTIVE</span><span>JUDICIAL</span></div><strong>EXPLORE 3 IDEAS →</strong></button>
        <button className="toc-page amend" onClick={()=>go("amendments")}><small>PART III</small><h2>27 Amendments</h2><em>The Change</em><p>How have rights and rules changed?</p><div className="selected"><span>1</span><span>2</span><span>13</span><span>14</span><span>15</span><span>19</span><span>27</span></div><strong>READ 7 SELECTED →</strong></button>
      </div>
    </section>}

    {chapter==="preamble"&&(readingPracticeOpen?<NewYorkerReadingScreen onBack={()=>setReadingPracticeOpen(false)}/>:<section className="chapter preamble-chapter">
      <ChapterHead no="I" label="THE PROMISE" title="Preamble" back={()=>go("contents")}/>
      <article className="preamble-feature" aria-label="The Preamble text">
        <p className="script">We the People</p>
        <p className="preamble-text">of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.</p>
      </article>
      <div className="preamble-learning-grid">
        <section className="promise-workshop">
          <header className="preamble-question"><div><p className="eyebrow">READING THE PREAMBLE</p><h3>What promises does the Preamble make?</h3></div></header>
          <div className="goal-strip" aria-label="Six promises in the Preamble">{goals.map((goal,i)=><button key={goal.english} className={`promise-card ${goalFlips[i] ? "is-flipped" : ""}`} type="button" aria-label={`${goalFlips[i] ? "Turn back" : "Turn over"}: Promise ${String(i + 1).padStart(2,"0")}`} aria-pressed={goalFlips[i]} onClick={() => setGoalFlips((current) => current.map((value,index) => index === i ? !value : value))}><span className="promise-card-inner"><span className="promise-card-face promise-card-front"><small>PROMISE {String(i + 1).padStart(2,"0")}</small><b>CLICK TO TURN</b></span><span className="promise-card-face promise-card-back"><small>PROMISE {String(i + 1).padStart(2,"0")}</small><strong>{goal.english}</strong><em>{goal.chinese}</em></span></span></button>)}</div>
        </section>
        <section className={`preamble-think ${reveal?"is-revealed":""}`}>
          <div><p className="eyebrow">THINK</p><h3>Did “We the People” describe a political reality—or an unfinished promise?</h3></div>
          {reveal&&<div className="preamble-answer"><b>POSSIBLE ANSWER</b><p>The phrase announced popular sovereignty, but participation in 1787 was sharply limited. Later constitutional amendments broadened citizenship and voting rights, so “We the People” can also be read as an unfinished promise.</p><p className="cn-copy">这句话宣告了人民主权，但1787年的政治参与范围十分有限。此后的宪法修正案逐步扩大了公民权与选举权，因此 “We the People” 也可以理解为一项仍在不断实现的承诺。</p><section className="preamble-context-note"><p className="eyebrow">HISTORICAL CONTEXT · BEFORE ABOLITION</p><button type="button" className="context-reading-trigger" onClick={()=>setReadingPracticeOpen(true)}><span>The Three-Fifths Compromise</span><span aria-hidden="true">→</span></button><Bilingual english="The original Constitution counted enslaved people as three-fifths of a person for representation and direct taxation. This increased the political power of slaveholding states without giving enslaved people rights-bearing representation." chinese="原始宪法在分配代表权和直接税时，将被奴役者按五分之三计算。这增加了蓄奴州的政治权力，却没有给予被奴役者作为权利主体的代表权。"/><small>Article I, Section 2, Clause 3 — historical context for the later promise of equal citizenship.</small></section><small className="source-note">Source: <a href="https://www.archives.gov/founding-docs/constitution" target="_blank" rel="noreferrer">U.S. National Archives</a></small></div>}
          <button onClick={()=>setReveal(!reveal)}>{reveal?"HIDE ANSWER":"REVEAL POSSIBLE ANSWER"}</button>
        </section>
      </div>
    </section>)}

    {chapter==="articles"&&<section className="chapter articles-chapter">
      <ChapterHead no="II" label="THE STRUCTURE" title="Seven Articles" back={()=>go("contents")}/><p className="intro">The seven Articles establish the federal government. For this brief reading, explore three structural ideas rather than every Article clause by clause.</p>
      <nav className="subnav"><button className={article==="houses"?"active":""} onClick={()=>chooseArticle("houses")}><span>01</span>Two Houses</button><button className={article==="separation"?"active":""} onClick={()=>chooseArticle("separation")}><span>02</span>Separation of Powers</button><button className={article==="federalism"?"active":""} onClick={()=>chooseArticle("federalism")}><span>03</span>Federalism</button></nav>
      {article==="houses"&&<TwoHousesLesson revealed={housesRevealed} onReveal={()=>setHousesRevealed(true)}/>} 
      {article==="separation"&&<SeparationLesson stage={separationStage} onRevealAnswer={()=>setSeparationStage("answer")} onRevealBranches={()=>setSeparationStage("branches")} onRevealChecks={()=>setSeparationStage("checks")}/>}
      {article==="federalism"&&<FederalismLesson stage={federalismStage} basisOpen={federalBasisOpen} readingOpen={federalReadingOpen} onReveal={()=>setFederalismStage(stage=>Math.min(3,stage+1))} onToggleBasis={()=>setFederalBasisOpen(open=>!open)} onToggleReading={()=>setFederalReadingOpen(open=>!open)}/>} 
    </section>}

    {chapter==="amendments"&&<section className="chapter amendments-chapter">
      <ChapterHead no="III" label="THE CHANGE" title="Selected Amendments" back={()=>go("contents")}/>
      <nav className="timeline-nav">{Object.entries(amendments).map(([n,a])=><button key={n} className={amendment===n?"active":""} onClick={()=>{setAmendment(n as keyof typeof amendments);setReveal(false)}}><span className="timeline-year">{a.year}</span><span className="timeline-mark"><b>{n}</b><small>{a.ordinal}</small></span></button>)}</nav>
      <article className="amendment-card"><div className="amendment-number"><span>AMENDMENT</span><strong>{amendment}</strong><em>{item.year}</em></div><div className="amendment-copy"><p className="eyebrow">WHAT CHANGED?</p><h2>{item.title}</h2><Bilingual english={item.body} chinese={item.chinese}/><div className="keywords">{item.keys.map(k=><span key={k}>{k}</span>)}</div></div></article>
      {amendment==="27"&&<div className="surprise"><span>PROPOSED</span><strong>1789</strong><i>→ more than 200 years →</i><strong>1992</strong><span>RATIFIED</span><p>A proposed amendment without a ratification deadline may remain pending for a very long time.</p></div>}
    </section>}
  </main>
}

function ChapterHead({no,label,title,back}:{no:string,label:string,title:string,back:()=>void}){return <div className="chapter-head"><button onClick={back}>← CONTENTS</button><p>PART {no} · {label}</p><h1>{title}</h1></div>}

function NewYorkerReadingScreen({onBack}:{onBack:()=>void}){
  const [revealedQuestions,setRevealedQuestions]=useState<boolean[]>(() => washingtonQuestions.map(() => false));
  const [exerciseAnswerRevealed,setExerciseAnswerRevealed]=useState(false);
  const revealQuestion=(index:number)=>setRevealedQuestions(current=>current.map((revealed,questionIndex)=>questionIndex===index ? !revealed : revealed));

  return (
    <section className="new-yorker-screen">
      <header className="new-yorker-screen-head">
        <button type="button" onClick={onBack}>← BACK TO PREAMBLE</button>
        <p className="eyebrow">READING PRACTICE · THE NEW YORKER</p>
        <h1>The Founders’ Moral Compromises</h1>
        <p>A close reading on George Washington, slavery, and the three-fifths formula</p>
      </header>

      <div className="new-yorker-reading-grid">
        <div className="new-yorker-copy">
          <div className="reading-exercise" role="button" tabIndex={0} aria-expanded={exerciseAnswerRevealed} style={{cursor:"pointer"}} onClick={()=>setExerciseAnswerRevealed(true)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setExerciseAnswerRevealed(true)}}}>
            <p className="eyebrow">READING EXERCISE</p>
            <p className="reading-exercise-prompt">How does the passage complicate the public image of Washington and the founding generation?</p>
            {exerciseAnswerRevealed?<p className="reading-exercise-answer">The passage places celebrated founders alongside the systems they protected, asking readers to hold achievement and moral compromise in view at the same time.</p>:<p className="reading-exercise-toggle">CLICK TO REVEAL ANSWER</p>}
          </div>

          <article className="new-yorker-article-flow">
            {washingtonReading.map((paragraph,index)=><Fragment key={paragraph}>
              <p><span className="new-yorker-paragraph-number" aria-hidden="true">{washingtonParagraphMarkers[index]}</span>{paragraph}</p>
              {index===1&&<figure className="new-yorker-portrait">
                <img src="/media/george-washington-portrait.png" alt="George Washington portrait supplied for this article"/>
              </figure>}
            </Fragment>)}
          </article>
        </div>

        <section className="reading-questions new-yorker-question-rail" aria-label="Five reading questions">
          <p className="eyebrow">CHECK YOUR READING</p>
          <div className="reading-question-grid">
            {washingtonQuestions.map((question,index)=>{
              const isRevealed=revealedQuestions[index];
              return (
                <article
                  className={`reading-question ${isRevealed?"is-answered":""}`}
                  key={question.prompt}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isRevealed}
                  aria-label={`${isRevealed?"Answer shown for":"Reveal answer for"} question ${index + 1}: ${question.prompt}`}
                  onClick={()=>revealQuestion(index)}
                  onKeyDown={event=>{
                    if(event.key==="Enter"||event.key===" "){
                      event.preventDefault();
                      revealQuestion(index);
                    }
                  }}
                >
                  <span className="reading-question-number">{String(index + 1).padStart(2,"0")}</span>
                  <h3>{question.prompt}</h3>
                  <ul>
                    {question.choices.map((choice,choiceIndex)=>{
                      const isCorrect=isRevealed&&choiceIndex===question.answerIndex;
                      return <li className={isCorrect?"is-correct":""} key={choice}>
                        <b>[{String.fromCharCode(65 + choiceIndex)}]</b>{choice}
                        {isCorrect&&<span className="reading-answer-check" aria-label="Correct answer">✓</span>}
                      </li>;
                    })}
                  </ul>
                  <span className="reading-question-hint">{isRevealed?"ANSWER REVEALED":"CLICK TO REVEAL"}</span>
                </article>
              );
            })}
          </div>
        </section>
      </div>

    </section>
  );
}

function Bilingual({english,chinese}:{english:string;chinese:string}){return <><p>{english}</p><p className="cn-copy">{chinese}</p></>}

function TwoHousesLesson({revealed,onReveal}:{revealed:boolean;onReveal:()=>void}){
  return <article className={`article-lesson houses-lesson ${revealed?"is-revealed":"is-question"}`}>
    <section className="lesson-copy">
      <p className="eyebrow">BICAMERAL CONGRESS</p><h2>A Congress Divided in Two</h2>
      <Bilingual english="Article I creates a bicameral Congress—a legislature with two chambers." chinese="第一条建立了两院制国会，即由两个议院组成的立法机构。"/>
      <div className="think-prompt"><p>THINK</p><h3>Why did the founders create two houses instead of one?</h3><p className="cn-copy">制宪者为什么建立两个议院，而不是一个？</p>{!revealed&&<button onClick={onReveal}>REVEAL POSSIBLE ANSWER</button>}</div>
    </section>
    <section className={`bicameral-map ${revealed?"is-revealed":""}`} aria-live="polite">
      {revealed?<><figure className="teaching-figure congress-figure"><div className="congress-crop"><img src="/media/congress-structure.png" alt="Congress organizational chart showing the Senate and House of Representatives"/></div><figcaption>Congress is organized around two chambers: the Senate and the House of Representatives.</figcaption></figure><div className="figure-note"><p className="eyebrow">THE GREAT COMPROMISE · POSSIBLE ANSWER</p><Bilingual english="Large states wanted representation based on population, while small states wanted equal representation. The compromise created a House based on population and a Senate with equal representation for every state." chinese="大州希望按人口获得代表权，小州则要求各州平等代表。最终的妥协是：众议院按人口分配席位，参议院由各州平等代表。"/><p className="note-summary">Population in the House · Equality of states in the Senate</p><small className="source-note">Source: <a href="https://history.house.gov/People/Signatories/Signatories/" target="_blank" rel="noreferrer">U.S. House History</a></small></div></>:<div className="unrevealed-image-space" aria-hidden="true"/>}
    </section>
  </article>
}

function Chamber({title,principle,rule,today,term}:{title:string;principle:string;rule:string;today:string;term:string}){return <section className="chamber"><p className="eyebrow">{title}</p><strong>{principle}</strong><ul><li>{rule}</li><li>{today}</li><li>{term}</li></ul></section>}

const checks = [
  {from:"Executive",to:"Legislative",label:"Veto",en:"The President may veto bills passed by Congress.",cn:"总统可以否决国会通过的法案。"},
  {from:"Legislative",to:"Executive",label:"Funding · Override · Impeachment",en:"Congress controls federal spending and may override a presidential veto with a two-thirds vote in both chambers. The House may impeach, and the Senate conducts the trial.",cn:"国会控制联邦支出，并可以由参众两院分别以三分之二多数推翻总统否决。众议院可以提出弹劾，参议院负责审理。"},
  {from:"Executive",to:"Judicial",label:"Nomination · Pardons",en:"The President nominates federal judges and may grant pardons for federal offenses.",cn:"总统提名联邦法官，并可以赦免联邦犯罪。"},
  {from:"Legislative",to:"Judicial",label:"Confirmation · Impeachment",en:"The Senate confirms federal judicial nominees. Congress may also impeach and remove federal judges.",cn:"参议院确认联邦法官提名。国会还可以弹劾并罢免联邦法官。"},
  {from:"Judicial",to:"Legislative",label:"Judicial Review",en:"Federal courts may review whether laws are constitutional.",cn:"联邦法院可以审查法律是否符合宪法。"},
  {from:"Judicial",to:"Executive",label:"Judicial Review",en:"Federal courts may review whether executive actions are constitutional.",cn:"联邦法院可以审查行政行为是否符合宪法。"},
];

function SeparationLesson({stage,onRevealAnswer,onRevealBranches,onRevealChecks}:{stage:"think"|"answer"|"branches"|"checks";onRevealAnswer:()=>void;onRevealBranches:()=>void;onRevealChecks:()=>void}){
  if(stage==="checks") return <article className="article-lesson separation-lesson checks-only-lesson">
    <section className="checks-copy"><p className="eyebrow">CHECKS &amp; BALANCES</p><h2>Power is checked.</h2><Bilingual english="The branches are separate, but not completely independent. Each branch has constitutional powers that can limit the others." chinese="三个部门彼此分立，但并非完全独立；每个部门都拥有能够限制其他部门的宪法权力。"/><div className="compact-conclusion"><b>SEPARATION</b><span>divides power</span><b>CHECKS &amp; BALANCES</b><span>limit power</span></div><small className="source-note">Sources: <a href="https://www.archives.gov/milestone-documents/marbury-v-madison" target="_blank" rel="noreferrer">U.S. National Archives</a> · <a href="https://www.senate.gov/artandhistory/senate-stories/checks-and-balances.htm" target="_blank" rel="noreferrer">U.S. Senate</a></small></section>
    <section className="branches-stage is-revealed is-checked"><figure className="teaching-figure checks-figure"><img src="/media/checks-and-balances.png" alt="Checks and balances among Congress, the President, and the Supreme Court"/><figcaption>Each branch can limit the others.</figcaption><div className="checks-legend">{checks.map(check=><span key={`${check.from}-${check.to}`}><b>{check.label}</b>{check.en}</span>)}</div></figure></section>
  </article>;

  return <article className={`article-lesson separation-lesson separation-stage-${stage}`}>
    <section className="lesson-copy">
      <p className="eyebrow">THREE BRANCHES</p><h2>Separation of Powers</h2>
      {stage==="think"&&<div className="think-prompt"><p>THINK</p><h3>What might happen if the same institution made, enforced, and interpreted the law?</h3><p className="cn-copy">如果同一个机构既制定法律、又执行法律、还解释法律，可能会发生什么？</p><button onClick={onRevealAnswer}>REVEAL POSSIBLE ANSWER</button></div>}
      {stage==="answer"&&<div className="question-answer"><p className="eyebrow">POSSIBLE ANSWER</p><Bilingual english="Combining all three functions in one institution would concentrate power and remove independent checks. The same body could write a rule, enforce it, and judge challenges to it, increasing the risk of arbitrary decisions and abuse of power." chinese="如果三种职能集中在同一个机构，权力就会失去独立制约。同一机构既能制定规则、又能执行规则、还能裁判对规则的质疑，从而增加任意决策和滥用权力的风险。"/><small className="source-note">Source: <a href="https://www.judiciary.senate.gov/grassley-on-the-importance-and-responsibility-of-congressional-oversight" target="_blank" rel="noreferrer">U.S. Senate Judiciary Committee</a></small><button onClick={onRevealBranches}>NEXT · THREE BRANCHES</button></div>}
      {stage==="branches"&&<div className="reveal-reading"><Bilingual english="Articles I, II, and III assign legislative, executive, and judicial powers to different branches of government. This division is called separation of powers." chinese="宪法第一、第二和第三条分别将立法权、行政权和司法权赋予不同的政府部门。这种权力划分被称为权力分立。"/><strong className="lesson-mantra">Power is divided.</strong><button onClick={onRevealChecks}>下一步：CHECKS & BALANCES</button></div>}
    </section>
    <section className={`branches-stage ${stage==="branches"?"is-revealed":""}`}>{stage==="branches"?<figure className="teaching-figure branches-crop"><div className="cropped-diagram"><img src="/media/branches-us-government.png" alt="Branches of the U.S. Government diagram"/></div><figcaption>The three branches and their major institutions</figcaption></figure>:<div className="question-stage-marker" aria-hidden="true"><span>01</span><i/><span>02</span><i/><span>03</span></div>}</section>
  </article>
}

function FederalismLesson({stage,basisOpen,readingOpen,onReveal,onToggleBasis,onToggleReading}:{stage:number;basisOpen:boolean;readingOpen:boolean;onReveal:()=>void;onToggleBasis:()=>void;onToggleReading:()=>void}){const revealed=stage>0; return <article className="article-lesson federalism-lesson"><section className="lesson-copy"><p className="eyebrow">TWO LEVELS OF POWER</p><h2>Federalism</h2><div className="horizontal-vertical"><span>Separation of powers divides power horizontally among branches.</span><i>↔</i><span>Federalism divides power vertically between levels of government.</span></div><p className="cn-copy">权力分立在不同政府部门之间横向分权；联邦制则在不同政府层级之间纵向分权。</p>{!revealed?<div className="think-prompt"><p>THINK</p><h3>What might happen if all governmental power belonged only to the federal government—or only to the states?</h3><p className="cn-copy">如果所有政府权力都只属于联邦政府，或者只属于各州，可能会发生什么？</p><button onClick={onReveal}>REVEAL FEDERALISM</button></div>:<div className="reveal-reading"><Bilingual english="Federalism divides governmental authority between the federal government and state governments. The federal government exercises powers granted by the Constitution, the states retain many powers not delegated to the federal government, and both levels share certain powers." chinese="联邦制将政府权力分配给联邦政府和州政府。联邦政府行使宪法赋予的权力，各州保留许多未授予联邦政府的权力，两个层级还共同拥有一些权力。"/><div className="federal-actions">{stage<3&&<button onClick={onReveal}>{stage===1?"REVEAL STATE POWERS":"REVEAL SHARED POWERS"}</button>}<button onClick={onToggleBasis}>CONSTITUTIONAL BASIS</button><button onClick={onToggleReading}>READING NOTE</button></div>{basisOpen&&<section className="constitutional-basis"><p className="eyebrow">CONSTITUTIONAL BASIS</p><Bilingual english="Article I — Lists important powers of Congress." chinese="第一条列举国会的重要权力。"/><Bilingual english="Article VI — Establishes the supremacy of valid federal law." chinese="第六条确立有效联邦法律的最高地位。"/><Bilingual english="Tenth Amendment — Reserves undelegated powers to the states or the people." chinese="第十修正案将未授予联邦政府的权力保留给各州或人民。"/><Bilingual english="When valid federal and state laws conflict, federal law prevails under the Supremacy Clause." chinese="当有效的联邦法律与州法律发生冲突时，根据宪法最高条款，联邦法律优先。"/></section>}{readingOpen&&<section className="reading-note"><p className="eyebrow">READING NOTE</p><Bilingual english="Federalism seeks to combine national unity with state autonomy. The federal government can address issues that affect the whole country, while state governments can respond to different regional and local needs." chinese="联邦制试图在国家统一与州的自主权之间建立平衡。联邦政府可以处理影响全国的问题，州政府则可以回应不同地区和地方的具体需要。"/></section>}</div>}</section><section className={`federal-powers stage-${stage}`}>{stage===0?<figure className="teaching-figure states-map-figure"><img src="/media/us-states-map.png" alt="Map showing the United States and its states"/><figcaption>One country, with federal and state governments.</figcaption></figure>:<div className="power-columns"><PowerColumn label="FEDERAL POWERS" entries={[["Coin money","铸造货币"],["Conduct foreign relations","处理对外关系"],["Provide for national defense","负责国家防务"]]} visible/><PowerColumn label="SHARED POWERS" entries={[["Collect taxes","征税"],["Borrow money","借款"],["Establish courts","建立法院系统"]]} visible={stage>=3}/><PowerColumn label="STATE POWERS" entries={[["Establish local governments","建立地方政府"],["Administer public education","管理公共教育"],["Issue licenses","颁发各类执照"]]} visible={stage>=2}/></div>}</section>{revealed&&<footer className="lesson-conclusion"><strong>One country. Two levels of government. Shared constitutional authority.</strong><p className="cn-copy">一个国家，两个政府层级，共享宪法权力。</p><blockquote>How does federalism balance national unity with state autonomy?</blockquote><p className="cn-copy">联邦制如何平衡国家统一与州的自主权？</p></footer>}</article>}

function PowerColumn({label,entries,visible}:{label:string;entries:string[][];visible:boolean}){return <section className={`power-column ${visible?"is-visible":""}`}><p className="eyebrow">{label}</p>{visible?entries.map(([en,cn])=><div key={en}><strong>{en}</strong><span>{cn}</span></div>):<span className="awaiting">Awaiting reveal</span>}</section>}
