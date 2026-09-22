"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HIGHLIGHTS_KEY = "close-reading-text-highlights-v1";

const highlightTones = [
  { id: "dusty-rose", label: "Dusty rose" },
  { id: "sage", label: "Sage" },
  { id: "slate-blue", label: "Slate blue" },
  { id: "mauve", label: "Mauve" },
  { id: "ochre", label: "Ochre" },
  { id: "terracotta", label: "Terracotta" },
  { id: "mist-teal", label: "Mist teal" },
  { id: "lavender-gray", label: "Lavender gray" },
] as const;

type HighlightTone = (typeof highlightTones)[number]["id"];

type HighlightRecord = {
  article: string;
  paragraph: number;
  start: number;
  end: number;
  tone: HighlightTone;
};

type HighlightCandidate = {
  paragraph: HTMLParagraphElement;
  range: Range;
  rect: DOMRect;
};

type PaletteState = {
  candidate: HighlightCandidate;
  left: number;
  top: number;
};

function isHighlightTone(value: unknown): value is HighlightTone {
  return typeof value === "string" && highlightTones.some((tone) => tone.id === value);
}

function readHighlights(): HighlightRecord[] {
  try {
    const value = window.localStorage.getItem(HIGHLIGHTS_KEY);
    const parsed = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is HighlightRecord => (
      item
      && typeof item.article === "string"
      && Number.isInteger(item.paragraph)
      && Number.isInteger(item.start)
      && Number.isInteger(item.end)
      && item.start >= 0
      && item.end > item.start
      && isHighlightTone(item.tone)
    ));
  } catch {
    return [];
  }
}

function writeHighlights(records: HighlightRecord[]) {
  try {
    window.localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(records));
  } catch {
    // Highlighting remains available if the browser does not allow local storage.
  }
}

function closestParagraph(node: Node | null) {
  const element = node instanceof Element ? node : node?.parentElement;
  return element?.closest<HTMLParagraphElement>(".reading-full-text-body > p") ?? null;
}

function articleKey(paragraph: HTMLParagraphElement) {
  return paragraph.closest<HTMLElement>(".reading-full-text")?.getAttribute("aria-labelledby") ?? "";
}

function paragraphIndex(paragraph: HTMLParagraphElement) {
  const body = paragraph.parentElement;
  if (!body) return -1;
  return Array.from(body.children).filter((child) => child.tagName === "P").indexOf(paragraph);
}

function textNodes(paragraph: HTMLParagraphElement) {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }
  return nodes;
}

function elementTextOffset(paragraph: HTMLParagraphElement, element: Element) {
  if (!paragraph.contains(element)) return -1;
  const range = document.createRange();
  range.selectNodeContents(paragraph);
  range.setEndBefore(element);
  return range.toString().length;
}

function rangeForOffsets(paragraph: HTMLParagraphElement, start: number, end: number) {
  let total = 0;
  let startNode: Text | null = null;
  let startOffset = 0;
  let endNode: Text | null = null;
  let endOffset = 0;

  for (const node of textNodes(paragraph)) {
    const next = total + node.data.length;
    if (!startNode && start >= total && start <= next) {
      startNode = node;
      startOffset = start - total;
    }
    if (!endNode && end >= total && end <= next) {
      endNode = node;
      endOffset = end - total;
    }
    total = next;
  }

  if (!startNode || !endNode || start === end) return null;
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range;
}

function containsRange(element: Element, range: Range) {
  const elementRange = document.createRange();
  elementRange.selectNodeContents(element);
  return range.compareBoundaryPoints(Range.START_TO_START, elementRange) >= 0
    && range.compareBoundaryPoints(Range.END_TO_END, elementRange) <= 0;
}

function unwrapHighlight(mark: HTMLElement) {
  const parent = mark.parentNode;
  if (!parent) return;
  while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
  mark.remove();
  parent.normalize();
}

