"use client";

import { Fragment, useState, type ReactNode } from "react";
import { VocabularyText } from "./ArticleVocabulary";
import vocabulary from "./article01Vocabulary.json";
import { article01PressTranslations } from "./article01PressTranslations";
import { WordFileDesk } from "./WordFileDesk";
import { WordPronunciation } from "./WordPronunciation";

function SourceText({ text }: { text: string }) {
  return <>{text.split(/(https?:\/\/[^\s\]]+)/g).map((part, index) => /^https?:\/\//.test(part)
    ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
    : <Fragment key={index}>{part}</Fragment>)}</>;
}

function WordFamilyGame({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false);
  const lines = content.split("\n").filter(Boolean);
  return <section className="word-family-game">
    <div className="word-family-heading"><h3>Word family · 词族</h3><button type="button" aria-pressed={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? "Hide answers" : "Reveal answers"}</button></div>
    <p className="word-family-prompt">Fill in the related word before checking the answer.</p>
    <ol>{lines.map((line, index) => <li key={index}>{revealed ? line : line.replace(/^([A-Za-z][A-Za-z-]*)/, "＿＿＿＿＿＿")}</li>)}</ol>
  </section>;
}

export function ArticleOneWords({ sentence, text, initialSourceRow, contextAdornment }: { sentence: number; text: string; initialSourceRow?: number; contextAdornment?: ReactNode }) {
  const entries = vocabulary.records.filter((entry) => entry.sentence === sentence);
  const [selected, setSelected] = useState(() => Math.max(0, entries.findIndex(item => item.sourceRow === initialSourceRow)));
  const selectEntry = (index: number) => { setSelected(index); };
  const entry = entries[selected] ?? entries[0];
  const referenceLinks = entry && "referenceLinks" in entry ? entry.referenceLinks : [];
  if (!entry) return null;
  const sections = entry.supplementation.split(/\n\s*\n/).filter(Boolean);
  const labels: Record<string, string> = {
    "Pattern & Collocation": "Collocations · 搭配",
    "Contrast": "Compare · 近义辨析",
    "Word Family / Formation": "Word family · 词族",
    "Usage Note": "Usage note · 用法提醒",
  };
  const parsed = sections.map(section => {
    const colon = section.indexOf(":");
    return { title: colon >= 0 ? section.slice(0, colon) : "Supplementation", content: colon >= 0 ? section.slice(colon + 1).trim() : section };
  }).filter(section => section.content && section.content !== "—");
  const cards: { id: string; title: string; subtitle: string; content: ReactNode }[] = [];
  if (entry.word || entry.definition || entry.image) cards.push({ id: "meaning", title: "Word & meaning", subtitle: "词义与发音", content: <section className="word-primary">
        <h2>{entry.word || "Supplementation"}</h2>
        {(entry.partOfSpeech || entry.ipa || entry.word) && <div className="word-pronunciation"><span>{entry.partOfSpeech}</span><span>{entry.ipa}</span>{entry.word && <WordPronunciation key={entry.sourceRow} word={entry.word} sourceRow={entry.sourceRow}/>}</div>}
        {entry.definition && <p className="word-definition">{entry.definition}</p>}
        {entry.image && <a className="word-picture" href={entry.image} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${entry.word} 原图`}><img src={entry.image} alt={`${entry.word} · 表格原图`} loading="lazy"/><span>↗ 查看原图</span></a>}
        {entry.otherSenses && entry.otherSenses !== "—" && <section className="word-other"><h3>Other meanings · 其他义项</h3><p>{entry.otherSenses}</p></section>}
        {/^https?:\/\//.test(entry.dictionarySource) && <a className="word-dictionary" href={entry.dictionarySource} target="_blank" rel="noopener noreferrer">Dictionary source · 词典参考 ↗</a>}
        {referenceLinks?.map((link) => <a className="word-dictionary" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}
      </section> });
  const wordFamily = parsed.find(item => item.title === "Word Family / Formation");
  const groups = [
    { id: "collocations", title: "Collocations", subtitle: "搭配", matches: (title: string) => title === "Pattern & Collocation" },
    { id: "compare", title: "Compare", subtitle: "近义辨析", matches: (title: string) => title === "Contrast" },
    { id: "usage", title: "Usage note", subtitle: "用法提醒", matches: (title: string) => !["Pattern & Collocation", "Contrast", "Word Family / Formation"].includes(title) },
  ];
  groups.forEach(group => {
    const items = parsed.filter(item => group.matches(item.title));
    if (items.length || (group.id === "usage" && wordFamily)) cards.push({ ...group, content: <div className="word-related">{wordFamily && group.id === "usage" && <WordFamilyGame content={wordFamily.content}/>} {items.map((item, index) => <section key={index}><h3>{labels[item.title] ?? item.title}</h3><p>{item.content}</p></section>)}</div> });
  });
  const hasPressExample = Boolean(entry.examples?.trim() && entry.examples.trim() !== "—");
  cards.push({ id: "press", title: "In the press", subtitle: "外刊用法", content: <section className="word-press"><h3>In the press · 外刊用法</h3>{hasPressExample ? <><blockquote><SourceText text={entry.examples}/></blockquote><details className="word-translation"><summary>Translation · 翻译</summary><p lang="zh-CN">{article01PressTranslations[entry.sourceRow] || "译文待补充。"}</p></details></> : <p className="word-press-placeholder">外刊例句待补充。</p>}</section> });
  return <div className="word-workspace" data-source-row={entry.sourceRow}>
    <nav className="word-picker" aria-label="本句词条">
      <span>{entries.length} {entries.length === 1 ? "ENTRY" : "ENTRIES"}</span>
      {entries.map((item, index) => <button key={item.sourceRow} aria-pressed={index === selected} onClick={() => selectEntry(index)}>{item.word || "Supplementation"}</button>)}
    </nav>
    <div className="word-context">{contextAdornment}<VocabularyText text={text} sentence={sentence} selectedRow={entry.sourceRow} onSelect={({ sourceRow }) => selectEntry(entries.findIndex(item => item.sourceRow === sourceRow))}/></div>
    <WordFileDesk key={entry.sourceRow} cards={cards} panelId={`word-file-panel-${entry.sourceRow}`}/>
  </div>;
}
