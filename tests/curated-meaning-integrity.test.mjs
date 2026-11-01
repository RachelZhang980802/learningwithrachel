import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('../app/', import.meta.url));
const files = readdirSync(appDir).filter((name) => /^article.*CuratedVocabulary\.json$/.test(name));

function collectRows(value, rows = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectRows(item, rows));
  } else if (value && typeof value === 'object') {
    if (typeof value.word === 'string' && Array.isArray(value.otherMeanings)) rows.push(value);
    else Object.values(value).forEach((item) => collectRows(item, rows));
  }
  return rows;
}

function assertBalanced(text, open, close, label) {
  assert.equal([...text].filter((char) => char === open).length, [...text].filter((char) => char === close).length, label);
}

test('all curated context and supplementary meanings keep bilingual parentheses balanced', () => {
  for (const file of files) {
    const rows = collectRows(JSON.parse(readFileSync(join(appDir, file), 'utf8')));
    for (const row of rows) {
      for (const [index, item] of [[0, row], ...row.otherMeanings.map((meaning, i) => [i + 1, meaning]), ...(row.relatedSayings ?? []).map((meaning, i) => [`saying ${i + 1}`, meaning]), ...(row.relatedExpressions ?? []).map((meaning, i) => [`expression ${i + 1}`, meaning])]) {
        for (const field of ['english', 'chinese']) {
          const text = item[field] ?? '';
          const label = `${file} · ${row.word} · ${field} · ${index}`;
          if (field === 'english') assert.doesNotMatch(text, /[\u3400-\u9fff]/, label);
          assertBalanced(text, '(', ')', label);
          assertBalanced(text, '（', '）', label);
        }
      }
    }
  }
});

test('breed keeps the Oxford proverb separate from numbered meanings and labels its noun senses', () => {
  for (const [file, article, row] of [
    ['article06CuratedVocabulary.json', '06', '41'],
    ['article07CuratedVocabulary.json', '07', '71'],
  ]) {
    const entry = JSON.parse(readFileSync(join(appDir, file), 'utf8'))[article][row];
    assert.ok(entry.relatedSayings.some((item) => item.phrase === 'familiarity breeds contempt' && item.sourceUrl));
    assert.ok(entry.otherMeanings.every((item) => !item.english.startsWith('(saying)')));
    assert.ok(entry.otherMeanings.some((item) => item.english.startsWith('[noun]')));
    assert.ok(entry.otherMeanings.some((item) => item.english.startsWith('[noun, usually singular]')));
  }
});

test('dictionary sayings are kept out of numbered word senses', () => {
  for (const file of files) {
    const rows = collectRows(JSON.parse(readFileSync(join(appDir, file), 'utf8')));
    for (const row of rows) {
      assert.ok(row.otherMeanings.every((item) => !/^\(saying[,)]/i.test(item.english)), `${file} · ${row.word}`);
    }
  }
});

test('Article 07 corrected and regrouped affected dictionary meanings', () => {
  const rows = JSON.parse(readFileSync(join(appDir, 'article07CuratedVocabulary.json'), 'utf8'))['07'];
  const meaning = (row, start) => rows[row].otherMeanings.find((item) => item.english.startsWith(start));
  assert.equal(meaning('51', '[transitive, verb] disadvantage')?.chinese, '使处于不利地位；使吃亏');
  assert.equal(meaning('74', '[uncountable] (North American English) the sport')?.chinese, '（北美英语）田径运动');
  assert.equal(meaning('42', '[countable] a unit for measuring length')?.chinese, '米（长度单位，等于100厘米）');
  assert.ok(rows['69'].relatedSayings.some((item) => item.phrase === 'a watched pot never boils'));
  assert.ok(rows['73'].relatedSayings.some((item) => item.phrase === 'the die is cast'));
  assert.ok(rows['72'].relatedExpressions.some((item) => item.phrase.startsWith('get/take/have the measure')));
  assert.ok(rows['72'].otherMeanings.every((item) => !/^(unit of size|way of showing|instrument for measuring)/i.test(item.english)));
  assert.ok(rows['97'].otherMeanings.every((item) => !/^(for improving skill|action not ideas|way of doing something)/i.test(item.english)));
  assert.equal(rows['5'].otherMeanings[0].exampleChinese, '如何将25%表示成分数？');
  assert.ok(rows['46'].dictionaryExample?.english.includes('English landscape'));
  assert.equal(rows['46'].otherMeanings.some((item) => item.english.startsWith('the woods and fields')), false);
  assert.equal(rows['27'].otherMeanings.length, 0);
  assert.match(rows['27'].usage, /不用于被动语态或进行时/);
  assert.ok(rows['69'].relatedExpressions.some((item) => item.phrase === 'go to pot'));
  assert.ok(rows['69'].relatedExpressions.some((item) => item.phrase === 'in the melting pot'));
  assert.ok(rows['82'].relatedExpressions.some((item) => item.phrase === 'in the extreme'));
  assert.ok(rows['11'].relatedExpressions.some((item) => item.phrase === 'win/earn your spurs'));
  assert.ok(rows['53'].relatedExpressions.some((item) => item.phrase.startsWith('take issue with')));
  assert.ok(rows['77'].relatedExpressions.some((item) => item.phrase.startsWith('into the bargain')));
  assert.equal(rows['74'].otherMeanings.find((item) => item.english.startsWith('[intransitive] to stay at the same level'))?.chinese, '在一段时间内保持同一水平；维持稳定');
  assert.equal(rows['53'].otherMeanings.find((item) => item.english.startsWith('[uncountable] the act of formally making'))?.chinese, '（信息、声明等的）公布；正式发布');
});
