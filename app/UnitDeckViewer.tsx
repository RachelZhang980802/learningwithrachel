"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import sources from "./unitDeckSources.json";
import glossary from "./unitDeckGlossary.json";
import glossaryById from "./unitDeckGlossaryById.json";
import { CharacterReference } from "./CharacterReference";
import { SettingReference } from "./SettingReference";
import "./unit-deck-source.css";
import "./unit-deck-viewer.css";
import "./unit-deck-layout.css";
import "./unit-deck-layout-unit12.css";
import "./unit-deck-layout-unit56.css";

type SourceText = { id: string; text: string; translation?: string; bbox?: number[]; x?: number; y?: number; width?: number; height?: number };
type SourceCitation = { textId: string; label: string; url?: string; status: "verbatim" | "excerpted" | "adapted" | "paraphrase" | "classroom" | "unverified"; note?: string };
type SourcePage = { page: number; width?: number; height?: number; art: string; html: string; texts: SourceText[]; citations?: SourceCitation[] };
type SourceDeck = { unit?: number; width: number; height: number; pages: SourcePage[] };
type SourceManifest = { version?: string; unit: number; title: string; source: string; sourceKind: string; pageCount: number; width: number; height: number; dataUrl: string; sourcePages: number[] };
const manifests = sources as Record<string, SourceManifest>;
const deckCache = new Map<number, SourceDeck>();
const versionedAsset = (url: string, version?: string) => version ? `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}` : url;
const unitWords = ["one", "two", "three", "four", "five", "six"];
const normalize = (text: string) => text.normalize("NFKC").toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
const compact = (text: string) => normalize(text).replace(/[^\p{L}\p{N}]/gu, "");
const contextTranslations = glossaryById as Record<string, { sourceEnglish: string; translation: string }>;
const translations = new Map(Object.entries(glossary).map(([en, zh]) => [compact(en), zh as string]));
const citationStatusLabels: Record<SourceCitation["status"], string> = {
  verbatim: "已核实原文",
  excerpted: "原文节录",
  adapted: "改写，非逐字原文",
  paraphrase: "概述，非原文",
  classroom: "课堂材料，非摘录",
  unverified: "出处待核实",
};
function translationFor(text: string) {
  const direct = translations.get(compact(text));
  if (direct) return direct;
  const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const translated = lines.map(line => translations.get(compact(line)));
  return translated.length && translated.every(Boolean) ? translated.join("\n") : null;
}

