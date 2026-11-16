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
const { LessonWords, LessonVocabularyTitle } = load(path.join(root, 'app/ArticleLessonContent.tsx'));
const { ArticleSyntaxReading } = load(path.join(root, 'app/ArticleSyntaxReading.tsx'));
const { AnalysisReadingWords, AnalysisTitleWords } = load(path.join(root, 'app/ArticleReadingWords.tsx'));
const { fullArticleParagraphs } = load(path.join(root, 'app/suppliedArticles.ts'));

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

test('every highlighted vocabulary occurrence in all ten Analysis notebooks has a unique target in Text', () => {
  const page = ts.createSourceFile('page.tsx', fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8'),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const earlyText = new Map();
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) &&
        ['steffensParagraphs', 'robotsParagraphs'].includes(node.name.text)) {
      earlyText.set(node.name.text, node.initializer.elements.map(element => element.text));
    }
    ts.forEachChild(node, visit);
  }
  visit(page);
  const lessons = { '01': article01ReadingLesson, ...articleLessons };
  const noOp = () => {};
  for (const [articleId, lesson] of Object.entries(lessons)) {
    const index = Number(articleId) - 1;
    const paragraphs = [earlyText.get('steffensParagraphs'), earlyText.get('robotsParagraphs')][index] ?? fullArticleParagraphs[index];
    const text = renderToStaticMarkup(React.createElement(ArticleSyntaxReading, { articleId, paragraphs, onSelect: noOp }));
    const title = index >= 5 ? renderToStaticMarkup(React.createElement(LessonVocabularyTitle, {
      articleId, text: lesson.title, onSelect: noOp,
    })) : '';
    const ids = [...(text + title).matchAll(/id="(text-word-[\d-]+)"/g)].map(match => match[1]);
    const destinations = new Set(ids);
    const links = lesson.sentences.flatMap(sentence => {
      const props = { lesson, sentence, onJump: noOp };
      const contents = renderToStaticMarkup(React.createElement(React.Fragment, null,
        React.createElement(AnalysisReadingWords, props), React.createElement(AnalysisTitleWords, props)));
      return [...contents.matchAll(/href="\/\?article=(\d+)&amp;open=reading#(text-word-[\d-]+)"/g)].map(match => {
        assert.equal(match[1], articleId);
        return match[2];
      });
    });
    assert.ok(links.length > 0, articleId);
    assert.equal(destinations.size, ids.length, `No duplicate Text anchors in article ${articleId}`);
    assert.ok(links.every(id => destinations.has(id)), `All links reach their exact word in article ${articleId}`);
    assert.equal(new Set(links.filter(id => !id.startsWith(`text-word-${articleId}-0-`))).size,
      ids.filter(id => !id.startsWith(`text-word-${articleId}-0-`)).length, `No body highlights missed in article ${articleId}`);
    if (articleId === '08') assert.ok(links.includes(ids.find(id => id.startsWith('text-word-08-0-1-'))), 'foodie links to the title');
  }
});

test('Courage keeps the yoshi word card without an empty In the press button', () => {
  const lesson = articleLessons['05'];
  const sentence = lesson.sentences[50];
  const render = row => renderToStaticMarkup(React.createElement(LessonWords, { lesson, sentence, initialSourceRow: row }));
  const yoshi = render(58);
  assert.match(yoshi, /data-source-row="58"/);
  assert.match(yoshi, /word-file-tab word-file-meaning/);
  assert.doesNotMatch(yoshi, /word-file-tab word-file-press/);
  assert.match(render(57), /word-file-tab word-file-press/);
});
