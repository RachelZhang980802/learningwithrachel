import { createBookTranslation } from './book-translation.js?v=20261111-bookmark';
import { answersByPage } from './writing-1-answers.js?v=20261111-inline-answers';
import { answerPlacements } from './writing-1-answer-placements.js?v=20261111-inline-answers';

const PAGE_COUNT = 249;
const pageImage = document.querySelector('#page-image');
const leftImage = document.querySelector('#left-image');
const leftPage = document.querySelector('#left-page');
const spread = document.querySelector('#book-spread');
const wideScreen = window.matchMedia('(min-width: 1050px)');
const pageInput = document.querySelector('#page-number');
const pageStatus = document.querySelector('#page-status');
const stage = document.querySelector('#reader-stage');
const contents = document.querySelector('#book-contents');
const scrim = document.querySelector('#contents-scrim');
const contentsButtons = [document.querySelector('#contents-toggle'), document.querySelector('#contents-edge')];
const previousButtons = [document.querySelector('#previous-page'), document.querySelector('#bottom-previous')];
const nextButtons = [document.querySelector('#next-page'), document.querySelector('#bottom-next')];
const zoomLevels = [0, 1.25, 1.5, 2];
let zoomIndex = 0;
let currentPage = 1;
let visiblePages = [1];
let ocrData = null;
let ocrLoading = null;
const ocrPanel = document.querySelector('#ocr-panel');
const ocrBackdrop = document.querySelector('#ocr-backdrop');
const ocrMessage = document.querySelector('#ocr-message');
const ocrPageText = document.querySelector('#ocr-page-text');
const ocrResults = document.querySelector('#ocr-results');
const ocrSearchInput = document.querySelector('#ocr-search-input');
const leftClickLayer = document.querySelector('#left-click-layer');
const rightClickLayer = document.querySelector('#right-click-layer');
const leftAnswerLayer = document.querySelector('#left-answer-layer');
const rightAnswerLayer = document.querySelector('#right-answer-layer');
const bookmark = createBookTranslation(spread);
const answerMeasure = document.createElement('canvas').getContext('2d');
let translationPages = null;
let selectedAnswer = null;

function pagePath(page) {
  return `writing-1-pages/page-${String(page).padStart(3, '0')}.jpg`;
}

function pageFromHash() {
  const match = location.hash.match(/^#\/page\/(\d+)$/);
  if (!match) return 1;
  return Math.min(PAGE_COUNT, Math.max(1, Number(match[1])));
}

function navigate(page) {
  const next = Math.min(PAGE_COUNT, Math.max(1, Number(page) || 1));
  if (location.hash === `#/page/${next}`) return;
  location.hash = `#/page/${next}`;
}

function spreadStart(page) {
  return page === 1 ? 1 : page % 2 === 0 ? page : page - 1;
}

function turnPage(direction) {
  if (!wideScreen.matches) return navigate(currentPage + direction);
  const start = spreadStart(currentPage);
  navigate(direction < 0 ? (start <= 2 ? 1 : start - 2) : (start === 1 ? 2 : start + 2));
}

function closeContents() {
  contents.classList.remove('is-open');
  contents.inert = true;
  scrim.hidden = true;
  contentsButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function openContents() {
  bookmark.close();
  closeAnswer();
  contents.classList.add('is-open');
  contents.inert = false;
  scrim.hidden = false;
  contentsButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));
}

