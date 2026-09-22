"use client";

import { useId, useState, type ReactNode } from "react";

export type WordFileCard = { id: string; title: string; subtitle: string; content: ReactNode };

/** Shared vocabulary file layout for every article. Content stays article-specific. */
export function WordFileDesk({ cards, panelId }: { cards: WordFileCard[]; panelId?: string }) {
  const generatedId = useId();
  const id = panelId ?? generatedId;
  const [openSection, setOpenSection] = useState<string | null>(null);
  const active = cards.find(card => card.id === openSection);
  return <div className="word-file-desk">
    <nav className="word-file-tabs" aria-label="词条内容分类">
      {cards.map((card, index) => <button key={card.id} className={`word-file-tab word-file-${card.id}`} aria-pressed={active?.id === card.id} aria-controls={id} onClick={() => setOpenSection(card.id)}><span className="word-file-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{card.title}</strong><small>{card.subtitle}</small></span></button>)}
    </nav>
    <section id={id} className={`word-file-paper${active ? " is-open" : ""}`} aria-label={active?.title ?? "词条内容"}>
      {active ? <div key={active.id}>{active.content}</div> : <p className="word-file-hint">Click a note on the left to open its study content.</p>}
    </section>
  </div>;
}

export function PendingWordWorkspace({ text, word, meaning }: { text: string; word?: string; meaning?: ReactNode }) {
  const section = (heading: string, message: string) => <div className="word-related"><section><h3>{heading}</h3><p className="study-pending">{message}</p></section></div>;
  const cards: WordFileCard[] = [
    { id: "meaning", title: "Word & meaning", subtitle: "词义与发音", content: <section className="word-primary">{meaning ?? <><h2>Word & meaning</h2><p className="word-definition study-pending">词条、音标与中英释义待整理。</p></>}</section> },
    { id: "collocations", title: "Collocations", subtitle: "搭配", content: section("Collocations · 搭配", "核心搭配待补充。") },
    { id: "compare", title: "Compare", subtitle: "近义辨析", content: section("Compare · 近义辨析", "近义辨析待补充。") },
    { id: "usage", title: "Usage note", subtitle: "用法提醒", content: <div className="word-related"><section><h3>Word family · 词族</h3><p className="study-pending">词族待整理。</p></section><section><h3>Usage note · 用法提醒</h3><p className="study-pending">用法提醒待补充。</p></section></div> },
    { id: "press", title: "In the press", subtitle: "外刊用法", content: <section className="word-press"><h3>In the press · 外刊用法</h3><p className="study-pending">外刊例句待补充。</p></section> },
  ];
  return <div className="word-workspace">
    <nav className="word-picker" aria-label="本句词条"><span>{word ? "1 ENTRY" : "词条待整理"}</span>{word && <button aria-pressed="true">{word}</button>}</nav>
    <div className="word-context">{text}</div>
    <WordFileDesk cards={cards}/>
  </div>;
}
