#!/usr/bin/env node
/** Read-only release gate. No recursive directory scan or file mutation.
 * node scripts/verify-narrative-package.mjs
 * node scripts/verify-narrative-package.mjs --base-url https://example.com
 * node scripts/verify-narrative-package.mjs --http-only --base-url https://example.com
 */
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const options = { publicDir: resolve(root, 'dist/aliyun/learningwithrachel/public'), baseUrl: null, httpOnly: false, concurrency: 12, timeout: 15000, json: false };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help') {
    console.log('Usage: node scripts/verify-narrative-package.mjs [--public-dir PATH] [--base-url URL] [--http-only] [--concurrency N] [--timeout-ms N] [--json]\nDefaults to the Aliyun package public directory. --base-url additionally checks every required URL with GET: exact 200, no redirects, correct MIME. --http-only skips the package filesystem check.');
    process.exit(0);
  }
  if (arg === '--http-only') options.httpOnly = true;
  else if (arg === '--json') options.json = true;
  else if (['--public-dir', '--base-url', '--concurrency', '--timeout-ms'].includes(arg) && args[i + 1]) {
    const value = args[++i];
    if (arg === '--public-dir') options.publicDir = resolve(value);
    if (arg === '--base-url') options.baseUrl = value;
    if (arg === '--concurrency') options.concurrency = Number(value);
    if (arg === '--timeout-ms') options.timeout = Number(value);
  } else throw new Error(`Unknown or incomplete option: ${arg}`);
}
if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 64) throw new Error('--concurrency must be 1–64');
if (!Number.isFinite(options.timeout) || options.timeout < 1) throw new Error('--timeout-ms must be positive');
if (options.httpOnly && !options.baseUrl) throw new Error('--http-only requires --base-url');
if (options.baseUrl && !/^https?:$/.test(new URL(options.baseUrl).protocol)) throw new Error('--base-url must use HTTP or HTTPS');

const expectedCounts = [22, 42, 35, 63, 55, 31];
const sourcePublic = resolve(root, 'public');
const resources = new Map();
const failures = [];
const counts = { units: 0, deckPages: 0, storybookPages: 0, characterChapters: 0, settingChapters: 0, fonts: 0, resources: 0 };
const fail = (path, message) => failures.push({ path, message });
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const origin = 'https://narrative-package.invalid';
function add(raw, from = '/', owner = 'dependency') {
  raw = raw.trim().replaceAll('&amp;', '&');
  if (!raw || raw.startsWith('#') || /^(?:data:|blob:|javascript:|mailto:|https?:|\/\/)/i.test(raw)) return;
  const url = new URL(raw, origin + from);
  const path = decodeURIComponent(url.pathname);
  if (path.includes('\0') || path.includes('\\')) throw new Error(`Unsafe resource path: ${raw}`);
  if (!resources.has(path)) resources.set(path, { path, url: url.pathname + url.search, owner });
}
function references(text, from, owner) {
  for (const pattern of [/(?:\b(?:src|href|data|poster)|\bxlink:href)\s*=\s*["']([^"']+)["']/gi, /url\(\s*["']?([^\s"')]+)["']?\s*\)/gi, /@import\s+["']([^"']+)["']/gi]) {
    for (const match of text.matchAll(pattern)) add(match[1], from, owner);
  }
}
try {
  const manifest = await readJson(resolve(root, 'app/unitDeckSources.json'));
  for (let unit = 1; unit <= 6; unit++) {
    const meta = manifest[unit];
    if (!meta || meta.pageCount !== expectedCounts[unit - 1] || meta.sourcePages?.length !== expectedCounts[unit - 1]) throw new Error(`Unit ${unit}: unexpected selected-page manifest`);
    add(meta.dataUrl + (meta.version ? `?v=${encodeURIComponent(meta.version)}` : ''), '/', `Unit ${unit} data`);
    const deck = await readJson(resolve(sourcePublic, '.' + meta.dataUrl));
    if (deck.unit !== unit || deck.pages.length !== meta.pageCount || JSON.stringify(deck.pages.map(p => p.page)) !== JSON.stringify(meta.sourcePages)) throw new Error(`Unit ${unit}: data does not match selected-page manifest`);
    counts.units++;
    for (const page of deck.pages) {
      if (!page.art || typeof page.html !== 'string') throw new Error(`Unit ${unit} page ${page.page}: missing art/HTML`);
      counts.deckPages++;
      add(page.art, meta.dataUrl, `Unit ${unit} page ${page.page} art`);
      references(page.html, meta.dataUrl, `Unit ${unit} page ${page.page} HTML`);
    }
  }
  add('/narrative-course/decks/fonts.css', '/', 'Deck font stylesheet');
  const storybook = await readJson(resolve(root, 'app/storybookPages.json'));
  if (storybook.length !== 98 || new Set(storybook.map(p => p.page)).size !== 98 || storybook.some((p, i) => p.page !== i + 1)) throw new Error('Storybook must contain all 98 ordered pages');
  for (const page of storybook) {
    if (!page.art) throw new Error(`Storybook page ${page.page}: missing art`);
    add(page.art, '/', `Storybook page ${page.page} HTML artwork`);
    add(`/narrative-course/storybook/original/page-${String(page.page).padStart(3, '0')}.webp`, '/', `Storybook page ${page.page} original`);
    counts.storybookPages++;
  }
  for (const [name, first, last, counter] of [['character', 20, 38, 'characterChapters'], ['setting', 1, 19, 'settingChapters']]) {
    const catalog = await readJson(resolve(root, `app/${name}ReferenceCatalog.json`));
    if (catalog.length !== last - first + 1 || catalog.some((c, i) => c.id !== first + i)) throw new Error(`Unexpected ${name} chapter catalog`);
    for (const chapter of catalog) {
      const path = `/${name}-reference/chapter-${chapter.id}.json`;
      add(path, '/', `${name} chapter ${chapter.id}`);
      const data = await readJson(resolve(sourcePublic, '.' + path));
      if (data.id !== chapter.id || !data.sections?.length || !data.sections.some(s => s.entries?.length)) throw new Error(`Empty or incorrect chapter: ${path}`);
      counts[counter]++;
    }
  }
  // Follow only dependencies reachable from the selected pages and font CSS.
  // Map iteration includes newly discovered SVG/CSS references, without scanning old media.
  for (const resource of resources.values()) {
    if (['.svg', '.css', '.html'].includes(extname(resource.path).toLowerCase())) {
      references(await readFile(resolve(sourcePublic, '.' + resource.path), 'utf8'), resource.path, resource.owner);
    }
  }
  counts.fonts = [...resources.keys()].filter(path => /\.(woff2?|ttf|otf)$/i.test(path)).length;
  counts.resources = resources.size;
  if (counts.deckPages !== 248 || !counts.fonts) throw new Error('Incomplete deck page or font dependency graph');
} catch (error) { fail('source manifests', error.message); }

