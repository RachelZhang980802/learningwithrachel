import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = path.resolve(import.meta.dirname, '..');
const work = path.join(root, 'work/pdf-note-reconciliation-2026-09-08');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const data = JSON.parse(read('app/article02to05Lessons.json'));
const manifest = JSON.parse(fs.readFileSync(path.join(work, 'before-manifest.json')));
const ledger = JSON.parse(fs.readFileSync(path.join(work, 'page-audit.json')));
const notes = JSON.parse(fs.readFileSync(path.join(work, 'verified-pdf-notes.json')));
const pdfs = JSON.parse(fs.readFileSync(path.join(work, 'pdf-pages.json')));
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const req = createRequire(import.meta.url);

// Execute the real components with a small deterministic hook harness; no browser is required.
function componentHarness() {
  const cache = new Map();
  let states = [], cursor = 0;
  const react = { ...React, useId: () => 'answer-test', useState(initial) {
    const index = cursor++;
    if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
    return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
  } };
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const localRequire = name => {
      if (name === 'react') return react;
      if (name.endsWith('.css')) return {};
      if (!name.startsWith('.')) return req(name);
      const resolved = path.resolve(path.dirname(file), name);
      if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved));
      return load(['', '.tsx', '.ts'].map(suffix => resolved + suffix).find(candidate => fs.existsSync(candidate)));
    };
    vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports);
    return module.exports;
  }
  return { load, render(component, props) { cursor = 0; return component(props); }, reset() { states = []; } };
}
const harness = componentHarness();
const content = harness.load(path.join(root, 'app/ArticleLessonContent.tsx'));
const grammar = harness.load(path.join(root, 'app/GrammarLegend.tsx'));
function find(node, predicate) {
  if (!node || typeof node !== 'object') return;
  if (predicate(node)) return node;
  for (const child of React.Children.toArray(node.props?.children)) {
    const result = find(child, predicate); if (result) return result;
  }
}

test('all 269 Reuse prompts reveal and hide their own English model, using the Article 01 contract', () => {
  for (const lesson of Object.values(data)) for (const sentence of lesson.sentences) {
    assert.match(sentence.reuse.pattern, /___/);
    assert.match(sentence.reuse.zh, /\p{Script=Han}/u);
    assert.ok(sentence.reuse.en);
    harness.reset();
    const render = () => harness.render(content.LessonReuse, { sentence });
    let tree = render();
    let button = find(tree, x => x.type === 'button');
    let answer = find(tree, x => x.props?.id === button.props['aria-controls']);
    assert.equal(button.props.children, sentence.reuse.zh);
    assert.equal(button.props['aria-expanded'], false);
    assert.equal(answer.props.hidden, true);
    assert.equal(answer.props.children, null);
    button.props.onClick();
    tree = render(); button = find(tree, x => x.type === 'button');
    answer = find(tree, x => x.props?.id === button.props['aria-controls']);
    assert.equal(button.props['aria-expanded'], true);
    assert.equal(answer.props.hidden, false);
    assert.equal(answer.props.children, sentence.reuse.en);
    button.props.onClick();
    assert.equal(find(render(), x => x.props?.id === 'answer-test').props.hidden, true);
  }
});

test('all 154 vocabulary cards display the reviewed additional senses and retain the press slot', () => {
  for (const lesson of Object.values(data)) for (const word of lesson.vocabulary) {
    assert.equal(word.otherSensesReviewed, true);
    assert.ok(Array.isArray(word.otherSenses));
    for (const sense of word.otherSenses) assert.match(sense, /\p{Script=Han}/u);
    harness.reset();
    const tree = harness.render(content.LessonWords, { lesson, sentence: lesson.sentences[word.occurrences[0] - 1], initialSourceRow: word.sourceRow });
    const desk = find(tree, x => x.props?.cards);
    const html = renderToStaticMarkup(desk.props.cards.find(card => card.id === 'meaning').content);
    assert.ok(html.includes('Other meanings'));
    assert.equal(desk.props.cards.find(card => card.id === 'press').subtitle, '外刊用法');
    if (!word.otherSenses.length) assert.ok(html.includes('暂无需要另记的重要常用义项'));
    assert.equal(tree.props['data-source-row'], word.sourceRow);
  }
});

test('121 reviewed PDF pages and 115 notes retain valid sentence destinations and exact source PDF bytes', () => {
  assert.equal(ledger.length, 121); assert.equal(notes.length, 115);
  assert.equal(notes.filter(note => note.disposition === '纠正').length, 44);
  for (const page of ledger) {
    assert.ok(page.textReviewed && page.renderedPageReviewed && page.destinations.length);
    assert.ok(fs.existsSync(path.join(root, page.image)));
  }
  for (const [id, pdf] of Object.entries(pdfs)) assert.equal(hash(path.join(root, `public/lesson-sources/article${id}.pdf`)), pdf.sha256);
  for (const note of notes) for (const id of note.sentenceIds) {
    const sentence = data[note.articleId].sentences[id - 1];
    assert.ok(sentence.pdfNotes.some(item => item.title === note.title && item.entry === note.entry));
    const html = renderToStaticMarkup(React.createElement(content.LessonPdfNotes, { sentence, entry: note.entry }));
    for (const page of note.pages) assert.ok(html.includes(`article${note.articleId}.pdf#page=${page}`));
  }
});

test('grammar roles use eight distinct colours and classify nested roles by their local function', () => {
  const cases = { '主语': 'subject', '定语从句主语': 'subject', '后置不定式·真正主语': 'subject', '谓语': 'predicate', '宾语从句谓语': 'predicate', '定语从句宾语': 'object', '主语的定语从句': 'modifier', '宾补（含定语从句）': 'complement', '原因状语': 'adverbial', '主语＋谓语': 'clause', '连接词': 'linker' };
  for (const [label, role] of Object.entries(cases)) assert.equal(grammar.grammarRole(label), role, label);
  const theme = read('app/grammar-theme.css');
  const colours = [...theme.matchAll(/--grammar-colour:(#[0-9a-f]+)/g)].map(match => match[1]);
  assert.equal(colours.length, 8); assert.equal(new Set(colours).size, 8);
  assert.ok(read('app/page.tsx').includes('return grammarRole(label)'));
  assert.ok(read('app/ArticleLessonContent.tsx').includes('return grammarRole(label)'));
});

test('all pre-existing audio and non-target content are byte-identical to the start of this PDF audit', () => {
  const allowed = new Set(['app/page.tsx', 'app/layout.tsx', 'app/articleLessons.ts', 'app/ArticleLessonContent.tsx', 'app/article-lessons.css', 'app/article02to05Lessons.json']);
  let audio = 0;
  for (const [file, sha] of Object.entries(manifest)) {
    if (allowed.has(file)) continue;
    assert.equal(hash(path.join(root, file)), sha, file);
    if (/\.(mp3|wav|m4a|ogg)$/i.test(file)) audio++;
  }
  assert.equal(audio, 951);
  const before = JSON.parse(fs.readFileSync(path.join(work, 'before/app/article02to05Lessons.json.backup')));
  for (const [id, lesson] of Object.entries(data)) {
    const strip = { ...lesson, vocabulary: lesson.vocabulary.map(({ otherSenses, otherSensesReviewed, ...word }) => word), sentences: lesson.sentences.map(({ reuse, pdfNotes, ...sentence }) => sentence) };
    assert.deepEqual(strip, before[id], `${id}: original fields remain intact`);
  }
});
