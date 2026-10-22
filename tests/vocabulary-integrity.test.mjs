import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const workbook = JSON.parse(readFileSync(new URL('../app/article01Vocabulary.json', import.meta.url)));
const rows = workbook.records;

test('all 60 current Article 01 cards retain unique source and sentence mappings', () => {
  assert.equal(rows.length, 60);
  assert.equal(new Set(rows.map(row => row.sourceRow)).size, rows.length);
  for (const row of rows) {
    assert.ok(row.sentence >= 1 && row.sentence <= 40, row.word);
    assert.equal(row.paragraph, [3, 16, 25, 36, 40].findIndex(end => row.sentence <= end) + 1, row.word);
  }
});

test('all 57 Article 01 picture references have a valid location; available fingerprints are checked', () => {
  const images = rows.filter(row => row.image);
  assert.equal(images.length, 57);
  for (const row of images) {
    if (row.imageSha256) assert.match(row.imageSha256, /^[0-9a-f]{64}$/, row.word);
    if (/^https?:\/\//.test(row.image)) {
      assert.match(row.image, /^https:\/\/assets\.negentropylearning\.com\.cn\/vocabulary\/article01-excel\//, row.word);
      continue;
    }
    const local = new URL('../public' + row.image, import.meta.url);
    assert.ok(existsSync(local), row.word);
    if (row.imageSha256) assert.equal(createHash('sha256').update(readFileSync(local)).digest('hex'), row.imageSha256, row.word);
  }
});

test('definitions, examples, and dictionary references are retained for every card', () => {
  for (const row of rows) {
    assert.ok(row.word && row.definition && row.definitionEn && row.supplementation, row.word);
    assert.equal(typeof row.examples, 'string', row.word);
    assert.match(row.dictionarySource, /^https:\/\//, row.word);
  }
  assert.ok(rows.find(row => row.word === 'proportion')?.examples.includes('proportion'));
});
