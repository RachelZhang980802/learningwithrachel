import { getCachedChineseTranslation, requestChineseTranslation } from './translation-helper.js';

const bookId = new URLSearchParams(location.search).get('book') === 'mcdougal' ? 'mcdougal' : 'holt';
const app = document.querySelector('#app');
const sourceDialog = document.querySelector('#source-dialog');
const sourceImage = document.querySelector('#source-image');
const chunks = new Map();
const hitboxChunks = new Map();
const visibleHitboxes = new Map();
const verifiedSourceSentences = bookId === 'holt' ? {
  58: [
    {text:'History is the study of the past, and people who study history are called historians.',rects:[[54.5,9.9,37,3.7]]},
    {text:'Historians try to learn what life was like for people long ago in places around the world.',rects:[[54.5,13.7,37,3.8]]},
    {text:'To understand the people and places of the past, historians study clues and evidence.',rects:[[54.5,17.6,37,3.7]]},
    {text:'Some historians study the earliest humans.',rects:[[54.5,21.4,37,2.0]]},
    {text:'Early people hunted animals, gathered plants, and learned how to make stone tools.',rects:[[54.5,23.4,37,4.2]]},
    {text:'Eventually, people learned to grow food and raise animals for themselves.',rects:[[54.5,27.7,37,3.4]]},
    {text:'In the next two chapters, you will learn about the subject of history and about the world’s earliest peoples.',rects:[[54.5,31.2,37,4.5]]},
    {text:'In this scene, young Maria de Sautuola discovers prehistoric cave paintings in Altamira, Spain, in 1879.',rects:[[54.5,38.8,37,4.6]]},
    {text:'What do these paintings say about the life of early people?',rects:[[54.5,43.5,37,2.9]]}
  ]
} : {};
let manifest;
let renderId = 0;
let menuOpen = false;
let activeTranslationRequest = 0;

const modalStage = document.createElement('div');
modalStage.className = 'source-modal-stage';
sourceImage.replaceWith(modalStage);
modalStage.append(sourceImage);
const modalOverlay = document.createElement('div');
modalOverlay.className = 'source-text-overlay';
modalStage.append(modalOverlay);

const sourceTranslation = document.createElement('aside');
sourceTranslation.className = 'source-translation';
sourceTranslation.hidden = true;
sourceTranslation.setAttribute('aria-label', 'Sentence translation');
sourceTranslation.innerHTML = '<button class="source-translation-close" type="button" aria-label="Close translation">×</button><p class="source-translation-label">ENGLISH → 中文</p><p class="source-translation-english"></p><p class="source-translation-chinese" lang="zh-CN" aria-live="polite"></p>';
document.body.append(sourceTranslation);

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const formatPage = page => String(page).padStart(3, '0');
const firstOfSpread = page => page <= 1 ? 1 : (page % 2 === 0 ? page : page - 1);
const pageUrl = page => `#/page/${firstOfSpread(Math.max(1, Math.min(manifest.totalPages, page)))}`;
const imageUrl = page => `assets/history/${bookId}/page-${formatPage(page)}.jpg`;

