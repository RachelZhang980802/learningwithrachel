"use client";

import { Fragment, useId, useState, type CSSProperties, type ReactNode } from "react";
import "./unit44-exercises.css";
import "./article-grammar-exercises.css";
import "./concord-exercises.css";

type Slot = { id: string; answer: string; note?: string; prompt?: string; mode?: string; label?: string; example?: boolean };
type Row = { id: string; label: string; parts: (string | Slot)[]; kind?: string };
type Group = { banks: string[][]; rows: Row[] };
type Section = { id: string; heading: string; reference: string; rows: Row[]; words?: string[]; groups?: Group[]; layout?: string };
type ConcordUnit = { unit: number; page: number; title: string; sections: Section[]; additional: string };

function rich(text: string): ReactNode {
  return text.split(/(~~.*?~~|\*[^*]+\*)/g).map((part, i) => part.startsWith("~~") ? <s key={i}>{part.slice(2, -2)}</s> : part.startsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>);
}

export function ConcordExercises({ unit, hidden, style }: { unit: ConcordUnit; hidden: boolean; style: CSSProperties }) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const prefix = useId();
  const toggle = (id: string) => setOpened(previous => ({ ...previous, [id]: !previous[id] }));
  const answer = (slot: Slot, example = false) => <span className={example ? "ag-example-answer" : "u44-answer"}>{slot.answer}</span>;
  const control = (slot: Slot, example: boolean) => {
    const active = example || !!opened[slot.id];
    const correction = slot.mode === "correction";
    const content = correction ? <><sup>{slot.label}</sup><em className={active && slot.answer !== "✓" ? "concord-original-corrected" : undefined}>{slot.prompt}</em>{active && <> {answer(slot, example)}</>}</> : active ? answer(slot, example) : <span aria-hidden="true">&nbsp;</span>;
    if (example) return <span key={slot.id} className="concord-example">{content}</span>;
    return <button key={slot.id} type="button" data-answer-key={slot.id} className={correction ? "concord-correction" : "u44-blank ag-blank"} aria-expanded={active} aria-label={active ? `${slot.id}: ${slot.answer}. Hide answer` : `${slot.id}${correction ? `: ${slot.prompt}` : ""}. Reveal answer`} onClick={() => toggle(slot.id)}>{content}</button>;
  };
  const renderRow = (row: Row) => {
    if (row.kind === "sentence") {
      const slot = row.parts.find((part): part is Slot => typeof part !== "string")!;
      return <button type="button" className="u44-sentence" data-answer-key={slot.id} aria-expanded={!!opened[slot.id]} onClick={() => toggle(slot.id)}>{row.parts.filter((part): part is string => typeof part === "string").map(rich)}{opened[slot.id] && <span className="concord-response"> — {answer(slot)}{slot.note && <span className="u44-note"> ({slot.note})</span>}</span>}</button>;
    }
    return <span className="ag-row-copy">{row.parts.map((part, i) => typeof part === "string" ? <Fragment key={i}>{rich(part)}</Fragment> : control(part, row.kind === "example" || !!part.example))}{row.parts.filter((part): part is Slot => typeof part !== "string" && !!part.note && !!opened[part.id]).map(slot => <span className="u44-note concord-note" key={slot.id}>{answer(slot)}: {slot.note}</span>)}</span>;
  };
  const rows = (items: Row[]) => <ol>{items.map(row => <li key={row.id} data-exercise-row={row.id}><span className="u44-number">{row.label}</span>{renderRow(row)}</li>)}</ol>;
  const bank = (words: string[]) => <div className="ag-word-bank">{words.map(word => <span key={word}>{rich(word)}</span>)}</div>;
  return <article id={`unit${unit.unit}-exercises`} className="u44-page ag-exercises concord-exercises" hidden={hidden} style={style} aria-labelledby={`${prefix}-title`}>
    <header className="u44-header"><h2 id={`${prefix}-title`}>Exercises</h2><div className="u44-unit">Unit<strong>{unit.unit}</strong></div></header>
    {unit.sections.map(section => <section key={section.id} className={`u44-section concord-${section.layout ?? "sentences"}`} data-exercise={section.id} aria-labelledby={`${prefix}-${section.id}`}>
      <h3 id={`${prefix}-${section.id}`}><span className="u44-badge">{section.id}</span><span>{section.heading} <span className="u44-ref">{section.reference}</span></span></h3>
      {section.words && bank(section.words)}
      {section.layout === "review" ? <div className="concord-review-paper"><aside><strong>Museums and<br />historic sites</strong><br />The Rivers Museum<br />Open: 9 am – 5 pm,<br />Mon – Sat<br />Entrance: Free</aside><p>{renderRow(section.rows[0])}</p></div> : rows(section.rows)}
      {section.groups?.map((group, i) => <div className="concord-group" key={i}>
        <div className="concord-banks">{group.banks.map((words, j) => <div key={j}><span>({j === 0 ? "i" : "ii"})</span>{bank(words)}</div>)}</div>{rows(group.rows)}
      </div>)}
    </section>)}
    <footer className="u44-footer"><span>{unit.additional}</span><strong>{unit.page}</strong></footer>
  </article>;
}
