import { createBookTranslation } from './book-translation.js?v=20261111-bookmark';

const allowedBooks = new Set(['good-writing', 'college-writing', 'descriptosaurus']);
const id = new URLSearchParams(location.search).get('book') || 'good-writing';
const $ = selector => document.querySelector(selector);
const reader = $('#reader');
const pdfSpread = $('#pdf-spread');
const flowWindow = $('#epub-window');
const flow = $('#epub-content');
const controls = $('#reading-controls');
const pageInput = $('#page-number');
const pageTotal = $('#page-total');
const bookmark = createBookTranslation(reader);
const contents = $('#book-contents');
const scrim = $('#contents-backdrop');
const zooms = [.85, 1, 1.15, 1.35, 1.6, 2];
controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
let book;
let currentPage = 1;
let totalPages = 1;
let columns = 2;
let zoomIndex = 1;
let hideTimer;
let resizeTimer;
let initialized = false;
let flowStep = 0;
let touchStart;

function savedProgress() {
  try { return JSON.parse(localStorage.getItem(`writing-library-${id}`) || '{}'); }
  catch { return {}; }
}

function remember() {
  try { localStorage.setItem(`writing-library-${id}`, JSON.stringify({page: currentPage, columns, zoomIndex})); }
  catch { /* Reading works when browser storage is unavailable. */ }
}

function pageFromHash() {
  const match = location.hash.match(/^#\/page\/(\d+)$/);
  return match ? Number(match[1]) : (savedProgress().page || 1);
}

function normalizedPage(number) {
  const clamped = Math.min(totalPages, Math.max(1, Math.trunc(Number(number) || 1)));
  if (columns === 2 && totalPages > 1 && totalPages % 2 && clamped >= totalPages - 1) return totalPages - 1;
  return columns === 2 ? clamped - (clamped - 1) % 2 : clamped;
}

function turnPage(direction) {
  const step = columns === 2 && currentPage % 2 === 0 && direction < 0 ? 1 : columns;
  goPage(currentPage + direction * step);
}

function visibleAnchor() {
  return bookmark.currentId || flow.querySelector('[data-sentence][aria-hidden="false"]')?.dataset.sentence;
}

function pageAtAnchor(sentenceId) {
  const element = sentenceId && flow.querySelector('[data-sentence="' + sentenceId + '"]');
  return element ? 1 + Math.floor((element.getClientRects()[0].left - flow.getBoundingClientRect().left) / flowStep + .0001) : currentPage;
}

function showControls() {
  document.body.dataset.controls = 'visible';
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => { document.body.dataset.controls = 'hidden'; }, 2600);
}

async function readBook() {
  const response = await fetch('library/' + id + '/book.json', {credentials: 'same-origin'});
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('这本书暂时无法打开，请刷新后再试。');
  }
  const data = await response.json();
  const units = Object.values(data.sentences || {});
  if (data.id !== id || !units.length || units.some(unit => !unit.en?.trim() || !unit.zh?.trim())) {
    throw new Error('这本书的中文释义还未准备完整。');
  }
  return data;
}

function showTranslation(sentenceId, button, event) {
  const sentence = book?.sentences[sentenceId];
  if (sentence) bookmark.toggle({...sentence, id: sentenceId}, button, event);
}

function createZones(units) {
  const layer = document.createElement('div');
  layer.className = 'page-zones';
  for (const unit of units || []) {
    const sentence = book.sentences[unit.id];
    if (!sentence) continue;
    unit.boxes.forEach((box, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'page-sentence';
      button.dataset.sentence = unit.id;
      button.dataset.bookTranslationKey = unit.id;
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', sentence.en);
      button.setAttribute('aria-haspopup', 'dialog');
      if (index) button.tabIndex = -1;
      button.dataset.firstFragment = String(index === 0);
      const [x, y, w, h] = box;
      button.style.left = `${100 * x}%`;
      button.style.top = `${100 * y}%`;
      button.style.width = `${100 * Math.min(w, 1 - x)}%`;
      button.style.height = `${100 * Math.min(h, 1 - y)}%`;
      layer.append(button);
    });
  }
  return layer;
}

