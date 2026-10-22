import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const cards = JSON.parse(fs.readFileSync(path.join(root, 'app/article07CuratedVocabulary.json'), 'utf8'))['07'];
const audio = JSON.parse(fs.readFileSync(path.join(root, 'public/audio/article-01-words-native/article-07-manifest.json'), 'utf8'))['07'];
const sentences = JSON.parse(fs.readFileSync(path.join(root, 'app/article06to10Lessons.json'), 'utf8'))['07'].sentences;
test('article 07 has 110 contextual word cards and nonempty offline recordings', () => {
  assert.equal(Object.keys(cards).length, 110);
  assert.equal(Object.keys(audio).length, 110);
  const sourceRows = new Set();
  for (const [row, card] of Object.entries(cards)) {
    assert.equal(card.sourceRow, Number(row));
    assert.ok(!sourceRows.has(row));
    sourceRows.add(row);
    assert.ok(card.word && card.english && card.chinese && card.usage, row);
    assert.ok(card.collocations.length >= 2 && card.compare.length >= 1, row);
    assert.ok(sentences.some(sentence => sentence.text === card.articleExample), `${row}: article sentence`);
    const recording = audio[row];
    assert.ok(recording?.file && recording.spokenText, `${row}: recording`);
    const wav = path.join(root, 'public', recording.file.replace(/^\//, ''));
    assert.equal(fs.readFileSync(wav).toString('ascii', 0, 4), 'RIFF');
    assert.ok(fs.statSync(wav).size > 5000, `${row}: nonempty WAV`);
    if (!card.oxfordExcerptProvided) assert.match(card.sourceCaveat, /未单列/);
    if (card.dictionaryExample) assert.match(card.dictionaryExample.source, /Oxford Advanced Learner/);
  }
  assert.deepEqual([...sourceRows].map(Number).sort((a,b) => a-b), Array.from({length: 110}, (_,i) => i+1));
});