// Keep recovered prose inside its original printed panel. Flowing complete
// lines avoids the uneven glyph heights present in photographed text.
function reflowRecoveredGroups(html: string) {
  html = html.replace(/(<div[^>]*data-deck-text-id="u4-p5[012]-[^"]+"[^>]*>)([\s\S]*?)(<\/div>)/g, (_, open: string, body: string, close: string) => open + body.replace(/>(looked|seemed|felt)</g, '><u class="ud-source-underline">$1</u><') + close);
  const groups = [
    { page:13, kind:"img", first:14, last:22, left:55, top:7, width:41, size:1.6, breaks:[17] },
    { page:32, kind:"img", first:2, last:8, left:5.5, top:12, width:69, size:1.5, breaks:[2,5] },
    { page:34, kind:"img", first:1, last:8, left:43, top:16.5, width:46, size:2.1, breaks:[] },
    { page:39, kind:"ocr", first:0, last:11, left:3, top:2, width:72, size:1.95, breaks:[2,6] },
    { page:51, kind:"ocr", first:0, last:6, left:4, top:4.7, width:24, size:2.0, breaks:[] },
    { page:51, kind:"ocr", first:7, last:12, left:34, top:3.5, width:27, size:2.0, breaks:[] },
    { page:51, kind:"ocr", first:13, last:18, left:65, top:6.1, width:30, size:2.0, breaks:[] },
    { page:101, kind:"img", first:1, last:10, left:32.8, top:16.5, width:44, size:1.65, breaks:[2,3,4,5,6,7] },
    { page:104, kind:"img", first:0, last:20, left:18.5, top:18, width:67, size:2.05, breaks:[] },
    { page:105, kind:"img", first:1, last:9, left:18.5, top:18, width:63, size:1.95, breaks:[5] },
  ];
  for (const group of groups) {
    const pieces: string[] = [];
    for (let number = group.first; number <= group.last; number++) {
      const id = `u4-p${group.page}-${group.kind}${number}`;
      const pattern = new RegExp(`<div[^>]*data-deck-text-id="${id}"[^>]*>[\\s\\S]*?<\\/div>`);
      html = html.replace(pattern, block => {
        pieces.push(block + (group.breaks.includes(number) ? "<br/>" : " "));
        return "";
      });
    }
    if (pieces.length) html += `<div class="ud-reading-flow" style="left:${group.left}cqw;top:${group.top}cqw;width:${group.width}cqw;font-size:${group.size}cqw">${pieces.join("")}</div>`;
  }
  return html;
}

// PDF runs have no whitespace between separately positioned lines. Supply only
// real word boundaries when these two passages are reflowed into a text column.
function reflowMarkup(html: string) {
  const chineseIds = new Set([
    "u3-p6-b2", "u3-p10-b2", "u3-p12-b2", "u3-p15-b2", "u3-p16-b2", "u3-p18-b2", "u3-p20-b2",
    "u3-p31-b1", "u3-p32-b3", "u3-p33-b2", "u3-p37-b2",
    "u4-p21-b1", "u4-p30-b0", "u4-p31-b1", "u4-p32-b0", "u4-p33-b0", "u4-p34-b0", "u4-p44-b1", "u4-p47-b1", "u4-p48-b1",
  ]);
  const readableChinese = html.replace(/<div([^>]*data-deck-text-id="([^"]+)"[^>]*)>([\s\S]*?)<\/div>/g, (match, attrs: string, id: string, body: string) => {
    if (id === "u3-p32-b4") {
      return match.replace(/<span([^>]*)>([\s\S]*?)<\/span>/g, (run: string, style: string, text: string) => /[\u3400-\u9fff]/.test(text) ? `<span class="ud-mixed-chinese">${text}</span>` : run);
    }
    if (id === "u4-p25-b1") {
      const chinese: string[] = [];
      const english = body.replace(/<span([^>]*)>([\s\S]*?)<\/span>/g, (run: string, style: string, text: string) => {
        if (!/[\u3400-\u9fff]/.test(text)) return run;
        chinese.push(text.trim()); return "";
      });
      return `<div${attrs}>${english}<span class="ud-mixed-chinese">${chinese.join("")}</span></div>`;
    }
    if (!chineseIds.has(id)) return match;
    let content = Array.from(body.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)).map(run => run[1].trim()).join("");
    const highlights: Record<string, string[]> = {
      "u4-p31-b1": ["好像要下雨了。", "如果真下起雨来该怎么办？"],
      "u4-p32-b0": ["你在回家的路上死去。", "这是一次无痛的死亡。", "急救人员尽力抢救，但无济于事。"],
      "u4-p34-b0": ["先想知道我在哪里出生", "我糟糕的童年是什么样的"],
    };
    for (const phrase of highlights[id] ?? []) content = content.replace(phrase, `<mark class="ud-source-highlight">${phrase}</mark>`);
    return `<div${attrs.replace('class="ud-source-text', 'class="ud-cjk-flow ud-source-text')}><span>${content}</span></div>`;
  });
  return readableChinese.replace(/(<div[^>]*data-deck-text-id="u3-p(?:18|20)-b1"[^>]*>)([\s\S]*?)(<\/div>)/g, (_, open: string, body: string, close: string) => {
    const runs = Array.from(body.matchAll(/(<span[^>]*>)([\s\S]*?)<\/span>/g));
    const content = runs.map((run, index) => {
      const text = run[2].trim();
      const next = runs[index + 1]?.[2].trim() ?? "";
      const space = next && !/^[.,!?;:)\]”]/.test(next) && !/^(?:&#x27;|&apos;)/.test(next) ? " " : "";
      return `${run[1]}${text}</span>${space}`;
    }).join("");
    return open + content + close;
  });
}

