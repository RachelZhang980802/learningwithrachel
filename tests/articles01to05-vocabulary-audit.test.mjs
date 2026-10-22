import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const expected = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/articles02to05WorkbookWords.json'), 'utf8'));
const curated = JSON.parse(fs.readFileSync(path.join(root, 'app/article02to05CuratedVocabulary.json'), 'utf8'));
const audio = JSON.parse(fs.readFileSync(path.join(root, 'public/audio/article-01-words-native/article-02-05-manifest.json'), 'utf8'));
const lessons = JSON.parse(fs.readFileSync(path.join(root, 'app/article02to05Lessons.json'), 'utf8'));
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
const byArticle = {
  '02': load(path.join(root, 'app/article02PdfVocabulary.ts')).article02PdfVocabulary,
  ...load(path.join(root, 'app/article03to05PdfVocabulary.ts')).article03to05PdfVocabulary,
};
const matches = load(path.join(root, 'app/articleLessons.ts')).vocabularyMatches;

test('02–05 workbook rows, highlighted forms, cards, and offline audio stay aligned', () => {
  for (const aid of ['02', '03', '04', '05']) {
    const source = byArticle[aid];
    assert.equal(source.length, expected[aid].length, `${aid}: source count`);
    assert.equal(Object.keys(curated[aid]).length, source.length, `${aid}: card count`);
    assert.equal(Object.keys(audio[aid]).length, source.length, `${aid}: audio count`);
    const reachable = new Set();
    for (const sentence of lessons[aid].sentences) {
      for (const match of matches(lessons[aid], sentence.id, sentence.text)) reachable.add(match.sourceRow);
    }
    for (const [index, word] of source.entries()) {
      const row = index + 1;
      assert.equal(word.sourceRow, row, `${aid}: row ${row} order`);
      assert.equal(word.word, expected[aid][index], `${aid}: row ${row} workbook headword`);
      assert.equal(curated[aid][row]?.word, word.word, `${aid}: row ${row} card headword`);
      assert.equal(curated[aid][row]?.sourceRow, row, `${aid}: row ${row} card key`);
      assert.ok(reachable.has(row), `${aid}: row ${row} has clickable source text`);
      assert.ok(curated[aid][row].english && curated[aid][row].chinese, `${aid}: row ${row} meaning`);
      assert.ok(curated[aid][row].collocations.length && curated[aid][row].compare.length && curated[aid][row].usage, `${aid}: row ${row} note sections`);
      const recording = audio[aid][row];
      assert.ok(recording?.file, `${aid}: row ${row} recording`);
      const file = path.join(root, 'public', recording.file.replace(/^\//, ''));
      assert.ok(fs.existsSync(file), `${aid}: row ${row} recording file`);
      assert.equal(fs.readFileSync(file).toString('ascii', 0, 4), 'RIFF', `${aid}: row ${row} WAV`);
      assert.ok(fs.statSync(file).size > 4096, `${aid}: row ${row} recording contains audible samples`);
      assert.ok(recording.spokenText && !recording.spokenText.includes('someyour'), `${aid}: row ${row} speech text`);
    }
  }
});

test('01 word cards remain reachable from all 40 source sentences', () => {
  const pageFile = path.join(root, 'app/page.tsx');
  const ast = ts.createSourceFile(pageFile, fs.readFileSync(pageFile, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let paragraphs = [];
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'steffensParagraphs' && ts.isArrayLiteralExpression(node.initializer)) {
      paragraphs = node.initializer.elements.map(element => element.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  const sentences = paragraphs.flatMap(paragraph => paragraph.replaceAll('Ph.D.', 'Ph§D§')
    .match(/[^.!?]+[.!?]+(?:["”])?/g)?.map(sentence => sentence.replace(/§/g, '.').replace(/\s+/g, ' ').trim()) ?? []);
  assert.equal(sentences.length, 40);
  const records = JSON.parse(fs.readFileSync(path.join(root, 'app/article01Vocabulary.json'), 'utf8')).records;
  const sourceMatches = load(path.join(root, 'app/ArticleVocabulary.tsx')).vocabularyMatches;
  assert.equal(records.length, 60);
  for (const record of records) {
    assert.ok(record.word && record.definition && record.definitionEn && record.supplementation, `${record.word}: card fields`);
    assert.ok(sourceMatches(sentences[record.sentence - 1], record.sentence).some(match => match.sourceRow === record.sourceRow), `${record.word}: source highlight`);
  }
});
