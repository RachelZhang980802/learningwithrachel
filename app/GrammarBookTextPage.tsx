import type { CSSProperties, ReactNode } from "react";
import rawPages from "./grammarBookText.json";
import rawDecorations from "./grammarBookDecorations.json";

type Part = [string, number];
type Line = { text: string; x: number; top: number; h: number; kind: "title" | "badge" | "section" | "folio" | "body"; parts: Part[] };
type Page = { unit: number; printedPage: number; lines: Line[] };
const pages = rawPages as unknown as Record<string, Page>;
type Decoration = { type: "h" | "v"; left: number; top: number; length: number };
const decorations = rawDecorations as Record<string, Decoration[]>;

function textParts(parts: Part[]): ReactNode {
  return parts.map(([value, flags], index) => {
    let node: ReactNode = value;
    if (flags & 2) node = <em>{node}</em>;
    if (flags & 1) node = <strong>{node}</strong>;
    return <span key={index}>{node}</span>;
  });
}

function printedLine(line: Line): ReactNode {
  const example = line.text.startsWith("• ");
  if (!example) return textParts(line.parts);
  return textParts(line.parts.map(([value, flags], index) => [index === 0 ? value.replace(/^•\s*/, "") : value, flags]));
}

export function GrammarBookTextPage({ unit }: { unit: number }) {
  const page = pages[String(unit)];
  if (!page) return null;
  return <article className="grammar-text-page" aria-label={`English Grammar in Use Unit ${unit}, page ${page.printedPage}, selectable text`}>
    <header className="grammar-text-caption"><strong>Unit {unit}</strong><span>Page {page.printedPage} · Selectable text</span></header>
    <div className="grammar-text-scroller"><div className="grammar-text-sheet">
      {page.lines.filter((line) => line.kind === "section").map((line, index) => <span key={`section-${index}`} aria-hidden="true" className="grammar-text-section-band" style={{ top: `${line.top - 0.2}%` }} />)}
      {(decorations[String(unit)] || []).map((rule, index) => <span key={`rule-${index}`} aria-hidden="true" className={`grammar-text-rule is-${rule.type}`} style={{ left: `${rule.left}%`, top: `${rule.top}%`, [rule.type === "h" ? "width" : "height"]: `${rule.length}%` } as CSSProperties} />)}
      {page.lines.map((line, index) => <div key={index} className={`grammar-text-line is-${line.kind}${line.text.startsWith("• ") ? " is-example" : ""}${line.text.length > 90 || (line.kind === "title" && line.text.length > 40) ? " is-long" : ""}`} style={{ left: `${line.x}%`, top: `${line.top}%`, maxWidth: `${Math.max(1, 99 - line.x)}%`, fontSize: `${line.h * 0.91}cqw` } as CSSProperties}>{unit === 72 && line.kind === "title" ? "A/an and the" : printedLine(line)}</div>)}
    </div></div>
  </article>;
}
