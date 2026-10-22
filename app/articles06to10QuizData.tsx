"use client";

import { Fragment, useState, type ReactNode } from "react";
import type { QuizCategory, QuizExercise } from "./article01QuizData";
import source from "./book2Quiz.json";
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

function Book2Question({ item }: { item: Entry }) {
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  let cursor = 0;
  const toggle = (n: number) => setVisible(current => ({ ...current, [n]: !current[n] }));
  const flag = (n: number, blank: boolean) => <button
    type="button"
    className="book2-answer-flag"
    aria-label={`${item.title}, answer ${n + 1}: ${visible[n] ? "hide" : "reveal"}`}
    aria-expanded={Boolean(visible[n])}
    onClick={(event) => { event.stopPropagation(); toggle(n); }}
  >⚑</button>;
  function render(text: string): ReactNode {
    const chunks = text.split(/(\*\*[^*]+\*\*|____|\n)/g);
    return chunks.map((part, i) => {
      if (part === "\n") return <br key={i} />;
      if (part === "____") {
        const n = cursor++;
        const open = Boolean(visible[n]);
        return <span className="book2-fill" key={i}>{flag(n, true)}<span className={`book2-answer-line${open ? " is-revealed" : ""}`}>{open ? item.answers[n] : "\u00a0".repeat(6)}</span></span>;
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
  const finalFlag = !item.inline && <span className="book2-final-answer">{flag(0, false)}{visible[0] && <span className="book2-answer-text"><strong>Answer:</strong> {item.answers[0]}</span>}</span>;
  const anyOpen = Object.values(visible).some(Boolean);
  return <div className="book2-question" data-book2-id={item.id}>
    {content}
    {finalFlag}
    {item.review && anyOpen && <p className="book2-review">{item.review}</p>}
    <small className="book2-source">Student PDF · p. {item.studentPage}　 Teacher’s book · PDF p. {item.teacherPage}</small>
  </div>;
}

export const articles06to10QuizData = (source as UnitSource[]).map(unit => ({
  articleNumber: unit.articleNumber,
  unitLabel: `UNIT ${unit.unit} · BOOK 2`,
  articleTitle: titles[unit.articleNumber],
  categories: unit.categories.map((category, i): QuizCategory => ({
    id: category.id,
    label: category.label,
    color: colors[i],
    exercises: category.exercises.map((item): QuizExercise => ({
      title: item.title,
      instruction: item.instruction,
      prompt: <Book2Question item={item} />,
      answer: null,
      selfManagedAnswers: true,
    })),
  })),
}));
