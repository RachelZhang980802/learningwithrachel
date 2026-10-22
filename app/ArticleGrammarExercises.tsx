"use client";

import { Fragment, useId, useState, type CSSProperties } from "react";
import type { GrammarRow, GrammarSlot, GrammarUnitExercises } from "./grammarExerciseUnits";
import "./unit44-exercises.css";
import "./article-grammar-exercises.css";

export function ArticleGrammarExercises({ unit, hidden, style }: { unit: GrammarUnitExercises; hidden: boolean; style: CSSProperties }) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const prefix = useId();
  const toggle = (id: string) => setOpened(current => ({ ...current, [id]: !current[id] }));
  const notes = (row: GrammarRow) => row.parts.filter((part): part is GrammarSlot => typeof part !== "string" && !!part.note && !!opened[part.id]);
  const blank = (slot: GrammarSlot, inlineNote = false) => <Fragment key={slot.id}>
    <button type="button" className="u44-blank ag-blank" data-answer-key={slot.id} aria-expanded={!!opened[slot.id]} aria-label={`${slot.id}: ${opened[slot.id] ? "hide" : "reveal"} answer`} onClick={() => toggle(slot.id)}>
      {opened[slot.id] ? <span className="u44-answer">{slot.answer}</span> : slot.prompt ? <span>{slot.prompt.split("____")[0]}<span className="ag-prompt-line" aria-hidden="true">&nbsp;</span></span> : <span aria-hidden="true">&nbsp;</span>}
    </button>{inlineNote && opened[slot.id] && slot.note && <span className="u44-note"> ({slot.note})</span>}
  </Fragment>;
  const parts = (row: GrammarRow, email = false) => row.parts.map((part, i) => typeof part === "string" ? <Fragment key={i}>{part}</Fragment> : row.kind === "example" ? <span className="ag-example-answer" key={part.id}>{part.answer}</span> : blank(part, email));
  const sentence = (row: GrammarRow) => {
    const slot = row.parts.find((part): part is GrammarSlot => typeof part !== "string")!;
    const active = !!opened[slot.id];
    return <button type="button" className="u44-sentence" data-answer-key={slot.id} aria-expanded={active} onClick={() => toggle(slot.id)}>
      {row.parts.map((part, i) => typeof part === "string" ? <Fragment key={i}>{part}</Fragment> : active ? <span key={part.id}>{part.answer === "✓" ? " " : ""}<span className={`u44-answer${part.id.startsWith("45.2") ? " ag-underlined" : ""}`}>{part.answer}</span></span> : <em key={part.id}>{part.prompt}</em>)}
      {active && slot.note && <span className="u44-note"> ({slot.note})</span>}
    </button>;
  };

  return <article id={`unit${unit.unit}-exercises`} className="u44-page ag-exercises" hidden={hidden} style={style} aria-labelledby={`${prefix}-title`}>
    <header className="u44-header"><h2 id={`${prefix}-title`}>Exercises</h2><div className="u44-unit">Unit<strong>{unit.unit}</strong></div></header>
    {unit.sections.map(section => <section key={section.id} className="u44-section" aria-labelledby={`${prefix}-${section.id}`} data-exercise={section.id}>
      <h3 id={`${prefix}-${section.id}`}><span className="u44-badge">{section.id}</span><span>{section.heading} <span className="u44-ref">{section.reference}</span></span></h3>
      {section.words && <div className="ag-word-bank" aria-label={`${section.id} word bank`}>{section.words.map(word => <span key={word}>{word}</span>)}</div>}
      {section.email ? <div className="ag-email">
        <div className="ag-email-titlebar" aria-hidden="true"><i /><i /><i /></div>
        <div className="ag-email-actions" aria-hidden="true"><span>Send</span><span>Save Now</span><span>Discard</span></div>
        <div className="ag-email-format" aria-hidden="true"><b>B</b><i>I</i><u>U</u><span>≡</span><span>☷</span><span>❝</span><span>Plain Text</span><span>Check Spelling ▾</span></div>
        <p>{parts(section.rows[0], true)}</p>
      </div> : <ol>{section.rows.map(item => <li key={item.id} data-exercise-row={item.id}>
        <span className="u44-number">{item.label}</span>
        {item.kind === "sentence" ? sentence(item) : <span className="ag-row-copy">{parts(item)}{notes(item).map(slot => <span className="u44-note" key={slot.id}> ({slot.note})</span>)}</span>}
      </li>)}</ol>}
    </section>)}
    {unit.unit === 45 && <figure className="u44-crowd"><svg viewBox="200 1690 1030 270" role="img" aria-label="Original illustration: a red-haired woman arrives at a party and the guests turn to look at her"><image href="/articles-analysis/exercises-45.jpg" width="1486" height="2058" /></svg></figure>}
    <footer className="u44-footer"><span>➜ Additional exercise 10 (page 246)</span><strong>{unit.page}</strong></footer>
  </article>;
}
