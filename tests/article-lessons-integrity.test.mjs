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
const work = path.join(root, 'work/article02-05-unification-2026-09-08');
const original = JSON.parse(fs.readFileSync(path.join(work, 'source-data.json')));
const data = JSON.parse(fs.readFileSync(path.join(root, 'app/article02to05Lessons.json')));
const baseline = JSON.parse(fs.readFileSync(path.join(work, 'before-manifest.json')));
const req = createRequire(import.meta.url);
const modules = new Map();
function loadApp(file) {
  if (modules.has(file)) return modules.get(file).exports;
  const module = { exports: {} }; modules.set(file, module);
  const source = fs.readFileSync(file, 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  const localRequire = name => {
    if (name.endsWith('.css')) return {};
    if (!name.startsWith('.')) return req(name);
    const resolved = path.resolve(path.dirname(file), name);
    if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved));
    const target = ['', '.tsx', '.ts'].map(suffix => resolved + suffix).find(candidate => fs.existsSync(candidate));
    return loadApp(target);
  };
  vm.runInThisContext(`(function(require,module,exports){${outputText}\n})`, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}
const helpers = loadApp(path.join(root, 'app/articleLessons.ts'));
const content = loadApp(path.join(root, 'app/ArticleLessonContent.tsx'));
const notebook = loadApp(path.join(root, 'app/ArticleOneNotebook.tsx'));
const htmlText = html => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('269 sentences retain exact original text, sequence, paragraph and audio references', () => {
  assert.deepEqual(Object.values(data).map(lesson => lesson.sentences.length), [48, 66, 75, 80]);
  for (const [id, lesson] of Object.entries(data)) for (const [index, sentence] of lesson.sentences.entries()) {
    for (const key of ['id', 'text', 'paragraph', 'audioSrc']) assert.equal(sentence[key], original[id].sentences[index][key], `${id}-${index + 1}: ${key}`);
    assert.equal(sentence.functions.map(([, text]) => text).join(''), sentence.text, `${id}-${sentence.id}: complete function coverage`);
    assert.ok(sentence.clauses.length && sentence.functions.length && sentence.note && sentence.translation && sentence.paraphrase);
    assert.ok(['simple', 'complex', 'compound', 'compound-complex', 'fragment', 'speech'].includes(sentence.classification.type));
  }
});

