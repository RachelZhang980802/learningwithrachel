"use client";

import { useState } from "react";
import oxfordExamples from "./oxfordMeaningExamples.json";
const exampleCatalog = oxfordExamples as Record<string, Array<{ english: string; chinese: string; source?: string } | null>>;

export type MeaningExampleItem = {
  english: string;
  chinese: string;
  exampleEnglish?: string;
  exampleChinese?: string;
};

/** Turn a dictionary line such as "sense — 释义" into aligned bilingual text. */
export function splitMeaningLine(value: string): { english: string; chinese: string } {
  const [english, ...rest] = value.split(/\s+—\s+/);
  return { english: english.trim(), chinese: rest.join(" — ").trim() || "释义见词典条目。" };
}

export function MeaningExamples({ word, items, useCatalog = true }: { word: string; items: MeaningExampleItem[]; useCatalog?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items.length) return null;
  return <div className="meaning-examples" aria-label={`${word} 的词义与例句`}>
    {items.map((item, index) => {
      const open = openIndex === index;
      const example = (useCatalog ? exampleCatalog[word]?.[index] : null) ?? (item.exampleEnglish ? { english: item.exampleEnglish, chinese: item.exampleChinese ?? "" } : null);
      if (!example) {
        return <div className="meaning-example meaning-example-empty" key={`${item.english}-${index}`}>
          <div className="meaning-example-trigger meaning-example-trigger-static">
            <span className="meaning-example-number">{index + 1}</span>
            <span className="meaning-example-copy">
              <span className="meaning-example-en" lang="en">{item.english}</span>
              <span className="meaning-example-zh" lang="zh-CN">{item.chinese}</span>
            </span>
          </div>
        </div>;
      }
      return <div className={`meaning-example${open ? " is-open" : ""}`} key={`${item.english}-${index}`}>
        <button type="button" className="meaning-example-trigger" aria-expanded={open} onClick={() => setOpenIndex(open ? null : index)}>
          <span className="meaning-example-number">{index + 1}</span>
          <span className="meaning-example-copy">
            <span className="meaning-example-en" lang="en">{item.english}</span>
            <span className="meaning-example-zh" lang="zh-CN">{item.chinese}</span>
          </span>
          <span className="meaning-example-caret" aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        {open && <div className="meaning-example-answer" role="region">
          <p className="meaning-example-label">Oxford example · 牛津例句</p>
          <p className="meaning-example-en" lang="en">{example.english}</p>
          {example.chinese && <p className="meaning-example-zh" lang="zh-CN">{example.chinese}</p>}
          {example.source && <a className="meaning-example-source" href={example.source} target="_blank" rel="noopener noreferrer">Oxford Advanced Learner’s English-Chinese Dictionary (10th Edition) ↗</a>}
        </div>}
      </div>;
    })}
  </div>;
}
