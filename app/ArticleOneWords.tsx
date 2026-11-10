"use client";

import { useState, type ReactNode } from "react";
import { VocabularyText } from "./ArticleVocabulary";
import vocabulary from "./article01Vocabulary.json";
import { article01PressTranslations } from "./article01PressTranslations";
import { WordFileDesk } from "./WordFileDesk";
import { WordPronunciation } from "./WordPronunciation";
import { MeaningExamples, type MeaningExampleItem } from "./MeaningExamples";
import { SoMuchAsUses } from "./SoMuchAsUses";
import { CollocationLines } from "./CollocationLines";
import { WordFamilyTreeGame } from "./WordFamilyTreeGame";
import { article01WordFamilies } from "./article01WordFamilies";
import { PressExample } from "./PressExample";

const pressHighlightOverrides: Record<number, string[]> = {
  9: ["minds fixed"],
  13: ["as much as"],
  25: ["rebel against"],
  29: ["commit them to memory"],
  39: ["appealed to the US president for help"],
  40: ["called on"],
  102: ["irrelevant"],
};

function parsePressExample(text: string) {
  const urlMatch = text.match(/https?:\/\/[^\s\]]+/);
  const url = urlMatch?.[0].replace(/[.\[]+$/, "") ?? "";
  let sentence = (urlMatch ? text.slice(0, urlMatch.index) : text).replace(/\s*\[\s*$/, "").trim();
  const leadingLabel = /^[^.!?"“”\n]{1,80}:\s*/;
  while (leadingLabel.test(sentence)) sentence = sentence.replace(leadingLabel, "").trim();
  return { sentence, url };
}

export function ArticleOneWords({ sentence, text, initialSourceRow, contextAdornment }: { sentence: number; text: string; initialSourceRow?: number; contextAdornment?: ReactNode }) {
  const entries = vocabulary.records.filter((entry) => entry.sentence === sentence);
  const [selected, setSelected] = useState(() => Math.max(0, entries.findIndex(item => item.sourceRow === initialSourceRow)));
  const selectEntry = (index: number) => { setSelected(index); };
  const entry = entries[selected] ?? entries[0];
  const referenceLinks: { label: string; url: string }[] = entry && "referenceLinks" in entry && Array.isArray(entry.referenceLinks)
    ? entry.referenceLinks.filter((link): link is { label: string; url: string } => Boolean(link && typeof link === "object" && "label" in link && "url" in link))
    : [];
  if (!entry) return null;
  const definitionEn = "definitionEn" in entry && typeof entry.definitionEn === "string" ? entry.definitionEn : "";
  const otherSensesEn = "otherSensesEn" in entry && typeof entry.otherSensesEn === "string" ? entry.otherSensesEn : "";
  const otherChineseLines = String(entry.otherSenses || "").split(/\n/).map(line => line.replace(/^\s*\d+[.)]\s*/, "").trim()).filter(Boolean);
  const otherEnglishLines = (otherSensesEn ? otherSensesEn.split(/\n/) : otherChineseLines.map(() => "Other dictionary meaning"))
    .map(line => line.replace(/^\s*\d+[.)]\s*/, "").trim()).filter(Boolean);
  const otherMeaningItems: MeaningExampleItem[] = otherEnglishLines.map((english, index) => ({
    english,
    chinese: otherChineseLines[index] || "释义见词典条目。",
    partOfSpeech: "otherSensePartsOfSpeech" in entry && Array.isArray(entry.otherSensePartsOfSpeech) ? entry.otherSensePartsOfSpeech[index] : undefined,
    catalogIndex: "otherSenseExampleIndices" in entry && Array.isArray(entry.otherSenseExampleIndices) ? entry.otherSenseExampleIndices[index] : undefined,
  }));
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
        {entry.definition && <section className="word-context-meaning"><h3>Meaning in context <span className="word-sense-pos">{"contextPartOfSpeech" in entry && typeof entry.contextPartOfSpeech === "string" ? entry.contextPartOfSpeech : entry.partOfSpeech}</span></h3>{definitionEn && <p className="word-definition word-definition-en" lang="en">{definitionEn}</p>}<p className="word-definition word-definition-zh" lang="zh-CN">{entry.definition}</p></section>}
        {entry.image && <a className="word-picture" href={entry.image} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${entry.word} 原图`}><img src={entry.image} alt={`${entry.word} · 表格原图`} loading="lazy"/><span>↗ 查看原图</span></a>}
        {entry.word === "so much as" ? <SoMuchAsUses/> : <section className="word-other"><h3>Other meanings</h3>{otherMeaningItems.length > 0 ? <MeaningExamples word={entry.word} items={otherMeaningItems}/> : <p className="word-single-sense">本词或表达没有需要另列的其他常用义项。</p>}</section>}
        {referenceLinks?.map((link) => <a className="word-dictionary" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}
      </section> });
  const wordFamily = parsed.find(item => item.title === "Word Family / Formation");
  const family = article01WordFamilies[entry.sourceRow];
  const familyEntries = family?.entries ?? wordFamily?.content.split("\n").filter(Boolean) ?? [];
  const groups = [
    { id: "collocations", title: "Collocations", subtitle: "搭配", matches: (title: string) => title === "Pattern & Collocation" },
    { id: "compare", title: "Compare", subtitle: "近义辨析", matches: (title: string) => title === "Contrast" },
    { id: "usage", title: "Usage note", subtitle: "用法提醒", matches: (title: string) => !["Pattern & Collocation", "Contrast", "Word Family / Formation"].includes(title) },
  ];
  groups.forEach(group => {
    const items = parsed.filter(item => group.matches(item.title));
    if (items.length || group.id === "collocations") cards.push({ ...group, content: <div className="word-related">{items.map((item, index) => <section key={index}><h3>{labels[item.title] ?? item.title}</h3>{item.title === "Pattern & Collocation" ? <CollocationLines values={item.content.split("\n").filter(Boolean)}/> : <p>{item.content}</p>}</section>)}{group.id === "collocations" && <WordFamilyTreeGame root={family?.root ?? entry.word} entries={familyEntries} distinctions={family?.distinctions}/>}</div> });
  });
  const hasPressExample = Boolean(entry.examples?.trim() && entry.examples.trim() !== "—");
  const pressExample = parsePressExample(entry.examples ?? "");
  const pressHighlightTerms = pressHighlightOverrides[entry.sourceRow] ?? [entry.word];
  cards.push({ id: "press", title: "In the press", subtitle: "外刊用法", content: <section className="word-press"><h3>In the press · 外刊用法</h3>{hasPressExample ? <PressExample example={{ english: pressExample.sentence, chinese: article01PressTranslations[entry.sourceRow] || "译文待补充。", url: pressExample.url, source: pressExample.url ? new URL(pressExample.url).hostname.replace(/^www\./, "") : "Source" }} terms={pressHighlightTerms}/> : <p className="word-press-placeholder">外刊例句待补充。</p>}</section> });
  return <div className="word-workspace" data-source-row={entry.sourceRow}>
    <nav className="word-picker" aria-label="本句词条">
      <span>{entries.length} {entries.length === 1 ? "ENTRY" : "ENTRIES"}</span>
      {entries.map((item, index) => <button key={item.sourceRow} aria-pressed={index === selected} onClick={() => selectEntry(index)}>{item.word || "Supplementation"}</button>)}
    </nav>
    <div className="word-context">{contextAdornment}<VocabularyText text={text} sentence={sentence} selectedRow={entry.sourceRow} onSelect={({ sourceRow }) => selectEntry(entries.findIndex(item => item.sourceRow === sourceRow))}/></div>
    <WordFileDesk key={entry.sourceRow} cards={cards} panelId={`word-file-panel-${entry.sourceRow}`}/>
  </div>;
}