// These source answer slides place their red answers over the printed
// questions. Keep the original paper artwork, but set each question and answer
// on its own row so every word remains legible at the page's native aspect ratio.
function readableWorksheet(page: SourcePage) {
  const isFirstIdentification = page.page === 178 && page.texts.some(text => text.id === "u5-p178-b0");
  const isIdentification = page.page === 179 && page.texts.some(text => text.id === "u5-p179-b0");
  const isRewrite = page.page === 180 && page.texts.some(text => text.id === "u5-p180-b0");
  if (!isFirstIdentification && !isIdentification && !isRewrite) return null;
  const prefix = isFirstIdentification ? "u5-p178" : isIdentification ? "u5-p179" : "u5-p180";
  const heading = isFirstIdentification
    ? '<div class="ud-worksheet-title">Activity 7: Finding out the Figurative Devices</div>'
    : page.html.match(new RegExp(`<div[^>]*data-deck-text-id="${prefix}-b0"[\\s\\S]*?<\\/div>`))?.[0] ?? "";
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const entry = (id: string, tone: "question" | "answer") => {
    const value = page.texts.find(text => text.id === id)?.text.replace(/\s+/g, " ").trim() ?? "";
    return `<div class="ud-worksheet-${tone}" data-deck-text-id="${id}" tabindex="0" role="button" aria-label="${escape(value)}"><span>${escape(value)}</span></div>`;
  };
  if (isFirstIdentification) {
    const inlineQuestion = (id: string) => {
      const value = page.texts.find(text => text.id === id)?.text.replace(/\s+/g, " ").trim() ?? "";
      return `<span class="ud-worksheet-question" data-deck-text-id="${id}" tabindex="0" role="button" aria-label="${escape(value)}">${escape(value)}</span>`;
    };
    const rows: [string[], string][] = [
      [["img2", "img3"], "Hyperbole"], [["img4"], "Metaphor"], [["img6"], "Hyperbole"],
      [["img7"], "Personification"], [["img8", "img9"], "Metaphor"], [["img11", "img12"], "Alliteration"],
      [["img14", "img15"], "Personification"], [["img17"], "Metaphor"],
    ];
    const body = rows.map(([questionIds, answer], index) => `<div class="ud-worksheet-row"><div class="ud-worksheet-question-group">${questionIds.map(id => inlineQuestion(`${prefix}-${id}`)).join(" ")}</div><div class="ud-worksheet-answer" data-deck-text-id="${prefix}-answer-${index + 1}" data-deck-value="${escape(answer)}" tabindex="0" role="button" aria-label="${escape(answer)}"><span>${escape(answer)}</span></div></div>`).join("");
    return `${heading}<div class="ud-worksheet-layout ud-worksheet-identification ud-worksheet-identification--first">${body}</div>`;
  }
  const rows = isIdentification
    ? [
        [["img2"], "b6"], [["img3", "img4"], "b2"], [["img6", "img7"], "b3"],
        [["img9"], "b7"], [["img11"], "b4"], [["img13", "img14"], "b1"], [["img16"], "b5"],
      ] as const
    : [
        [["img1"], "b1"], [["img4"], "b2"], [["img7"], "b3"],
        [["img10"], "b4"], [["img13", "img14"], "b5"],
      ] as const;
  const body = rows.map(([questionIds, answerId]) => `<div class="ud-worksheet-row"><div class="ud-worksheet-question-group">${questionIds.map(id => entry(`${prefix}-${id}`, "question")).join(" ")}</div>${entry(`${prefix}-${answerId}`, "answer")}</div>`).join("");
  return `${heading}<div class="ud-worksheet-layout ${isIdentification ? "ud-worksheet-identification" : "ud-worksheet-rewrite"}">${body}</div>`;
}

const hemingwayStarRules = [
  ["Use short sentences.", "使用简短的句子。"],
  ["Use short first paragraphs.", "开篇段落要简短。"],
  ["Use vigorous English.", "使用有力的英语。"],
  ["Avoid the use of adjectives.", "避免滥用形容词。"],
  ["Eliminate every superfluous word.", "删去每个多余的词。"],
] as const;

