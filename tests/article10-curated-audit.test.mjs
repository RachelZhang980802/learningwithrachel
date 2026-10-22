import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const cards = JSON.parse(fs.readFileSync(path.join(root, 'app/article10CuratedVocabulary.json'), 'utf8'))['10'];
const audio = JSON.parse(fs.readFileSync(path.join(root, 'public/audio/article-01-words-native/article-10-manifest.json'), 'utf8'))['10'];
const lesson = JSON.parse(fs.readFileSync(path.join(root, 'app/article06to10Lessons.json'), 'utf8'))['10'];
test('article 10 has a complete contextual word card and offline recording for each of 81 indexed entries', () => {
  assert.equal(Object.keys(cards).length, 81);
  assert.equal(Object.keys(audio).length, 81);
  assert.deepEqual(Object.keys(cards).map(Number).sort((a,b)=>a-b), Array.from({length:81}, (_,i)=>i+1));
  for (const [row, card] of Object.entries(cards)) {
    assert.equal(card.sourceRow, Number(row));
    assert.ok(card.word && card.english && card.chinese && card.usage, row);
    assert.ok(card.collocations.length >= 2 && card.compare.length >= 1, row);
    assert.ok(card.articleExample === lesson.title || lesson.sentences.some(s=>s.text===card.articleExample), `${row}: article context`);
    assert.ok(['present','none_in_excerpt','missing_source'].includes(card.otherMeaningsStatus), row);
    assert.equal(card.otherMeaningsStatus === 'present', card.otherMeanings.length > 0, row);
    if (!card.oxfordExcerptProvided) assert.match(card.sourceCaveat, /未单列/, row);
    if (card.dictionaryExample) assert.match(card.dictionaryExample.source, /Oxford Advanced Learner/, row);
    for (const sense of card.otherMeanings) {
      assert.ok(sense.english && sense.chinese, `${row}: bilingual other meaning`);
      assert.equal(Boolean(sense.exampleEnglish), Boolean(sense.exampleChinese), `${row}: paired example`);
    }
    const recording = audio[row];
    assert.ok(recording?.file && recording.spokenText, `${row}: recording`);
    const wav = path.join(root, 'public', recording.file.replace(/^\//,''));
    assert.equal(fs.readFileSync(wav).toString('ascii',0,4), 'RIFF', `${row}: WAV header`);
    assert.ok(fs.statSync(wav).size > 5000, `${row}: nonempty WAV`);
  }
});
test('article 10 marks excerpt gaps and separates literary river senses from generic dictionary senses', () => {
  for (const row of [24,42,47,49,70]) assert.equal(cards[row].otherMeaningsStatus, 'missing_source');
  assert.match(cards['32'].chinese, /沙洲/);
  assert.match(cards['32'].sourceCaveat, /未列该航海义/);
  assert.match(cards['39'].sourceCaveat, /仅列 compass 名词/);
  assert.match(cards['35'].sourceCaveat, /未单列此动词短语/);
});

test('article 10 PDF highlights resolve to indexed words in Text and the card UI', () => {
  const source = fs.readFileSync(path.join(root, 'app/article10PdfVocabulary.ts'), 'utf8');
  const section = source.split('article10PdfVocabulary: PendingPdfWord[] = [')[1].split('\n];')[0];
  const rows = [...section.matchAll(/\{ sourceRow: (\d+), word: "([^"]+)".*?forms: \[([^\]]+)\].*?occurrences: \[([^\]]+)\]/g)];
  assert.equal(rows.length, 81);
  for (const [, row, word, rawForms, rawOccurrences] of rows) {
    assert.equal(cards[row].word, word);
    const forms = [...rawForms.matchAll(/"([^"]+)"/g)].map(match=>match[1]);
    const occurrences = rawOccurrences.split(',').map(Number);
    for (const occurrence of occurrences) {
      const context = lesson.sentences[occurrence - 1].text;
      assert.ok(forms.some(form => context.toLowerCase().includes(form.toLowerCase())), `${row}: highlighted form in ${occurrence}`);
    }
  }
  const ui = fs.readFileSync(path.join(root, 'app/ArticleLessonContent.tsx'), 'utf8');
  assert.match(ui, /article10CuratedWords/);
  assert.match(ui, /article10LocalAudio/);
  assert.match(ui, /article10PdfVocabulary/);
});