function updateNavigation() {
  $('#previous').setAttribute('aria-label', columns === 2 ? 'Previous two pages' : 'Previous page');
  $('#next').setAttribute('aria-label', columns === 2 ? 'Next two pages' : 'Next page');
  pageInput.value = currentPage;
  pageInput.max = totalPages;
  pageTotal.textContent = totalPages;
  const last = Math.min(totalPages, currentPage + columns - 1);
  $('#page-status').textContent = currentPage === last ? `Page ${currentPage} of ${totalPages}` : `Pages ${currentPage}–${last} of ${totalPages}`;
  $('#previous').disabled = currentPage <= 1;
  $('#next').disabled = last >= totalPages;
  $('#zoom-out').disabled = zoomIndex === 0;
  $('#zoom-in').disabled = zoomIndex === zooms.length - 1;
  document.title = `${book.title} · ${currentPage}–${last}`;
  let active;
  if (book.format === 'pdf') active = book.toc.filter(entry => entry.page <= currentPage).at(-1)?.page;
  document.querySelectorAll('.chapter-link').forEach(link => {
    if (Number(link.dataset.page) === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  remember();
}

function renderPdf() {
  pdfSpread.replaceChildren();
  const pages = book.pages.slice(currentPage - 1, currentPage - 1 + columns);
  pdfSpread.style.setProperty('--columns', pages.length);
  pdfSpread.style.setProperty('--pdf-aspect', Math.max(...pages.map(page => page.height / page.width)));
  pdfSpread.style.setProperty('--pdf-zoom', zooms[zoomIndex]);
  for (const page of pages) {
    const number = page.number;
    const figure = document.createElement('figure');
    figure.className = 'pdf-page';
    figure.dataset.page = number;
    const image = new Image();
    image.src = `library/${id}/${page.image}`;
    image.alt = `${book.title}, original page ${number}`;
    image.width = page.width;
    image.height = page.height;
    image.fetchPriority = 'high';
    figure.append(image, createZones(page.units));
    pdfSpread.append(figure);
  }
  reader.scrollTo({left: 0, top: 0});
  const upcoming = book.pages[currentPage + columns - 1];
  if (upcoming) new Image().src = `library/${id}/${upcoming.image}`;
}

function measureFlow() {
  const baseFont = innerWidth <= 600 ? 15 : innerWidth <= 1000 ? 17 : 19;
  flow.style.fontSize = `${baseFont * zooms[zoomIndex]}px`;
  flow.style.setProperty('--columns', columns);
  flowWindow.classList.toggle('is-single', columns === 1);
  flow.style.transform = '';
  const gap = parseFloat(getComputedStyle(flow).columnGap);
  flowStep = (flow.getBoundingClientRect().width + gap) / columns;
  totalPages = Math.max(1, Math.round((flow.scrollWidth + gap) / flowStep));
}

function goPage(number, updateHash = true) {
  if (!book) return;
  bookmark.close();
  currentPage = normalizedPage(number);
  if (book.format === 'pdf') renderPdf();
  else {
    flow.style.transform = `translateX(-${(currentPage - 1) * flowStep}px)`;
    const view = $('#epub-viewport').getBoundingClientRect();
    for (const node of flow.querySelectorAll('[data-sentence]')) {
      const visible = [...node.getClientRects()].some(rect => rect.right > view.left + 5 && rect.left < view.right - 5 && rect.bottom > view.top && rect.top < view.bottom);
      node.tabIndex = visible && node.dataset.firstFragment !== 'false' ? 0 : -1;
      node.setAttribute('aria-hidden', String(!visible));
    }
    flowWindow.scrollLeft = 0;
  }
  if (updateHash) history.replaceState(null, '', `#/page/${currentPage}`);
  updateNavigation();
}

function openContents() {
  bookmark.close();
  contents.hidden = false;
  scrim.hidden = false;
  $('#contents-toggle').setAttribute('aria-expanded', 'true');
  $('#contents-close').focus();
}

function closeContents() {
  contents.hidden = true;
  scrim.hidden = true;
  $('#contents-toggle').setAttribute('aria-expanded', 'false');
}

function renderContents() {
  $('#contents-book').textContent = book.title;
  const list = $('#chapters');
  for (const entry of book.toc) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chapter-link';
    button.textContent = entry.title;
    button.dataset.level = entry.level;
    if (entry.page) button.dataset.page = entry.page;
    button.addEventListener('click', () => {
      let page = entry.page;
      if (book.format === 'epub') {
        const chapter = document.getElementById(entry.chapter);
        const rect = chapter.getClientRects()[0];
        page = 1 + Math.round((rect.left - flow.getBoundingClientRect().left) / flowStep);
      }
      closeContents();
      goPage(page);
      showControls();
      $('#contents-toggle').focus({preventScroll: true});
    });
    list.append(button);
  }
}

async function initialize() {
  if (!allowedBooks.has(id)) throw new Error('This book could not be found.');
  book = await readBook();
  const saved = savedProgress();
  columns = saved.columns === 1 ? 1 : 2;
  zoomIndex = Number.isInteger(saved.zoomIndex) ? Math.max(0, Math.min(zooms.length - 1, saved.zoomIndex)) : 1;
  if (book.format === 'pdf') {
    totalPages = book.pageCount;
    pdfSpread.hidden = false;
  } else {
    flow.innerHTML = book.chapters.map(chapter => `<section class="epub-chapter" id="${chapter.id}" aria-label="${chapter.title.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">${chapter.html}</section>`).join('');
    for (const trigger of flow.querySelectorAll('[data-sentence]')) {
      trigger.dataset.bookTranslationKey = trigger.dataset.sentence;
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
    }
    for (const figure of flow.querySelectorAll('[data-image]')) {
      const info = book.images[figure.dataset.image];
      const image = figure.querySelector('img');
      image.width = info.width;
      image.height = info.height;
      if (!info.fullPage) image.style.maxHeight = (info.heightEm || 2) + 'em';
      const box = document.createElement('div');
      box.className = 'epub-art__box';
      box.append(image, createZones(info.units));
      figure.replaceChildren(box);
    }
    flowWindow.hidden = false;
    await Promise.all([...flow.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
    await document.fonts.ready;
    measureFlow();
  }
  $('#loading').hidden = true;
  reader.setAttribute('aria-busy', 'false');
  controls.querySelectorAll('button').forEach(button => { button.disabled = false; });
  $('#page-mode').setAttribute('aria-pressed', String(columns === 2));
  $('#page-mode').setAttribute('aria-label', `Switch to ${columns === 2 ? 'one' : 'two'}-page view`);
  renderContents();
  goPage(pageFromHash());
  initialized = true;
  showControls();
}

reader.addEventListener('click', event => {
  const target = event.target.closest('[data-sentence]');
  if (target) {
    event.stopPropagation();
    showTranslation(target.dataset.sentence, target, event);
  } else {
    bookmark.close();
    showControls();
  }
});
reader.addEventListener('keydown', event => {
  if (!['Enter', ' '].includes(event.key)) return;
  const target = event.target.closest('.book-sentence[role=button]');
  if (target) { event.preventDefault(); showTranslation(target.dataset.sentence, target, event); }
});
$('#contents-toggle').addEventListener('click', openContents);
$('#contents-close').addEventListener('click', () => { closeContents(); $('#contents-toggle').focus(); });
scrim.addEventListener('click', closeContents);
$('#previous').addEventListener('click', () => turnPage(-1));
$('#next').addEventListener('click', () => turnPage(1));
$('#page-form').addEventListener('submit', event => { event.preventDefault(); goPage(pageInput.value); });
$('#page-mode').addEventListener('click', () => {
  const anchor = book.format === 'epub' ? visibleAnchor() : null;
  columns = columns === 2 ? 1 : 2;
  $('#page-mode').setAttribute('aria-pressed', String(columns === 2));
  $('#page-mode').setAttribute('aria-label', `Switch to ${columns === 2 ? 'one' : 'two'}-page view`);
  if (book.format === 'epub') { measureFlow(); currentPage = pageAtAnchor(anchor); }
  goPage(currentPage);
  showControls();
});
function zoom(direction) {
  const anchor = book.format === 'epub' ? visibleAnchor() : null;
  zoomIndex = Math.min(zooms.length - 1, Math.max(0, zoomIndex + direction));
  if (book.format === 'epub') {
    measureFlow();
    currentPage = pageAtAnchor(anchor);
  }
  goPage(currentPage);
  showControls();
}
$('#zoom-in').addEventListener('click', () => zoom(1));
$('#zoom-out').addEventListener('click', () => zoom(-1));
$('#fullscreen').addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { /* The normal reader already fills the available browser window. */ }
});
controls.addEventListener('pointermove', showControls);
controls.addEventListener('focusin', showControls);
document.addEventListener('pointermove', event => { if (event.clientY > innerHeight - 90) showControls(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Tab') showControls();
  if (event.key === 'Escape') { if (!contents.hidden) { closeContents(); $('#contents-toggle').focus(); } return; }
  if (!contents.hidden && event.key === 'Tab') {
    const focusable = [...contents.querySelectorAll('button')];
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  }
  if (!initialized || !contents.hidden || event.target.closest('input,textarea,select') || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); turnPage(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); turnPage(-1); }
});
reader.addEventListener('touchstart', event => { if (event.touches.length === 1) touchStart = [event.touches[0].clientX, event.touches[0].clientY]; }, {passive: true});
reader.addEventListener('touchend', event => {
  if (!touchStart || !event.changedTouches.length || zooms[zoomIndex] > 1) return;
  const dx = event.changedTouches[0].clientX - touchStart[0];
  const dy = event.changedTouches[0].clientY - touchStart[1];
  touchStart = null;
  if (Math.abs(dx) > 80 && Math.abs(dy) < 45) turnPage(dx < 0 ? 1 : -1);
}, {passive: true});
window.addEventListener('hashchange', () => { if (initialized) goPage(pageFromHash(), false); });
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (!initialized) return; const anchor = book.format === 'epub' ? visibleAnchor() : null; if (book.format === 'epub') { measureFlow(); currentPage = pageAtAnchor(anchor); } goPage(currentPage); }, 120);
});
initialize().catch(error => { $('#loading').textContent = error.message; reader.setAttribute('aria-busy', 'false'); });