test('all 154 supplied vocabulary entries have Chinese notes, source links and reachable highlights', () => {
  const docx = fs.readFileSync(path.join(work, 'sources/vocabulary.txt'), 'utf8');
  const sections = docx.split(/第[二三四五]篇文章(?:的生词|词汇)[：:]?/).slice(1);
  const normalize = text => text.replace(/\s|[.。'’]/g, '').toLowerCase();
  assert.deepEqual(Object.values(data).map(lesson => lesson.vocabulary.length), [36, 47, 30, 41]);
  for (const [index, lesson] of Object.values(data).entries()) {
    const suppliedWords = sections[index].split('\n').map(x => x.trim()).filter(x => x && !x.includes('Words and Expressions'));
    assert.deepEqual(lesson.vocabulary.map(w => normalize(w.word)), suppliedWords.map(normalize));
    const reachable = new Set();
    for (const sentence of lesson.sentences) for (const match of helpers.vocabularyMatches(lesson, sentence.id, sentence.text)) {
      reachable.add(match.sourceRow);
      assert.ok(lesson.vocabulary.find(w => w.sourceRow === match.sourceRow)?.occurrences.includes(sentence.id));
    }
    for (const word of lesson.vocabulary) {
      assert.ok(reachable.has(word.sourceRow), `${lesson.articleId}: ${word.word} opens from the source`);
      assert.match(word.definition, / — .*\p{Script=Han}/u);
      assert.ok(word.sources.length && word.ipa && word.partOfSpeech && word.usage);
      for (const source of word.sources) assert.match(source.url, /^https:\/\/(dictionary\.cambridge\.org|www\.oxfordlearnersdictionaries\.com)\//);
      for (const family of word.family) assert.doesNotMatch(family, /^(noun|verb|adjective|adverb):/);
      for (const key of ['collocations', 'compare', 'family']) assert.ok(word[key].length);
    }
  }
});

test('full-text highlights preserve every paragraph character and map to the correct sentence', () => {
  for (const [id, lesson] of Object.entries(data)) for (const [index, text] of original[id].paragraphs.entries()) {
    const segments = helpers.paragraphSegments(lesson, index + 1, text);
    assert.equal(segments.map(x => x.text).join(''), text);
    const html = renderToStaticMarkup(React.createElement(content.LessonVocabularyParagraph, { articleId: id, paragraph: index + 1, text, onSelect() {} }));
    assert.equal(htmlText(html), text, `${id} paragraph ${index + 1}: visible original`);
    for (const segment of segments) {
      const matches = helpers.vocabularyMatches(lesson, segment.sentence, segment.text);
      for (const match of matches) {
        assert.ok(lesson.sentences[segment.sentence - 1].text.toLowerCase().includes(segment.text.slice(match.start, match.end).toLowerCase()));
      }
    }
  }
});

test('each unit renders the same four-entry frame, its own cat, original audio and two analysis cards', () => {
  for (const lesson of Object.values(data)) {
    const sentence = lesson.sentences[0];
    const props = { articleId: lesson.articleId, title: lesson.title, catSrc: lesson.catSrc, audioSrc: sentence.audioSrc, sentenceClassification: sentence.classification,
      sentences: lesson.sentences.map(x => x.text), selected: 0, paragraph: 0, ranges: [{ start: 0, end: lesson.sentences.length - 1 }], onPanel() {}, onSelect() {}, onStep() {}, onExit() {} };
    const front = renderToStaticMarkup(React.createElement(notebook.ArticleOneNotebook, { ...props, panel: null }));
    assert.ok(front.includes(sentence.audioSrc.replace(/&/g, '&amp;')));
    assert.ok(front.includes(lesson.catSrc));
    assert.ok(front.includes(`/sentence-badges/${sentence.classification.badge}-cat.png`));
    for (const panel of ['words', 'structure', 'translation', 'paraphrase']) {
      const children = panel === 'words' ? React.createElement(content.LessonWords, { lesson, sentence })
        : panel === 'structure' ? React.createElement(content.LessonStructure, { sentence })
        : React.createElement(content.LessonActivities, { lesson, sentence, panel, onPanel() {} });
      const back = renderToStaticMarkup(React.createElement(notebook.ArticleOneNotebook, { ...props, panel }, children));
      for (const entry of ['Words', 'Structure', 'Meaning', 'Practice']) assert.ok(back.includes(`<span>${entry}</span>`));
      assert.ok(back.includes('返回正面'));
      assert.ok(back.includes(`/sentence-badges/${sentence.classification.badge}-cat.png`));
      assert.doesNotMatch(back, /句法.*待补充|词条、音标与中英释义待整理/);
      if (panel === 'structure') assert.equal((back.match(/aria-expanded="false"/g) || []).length, 2);
    }
  }
});

test('original media/content remain byte-identical; layout only adds the authorized shared grammar theme', () => {
  const allowed = new Set(['app/page.tsx', 'app/ArticleOneNotebook.tsx', 'app/layout.tsx']);
  for (const [file, sha] of Object.entries(baseline)) {
    if (allowed.has(file)) continue;
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'), sha, file);
  }
  const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8');
  assert.equal(createHash('sha256').update(layout.replace('import "./grammar-theme.css";\n', '')).digest('hex'), baseline['app/layout.tsx']);
  const before = fs.readFileSync(path.join(work, 'before/app/page.tsx.backup'), 'utf8');
  const after = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
  const firstArticleBranch = source => source.slice(source.indexOf('  if (isStudent) return <ArticleOneNotebook'), source.indexOf('  </ArticleOneNotebook>;', source.indexOf('  if (isStudent) return <ArticleOneNotebook')) + '  </ArticleOneNotebook>;'.length);
  assert.equal(firstArticleBranch(after), firstArticleBranch(before));
  const legacyBranch = source => source.slice(source.indexOf('    <main className="sentence-studio student-workspace-v2 student-studio"'));
  assert.equal(legacyBranch(after), legacyBranch(before));
});
