"use client";

import { H1BVisaExercises } from "./H1BVisaExercises";

import { Fragment, useState, type MouseEvent, type ReactNode } from "react";
import type { InquireFeatureArticle } from "./inquire-feature-articles";
import { h1bVocabulary } from "./inquire-h1b-visa-article";

const patterns: Record<string, string> = {
  "ramp up": "ramp(?:ing)?\\s+up", deportation: "deportations?", overhaul: "overhaul(?:s|ed|ing)?",
  cornerstone: "cornerstones?", occupation: "occupations?", initiative: "initiatives?", facilitate: "facilitat(?:e|es|ed|ing)",
  sheepherder: "sheepherders?", agricultural: "agricultural", dearth: "dearths?", sponsor: "sponsor(?:s|ed|ing)?",
  residency: "residenc(?:y|ies)", petition: "petition(?:s|ed|ing)?", cap: "caps?|capped|capping", register: "register(?:s|ed|ing)?",
  prospective: "prospective", eligible: "eligible", "be subject to": "be\\s+subject\\s+to", modest: "modest(?:ly)?",
  fraud: "frauds?", incremental: "incremental(?:ly)?", curb: "curb(?:s|ed|ing)?", undertake: "undertak(?:e|es|en|ing)",
  undercut: "undercut(?:s|ting)?", block: "block(?:s|ed|ing)?", violation: "violations?", randomize: "randomiz(?:e|es|ed|ing)",
  allocate: "allocat(?:e|es|ed|ing)", steer: "steer(?:s|ed|ing)?", undermine: "undermin(?:e|es|ed|ing)",
  erupt: "erupt(?:s|ed|ing)?", merit: "merits?", appointment: "appointments?", backlog: "backlogs?", dire: "dire",
  "in favor of": "in\\s+favor\\s+of", flatten: "flatten(?:s|ed|ing)?", attribute: "attribut(?:e|es|ed|ing)",
  collude: "collud(?:e|es|ed|ing)", "bona fide": "bona\\s+fide", steep: "steep(?:er|est)?", outstrip: "outstrip(?:s|ped|ping)?", oversight: "oversight",
};

export function H1BVisaArticleBody({ article }: { article: InquireFeatureArticle }) {
  const [openNote, setOpenNote] = useState<{ id: string; term: string; pos: string; definition: string; meaning: string; left: number; top: number } | null>(null);
  const vocabulary = h1bVocabulary.map(([term, pos, definition, meaning]) => ({ term, pos, definition, meaning, pattern: patterns[term] ?? term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }));
  const matcher = new RegExp(vocabulary.map(({ pattern }) => `(\\b(?:${pattern})\\b)`).join("|"), "gi");
  const seen = new Set<string>();

  function toggleNote(event: MouseEvent<HTMLButtonElement>, id: string, item: (typeof vocabulary)[number]) {
    if (openNote?.id === id) return setOpenNote(null);
    const button = event.currentTarget;
    const body = button.closest(".inquire-publication-body");
    if (!body) return;
    const wordRect = button.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let rightmost = wordRect.right;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest(".taylor-vocabulary-note")) continue;
      range.selectNodeContents(node);
      for (const rect of Array.from(range.getClientRects())) rightmost = Math.max(rightmost, rect.right);
    }
    setOpenNote({ id, term: item.term, pos: item.pos, definition: item.definition, meaning: item.meaning, left: rightmost - bodyRect.left + 18, top: wordRect.top - bodyRect.top - 2 });
  }

  return <><div className="inquire-publication-body h1b-reading-body">
    {article.paragraphs.map((paragraph, paragraphIndex) => {
      const nodes: ReactNode[] = [];
      let cursor = 0;
      for (const match of paragraph.matchAll(matcher)) {
        const start = match.index ?? 0;
        const groupIndex = match.slice(1).findIndex((value) => value !== undefined);
        const item = vocabulary[groupIndex];
        if (!item || start < cursor) continue;
        if (start > cursor) nodes.push(paragraph.slice(cursor, start));
        const surface = match[0];
        if (seen.has(item.term)) nodes.push(surface);
        else {
          seen.add(item.term);
          const id = `h1b-vocab-${paragraphIndex}-${start}`;
          nodes.push(<span className="taylor-vocabulary-anchor" key={id}><button type="button" className="taylor-vocabulary-highlight" aria-label={`Show vocabulary note for ${item.term}`} aria-expanded={openNote?.id === id} aria-controls={openNote?.id === id ? id : undefined} onClick={(event) => toggleNote(event, id, item)}>{surface}</button></span>);
        }
        cursor = start + surface.length;
      }
      if (cursor < paragraph.length) nodes.push(paragraph.slice(cursor));
      const content = nodes.map((node, index) => typeof node === "string" ? <Fragment key={index}>{node}</Fragment> : node);
      return article.sectionHeadings?.includes(paragraph)
        ? <h2 className="inquire-publication-section-title" key={paragraphIndex}>{content}</h2>
        : <p key={paragraphIndex}>{content}</p>;
    })}
    {openNote && <span className="taylor-vocabulary-note" id={openNote.id} role="group" aria-label={`Vocabulary note for ${openNote.term}`} style={{ left: openNote.left, top: openNote.top, width: 286 }}>
      <span className="taylor-vocabulary-note-tape" aria-hidden="true" />
      <span className="taylor-vocabulary-note-heading"><strong>{openNote.term}</strong><span className="taylor-vocabulary-note-pos">{openNote.pos}</span></span>
      <button type="button" className="taylor-vocabulary-note-close" aria-label={`Close definition for ${openNote.term}`} onClick={() => setOpenNote(null)}>×</button>
      <span className="taylor-vocabulary-note-definition">{openNote.definition}</span>
      <span className="taylor-vocabulary-note-translation">{openNote.meaning}</span>
    </span>}
  </div><H1BVisaExercises /></>;
}
