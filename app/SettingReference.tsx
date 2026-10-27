"use client";

import { useEffect, useRef, useState } from "react";
import catalog from "./settingReferenceCatalog.json";
import "./character-reference.css";

type Entry = { id: string; kind: "words" | "phrase" | "sentence"; label: string; en: string; zh: string; page: number };
type Chapter = (typeof catalog)[number] & { sections: { title: string; page: number; entries: Entry[] }[] };
const groupLabels: Record<string, string> = {
  Nouns: "Nouns", Adjectives: "Adjectives", Verbs: "Verbs", Adverbs: "Adverbs",
  "Phrases – Nouns and Adjectives": "Phrases", "Phrases – Verbs": "Phrases", Sentences: "Sentences",
};

function getWordGlosses(entry: Entry) {
  const terms = entry.en.split(/[,;，；]\s*/).map(term => term.trim()).filter(Boolean);
  const separators = entry.en.match(/[,;，；]\s*/g) ?? [];
  const translations = entry.zh.replace(/[。.!?]+$/u, "").split(/[;；、，,]\s*/).map(term => term.trim()).filter(Boolean);
  if (terms.length !== translations.length) return [{ en: entry.en, zh: entry.zh, separator: "" }];
  return terms.map((en, index) => ({ en, zh: translations[index], separator: separators[index] ?? "" }));
}

export function SettingReference() {
  const [selected, setSelected] = useState<number | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [openWordGlosses, setOpenWordGlosses] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const cache = useRef(new Map<number, Chapter>());
  const heading = useRef<HTMLHeadingElement>(null);
  const directoryButton = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const meta = catalog.find(item => item.id === selected);

  useEffect(() => {
    if (selected === null) return;
    const controller = new AbortController();
    const cached = cache.current.get(selected);
    setError(false);
    setChapter(cached ?? null);
    if (!cached) {
      fetch(`/setting-reference/chapter-${selected}.json`, { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error("Chapter unavailable"); return response.json() as Promise<Chapter>; })
        .then(data => {
          if (data.id !== selected || !Array.isArray(data.sections)) throw new Error("Invalid chapter");
          cache.current.set(selected, data);
          if (!controller.signal.aborted) setChapter(data);
        })
        .catch(() => { if (!controller.signal.aborted) setError(true); });
    }
    return () => controller.abort();
  }, [selected, retry]);

  const openChapter = (id: number) => {
    directoryButton.current = id;
    setChapter(cache.current.get(id) ?? null);
    setError(false);
    setSelected(id);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      root.current?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  };
  const returnToContents = () => {
    setSelected(null);
    requestAnimationFrame(() => {
      root.current?.querySelector<HTMLButtonElement>(`[data-setting-chapter="${directoryButton.current}"]`)?.focus();
    });
  };

  return <div className="character-reference setting-reference" ref={root}>
    <p className="unit-two-step">04 · Descriptosaurus · Settings</p>
    {selected === null ? <>
      <h2>Part 1: Settings</h2>
      <div className="character-directory">
        <section className="character-directory-group" aria-label="Setting chapters">
          <h3>Places, time and senses</h3>
          <ol start={1}>
            {catalog.map(item => <li key={item.id}>
              <button type="button" data-setting-chapter={item.id} onClick={() => openChapter(item.id)}>
                <span className="character-number">{String(item.id).padStart(2, "0")}</span>
                <span className="character-topic"><strong>{item.title}</strong></span>
                <span className="character-arrow" aria-hidden="true">🚩</span>
              </button>
            </li>)}
          </ol>
        </section>
      </div>
      <p className="character-source">Alison Wilcox · <cite>Descriptosaurus</cite>, 3rd edition · PDF pp. 46–180</p>
    </> : <>
      <div className="character-toolbar">
        <button type="button" onClick={returnToContents}>Back</button>
        <label>Switch chapter<select aria-label="Switch setting chapter" value={selected} onChange={event => openChapter(Number(event.target.value))}>
          {catalog.map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}
        </select></label>
      </div>
      <p className="character-group-name">{meta?.group} · {selected}</p>
      <h2 ref={heading} tabIndex={-1}>{meta?.title}</h2>
      {!chapter && !error && <p role="status" className="character-status">正在加载章节…</p>}
      {error && <div role="alert" className="character-status"><p>这一章暂时未能加载，请重试。</p><button type="button" onClick={() => setRetry(value => value + 1)}>重新加载</button></div>}
      {chapter?.id === selected && <>
        {chapter.sections.length > 1 && <nav className="setting-section-nav" aria-label="Chapter sections">
          {chapter.sections.map((section, index) => <button key={section.title} type="button" onClick={() => root.current?.querySelector(`#setting-section-${index}`)?.scrollIntoView({ behavior: "auto", block: "start" })}>{section.title.replace(/^Section \d+ – /, "")}</button>)}
        </nav>}
        <div className="character-reading" key={selected}>
          {chapter.sections.map((section, index) => <section className="character-section" id={`setting-section-${index}`} key={section.title}>
            <h3>{section.title === "Words, phrases and sentences" ? "Words, phrases and sentences" : section.title}</h3>
            {section.entries.map((entry, position) => <div className="character-entry" key={entry.id} data-character-entry={entry.id}>
              {(position === 0 || section.entries[position - 1].label !== entry.label) && <h4>{groupLabels[entry.label] ?? entry.label}</h4>}
              {entry.kind === "words" ? <span className="character-word-list" lang="en">
                {getWordGlosses(entry).map((word, wordIndex) => {
                  const key = `${selected}-${entry.id}-${wordIndex}`;
                  return <span key={key}>
                    <button type="button" className="character-word-toggle" aria-expanded={openWordGlosses.has(key)} onClick={() => setOpenWordGlosses(current => {
                      const next = new Set(current);
                      if (next.has(key)) next.delete(key); else next.add(key);
                      return next;
                    })}>{word.en}{openWordGlosses.has(key) && <span className="character-translation" lang="zh-CN">（{word.zh}）</span>}</button>{word.separator}
                  </span>;
                })}
              </span> : <details className={`character-gloss character-gloss-${entry.kind}`}>
                <summary><span lang="en">{entry.en}</span><span className="character-translation" lang="zh-CN">（{entry.zh}）</span></summary>
              </details>}
            </div>)}
          </section>)}
        </div>
        <div className="character-bottom-nav">
          {selected > 1 && <button type="button" onClick={() => openChapter(selected - 1)}>← Previous</button>}
          <button type="button" onClick={returnToContents}>Back</button>
          {selected < 19 && <button type="button" onClick={() => openChapter(selected + 1)}>Home</button>}
        </div>
        <p className="character-source">English source: Alison Wilcox, <cite>Descriptosaurus</cite>, 3rd edition.</p>
      </>}
    </>}
  </div>;
}