// This source slide contains a clipped screenshot of an article. Its five
// Star style-sheet rules are complete, but the surrounding prose is cut off.
// Replace the fragments with a short verified context sentence and full rules.
function readableHemingwayPage(page: SourcePage) {
  if (page.page !== 101 || !page.texts.some(text => text.id === "u4-p101-b0")) return null;
  const rules = hemingwayStarRules.map(([english, translation], index) => `<li data-deck-text-id="u4-p101-rule-${index}" data-deck-value="${english}" data-deck-label="${english}" data-deck-translation="${translation}" tabindex="0" role="button" aria-label="${english}">${english}</li>`).join("");
  return `<div class="ud-hemingway-panel"><p>At The Kansas City Star, Hemingway learned newsroom rules that shaped his spare prose.</p><ol>${rules}</ol><a href="https://www.themorgan.org/press/2015/ernest-hemingway-between-two-wars" target="_blank" rel="noopener noreferrer">Source: The Morgan Library &amp; Museum ↗</a></div>`;
}

// The embedded tense infographic on Unit 4 page 106 is cropped in the source
// PDF. Rebuild its intended 12-form comparison as selectable HTML, keeping the
// original past/present/future palette while restoring every clipped example.
function readableTensesPage(page: SourcePage) {
  if (page.page !== 106 || !page.texts.some(text => text.id === "u4-p106-b0")) return null;
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const columns = [
    { time: "Past", tone: "past", forms: [
      ["Simple", "I went to school.", "我去上学了。"],
      ["Continuous", "I was going to school.", "那时我正去学校。"],
      ["Perfect", "I had gone to school.", "那时我已经去学校了。"],
      ["Perfect continuous", "I had been going to school.", "到过去那个时候，我一直在上学。"],
    ] },
    { time: "Present", tone: "present", forms: [
      ["Simple", "I go to school.", "我上学。"],
      ["Continuous", "I am going to school.", "我现在正去学校。"],
      ["Perfect", "I have gone to school.", "我已经去学校了。"],
      ["Perfect continuous", "I have been going to school.", "我一直在上学。"],
    ] },
    { time: "Future", tone: "future", forms: [
      ["Simple", "I will go to school.", "我将去学校。"],
      ["Continuous", "I will be going to school.", "到那时我会正在去学校的路上。"],
      ["Perfect", "I will have gone to school.", "到那时我已经去学校了。"],
      ["Perfect continuous", "I will have been going to school.", "到那时，我已经持续上学一段时间了。"],
    ] },
  ];
  const cards = columns.map(column => `<section class="ud-tense-column ud-tense-${column.tone}"><h3>${column.time}</h3>${column.forms.map(([label, example, translation], index) => `<div class="ud-tense-card" data-deck-text-id="u4-p106-${column.tone}-${index}" data-deck-value="${escape(example)}" data-deck-label="${escape(`${column.time} ${label}: ${example}`)}" data-deck-translation="${escape(translation)}" tabindex="0" role="button" aria-label="${escape(`${column.time} ${label}: ${example}`)}"><b>${escape(label)}</b><span>${escape(example)}</span></div>`).join("")}</section>`).join("");
  return `<div class="ud-tense-timeline"><h2>English Tenses Timeline</h2><p>How time and aspect change the same action</p><div class="ud-tense-columns">${cards}</div><a href="https://englishlessonsbrighton.co.uk/all-english-tenses-timeline-infographic/" target="_blank" rel="noopener noreferrer">Adapted from English Lessons Brighton · View the original chart ↗</a></div>`;
}

// Keep source nodes stable while selection/recall changes, so keyboard focus and
// the recovered text's fitted width survive React updates.
const SourceHtml = memo(function SourceHtml({ page }: { page: SourcePage }) {
  return <div className="ud-source-html" dangerouslySetInnerHTML={{ __html: readableHemingwayPage(page) ?? readableTensesPage(page) ?? readableWorksheet(page) ?? reflowMarkup(reflowRecoveredGroups(page.html)) }} />;
});

