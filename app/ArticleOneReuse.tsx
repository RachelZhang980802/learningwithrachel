"use client";

import { useId, useState } from "react";
import { article01Reuse } from "./article01Reuse";
import { article01ReuseExamples } from "./article01ReuseExamples";

export function ArticleOneReuse({ sentence }: { sentence: string }) {
  const [revealed, setRevealed] = useState(false);
  const answerId = useId();
  const example = article01ReuseExamples[sentence];
  return <div className="student-reuse">
    <p className="student-reuse-pattern" lang="en">{article01Reuse[sentence]}</p>
    {example?.note && <p className="structure-review-note" lang="zh-CN">{example.note}</p>}
    {example && <div className="student-reuse-practice">
      <button type="button" className="student-sentence-translation student-reuse-prompt" lang="zh-CN" aria-expanded={revealed} aria-controls={answerId} onClick={() => setRevealed(!revealed)}>{example.zh}</button>
      <p id={answerId} className="student-reuse-pattern student-reuse-answer" lang="en" hidden={!revealed}>{revealed ? example.en : null}</p>
    </div>}
  </div>;
}