if (!options.httpOnly) {
  for (const resource of resources.values()) {
    const target = resolve(options.publicDir, '.' + resource.path);
    try {
      const info = await stat(target);
      if (!info.isFile() || !info.size) throw new Error('not a non-empty regular file');
      if (extname(resource.path) === '.json') {
        const packaged = await readFile(target, 'utf8');
        JSON.parse(packaged);
        const source = await readFile(resolve(sourcePublic, '.' + resource.path), 'utf8');
        if (packaged !== source) throw new Error('packaged JSON differs from current source');
      }
    } catch (error) { fail(resource.path, `Package: ${error.code || error.message}`); }
  }
}
const mimeTypes = {
  '.json': ['application/json'], '.css': ['text/css'], '.html': ['text/html'], '.svg': ['image/svg+xml'],
  '.png': ['image/png'], '.webp': ['image/webp'], '.jpg': ['image/jpeg'], '.jpeg': ['image/jpeg'], '.gif': ['image/gif'],
  '.woff2': ['font/woff2', 'application/font-woff2'], '.woff': ['font/woff', 'application/font-woff', 'application/x-font-woff'],
  '.ttf': ['font/ttf', 'application/x-font-ttf', 'application/font-sfnt'], '.otf': ['font/otf', 'application/x-font-opentype', 'application/font-sfnt'],
  '.mp4': ['video/mp4'], '.webm': ['video/webm'], '.mp3': ['audio/mpeg'], '.pdf': ['application/pdf']
};
if (options.baseUrl) {
  const pending = [...resources.values()];
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(options.concurrency, pending.length) }, async () => {
    while (index < pending.length) {
      const resource = pending[index++];
      const url = new URL(resource.url.replace(/^\//, ''), options.baseUrl.replace(/\/*$/, '/'));
      let response;
      try {
        response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(options.timeout) });
        const mime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
        const allowed = mimeTypes[extname(resource.path).toLowerCase()];
        if (response.status !== 200) throw new Error(`status ${response.status}${response.headers.get('location') ? ' → ' + response.headers.get('location') : ''}`);
        if (!allowed || !allowed.includes(mime)) throw new Error(`MIME ${mime || '(missing)'}; expected ${allowed?.join(' / ') || 'a registered asset MIME'}`);
        if (response.headers.get('content-length') === '0') throw new Error('empty response');
      } catch (error) { fail(resource.path, `HTTP: ${error.message}`); }
      finally { await response?.body?.cancel().catch(() => {}); }
    }
  }));
}
const summary = { ok: failures.length === 0, ...counts, local: !options.httpOnly, publicDir: options.httpOnly ? undefined : options.publicDir, baseUrl: options.baseUrl || undefined, failureCount: failures.length, failures: options.json ? failures : failures.slice(0, 20) };
console.log(JSON.stringify(summary, null, 2));
if (failures.length > 20 && !options.json) console.error(`${failures.length - 20} additional failures; pass --json for the full list.`);
process.exitCode = failures.length ? 1 : 0;