function addHighlight(range: Range, tone: HighlightTone) {
  if (range.collapsed) return null;
  const mark = document.createElement("mark");
  mark.className = "reading-text-highlight";
  mark.dataset.highlightTone = tone;
  mark.title = "Click to remove highlight";
  try {
    range.surroundContents(mark);
  } catch {
    const fragment = range.extractContents();
    mark.append(fragment);
    range.insertNode(mark);
  }
  return mark;
}

function selectionCandidate(root: HTMLElement, range: Range): HighlightCandidate | null {
  if (range.collapsed || !root.contains(range.commonAncestorContainer)) return null;
  const startParagraph = closestParagraph(range.startContainer);
  const endParagraph = closestParagraph(range.endContainer);
  if (!startParagraph || startParagraph !== endParagraph || !root.contains(startParagraph)) return null;
  const rect = range.getBoundingClientRect();
  if (rect.width < 1 && rect.height < 1) return null;
  return { paragraph: startParagraph, range: range.cloneRange(), rect };
}

function wordCandidate(root: HTMLElement, paragraph: HTMLParagraphElement, x: number, y: number) {
  type CaretDocument = Document & {
    caretRangeFromPoint?: (left: number, top: number) => Range | null;
    caretPositionFromPoint?: (left: number, top: number) => { offsetNode: Node; offset: number } | null;
  };
  const caretDocument = document as CaretDocument;
  let caret = caretDocument.caretRangeFromPoint?.(x, y) ?? null;
  if (!caret) {
    const position = caretDocument.caretPositionFromPoint?.(x, y);
    if (!position) return null;
    caret = document.createRange();
    caret.setStart(position.offsetNode, position.offset);
    caret.collapse(true);
  }
  if (!(caret.startContainer instanceof Text) || !paragraph.contains(caret.startContainer)) return null;

  const text = caret.startContainer.data;
  const isWordCharacter = (character: string) => /[A-Za-z0-9À-ÖØ-öø-ÿ’'-]/.test(character);
  let offset = Math.min(caret.startOffset, text.length);
  if (!isWordCharacter(text[offset]) && offset > 0 && isWordCharacter(text[offset - 1])) offset -= 1;
  if (!isWordCharacter(text[offset])) return null;

  let start = offset;
  let end = offset;
  while (start > 0 && isWordCharacter(text[start - 1])) start -= 1;
  while (end < text.length && isWordCharacter(text[end])) end += 1;
  if (start === end) return null;

  const range = document.createRange();
  range.setStart(caret.startContainer, start);
  range.setEnd(caret.startContainer, end);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return selectionCandidate(root, range);
}

function highlightRecords(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("mark.reading-text-highlight")).flatMap((mark) => {
    const paragraph = closestParagraph(mark);
    if (!paragraph) return [];
    const article = articleKey(paragraph);
    const paragraphNumber = paragraphIndex(paragraph);
    const tone = mark.dataset.highlightTone;
    const start = elementTextOffset(paragraph, mark);
    const end = start + (mark.textContent?.length ?? 0);
    if (!article || paragraphNumber < 0 || start < 0 || end <= start || !isHighlightTone(tone)) return [];
    return [{ article, paragraph: paragraphNumber, start, end, tone }];
  });
}

function restoreHighlights(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("mark.reading-text-highlight").forEach(unwrapHighlight);
  const groups = new Map<string, HighlightRecord[]>();
  for (const record of readHighlights()) {
    const key = `${record.article}:${record.paragraph}`;
    const records = groups.get(key) ?? [];
    records.push(record);
    groups.set(key, records);
  }

  groups.forEach((records) => {
    const first = records[0];
    const article = root.querySelector<HTMLElement>(`.reading-full-text[aria-labelledby="${CSS.escape(first.article)}"]`);
    const body = article?.querySelector<HTMLElement>(".reading-full-text-body");
    const paragraphs = body ? Array.from(body.children).filter((child): child is HTMLParagraphElement => child.tagName === "P") : [];
    const paragraph = paragraphs[first.paragraph];
    if (!paragraph) return;
    records
      .sort((a, b) => b.start - a.start)
      .forEach((record) => {
        const range = rangeForOffsets(paragraph, record.start, record.end);
        if (range) addHighlight(range, record.tone);
      });
  });
}

