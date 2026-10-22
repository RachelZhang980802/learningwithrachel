import source from "./article10Syntax.json";
import type { LessonSentence } from "./articleLessons";
import type { StructureNode } from "./structureDiagram";

// Existing shared colors are retained; new categories follow the supplied Unit 10 sample.
// The fused relative has no established structural color, so it stays neutral.
export const article10SyntaxKey: Record<string, { label: string; color: string }> = {
  main: { label: "Main clause", color: "#ff2500" },
  relative: { label: "Relative clause", color: "#e9a300" },
  object: { label: "Object clause", color: "#f3484e" },
  appositive: { label: "Appositive clause", color: "#1515ee" },
  condition: { label: "Conditional clause", color: "#45abe5" },
  time: { label: "Time clause", color: "#68ab00" },
  manner: { label: "Manner clause", color: "#45abe5" },
  comparison: { label: "Comparative clause", color: "#00cb00" },
  contrast: { label: "Contrast clause", color: "#333333" },
  place: { label: "Place clause", color: "#68ab00" },
  parenthetical: { label: "Parenthetical comment", color: "#3bbe0f" },
  "fused-relative": { label: "Fused relative clause", color: "#746958" },
};

type Clause = { kind: string; start: number; end: number; anchorEnd: number; text: string; antecedent?: string; restoration?: string };
type Annotation = {
  text: string; functions: string[][]; clauses: Clause[];
  predicates: { start: number; end: number; text: string; role: string }[]; notes: string[];
};
export const article10Annotations = source as Record<string, Annotation>;

export function withArticle10Structure(sentence: LessonSentence): LessonSentence {
  const annotation = article10Annotations[sentence.id];
  if (!annotation || annotation.text !== sentence.text || annotation.functions.map(([, text]) => text).join("") !== sentence.text) return sentence;
  const { text } = sentence;
  const clauses: StructureNode[] = annotation.clauses.map((c, i): StructureNode => ({
    id: `clause-a10-${sentence.id}-${i}`, kind: "clause", label: article10SyntaxKey[c.kind].label,
    englishLabel: article10SyntaxKey[c.kind].label, syntaxColor: article10SyntaxKey[c.kind].color,
    antecedent: c.antecedent, start: c.start, end: c.end, text: c.text,
    excerpt: c.restoration ? `[${c.restoration}] ${c.text}` : c.text, children: [],
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
    return { id: `unit-a10-${sentence.id}-${i}`, kind: "unit", label, englishLabel: label,
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
  return { ...sentence, functions: annotation.functions, structureNodes: fill(0, text.length, roots),
    structureEnglishOnly: true,
    structureClassification: { ...sentence.classification,
      label: ({ simple: "Simple sentence", compound: "Compound sentence", complex: "Complex sentence", "compound-complex": "Compound-complex sentence", speech: "Direct speech / reporting structure" } as Record<string, string>)[sentence.classification.type] ?? "Sentence structure",
      priorityLabel: sentence.classification.type === "simple" ? "Quick check" : "Focus" },
    note: annotation.notes.join(" ") };
}
