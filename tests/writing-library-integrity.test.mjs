import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'public/narrative-course/books');
const expected = {'good-writing': null, 'college-writing': 817, 'descriptosaurus': 526};

const unitCounts = {'good-writing': 2752, 'college-writing': 22157, 'descriptosaurus': 13248};

for (const [id, pageCount] of Object.entries(expected)) {
  test(id + ': all originals and sentence click targets are complete', () => {
    const directory = path.join(base, 'library', id);
    const edition = path.join(directory, 'book.json');
    const book = JSON.parse(readFileSync(edition, 'utf8'));
    assert.equal(book.id, id);
    assert.equal(Object.keys(book.sentences).length, unitCounts[id]);
    assert.equal(book.translation.unitCount, unitCounts[id]);
    const source = path.join(root, '.local-preview/writing-library', id + '-source.json');
    if (existsSync(source)) {
      const original = JSON.parse(readFileSync(source, 'utf8'));
      assert.deepEqual(book.pages, original.pages, 'Original page order or click positions changed');
      assert.deepEqual(book.chapters, original.chapters, 'EPUB chapter content changed');
      assert.deepEqual(book.toc, original.toc, 'Table of contents changed');
      assert.deepEqual(Object.keys(book.sentences), Object.keys(original.sentences), 'English units changed');
      for (const [key, unit] of Object.entries(original.sentences)) {
        assert.equal(book.sentences[key].en, unit.en, key);
        assert.equal(book.sentences[key].context, unit.context, key);
      }
    }
    const referenced = new Set();
    function checkUnits(units) {
      for (const unit of units) {
        assert.ok(book.sentences[unit.id], `Missing sentence ${unit.id}`);
        referenced.add(unit.id);
        assert.ok(unit.boxes.length);
        for (const box of unit.boxes) {
          assert.equal(box.length, 4);
          assert.ok(box.every(Number.isFinite));
          const [x, y, w, h] = box;
          assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0, `${unit.id}: invalid rectangle`);
          assert.ok(x + w <= 1.00001 && y + h <= 1.00001, `${unit.id}: rectangle leaves the page`);
        }
      }
    }
    if (pageCount) {
      assert.equal(book.pages.length, pageCount);
      assert.equal(book.pageCount, pageCount);
      for (const [index, page] of book.pages.entries()) {
        assert.equal(page.number, index + 1);
        assert.ok(page.width > 0 && page.height > 0);
        assert.ok(statSync(path.join(directory, page.image)).size > 32);
        checkUnits(page.units);
      }
    } else {
      assert.equal(book.chapters.length, 50);
      const rules = book.chapters.filter(chapter => /^Rule \d+:/.test(chapter.title));
      assert.equal(rules.length, 36);
      assert.deepEqual(rules.map(chapter => Number(chapter.title.match(/^Rule (\d+)/)[1])), Array.from({length: 36}, (_, index) => index + 1));
      for (const chapter of book.chapters) {
        assert.ok(chapter.html.trim());
        for (const match of chapter.html.matchAll(/data-sentence="([^"]+)"/g)) referenced.add(match[1]);
      }
      for (const image of Object.values(book.images)) {
        assert.ok(existsSync(path.join(directory, image.src)));
        checkUnits(image.units);
      }
    }
    assert.deepEqual([...referenced].sort(), Object.keys(book.sentences).sort());
    for (const [key, sentence] of Object.entries(book.sentences)) {
      assert.equal(typeof sentence.en, 'string', key);
      assert.ok(sentence.en.trim(), key);
      assert.ok(!/[\uE000-\uF8FF\uFFFD]/u.test(sentence.en), `Unresolved OCR glyph in ${key}`);
      assert.equal(typeof sentence.zh, 'string', `No saved Chinese for ${key}`);
      assert.ok(sentence.zh.trim(), `Empty Chinese for ${key}`);
      assert.ok(!/^(TODO|TBD|待补充|正在翻译|翻译暂不可用)[。.！!…\s]*$/u.test(sentence.zh), `Unfinished translation for ${key}`);
    }
    if (id === 'descriptosaurus') {
      const sentences = Object.values(book.sentences);
      const flat = sentences.filter(unit => unit.en === 'flat');
      assert.ok(flat.some(unit => unit.context === 'Buildings · Nouns'));
      assert.ok(flat.some(unit => unit.context === 'Roads · Adjectives'));
      assert.ok(sentences.some(unit => unit.en === 'Use them repeatedly in context to understand how to use them appropriately.'));
      assert.equal(flat.find(unit => unit.context === 'Buildings · Nouns').zh, '公寓');
      assert.equal(flat.find(unit => unit.context === 'Roads · Adjectives').zh, '平坦的');
      const term = (en, context) => sentences.find(unit => unit.en.toLowerCase() === en && unit.context === context)?.zh;
      assert.equal(term('current', 'Streams, rivers, lakes and waterfalls · Nouns'), '水流');
      assert.equal(term('swell', 'Sea and waves · Nouns'), '涌浪');
      assert.equal(term('bark', 'Smell and sound · Nouns'), '吠叫声');
      assert.equal(term('vivaciously', 'Adverbs · Adverbs'), '活泼地');
      assert.ok(!sentences.some(unit => unit.page >= 367 && unit.context?.startsWith('Pain · ')));
    }
  });
}

