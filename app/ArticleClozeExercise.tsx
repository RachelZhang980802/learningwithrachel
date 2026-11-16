"use client";

import { Fragment } from "react";
import { ArticleClozeBlank } from "./ArticleClozeBlank";
import { articleClozeExercises } from "./articleClozeData";
import "./article-one-cloze.css";

export function ArticleClozeExercise({ articleId, onBack }: { articleId: string; onBack: () => void }) {
  const exercise = articleClozeExercises[articleId];
  const wordBank = [...exercise.gaps.map(gap => gap.root)].sort((a, b) => a.localeCompare(b));

  return <main className="article-cloze-page" lang="en">
    <div className="article-cloze-shell">
      <button type="button" className="article-cloze-back" onClick={onBack}>← Back to the text</button>
      <header className="article-cloze-header">
        <p>TEXT {articleId} · VOCABULARY IN CONTEXT</p>
        <h1>{exercise.title}</h1>
        <div className="article-cloze-intro">
          <p>The 20 gaps test key words and phrases from “{exercise.sourceTitle}”. Use each entry in the bank once and change its form to fit the meaning and grammar of the sentence. Click a gap to check your answer.</p>
        </div>
      </header>

      <section className="article-cloze-bank" aria-labelledby="article-cloze-bank-title">
        <h2 id="article-cloze-bank-title">Core vocabulary bank</h2>
        <div>{wordBank.map(root => <span key={root}>{root}</span>)}</div>
      </section>

      <div className="article-cloze-stages">
        {exercise.stages.map((stage, stageIndex) => <section className="article-cloze-stage" key={stage.title} aria-labelledby={`article-cloze-stage-${stageIndex}`}>
          <div className="article-cloze-stage-heading"><span>0{stageIndex + 1} / 04</span><div><h2 id={`article-cloze-stage-${stageIndex}`}>{stage.title}</h2><p>{stage.cue}</p></div></div>
          <p className="article-cloze-passage" lang="en">{stage.parts.map((part, partIndex) => {
            const gapIndex = stageIndex * 5 + partIndex;
            return <Fragment key={partIndex}>{part}{partIndex < 5 && <ArticleClozeBlank index={gapIndex} answer={exercise.gaps[gapIndex].answer} />}</Fragment>;
          })}</p>
        </section>)}
      </div>

      <button type="button" className="article-cloze-back article-cloze-bottom-back" onClick={onBack}>← Back to the text</button>
    </div>
  </main>;
}
