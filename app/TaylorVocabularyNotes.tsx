"use client";

import { Fragment, useState, type MouseEvent, type ReactNode } from "react";
import { taylorCommencementArticle, taylorCommencementVocabulary, taylorCommencementVocabularyNotes } from "./taylor-commencement";

const surfaceForms: Partial<Record<(typeof taylorCommencementVocabulary)[number], string>> = {
  trustee: "trustees?",
  misstep: "missteps?",
  sacrifice: "sacrific(?:e|es|ed|ing)",
  navigate: "navigat(?:e|es|ed|ing)",
  perpetuate: "perpetuat(?:e|es|ed|ing)",
  ensnare: "ensnar(?:e|es|ed|ing)",
  songwriter: "songwriters?",
  chameleon: "chameleons?",
  apologize: "apologi[sz](?:e|es|ed|ing)"
};

const vocabularyPattern = new RegExp(
  `\\b(${taylorCommencementVocabulary.map((word) => surfaceForms[word] ?? word).join("|")})\\b`,
  "gi"
);

function canonicalWord(surface: string) {
  return taylorCommencementVocabulary.find((word) => new RegExp(`^(?:${surfaceForms[word] ?? word})$`, "i").test(surface)) ?? surface.toLowerCase();
}

const partsOfSpeech: Record<(typeof taylorCommencementVocabulary)[number], string> = {
  stadium: "n.", glittery: "adj.", leotard: "n.", trustee: "n.", alumni: "n.",
  insanely: "adv.", bazillion: "adj.", misstep: "n.", sacrifice: "n./v.", technically: "adv.",
  catchy: "adj.", cathartic: "adj.", breeds: "n.", glamorous: "adj.", imaginary: "adj.",
  pandemic: "n.", unsolicited: "adj.", navigate: "v.", cringe: "n./v.", retrospectively: "adv.",
  revolting: "adj.", hilarious: "adj.", stigma: "n.", ambivalence: "n.", perpetuate: "v.",
  ensnare: "v.", songwriter: "n.", chameleon: "n.", continuation: "n.", obsessed: "adj.",
  overwhelming: "adj.", ultimately: "adv.", embarrassed: "adj.", hometown: "n.", housewives: "n.",
  excruciatingly: "adv.", ridiculous: "adj.", likability: "n.", perfectionism: "n.", framework: "n.",
  apologize: "v."
};

export function TaylorVocabularyArticleBody() {
  const [openNote, setOpenNote] = useState<{ id: string; surface: string; note: (typeof taylorCommencementVocabularyNotes)[keyof typeof taylorCommencementVocabularyNotes] & { pos: string }; left: number; top: number; width: number } | null>(null);
  const seenVocabulary = new Set<string>();

  function toggleNote(event: MouseEvent<HTMLButtonElement>, id: string, surface: string) {
    if (openNote?.id === id) {
      setOpenNote(null);
      return;
    }

    const button = event.currentTarget;
    const paragraph = button.closest("p");
    const body = button.closest(".inquire-publication-body");
    const word = canonicalWord(surface) as keyof typeof taylorCommencementVocabularyNotes;
    const entry = taylorCommencementVocabularyNotes[word];
    if (!paragraph || !body || !entry) return;
    const note = { ...entry, pos: partsOfSpeech[word] };

    const wordRect = button.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    // Measure the article's rightmost text edge once per opening. This creates
    // a shared note rail beyond every line, regardless of which word is clicked.
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let rightmostTextEdge = wordRect.right;
    let textNode: Node | null;
    while ((textNode = walker.nextNode())) {
      if (textNode.parentElement?.closest(".taylor-vocabulary-note")) continue;
      range.selectNodeContents(textNode);
      for (const rect of Array.from(range.getClientRects())) {
        rightmostTextEdge = Math.max(rightmostTextEdge, rect.right);
      }
    }
    const width = 286;
    const left = rightmostTextEdge - bodyRect.left + 18;
    const top = wordRect.top - bodyRect.top - 2;

    setOpenNote({ id, surface, note, left, top, width });
  }

  return <div className="inquire-publication-body">{taylorCommencementArticle.paragraphs.map((paragraph, paragraphIndex) => {
    const nodes: ReactNode[] = [];
    let cursor = 0;
    for (const match of paragraph.matchAll(vocabularyPattern)) {
      const start = match.index ?? 0;
      const surface = match[0];
      const word = canonicalWord(surface);
      if (seenVocabulary.has(word)) {
        if (start > cursor) nodes.push(paragraph.slice(cursor, start));
        nodes.push(surface);
        cursor = start + surface.length;
        continue;
      }
      seenVocabulary.add(word);
      const id = `taylor-note-${paragraphIndex}-${start}`;
      if (start > cursor) nodes.push(paragraph.slice(cursor, start));
      nodes.push(<span className="taylor-vocabulary-anchor" key={id}>
        <button type="button" className="taylor-vocabulary-highlight" aria-label={`Show pronunciation and definition for ${surface}`} aria-expanded={openNote?.id === id} aria-controls={openNote?.id === id ? id : undefined} onClick={(event) => toggleNote(event, id, surface)}>{surface}</button>
      </span>);
      cursor = start + surface.length;
    }
    if (cursor < paragraph.length) nodes.push(paragraph.slice(cursor));
    return <p key={paragraphIndex}>{nodes.map((node,index) => typeof node === "string" ? <Fragment key={index}>{node}</Fragment> : node)}</p>;
  })}{openNote && <span className="taylor-vocabulary-note" id={openNote.id} role="group" aria-label={`Vocabulary note for ${openNote.surface}`} style={{ left: openNote.left, top: openNote.top, width: openNote.width }}>
    <span className="taylor-vocabulary-note-tape" aria-hidden="true" />
    <span className="taylor-vocabulary-note-heading"><strong>{openNote.surface}</strong><span className="taylor-vocabulary-note-pos">{openNote.note.pos}</span><span>{openNote.note.ipa}</span></span>
    <button type="button" className="taylor-vocabulary-note-close" aria-label={`Close definition for ${openNote.surface}`} onClick={() => setOpenNote(null)}>×</button>
    <span className="taylor-vocabulary-note-definition">{openNote.note.definition}</span>
    <span className="taylor-vocabulary-note-translation">{openNote.note.zh}</span>
  </span>}</div>;
}
