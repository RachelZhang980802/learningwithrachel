"use client";

import { useEffect, useRef, useState, useId, type CSSProperties, type ReactNode } from "react";
import "./articles-deeper-analysis.css";

type AnalysisPage = { tableDescription?: string; unit: number; page: number; title: string; width: number; height: number; lines: { text: string; x: number; y: number; width: number; height: number }[] };
export function GrammarAnalysisReader({ onClose, pages, category, eyebrow, assetRoot, className = "", returnFocus, exercises }: { onClose: () => void; pages: AnalysisPage[]; category: string; eyebrow: string; assetRoot: string; className?: string; returnFocus?: HTMLElement | null; exercises: (unit: number, style: CSSProperties) => ReactNode }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const page = pages[index];

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const select = (next: number) => {
    setIndex(next);
    viewport.current?.scrollTo({ top: 0, left: 0 });
  };

  return (
    <dialog ref={dialog} className={`articles-analysis-dialog ${className}`} aria-labelledby={titleId} onCancel={onClose} onKeyDown={event => { if (event.key === "Escape") event.stopPropagation(); }}>
      <header className="articles-analysis-header">
        <div><p>{eyebrow}</p><h2 id={titleId}>Deeper Analysis</h2></div>
        <button type="button" onClick={onClose} className="articles-analysis-close">← Back to {category}</button>
      </header>
      <div className="articles-analysis-toolbar">
        <nav aria-label={`${category} grammar units`}>
          {pages.map((item, i) => <button key={item.unit} type="button" aria-current={i === index ? "page" : undefined} onClick={() => select(i)}>Unit {item.unit}</button>)}
        </nav>
        <div className="articles-analysis-page-links" aria-label={`Unit ${page.unit} pages`}>
          <button type="button" onClick={() => viewport.current?.scrollTo({ top: 0, left: 0 })}>Explanation · {page.page}</button>
          <button type="button" onClick={() => viewport.current?.querySelector(`#unit${page.unit}-exercises`)?.scrollIntoView({ block: "start" })}>Exercises · {page.page + 1}</button>
        </div>
        <div className="articles-analysis-zoom" aria-label="Page zoom">
          <button type="button" aria-label="Zoom out" disabled={zoom === 100} onClick={() => setZoom(z => Math.max(100, z - 25))}>−</button>
          <button type="button" aria-label="Fit page width" onClick={() => setZoom(100)}>{zoom}%</button>
          <button type="button" aria-label="Zoom in" disabled={zoom === 300} onClick={() => setZoom(z => Math.min(300, z + 25))}>+</button>
        </div>
      </div>
      <div className="articles-analysis-viewport" ref={viewport} tabIndex={0} aria-label={`Unit ${page.unit}: ${page.title}. Page ${page.page}–${page.page + 1}`}>
        <div className="articles-analysis-paper" style={{ width: `${zoom}%`, maxWidth: `${11 * zoom}px`, aspectRatio: `${page.width} / ${page.height}` }}>
          <img src={`${assetRoot}/unit-${page.unit}.jpg`} width={page.width} height={page.height} alt={`Original Unit ${page.unit}, ${page.title}, page ${page.page}${page.unit === 44 ? ', including the bee and flowers illustration' : ''}`} draggable={false} />
          <svg className="articles-analysis-text" viewBox={`0 0 ${page.width} ${page.height}`} role="group" aria-label={`Selectable text for Unit ${page.unit}`}>
            {page.tableDescription && <desc>{page.tableDescription}</desc>}
            {page.lines.map((line, i) => <text key={`${page.unit}-${i}`} x={line.x * page.width / 100} y={line.y * page.height / 100} fontSize={line.height * page.height / 100} textLength={line.width * page.width / 100} lengthAdjust="spacingAndGlyphs" dominantBaseline="text-before-edge">{line.text}</text>)}
          </svg>
        </div>
        {exercises(page.unit, { width: `${zoom}%`, maxWidth: `${11 * zoom}px` })}
      </div>
      <footer className="articles-analysis-footer">
        <button type="button" disabled={index === 0} onClick={() => select(index - 1)}>← Previous</button>
        <span aria-live="polite">Unit {page.unit} · {index + 1} / {pages.length} · p. {page.page}–{page.page + 1}</span>
        <button type="button" disabled={index === pages.length - 1} onClick={() => select(index + 1)}>Next →</button>
      </footer>
    </dialog>
  );
}
