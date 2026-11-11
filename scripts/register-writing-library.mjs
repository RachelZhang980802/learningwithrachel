import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'public/narrative-course/books');
const id = process.argv[2];
const local = process.argv.includes('--local-source');
const allowed = new Map([['good-writing', null], ['college-writing', 817], ['descriptosaurus', 526]]);
if (!allowed.has(id)) throw new Error('Select one of the three supplied books.');
const directory = path.join(base, 'library', id);
const filePath = local ? path.join(root, '.local-preview/writing-library', id + '-source.json') : path.join(directory, 'book.json');
const book = JSON.parse(fs.readFileSync(filePath, 'utf8'));
for (const [key, sentence] of Object.entries(book.sentences)) {
  if (!sentence.en?.trim() || (!local && !sentence.zh?.trim())) throw new Error('Incomplete sentence: ' + key);
}
if (allowed.get(id) && book.pages.length !== allowed.get(id)) throw new Error('Incomplete page set.');
if (!allowed.get(id) && book.chapters.length !== 50) throw new Error('Incomplete EPUB spine.');
const cover = path.join(directory, book.cover);
if (!fs.statSync(cover).size) throw new Error('Missing cover.');
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const size = book.format === 'epub' ? Object.values(book.images).find(image => image.src === book.cover) : book.pages[0];
const link = 'reader.html?book=' + id;
const file = path.join(base, 'landing.html');
let source = fs.readFileSync(file, 'utf8');
if (!source.includes('href="' + link + '"')) {
  const card = [
    '        <a class="book-card" href="' + link + '" aria-label="Read ' + escape(book.title) + '">',
    '          <span class="book-card__image"><img src="library/' + id + '/' + escape(book.cover) + '" alt="Cover of ' + escape(book.title) + '" width="' + Math.round(size.width) + '" height="' + Math.round(size.height) + '" loading="lazy"></span>',
    '          <span class="book-card__caption"><strong>' + escape(book.title) + '</strong><small>' + escape(book.author) + ' · Read the book <span aria-hidden="true">↗</span></small></span>',
    '        </a>',
  ].join('\n');
  const pattern = /(<div class="book-grid">[\s\S]*?)(\n      <\/div>)/;
  if (!pattern.test(source)) throw new Error('The bookshelf could not be located.');
  source = source.replace(pattern, (_, start, end) => start + '\n' + card + end);
}
const count = [...source.matchAll(/class="book-card"/g)].length;
const word = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'][count];
source = source.replace(/(?:Two|Three|Four|Five) books for finding ideas/, word + ' books for finding ideas');
source = source.replace(/Explore (?:two|three|four|five) books/, 'Explore ' + word.toLowerCase() + ' books');
fs.writeFileSync(file, source);
console.log(JSON.stringify({registered: id, booksOnShelf: count, sentenceUnits: Object.keys(book.sentences).length}));
