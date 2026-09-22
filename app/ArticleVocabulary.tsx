"use client";
import { Fragment } from "react";
import vocabulary from "./article01Vocabulary.json";

export type VocabularyTarget = { sentence: number; sourceRow: number };
// Surface forms in the source text. Split constructions highlight their lexical parts.
const forms: Record<number, string[]> = {
  2: ["education"], 6: ["illustrates"], 15: ["hit on", "hit upon"], 17: ["specialized"],
  18: ["prescribed"], 19: ["concentrated on"], 23: ["cinches"],
  24: ["neglected"], 25: ["rebelled"], 28: ["Blessed", "with"],
  29: ["commit"], 32: ["light", "throw upon"], 33: ["proposed"],
  39: ["appealed to"], 40: ["called on"], 42: ["deepened"],
  44: ["historians"], 53: ["the making of"], 56: ["ruling passion"],
  58: ["ran through"], 59: ["differed on"], 60: ["authorities"],
  61: ["disagreed on"], 64: ["eras"],
};
export function vocabularyMatches(text: string, sentence: number) {
  const matches: { start: number; end: number; sourceRow: number; word: string; sentence: number }[] = [];
  for (const entry of vocabulary.records.filter(r => r.sentence === sentence && r.word.trim())) {
    const entryForms = "surfaceForms" in entry && Array.isArray(entry.surfaceForms) ? entry.surfaceForms : undefined;
    for (const form of entryForms ?? forms[entry.sourceRow] ?? [entry.word.trim()]) {
      const re = new RegExp(String.raw`\b${form}\b`, "gi");
      for (const match of text.matchAll(re)) matches.push({ start: match.index!, end: match.index! + match[0].length, sourceRow: entry.sourceRow, word: entry.word, sentence });
    }
  }
  return matches.sort((a,b) => a.start-b.start || b.end-a.end).filter((match,index,all) => !all.slice(0,index).some(previous => previous.end > match.start && previous.start <= match.start));
}
export function VocabularyText({ text, sentence, onSelect, selectedRow }: { text: string; sentence: number; onSelect: (target: VocabularyTarget) => void; selectedRow?: number }) {
  const matches = vocabularyMatches(text, sentence);
  let offset = 0;
  return <>{matches.map(match => {
    const before = text.slice(offset, match.start); offset = match.end;
    return <Fragment key={`${match.start}-${match.sourceRow}`}>{before}<button type="button" className="vocabulary-highlight" aria-label={`查看词汇 ${match.word.trim()}`} aria-pressed={selectedRow === undefined ? undefined : selectedRow === match.sourceRow} onClick={() => onSelect({ sentence, sourceRow: match.sourceRow })}>{text.slice(match.start, match.end)}</button></Fragment>;
  })}{text.slice(offset)}</>;
}
export function VocabularyParagraph({ text, sentenceStart, onSelect }: { text: string; sentenceStart: number; onSelect: (target: VocabularyTarget) => void }) {
  const parts = text.match(/[^.!?]+[.!?]+(?:["”])?|[^.!?]+$/g) ?? [text];
  return <>{parts.map((part,index) => <VocabularyText key={index} text={part} sentence={sentenceStart + index} onSelect={onSelect}/>)}</>;
}
