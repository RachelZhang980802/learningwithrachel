"use client";

import { Fragment, useState, type KeyboardEvent, type ReactNode } from "react";
import type { QuizCategory, QuizExercise } from "./article01QuizData";
import source from "./book2Quiz.json";
import { getBook2Translation } from "./book2QuizTranslations";
import "./book2Quiz.css";

type Table = { caption?: string; headers: string[]; rows: string[][] };
type Entry = {
  id: string;
  title: string;
  instruction: string;
  paragraphs: string[];
  answers: string[];
  studentPage: string;
  teacherPage: string;
  inline: boolean;
  bank?: string[];
  table?: Table;
  review?: string;
};
type UnitSource = { unit: number; articleNumber: string; categories: { id: string; label: string; exercises: Entry[] }[] };
const colors = ["#c6d4c8", "#e4c4bc", "#ccd5de", "#d6cee1", "#e6d2bd", "#e6c5b1", "#cdc0b7"];
const titles: Record<string, string> = {
  "06": "Reading", "07": "What We Gain or Lose in Cities",
  "08": "The Guide to Being a Foodie Without Being Culturally Appropriative",
  "09": "Stop Telling Me to Travel like a Local, Okay?",
  "10": "Two Ways of Seeing a River",
};

function Book2Question({ item, translation }: { item: Entry; translation: string }) {
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  let cursor = 0;
  const toggle = (n: number) => setVisible(current => ({ ...current, [n]: !current[n] }));

  function render(text: string): ReactNode {
    const chunks = text.split(/(\*\*[^*]+\*\*|____|\n)/g);
    return chunks.map((part, i) => {
      if (part === "\n") return <br key={i} />;
      if (part === "____") {
        const n = cursor++;
        const open = Boolean(visible[n]);
        return <button
          type="button"
          className={`book2-inline-blank${open ? " is-revealed" : ""}`}
          aria-label={`${item.title}第 ${n + 1} 空，${open ? "收起答案" : "显示答案"}`}
          aria-expanded={open}
          onClick={(event) => { event.stopPropagation(); toggle(n); }}
          key={i}
        >{open ? item.answers[n] : <span aria-hidden="true">______</span>}</button>;
      }
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
      return <Fragment key={i}>{part}</Fragment>;
    });
  }

  const content = <>
    {item.bank && <p className="book2-bank">{item.bank.join(" · ")}</p>}
    {item.paragraphs.map((paragraph, i) => <p key={i} className="book2-paragraph">{render(paragraph)}</p>)}
    {item.table && <div className="book2-table-scroll"><table className="book2-table">{item.table.caption && <caption>{render(item.table.caption)}</caption>}<thead><tr>{item.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{item.table.rows.map((row, i) => <tr key={i}>{row.map((value, j) => <td key={j}>{render(value)}</td>)}</tr>)}</tbody></table></div>}
  </>;
  const sentenceOpen = Boolean(visible[0]);
  const anyOpen = item.inline ? Object.values(visible).some(Boolean) : sentenceOpen;
  const onSentenceKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(0);
    }
  };

  return <div className="book2-question" data-book2-id={item.id}>
    {item.inline ? content : <div
      className="book2-sentence-target"
      role="button"
      tabIndex={0}
      aria-expanded={sentenceOpen}
      aria-label={`${item.title}，${sentenceOpen ? "收起答案" : "显示答案"}`}
      onClick={() => toggle(0)}
      onKeyDown={onSentenceKey}
    >{content}</div>}
    {!item.inline && sentenceOpen && <p className="book2-answer-text"><strong>Answer:</strong> {item.answers[0]}</p>}
    {anyOpen && <p className="book2-translation">{translation}</p>}
    {item.review && anyOpen && <p className="book2-review">{item.review}</p>}
    <small className="book2-source">Student PDF · p. {item.studentPage}　 Teacher’s book · PDF p. {item.teacherPage}</small>
  </div>;
}

export const articles06to10QuizData = (source as UnitSource[]).map(unit => ({
  articleNumber: unit.articleNumber,
  unitLabel: `UNIT ${unit.unit} · BOOK 2`,
  articleTitle: titles[unit.articleNumber],
  categories: unit.categories.map((category, categoryIndex): QuizCategory => ({
    id: category.id,
    label: category.label,
    color: colors[categoryIndex],
    exercises: category.exercises.map((item, exerciseIndex): QuizExercise => ({
      title: item.title,
      instruction: item.instruction,
      prompt: <Book2Question item={item} translation={getBook2Translation(unit.unit, categoryIndex, exerciseIndex, item.paragraphs, item.answers)} />,
      answer: null,
      selfManagedAnswers: true,
    })),
  })),
}));
