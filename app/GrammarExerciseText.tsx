/* Text recognized from the user's scanned exercise and answer pages. */
import { Fragment, useState, type ReactNode } from "react";
import rawExercises from "./grammarExerciseText.json";
import type { GrammarExercise } from "./grammarStudyData";
import { grammarAnswerExplanation } from "./grammarAnswerExplanations";

type Line = { text: string; x: number; top: number; kind: "body" | "heading" | "instruction"; height: number; answerNumber?: number };
type Fragment = { page: number; start: number; end: number; ratio: number; lines: Line[] };
type TextExercise = { source: "main" | "supp"; fragments: Fragment[]; answer: { pages: number[]; lines: { text: string; indent: number; heading: boolean }[] } };
const exerciseText = rawExercises as unknown as Record<string, TextExercise>;

function readingLines(lines: Line[], exerciseId: string): Line[] {
  if (exerciseId === "s151") {
    const left = lines.filter((line) => line.x < 45).sort((a, b) => a.top - b.top);
    const right = lines.filter((line) => line.x >= 45).sort((a, b) => a.top - b.top);
    return [...left, ...right];
  }
  const sorted = [...lines].sort((a, b) => a.top - b.top || a.x - b.x);
  const rows: Line[][] = [];
  for (const line of sorted) {
    const row = rows.at(-1);
    const rowTop = row ? row.reduce((sum, item) => sum + item.top, 0) / row.length : 0;
    if (row && Math.abs(line.top - rowTop) < 0.62) row.push(line);
    else rows.push([line]);
  }
  return rows.map((row) => {
    const ordered = [...row].sort((a, b) => a.x - b.x);
    const text = ordered.map((line) => line.text.trim()).reduce((result, part) => {
      if (!result) return part;
      const left = result.replace(/\s+$/, "");
      if (left.endsWith("-") && /^[a-z]/.test(part)) return `${left.slice(0, -1)}${part}`;
      return `${left} ${part}`;
    }, "").replace(/(?:\.{2,}\s*){2,}/g, ".....");
    return { ...ordered[0], text, answerNumber: ordered.find((line) => line.answerNumber != null)?.answerNumber };
  });
}

