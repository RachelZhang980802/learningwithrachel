import { getCachedChineseTranslation, requestChineseTranslation } from '/western-culture/more/translation-helper.js';
import { answersByPage } from './writing-1-answers.js';

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
const translationPopup = document.querySelector('#page-translation');
const translationSource = document.querySelector('#translation-source');
const translationResult = document.querySelector('#translation-result');
const translationRetry = document.querySelector('#translation-retry');
let translationRequestId = 0;
let selectedText = '';

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
  closeTranslation();
  contents.classList.add('is-open');
  contents.inert = false;
  scrim.hidden = false;
  contentsButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));
}

function renderPage() {
  closeTranslation();
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

function closeTranslation() {
  translationRequestId += 1;
  translationPopup.hidden = true;
  translationRetry.hidden = true;
}

function lineGap(previous, next) {
  return previous.box[1] - next.box[1] - next.box[3];
}

function sentenceForLine(lines, index) {
  let first = index;
  let last = index;
  const endsSentence = text => /[.!?。！？][”’"']?\s*$/u.test(text);
  const joinedLength = (start, end) => lines.slice(start, end + 1).reduce((total, line) => total + line.text.length + 1, 0);
  while (first > 0 && index - first < 3) {
    const previous = lines[first - 1];
    const current = lines[first];
    if (!previous?.box || !current?.box || lineGap(previous, current) > 0.032 || endsSentence(previous.text) || joinedLength(first - 1, last) > 300) break;
    if (previous.text.length < 24 && !/[,;，；]$/u.test(previous.text)) break;
    first -= 1;
  }
  while (last < lines.length - 1 && last - index < 3) {
    const current = lines[last];
    const next = lines[last + 1];
    if (!current?.box || !next?.box || lineGap(current, next) > 0.032 || endsSentence(current.text) || joinedLength(first, last + 1) > 300) break;
    if (current.text.length < 24 && !/[,;，；]$/u.test(current.text)) break;
    last += 1;
  }
  return lines.slice(first, last + 1).map(line => line.text.trim()).join(' ').replace(/-\s+(?=[a-z])/giu, '');
}

function renderClickLayer(layer, pageNumber) {
  layer.replaceChildren();
  if (!ocrData || !pageNumber) return;
  const lines = ocrData[pageNumber - 1]?.lines ?? [];
  lines.forEach((line, index) => {
    const box = line.box;
    if (!box || box.length !== 4 || !box.every(Number.isFinite) || !line.text?.trim()) return;
    const [x, y, width, height] = box;
    if (x < 0 || y < 0 || width <= 0 || height <= 0) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-click-zone';
    button.style.left = `${Math.max(0, x * 100 - 0.15)}%`;
    button.style.top = `${Math.max(0, (1 - y - height) * 100 - 0.1)}%`;
    button.style.width = `${Math.min(100 - x * 100, width * 100 + 0.3)}%`;
    button.style.height = `${height * 100 + 0.2}%`;
    button.setAttribute('aria-label', `Translate: ${line.text}`);
    button.title = 'Click to see text and translation';
    button.addEventListener('click', event => showTranslation(sentenceForLine(lines, index), event));
    layer.append(button);
  });
}

function renderClickZones() {
  renderClickLayer(leftClickLayer, visiblePages.length === 2 ? visiblePages[0] : null);
  renderClickLayer(rightClickLayer, visiblePages.at(-1));
}

function renderAnswerLayer(layer, pageNumber) {
  layer.replaceChildren();
  for (const item of answersByPage.get(pageNumber) ?? []) {
    const [x, y, width, height] = item.box;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `page-answer-zone${item.long ? ' page-answer-zone--long' : ''}${y > 70 ? ' page-answer-zone--lower' : ''}`;
    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.style.width = `${width}%`;
    button.style.height = `${height}%`;
    button.setAttribute('aria-label', `Show reference answer: ${item.label}`);
    button.setAttribute('aria-pressed', 'false');
    button.title = `${item.label} · 点击横线查看红色参考答案`;
    const text = document.createElement('span');
    text.className = 'page-answer-zone__text';
    text.textContent = item.answer;
    button.append(text);
    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-pressed') !== 'true';
      layer.querySelectorAll('.page-answer-zone[aria-pressed="true"]').forEach(other => other.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', String(opening));
      closeTranslation();
    });
    layer.append(button);
  }
}

function renderAnswerZones() {
  renderAnswerLayer(leftAnswerLayer, visiblePages.length === 2 ? visiblePages[0] : null);
  renderAnswerLayer(rightAnswerLayer, visiblePages.at(-1));
}

async function translateSelectedText() {
  const requestId = ++translationRequestId;
  const text = selectedText;
  translationRetry.hidden = true;
  if (!/[A-Za-z]/u.test(text) && /[\u3400-\u9fff]/u.test(text)) {
    translationResult.textContent = '这段文字已是中文。';
    return;
  }
  const cached = getCachedChineseTranslation(text);
  if (cached) {
    translationResult.textContent = cached;
    return;
  }
  translationResult.textContent = '正在翻译…';
  try {
    const translated = await requestChineseTranslation(text);
    if (requestId === translationRequestId) translationResult.textContent = translated;
  } catch {
    if (requestId === translationRequestId) {
      translationResult.textContent = '翻译暂时不可用。英文 OCR 文字仍可查看；请稍后重试。';
      translationRetry.hidden = false;
    }
  }
}

function showTranslation(text, event) {
  selectedText = text;
  translationSource.textContent = text;
  translationPopup.hidden = false;
  const width = Math.min(440, window.innerWidth - 24);
  const left = Math.min(window.innerWidth - width - 12, Math.max(12, event.clientX + 16));
  const top = Math.min(window.innerHeight - 220, Math.max(12, event.clientY + 16));
  translationPopup.style.left = `${left}px`;
  translationPopup.style.top = `${Math.max(12, top)}px`;
  translateSelectedText();
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
  closeTranslation();
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
document.querySelector('#translation-close').addEventListener('click', closeTranslation);
translationRetry.addEventListener('click', translateSelectedText);
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeTranslation(); closeContents(); closeOcr(); return; }
  if (!translationPopup.hidden) return;
  if (!ocrPanel.hidden) return;
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
loadOcr().then(renderClickZones).catch(() => {
  document.querySelector('.reader-note').firstChild.textContent = 'OCR text could not be loaded. Refresh the page to restore click-to-translate.';
});
