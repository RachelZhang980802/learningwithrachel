"use client";

import { useState } from "react";

export function ArticleClozeBlank({ index, answer }: { index: number; answer: string }) {
  const [revealed, setRevealed] = useState(false);
  const number = String(index + 1).padStart(2, "0");

  return <span className="article-cloze-blank">
    <span className="article-cloze-number" aria-hidden="true">{number}</span>
    <button
      type="button"
      className={`article-cloze-reveal${revealed ? " is-revealed" : ""}`}
      aria-label={revealed ? `Hide answer for gap ${index + 1}: ${answer}` : `Reveal answer for gap ${index + 1}`}
      aria-pressed={revealed}
      onClick={() => setRevealed(value => !value)}
    >{revealed ? answer : "\u00a0"}</button>
  </span>;
}
