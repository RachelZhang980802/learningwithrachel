import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';

const root = path.resolve(import.meta.dirname, '..');
const curated = JSON.parse(fs.readFileSync(path.join(root, 'app/article02to05CuratedVocabulary.json'), 'utf8'));
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
};

// Every curated card uses the same layout component; inspect every real row and occurrence.
test('02–05 word cards attach examples to their sense and keep the Article 01 layout', () => {
  let checked = 0;
  for (const articleId of ['02', '03', '04', '05']) {
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
      assert.deepEqual(desk.props.cards.map(card => card.id), ['meaning', 'collocations', 'compare', 'usage', 'press']);
      const primary = desk.props.cards[0].content;
      const context = find(primary, node => node.props?.className === 'word-context-meaning');
      const example = find(primary, node => node.props?.className === 'word-context-example');
      const other = find(primary, node => node.props?.className === 'word-other');
      const record = curated[articleId][row.sourceRow];
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
  assert.ok(checked >= 258, `checked ${checked} rendered word cards`);
});


test('02–06 Oxford examples stay with distinct meanings instead of repeating across one card', () => {
  const sixth = JSON.parse(fs.readFileSync(path.join(root, 'app/article06CuratedVocabulary.json'), 'utf8'))['06'];
  for (const [articleId, cards] of Object.entries({ ...curated, '06': sixth })) {
    for (const [row, card] of Object.entries(cards)) {
      const examples = [card.dictionaryExample?.english, ...card.otherMeanings.map(sense => sense.exampleEnglish)].filter(Boolean);
      assert.equal(new Set(examples.map(example => example.trim())).size, examples.length, `${articleId}/${row} ${card.word}: an Oxford example must not be assigned to two senses`);
    }
  }
});
