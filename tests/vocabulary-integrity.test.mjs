import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const workbook = JSON.parse(readFileSync(new URL('../app/article01Vocabulary.json', import.meta.url)));
test('all 56 supplied rows retain their sentence mapping', () => {
  assert.equal(workbook.records.length, 56);
  assert.deepEqual(workbook.records.map(r => r.sourceRow), Array.from({length:56}, (_,i)=>i+2));
  for (const row of workbook.records) {
    assert.ok(row.sentence >= 1 && row.sentence <= 40);
    assert.equal(row.paragraph, [3,16,25,36,40].findIndex(end=>row.sentence<=end)+1);
  }
});
test('all 45 pictures are byte-identical to the workbook media', () => {
  const images = workbook.records.filter(row => row.image);
  assert.equal(images.length,45);
  for (const row of images) {
    const bytes = readFileSync(new URL('../public'+row.image, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),row.imageSha256);
  }
});
test('example and dictionary fields are retained for every row', () => {
  for (const row of workbook.records) {
    assert.equal(typeof row.examples,'string');
    assert.equal(typeof row.dictionarySource,'string');
  }
  assert.ok(workbook.records[1].examples.includes('keep things in proportion'));
});