function renderPage() {
  bookmark.close();
  closeAnswer();
  currentPage = pageFromHash();
  const start = spreadStart(currentPage);
  const leftNumber = wideScreen.matches && start > 1 ? start : null;
  const rightNumber = wideScreen.matches && start > 1 ? start + 1 : currentPage;
  visiblePages = leftNumber ? [leftNumber, rightNumber] : [rightNumber];
  leftPage.classList.toggle('is-blank', !leftNumber);
  leftImage.hidden = !leftNumber;
  if (leftNumber) {
    leftImage.src = pagePath(leftNumber);
    leftImage.alt = `Original book page ${leftNumber} of ${PAGE_COUNT}`;
  } else {
    leftImage.removeAttribute('src');
  }
  pageImage.src = pagePath(rightNumber);
  pageImage.alt = `Original book page ${rightNumber} of ${PAGE_COUNT}`;
  pageInput.value = currentPage;
  pageStatus.textContent = visiblePages.length === 2 ? `Pages ${visiblePages[0]}–${visiblePages[1]} of ${PAGE_COUNT}` : `Page ${rightNumber} of ${PAGE_COUNT}`;
  document.title = `${pageStatus.textContent} · Writing Critically 1`;
  previousButtons.forEach(button => button.disabled = start === 1);
  nextButtons.forEach(button => button.disabled = wideScreen.matches ? rightNumber >= PAGE_COUNT : currentPage === PAGE_COUNT);
  const chapterLinks = [...document.querySelectorAll('.contents-panel nav a')];
  const currentChapter = chapterLinks.filter(link => Number(link.dataset.page) <= currentPage).at(-1);
  chapterLinks.forEach(link => {
    const active = link === currentChapter;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const prefetchBefore = wideScreen.matches ? start - 2 : currentPage - 1;
  const prefetchAfter = wideScreen.matches ? rightNumber + 1 : currentPage + 1;
  if (prefetchBefore >= 1) new Image().src = pagePath(prefetchBefore);
  if (prefetchAfter <= PAGE_COUNT) new Image().src = pagePath(prefetchAfter);
  stage.scrollTo(0, 0);
  window.scrollTo(0, 0);
  closeContents();
  if (!ocrPanel.hidden) renderOcrPage();
  renderClickZones();
  renderAnswerZones();
}

function renderZoom() {
  closeAnswer();
  const zoom = zoomLevels[zoomIndex];
  spread.style.width = zoom ? `${Math.round((wideScreen.matches ? 1520 : 1080) * zoom)}px` : '';
  document.querySelector('#zoom-level').textContent = zoom ? `${Math.round(zoom * 100)}%` : 'Fit';
  document.querySelector('#zoom-out').disabled = zoomIndex === 0;
  document.querySelector('#zoom-in').disabled = zoomIndex === zoomLevels.length - 1;
}

function closeOcr() {
  ocrPanel.hidden = true;
  ocrBackdrop.hidden = true;
  document.querySelector('#ocr-toggle').setAttribute('aria-expanded', 'false');
}

function renderClickLayer(layer, pageNumber) {
  layer.replaceChildren();
  if (!translationPages || !pageNumber) return;
  for (const unit of translationPages[pageNumber - 1]?.units ?? []) {
    unit.boxes.forEach(([x, y, width, height], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'page-click-zone';
      button.dataset.bookTranslationKey = unit.id;
      button.style.left = (x * 100) + '%';
      button.style.top = (y * 100) + '%';
      button.style.width = (width * 100) + '%';
      button.style.height = (height * 100) + '%';
      button.setAttribute('aria-label', unit.en);
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-expanded', 'false');
      if (index) button.tabIndex = -1;
      button.addEventListener('click', event => {
        closeAnswer();
        bookmark.toggle(unit, button, event);
      });
      layer.append(button);
    });
  }
}

function renderClickZones() {
  renderClickLayer(leftClickLayer, visiblePages.length === 2 ? visiblePages[0] : null);
  renderClickLayer(rightClickLayer, visiblePages.at(-1));
}

function clearAnswerExtension(sheet) {
  if (!sheet.hasAttribute('data-answer-cut')) return;
  sheet.removeAttribute('data-answer-cut');
  sheet.style.removeProperty('--answer-cut');
  sheet.style.removeProperty('--answer-extra');
  sheet.querySelector('.page-answer-image-tail').remove();
  sheet.querySelectorAll('[data-answer-shifted]').forEach(el => el.removeAttribute('data-answer-shifted'));
}

function closeAnswer(restoreFocus = false) {
  if (!selectedAnswer) return;
  const { flag, sheet, writing } = selectedAnswer;
  selectedAnswer = null;
  clearAnswerExtension(sheet);
  writing.remove();
  flag.setAttribute('aria-expanded', 'false');
  flag.removeAttribute('aria-controls');
  if (restoreFocus && flag.isConnected) flag.focus({ preventScroll: true });
}

function extendAnswer(sheet, writing, cut, remaining, margin) {
  const continuation = document.createElement('p');
  continuation.className = 'page-answer-continuation';
  continuation.setAttribute('aria-hidden', 'true');
  continuation.style.setProperty('--answer-left', `${margin[0]}%`);
  continuation.style.setProperty('--answer-right', `${100 - margin[1]}%`);
  const ruledText = document.createElement('span');
  ruledText.textContent = remaining;
  continuation.append(ruledText);
  writing.append(continuation);

  // Open a ruled space between parts of the same scan. Keep the text and
  // flag hit targets below that space aligned with the moved image.
  const original = sheet.querySelector('.book-page-original');
  const tail = original.cloneNode();
  tail.removeAttribute('id');
  tail.className = 'page-answer-image-tail';
  tail.alt = '';
  tail.setAttribute('aria-hidden', 'true');
  original.after(tail);
  sheet.dataset.answerCut = '';
  sheet.style.setProperty('--answer-cut', `${cut}%`);
  sheet.style.setProperty('--answer-extra', `${continuation.offsetHeight}px`);
  for (const target of sheet.querySelectorAll('.page-click-zone, .page-answer-flag')) {
    const center = Number.parseFloat(target.style.top) + (Number.parseFloat(target.style.height) || 0) / 2;
    if (center > cut) target.dataset.answerShifted = '';
  }
}

function fillAnswerLine(sheet, writing, [left, baseline, width], remaining, fitSingleLine) {
  const line = document.createElement('span');
  line.className = 'page-answer-line';
  line.setAttribute('aria-hidden', 'true');
  line.style.left = `${left}%`;
  line.style.top = `${baseline}%`;
  writing.append(line);

  const font = getComputedStyle(line);
  const size = Number.parseFloat(font.fontSize);
  const available = sheet.clientWidth * width / 100 - 1;
  answerMeasure.font = `${font.fontWeight} ${size}px ${font.fontFamily}`;
  const paragraph = remaining.split('\n', 1)[0].trimEnd();
  let text = paragraph;
  const needed = answerMeasure.measureText(text).width;
  if (needed > available) {
    const fitted = size * available / needed;
    if (fitSingleLine && fitted >= 6.4) {
      line.style.fontSize = `${fitted}px`;
    } else {
      const breakAt = [...paragraph.matchAll(/\s+/g)].reverse().find(match =>
        answerMeasure.measureText(paragraph.slice(0, match.index)).width <= available);
      text = breakAt ? paragraph.slice(0, breakAt.index) : '';
    }
  }
  if (!text) {
    line.remove();
    return remaining;
  }
  line.textContent = text;
  return remaining.slice(text.length).trimStart();
}

function writeAnswer({ item, sheet, writing }) {
  clearAnswerExtension(sheet);
  writing.replaceChildren();
  const { rows, cut, margin = [15, 89], sections } = answerPlacements[item.id];
  let remaining = item.answer.trim();

  if (sections) {
    const paragraphs = remaining.split(/\n{2,}/);
    remaining = sections.map((paragraph, i) => {
      // Use the label already printed next to each line.
      const section = paragraphs[paragraph];
      const split = section.indexOf(':') + 1;
      const rest = fillAnswerLine(sheet, writing, rows[i], section.slice(split).trim(), true);
      return rest ? `${section.slice(0, split)} ${rest}` : '';
    }).filter(Boolean).join('\n\n');
  } else {
    for (const row of rows) {
      if (!remaining) break;
      remaining = fillAnswerLine(sheet, writing, row, remaining, rows.length === 1);
    }
  }

  if (remaining) extendAnswer(sheet, writing, cut, remaining, margin);
}

function showAnswer(item, flag, layer, fromKeyboard) {
  if (selectedAnswer?.flag === flag) {
    closeAnswer(fromKeyboard);
    return;
  }
  closeAnswer();
  bookmark.close();
  const writing = document.createElement('div');
  writing.className = 'page-answer-writing';
  writing.id = `answer-${item.id}`;
  writing.setAttribute('role', 'group');
  writing.setAttribute('aria-label', item.answer);
  writing.tabIndex = -1;
  layer.append(writing);
  selectedAnswer = { item, flag, sheet: layer.parentElement, writing };
  writeAnswer(selectedAnswer);
  flag.setAttribute('aria-expanded', 'true');
  flag.setAttribute('aria-controls', writing.id);
  if (fromKeyboard) writing.focus({ preventScroll: true });
  const firstLine = writing.firstElementChild;
  const rect = firstLine.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight) firstLine.scrollIntoView({ block: 'nearest' });
}

function renderAnswerLayer(layer, pageNumber) {
  layer.replaceChildren();
  for (const item of answersByPage.get(pageNumber) ?? []) {
    const [x, y] = item.flag;
    const flag = document.createElement('button');
    flag.type = 'button';
    flag.className = 'page-answer-flag';
    flag.dataset.answerId = item.id;
    flag.style.left = `${x}%`;
    flag.style.top = `${y}%`;
    if (answerPlacements[item.id].liftFlag) flag.dataset.liftFlag = '';
    flag.setAttribute('aria-label', `查看参考答案：${item.label}`);
    flag.setAttribute('aria-expanded', 'false');
    flag.title = `参考答案 · ${item.label}`;
    flag.addEventListener('click', event => showAnswer(item, flag, layer, event.detail === 0));
    layer.append(flag);
  }
}

function renderAnswerZones() {
  renderAnswerLayer(leftAnswerLayer, visiblePages.length === 2 ? visiblePages[0] : null);
  renderAnswerLayer(rightAnswerLayer, visiblePages.at(-1));
}

async function loadTranslations() {
  const response = await fetch('writing-1-translations.json?v=20261111-answer-flags');
  if (!response.ok) throw new Error('Writing 1 translations could not be loaded.');
  const pages = await response.json();
  if (pages.length !== PAGE_COUNT) throw new Error('Writing 1 translations are incomplete.');
  translationPages = pages;
  renderClickZones();
  if (selectedAnswer) writeAnswer(selectedAnswer);
}

async function loadOcr() {
  if (ocrData) return ocrData;
  if (!ocrLoading) {
    ocrLoading = fetch('writing-1-ocr.json')
      .then(response => {
        if (!response.ok) throw new Error(`OCR data: HTTP ${response.status}`);
        return response.json();
      })
      .then(pages => { ocrData = pages; return pages; })
      .catch(error => { ocrLoading = null; throw error; });
  }
  return ocrLoading;
}

function textForVisiblePages() {
  if (!ocrData) return '';
  return visiblePages.map(number => {
    const page = ocrData[number - 1];
    return `Page ${number}\n${(page?.lines ?? []).map(line => line.text).join('\n')}`;
  }).join('\n\n');
}

function renderOcrPage() {
  if (!ocrData) return;
  ocrResults.hidden = true;
  ocrPageText.hidden = false;
  ocrPageText.replaceChildren();
  for (const number of visiblePages) {
    const heading = document.createElement('h3');
    heading.textContent = `Page ${number}`;
    ocrPageText.append(heading);
    const paragraph = document.createElement('p');
    paragraph.textContent = (ocrData[number - 1]?.lines ?? []).map(line => line.text).join('\n') || 'No text recognized on this page.';
    ocrPageText.append(paragraph);
  }
  ocrMessage.textContent = visiblePages.length === 2 ? `Pages ${visiblePages[0]}–${visiblePages[1]}` : `Page ${visiblePages[0]}`;
}

async function openOcr() {
  closeContents();
  bookmark.close();
  closeAnswer();
  ocrPanel.hidden = false;
  ocrBackdrop.hidden = false;
  document.querySelector('#ocr-toggle').setAttribute('aria-expanded', 'true');
  if (!ocrData) {
    ocrMessage.textContent = 'Loading OCR text…';
    try { await loadOcr(); }
    catch { ocrMessage.textContent = 'OCR text could not be loaded. Please try again.'; return; }
  }
  renderOcrPage();
}

function searchOcr(query) {
  if (!ocrData) return;
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) { renderOcrPage(); return; }
  const matches = [];
  for (const page of ocrData) {
    const lines = page.lines.map(line => line.text);
    const index = lines.findIndex(line => line.toLocaleLowerCase().includes(needle));
    if (index >= 0) matches.push({ page: page.page, snippet: lines[index] });
  }
  ocrPageText.hidden = true;
  ocrResults.hidden = false;
  ocrResults.replaceChildren();
  for (const match of matches.slice(0, 80)) {
    const button = document.createElement('button');
    button.type = 'button';
    const title = document.createElement('strong');
    title.textContent = `Page ${match.page}`;
    const snippet = document.createElement('span');
    snippet.textContent = match.snippet;
    button.append(title, snippet);
    button.addEventListener('click', () => {
      ocrSearchInput.value = '';
      navigate(match.page);
      closeOcr();
    });
    ocrResults.append(button);
  }
  ocrMessage.textContent = `${matches.length} ${matches.length === 1 ? 'page' : 'pages'} found${matches.length > 80 ? ' · first 80 shown' : ''}`;
}

