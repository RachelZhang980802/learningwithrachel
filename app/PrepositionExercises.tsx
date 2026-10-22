"use client";

import { Fragment, useId, useState, type CSSProperties, type ReactNode } from "react";
import "./unit44-exercises.css";
import "./article-grammar-exercises.css";
import "./preposition-exercises.css";

type Slot = { id: string; answer: string; note?: string; prompt?: string; mode?: string };
type Row = { id: string; label: string; parts: (string | Slot)[]; kind?: string };
type Section = { id: string; heading: string; reference: string; rows: Row[]; words?: string[]; banks?: { label: string; words: string[] }[]; email?: boolean; crossOut?: boolean; definitions?: string[]; matching?: boolean; figure?: { src: string; viewBox: string; width: number; height: number; alt: string } };
export type PrepositionUnit = { unit: number; page: number; title: string; sections: Section[]; additional?: string };

// Only these formatting tokens are interpreted; source text never becomes HTML.
function rich(text: string): ReactNode {
  return text.replace(/\\n/g, "\n").split(/(~~.*?~~|__.*?__|\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("~~") ? <s key={i}>{rich(part.slice(2, -2))}</s> :
    part.startsWith("__") ? <u key={i}>{rich(part.slice(2, -2))}</u> :
    part.startsWith("*") ? <em key={i}>{rich(part.slice(1, -1))}</em> : <Fragment key={i}>{part}</Fragment>);
}

export function PrepositionExercises({ unit, hidden, style }: { unit: PrepositionUnit; hidden: boolean; style: CSSProperties }) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const prefix = useId();
  const toggle = (id: string) => setOpened(prev => ({ ...prev, [id]: !prev[id] }));
  const answer = (slot: Slot, example = false) => <><span className={example ? "ag-example-answer" : "u44-answer"}>{slot.answer}</span>{slot.note && <span className="u44-note"> ({slot.note})</span>}</>;
  const slotControl = (slot: Slot, section: Section, inlineNote: boolean) => {
    const active = !!opened[slot.id];
    const choices = slot.mode === "choice";
    const correct = slot.answer.split(" / ");
    return <Fragment key={slot.id}><button type="button" data-answer-key={slot.id} aria-expanded={active} aria-label={active ? `${slot.id}: ${slot.answer}. Hide answer` : `${slot.id}: reveal answer`} onClick={() => toggle(slot.id)} className={choices ? "prep-choice" : "u44-blank ag-blank"}>
      {choices ? slot.prompt!.split(" / ").map((option, i) => <Fragment key={i}>{i > 0 && " / "}<em className={active ? correct.includes(option) ? "prep-correct" : section.crossOut ? "prep-incorrect" : "" : ""}>{option}</em></Fragment>) : active ? <span className="u44-answer">{slot.answer}</span> : <span aria-hidden="true">&nbsp;</span>}
    </button>{inlineNote && active && slot.note && <span className="u44-note"> ({slot.note})</span>}</Fragment>;
  };
  const renderRow = (row: Row, section: Section) => {
    const slot = row.parts.find((part): part is Slot => typeof part !== "string")!;
    if (row.kind === "sentence" || (row.kind === "example" && slot.mode === "append")) {
      const original = row.parts.filter((part): part is string => typeof part === "string").join("");
      if (row.kind === "example" && section.matching) return <span className="ag-row-copy">{rich(original)}</span>;
      if (row.kind === "example") return <span className="ag-row-copy">{rich(original)}<span className="prep-response">{answer(slot, true)}</span></span>;
      return <button className="u44-sentence" type="button" data-answer-key={slot.id} aria-expanded={!!opened[slot.id]} onClick={() => toggle(slot.id)}>
        {rich(original)}{opened[slot.id] && <span className="prep-response">{answer(slot)}</span>}
      </button>;
    }
    return <span className="ag-row-copy">{row.parts.map((part, i) => typeof part === "string" ? <Fragment key={i}>{rich(part)}</Fragment> : row.kind === "example" ? <Fragment key={part.id}>{answer(part, true)}</Fragment> : slotControl(part, section, !!section.email))}{!section.email && row.parts.filter((part): part is Slot => typeof part !== "string" && !!part.note && !!opened[part.id]).map(slot => <span className="u44-note" key={`${slot.id}-note`}> ({slot.note})</span>)}</span>;
  };
  const bank = (words: string[]) => <div className="ag-word-bank">{words.map(word => <span key={word}>{rich(word)}</span>)}</div>;
  return <article id={`unit${unit.unit}-exercises`} className="u44-page ag-exercises prep-exercises" hidden={hidden} style={style} aria-labelledby={`${prefix}-title`}>
    <header className="u44-header"><h2 id={`${prefix}-title`}>Exercises</h2><div className="u44-unit">Unit<strong>{unit.unit}</strong></div></header>
    {unit.sections.map(section => <section key={section.id} className="u44-section" data-exercise={section.id} aria-labelledby={`${prefix}-${section.id}`}>
      <h3 id={`${prefix}-${section.id}`}><span className="u44-badge">{section.id}</span><span>{section.heading} {section.reference && <span className="u44-ref">{section.reference}</span>}</span></h3>
      {section.words && bank(section.words)}
      {section.banks && <div className="prep-banks">{section.banks.map(b => <div key={b.label}><span>{b.label}</span>{bank(b.words)}</div>)}</div>}
      {section.email ? <div className="ag-email">
        <div className="ag-email-titlebar" aria-hidden="true"><i /><i /><i /></div>
        <div className="ag-email-actions" aria-hidden="true"><span>Send</span><span>Save Now</span><span>Discard</span></div>
        <div className="ag-email-format" aria-hidden="true"><b>B</b><i>I</i><u>U</u><span>≡</span><span>☷</span><span>❝</span><span>Plain Text</span><span>Check Spelling ▾</span></div>
        <p>{renderRow(section.rows[0], section)}</p>
      </div> : <div className={section.matching ? "prep-matching" : undefined}>
        <ol>{section.rows.map(row => <li key={row.id} data-exercise-row={row.id}><span className="u44-number">{row.label}</span>{renderRow(row, section)}</li>)}</ol>
        {section.definitions && <div className="prep-definitions" aria-label="Matching definitions">{section.definitions.map(definition => <p key={definition}>{rich(definition)}</p>)}</div>}
      </div>}
      {section.matching && section.rows.filter(row => row.kind === "example").map(row => <p className="prep-matching-example" key={row.id}>{row.parts.filter((part): part is Slot => typeof part !== "string").map(slot => <Fragment key={slot.id}>{answer(slot, true)}</Fragment>)}</p>)}
      {section.figure && <figure className="u44-crowd"><svg viewBox={section.figure.viewBox} role="img" aria-label={section.figure.alt}><image href={section.figure.src} width={section.figure.width} height={section.figure.height} /></svg></figure>}
    </section>)}
    <footer className="u44-footer"><span>{unit.additional}</span><strong>{unit.page}</strong></footer>
  </article>;
}
