import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const cards = JSON.parse(fs.readFileSync(path.join(root, 'app/article09CuratedVocabulary.json'), 'utf8'))['09'];
const audio = JSON.parse(fs.readFileSync(path.join(root, 'public/audio/article-01-words-native/article-09-manifest.json'), 'utf8'))['09'];
const lesson = JSON.parse(fs.readFileSync(path.join(root, 'app/article06to10Lessons.json'), 'utf8'))['09'];
test('article 09 has a complete contextual word card and offline recording for each of 84 indexed entries', () => {
  assert.equal(Object.keys(cards).length, 84);
  assert.equal(Object.keys(audio).length, 84);
  assert.deepEqual(Object.keys(cards).map(Number).sort((a,b)=>a-b), Array.from({length:84}, (_,i)=>i+1));
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
test('article 09 explicitly marks excerpt gaps and distinguishes customs from Customs', () => {
  for (const row of [11,56,60,62,67,68,76,78,79,84]) assert.equal(cards[row].otherMeaningsStatus, 'missing_source');
  assert.match(cards['81'].chinese, /习俗/);
  assert.match(cards['81'].sourceCaveat, /海关/);
  assert.equal(cards['80'].otherMeaningsStatus, 'present');
});

test('article 09 PDF highlights resolve to indexed words in Text and the card UI', () => {
  const source = fs.readFileSync(path.join(root, 'app/article09PdfVocabulary.ts'), 'utf8');
  const section = source.split('article09PdfVocabulary: PendingPdfWord[] = [')[1].split('\n];')[0];
  const rows = [...section.matchAll(/\{ sourceRow: (\d+), word: "([^"]+)".*?forms: \[([^\]]+)\].*?occurrences: \[([^\]]+)\]/g)];
  assert.equal(rows.length, 84);
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
  assert.match(ui, /article09CuratedWords/);
  assert.match(ui, /article09LocalAudio/);
  assert.match(ui, /article09PdfVocabulary/);
});
