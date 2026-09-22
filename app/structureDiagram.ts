type Pair = readonly [string, string];
export type StructureNode = {
  id: string; kind: "clause" | "unit"; label: string; start: number; end: number;
  text: string; children: StructureNode[]; excerpt?: string;
};

function isClauseLabel(label: string) {
  return /(?:MAIN CLAUSE|CLAUSE|PARENTHETICAL COMPARISON|DIRECT-SPEECH IMPERATIVE|FUSED RELATIVE SUBJECT|主句|从句|引语|问句|祈使|感叹内容|判断\d|外层评价)/i.test(label)
    && !/(?:从句主语|从句谓语|从句宾语|从句表语|从句引导词|主句主语|主句谓语|主句宾语|主句表语|主句系动词)/.test(label);
}

function sourceFragments(excerpt: string) {
  return excerpt
    .replace(/（后省略[^）]*）|\(后省略[^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/(?:修饰|隐含主语|为讽刺插语|可补)\s*.*$/g, "")
    .replace(/\s*=\s*.*$/g, "")
    .split(/…|\.{3}|\s*\/\s*|，/)
    .map(text => text.replace(/[（(][^）)]*[）)]/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(text => text.length > 1);
}

// Clause ranges belong to the sentence, independently of rendered line breaks.
export function structureDiagram(parts: readonly Pair[], clauses: readonly Pair[]) {
  const sentence = parts.map(([, text]) => text).join("");
  const offsets: number[] = [];
  let normalized = "";
  for (let i = 0; i < sentence.length; i++) {
    if (/[a-z0-9]/i.test(sentence[i])) { normalized += sentence[i].toLowerCase(); offsets.push(i); }
  }
  const ranges: StructureNode[] = [];
  const repeated = new Map<string, number>();
  clauses.forEach(([label, excerpt], index) => {
    if (!isClauseLabel(label)) return;
    if (/INFINITIVE|PARTICIPIAL|NON-FINITE/.test(label)) return;
    const fragments = sourceFragments(excerpt);
    let cursor = repeated.get(excerpt) ?? 0;
    let start = -1;
    for (const fragment of fragments) {
      const found = normalized.indexOf(fragment, cursor);
      if (found < 0) return;
      if (start < 0) start = found;
      cursor = found + fragment.length;
    }
    if (start < 0) return;
    repeated.set(excerpt, cursor);
    let from = offsets[start];
    let end = offsets[cursor - 1] + 1;
    if (/MAIN CLAUSE/.test(label)) {
      const connector = sentence.slice(from).match(/^(?:and|but|or|yet|so)\s+/i);
      if (connector) from += connector[0].length;
    }
    while (end < sentence.length && /[\s,;:.!?—]/.test(sentence[end])) end++;
    ranges.push({ id: `clause-${index}`, kind: "clause", label, start: from, end, text: sentence.slice(from, end), children: [], excerpt });
  });
  // Some source rows preserve contractions, compression, or an ellipsis while the
  // teaching note expands them. Keep those sentences in the shared layout rather
  // than dropping their clause frame when an exact span cannot be recovered.
  if (!ranges.length && clauses.length) {
    const index = clauses.findIndex(([label]) => isClauseLabel(label));
    const [label, excerpt] = clauses[index >= 0 ? index : 0];
    ranges.push({ id: `clause-fallback-${index >= 0 ? index : 0}`, kind: "clause", label, start: 0, end: sentence.length, text: sentence, children: [], excerpt });
  }
  const mains = ranges.filter(range => /MAIN CLAUSE|主句/.test(range.label)).sort((a,b) => a.start-b.start);
  mains.forEach((range,index) => {
    let end = mains[index+1]?.start ?? sentence.length;
    const tail = sentence.slice(range.start,end).match(/\b(?:and|but|or|yet|so)\s+$/i);
    if (tail) end -= tail[0].length;
    range.end = Math.max(range.end,end);
  });
  ranges.sort((a,b) => a.start-b.start || b.end-a.end);
  const roots: StructureNode[] = [];
  const stack: StructureNode[] = [];
  for (const range of ranges) {
    while (stack.length && !(range.start >= stack.at(-1)!.start && range.end <= stack.at(-1)!.end)) stack.pop();
    const parent = stack.at(-1);
    (parent?.children ?? roots).push(range);
    stack.push(range);
  }
  let offset = 0;
  const units = parts.map(([label,text],index): StructureNode => {
    const unit = { id:`unit-${index}`, kind:"unit" as const, label, text, start:offset, end:offset+text.length, children:[] };
    offset += text.length;
    return unit;
  });
  function fill(start:number,end:number,children:StructureNode[]):StructureNode[] {
    const result:StructureNode[] = [];
    let cursor = start;
    function addUnits(from:number,to:number) {
      for (const unit of units) {
        const a = Math.max(from,unit.start), b = Math.min(to,unit.end);
        if (a < b) result.push({...unit,id:`${unit.id}-${a}`,start:a,end:b,text:sentence.slice(a,b)});
      }
    }
    for (const child of children) {
      addUnits(cursor,child.start);
      result.push({...child,children:fill(child.start,child.end,child.children)});
      cursor = child.end;
    }
    addUnits(cursor,end);
    return result;
  }
  return fill(0,sentence.length,roots);
}
