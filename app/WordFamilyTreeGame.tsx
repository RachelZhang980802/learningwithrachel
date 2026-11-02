"use client";

import { useState, type CSSProperties } from "react";

type FamilyDistinction = { forms: string[]; distinction: string };

function splitEntry(value: string) {
  const position = value.search(/\s(?=(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|aux\.|phr\.|idiom\b|fixed expression\b))/i);
  if (position < 0) return { form: value.trim(), clue: "" };
  const clue = value.slice(position + 1).trim();
  return {
    form: value.slice(0, position).trim(),
    clue,
  };
}

export function WordFamilyTreeGame({ root, entries, distinctions = [] }: { root: string; entries: string[]; distinctions?: FamilyDistinction[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());
  const [activeDistinction, setActiveDistinction] = useState<number | null>(null);
  const toggle = (index: number) => setRevealed(current => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    return next;
  });
  const branches = entries
    .filter(entry => !/^\s*无须扩展词族/.test(entry))
    .map(splitEntry)
    .filter(item => item.form && item.form.toLocaleLowerCase() !== root.trim().toLocaleLowerCase());
  const customGroups = distinctions.flatMap(item => {
    const positions = item.forms.map(form => {
      if (form.toLowerCase() === root.trim().toLowerCase()) return -1;
      const index = branches.findIndex(branch => branch.form.split(/\s*\/\s*/).some(option => option.toLowerCase() === form.toLowerCase()));
      return index >= 0 ? index : -2;
    });
    return positions.every(position => position >= -1) && new Set(positions).size > 1
      ? [{ ...item, indices: positions.filter(position => position >= 0) }]
      : [];
  });
  const selectedCustomGroups = customGroups.filter(group => group.indices.includes(activeDistinction ?? -2));
  if (branches.length === 0) return null;
  const columns = Math.min(branches.length, 4);
  const branchCenters = Array.from({ length: columns }, (_, index) => (index + 0.5) * 100 / columns);
  return <section className="word-family-tree-game" aria-label={`Word family for ${root}`}>
    <header className="word-family-tree-heading"><div><h3>Word Family</h3></div><span>{branches.length} {branches.length === 1 ? "FORM" : "FORMS"}</span></header>
    <div className="word-family-tree">
      <div className="word-family-tree-root"><small>ROOT</small><strong>{root}</strong></div>
      {branches.length > 0 && <>
        <svg className="word-family-tree-lines" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
          <path d={`M50 0 V12 M${branchCenters[0]} 12 H${branchCenters[branchCenters.length - 1]} ${branchCenters.map(center => `M${center} 12 V30`).join(" ")}`} />
        </svg>
        <div className="word-family-tree-branches" style={{ "--family-column-count": columns, "--family-mobile-column-count": Math.min(branches.length, 2) } as CSSProperties}>
          {branches.map((item, index) => {
            const isRevealed = revealed.has(index);
            const hasDistinction = customGroups.some(group => group.indices.includes(index));
            return <div className="word-family-tree-branch" key={`${item.form}-${index}`}>
              <button type="button" className={`word-family-tree-node${isRevealed ? " is-revealed" : ""}`} aria-expanded={isRevealed} onClick={() => toggle(index)}>
                <strong>{isRevealed ? item.form : "＿＿＿＿＿＿"}</strong>
                {item.clue && <small>{item.clue}</small>}
              </button>
              {hasDistinction && <button type="button" className="word-family-distinction-flag" aria-label={`查看 ${item.form} 与相关词形的区别`} aria-expanded={activeDistinction === index} onClick={() => setActiveDistinction(current => current === index ? null : index)} title="查看词形用法的区别"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2v16M6 3h10l-2.5 3L16 9H6Z"/></svg></button>}
            </div>;
          })}
        </div>
        {selectedCustomGroups.length > 0 && <aside className="word-family-distinction" aria-live="polite">
          <strong>词形用法辨析</strong>
          {selectedCustomGroups.map((group, index) => <p key={`${group.forms.join("-")}-${index}`}>{group.distinction}</p>)}
        </aside>}
      </>}
    </div>
  </section>;
}
