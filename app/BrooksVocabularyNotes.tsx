"use client";

import { Fragment, useState, type MouseEvent, type ReactNode } from "react";
import { CommencementExercises } from "./CommencementExercises";

export type VocabularyNoteTerm = {
  key: string;
  pattern: string;
  label: string;
  pos: string;
  ipa: string;
  definition: string;
  zh: string;
};

const brooksTerms: VocabularyNoteTerm[] = [
  { key: "commencement", pattern: "commencement", label: "commencement", pos: "n.", ipa: "/kəˈmɛnsmənt/", definition: "A ceremony at which students receive their academic degrees or diplomas.", zh: "学位授予典礼；毕业典礼" },
  { key: "bastard", pattern: "bastards?", label: "bastard", pos: "n.", ipa: "/ˈbæstərd/", definition: "An insulting word for a person considered unpleasant, rude, or cruel.", zh: "混蛋；恶棍（侮辱性用语）" },
  { key: "stand_up", pattern: "stood\\s+me\\s+up", label: "stand somebody up", pos: "v. phr.", ipa: "/stænd ˈsʌmbədi ʌp/", definition: "To deliberately fail to meet someone as arranged, especially for a date.", zh: "故意失约；放某人鸽子" },
  { key: "mediocre", pattern: "mediocre", label: "mediocre", pos: "adj.", ipa: "/ˌmiːdiˈoʊkər/", definition: "Not very good; only of average quality.", zh: "平庸的；普通的" },
  { key: "genre", pattern: "genre", label: "genre", pos: "n.", ipa: "/ˈʒɑːnrə/", definition: "A particular type or style of literature, art, film, or music.", zh: "（文学、艺术、电影或音乐的）体裁；类型" },
  { key: "drop_names", pattern: "drop\\s+the\\s+names", label: "drop names", pos: "v. phr.", ipa: "/drɑːp ˈneɪmz/", definition: "To mention famous or important people you know to impress others.", zh: "提及名人以抬高身份" },
  { key: "obscure", pattern: "obscure", label: "obscure", pos: "adj.", ipa: "/əbˈskjʊr/", definition: "Not well known or not easily noticed.", zh: "无名的；鲜为人知的" },
  { key: "hip_to", pattern: "(?:I['’]m|be|get(?:ting|s)?|got)\\s+hip\\s+to", label: "be/get hip to", pos: "v. phr.", ipa: "/ˈhɪp tuː/", definition: "To understand, know about, or be aware of something.", zh: "了解；熟悉" },
  { key: "screw_that", pattern: "screw\\s+that", label: "screw that", pos: "phr.", ipa: "/skruː ðæt/", definition: "An informal expression used to reject or dismiss an idea with irritation.", zh: "去他的；别理那一套（口语）" },
  { key: "put_off", pattern: "put\\s+off", label: "put off", pos: "v. phr.", ipa: "/pʊt ɔːf/", definition: "To change something to a later time or date; to postpone it.", zh: "推迟；延迟" },
  { key: "void", pattern: "void", label: "void", pos: "n.", ipa: "/vɔɪd/", definition: "An empty space or a feeling that something important is missing.", zh: "空白；空虚" },
  { key: "administrator", pattern: "administrators?", label: "administrator", pos: "n.", ipa: "/ədˈmɪnɪstreɪtər/", definition: "A person responsible for managing an organization or its office work.", zh: "管理人员；行政人员" },
  { key: "fail", pattern: "fail(?:s|ed|ing)?", label: "fail", pos: "v.", ipa: "/feɪl/", definition: "To let someone down by not doing what is expected or needed.", zh: "有负于；使失望" },
  { key: "vicissitude", pattern: "vicissitudes?", label: "vicissitude", pos: "n.", ipa: "/vɪˈsɪsɪtuːd/", definition: "A change or difficulty that happens during the course of life.", zh: "变迁；人生沉浮" },
  { key: "atheism", pattern: "atheism", label: "atheism", pos: "n.", ipa: "/ˈeɪθiɪzəm/", definition: "The belief that there is no God or no gods.", zh: "无神论" },
  { key: "inheritance", pattern: "inheritance", label: "inheritance", pos: "n.", ipa: "/ɪnˈherɪtəns/", definition: "Something valuable or important passed down from the past.", zh: "遗产；传承" },
  { key: "careerist", pattern: "careerist", label: "careerist", pos: "adj.", ipa: "/kəˈrɪərɪst/", definition: "Too focused on career success, often at the expense of other concerns.", zh: "事业至上的；一心追求事业成功的（含贬义）" },
  { key: "specialty", pattern: "specialt(?:y|ies)", label: "specialty", pos: "n.", ipa: "/ˈspeʃəlti/", definition: "A subject or area in which someone has special knowledge or skill.", zh: "专业领域；专长" },
  { key: "host", pattern: "host", label: "host", pos: "n.", ipa: "/hoʊst/", definition: "A large number or variety of people or things.", zh: "大量；许多" },
  { key: "draw_on", pattern: "draw\\s+on", label: "draw on", pos: "v. phr.", ipa: "/drɔː ɑːn/", definition: "To use a supply of knowledge, experience, or resources that is available to you.", zh: "凭借；利用；动用" },
  { key: "diet", pattern: "diet", label: "diet", pos: "n.", ipa: "/ˈdaɪət/", definition: "The things a person regularly takes in; here, the ideas and media a mind is exposed to.", zh: "（持续接触的）内容；精神食粮" },
  { key: "run_of_the_mill", pattern: "run-of-the-mill", label: "run-of-the-mill", pos: "adj.", ipa: "/ˌrʌn əv ðə ˈmɪl/", definition: "Ordinary and not especially interesting, special, or high in quality.", zh: "平凡的；普通的；乏味的" },
  { key: "resolve", pattern: "resolve", label: "resolve", pos: "v.", ipa: "/rɪˈzɑːlv/", definition: "To make a firm decision to do something.", zh: "决心；决定" },
  { key: "rekindle", pattern: "rekindl(?:e|es|ed|ing)", label: "rekindle", pos: "v.", ipa: "/ˌriːˈkɪndəl/", definition: "To make a feeling, interest, or relationship become active again.", zh: "重新唤起；使复苏" },
  { key: "register", pattern: "registers?", label: "register", pos: "n.", ipa: "/ˈredʒɪstər/", definition: "A particular range or level of feeling, thought, or expression.", zh: "（情感或思想的）层次；范围" }
];

