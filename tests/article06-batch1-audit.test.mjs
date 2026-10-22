import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const cards = JSON.parse(fs.readFileSync(path.join(root, 'app/article06CuratedVocabulary.json'), 'utf8'))['06'];
const audio = JSON.parse(fs.readFileSync(path.join(root, 'public/audio/article-01-words-native/article-06-manifest.json'), 'utf8'))['06'];
const lesson = JSON.parse(fs.readFileSync(path.join(root, 'app/article06to10Lessons.json'), 'utf8'))['06'];
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  const localRequire = name => {
    if (name.endsWith('.css')) return {};
    if (!name.startsWith('.')) return require(name);
    const resolved = path.resolve(path.dirname(file), name);
    if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    const target = ['', '.ts', '.tsx'].map(ext => resolved + ext).find(fs.existsSync);
    assert.ok(target, `module ${name} from ${file}`);
    return load(target);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}
const index = load(path.join(root, 'app/article06to08PdfVocabulary.ts')).article06to08PdfVocabulary['06'];
const matches = load(path.join(root, 'app/articleLessons.ts')).vocabularyMatches;

test('article 06 all PDF entries have reachable cards and audible offline recordings', () => {
  const first = index;
  assert.equal(Object.keys(cards).length, first.length);
  assert.equal(Object.keys(audio).length, first.length);
  for (const entry of first) {
    const row = String(entry.sourceRow);
    const card = cards[row];
    assert.equal(card.word, entry.word);
    assert.ok(card.english && card.chinese && card.usage);
    assert.ok(card.collocations.length >= 2 && card.compare.length >= 1);
    assert.ok(entry.occurrences.some(id => {
      const sentence = lesson.sentences.find(s => s.id === id);
      return matches(lesson, id, sentence.text).some(match => match.sourceRow === entry.sourceRow);
    }), `${entry.word} must be clickable in Text`);
    const recording = audio[row];
    assert.ok(recording?.file && recording.spokenText);
    const wav = path.join(root, 'public', recording.file.replace(/^\//, ''));
    assert.equal(fs.readFileSync(wav).toString('ascii', 0, 4), 'RIFF');
    assert.ok(fs.statSync(wav).size > 5000);
  }
  for (const row of ['13', '78']) assert.match(cards[row].sourceCaveat, /未列|未收/);
});


test('all 138 Article 06 PDF words remain highlighted and clickable in Text', () => {
  assert.equal(index.length, 138);
  for (const entry of index) {
    assert.ok(entry.occurrences.length, `${entry.word}: PDF location`);
    assert.ok(entry.occurrences.some(id => {
      const sentence = lesson.sentences.find(item => item.id === id);
      return sentence && matches(lesson, id, sentence.text).some(match => match.sourceRow === entry.sourceRow);
    }), `${entry.word}: clickable highlight`);
  }
});

const article07 = load(path.join(root, 'app/article06to08PdfVocabulary.ts')).article06to08PdfVocabulary['07'];
const cards07 = JSON.parse(fs.readFileSync(path.join(root, 'app/article07CuratedVocabulary.json'), 'utf8'))['07'];
const lesson07 = JSON.parse(fs.readFileSync(path.join(root, 'app/article06to10Lessons.json'), 'utf8'))['07'];
test('all 110 Article 07 PDF words have cards reachable from their highlighted text', () => {
  assert.equal(article07.length, 110);
  assert.equal(Object.keys(cards07).length, 110);
  for (const entry of article07) {
    const card = cards07[String(entry.sourceRow)];
    assert.ok(card && card.word === entry.word, `${entry.word}: curated card`);
    assert.ok(entry.occurrences.some(id => {
      const sentence = lesson07.sentences.find(s => s.id === id);
      return sentence && matches(lesson07, id, sentence.text).some(match => match.sourceRow === entry.sourceRow);
    }), `${entry.word}: clickable highlight`);
  }
});