function currentRoute() {
  const pageMatch = location.hash.match(/^#\/page\/(\d+)/);
  if (pageMatch) return {type:'page', page:firstOfSpread(Math.max(1, Math.min(manifest.totalPages, Number(pageMatch[1]))))};
  if (location.hash.startsWith('#/search')) return {type:'search'};
  return {type:'home'};
}

function chapterForPage(page) {
  if (page >= manifest.backStart) return null;
  return [...manifest.chapters].reverse().find(chapter => chapter.page <= page) || null;
}

async function loadChunk(page) {
  const first = Math.floor((page - 1) / manifest.chunkSize) * manifest.chunkSize + 1;
  if (!chunks.has(first)) {
    chunks.set(first, fetch(`data/${bookId}/pages-${String(first).padStart(4,'0')}.json`).then(response => {
      if (!response.ok) throw new Error(`Page data could not be loaded (${response.status}).`);
      return response.json();
    }));
  }
  return chunks.get(first);
}

async function pageData(page) {
  const data = await loadChunk(page);
  return data.find(item => item.page === page);
}

async function pageHitboxes(page) {
  if (verifiedSourceSentences[page]) return verifiedSourceSentences[page];
  const first = Math.floor((page - 1) / manifest.chunkSize) * manifest.chunkSize + 1;
  if (!hitboxChunks.has(first)) {
    hitboxChunks.set(first, fetch(`hitboxes/${bookId}/pages-${String(first).padStart(4,'0')}.json`).then(response => {
      if (!response.ok) throw new Error(`Sentence positions could not be loaded (${response.status}).`);
      return response.json();
    }));
  }
  const group = await hitboxChunks.get(first);
  return group.find(item => item.page === page)?.sentences || [];
}

function shell(content, activePage) {
  const side = manifest.chapters.map(chapter => `<a class="side-link ${activePage && chapter.page <= activePage && (manifest.chapters[chapter.number]?.page || manifest.backStart) > activePage ? 'active' : ''}" href="${pageUrl(chapter.page)}"><span>${String(chapter.number).padStart(2,'0')}</span>${escapeHtml(chapter.title)}</a>`).join('');
  app.innerHTML = `<header class="topbar"><button class="menu-toggle" type="button" data-action="menu" aria-controls="book-contents" aria-expanded="${menuOpen}" aria-label="打开目录">☰</button><a class="brand" href="#/"><span class="brand-mark">W</span><span class="brand-copy">WORLD HISTORY<small>THE READING ROOM</small></span></a><nav aria-label="Main navigation"><a href="landing.html">Books</a><a href="#/">Contents</a><a href="#/search">Search</a><a href="../index.html">Western Culture</a></nav></header><div class="shell"><button class="sidebar-edge" type="button" data-action="menu" aria-controls="book-contents" aria-expanded="${menuOpen}" aria-label="展开目录"><span aria-hidden="true">☰</span></button><aside class="sidebar ${menuOpen?'open':''}" id="book-contents" aria-label="Book contents"><p class="side-label">READING CONTENTS</p><a class="side-link" href="landing.html"><span>←</span> Bookshelf</a><a class="side-link" href="#/"><span>⌂</span> Book home</a><a class="side-link" href="${pageUrl(1)}"><span>00</span> Front matter</a>${side}<a class="side-link" href="${pageUrl(manifest.backStart)}"><span>↳</span> Reference &amp; index</a><p class="sidebar-hint">${escapeHtml(manifest.subtitle)}<br>${manifest.totalPages} original pages</p></aside><main class="main" id="main">${content}</main></div>`;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    app.querySelector('.sidebar-edge')?.addEventListener('mouseenter', () => setMenuOpen(true));
  }
}

function setMenuOpen(open) {
  menuOpen = open;
  app.querySelector('.sidebar')?.classList.toggle('open', open);
  app.querySelectorAll('[data-action="menu"]').forEach(button => button.setAttribute('aria-expanded', String(open)));
}

function home() {
  return `<div class="content-wrap"><section class="home-hero"><div><span class="eyebrow">WORLD HISTORY · ORIGINAL PAGE EDITION</span><h1>${escapeHtml(manifest.title)}</h1><p class="subtitle">${escapeHtml(manifest.subtitle)}</p><p>Explore the book in its original page layout, with its illustrations, maps and diagrams intact. Click an English sentence on the page to see its Chinese translation.</p><a class="btn" href="${pageUrl(manifest.chapters[0].page)}">Start reading ↗</a> <a class="btn" href="${pageUrl(1)}">Front matter</a></div><img src="${manifest.cover}" alt="Cover of ${escapeHtml(manifest.title)}"></section><section class="book-index"><span class="eyebrow">CONTENTS</span><h2>Explore the chapters</h2><div class="chapter-grid">${manifest.chapters.map(ch => `<a class="chapter-card" href="${pageUrl(ch.page)}"><b>${String(ch.number).padStart(2,'0')}</b><strong>${escapeHtml(ch.title)}</strong><small>Printed page ${ch.printedPage} · Book image ${ch.page} →</small></a>`).join('')}</div></section><p class="book-credit">${escapeHtml(manifest.author)} · Original pages follow the book's printed order.</p></div>`;
}

