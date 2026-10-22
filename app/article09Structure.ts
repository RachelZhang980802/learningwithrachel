import auditData from "./article09StructureAudit.json";
import inlineData from "./article09Syntax.json";
import { clauseLabels, clauseChinese, syntaxColors, type ClauseKind } from "./articleSyntaxLabels";
import type { LessonSentence } from "./articleLessons";
import type { StructureNode } from "./structureDiagram";

type ExactRange = { start: number; end: number; label: string; englishLabel: string; restoration?: string; antecedent?: string; syntaxColor?: string };
type Audit = { functions: string[][]; mainClauses: ExactRange[]; extraClauses: ExactRange[]; note: string };
const audits = auditData as Record<string, Audit>;
const marks = inlineData as Record<string, { text: string; predicates: { start: number; end: number; role: "main" | "sub" }[]; clauses: { start: number; end: number; kind: ClauseKind; text: string }[] }>;
const antecedents: Record<number, string> = {
  1: "those", 2: "the tourist", 7: "the spots", 12: "chores", 25: "regional textiles",
  31: "ingredients and practices", 39: "the stage in life", 42: "shoes",
  44: "acting like a tourist in your hometown", 48: "the house",
};

/** Use the local grammatical role, rather than the first keyword in a Chinese label. */
function functionEnglish(label: string, text: string) {
  if (/^(and|but|or|yet|nor)[,;:]?$/i.test(text.trim())) return "Coordinating conjunction";
  if (/连接|引导/.test(label)) return text.trim() === "that" ? "Complementizer" : /^(If|when|since|until|lest|because|Now that)$/i.test(text.trim()) ? "Subordinator" : "Connective";
  if (/关系副词/.test(label)) return "Relative adverb";
  if (/^介词$/.test(label)) return "Preposition";
  if (/介词宾语|介词补语/.test(label)) return "Object of preposition";
  if (/介词补足语/.test(label)) return "Prepositional complement";
  if (/宾语.*补足/.test(label)) return "Object complement";
  if (/主语内部不定式|后置不定式定语|不定式定语/.test(label)) return "Infinitival modifier";
  if (/宾语后置修饰|定语|修饰/.test(label)) return "Modifier";
  if (/存在主体/.test(label)) return "Notional subject";
  if (/真正主语/.test(label)) return "Postposed subject";
  if (/形式主语/.test(label)) return "Formal subject";
  if (/主语中心/.test(label)) return "Head of subject";
  if (/主语/.test(label)) return "Subject";
  if (/系动词/.test(label)) return "Linking verb";
  if (/情态动词/.test(label)) return "Modal auxiliary";
  if (/助动词/.test(label)) return "Auxiliary verb";
  if (/谓语/.test(label)) return "Predicate";
  if (/宾语中心/.test(label)) return "Non-finite verb";
  if (/间接宾语/.test(label)) return "Indirect object";
  if (/直接宾语/.test(label)) return "Direct object";
  if (/宾语/.test(label)) return "Object";
  if (/表语/.test(label)) return "Predicative";
  if (/标题内容/.test(label)) return "Infinitival phrase";
  if (/省略结构动作|并列动作/.test(label)) return "Elliptical verb phrase";
  if (/并列省略/.test(label)) return "Elliptical complement";
  if (/活动补足/.test(label)) return "Non-finite complement";
  if (/承认内容/.test(label)) return "Object of acknowledging";
  if (/同位说明/.test(label)) return "Appositive";
  if (/插入补充|插入评注/.test(label)) return "Parenthetical supplement";
  if (/建议内容|并列建议/.test(label)) return "Infinitival modifier";
  if (/来源补足|并列来源/.test(label)) return "Source complement";
  if (/名词补充/.test(label)) return "Noun complement";
  if (/并列范围终点/.test(label)) return "Range adjunct";
  if (/时间情景/.test(label)) return "Time adjunct";
  if (/总括副词/.test(label)) return "Summative adverb";
  if (/否定承接词/.test(label)) return "Negative connective";
  if (/伴随分词/.test(label)) return "Participial adjunct";
  if (/补足|补语/.test(label)) return "Complement";
  if (/状语/.test(label)) return "Adverbial";
  return "Constituent";
}

