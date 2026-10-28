"use client";

import { Fragment } from "react";
import { ArticleClozeBlank } from "./ArticleClozeBlank";
import "./article-one-cloze.css";

type Gap = { root: string; answer: string; alternatives?: string[] };
const gaps: Gap[] = [
  { root: "proportion", answer: "proportion" },
  { root: "methodical", answer: "methodical" },
  { root: "thesis", answer: "thesis" },
  { root: "illustrate", answer: "illustration" },
  { root: "capacity", answer: "capacity" },
  { root: "instinct", answer: "instinctively" },
  { root: "prescribe", answer: "prescribed" },
  { root: "specialize", answer: "specialization", alternatives: ["specialisation"] },
  { root: "concentrate", answer: "concentrated" },
  { root: "rebel", answer: "rebellion" },
  { root: "neglect", answer: "neglected" },
  { root: "intellectually", answer: "intellectually" },
  { root: "differ", answer: "differing" },
  { root: "authority", answer: "authorities" },
  { root: "appeal", answer: "appealed" },
  { root: "curious", answer: "curiosity" },
  { root: "mystery", answer: "mystery" },
  { root: "fascinate", answer: "fascination" },
  { root: "suspect", answer: "suspected" },
  { root: "clinching", answer: "clinch" },
];

const stages = [
  {
    title: "The claim",
    cue: "What counts as an education?",
    parts: [
      "A university education is possible, but only a small ",
      " of students learn independently. Their study must be ",
      ": curiosity needs a process, not a pile of dates. That distinction forms the ",
      " of Steffens's account. His student years offer an ",
      " rather than proof that every course works equally well. The deeper prize is the ",
      " to keep learning after the degree.",
    ],
  },
  {
    title: "The choice",
    cue: "How did he begin to study?",
    parts: [
      "He arrived at his approach ",
      ", so he did not begin with a perfect plan. Although the university ",
      " several courses, he treated his degree as a chance for ",
      " rather than superficial coverage. For a time he ",
      " on English, political economy and philosophy. His later ",
      " against the way history was taught came from a desire to connect it with life, not from hostility to the subject.",
    ],
  },
  {
    title: "The evidence",
    cue: "What changed when the books disagreed?",
    parts: [
      "He had once ",
      " history because lectures presented it as settled knowledge. His other reading made it ",
      " useful for understanding politics and art. When two required books gave ",
      " accounts, he compared them instead of memorising either. He turned to other ",
      " and ",
      " to the librarian for help. A disagreement had become a reason to investigate.",
    ],
  },
  {
    title: "The insight",
    cue: "What did inquiry teach him?",
    parts: [
      "His motive was ",
      ", not a wish to be a model pupil. Every answer led to another ",
      ", and his ",
      " with history grew as he learned to ask better questions. He eventually ",
      " that familiar accounts of the Constitution might be incomplete. Rather than accept a confident textbook voice, he searched for primary documents that could ",
      " an argument. Learning had become inquiry rather than recitation.",
    ],
  },
] as const;

const wordBank = [...gaps.map(gap => gap.root)].sort((a, b) => a.localeCompare(b));
export function ArticleOneCloze({ onBack }: { onBack: () => void }) {
  return <main className="article-cloze-page">
    <div className="article-cloze-shell">
      <button type="button" className="article-cloze-back" onClick={onBack}>← Back to the text</button>
      <header className="article-cloze-header">
        <p>TEXT 01 · VOCABULARY IN CONTEXT</p>
        <h1>From reading to inquiry</h1>
        <div className="article-cloze-intro">
          <p>Twenty gaps follow Steffens's reasoning from his claim to his method, evidence and discovery. Click each line to reveal the word or word-family form that completes the sentence.</p>
        </div>
      </header>

      <section className="article-cloze-bank" aria-labelledby="article-cloze-bank-title">
        <h2 id="article-cloze-bank-title">Word-family bank</h2>
        <div>{wordBank.map(root => <span key={root}>{root}</span>)}</div>
      </section>

      <div className="article-cloze-stages">
        {stages.map((stage, stageIndex) => <section className="article-cloze-stage" key={stage.title} aria-labelledby={`article-cloze-stage-${stageIndex}`}>
          <div className="article-cloze-stage-heading"><span>0{stageIndex + 1} / 04</span><div><h2 id={`article-cloze-stage-${stageIndex}`}>{stage.title}</h2><p>{stage.cue}</p></div></div>
          <p className="article-cloze-passage" lang="en">{stage.parts.map((part, partIndex) => {
            const gapIndex = stageIndex * 5 + partIndex;
            return <Fragment key={partIndex}>{part}{partIndex < 5 && <ArticleClozeBlank index={gapIndex} answer={gaps[gapIndex].answer} />}</Fragment>;
          })}</p>
        </section>)}
      </div>

      <button type="button" className="article-cloze-back article-cloze-bottom-back" onClick={onBack}>← Back to the text</button>
    </div>
  </main>;
}
