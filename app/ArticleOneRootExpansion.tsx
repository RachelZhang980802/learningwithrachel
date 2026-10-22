"use client";

import { useId, useState } from "react";
import { article01RootFamilies } from "./article01RootWords";

const familiesByWord: Record<string, string[]> = {
  instinct: ["stinct"], prescribe: ["scrib"], neglect: ["lect"], appeal: ["peal"],
  suspect: ["spect", "demo"], promise: ["mis"], except: ["cept"],
};

export function ArticleOneRootExpansion({ word }: { word: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const families = (familiesByWord[word] ?? []).map(key => article01RootFamilies[key]);
  if (!families.length) return null;
  const label = families.map(family => family.title).join(" · ");
  return <div className="root-expansion" data-editable-skip="true">
    <button type="button" className="root-expansion-flag" aria-expanded={open} aria-controls={panelId}
      aria-label={`${open ? "收起" : "展开"} ${label} 拓展词汇`} title={`${label} · 拓展词汇`}
      onClick={() => setOpen(value => !value)}>
      <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true">
        <path d="M5 21V3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6 3.5h14l-3.8 4.4 3.8 4.6H6z" fill="currentColor" />
      </svg>
    </button>
    <div id={panelId} hidden={!open} className="root-expansion-content">
      {families.map(family => <section className="root-expansion-family" key={family.title}>
        <h3>{family.title}<span>{family.words.length} words</span></h3>
        <p className="root-expansion-meaning">{family.meaning}</p>
        <p className="root-expansion-note">{family.note}</p>
        <ul className="root-expansion-words">
          {family.words.map(item => <li key={item.word}>
            <div><strong lang="en">{item.word}</strong><span className="root-word-part">{item.part}</span></div>
            <p lang="zh-CN">{item.meaning}</p>
            <span className="root-word-phrase" lang="en">{item.phrase}</span>
          </li>)}
        </ul>
        <p className="root-expansion-sources">词源核对：{family.sources.map((source, index) => <span key={source.url}>
          {index > 0 && " · "}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
        </span>)}</p>
      </section>)}
    </div>
  </div>;
}