export function NarrativeTextHighlighter({ root }: { root: HTMLElement }) {
  const [palette, setPalette] = useState<PaletteState | null>(null);
  const paletteRef = useRef<HTMLElement | null>(null);

  const dismissPalette = () => {
    setPalette(null);
    window.getSelection()?.removeAllRanges();
  };

  const openPalette = (candidate: HighlightCandidate) => {
    const edge = Math.min(148, Math.max(12, window.innerWidth / 2 - 12));
    const left = Math.min(Math.max(edge, candidate.rect.left + candidate.rect.width / 2), window.innerWidth - edge);
    const top = candidate.rect.top > 58 ? candidate.rect.top - 48 : Math.min(window.innerHeight - 52, candidate.rect.bottom + 12);
    setPalette({ candidate, left, top });
  };

  const persist = () => writeHighlights(highlightRecords(root));

  const applyTone = (tone: HighlightTone) => {
    if (!palette || !palette.candidate.paragraph.isConnected) return;
    const { paragraph, range } = palette.candidate;
    const overlaps = Array.from(paragraph.querySelectorAll<HTMLElement>("mark.reading-text-highlight"))
      .filter((mark) => range.intersectsNode(mark));
    const containingMark = overlaps.find((mark) => containsRange(mark, range));

    if (containingMark) {
      containingMark.dataset.highlightTone = tone;
    } else if (overlaps.length === 0) {
      addHighlight(range, tone);
    }
    persist();
    dismissPalette();
  };

  useEffect(() => {
    restoreHighlights(root);

    const persistHighlights = () => writeHighlights(highlightRecords(root));

    let selectionFrame = 0;
    const inspectSelection = () => {
      selectionFrame = 0;
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
      const candidate = selectionCandidate(root, selection.getRangeAt(0));
      if (candidate) openPalette(candidate);
    };
    const handlePointerUp = () => {
      window.cancelAnimationFrame(selectionFrame);
      selectionFrame = window.requestAnimationFrame(inspectSelection);
    };
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !root.contains(target)) return;

      const existing = target.closest<HTMLElement>("mark.reading-text-highlight");
      if (existing && root.contains(existing)) {
        unwrapHighlight(existing);
        persistHighlights();
        dismissPalette();
        return;
      }

      const paragraph = target.closest<HTMLParagraphElement>(".reading-full-text-body > p");
      const selection = window.getSelection();
      if (!paragraph) {
        dismissPalette();
        return;
      }
      if (!selection?.isCollapsed) return;
      const candidate = wordCandidate(root, paragraph, event.clientX, event.clientY);
      if (candidate) openPalette(candidate);
      else dismissPalette();
    };
    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (!target || root.contains(target) || paletteRef.current?.contains(target)) return;
      dismissPalette();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissPalette();
    };

    root.addEventListener("pointerup", handlePointerUp);
    root.addEventListener("click", handleClick);
    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", dismissPalette, true);
    window.addEventListener("resize", dismissPalette);
    return () => {
      window.cancelAnimationFrame(selectionFrame);
      root.removeEventListener("pointerup", handlePointerUp);
      root.removeEventListener("click", handleClick);
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", dismissPalette, true);
      window.removeEventListener("resize", dismissPalette);
    };
  }, [root]);

  if (!palette || typeof document === "undefined") return null;
  return createPortal(
    <section
      ref={paletteRef}
      className="reading-highlight-palette"
      data-editable-ui
      aria-label="Choose a highlight colour"
      style={{ left: palette.left, top: palette.top }}
    >
      <span className="reading-highlight-palette-label">Highlight</span>
      {highlightTones.map((tone) => (
        <button
          key={tone.id}
          className="reading-highlight-swatch"
          data-highlight-tone={tone.id}
          type="button"
          aria-label={`Highlight with ${tone.label}`}
          title={tone.label}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => applyTone(tone.id)}
        />
      ))}
    </section>,
    document.body,
  );
}