function sourceZones(page, sentences) {
  return sentences.flatMap((sentence, index) => sentence.rects.map((rect, segment) => {
    const [left, top, width, height] = rect.map(Number);
    if (![left, top, width, height].every(Number.isFinite)) return '';
    return `<button class="source-sentence-zone" type="button" data-zone-page="${page}" data-zone-index="${index}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%" aria-label="Translate sentence: ${escapeHtml(sentence.text)}" ${segment ? 'tabindex="-1"' : ''}></button>`;
  })).join('');
}

function sourcePageImage(page, sentences) {
  return `<div class="source-page-stage"><button class="page-image-button" type="button" data-source="${page}" aria-label="Enlarge original page ${page}"><img class="page-art" src="${imageUrl(page)}" alt="Original book page ${page}" loading="eager"></button><div class="source-text-overlay">${sourceZones(page, sentences)}</div></div><p class="source-hint">${sentences.length ? '点击原书中的英文句子查看中文；点击图片其他位置可放大。' : '这一页暂无可识别句子；点击图片可放大。'}</p>`;
}

function leaf(data, hitboxes = []) {
  if (!data) return '<section class="book-leaf" aria-label="Blank page"></section>';
  const chapter = chapterForPage(data.page);
  const title = data.page === 1 ? 'Front matter' : data.page >= manifest.backStart ? 'Reference & index' : bookId === 'holt' && data.page === 176 ? 'Ancient India' : chapter?.title || 'Front matter';
  return `<section class="book-leaf source-leaf" aria-label="Book page ${data.page}"><div class="leaf-head"><span>${escapeHtml(manifest.title)} · ${escapeHtml(title)}</span><span>PAGE ${data.page}</span></div>${sourcePageImage(data.page, hitboxes)}</section>`;
}

async function reader(page, id) {
  const next = page === 1 ? 1 : Math.min(page + 1, manifest.totalPages);
  const [left,right,leftBoxes,rightBoxes] = await Promise.all([
    pageData(page),
    next === page ? Promise.resolve(null) : pageData(next),
    pageHitboxes(page).catch(() => []),
    next === page ? Promise.resolve([]) : pageHitboxes(next).catch(() => [])
  ]);
  if (id !== renderId) return;
  visibleHitboxes.clear();
  visibleHitboxes.set(page, leftBoxes);
  if (next !== page) visibleHitboxes.set(next, rightBoxes);
  const chapter = chapterForPage(next) || chapterForPage(page);
  const title = chapter?.title || (page >= manifest.backStart ? 'Reference & index' : 'Front matter');
  const content = `<div class="content-wrap reader"><div class="reader-head"><div><span class="eyebrow">${escapeHtml(manifest.subtitle)}</span><h1>${escapeHtml(title)}</h1><p>Original pages ${page}${next !== page ? `–${next}` : ''} of ${manifest.totalPages}</p></div></div><div class="reader-toolbar"><a class="toolbar-button" href="#/">↖ Contents</a><a class="toolbar-button" href="#/search">⌕ Search</a><a class="toolbar-button" href="${pageUrl(Math.max(1,page-2))}" aria-label="Previous spread">← Previous</a><a class="toolbar-button" href="${pageUrl(Math.min(manifest.totalPages,page+2))}" aria-label="Next spread">Next →</a><form class="page-jump" id="page-jump"><label for="jump-number">Page</label><input id="jump-number" type="number" min="1" max="${manifest.totalPages}" value="${page}"><button type="submit">Go</button></form></div><p class="translation-note">点击原书中的英文句子查看中文；点击其他位置放大页面。将鼠标移到左侧边缘可展开目录。</p><div class="book-spread">${leaf(left,leftBoxes)}${leaf(right,rightBoxes)}</div><nav class="reader-pager" aria-label="Page navigation">${page > 1 ? `<a href="${pageUrl(Math.max(1,page-2))}">← Previous spread</a>` : '<span></span>'}${page+2 <= manifest.totalPages ? `<a href="${pageUrl(page+2)}">Next spread →</a>` : '<span></span>'}</nav><p class="book-credit">${escapeHtml(manifest.author)}</p></div>`;
  shell(content,next);
  try { localStorage.setItem(`world-history-last-${bookId}`,String(page)); } catch {}
}

