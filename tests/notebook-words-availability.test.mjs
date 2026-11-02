import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = path.resolve(import.meta.dirname, '..');
const req = createRequire(import.meta.url);
const modules = new Map();

function load(file) {
  if (modules.has(file)) return modules.get(file).exports;
  const module = { exports: {} };
  modules.set(file, module);
  const source = fs.readFileSync(file, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const localRequire = name => {
    if (name.endsWith('.css')) return {};
    if (!name.startsWith('.')) return req(name);
    const resolved = path.resolve(path.dirname(file), name);
    if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    const target = ['', '.tsx', '.ts'].map(suffix => resolved + suffix).find(candidate => fs.existsSync(candidate));
    if (!target) throw new Error('Cannot load ' + name + ' from ' + file);
    return load(target);
  };
  vm.runInThisContext('(function(require,module,exports){' + output + '\n})', { filename: file })(localRequire, module, module.exports);
  return module.exports;
}

const { notebookPanelsForSentence } = load(path.join(root, 'app/notebookPanels.ts'));
const { article01ReadingLesson } = load(path.join(root, 'app/article01Structure.ts'));
const { vocabularyMatches: article01VocabularyMatches } = load(path.join(root, 'app/ArticleVocabulary.tsx'));
const { articleLessons, vocabularyMatches: lessonVocabularyMatches } = load(path.join(root, 'app/articleLessons.ts'));
const { ArticleOneNotebook } = load(path.join(root, 'app/ArticleOneNotebook.tsx'));
const { LessonWords } = load(path.join(root, 'app/ArticleLessonContent.tsx'));

const fullPanels = ['words', 'structure', 'translation', 'paraphrase'];
const primaryTabs = html => {
  const nav = html.match(/<nav class="notebook-tabs"[^>]*>(.*?)<\/nav>/s)?.[1];
  assert.ok(nav, 'notebook tabs rendered');
  return [...nav.matchAll(/<span>(Words|Structure|Translation|Practice)<\/span>/g)].map(match => match[1]);
};

test('all ten articles show Words when the sentence has a clickable word or an assigned title-only word card', () => {
  let emptySentences = 0;
  let populatedSentences = 0;
  for (const articleId of ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']) {
    const sentences = articleId === '01' ? article01ReadingLesson.sentences : articleLessons[articleId].sentences;
    for (const sentence of sentences) {
      const matches = articleId === '01'
        ? article01VocabularyMatches(sentence.text, sentence.id)
        : lessonVocabularyMatches(articleLessons[articleId], sentence.id, sentence.text);
      const hasTitleWordCard = articleId !== '01' && articleLessons[articleId].vocabulary.some(word =>
        word.titleOnly && word.occurrences.includes(sentence.id));
      const hasWordCard = matches.length > 0 || hasTitleWordCard;
      const panels = notebookPanelsForSentence(articleId, sentence.id);
      const available = panels ?? fullPanels;
      const label = articleId + '/' + sentence.id;
      assert.equal(available.includes('words'), hasWordCard, label + ': Words must reflect a reachable word card');
      assert.ok(available.includes('structure'), label + ': Structure remains');
      assert.ok(available.includes('translation'), label + ': Translation remains');
      if (!hasWordCard) {
        emptySentences++;
        assert.ok(available.includes('paraphrase'), label + ': Practice remains');
      } else {
        populatedSentences++;
      }
    }
  }
  assert.ok(emptySentences > 0, 'fixture includes sentences without vocabulary');
  assert.ok(populatedSentences > 0, 'fixture includes sentences with vocabulary');
});

test('article 08 sentence 1 retains Words for the title-only foodie card', () => {
  const lesson = articleLessons['08'];
  const sentence = lesson.sentences[0];
  assert.equal(lessonVocabularyMatches(lesson, sentence.id, sentence.text).length, 0);
  const titleCard = lesson.vocabulary.find(word => word.word === 'foodie' && word.titleOnly && word.occurrences.includes(1));
  assert.ok(titleCard, 'foodie is a title-only word card assigned to the opening sentence');
  const availablePanels = notebookPanelsForSentence('08', 1);
  assert.ok((availablePanels ?? fullPanels).includes('words'));
  const html = renderToStaticMarkup(React.createElement(ArticleOneNotebook, {
    articleId: '08',
    title: lesson.title,
    catSrc: lesson.catSrc,
    audioSrc: sentence.audioSrc,
    sentences: lesson.sentences.map(item => item.text),
    selected: 0,
    paragraph: sentence.paragraph - 1,
    ranges: [{ start: 0, end: lesson.sentences.length - 1 }],
    panel: null,
    availablePanels,
    onPanel() {}, onSelect() {}, onStep() {}, onExit() {},
  }));
  assert.ok(primaryTabs(html).includes('Words'));
  const wordCard = renderToStaticMarkup(React.createElement(LessonWords, {
    lesson,
    sentence,
    initialSourceRow: titleCard.sourceRow,
  }));
  assert.match(wordCard, /data-source-row="1"/);
  assert.match(wordCard, /aria-label="查看 foodie 的词汇卡"/);
  assert.match(wordCard, /word-file-tab word-file-meaning/);
  assert.doesNotMatch(wordCard, /class="word-empty"/);
});

test('article 02 sentence 25 keeps Structure, Translation and Practice without an empty Words tab', () => {
  const lesson = articleLessons['02'];
  const sentence = lesson.sentences[24];
  assert.match(sentence.text, /But an older population may not be as bad as we think\./);
  assert.equal(lessonVocabularyMatches(lesson, sentence.id, sentence.text).length, 0);
  const availablePanels = notebookPanelsForSentence('02', 25);
  assert.deepEqual([...availablePanels], ['structure', 'translation', 'paraphrase', 'reuse']);
  const html = renderToStaticMarkup(React.createElement(ArticleOneNotebook, {
    articleId: '02',
    title: lesson.title,
    catSrc: lesson.catSrc,
    audioSrc: sentence.audioSrc,
    sentences: lesson.sentences.map(item => item.text),
    selected: 24,
    paragraph: sentence.paragraph - 1,
    ranges: [{ start: 0, end: lesson.sentences.length - 1 }],
    panel: null,
    availablePanels,
    onPanel() {}, onSelect() {}, onStep() {}, onExit() {},
  }));
  assert.deepEqual(primaryTabs(html), ['Structure', 'Translation', 'Practice']);
});

test('a sentence with a vocabulary highlight retains the Words tab', () => {
  const lesson = articleLessons['02'];
  const sentence = lesson.sentences.find(item => lessonVocabularyMatches(lesson, item.id, item.text).length > 0);
  assert.ok(sentence);
  const availablePanels = notebookPanelsForSentence('02', sentence.id);
  const html = renderToStaticMarkup(React.createElement(ArticleOneNotebook, {
    articleId: '02',
    title: lesson.title,
    catSrc: lesson.catSrc,
    audioSrc: sentence.audioSrc,
    sentences: lesson.sentences.map(item => item.text),
    selected: sentence.id - 1,
    paragraph: sentence.paragraph - 1,
    ranges: [{ start: 0, end: lesson.sentences.length - 1 }],
    panel: null,
    availablePanels,
    onPanel() {}, onSelect() {}, onStep() {}, onExit() {},
  }));
  assert.ok(primaryTabs(html).includes('Words'));
});
