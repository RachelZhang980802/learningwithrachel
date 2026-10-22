import classification from "../public/sentence-badges/article01-classification.json";
import { article01Translations } from "./article01Translations";
import source from "./article01Syntax.json";
import type { Lesson, LessonSentence } from "./articleLessons";
import type { StructureNode } from "./structureDiagram";

import { syntaxColors } from "./articleSyntaxLabels";

export const article01SyntaxKey: Record<string, { label: string; color: string }> = {
 appositive: { label: "Appositive clause", color: syntaxColors.appositive },
 main: { label: "Main clause", color: syntaxColors.main },
 relative: { label: "Relative clause", color: syntaxColors.relative },
 object: { label: "Object clause", color: syntaxColors.object },
 predicative: { label: "Predicative clause", color: syntaxColors.predicative },
 condition: { label: "Conditional clause", color: syntaxColors.condition },
 time: { label: "Time clause", color: syntaxColors.time },
 reason: { label: "Reason clause", color: syntaxColors.reason },
 parenthetical: { label: "Parenthetical comment", color: syntaxColors.parenthetical },
 concessive: { label: "Concessive clause", color: syntaxColors.neutral },
 "reduced-concessive": { label: "Reduced concessive clause", color: syntaxColors.neutral },
 subject: { label: "Subject clause", color: syntaxColors.neutral },
 comparative: { label: "Comparative clause", color: syntaxColors.predicative },
};

type Clause = { kind: string; start: number; end: number; anchorEnd: number; text: string; antecedent?: string; restoration?: string; label?: string; color?: string };
type Annotation = {
  text: string; lessonText: string; paragraph: number; paragraphStart: number; paragraphEnd: number; functions: string[][]; clauses: Clause[];
  predicates: { start: number; end: number; text: string; role: string }[]; notes: string[];
};
export const article01Annotations = source as Record<string, Annotation>;

export function withArticle01Structure(sentence: LessonSentence): LessonSentence {
  const annotation = article01Annotations[sentence.id];
  if (!annotation || (annotation.text !== sentence.text && annotation.lessonText !== sentence.text) || annotation.functions.map(([, text]) => text).join("") !== annotation.text) return sentence;
  const text = annotation.text;
  const clauses: StructureNode[] = annotation.clauses.map((c, i): StructureNode => ({
    id: `clause-a01-${sentence.id}-${i}`, kind: "clause", label: c.label ?? article01SyntaxKey[c.kind].label,
    englishLabel: c.label ?? article01SyntaxKey[c.kind].label, syntaxColor: c.color ?? article01SyntaxKey[c.kind].color,
    antecedent: c.antecedent, start: c.start, end: c.end, text: c.text,
    excerpt: c.restoration ? `[${c.restoration}]` : "", children: [],
  })).sort((a, b) => a.start - b.start || b.end - a.end);
  const roots: StructureNode[] = [], stack: StructureNode[] = [];
  for (const c of clauses) {
    while (stack.length && !(stack.at(-1)!.start <= c.start && c.end <= stack.at(-1)!.end)) stack.pop();
    (stack.at(-1)?.children ?? roots).push(c);
    stack.push(c);
  }
  let offset = 0;
  const units: StructureNode[] = annotation.functions.map(([label, content], i) => {
    const start = offset; offset += content.length;
    const predicate = annotation.predicates.find(p => start <= p.start && p.end <= offset);
    return { id: `unit-a01-${sentence.id}-${i}`, kind: "unit", label, englishLabel: label,
      predicateRole: predicate?.role as "main" | "sub" | undefined,
      syntaxColor: predicate ? (predicate.role === "main" ? "#ff2500" : "#feb72e") : "#746958",
      start, end: offset, text: content, children: [] };
  });
  function fill(start: number, end: number, children: StructureNode[]): StructureNode[] {
    const result: StructureNode[] = []; let cursor = start;
    function append(from: number, to: number) {
      for (const unit of units) {
        const a = Math.max(from, unit.start), b = Math.min(to, unit.end);
        if (a < b) result.push({ ...unit, id: `${unit.id}-${a}`, start: a, end: b, text: text.slice(a, b) });
      }
    }
    for (const child of children) {
      append(cursor, child.start);
      result.push({ ...child, children: fill(child.start, child.end, child.children) }); cursor = child.end;
    }
    append(cursor, end); return result;
  }
  return { ...sentence, text, paragraphStart: annotation.paragraphStart, paragraphEnd: annotation.paragraphEnd, functions: annotation.functions, structureNodes: fill(0, text.length, roots),
    structureEnglishOnly: true,
    structureClassification: { ...sentence.classification,
      label: ({ simple: "Simple sentence", compound: "Compound sentence", complex: "Complex sentence", "compound-complex": "Compound-complex sentence", fragment: "Sentence fragment", speech: "Direct speech / reporting structure" } as Record<string, string>)[sentence.classification.type] ?? "Sentence structure",
      priorityLabel: sentence.classification.type === "simple" ? "Quick check" : "Focus" },
    note: annotation.notes.join(" ") };
}

// Article 01 keeps its existing word notebook, audio and practice panels.
// This view model is used only for Text syntax and the Structure panel.
export const article01ReadingLesson: Lesson = {
 articleId: "01", title: "I Become a Student", catSrc: "", vocabulary: [],
 sentences: Object.entries(article01Annotations).map(([id, a]) => withArticle01Structure({
  id: Number(id), text: a.text, paragraph: a.paragraph, paragraphStart: a.paragraphStart, paragraphEnd: a.paragraphEnd,
  functions: a.functions, clauses: [], note: a.notes[0], pdfNotes: [],
  classification: classification.sentences[Number(id) - 1],
  audioSrc: "", translation: article01Translations[a.text] ?? "", paraphrase: "", reuse: { pattern: "", zh: "", en: "" },
 })),
};
