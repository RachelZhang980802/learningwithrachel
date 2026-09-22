import { Fragment } from "react";
import { article01Paraphrases } from "./article01Paraphrases";

export function ArticleOneParaphrase({ sentence }: { sentence: string }) {
  const entry = article01Paraphrases[sentence];
  if (!entry) return null;
  return <div className="student-paraphrase">
    <p className="student-paraphrase-sentence" lang="en">{entry.segments.map((part, index) => part.changed
      ? <mark key={index}>{part.text}</mark>
      : <Fragment key={index}>{part.text}</Fragment>)}</p>
    <section className="student-paraphrase-comparison">
      <h3>改写思路 · 高亮为重点重组的表达</h3>
      <p className="student-paraphrase-note" lang="zh-CN">{entry.note}</p>
    </section>
  </div>;
}