/** Exact source ranges shared with the Text annotations; no excerpt guessing. */
export function withArticle09Structure(sentence: LessonSentence): LessonSentence {
  const audit = audits[sentence.id];
  const inline = marks[sentence.id];
  if (!audit || inline?.text !== sentence.text || audit.functions.map(([, text]) => text).join("") !== sentence.text) return sentence;
  const text = sentence.text;
  const ranges: ExactRange[] = [...audit.mainClauses.map(c => ({ ...c, syntaxColor: syntaxColors.main })), ...audit.extraClauses.map(c => ({ ...c, syntaxColor: c.englishLabel === "Parenthetical comment" ? syntaxColors.parenthetical : syntaxColors.main })), ...inline.clauses.map(clause => ({
    start: clause.start, end: clause.end, label: clauseChinese[clause.kind], englishLabel: clauseLabels[clause.kind], syntaxColor: syntaxColors[clause.kind],
    antecedent: clause.kind === "relative" ? antecedents[sentence.id] : undefined,
    restoration: sentence.id === 31 && clause.kind === "relative" ? "that / which" : sentence.id === 49 && clause.kind === "object" ? "that" : undefined,
  }))];
  const nodes: StructureNode[] = ranges.map((range, index): StructureNode => {
    let end = range.end;
    // Include adjacent punctuation without swallowing a following clause or dash.
    while (end < text.length && /[\s,;:.!?)]/.test(text[end])) end++;
    return {
      id: `clause-a09-${sentence.id}-${index}`, kind: "clause", label: range.label,
      englishLabel: range.englishLabel, antecedent: range.antecedent, syntaxColor: range.syntaxColor,
      start: range.start, end, text: text.slice(range.start, end), children: [],
      excerpt: `${range.restoration ? `[${range.restoration}] ` : ""}${text.slice(range.start, end)}`,
    };
  }).sort((a, b) => a.start - b.start || b.end - a.end);
  const roots: StructureNode[] = [], stack: StructureNode[] = [];
  for (const node of nodes) {
    while (stack.length && !(stack.at(-1)!.start <= node.start && node.end <= stack.at(-1)!.end)) stack.pop();
    (stack.at(-1)?.children ?? roots).push(node);
    stack.push(node);
  }
  let offset = 0;
  const units: StructureNode[] = audit.functions.map(([label, content], index) => {
    const start = offset; offset += content.length;
    const predicate = inline.predicates.find(p => start <= p.start && p.end <= offset);
    return { id: `unit-a09-${sentence.id}-${index}`, kind: "unit", label, predicateRole: predicate?.role, syntaxColor: predicate ? syntaxColors[predicate.role] : syntaxColors.neutral, englishLabel: functionEnglish(label, content), functionClass: /连接|引导/.test(label) ? "linker" : /存在主体/.test(label) ? "subject" : /主语内部不定式/.test(label) ? "modifier" : undefined, start, end: offset, text: content, children: [] };
  });
  function fill(start: number, end: number, children: StructureNode[]): StructureNode[] {
    const result: StructureNode[] = [];
    let cursor = start;
    function appendUnits(from: number, to: number) {
      for (const unit of units) {
        const a = Math.max(from, unit.start), b = Math.min(to, unit.end);
        if (a < b) result.push({ ...unit, id: `${unit.id}-${a}`, start: a, end: b, text: text.slice(a, b) });
      }
    }
    for (const child of children) {
      appendUnits(cursor, child.start);
      result.push({ ...child, children: fill(child.start, child.end, child.children) });
      cursor = child.end;
    }
    appendUnits(cursor, end);
    return result;
  }
  return {
    ...sentence, functions: audit.functions, note: audit.note,
    classification: { ...sentence.classification, note: audit.note },
    structureNodes: fill(0, text.length, roots),
    structureEnglishOnly: true,
    structureClassification: { ...sentence.classification, note: audit.note,
      label: ({ simple: "Simple sentence", compound: "Compound sentence", complex: "Complex sentence", "compound-complex": "Compound-complex sentence", fragment: "Sentence fragment" } as Record<string, string>)[sentence.classification.type] ?? "Sentence structure",
      priorityLabel: sentence.classification.type === "simple" ? "Quick check" : "Focus" },
  };
}
