"use client";

import { useEffect, useRef, useState } from "react";
import catalog from "./characterReferenceCatalog.json";
import "./character-reference.css";

type Entry = { id: string; kind: "words" | "phrase" | "sentence"; label: string; en: string; zh: string; page: number };
type Chapter = (typeof catalog)[number] & { sections: { title: string; page: number; entries: Entry[] }[] };
const groupLabels: Record<string, string> = {
  Nouns: "Nouns", Adjectives: "Adjectives", Verbs: "Verbs", Adverbs: "Adverbs",
  "Phrases – Nouns and Adjectives": "Phrases", "Phrases – Verbs": "Phrases", Sentences: "Sentences",
};
const sectionLabels: Record<string, string> = { Age: "年龄", Height: "身高", Shape: "形状与体型", "Colour and Texture": "肤色与质感", "Wounds and Scars": "伤口与疤痕", Colour: "颜色", Size: "大小", Eyebrows: "眉毛", Mouth: "嘴", Teeth: "牙齿", Nose: "鼻子", Ears: "耳朵", "Style (Long)": "长发造型", "Style (Short)": "短发造型", Untidy: "凌乱的头发", "Facial Hair": "胡须", Emotions: "情绪感受", Expressions: "面部表情", Eyes: "眼睛", Voice: "声音", Movement: "动作", Hands: "手部动作", Body: "身体动作", "Expressions, Eyes, Voice and Movement": "表情、眼神、声音与动作" };

export function CharacterReference() {
  const [selected, setSelected] = useState<number | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
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
      fetch(`/character-reference/chapter-${selected}.json`, { signal: controller.signal })
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
      root.current?.querySelector<HTMLButtonElement>(`[data-character-chapter="${directoryButton.current}"]`)?.focus();
    });
  };

  return <div className="character-reference" ref={root}>
    <p className="unit-two-step">04 · Descriptosaurus</p>
    {selected === null ? <>
      <h2>Part 2: Characters</h2>
      <p className="character-intro">人物描写素材库 · 选择章节阅读，点击英文词组或句子查看中文解释。</p>
      <div className="character-directory">
        {(["Appearance", "Emotions and personality"] as const).map(group => <section className="character-directory-group" key={group}>
          <h3>{group}<span lang="zh-CN">{group === "Appearance" ? "外貌" : "情绪与性格"}</span></h3>
          <ol start={group === "Appearance" ? 20 : 28}>
            {catalog.filter(item => item.group === group).map(item => <li key={item.id}>
              <button type="button" data-character-chapter={item.id} onClick={() => openChapter(item.id)}>
                <span className="character-number">{item.id}</span>
                <span className="character-topic"><strong>{item.title}</strong><span lang="zh-CN">{item.zh}</span></span>
                <span className="character-arrow" aria-hidden="true">↗</span>
              </button>
            </li>)}
          </ol>
        </section>)}
      </div>
      <p className="character-source">Alison Wilcox · <cite>Descriptosaurus</cite>, 3rd edition · PDF pp. 184–366</p>
    </> : <>
      <div className="character-toolbar">
        <button type="button" onClick={returnToContents}>← 返回目录</button>
        <label>切换章节<select aria-label="切换人物描写章节" value={selected} onChange={event => openChapter(Number(event.target.value))}>
          {catalog.map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}
        </select></label>
      </div>
      <p className="character-group-name">{meta?.group} · {selected}</p>
      <h2 ref={heading} tabIndex={-1}>{meta?.title}</h2>
      <p className="character-intro"><span lang="zh-CN">{meta?.zh}</span> · PDF pp. {meta?.startPage}–{meta?.endPage}</p>
      <p className="character-hint">点击英文，中文直接显示在后面；再次点击隐藏。</p>
      {!chapter && !error && <p role="status" className="character-status">正在加载章节…</p>}
      {error && <div role="alert" className="character-status"><p>这一章暂时未能加载，请重试。</p><button type="button" onClick={() => setRetry(value => value + 1)}>重新加载</button></div>}
      {chapter?.id === selected && <>
        {chapter.sections.length > 1 && <nav className="character-section-nav" aria-label="本章小节">
          {chapter.sections.map((section, index) => <button key={section.title} type="button" onClick={() => root.current?.querySelector(`#character-section-${index}`)?.scrollIntoView({ behavior: "auto", block: "start" })}>{section.title.replace(/^Section \d+ – /, "")}</button>)}
        </nav>}
        <div className="character-reading" key={selected}>
          {chapter.sections.map((section, index) => <section className="character-section" id={`character-section-${index}`} key={section.title}>
            <h3>{section.title === "Words, phrases and sentences" ? "Words, phrases and sentences · 词汇、词组与例句" : section.title}<small>{sectionLabels[section.title.replace(/^Section \d+ – /, "")]}</small></h3>
            {section.entries.map((entry, position) => <div className="character-entry" key={entry.id} data-character-entry={entry.id}>
              {(position === 0 || section.entries[position - 1].label !== entry.label) && <h4>{groupLabels[entry.label] ?? entry.label}</h4>}
              <details className={`character-gloss character-gloss-${entry.kind}`}>
                <summary><span lang="en">{entry.en}</span><span className="character-translation" lang="zh-CN">（{entry.zh}）</span></summary>
              </details>
            </div>)}
          </section>)}
        </div>
        <div className="character-bottom-nav">
          {selected > 20 && <button type="button" onClick={() => openChapter(selected - 1)}>← 上一章</button>}
          <button type="button" onClick={returnToContents}>返回目录</button>
          {selected < 38 && <button type="button" onClick={() => openChapter(selected + 1)}>下一章 →</button>}
        </div>
        <p className="character-source">英文内容：Alison Wilcox, <cite>Descriptosaurus</cite>, 3rd edition · 中文为学习辅助释义。</p>
      </>}
    </>}
  </div>;
}
