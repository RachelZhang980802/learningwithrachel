import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const json = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const first = json('app/article01Vocabulary.json').records;
const cards = json('app/article02to05CuratedVocabulary.json');
const lines = value => value.split('\n').filter(Boolean);
let states = [], cursor = 0;
const cache = new Map();
function load(file) {
  file = path.join(root, file);
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  const localRequire = name => {
    if (name === 'react') return { useId: () => ':translation:', useState: initial => {
      const index = cursor++;
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
      return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
    } };
    if (name.endsWith('.json')) return json(path.relative(root, path.resolve(path.dirname(file), name)));
    return require(name);
  };
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`, { filename: file })(localRequire, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
const press = load('app/article03PressExamples.ts').article03PressExamples;

test('all 318 Article 01–05 records have aligned, sense-specific grammar labels', () => {
  assert.equal(first.length + Object.values(cards).reduce((n, rows) => n + Object.keys(rows).length, 0), 318);
  for (const record of first) {
    assert.equal(record.otherSensesReviewed, true, record.word);
    assert.equal(lines(record.otherSenses).length, lines(record.otherSensesEn).length, record.word);
    assert.equal(lines(record.otherSenses).length, record.otherSensePartsOfSpeech.length, record.word);
    assert.equal(lines(record.otherSenses).length, record.otherSenseExampleIndices.length, record.word);
    assert.ok(record.otherSensePartsOfSpeech.every(value => value.trim()), record.word);
  }
  for (const [article, rows] of Object.entries(cards)) for (const record of Object.values(rows)) {
    assert.equal(record.otherSensesReviewed, true, `${article}: ${record.word}`);
    assert.ok(record.english && record.chinese && record.partOfSpeech, record.word);
    assert.notEqual(record.otherMeaningsStatus, 'missing_source', record.word);
    for (const sense of record.otherMeanings) assert.ok(sense.english && sense.chinese && sense.partOfSpeech, record.word);
  }
});

test('Article 03 has a bilingual linked example for every marked word, with usable highlights', () => {
  assert.deepEqual(Object.keys(press), Object.keys(cards['03']));
  for (const [row, example] of Object.entries(press)) {
    assert.ok(example.english && example.chinese && example.source, row);
    assert.equal(new URL(example.url).protocol, 'https:');
    assert.doesNotMatch(example.url, /__cf_chl|%0A|[\r\n]/i);
    assert.ok(example.highlights.some(term => example.english.toLowerCase().includes(term.toLowerCase())), `${row}: target is in the example`);
  }
  assert.match(press[53].url, /^https:\/\/www\.abc\.net\.au\//);
  assert.match(press[53].chinese, /半决赛/);
  assert.match(press[60].english, /established himself/);
  assert.match(press[48].english, /join terrorist networks/);
  assert.match(press[68].english, /settle in/);
});

test('prepositional phrase senses are not confused with the related noun relation', () => {
  const senses = cards['03'][2].otherMeanings;
  const phrase = senses.filter(sense => sense.partOfSpeech === 'prep. phr.');
  assert.equal(phrase.length, 3);
  assert.ok(phrase.some(sense => /compared/.test(sense.english)));
  assert.ok(phrase.some(sense => /concerning/.test(sense.english)));
  assert.ok(phrase.some(sense => /position/.test(sense.english)));
  assert.ok(phrase.every(sense => !/亲戚/.test(sense.chinese)));
  assert.ok(senses.filter(sense => /亲戚/.test(sense.chinese)).every(sense => sense.headword === 'relation'));
});

test('previously omitted major senses and contextual forms stay present', () => {
  const join = cards['03'][48].otherMeanings;
  for (const pattern of [/connect/, /member/, /activity/]) assert.ok(join.some(sense => pattern.test(sense.english)));
  assert.ok(join.some(sense => /^n\./.test(sense.partOfSpeech)));
  assert.match(cards['05'][7].contextPartOfSpeech, /^adj\./);
  assert.match(cards['05'][7].chinese, /shuttered/);
  assert.match(cards['03'][20].partOfSpeech, /^n\./);
  assert.match(cards['03'][75].contextPartOfSpeech, /^n\./);
  assert.ok(cards['04'][37].otherMeanings.some(sense => /physically fit/.test(sense.english)));
  assert.ok(cards['04'][38].otherMeanings.some(sense => /not sharp/.test(sense.english)));
  assert.ok(cards['05'][1].otherMeanings.some(sense => /^v\./.test(sense.partOfSpeech)));
  assert.ok(first.find(record => record.word === 'essential').otherSenses.includes('必不可少'));
  assert.deepEqual(cards['05'][4].family, cards['05'][40].family, 'receive family is consistent across the two cards');
});

test('clicking the English quote toggles only its matching Chinese translation', () => {
  const { PressExample } = load('app/PressExample.tsx');
  for (const row of [2, 53, 60, 68]) {
    states = []; cursor = 0;
    let tree = PressExample({ example: press[row] });
    let button = nodes(tree, node => node.type === 'button')[0];
    const answer = () => nodes(tree, node => node.props?.id === ':translation:')[0];
    assert.equal(button.props['aria-expanded'], false);
    assert.equal(answer().props.hidden, true);
    button.props.onClick(); cursor = 0;
    tree = PressExample({ example: press[row] });
    button = nodes(tree, node => node.type === 'button')[0];
    assert.equal(button.props['aria-expanded'], true);
    assert.equal(answer().props.hidden, false);
    assert.equal(answer().props.children, press[row].chinese);
    assert.equal(nodes(tree, node => node.type === 'a')[0].props.href, press[row].url);
    button.props.onClick(); cursor = 0;
    tree = PressExample({ example: press[row] });
    assert.equal(answer().props.hidden, true);
  }
});

test('new Article 01 senses cannot accidentally reuse an Oxford example from a different index', () => {
  const { MeaningExamples } = load('app/MeaningExamples.tsx');
  states = []; cursor = 0;
  const tree = MeaningExamples({ word: 'proportion', items: [{ english: 'A newly added sense', chinese: '新义项', partOfSpeech: 'n.', catalogIndex: null }] });
  assert.equal(nodes(tree, node => node.type === 'button').length, 0);
  assert.ok(nodes(tree, node => node.props?.className === 'word-sense-pos').length);
});