export function VocabularyArticleBody({ paragraphs, terms, idPrefix, leadParagraph, sectionHeadings = [], paragraphClassNames = [] }: { paragraphs: readonly string[]; terms: readonly VocabularyNoteTerm[]; idPrefix: string; leadParagraph?: string; sectionHeadings?: readonly string[]; paragraphClassNames?: readonly (string | undefined)[] }) {
  const termsByKey = Object.fromEntries(terms.map((term) => [term.key, term])) as Record<string, VocabularyNoteTerm>;
  const termPattern = new RegExp(terms.map((term) => `(?<${term.key}>\\b(?:${term.pattern})\\b)`).join("|"), "gi");
  const seenTerms = new Set<string>();
  const [openNote, setOpenNote] = useState<{ id: string; term: VocabularyNoteTerm; left: number; top: number } | null>(null);

  function toggleNote(event: MouseEvent<HTMLButtonElement>, id: string, term: VocabularyNoteTerm) {
    if (openNote?.id === id) {
      setOpenNote(null);
      return;
    }
    const button = event.currentTarget;
    const body = button.closest(".inquire-publication-body");
    const paragraph = button.closest("p");
    if (!body || !paragraph) return;

    const bodyRect = body.getBoundingClientRect();
    const wordRect = button.getBoundingClientRect();
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let rightmostTextEdge = wordRect.right;
    let textNode: Node | null;
    while ((textNode = walker.nextNode())) {
      if (textNode.parentElement?.closest(".taylor-vocabulary-note")) continue;
      range.selectNodeContents(textNode);
      for (const rect of Array.from(range.getClientRects())) rightmostTextEdge = Math.max(rightmostTextEdge, rect.right);
    }
    setOpenNote({
      id,
      term,
      left: rightmostTextEdge - bodyRect.left + 18,
      top: wordRect.top - bodyRect.top - 2
    });
  }

  function renderParagraph(paragraph: string, paragraphIndex: number | string, className?: string) {
    if (sectionHeadings.includes(paragraph)) return <h2 className="inquire-publication-section-title" key={paragraphIndex}>{paragraph}</h2>;
    const matches = Array.from(paragraph.matchAll(termPattern));
    const nodes: ReactNode[] = [];
    let cursor = 0;
    for (const match of matches) {
      const surface = match[0];
      const start = match.index ?? 0;
      const key = Object.keys(match.groups ?? {}).find((group) => match.groups?.[group] !== undefined);
      const term = key ? termsByKey[key] : undefined;
      if (!term || start < cursor) continue;
      if (start > cursor) nodes.push(paragraph.slice(cursor, start));
      if (seenTerms.has(term.key)) {
        nodes.push(surface);
        cursor = start + surface.length;
        continue;
      }
      seenTerms.add(term.key);
      const id = `${idPrefix}-${paragraphIndex}-${start}`;
      nodes.push(<span className="taylor-vocabulary-anchor" key={id}>
        <button type="button" className="taylor-vocabulary-highlight" aria-label={`Show vocabulary note for ${term.label}`} aria-expanded={openNote?.id === id} aria-controls={openNote?.id === id ? id : undefined} onClick={(event) => toggleNote(event, id, term)}>{surface}</button>
      </span>);
      cursor = start + surface.length;
    }
    if (cursor < paragraph.length) nodes.push(paragraph.slice(cursor));
    return <p className={className} key={paragraphIndex}>{nodes.map((node, index) => typeof node === "string" ? <Fragment key={index}>{node}</Fragment> : node)}</p>;
  }

  return <div className="inquire-publication-body">{leadParagraph && renderParagraph(leadParagraph, "lead", "inquire-publication-dek")}{paragraphs.map((paragraph, paragraphIndex) => renderParagraph(paragraph, paragraphIndex, paragraphClassNames[paragraphIndex]))}{openNote && <span className="taylor-vocabulary-note" id={openNote.id} role="group" aria-label={`Vocabulary note for ${openNote.term.label}`} style={{ left: openNote.left, top: openNote.top, width: 286 }}>
    <span className="taylor-vocabulary-note-tape" aria-hidden="true" />
    <span className="taylor-vocabulary-note-heading"><strong>{openNote.term.label}</strong><span className="taylor-vocabulary-note-pos">{openNote.term.pos}</span>{openNote.term.ipa && <span>{openNote.term.ipa}</span>}</span>
    <button type="button" className="taylor-vocabulary-note-close" aria-label={`Close definition for ${openNote.term.label}`} onClick={() => setOpenNote(null)}>×</button>
    <span className="taylor-vocabulary-note-definition">{openNote.term.definition}</span>
    <span className="taylor-vocabulary-note-translation">{openNote.term.zh}</span>
  </span>}</div>;
}

export function BrooksVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><VocabularyArticleBody paragraphs={paragraphs} terms={brooksTerms} idPrefix="brooks-note" /><CommencementExercises /></>;
}
