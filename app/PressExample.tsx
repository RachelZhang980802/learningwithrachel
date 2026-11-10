"use client";

import { Fragment, useId, useState } from "react";

export type PressExampleData = {
  english: string;
  chinese: string;
  url: string;
  source: string;
  highlights?: string[];
};

function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  const phrases = [...new Set(terms.map(term => term.trim()).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!phrases.length) return <>{text}</>;
  const escaped = phrases.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const exact = new Set(phrases.map(term => term.toLowerCase()));
  return <>{text.split(pattern).map((part, index) => exact.has(part.toLowerCase())
    ? <mark className="word-press-highlight" key={index}>{part}</mark>
    : <Fragment key={index}>{part}</Fragment>)}</>;
}

export function PressExample({ example, terms = [] }: { example: PressExampleData; terms?: string[] }) {
  const [translated, setTranslated] = useState(false);
  const translationId = useId();
  return <blockquote className="word-press-example">
    <button type="button" className="word-press-english" lang="en"
      aria-expanded={translated} aria-controls={translationId}
      onClick={() => setTranslated(value => !value)}>
      <span><HighlightedText text={example.english} terms={example.highlights ?? terms}/></span>
      <span className="word-press-toggle" aria-hidden="true">{translated ? "−" : "+"}</span>
    </button>
    <div id={translationId} hidden={!translated} className="word-press-chinese" lang="zh-CN">
      {example.chinese}
    </div>
    <a className="word-press-source" href={example.url} target="_blank" rel="noopener noreferrer">{example.source} ↗</a>
  </blockquote>;
}
