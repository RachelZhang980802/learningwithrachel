import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const forms = {
  ...readJson('app/article02to05CuratedVocabulary.json'),
  ...readJson('app/article06CuratedVocabulary.json'),
  ...readJson('app/article07CuratedVocabulary.json'),
  ...readJson('app/article08CuratedVocabulary.json'),
  ...readJson('app/article09CuratedVocabulary.json'),
  ...readJson('app/article10CuratedVocabulary.json'),
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

function readArticle01Families() {
  const source = fs.readFileSync(path.join(root, 'app/article01WordFamilies.ts'), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  vm.runInThisContext(`(function(module,exports){${output}\n})`)(module, module.exports);
  return module.exports.article01WordFamilies;
}

const partNames = {
  n: 'n', noun: 'n', v: 'v', verb: 'v', adj: 'adj', adjective: 'adj',
  adv: 'adv', adverb: 'adv', prep: 'prep', preposition: 'prep', pron: 'pron', pronoun: 'pron',
  det: 'det', determiner: 'det', conj: 'conj', conjunction: 'conj', aux: 'aux', auxiliary: 'aux',
};
const partPattern = /\b(noun|verb|adjective|adverb|preposition|pronoun|determiner|conjunction|auxiliary)\b|\b(n|v|adj|adv|prep|pron|det|conj|aux)\./gi;
function partsOfSpeech(value) {
  return [...new Set([...value.matchAll(partPattern)].map(match => partNames[(match[1] || match[2]).toLowerCase()]))];
}
function parseBranch(value) {
  const position = value.search(/\s(?=(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|aux\.|phr\.|idiom\b|fixed expression\b))/i);
  if (position < 0) return { form: value.trim(), parts: [] };
  const clue = value.slice(position + 1);
  const prefix = clue.match(/^(?:(?:n|v|adj|adv|prep|pron|det|conj|aux)\.\s*\/?\s*)+/i)?.[0] ?? '';
  return { form: value.slice(0, position).trim(), parts: partsOfSpeech(prefix) };
}
function aliases(form) {
  return form.toLowerCase().split(/\s*\/\s*/);
}
function matches(form, target) {
  return aliases(form).includes(target.toLowerCase());
}

function auditFamily(label, rootWord, rootPartOfSpeech, entries, distinctions) {
  const branches = entries.map(parseBranch).filter(branch => branch.form.toLowerCase() !== rootWord.toLowerCase());
  const items = [...branches];
  if (/^[a-z][a-z-]*$/i.test(rootWord)) {
    for (const part of partsOfSpeech((rootPartOfSpeech ?? '').split(/[;(]/)[0])) items.push({ form: rootWord, parts: [part] });
  }
  let groupCount = 0;
  for (const part of new Set(items.flatMap(item => item.parts))) {
    const group = items.filter(item => item.parts.includes(part));
    if (new Set(group.map(item => item.form.toLowerCase())).size < 2) continue;
    groupCount++;
    for (const item of group) {
      const explanation = distinctions.find(distinction =>
        distinction.forms.some(form => matches(item.form, form)) &&
        group.some(other => other !== item && distinction.forms.some(form => matches(other.form, form)))
      );
      assert.ok(explanation, `${label}: ${item.form} needs an explicit distinction from another ${part}. form`);
      assert.ok(explanation.distinction.trim().length >= 16, `${label}: explain usage rather than repeat two glosses`);
    }
  }
  return groupCount;
}

test('every same-part-of-speech word family displays a substantive distinction, including the root when applicable', () => {
  let checked = 0;
  const article01Records = new Map(readJson('app/article01Vocabulary.json').records.map(record => [record.sourceRow, record]));
  for (const [row, family] of Object.entries(readArticle01Families())) {
    const record = article01Records.get(Number(row));
    const familyRoot = family.root ?? record.word;
    checked += auditFamily(`01/${row} ${record.word}`, familyRoot,
      familyRoot.toLowerCase() === record.word.toLowerCase() ? record.partOfSpeech : '',
      family.entries, family.distinctions ?? []);
  }
  for (const [articleId, cards] of Object.entries(forms)) {
    for (const [row, card] of Object.entries(cards)) {
      const familyRoot = card.wordFamilyRoot ?? card.word;
      // A label such as "noun (drowning)" describes the inflected word in the article,
      // while the listed root "drown" remains a verb.
      const rootPart = /^(?:noun|verb|adjective|adverb)\s+\([a-z-]+\)$/i.test(card.partOfSpeech ?? '')
        ? '' : card.partOfSpeech;
      checked += auditFamily(`${articleId}/${row} ${card.word}`, familyRoot,
        familyRoot.toLowerCase() === card.word.toLowerCase() ? rootPart : '',
        card.family ?? [], card.wordFamilyDistinctions ?? []);
    }
  }
  assert.ok(checked >= 250, `only ${checked} word-family groups were checked`);
});