export function GrammarQuestionText({ exercise }: { exercise: GrammarExercise }) {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(() => new Set());
  const data = exerciseText[exercise.id];
  if (!data) return <p className="grammar-exercise-missing">Exercise text is not available.</p>;
  const toggleAnswer = (key: string) => setRevealedAnswers((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });
  const exerciseNumber = exercise.id.replace(/^[sm]/, "").replace("-", ".");
  const answers = new Map<number, string>();
  const matchingAnswers = new Map<string, string>();
  let matchingGroup: "A" | "B" = "A";
  for (const answer of data.answer.lines) {
    if (answer.heading) continue;
    if (/^\s*B(?:\s*[·.]\s*1\s+|\s+1\s+)/i.test(answer.text)) matchingGroup = "B";
    for (const match of answer.text.matchAll(/(?:^|[·\s])([1-6])\s+([a-f])(?=$|[·\s])/g)) matchingAnswers.set(`${matchingGroup}-${match[1]}`, match[2]);
    const numbered = answer.text.match(/^\s*(\d{1,2})\s+(.+)$/);
    if (numbered) answers.set(Number(numbered[1]), numbered[2]);
    for (const match of answer.text.matchAll(/(?:^|[·\s])([1-9]|1[0-9])\s*([a-g])(?=\s|$)/g)) answers.set(Number(match[1]), match[2]);
  }
  const answerControl = (key: string, answer: string | undefined, itemNumber: number | null, group?: "A" | "B") => {
    const revealed = revealedAnswers.has(key);
    const explanation = answer ? grammarAnswerExplanation(exercise.id, itemNumber, answer, group) : "";
    return <Fragment key={key}>
      <span className="grammar-exercise-revealed-answer"><button type="button" className="grammar-exercise-blank" aria-label={revealed ? `Hide answer for item ${itemNumber ?? ""}` : `Show answer for item ${itemNumber ?? ""}`} title={revealed ? "Hide answer" : "Show answer"} onClick={() => toggleAnswer(key)} />{revealed && <strong className="grammar-exercise-answer-value">{answer || "PDF answer unavailable"}</strong>}</span>
      {revealed && explanation && <small className="grammar-exercise-answer-note">({explanation})</small>}
    </Fragment>;
  };
  return <div className={`grammar-exercise-text is-${data.source} is-text-view`}>
    {data.fragments.map((fragment, index) => {
      const flow = readingLines(fragment.lines, exercise.id);
      let activeGroup: "A" | "B" = "A";
      let activeQuestionNumber: number | null = null;
      const questionsWithBlanks = new Set<number>();
      let lastQuestionNumber: number | null = null;
      for (const sourceLine of flow) {
        const markers = [...sourceLine.text.matchAll(/\((\d{1,2})\)|^\s*(?:[AB]\s+)?(\d{1,2})[.)]?\s+/g)];
        if (markers.length) lastQuestionNumber = Number(markers.at(-1)?.[1] || markers.at(-1)?.[2]);
        if (/\.{2,}|_{3,}/.test(sourceLine.text)) {
          if (markers.length) for (const match of markers) questionsWithBlanks.add(Number(match[1] || match[2]));
          else if (lastQuestionNumber !== null) questionsWithBlanks.add(lastQuestionNumber);
        }
      }
      return <div className="grammar-exercise-text-scroller" key={`${fragment.page}-${index}`}><div className="grammar-exercise-text-sheet">
        {flow.map((line, n) => {
          let text = line.text;
          if (exercise.id === "s150") text = text.replace(/\((\d{1,2})\)(?:\s+in(?=\s+the flat))?/g, "($1) _____");
          if (/^\s*B\s+1\b/.test(text)) activeGroup = "B";
          if (/^\s*A\s+1\b/.test(text)) activeGroup = "A";
          const group = ([...text.matchAll(/\b([AB])\s+\d{1,2}/g)].at(-1)?.[1] as "A" | "B" | undefined) || activeGroup;
          const markerNumber = Number(text.match(/\((\d{1,2})\)/)?.[1] || text.match(/^\s*(?:[AB]\s+)?(\d{1,2})[.)]?\s+/)?.[1] || 0) || null;
          if (markerNumber !== null) activeQuestionNumber = markerNumber;
          const itemNumber = line.answerNumber ?? markerNumber ?? activeQuestionNumber;
          const parts = text.split(/(\.{2,}|_{3,})/g);
          const hasBlank = parts.length > 1;
          const content: ReactNode[] = [];
          for (const [partIndex, part] of parts.entries()) {
            if (/^(\.{2,}|_{3,})$/.test(part)) {
              const prefix = parts.slice(0, partIndex).join("");
              const marker = [...prefix.matchAll(/\((\d{1,2})\)/g)].at(-1)?.[1] || prefix.match(/^\s*(?:[AB]\s+)?(\d{1,2})[.)]?\s+/)?.[1];
              const blankNumber = line.answerNumber ?? (Number(marker || itemNumber || 0) || null);
              const blankGroup = ([...prefix.matchAll(/\b([AB])\s+\d{1,2}/g)].at(-1)?.[1] as "A" | "B" | undefined) || group;
              const answer = exercise.id === "s154" ? matchingAnswers.get(`${blankGroup}-${blankNumber}`) : (blankNumber == null ? undefined : answers.get(blankNumber));
              const answerParts = answer && /(?:\.{3,}|…+)/.test(answer) ? answer.split(/\s*(?:\.{3,}|…+)\s*/g) : [answer];
              const blankIndex = parts.slice(0, partIndex).filter((value) => /^(\.{2,}|_{3,})$/.test(value)).length;
              const key = `${fragment.page}-${n}-${partIndex}`;
              content.push(answerControl(key, answerParts[answer && answerParts.length > 1 ? blankIndex : 0], blankNumber, blankGroup));
            } else if (part) content.push(<span key={`text-${partIndex}`}>{part}</span>);
          }
          const numbered = [...text.matchAll(/\((\d{1,2})\)|^\s*(?:[AB]\s+)?(\d{1,2})[.)]?\s+/g)];
          if (!hasBlank && numbered.length && line.kind !== "heading" && !/^\s*\d{1,2}[.-]\d\b/.test(text)) {
            const parenthesized = [...text.matchAll(/\((\d{1,2})\)/g)];
            if (parenthesized.length > 0) {
              const inlineContent: ReactNode[] = [];
              let cursor = 0;
              for (const [markerIndex, marker] of parenthesized.entries()) {
                const end = (marker.index || 0) + marker[0].length;
                inlineContent.push(<span key={`before-${markerIndex}`}>{text.slice(cursor, end)}</span>);
                const number = Number(marker[1]);
                const answer = exercise.id === "s154" ? matchingAnswers.get(`${group}-${number}`) : answers.get(number);
                if (number <= 18 && !questionsWithBlanks.has(number)) inlineContent.push(answerControl(`${fragment.page}-${n}-answer-${group}-${number}-${markerIndex}`, answer, number, group));
                cursor = end;
              }
              if (cursor < text.length) inlineContent.push(<span key="after-markers">{text.slice(cursor)}</span>);
              content.splice(0, content.length, ...inlineContent);
            } else {
              const number = Number(numbered[0]?.[2]);
              const answer = exercise.id === "s154" ? matchingAnswers.get(`${group}-${number}`) : answers.get(number);
              if (number <= 18 && !questionsWithBlanks.has(number)) content.push(answerControl(`${fragment.page}-${n}-answer-${group}-${number}`, answer, number, group));
            }
          }
          return <div key={n} className={`grammar-exercise-text-line is-${line.kind}${text === exerciseNumber ? " is-exercise-number" : ""}`}>{content}</div>;
        })}
      </div></div>;
    })}
  </div>;
}