export function UnitDeckViewer({ unit, onNavigate }: { unit: number; onNavigate: (hash: string) => void }) {
  const meta = manifests[String(unit)];
  const [deck, setDeck] = useState<SourceDeck | null>(deckCache.get(unit) ?? null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<SourceText | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [reference, setReference] = useState(false);
  const [recall, setRecall] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const meaningCard = useRef<HTMLElement>(null);
  const citationSection = useRef<HTMLElement>(null);
  const [meaningPlacement, setMeaningPlacement] = useState<{ textId: string; left: number; top: number; width: number; maxHeight: number } | null>(null);
  const page = deck?.pages[index];
  const meaning = useMemo(() => selected ? selected.translation ?? contextTranslations[selected.id]?.translation ?? translationFor(selected.text) : null, [selected]);

  useEffect(() => {
    const pageNode = stage.current;
    const card = meaningCard.current;
    if (!selected || !meaning || !pageNode || !card) {
      setMeaningPlacement(null);
      return;
    }

    const placeCard = () => {
      const pageRect = pageNode.getBoundingClientRect();
      const target = pageNode.querySelector<HTMLElement>(`[data-deck-text-id="${selected.id}"]`);
      if (!target || !pageRect.width || !pageRect.height) return;
      const targetRect = target.getBoundingClientRect();
      const margin = Math.max(6, pageRect.width * 0.01);
      const gap = Math.max(6, pageRect.width * 0.008);
      const maxWidth = Math.min(pageRect.width * 0.4, 340);
      const maxHeight = Math.max(82, pageRect.height * 0.38);
      const anchorLeft = targetRect.left - pageRect.left;
      const anchorRight = targetRect.right - pageRect.left;
      const anchorTop = targetRect.top - pageRect.top;
      const anchorBottom = targetRect.bottom - pageRect.top;
      const candidates = [
        { side: "after", left: anchorRight + gap, width: Math.min(maxWidth, pageRect.width - anchorRight - gap - margin), top: anchorTop },
        { side: "below", left: Math.min(Math.max(margin, anchorLeft), pageRect.width - maxWidth - margin), width: maxWidth, top: anchorBottom + gap },
        { side: "above", left: Math.min(Math.max(margin, anchorLeft), pageRect.width - maxWidth - margin), width: maxWidth, top: 0 },
        { side: "before", left: anchorLeft - gap - maxWidth, width: Math.min(maxWidth, anchorLeft - gap - margin), top: anchorTop },
      ].filter(item => item.width >= Math.min(100, pageRect.width * 0.18));
      const textRects = Array.from(pageNode.querySelectorAll<HTMLElement>("[data-deck-text-id]"))
        .filter(node => node !== target && node.getBoundingClientRect().width && node.getBoundingClientRect().height)
        .map(node => node.getBoundingClientRect());
      const ranked: Array<{ left: number; top: number; width: number; height: number; collisions: number; overlap: number; rank: number }> = [];

      card.style.visibility = "hidden";
      for (const [rank, candidate] of candidates.entries()) {
        card.style.width = `${candidate.width}px`;
        card.style.maxHeight = `${maxHeight}px`;
        card.style.left = `${candidate.left}px`;
        card.style.top = "0px";
        const height = card.getBoundingClientRect().height;
        const top = candidate.side === "below"
          ? candidate.top
          : candidate.side === "above"
            ? anchorTop - gap - height
            : Math.min(Math.max(margin, candidate.top), pageRect.height - height - margin);
        if (candidate.left < margin || top < margin || candidate.left + candidate.width > pageRect.width - margin || top + height > pageRect.height - margin) continue;
        const overlaps = textRects.map(rect => {
          const left = Math.max(pageRect.left + candidate.left, rect.left);
          const right = Math.min(pageRect.left + candidate.left + candidate.width, rect.right);
          const upper = Math.max(pageRect.top + top, rect.top);
          const lower = Math.min(pageRect.top + top + height, rect.bottom);
          return Math.max(0, right - left) * Math.max(0, lower - upper);
        }).filter(area => area > 4);
        ranked.push({ left: candidate.left, top, width: candidate.width, height, collisions: overlaps.length, overlap: overlaps.reduce((sum, area) => sum + area, 0), rank });
      }

      const best = ranked.sort((a, b) => a.collisions - b.collisions || a.overlap - b.overlap || a.rank - b.rank)[0];
      if (!best) {
        setMeaningPlacement(null);
        return;
      }
      setMeaningPlacement(current => current &&
        current.textId === selected.id &&
        Math.abs(current.left - best.left) < 1 &&
        Math.abs(current.top - best.top) < 1 &&
        Math.abs(current.width - best.width) < 1 &&
        Math.abs(current.maxHeight - maxHeight) < 1
        ? current
        : { textId: selected.id, left: best.left, top: best.top, width: best.width, maxHeight });
    };

    placeCard();
    const observer = new ResizeObserver(placeCard);
    observer.observe(pageNode);
    window.addEventListener("resize", placeCard);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placeCard);
    };
  }, [selected, meaning, page, zoom]);

  useEffect(() => {
    const controller = new AbortController();
    setIndex(0); setSelected(null); setReference(false); setRevealed([]); setError(false);
    const cached = deckCache.get(unit);
    setDeck(cached ?? null);
    if (!cached) fetch(versionedAsset(meta.dataUrl, meta.version), { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Lesson unavailable");
      return response.json() as Promise<SourceDeck>;
    }).then(data => {
      if (!data.pages?.length || data.pages.length !== meta.pageCount) throw new Error("Incomplete lesson");
      deckCache.set(unit, data);
      if (!controller.signal.aborted) setDeck(data);
    }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [unit, meta.dataUrl, meta.pageCount, meta.version, attempt]);

  useEffect(() => {
    const nodes = stage.current?.querySelectorAll<HTMLElement>("[data-deck-text-id]");
    nodes?.forEach(node => {
      const id = node.dataset.deckTextId ?? "";
      node.classList.toggle("ud-revealed", revealed.includes(id));
      node.classList.toggle("ud-selected", selected?.id === id);
      node.setAttribute("aria-expanded", String(selected?.id === id || revealed.includes(id)));
      node.setAttribute("aria-label", recall && !revealed.includes(id) ? "Reveal English" : page?.texts.find(text => text.id === id)?.text ?? node.dataset.deckLabel ?? node.dataset.deckValue ?? "Read text");
    });
  }, [page, selected, recall, revealed, reference]);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    let stopped = false;
    const fitRecoveredText = () => {
      node.querySelectorAll<HTMLElement>(".ud-source-ocr").forEach(box => {
        if (box.closest(".ud-reading-flow")) return;
        const spans = box.querySelectorAll<HTMLElement>("span");
        const text = spans[0];
        // Modern OCR words already carry source-positioned transforms. Only
        // fit the legacy single unstyled line; never stretch its first word.
        if (spans.length !== 1 || !text || text.matches(".ud-source-run, .ud-image-word")) return;
        text.style.transform = "none";
        const natural = text.scrollWidth;
        if (natural > 0) text.style.transform = `scaleX(${box.clientWidth / natural})`;
      });
    };
    const observer = new ResizeObserver(fitRecoveredText);
    observer.observe(node);
    document.fonts.ready.then(() => { if (!stopped) fitRecoveredText(); });
    fitRecoveredText();
    return () => { stopped = true; observer.disconnect(); };
  }, [page, reference]);

  const turnPage = (next: number) => {
    setIndex(Math.max(0, Math.min((deck?.pages.length ?? meta.pageCount) - 1, next)));
    setSelected(null); setRevealed([]);
  };
  const activateText = (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-deck-text-id]");
    if (!target || !stage.current?.contains(target)) return;
    const text = page?.texts.find(item => item.id === target.dataset.deckTextId)
      ?? (target.dataset.deckValue ? { id: target.dataset.deckTextId ?? "", text: target.dataset.deckValue, translation: target.dataset.deckTranslation } : null);
    if (!text) return;
    event.preventDefault();
    if (recall && !revealed.includes(text.id)) {
      setRevealed(current => [...current, text.id]);
      return;
    }
    setSelected(current => current?.id === text.id ? null : text);
  };
  const closeMeaning = () => {
    const id = selected?.id;
    setSelected(null);
    if (id) stage.current?.querySelector<HTMLElement>(`[data-deck-text-id="${id}"]`)?.focus({ preventScroll: true });
  };
  const onStageKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") activateText(event);
    else if (event.key === "Escape") closeMeaning();
  };

  return <section className="unit-deck-viewer" data-unit={unit} aria-label={`Unit ${unit}: ${meta.title}`}>
    <link rel="stylesheet" href={versionedAsset("/narrative-course/decks/fonts.css", meta.version)} />
    <nav className="ud-navigation" aria-label="Unit pages">
      <div className="ud-navigation-group">
        <a href="#units" onClick={event => { event.preventDefault(); onNavigate("#units"); }}>← Units</a>
        <label className="ud-unit-select"><span className="ud-sr-only">Choose a unit</span><select value={unit} onChange={event => onNavigate(`#unit-${unitWords[Number(event.target.value) - 1]}`)}>
          {Object.values(manifests).map(item => <option key={item.unit} value={item.unit}>Unit {item.unit} · {item.title}</option>)}
        </select></label>
        <a href="#reading" onClick={event => { event.preventDefault(); onNavigate("#reading"); }}>Readings</a>
        {(unit === 2 || unit === 3) && <button type="button" aria-pressed={reference} onClick={() => { setReference(current => !current); setSelected(null); }}>{unit === 2 ? "Characters" : "Settings"}</button>}
      </div>
      {!reference && <div className="ud-navigation-group ud-page-controls">
        <button type="button" aria-label="Previous page" disabled={index === 0 || !deck} onClick={() => turnPage(index - 1)}>←</button>
        <label><span className="ud-sr-only">Source page</span><select aria-label="Source page" value={index} onChange={event => turnPage(Number(event.target.value))}>
          {meta.sourcePages.map((number, position) => <option key={number} value={position}>Page {number} · {position + 1}/{meta.pageCount}</option>)}
        </select></label>
        <button type="button" aria-label="Next page" disabled={index === meta.pageCount - 1 || !deck} onClick={() => turnPage(index + 1)}>→</button>
        <button type="button" aria-pressed={recall} title="Hide text, then click each box to reveal its English" onClick={() => { setRecall(current => !current); setRevealed([]); setSelected(null); }}>Recall English</button>
        <label><span className="ud-sr-only">Page zoom</span><select aria-label="Page zoom" value={zoom} onChange={event => setZoom(Number(event.target.value))}><option value={1}>Fit page</option><option value={1.25}>125%</option><option value={1.5}>150%</option><option value={2}>200%</option><option value={3}>300%</option><option value={4}>400%</option></select></label>
        {page?.citations?.length ? <button type="button" onClick={() => citationSection.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>Sources · {page.citations.length}</button> : null}
      </div>}
    </nav>
    {reference ? <div className="ud-reference">{unit === 2 ? <CharacterReference /> : <SettingReference />}</div> : error ? <div className="ud-load-state" role="alert">This lesson could not be loaded. <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : !page ? <div className="ud-load-state" role="status">Loading Unit {unit}…</div> : <div className="ud-workspace">
      <div className="ud-page-scroll">
        <div className="ud-page-size" style={{ width: `${zoom * 100}%` }}>
          <div className={`ud-source-page${recall ? " ud-recall" : ""}`} ref={stage} data-deck-page={page.page} style={{ aspectRatio: `${page.width ?? deck?.width ?? meta.width} / ${page.height ?? deck?.height ?? meta.height}` }} onClick={activateText} onKeyDown={onStageKey} aria-label={`Original page ${page.page}`}>
            {page.art.endsWith(".svg") ? <object key={page.art} className="ud-source-art" type="image/svg+xml" data={versionedAsset(page.art, meta.version)} aria-hidden="true" tabIndex={-1} /> : <img key={page.art} className="ud-source-art" src={versionedAsset(page.art, meta.version)} alt="" draggable={false} />}
            <SourceHtml page={page} />
            {selected && meaning && <aside
              className="ud-inline-translation"
              ref={meaningCard}
              role="status"
              aria-label="中文译文"
              style={meaningPlacement?.textId === selected.id ? {
                left: meaningPlacement.left,
                top: meaningPlacement.top,
                width: meaningPlacement.width,
                maxHeight: meaningPlacement.maxHeight,
                visibility: "visible",
              } : { visibility: "hidden" }}
            >
              <button className="ud-inline-translation-close" type="button" aria-label="关闭译文" onClick={closeMeaning}>×</button>
              <p lang="zh-CN">{meaning}</p>
            </aside>}
          </div>
        </div>
      </div>
      {page.citations?.length ? <section className="ud-citations" ref={citationSection} aria-label="Excerpt sources">
        <h3>Page {page.page} · 摘录出处</h3>
        <ol>{page.citations.map((citation, position) => <li key={`${citation.textId}-${position}`}>
          <span className={`ud-citation-status ud-citation-status--${citation.status}`}>{citationStatusLabels[citation.status]}</span>
          {citation.url ? <a href={citation.url} target="_blank" rel="noopener noreferrer">{citation.label} ↗</a> : <span className="ud-citation-label">{citation.label}</span>}
          {citation.note ? <p>{citation.note}</p> : null}
        </li>)}</ol>
      </section> : null}
      {unit === 3 && (page.page === 33 || page.page === 37) && <section className="ud-readable-translation" aria-label="Readable Chinese translation">
        <h3>中文译文</h3>
        <p lang="zh-CN">{page.texts.find(item => item.id === `u3-p${page.page}-b2`)?.text}</p>
      </section>}
      {unit === 3 && page.page === 13 && <section className="ud-mobile-poem" aria-label="Readable poem text" lang="zh-CN">
        <p>{page.texts.find(item => item.id === "u3-p13-b1")?.text}</p>
      </section>}
      {unit === 3 && page.page === 6 && <section className="ud-mobile-novel" aria-label="Readable original novel excerpt">
        <p className="ud-mobile-novel-original">{page.texts.find(item => item.id === "u3-p6-b1")?.text}</p>
        <p lang="zh-CN">{page.texts.find(item => item.id === "u3-p6-b2")?.text}</p>
        <small lang="zh-CN">原著第一章。“巫师”指被指控行巫术的马修·莫尔；宅邸建于他死后的旧居地块。</small>
        <a href="https://www.gutenberg.org/cache/epub/77/pg77-images.html" target="_blank" rel="noopener noreferrer">Nathaniel Hawthorne, <i>The House of the Seven Gables</i>, Chapter I ↗</a>
      </section>}
      {unit === 3 && (page.page === 8 || page.page === 12) && <section className="ud-mobile-novel" aria-label="Readable literary excerpt">
        <p className="ud-mobile-novel-original">{page.texts.find(item => item.id === `u3-p${page.page}-b${page.page === 8 ? 2 : 1}`)?.text}</p>
        <p lang="zh-CN">{page.page === 8 ? translationFor(page.texts.find(item => item.id === "u3-p8-b2")?.text ?? "") : page.texts.find(item => item.id === "u3-p12-b2")?.text}</p>
        <a href={page.page === 8 ? "https://www.gutenberg.org/files/503/503-h/503-h.htm" : "https://www.gutenberg.org/files/6688/6688-h/6688-h.htm"} target="_blank" rel="noopener noreferrer">{page.page === 8 ? <>Andrew Lang (ed.), <i>The Blue Fairy Book</i>, after Madame de Villeneuve ↗</> : <>George Eliot, <i>The Mill on the Floss</i>, Book I, Chapter I ↗</>}</a>
      </section>}
      {unit === 4 && page.page === 101 && <section className="ud-mobile-hemingway" aria-label="Readable Hemingway writing advice">
        <p>At The Kansas City Star, Hemingway learned newsroom rules that shaped his spare prose.</p>
        <ol>{hemingwayStarRules.map(([english]) => <li key={english}>{english}</li>)}</ol>
        <a href="https://www.themorgan.org/press/2015/ernest-hemingway-between-two-wars" target="_blank" rel="noopener noreferrer">Source: The Morgan Library &amp; Museum ↗</a>
      </section>}
    </div>}
  </section>;
}