function searchPage() {
  return `<div class="content-wrap search-panel"><span class="eyebrow">FIND A PASSAGE</span><h1>Search this book</h1><form id="search-form"><input id="search-input" type="search" placeholder="Search names, places or ideas" required autocomplete="off" aria-label="Search book text"><button class="btn" type="submit">Search</button></form><p class="translation-note">Search checks the extracted English text from all ${manifest.totalPages} pages.</p><div id="search-results" role="status"></div></div>`;
}

async function search(query) {
  const target = document.querySelector('#search-results');
  target.textContent = 'Searching the book…';
  const firsts = Array.from({length:Math.ceil(manifest.totalPages / manifest.chunkSize)},(_,i)=>i*manifest.chunkSize+1);
  try {
    const groups = await Promise.all(firsts.map(loadChunk));
    const needle = query.toLocaleLowerCase();
    const results = [];
    for (const page of groups.flat()) {
      const paragraph = page.paragraphs.find(p => p.toLocaleLowerCase().includes(needle));
      if (paragraph) results.push({page:page.page,text:paragraph});
      if (results.length >= 80) break;
    }
    target.innerHTML = `<p>${results.length} ${results.length === 1 ? 'page' : 'pages'} found${results.length === 80 ? ' (showing the first 80)' : ''}.</p>${results.map(r=>`<a class="search-result" href="${pageUrl(r.page)}"><b>Page ${r.page} · ${escapeHtml(chapterForPage(r.page)?.title || (r.page >= manifest.backStart ? 'Reference & index' : 'Front matter'))}</b><span>${escapeHtml(r.text.slice(0,240))}${r.text.length>240?'…':''}</span></a>`).join('')}`;
  } catch (error) { target.textContent = error.message || 'Search is unavailable.'; }
}

async function render() {
  const id = ++renderId;
  hideSourceTranslation();
  menuOpen = false;
  const route = currentRoute();
  if (route.type === 'home') shell(home(),null);
  else if (route.type === 'search') shell(searchPage(),null);
  else {
    shell('<p class="loading">Opening book pages…</p>',route.page);
    await reader(route.page,id);
  }
  window.scrollTo({top:0,behavior:'instant'});
}

function hideSourceTranslation() {
  activeTranslationRequest++;
  sourceTranslation.hidden = true;
  document.querySelectorAll('.source-sentence-zone.is-selected').forEach(zone => zone.classList.remove('is-selected'));
}

