"use client";

import { Children, Fragment, cloneElement, isValidElement, useState, type ReactNode, type ReactElement } from "react";
import "./unit4-quiz-interactions.css";

type Answer = { answer: string; note?: string };

export function Unit4FillBlanks({ content, answers, prefix }: { content: ReactNode; answers: Answer[]; prefix: string }) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  let blankIndex = 0;
  const replace = (node: ReactNode): ReactNode => Children.map(node, child => {
    if (typeof child === "string") return child.split(/(_{3,})/g).map((part, i) => {
      if (!/^_{3,}$/.test(part)) return <Fragment key={i}>{part}</Fragment>;
      const index = blankIndex++;
      const id = `${prefix}-${index + 1}`;
      const value = answers[index];
      if (!value) return part;
      const open = !!opened[id];
      return <button key={id} type="button" className="u4-inline-blank" data-u4-answer={id} aria-expanded={open} aria-label={open ? `${id}: ${value.answer}. Hide answer` : `${id}: reveal answer`} onClick={() => setOpened(prev => ({ ...prev, [id]: !prev[id] }))}>{open ? <span className="u4-inline-answer">{value.answer}</span> : <span aria-hidden="true">&nbsp;</span>}</button>;
    });
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    const children = replace(child.props.children);
    // Old marked blanks included neighbouring nouns; only the answer location is interactive.
    return child.type === "mark" ? <Fragment key={child.key}>{children}</Fragment> : cloneElement(child as ReactElement<{ children?: ReactNode }>, {}, children);
  });
  return <div className="u4-inline-exercise">{replace(content)}{answers.map((value, index) => value.note && opened[`${prefix}-${index + 1}`] ? <p className="u4-answer-note" key={index}><strong>{value.answer}</strong> — {value.note}</p> : null)}</div>;
}

const outline = [
  { part: "I", paras: "1–2", answer: "The idea of taxing robots is spreading." },
  { part: "II", paras: "3–4", answer: "By citing the example of textile factories, the author points out that robots, the same as other tools, make people lose jobs and the next generation learn new skills to stay relevant." },
  { part: "III", paras: "5–7", answer: "Automation has brought about some side effects and challenges." },
  { part: "IV", paras: "8–9", answer: "The author refutes Bill Gates’ argument that robots should be taxed and gives some solutions to lower taxes and robots replacing human workers." },
  { part: "V", paras: "10", answer: "The author concludes that automation, though painful, is inevitable." },
];

export function Unit4ReadingOutline() {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  return <table className="u4-outline-table" aria-label="Reading outline: parts, paragraphs and main ideas">
    <colgroup><col className="u4-outline-part" /><col className="u4-outline-paras" /><col /></colgroup>
    <thead><tr><th scope="col">Part</th><th scope="col">Para(s).</th><th scope="col">Main idea</th></tr></thead>
    <tbody>{outline.map((row, index) => <tr key={row.part}>
      <th scope="row">{row.part}</th><td>{row.paras}</td><td>{index === 0 ? row.answer : <button type="button" className="u4-outline-blank" data-u4-answer={`outline-${row.part}`} aria-expanded={!!opened[row.part]} aria-label={opened[row.part] ? `Part ${row.part}: ${row.answer} Hide main idea` : `Part ${row.part}: reveal main idea`} onClick={() => setOpened(prev => ({ ...prev, [row.part]: !prev[row.part] }))}>{opened[row.part] ? <span className="u4-inline-answer">{row.answer}</span> : <span className="u4-outline-line" aria-hidden="true">&nbsp;</span>}</button>}</td>
    </tr>)}</tbody>
  </table>;
}

const verbChoices = [
  ["The fact that she is still alive (consoles, console) me.", "consoles"],
  ["Whether he likes it or not (is, are) not our concern.", "is"],
  ["There (is, are) a girl reading a book in the sun.", "is"],
  ["There (is, are) things we cannot possess in the world.", "are"],
  ["There (is, are) a bird and three ducks in the yard.", "is"],
  ["There are a lot of people who (has, have) lost their jobs.", "have"],
  ["Jane is one of those girls who (doesn’t, don’t) care much about looks.", "doesn’t / don’t"],
  ["Honesty is the only one of her qualities that (interests, interest) me.", "interests"],
];
export function Unit4VerbChoices() {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <ol className="u4-verb-choices">{verbChoices.map(([sentence, answer], index) => <li key={sentence}><span className="u4-choice-number" aria-hidden="true">{index + 1}.</span><button type="button" className="u4-choice-sentence" data-u4-answer={`concord-choice-${index + 1}`} aria-expanded={!!opened[index]} onClick={() => setOpened(prev => ({ ...prev, [index]: !prev[index] }))}>{sentence}{opened[index] && <span className="u4-inline-answer u4-choice-answer"> — {answer}</span>}</button></li>)}</ol>;
}