contentsButtons.forEach(button => button.addEventListener('click', () => contents.classList.contains('is-open') ? closeContents() : openContents()));
document.querySelector('#contents-edge').addEventListener('mouseenter', openContents);
document.querySelector('#contents-close').addEventListener('click', closeContents);
scrim.addEventListener('click', closeContents);
contents.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeContents));
previousButtons.forEach(button => button.addEventListener('click', () => turnPage(-1)));
nextButtons.forEach(button => button.addEventListener('click', () => turnPage(1)));
document.querySelector('#page-form').addEventListener('submit', event => { event.preventDefault(); navigate(pageInput.value); });
document.querySelector('#zoom-out').addEventListener('click', () => { zoomIndex = Math.max(0, zoomIndex - 1); renderZoom(); });
document.querySelector('#zoom-in').addEventListener('click', () => { zoomIndex = Math.min(zoomLevels.length - 1, zoomIndex + 1); renderZoom(); });
document.querySelector('#ocr-toggle').addEventListener('click', () => ocrPanel.hidden ? openOcr() : closeOcr());
document.querySelector('#ocr-close').addEventListener('click', closeOcr);
ocrBackdrop.addEventListener('click', closeOcr);
document.querySelector('#ocr-search-form').addEventListener('submit', event => { event.preventDefault(); searchOcr(ocrSearchInput.value); });
ocrSearchInput.addEventListener('input', () => { if (!ocrSearchInput.value) renderOcrPage(); });
document.querySelector('#ocr-copy').addEventListener('click', async () => {
  if (!ocrData) return;
  try { await navigator.clipboard.writeText(textForVisiblePages()); ocrMessage.textContent = 'Page text copied'; }
  catch { ocrMessage.textContent = 'Copy failed. Select the text below to copy it.'; }
});
document.addEventListener('click', event => {
  if (selectedAnswer && !event.target.closest('.page-answer-flag, .page-answer-writing')) closeAnswer();
});
window.addEventListener('resize', () => {
  if (selectedAnswer) writeAnswer(selectedAnswer);
});
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeAnswer(true); bookmark.close(); closeContents(); closeOcr(); return; }
  if (!ocrPanel.hidden) return;
  if (selectedAnswer?.writing === document.activeElement) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  if (event.key === 'ArrowLeft') turnPage(-1);
  if (event.key === 'ArrowRight') turnPage(1);
});
window.addEventListener('hashchange', renderPage);
wideScreen.addEventListener('change', () => { renderPage(); renderZoom(); });
pageImage.addEventListener('error', () => { pageStatus.textContent = `Page ${currentPage} could not be loaded. Try refreshing.`; });
leftImage.addEventListener('error', () => { pageStatus.textContent = `Page ${visiblePages[0]} could not be loaded. Try refreshing.`; });
renderPage();
renderZoom();
loadTranslations().catch(() => {
  document.querySelector('#translation-error').hidden = false;
});
loadOcr().catch(() => {
  document.querySelector('#ocr-message').textContent = 'OCR text could not be loaded.';
});