async function revealSourceTranslation(zone) {
  const page = Number(zone.dataset.zonePage);
  const index = Number(zone.dataset.zoneIndex);
  const sentence = visibleHitboxes.get(page)?.[index]?.text;
  if (!sentence) return;
  hideSourceTranslation();
  const request = activeTranslationRequest;
  document.querySelectorAll('.source-sentence-zone').forEach(item => {
    if (Number(item.dataset.zonePage) === page && Number(item.dataset.zoneIndex) === index) item.classList.add('is-selected');
  });
  (sourceDialog.open ? sourceDialog : document.body).append(sourceTranslation);
  sourceTranslation.querySelector('.source-translation-english').textContent = sentence;
  const chinese = sourceTranslation.querySelector('.source-translation-chinese');
  const cached = getCachedChineseTranslation(sentence);
  chinese.textContent = cached || '正在翻译…';
  sourceTranslation.hidden = false;
  if (cached) return;
  try {
    const result = await requestChineseTranslation(sentence);
    if (request === activeTranslationRequest) chinese.textContent = result;
  } catch (error) {
    if (request === activeTranslationRequest) chinese.textContent = error.message || '翻译暂时不可用，请重试。';
  }
}

function openSourcePage(page) {
  hideSourceTranslation();
  sourceImage.src = imageUrl(page);
  sourceImage.alt = `Original page ${page} of ${manifest.title}`;
  modalOverlay.innerHTML = sourceZones(page, visibleHitboxes.get(page) || []);
  sourceDialog.showModal();
}

app.addEventListener('click',event => {
  const menu = event.target.closest('[data-action="menu"]');
  if (menu) { setMenuOpen(!menuOpen); return; }
  const zone = event.target.closest('[data-zone-page]');
  if (zone) { revealSourceTranslation(zone); return; }
  const source = event.target.closest('[data-source]');
  if (source) { openSourcePage(Number(source.dataset.source)); return; }
  if (event.target.closest('.side-link')) setMenuOpen(false);
});

app.addEventListener('mouseover',event => {
  const zone = event.target.closest('[data-zone-page]');
  if (zone) {
    const text = visibleHitboxes.get(Number(zone.dataset.zonePage))?.[Number(zone.dataset.zoneIndex)]?.text;
    if (text && !getCachedChineseTranslation(text)) requestChineseTranslation(text).catch(() => {});
  }
});

document.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !menuOpen) return;
  if (event.target.closest('.sidebar, .sidebar-edge, .menu-toggle')) return;
  setMenuOpen(false);
});

document.addEventListener('pointerdown', event => {
  if (menuOpen && !event.target.closest('.sidebar, .sidebar-edge, .menu-toggle')) setMenuOpen(false);
});

app.addEventListener('submit',event => {
  if (event.target.id === 'page-jump') { event.preventDefault(); location.hash=pageUrl(Number(document.querySelector('#jump-number').value)); }
  if (event.target.id === 'search-form') { event.preventDefault(); search(document.querySelector('#search-input').value.trim()); }
});

sourceTranslation.querySelector('.source-translation-close').addEventListener('click',hideSourceTranslation);
document.querySelector('#close-source').addEventListener('click',()=>sourceDialog.close());
sourceDialog.addEventListener('click',event => {
  const zone = event.target.closest('[data-zone-page]');
  if (zone) revealSourceTranslation(zone);
});
sourceDialog.addEventListener('close',() => { hideSourceTranslation(); document.body.append(sourceTranslation); });
sourceDialog.addEventListener('click',event=>{if(event.target===sourceDialog)sourceDialog.close();});
window.addEventListener('hashchange',render);
window.addEventListener('keydown',event=>{
  if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); app.querySelector('.menu-toggle')?.focus(); return; }
  if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName) || sourceDialog.open) return;
  const route=currentRoute();
  if (route.type!=='page') return;
  if (event.key==='ArrowRight') location.hash=pageUrl(route.page+2);
  if (event.key==='ArrowLeft') location.hash=pageUrl(route.page-2);
});

try {
  const response=await fetch(`data/${bookId}/manifest.json`);
  if (!response.ok) throw new Error('Book contents could not be loaded.');
  manifest=await response.json();
  document.title=`${manifest.title} · ${manifest.subtitle} · The Reading Room`;
  render();
} catch(error) { app.innerHTML=`<p class="loading">${escapeHtml(error.message || 'Book unavailable.')}</p>`; }