test('the bookshelf contains all five working book entrances', () => {
  const shelf = readFileSync(path.join(base, 'landing.html'), 'utf8');
  assert.equal([...shelf.matchAll(/class="book-card"/g)].length, 5);
  for (const id of Object.keys(expected)) assert.ok(shelf.includes(`reader.html?book=${id}`), id);
});

test('reviewed writing terms and quotations retain their intended meanings', () => {
  const book = JSON.parse(readFileSync(path.join(base, 'library/good-writing/book.json'), 'utf8'));
  const byEnglish = new Map(Object.values(book.sentences).map(sentence => [sentence.en, sentence.zh]));
  assert.match(byEnglish.get('Easy reading is damn hard writing.'), /写起来.*难/);
  assert.match(byEnglish.get('Rule 26: Show, Then Tell'), /先展示.*再讲述/);
  assert.match(byEnglish.get('Rule 33: Write the Hard Stuff'), /难写/);
  assert.match(byEnglish.get('Rule 36: Worship (Talented) Editors'), /敬重.*编辑/);
});


for (const [id, file, pages] of [
  ['storybook', path.join(root, 'app/storybookTranslationUnits.json'), 98],
  ['writing-1', path.join(base, 'writing-1-translations.json'), 249],
]) {
  test(id + ': every bookmark has a saved translation and a valid position', () => {
    const edition = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(edition.length, pages);
    const ids = new Set();
    const byEnglish = new Map();
    for (const [index, page] of edition.entries()) {
      assert.equal(page.page, index + 1);
      for (const {id, en, zh, boxes} of page.units) {
        assert.ok(id && !ids.has(id));
        ids.add(id);
        assert.ok(en.trim() && zh.trim());
        assert.ok(!/^(?:TODO|TBD|待补充|正在翻译|翻译暂不可用)[。.！!…\s]*$/u.test(zh));
        assert.ok(boxes.length);
        for (const box of boxes) {
          const [x, y, w, h] = box;
          assert.ok(box.length === 4 && box.every(Number.isFinite));
          assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.00001 && y + h <= 1.00001);
        }
        byEnglish.set(en, {zh, boxes});
      }
    }
    assert.ok(ids.size >= (id === 'storybook' ? 1000 : 6500));
    if (id === 'storybook') {
      assert.equal(byEnglish.get('Write Your Own Story Book').boxes.length, 4);
      assert.equal(byEnglish.get('All stories need a beginning, a middle and an end.').zh, '所有故事都需要开头、中段和结尾。');
    } else {
      assert.equal(byEnglish.get('The Necklace').zh, '《项链》');
      assert.equal(byEnglish.get('"When I honk, the race will begin."').zh, '“我一叫，比赛就开始。”');
    }
  });
}
