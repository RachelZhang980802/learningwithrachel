"use client";

import { useLayoutEffect, type RefObject } from "react";

type SourceRun = { node: Text; start: number; end: number };
function sourceRuns(copy: HTMLElement) {
  const runs: SourceRun[] = [];
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
  let text = "", node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest(".syntax-label, .syntax-parenthesis")) continue;
    runs.push({ node: node as Text, start: text.length, end: text.length + (node.textContent?.length ?? 0) });
    text += node.textContent;
  }
  return { runs, text };
}

// Text ranges include inline vocabulary and predicate fragments without wrapping
// them in atomic boxes or changing the original word spacing / click targets.
function anchorRect(runs: SourceRun[], start: number, end: number) {
  const rects: DOMRect[] = [];
  for (const run of runs) {
    const from = Math.max(start, run.start), to = Math.min(end, run.end);
    if (from >= to) continue;
    const range = document.createRange();
    range.setStart(run.node, from - run.start);
    range.setEnd(run.node, to - run.start);
    rects.push(...[...range.getClientRects()].filter(r => r.width > 0 && r.height > 0));
  }
  const first = rects[0];
  if (!first) return null;
  // A multiword connector may wrap. Attach to its first visible line.
  const line = rects.filter(r => Math.abs(r.top - first.top) < 3);
  return { left: Math.min(...line.map(r => r.left)), right: Math.max(...line.map(r => r.right)), top: Math.min(...line.map(r => r.top)), height: Math.max(...line.map(r => r.height)) };
}
function setStyle(element: HTMLElement, name: string, value: string) {
  const rounded = value.replace(/(-?\d+(?:\.\d+)?)px$/, (_, n: string) => `${Math.round(Number(n) * 100) / 100}px`);
  if (element.style.getPropertyValue(name) !== rounded) element.style.setProperty(name, rounded);
}

export function useSyntaxLabelLayout(rootRef: RefObject<HTMLDivElement | null>, articleId: string, expanded: ReadonlySet<number>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0, disposed = false;
    const inkContext = document.createElement("canvas").getContext("2d");
    function measure() {
      if (disposed || !root) return;
      for (const copy of root.querySelectorAll<HTMLElement>(".syntax-copy")) {
        const { runs, text } = sourceRuns(copy);
        const css = getComputedStyle(copy), width = parseFloat(css.width), font = parseFloat(css.fontSize);
        if (!width || !copy.getBoundingClientRect().width) continue;
        let box = copy.getBoundingClientRect();
        const scale = box.width / width;
        const entries = [...copy.querySelectorAll<HTMLElement>(".syntax-clause")].flatMap(clause => {
          const tag = clause.querySelector<HTMLElement>(".syntax-label")!;
          const start = Number(clause.dataset.anchorStart), end = Number(clause.dataset.anchorEnd);
          const anchor = anchorRect(runs, start, end);
          if (!anchor || text.slice(start, end) !== clause.dataset.anchorText) {
            tag.removeAttribute("data-positioned");
            return [];
          }
          const rect = tag.getBoundingClientRect(), w = rect.width / scale, h = rect.height / scale;
          const center = ((anchor.left + anchor.right) / 2 - box.left) / scale;
          return [{ tag, start, end, anchor, w, h, left: Math.max(0, Math.min(width - w, center - w / 2)), rise: 0 }];
        });
        // Lanes are derived only from horizontal overlap on the same text line.
        // Vertical padding does not affect lane selection, avoiding resize loops.
        const rows: { top: number; lanes: { right: number; height: number }[] }[] = [];
        let stackHeight = 0, glyphHeight = font * 1.2;
        for (const entry of entries) {
          let row = rows.find(r => Math.abs(r.top - entry.anchor.top) < font * scale * .45);
          if (!row) { row = { top: entry.anchor.top, lanes: [] }; rows.push(row); }
          let lane = row.lanes.findIndex(l => entry.left >= l.right + 4);
          if (lane < 0) lane = row.lanes.length;
          entry.rise = row.lanes.slice(0, lane).reduce((n, l) => n + l.height + 3, 0);
          row.lanes[lane] = { right: entry.left + entry.w, height: Math.max(row.lanes[lane]?.height ?? 0, entry.h) };
          stackHeight = Math.max(stackHeight, entry.rise + entry.h + 4);
          // A drop cap must not expand every ordinary line in the paragraph.
          if (entry.anchor.height / scale < font * 1.7) glyphHeight = Math.max(glyphHeight, entry.anchor.height / scale);
        }
        setStyle(copy, "--syntax-label-extra", `${Math.max(0, stackHeight + 4 - (2.1 * font - glyphHeight))}px`);
        setStyle(copy, "--syntax-label-top-space", `${stackHeight}px`);
        box = copy.getBoundingClientRect();
        for (const entry of entries) {
          const anchor = anchorRect(runs, entry.start, entry.end)!;
          const center = ((anchor.left + anchor.right) / 2 - box.left) / scale;
          const left = Math.max(0, Math.min(width - entry.w, center - entry.w / 2));
          const top = (anchor.top - box.top) / scale - entry.h - 4 - entry.rise;
          setStyle(entry.tag, "left", `${left}px`);
          setStyle(entry.tag, "top", `${top}px`);
          setStyle(entry.tag, "--syntax-pointer-left", `${center - left - 1}px`);
          // Futura has extra space above its visible letters. Extend the leader
          // through that font space so it visibly meets the intended word.
          let inkInset = 0;
          if (inkContext) {
            const style = getComputedStyle(entry.tag.parentElement!);
            inkContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const metrics = inkContext.measureText(text.slice(entry.start, entry.end));
            if (Number.isFinite(metrics.fontBoundingBoxAscent)) inkInset = Math.max(0, metrics.fontBoundingBoxAscent - metrics.actualBoundingBoxAscent);
          }
          setStyle(entry.tag, "--syntax-pointer-height", `${entry.rise + 2 + inkInset}px`);
          entry.tag.dataset.positioned = "true";
        }
      }
    }
    const schedule = () => { if (!disposed) { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); } };
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    root.querySelectorAll(".syntax-copy").forEach(copy => resize.observe(copy));
    // Theme/font/zoom changes can move words without changing the outer height.
    const attributes = new MutationObserver(schedule);
    for (let ancestor: HTMLElement | null = root; ancestor; ancestor = ancestor.parentElement) {
      attributes.observe(ancestor, { attributes: true, attributeFilter: ["class", "style"] });
    }
    const textChanges = new MutationObserver(records => {
      if (records.some(record => record.type !== "attributes" || !(record.target instanceof Element) || !record.target.matches(".syntax-label"))) schedule();
    });
    textChanges.observe(root, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    measure();
    return () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect(); attributes.disconnect(); textChanges.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [rootRef, articleId, expanded]);
}
