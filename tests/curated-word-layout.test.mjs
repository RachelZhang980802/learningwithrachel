import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';

const root = path.resolve(import.meta.dirname, '..');
const curated = {
  ...JSON.parse(fs.readFileSync(path.join(root, 'app/article02to05CuratedVocabulary.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'app/article06CuratedVocabulary.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'app/article07CuratedVocabulary.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'app/article08CuratedVocabulary.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'app/article09CuratedVocabulary.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'app/article10CuratedVocabulary.json'), 'utf8')),
};
const req = createRequire(import.meta.url);
const cache = new Map();
let states = [];
let cursor = 0;
const hooks = {
  ...React,
  useState(initial) {
    const index = cursor++;
    if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
    return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
  },
};
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  } }).outputText;
  const localRequire = name => {
    if (name === 'react') return hooks;
    if (name.endsWith('.css')) return {};
    if (!name.startsWith('.')) return req(name);
    const resolved = path.resolve(path.dirname(file), name);
    if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    const target = ['', '.tsx', '.ts'].map(suffix => resolved + suffix).find(candidate => fs.existsSync(candidate));
    return load(target);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}
function find(node, predicate) {
  if (!node || typeof node !== 'object') return;
  if (predicate(node)) return node;
  const children = node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
const content = load(path.join(root, 'app/ArticleLessonContent.tsx'));
const lessons = load(path.join(root, 'app/articleLessons.ts'));
const sourceWords = {
  '02': load(path.join(root, 'app/article02PdfVocabulary.ts')).article02PdfVocabulary,
  ...load(path.join(root, 'app/article03to05PdfVocabulary.ts')).article03to05PdfVocabulary,
  ...load(path.join(root, 'app/article06to08PdfVocabulary.ts')).article06to08PdfVocabulary,
  '09': load(path.join(root, 'app/article09PdfVocabulary.ts')).article09PdfVocabulary,
  '10': load(path.join(root, 'app/article10PdfVocabulary.ts')).article10PdfVocabulary,
};

// Every curated card uses the same layout component; inspect every real row and occurrence.
test('02–10 word cards attach examples to their sense and hide unsupported comparisons', () => {
  let checked = 0;
  for (const articleId of ['02', '03', '04', '05', '06', '07', '08', '09', '10']) {
    const lesson = lessons.getLesson(articleId);
    const rows = sourceWords[articleId];
    assert.equal(Object.keys(curated[articleId]).length, rows.length, `${articleId}: every marked word has a curated card`);
    for (const row of rows) for (const sentenceId of row.occurrences) {
      states = [];
      cursor = 0;
      const entry = content.LessonWords({ lesson, sentence: lesson.sentences[sentenceId - 1], initialSourceRow: row.sourceRow });
      const tree = entry.type(entry.props);
      const desk = find(tree, node => Array.isArray(node.props?.cards));
      assert.ok(desk, `${articleId}/${row.sourceRow}: word desk`);
      const baseRecord = curated[articleId][row.sourceRow];
      const record = { ...baseRecord, ...baseRecord.contextBySentence?.[sentenceId] };
      assert.deepEqual(desk.props.cards.map(card => card.id), ['meaning', 'collocations', ...(record.compare.length ? ['compare'] : []), 'usage', 'press']);
      const primary = desk.props.cards[0].content;
      const context = find(primary, node => node.props?.className === 'word-context-meaning');
      const example = find(primary, node => node.props?.className === 'word-context-example');
      const other = find(primary, node => node.props?.className === 'word-other');
      assert.ok(context, `${articleId}/${row.sourceRow}: context meaning`);
      assert.equal(Boolean(example), Boolean(record.dictionaryExample), `${articleId}/${row.sourceRow}: only a sourced dictionary example is shown`);
      assert.equal(find(context, node => node.props?.className === 'word-context-example'), example, `${articleId}/${row.sourceRow}: example belongs inside context meaning`);
      assert.equal(find(primary, node => node.props?.className === 'word-picture-pending'), undefined, `${articleId}/${row.sourceRow}: no invented image block`);
      if (!record.image) assert.equal(find(primary, node => node.props?.className === 'word-picture'), undefined, `${articleId}/${row.sourceRow}: missing picture leaves no placeholder`);
      assert.equal(Boolean(other), Boolean(record.otherMeanings.length), `${articleId}/${row.sourceRow}: other meanings section`);
      if (other) assert.ok(find(other, node => node.type?.name === 'MeaningExamples'), `${articleId}/${row.sourceRow}: additional-sense examples stay in their section`);
      if (example) {
        assert.equal(example.type, 'details', `${articleId}/${row.sourceRow}: context example is an optional disclosure`);
        const english = find(example, node => node.type === 'p' && node.props?.lang === 'en');
        assert.equal(english?.props.children, record.dictionaryExample.english, `${articleId}/${row.sourceRow}: exact Oxford example`);
      }
      checked++;
    }
  }
  assert.ok(checked >= 758, `checked ${checked} rendered word cards`);
});


test('02–10 Oxford examples stay with distinct meanings instead of repeating across one card', () => {
  for (const [articleId, cards] of Object.entries(curated)) {
    for (const [row, card] of Object.entries(cards)) {
      const examples = [card.dictionaryExample?.english, ...card.otherMeanings.map(sense => sense.exampleEnglish)].filter(Boolean);
      assert.equal(new Set(examples.map(example => example.trim())).size, examples.length, `${articleId}/${row} ${card.word}: an Oxford example must not be assigned to two senses`);
    }
  }
});

test('02–10 curated cards omit editorial caveats and keep teachable content complete', () => {
  let checked = 0;
  for (const [articleId, cards] of Object.entries(curated)) {
    for (const [row, card] of Object.entries(cards)) {
      const key = `${articleId}/${row} ${card.word}`;
      assert.doesNotMatch(JSON.stringify(card), /"(?:sourceCaveat|wordFamilyNote)"/, `${key}: no internal source notes`);
      assert.ok(card.english?.trim() && card.chinese?.trim(), `${key}: contextual meaning in both languages`);
      assert.ok(card.usage?.trim(), `${key}: usable grammar or background note`);
      assert.ok(Array.isArray(card.compare), `${key}: compare is an array, even when no genuine near-synonym exists`);
      const forms = new Set([card.wordFamilyRoot ?? card.word, ...(card.family ?? []).map(entry => entry.split(/\s(?=(?:n|v|adj|adv)\.)/i)[0])].map(form => form.toLowerCase()));
      for (const distinction of card.wordFamilyDistinctions ?? []) {
        assert.ok(distinction.forms?.length >= 2 && distinction.distinction?.trim(), `${key}: distinction explains at least two forms`);
        for (const form of distinction.forms) assert.ok(forms.has(form.toLowerCase()) || [...forms].some(entry => entry.split(/\s*\/\s*/).includes(form.toLowerCase())), `${key}: ${form} belongs to the visible family`);
      }
      checked++;
    }
  }
  assert.equal(checked, 758);
});

test('word families hide empty trees and reveal a same-part-of-speech distinction from a red flag', () => {
  const { WordFamilyTreeGame } = load(path.join(root, 'app/WordFamilyTreeGame.tsx'));
  const props = {
    root: 'history',
    entries: ['historic adj. 有历史意义的', 'historical adj. 与历史有关的', 'historically adv. 从历史角度'],
    distinctions: [{ forms: ['historic', 'historical'], distinction: 'historic 强调历史意义；historical 只表示与历史有关。' }],
  };
  states = [];
  cursor = 0;
  assert.equal(WordFamilyTreeGame({ root: 'history', entries: [] }), null);
  states = [];
  cursor = 0;
  let tree = WordFamilyTreeGame(props);
  const flag = find(tree, node => node.props?.className === 'word-family-distinction-flag');
  assert.ok(flag, 'same-POS words have a red flag');
  assert.equal(find(tree, node => node.props?.className === 'word-family-distinction'), undefined);
  flag.props.onClick();
  cursor = 0;
  tree = WordFamilyTreeGame(props);
  const panel = find(tree, node => node.props?.className === 'word-family-distinction');
  assert.ok(panel, 'the red flag reveals the distinction');
  assert.ok(JSON.stringify(panel).includes('historic 强调历史意义；historical 只表示与历史有关。'));
  assert.ok(!JSON.stringify(panel).includes('historic：'), 'the panel explains usage rather than listing glosses');
  states = [];
  cursor = 0;
  tree = WordFamilyTreeGame({ root: 'historic', entries: ['historical adj. 与历史有关的'], distinctions: props.distinctions });
  assert.ok(find(tree, node => node.props?.className === 'word-family-distinction-flag'), 'the root word can be one of the compared forms');
  states = [];
  cursor = 0;
  tree = WordFamilyTreeGame({ root: 'historic', entries: ['historical adj. 与历史有关的'] });
  assert.equal(find(tree, node => node.props?.className === 'word-family-distinction-flag'), undefined, 'a flag must not promise a distinction when no explanation exists');
});

test('Article 01 cards omit unsupported comparisons and do not expose editorial source notes', () => {
  const records = JSON.parse(fs.readFileSync(path.join(root, 'app/article01Vocabulary.json'), 'utf8')).records;
  const { ArticleOneWords } = load(path.join(root, 'app/ArticleOneWords.tsx'));
  assert.equal(records.length, 60);
  for (const record of records) {
    states = [];
    cursor = 0;
    const tree = ArticleOneWords({ sentence: record.sentence, text: '', initialSourceRow: record.sourceRow });
    const desk = find(tree, node => Array.isArray(node.props?.cards));
    assert.ok(desk, `${record.sourceRow}: word desk`);
    const hasComparison = record.supplementation.split(/\n\s*\n/).some(section => section.startsWith('Contrast:'));
    assert.equal(desk.props.cards.some(card => card.id === 'compare'), hasComparison, `${record.sourceRow}: compare card`);
    assert.doesNotMatch(record.supplementation, /用户提供|词典摘录|牛津摘录|待核对/, `${record.sourceRow}: source note`);
    const chineseSenses = record.otherSenses.split('\n').filter(Boolean).length;
    const englishSenses = record.otherSensesEn.split('\n').filter(Boolean).length;
    assert.equal(chineseSenses, englishSenses, `${record.sourceRow}: other-sense translation alignment`);
  }
});
