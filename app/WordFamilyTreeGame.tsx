"use client";

import { useState, type CSSProperties } from "react";

function splitEntry(value: string) {
  const position = value.search(/\s(?=(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|aux\.|phr\.|idiom\b|fixed expression\b))/i);
  if (position < 0) return { form: value.trim(), clue: "" };
  return { form: value.slice(0, position).trim(), clue: value.slice(position + 1).trim() };
}

export function WordFamilyTreeGame({ root, entries, note }: { root: string; entries: string[]; note?: string }) {
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());
  const toggle = (index: number) => setRevealed(current => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    return next;
  });
  const hasNoFamilyNote = entries.some(entry => /^\s*无须扩展词族/.test(entry));
  const branches = entries
    .filter(entry => !/^\s*无须扩展词族/.test(entry))
    .map(splitEntry)
    .filter(item => item.form && item.form.toLocaleLowerCase() !== root.trim().toLocaleLowerCase());
  const columns = Math.min(branches.length, 4);
  const branchCenters = Array.from({ length: columns }, (_, index) => (index + 0.5) * 100 / columns);
  return <section className="word-family-tree-game" aria-label={`Word family for ${root}`}>
    <header className="word-family-tree-heading"><div><h3>Word Family</h3><p>Complete the branches, then tap each blank to check it.</p></div><span>{branches.length} {branches.length === 1 ? "FORM" : "FORMS"}</span></header>
    <div className="word-family-tree">
      <div className="word-family-tree-root"><small>ROOT</small><strong>{root}</strong></div>
      {branches.length > 0 && <>
        <svg className="word-family-tree-lines" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
          <path d={`M50 0 V12 M${branchCenters[0]} 12 H${branchCenters[branchCenters.length - 1]} ${branchCenters.map(center => `M${center} 12 V30`).join(" ")}`} />
        </svg>
        <div className="word-family-tree-branches" style={{ "--family-column-count": columns, "--family-mobile-column-count": Math.min(branches.length, 2) } as CSSProperties}>
          {branches.map((item, index) => {
            const isRevealed = revealed.has(index);
            return <button type="button" className={`word-family-tree-node${isRevealed ? " is-revealed" : ""}`} key={`${item.form}-${index}`} aria-expanded={isRevealed} onClick={() => toggle(index)}>
              <strong>{isRevealed ? item.form : "＿＿＿＿＿＿"}</strong>
              {item.clue && <small>{item.clue}</small>}
            </button>;
          })}
        </div>
      </>}
      {(note || branches.length === 0 || hasNoFamilyNote) && <p className="word-family-tree-note">{note ?? "No common family forms are needed for this entry; focus on the word or fixed expression in context."}</p>}
    </div>
  </section>;
}
