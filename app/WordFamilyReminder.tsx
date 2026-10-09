type FamilyWord = { word: string; parts: string[]; gloss: string };
type FamilyContrast = { left: FamilyWord; right: FamilyWord };

function parseFamilyWord(value: string): FamilyWord | null {
  const wordMatch = value.match(/^[A-Za-z][A-Za-z'-]*/);
  if (!wordMatch) return null;
  const word = wordMatch[0];
  const chineseStart = value.search(/[\u3400-\u9fff]/);
  const head = value.slice(word.length, chineseStart >= 0 ? chineseStart : value.length);
  const parts = [...head.matchAll(/\b(?:n|v|adj|adv|prep|pron|det|conj|aux)(?:\.)?(?=\s|\/|$)/gi)].map(match => match[0].replace(/\.$/, "").toLowerCase());
  const gloss = chineseStart >= 0 ? value.slice(chineseStart).trim() : "";
  return parts.length ? { word, parts: [...new Set(parts)], gloss } : null;
}

function commonPrefixLength(left: string, right: string) {
  let index = 0;
  while (index < left.length && index < right.length && left[index] === right[index]) index += 1;
  return index;
}

function relatedRoot(left: string, right: string) {
  const a = left.toLowerCase().replace(/[-']/g, "");
  const b = right.toLowerCase().replace(/[-']/g, "");
  return commonPrefixLength(a, b) >= 4;
}

function pluralForms(word: string) {
  const value = word.toLowerCase().replace(/[-']/g, "");
  const irregularPlurals: Record<string, string[]> = {
    thesis: ["theses"],
    analysis: ["analyses"],
    crisis: ["crises"],
    diagnosis: ["diagnoses"],
    criterion: ["criteria"],
    phenomenon: ["phenomena"],
  };
  if (irregularPlurals[value]) return irregularPlurals[value];
  const forms = [`${value}s`];
  if (value.endsWith("y") && !/[aeiou]y$/.test(value)) forms.push(`${value.slice(0, -1)}ies`);
  if (/(s|x|z|ch|sh)$/.test(value)) forms.push(`${value}es`);
  return forms;
}

function tenseBase(word: string) {
  const value = word.toLowerCase().replace(/[-']/g, "");
  if (value.endsWith("ied") && value.length > 4) return `${value.slice(0, -3)}y`;
  if (value.endsWith("ing") && value.length > 5) {
    const stem = value.slice(0, -3);
    return stem.length > 3 && stem.endsWith(stem[stem.length - 2]) ? stem.slice(0, -1) : stem;
  }
  if (value.endsWith("ed") && value.length > 4) return value.slice(0, -2);
  return value;
}

function isOnlyInflection(left: FamilyWord, right: FamilyWord) {
  const samePartOfSpeech = left.parts.every(part => right.parts.includes(part)) && right.parts.every(part => left.parts.includes(part));
  if (!samePartOfSpeech) return false;
  const leftWord = left.word.toLowerCase().replace(/[-']/g, "");
  const rightWord = right.word.toLowerCase().replace(/[-']/g, "");
  const pluralPair = pluralForms(leftWord).includes(rightWord) || pluralForms(rightWord).includes(leftWord);
  const tensePair = tenseBase(leftWord) === tenseBase(rightWord) && leftWord !== rightWord;
  return pluralPair || tensePair;
}

function contrastKey(left: FamilyWord, right: FamilyWord) {
  return [left.word.toLowerCase(), right.word.toLowerCase()].sort().join("|");
}

function findContrast(values: string[]) {
  const words = values.map(parseFamilyWord).filter((word): word is FamilyWord => Boolean(word));
  const contrast: FamilyContrast[] = [];
  words.forEach((word, index) => words.slice(index + 1).forEach(other => {
    const samePartOfSpeech = word.parts.some(part => other.parts.includes(part));
    if (word.word.toLowerCase() === other.word.toLowerCase()) return;
    if (relatedRoot(word.word, other.word) && samePartOfSpeech && !isOnlyInflection(word, other)
      && !contrast.some(pair => contrastKey(pair.left, pair.right) === contrastKey(word, other))) {
      contrast.push({ left: word, right: other });
    }
  }));
  return contrast;
}

function explainContrast({ left, right }: FamilyContrast) {
  const key = contrastKey(left, right);
  const focused: Record<string, string> = {
    "method|methodology": "method 指具体做法或办法；methodology 指系统的方法论或研究方法体系。",
    "methodical|methodological": "methodical 指做事有条理、按步骤；methodological 指与方法论或研究方法有关。",
    "proportional|proportionate": "proportional 强调数量或部分按比例变化；proportionate 强调程度与对象相称、恰当。",
    "historic|historical": "historic 强调事件本身具有重要历史意义；historical 只表示与历史有关，不一定具有重大意义。",
  };
  if (focused[key]) return focused[key];
  const leftGloss = left.gloss || "词义见该词条";
  const rightGloss = right.gloss || "词义见该词条";
  return `${left.word} 表示“${leftGloss}”；${right.word} 表示“${rightGloss}”。重点区别在词义和固定搭配，不是只看词根相似。`;
}

export function WordFamilyReminder({ values }: { values: string[] }) {
  const contrast = findContrast(values);
  if (!contrast.length) return null;
  const hasProportionPair = contrast.some(({ left, right }) => /^(proportional|proportionate)$/i.test(left.word) && /^(proportional|proportionate)$/i.test(right.word));
  const contrastWords = contrast.flatMap(({ left, right }) => [left, right]).filter((word, index, words) => words.findIndex(item => item.word.toLowerCase() === word.word.toLowerCase()) === index).slice(0, 8);
  return <details className="word-family-reminder">
    <summary>Reminder · 词族辨析</summary>
    <div className="word-family-reminder-body" aria-label="词族辨析提醒">
      {hasProportionPair
        ? <>
          <p><b>proportional</b> = “按比例的”：强调<strong>数量或部分之间的比例关系</strong>，回答“是不是按同一比例变化”。常见搭配：<i>be proportional to</i>。</p>
          <p><b>proportionate</b> = “相称的、恰当的”：强调<strong>程度是否与对象相匹配</strong>，回答“这样做是否合适、是否过重或过轻”。常见搭配：<i>be proportionate to</i>。</p>
          <p className="word-family-reminder-rule">一眼区分：讲<strong>数值比例</strong>用 <b>proportional</b>；讲<strong>分寸是否相称</strong>用 <b>proportionate</b>。</p>
        </>
        : <>
          <p>本组有<strong>同词根、同词性、形近易混淆</strong>的词形：{contrastWords.map((word, index) => <span key={word.word}>{index > 0 && " / "}<b>{word.word}</b>（{word.parts.join(" / ")}）</span>)}</p>
          <ul className="word-family-reminder-explanations">{contrast.slice(0, 8).map(pair => <li key={contrastKey(pair.left, pair.right)}><b>{pair.left.word} / {pair.right.word}</b>：{explainContrast(pair)}</li>)}</ul>
          <p className="word-family-reminder-rule">先看细微词义差别，再看固定搭配；同词性不等于可以互换。</p>
        </>}
    </div>
  </details>;
}
