import { requestChineseTranslation, getCachedChineseTranslation } from "./translation-helper.js";

const app = document.querySelector("#app");
let book = null;
let artwork = [];
let galleryFilter = "all";
let modalId = null;
let menuOpen = false;
const sentenceSegmenter = typeof Intl.Segmenter === "function"
  ? new Intl.Segmenter("en", { granularity: "sentence" }) : null;

const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));
const chapterUrl = (id) => "#/chapter/" + String(id).padStart(2, "0");
const chapter = (id) => Number(id) === 0 ? book.frontMatter : book.chapters.find((c) => c.id === Number(id));
const romanNumber = (number) => {
  const numerals = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let result = "";
  for (const [value, numeral] of numerals) {
    while (number >= value) { result += numeral; number -= value; }
  }
  return result;
};
const artTitle = (a) => a.kind === "plate" ? a.title :
  (a.kind === "cover" ? "Cover and front matter" :
    (a.title && !/^Illustration, page \d+$/.test(a.title) ? a.title :
      (chapter(a.chapter)?.title || "Mythology") + " · Illustration"));
const getStored = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
let favorites = new Set(getStored("mythology-favorites", []));
let completed = new Set(getStored("mythology-completed", []));
let fontSize = Number(getStored("mythology-font-size", 18));
document.documentElement.style.setProperty("--reader-size", fontSize + "px");
const save = () => {
  localStorage.setItem("mythology-favorites", JSON.stringify([...favorites]));
  localStorage.setItem("mythology-completed", JSON.stringify([...completed]));
  localStorage.setItem("mythology-font-size", JSON.stringify(fontSize));
};
function prepareSentenceTranslations() {
  const article = document.querySelector(".prose");
  if (!article) return;
  for (const block of article.querySelectorAll(".book-page p, .book-page h2, .book-figure figcaption")) {
    const original = block.textContent;
    const sentences = block.classList.contains("book-verse") ? [original] : sentenceSegmenter
      ? [...sentenceSegmenter.segment(original)].map((part) => part.segment)
      : original.match(/[^.!?]+[.!?]+(?:[”’"']+)?\s*|[^.!?]+$/g) || [original];
    const fragment = document.createDocumentFragment();
    for (const sentence of sentences) {
      const leading = sentence.match(/^\s*/)?.[0] || "";
      if (leading) fragment.append(document.createTextNode(leading));
      const text = sentence.trim();
      if (!text) continue;
      const unit = document.createElement("span");
      unit.className = "sentence-unit";
      const source = document.createElement("span");
      source.className = "sentence-source";
      source.setAttribute("role", "button");
      source.setAttribute("tabindex", "0");
      source.setAttribute("aria-expanded", "false");
      source.setAttribute("aria-label", "Show Chinese translation: " + text);
      source.textContent = text;
      const translation = document.createElement("span");
      translation.className = "sentence-translation";
      translation.lang = "zh-CN";
      translation.hidden = true;
      unit.append(source, translation);
      fragment.append(unit, document.createTextNode(" "));
    }
    block.replaceChildren(fragment);
  }
  const pages = [...article.querySelectorAll(".book-page")].filter((page) => page.querySelector("p .sentence-source, h2 .sentence-source"));
  for (let i = 0; i < pages.length - 1; i++) {
    const last = [...pages[i].querySelectorAll("p .sentence-source, h2 .sentence-source")].at(-1);
    const first = pages[i + 1].querySelector("p .sentence-source, h2 .sentence-source");
    if (!last?.closest("p") || !first?.closest("p") || /[.!?…][”’"']?$/.test(last.textContent.trim())) continue;
    const combined = last.textContent.trim() + " " + first.textContent.trim();
    last.dataset.translationText = combined;
    first.dataset.translationText = combined;
    last.setAttribute("aria-label", "Show Chinese translation: " + combined);
    first.setAttribute("aria-label", "Show Chinese translation: " + combined);
  }
}

function arrangeChapterTitleArt(c) {
  if (!c || c.id < 2) return;
  const titleArt = artwork.find((image) => image.chapter === c.id && image.width === 1275 && image.height <= 700);
  if (!titleArt) return;
  const image = [...document.querySelectorAll(".book-reader .book-figure img")]
    .find((candidate) => candidate.getAttribute("src") === titleArt.src);
  const figure = image?.closest(".book-figure");
  const page = figure?.closest(".book-page");
  if (!page) return;
  const part = book.groups.find((group) => c.id >= group.start && c.id <= group.end);
  const numeral = document.createElement("div");
  numeral.className = "book-roman-number";
  numeral.textContent = romanNumber(c.id - part.start + 1);
  page.querySelector(".page-marker")?.after(numeral, figure);
  figure.classList.add("book-chapter-art");
  figure.querySelector("figcaption")?.remove();
  image.alt = c.title + ", illustrated chapter heading";
  image.loading = "eager";
  image.fetchPriority = "high";
  page.classList.add("has-chapter-art");
}

function arrangeBookSpreads(c) {
  const article = document.querySelector(".book-reader .prose");
  if (!article) return;
  const pages = [...article.querySelectorAll(":scope > .book-page")];
  const newSpread = () => {
    const spread = document.createElement("div");
    spread.className = "book-spread";
    article.append(spread);
    return spread;
  };
  const blankLeaf = (opening = false) => {
    const leaf = document.createElement("div");
    leaf.className = "book-blank-page";
    const frontispiece = opening && c?.id > 0 ? artwork.find((item) =>
      item.chapter === c.id && item.kind !== "cover" && item.page !== 335 &&
      !(item.width === 1275 && item.height <= 700)) : null;
    if (frontispiece) {
      leaf.classList.add("has-frontispiece");
      leaf.innerHTML = '<span class="book-frontispiece-label">EDITH HAMILTON · MYTHOLOGY</span>' +
        '<img class="book-frontispiece-art" src="' + safe(frontispiece.src) + '" alt="' + safe(artTitle(frontispiece)) + '">' +
        '<span class="book-frontispiece-caption">CHAPTER ILLUSTRATION · PAGE ' + frontispiece.page + '</span>';
    } else {
      leaf.setAttribute("aria-hidden", "true");
      leaf.innerHTML = '<span class="book-blank-emblem">✦</span><span class="book-blank-author">EDITH HAMILTON</span><strong>MYTHOLOGY</strong><span class="book-blank-ornament">◇ &nbsp; ✦ &nbsp; ◇</span>';
    }
    return leaf;
  };
  let spread = null;
  for (const page of pages) {
    const pageNumber = Number(page.id.replace("book-p", ""));
    for (const figure of page.querySelectorAll(".book-figure")) {
      const image = figure.querySelector("img");
      const art = artwork.find((item) => item.src === image?.getAttribute("src"));
      if (!art) continue;
      if (page === pages[0]) {
        image.loading = "eager";
        image.fetchPriority = "high";
      }
      figure.classList.add(art.width > art.height * 1.12 ? "is-landscape" : "is-portrait");
      figure.dataset.art = art.id;
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", "Enlarge " + artTitle(art));
      if (art.kind === "cover") page.classList.add("has-cover-art");
      if (art.page === 335) page.classList.add("has-foldout");
      const caption = figure.querySelector("figcaption");
      if (caption && /^Illustration, page \d+$/.test(caption.textContent.trim())) caption.remove();
    }
    if (pageNumber % 2 === 0) {
      if (spread && spread.children.length === 1) spread.append(blankLeaf());
      spread = newSpread();
      page.classList.add("book-verso");
      spread.append(page);
    } else {
      if (!spread || spread.children.length === 2) {
        spread = newSpread();
        spread.append(blankLeaf(page === pages[0]));
      }
      page.classList.add("book-recto");
      spread.append(page);
      spread = null;
    }
  }
  if (spread?.children.length === 1) spread.append(blankLeaf());
}

function primeOpeningTranslations() {
  const opening = [...document.querySelectorAll(".book-reader .prose p .sentence-source")].slice(0, 2);
  if (!opening.length) return;
  const prefetch = () => {
    for (const source of opening) {
      if (!source.isConnected) continue;
      const text = source.dataset.translationText || source.textContent.trim();
      if (!getCachedChineseTranslation(text)) requestChineseTranslation(text).catch(() => {});
    }
  };
  if ("requestIdleCallback" in window) requestIdleCallback(prefetch, { timeout: 1200 });
  else setTimeout(prefetch, 400);
}

async function toggleSentenceTranslation(source) {
  const unit = source.closest(".sentence-unit");
  const translation = unit?.querySelector(".sentence-translation");
  if (!translation) return;
  if (!translation.hidden && !translation.classList.contains("translation-error")) {
    translation.hidden = true;
    source.setAttribute("aria-expanded", "false");
    unit.classList.remove("open");
    return;
  }
  translation.hidden = false;
  source.setAttribute("aria-expanded", "true");
  unit.classList.add("open");
  const text = source.dataset.translationText || source.textContent.trim();
  if (unit.dataset.loading === "true") return;
  const cached = getCachedChineseTranslation(text);
  if (cached) {
    translation.textContent = cached;
    return;
  }
  translation.textContent = "Translating…";
  translation.classList.remove("translation-error");
  unit.dataset.loading = "true";
  try {
    const translated = await requestChineseTranslation(text);
    if (!translated || translated.trim() === text) throw new Error("Translation could not be completed.");
    translation.textContent = translated;
  } catch (error) {
    translation.textContent = error.message || "Translation is unavailable right now. Tap to try again.";
    translation.classList.add("translation-error");
  } finally {
    unit.dataset.loading = "false";
  }
}
const iconSearch = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';

function currentRoute() {
  const raw = location.hash.slice(2) || "";
  const [pathname, query] = raw.split("?");
  const [page, id] = pathname.split("/");
  return { page: page || "home", id, query: new URLSearchParams(query || "") };
}

function sidebar(route) {
  const rows = ['<p class="sidebar-overline">READING CONTENTS</p>',
    '<a class="side-item" href="/western-culture/index.html"><span class="num">←</span> Western Culture</a>',
    '<a class="side-item ' + (route.page === "home" ? "active" : "") + '" href="#/"><span class="num">⌂</span> Home</a>',
    '<a class="side-item ' + (route.page === "gallery" ? "active" : "") + '" href="#/gallery"><span class="num">◈</span> Illustration gallery</a>',
    '<a class="side-item ' + (route.page === "glossary" ? "active" : "") + '" href="#/glossary"><span class="num">✦</span> Names & places</a>'];
  rows.push('<div class="side-group"><span>Front Matter</span><span>01—12</span></div>');
  rows.push('<a class="side-item ' + (route.page === "chapter" && Number(route.id) === 0 ? "active" : "") +
    '" href="' + chapterUrl(0) + '"><span class="num">00</span><span>Front Matter & Preface</span></a>');
  for (const group of book.groups) {
    rows.push('<div class="side-group"><span>' + safe(group.title) + '</span><span>' + String(group.start).padStart(2, "0") + '—' + String(group.end).padStart(2, "0") + '</span></div>');
    for (const c of book.chapters.filter((x) => x.id >= group.start && x.id <= group.end)) {
      rows.push('<a class="side-item ' + (route.page === "chapter" && Number(route.id) === c.id ? "active" : "") +
        '" href="' + chapterUrl(c.id) + '"><span class="num">' + String(c.id).padStart(2, "0") +
        '</span><span>' + safe(c.title) + '</span>' + (completed.has(c.id) ? '<span aria-label="Read">✓</span>' : "") + '</a>');
    }
  }
  rows.push('<div class="side-foot">Edith Hamilton, <i>Mythology</i>.<br>Illustrations by Jim Tierney, 2017 edition.<br><a href="#/methods">Reading guide & credits →</a></div>');
  return rows.join("");
}

function shell(content, route) {
  const active = (name) => route.page === name ? ' class="active"' : "";
  return [
    '<a class="skip-link" href="#main">Skip to content</a>',
    '<header class="topbar">',
    '<button class="mobile-menu" type="button" data-action="menu" aria-controls="mythology-contents" aria-label="Open contents" aria-expanded="' + menuOpen + '">☰</button>',
    '<a class="brand" href="#/"><span class="brand-mark">M</span><span class="brand-copy"><b>MYTHOLOGY</b><small>THE READING ATLAS</small></span></a>',
    '<form class="top-search" data-search-form role="search">' + iconSearch + '<input name="q" type="search" placeholder="Search names, stories, themes" aria-label="Search names, stories, themes"><kbd>/</kbd></form>',
    '<nav class="top-links" aria-label="Main navigation"><a href="landing.html">Books</a><a' + active("gallery") + ' href="#/gallery">Gallery</a><a' + active("glossary") + ' href="#/glossary">Glossary</a><a' + active("search") + ' href="#/search">Search</a></nav>',
    '</header>',
    '<div class="shell ' + (route.page === "chapter" ? "book-shell" : "") + '"><button class="sidebar-edge" type="button" data-action="menu" aria-controls="mythology-contents" aria-expanded="' + menuOpen + '" aria-label="Expand contents"><span aria-hidden="true">☰</span></button><aside class="sidebar ' + (menuOpen ? "open" : "") + '" id="mythology-contents" aria-label="Chapter contents">' + sidebar(route) + '</aside>',
    '<main id="main" class="main">' + content + '</main></div>'
  ].join("");
}

function setMenuOpen(open) {
  menuOpen = open;
  app.querySelector('.sidebar')?.classList.toggle('open', open);
  app.querySelectorAll('[data-action="menu"]').forEach(button => button.setAttribute('aria-expanded', String(open)));
}

function footer() {
  return '<footer class="footer"><span>Edith Hamilton · Mythology | English reading edition</span><span>Illustrations © Jim Tierney / Hachette Book Group · <a href="#/methods">Credits</a></span></footer>';
}

function home() {
  const featured = artwork.find((x) => x.page === 34);
  const plate = artwork.find((x) => x.page === 269);
  const partNames = book.groups.map((group) => group.title);
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  return [
    '<section class="home-hero"><div class="hero-copy"><span class="eyebrow">EDITH HAMILTON · MYTHOLOGY</span>',
    '<h1>A world of myth,<br><span>within reach.</span></h1>',
    '<p>Read Edith Hamilton’s Mythology in English, from the gods of Olympus to the last days of the Norse world. Explore the stories, names, and original artwork in one place.</p>',
    '<div class="hero-actions"><a class="btn btn-primary" href="#/chapter/00">Start at the beginning <span aria-hidden="true">↗</span></a><a class="btn btn-line" href="#/gallery">Illustrations</a></div>',
    '<div class="stats"><div class="stat"><b>24</b><span>CHAPTERS</span></div><div class="stat"><b>' + artwork.length + '</b><span>ORIGINAL IMAGES</span></div><div class="stat"><b>' + book.glossary.length + '</b><span>GLOSSARY ENTRIES</span></div></div></div>',
    '<div class="hero-art"><img src="' + featured.src + '" alt="Jim Tierney’s illustration of Zeus and Olympus"><span class="art-credit">PLATE I · ZEUS PRESIDES OVER OLYMPUS</span></div></section>',
    '<div class="content-wrap"><section class="section"><div class="section-head"><div><span class="eyebrow">EXPLORE THE BOOK</span><h2>Where will you begin?</h2></div><p>Read the complete illustrated book as carefully set HTML pages, from the preface and part openings to the final Norse stories. Or go straight to a god, hero, or family.</p></div>',
    '<div class="part-grid">' + book.groups.map((g, i) => '<a class="part-card" href="' + chapterUrl(g.start) + '"><span class="part-roman">' + roman[i] + '</span><h3>' + partNames[i] + '</h3><span>CHAPTERS ' + String(g.start).padStart(2, "0") + '—' + String(g.end).padStart(2, "0") + ' →</span></a>').join("") + '</div></section>',
    '<section class="feature-band"><img loading="lazy" src="' + plate.src + '" alt="Jim Tierney’s illustration of Odysseus’s journey"><div class="feature-copy"><span class="eyebrow">THE ILLUSTRATED EDITION</span><h2>See the stories as you read.</h2><p>Explore ten full-page color plates and the illustrations within the chapters. Each image stays beside its passage in the reading view.</p><a class="btn btn-soft" href="#/gallery">Open the gallery ↗</a></div></section>',
    footer(), '</div>'
  ].join("");
}

function reader(c) {
  if (!c) return '<div class="content-wrap empty-state"><h1>Chapter not found</h1><a href="#/">Return to contents</a></div>';
  const prev = chapter(c.id - 1), next = chapter(c.id + 1);
  const related = artwork.filter((x) => c.id === 0 ? x.page <= 12 : x.chapter === c.id);
  return `
    <div class="content-wrap book-reader">
      <div class="page-head book-reader-meta">
        <div class="breadcrumb"><a href="#/">Home</a><span>›</span><span>${safe(c.group)}</span></div>
        <p>${c.id === 0 ? "Front matter" : "Chapter " + String(c.id).padStart(2, "0") + " of 24"} · ${safe(c.group)}</p>
        <h1 class="book-reader-screen-title">${safe(c.title)}</h1>
      </div>
      <div class="chapter-toolbar">
        <button class="tool-btn ${favorites.has(c.id) ? "selected" : ""}" data-action="favorite" data-id="${c.id}" aria-pressed="${favorites.has(c.id)}">${favorites.has(c.id) ? "★ Saved" : "☆ Save chapter"}</button>
        <button class="tool-btn ${completed.has(c.id) ? "selected" : ""}" data-action="complete" data-id="${c.id}" aria-pressed="${completed.has(c.id)}">${completed.has(c.id) ? "✓ Read" : "○ Mark as read"}</button>
        ${related.length ? `<a class="tool-btn" href="#/gallery/chapter?id=${c.id}">◈ Chapter illustrations</a>` : ""}
        <span class="tool-spacer"></span>
        <button class="tool-btn" data-action="font-down" aria-label="Decrease text size">A−</button>
        <button class="tool-btn" data-action="font-up" aria-label="Increase text size">A＋</button>
      </div>
      <p class="translation-hint">Click a sentence for Chinese; click again to hide it. Translations are saved in this browser.</p>
      <div class="reader-grid"><article class="prose" aria-label="${safe(c.title)}">${c.html}</article></div>
      <div class="chapter-pager">
        ${prev ? `<a class="pager-link" href="${chapterUrl(prev.id)}"><small>← PREVIOUS · ${String(prev.id).padStart(2, "0")}</small><strong>${safe(prev.title)}</strong></a>` : '<span></span>'}
        ${next ? `<a class="pager-link next" href="${chapterUrl(next.id)}"><small>NEXT · ${String(next.id).padStart(2, "0")} →</small><strong>${safe(next.title)}</strong></a>` : '<span></span>'}
      </div>
      ${footer()}
    </div>`;
}

function visibleArtwork(route) {
  if (route.id === "chapter") return artwork.filter((x) => x.chapter === Number(route.query.get("id")));
  if (route.id === "chapter" && route.query.get("id")) return artwork.filter((x) => x.chapter === Number(route.query.get("id")));
  if (galleryFilter === "plates") return artwork.filter((x) => x.kind === "plate");
  if (galleryFilter === "illustrations") return artwork.filter((x) => x.kind === "illustration");
  return artwork;
}

function gallery(route) {
  const byChapter = route.id === "chapter" && Number(route.query.get("id"));
  const list = byChapter ? artwork.filter((x) => x.chapter === Number(route.query.get("id"))) : visibleArtwork(route);
  const tabs = [["all", "All images"], ["plates", "Ten color plates"], ["illustrations", "In-chapter art"]];
  return [
    '<div class="content-wrap"><div class="page-head"><div class="breadcrumb"><a href="#/">Home</a><span>›</span><span>Gallery</span></div><span class="eyebrow">ORIGINAL ILLUSTRATIONS</span><h1>' + (byChapter ? 'Chapter illustrations' : 'Illustration gallery') + '</h1>',
    '<p>Illustrations from the 2017 edition, shown in their original color and composition. Artwork by Jim Tierney. Select an image to enlarge it; use the arrow keys to move through the gallery.</p></div>',
    byChapter ? '<div class="gallery-tabs"><a class="tab" href="#/gallery">← View all images</a></div>' :
      '<div class="gallery-tabs">' + tabs.map(([id, label]) => '<button class="tab ' + (galleryFilter === id ? "active" : "") + '" data-filter="' + id + '" aria-pressed="' + (galleryFilter === id) + '">' + label + '</button>').join("") + '</div>',
    '<div class="gallery-grid">' + list.map((a) => '<button class="art-card" data-art="' + a.id + '"><span class="art-thumb"><img loading="lazy" src="' + a.src + '" alt="' + safe(artTitle(a)) + '"></span><span class="art-meta"><strong>' + safe(artTitle(a)) + '</strong><span>' + (a.kind === "plate" ? "COLOR PLATE · " : "") + 'Page ' + a.page + '</span></span></button>').join("") + '</div>',
    footer(), '</div>'
  ].join("");
}

function glossary() {
  return '<div class="content-wrap"><div class="page-head"><div class="breadcrumb"><a href="#/">Home</a><span>›</span><span>Glossary</span></div><span class="eyebrow">NAMES & PLACES</span><h1>Names & places</h1><p>A quick reference for gods, heroes, places, and Greek–Roman name pairs. Chapter numbers point you back to the text.</p></div><div class="glossary-grid">' +
    book.glossary.map((g) => '<div class="term"><b>' + safe(g.term) + '</b><p>' + safe(g.definition) + '</p></div>').join("") +
    '</div>' + footer() + '</div>';
}

function methods() {
  return `<div class="content-wrap"><div class="page-head"><div class="breadcrumb"><a href="#/">Home</a><span>›</span><span>Reading guide</span></div><span class="eyebrow">HOW TO READ</span><h1>Reading guide & credits</h1><p>The chapter pages present the English text as responsive HTML book pages. The glossary and navigation are reading aids.</p></div><div class="method-content">
    <h2>Follow the source</h2><p>Hamilton brings together myths told across many centuries. She distinguishes Homer and Hesiod from Greek dramatists and later Roman writers. When stories differ, check which writer or tradition she is following before treating a version as definitive.</p>
    <h2>Use the page markers</h2><p>The reading view follows the source edition from beginning to end. The small page markers indicate its digital page sequence and may differ from printed page numbers. Paragraph breaks were reconstructed for HTML reading, so unusual spacing can occasionally remain.</p>
    <h2>Sentence translations</h2><p>Click or tap a sentence in the chapter text to show a machine-generated Chinese translation directly below it. Click again to hide it. Only the selected sentence is sent to MyMemory. Online translation may have usage limits. Successful translations are cached in your browser.</p>
    <h2>Illustrations</h2><p>Images come from the 2017 illustrated edition you supplied. The book credits Jim Tierney as the illustrator. The ten full-page plates and other substantive images are available in the gallery and alongside the chapter text.</p>
    <h2>Privacy</h2><p>Saved chapters, read marks, text size, and translated sentences are stored in this browser.</p></div>${footer()}</div>`;
}

function search(route) {
  const q = route.query.get("q")?.trim() || "";
  const needle = q.toLocaleLowerCase();
  const chapterHits = q ? [book.frontMatter, ...book.chapters].filter((c) => (c.title + " " + c.plain).toLocaleLowerCase().includes(needle)) : [];
  const termHits = q ? book.glossary.filter((g) => (g.term + " " + g.definition).toLocaleLowerCase().includes(needle)) : [];
  return [
    '<div class="content-wrap"><div class="page-head"><div class="breadcrumb"><a href="#/">Home</a><span>›</span><span>Search</span></div><span class="eyebrow">FIND A STORY</span><h1>Search Mythology</h1>',
    '<p>Search the full English text by character, story, author, or theme.</p></div>',
    '<form data-search-form class="gallery-tabs" role="search"><input name="q" type="search" value="' + safe(q) + '" placeholder="Try Medea, prophecy, or the underworld" aria-label="Search the book" style="min-width:min(100%,420px);padding:12px 15px;border:1px solid var(--line);background:#fff"><button class="btn btn-primary" type="submit">Search ↗</button></form>',
    '<div class="search-results">',
    !q ? '<div class="empty-state">Enter a name or theme to explore the book.</div>' :
      (!chapterHits.length && !termHits.length ? '<div class="empty-state">No results for “' + safe(q) + '”. Try a shorter word or a different spelling.</div>' :
        chapterHits.map((c) => {
          const i = c.plain.toLocaleLowerCase().indexOf(needle);
          const snippet = i >= 0 ? c.plain.slice(Math.max(0, i - 35), i + 110) : c.lead;
          return '<a class="result" href="' + chapterUrl(c.id) + '"><small>' + (c.id === 0 ? "FRONT MATTER" : "CHAPTER " + String(c.id).padStart(2, "0")) + ' · ' + safe(c.group) + '</small><h3>' + safe(c.title) + '</h3><p>' + safe(snippet) + '…</p></a>';
        }).join("") + termHits.map((g) => '<a class="result" href="#/glossary"><small>GLOSSARY</small><h3>' + safe(g.term) + '</h3><p>' + safe(g.definition) + '</p></a>').join("")),
    '</div>' + footer() + '</div>'
  ].join("");
}

function modal() {
  const route = currentRoute();
  const list = route.page === "gallery" && route.id === "chapter"
    ? artwork.filter((x) => x.chapter === Number(route.query.get("id")))
    : route.page === "gallery" ? visibleArtwork(route) : artwork;
  const index = list.findIndex((x) => x.id === modalId);
  const a = list[index];
  if (!a) { modalId = null; return; }
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", artTitle(a));
  overlay.innerHTML = '<div class="lightbox-bar"><strong>' + safe(artTitle(a)) + '</strong><span>Page ' + a.page + ' · ' + (index + 1) + ' / ' + list.length + '</span><button data-action="close-modal" aria-label="Close image">×</button></div>' +
    '<div class="lightbox-stage"><img src="' + a.src + '" alt="' + safe(artTitle(a)) + '"></div>' +
    '<div class="lightbox-nav"><button data-action="prev-art" aria-label="Previous image">‹</button><button data-action="next-art" aria-label="Next image">›</button></div>';
  document.body.append(overlay);
  document.body.style.overflow = "hidden";
  overlay.querySelector('[data-action="close-modal"]').focus();
}

function moveModal(direction) {
  const route = currentRoute();
  const list = route.page === "gallery" && route.id === "chapter"
    ? artwork.filter((x) => x.chapter === Number(route.query.get("id")))
    : route.page === "gallery" ? visibleArtwork(route) : artwork;
  const i = list.findIndex((x) => x.id === modalId);
  modalId = list[(i + direction + list.length) % list.length]?.id || null;
  document.querySelector(".lightbox")?.remove();
  if (modalId) modal();
}

function render() {
  if (!book) return;
  const route = currentRoute();
  if (route.page === "pdf") { location.hash = "#/"; return; }
  let content;
  if (route.page === "chapter") content = reader(chapter(route.id));
  else if (route.page === "gallery") content = gallery(route);
  else if (route.page === "glossary") content = glossary();
  else if (route.page === "methods") content = methods();
  else if (route.page === "search") content = search(route);
  else content = home();
  app.innerHTML = shell(content, route);
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    app.querySelector('.sidebar-edge')?.addEventListener('mouseenter', () => setMenuOpen(true));
  }
  if (route.page === "chapter") {
    arrangeChapterTitleArt(chapter(route.id));
    prepareSentenceTranslations();
    arrangeBookSpreads(chapter(route.id));
    primeOpeningTranslations();
  }
  const sidebarElement = document.querySelector(".sidebar");
  const selected = sidebarElement?.querySelector(".side-item.active");
  if (selected && route.page === "chapter") sidebarElement.scrollTop = selected.offsetTop - sidebarElement.offsetTop - sidebarElement.clientHeight / 2;
  if (modalId) modal();
}

document.addEventListener("click", (event) => {
  const sentence = event.target.closest(".sentence-source");
  if (sentence) { toggleSentenceTranslation(sentence); return; }
  const artButton = event.target.closest("[data-art]");
  if (artButton) { modalId = artButton.dataset.art; modal(); return; }
  const button = event.target.closest("[data-action],[data-filter]");
  if (!button) {
    if (event.target.closest("a[href^='#/']")) setMenuOpen(false);
    return;
  }
  if (button.dataset.filter) { galleryFilter = button.dataset.filter; render(); return; }
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (action === "menu") { setMenuOpen(!menuOpen); }
  if (action === "favorite") { favorites.has(id) ? favorites.delete(id) : favorites.add(id); save(); render(); }
  if (action === "complete") { completed.has(id) ? completed.delete(id) : completed.add(id); save(); render(); }
  if (action === "font-up" || action === "font-down") {
    fontSize = Math.max(15, Math.min(23, fontSize + (action === "font-up" ? 1 : -1)));
    document.documentElement.style.setProperty("--reader-size", fontSize + "px");
    save();
  }
  if (action === "close-modal") { document.querySelector(".lightbox")?.remove(); modalId = null; document.body.style.overflow = ""; }
  if (action === "prev-art") moveModal(-1);
  if (action === "next-art") moveModal(1);
});

let hoverTranslationTimer = null;
document.addEventListener("pointerover", (event) => {
  if (event.pointerType === "touch") return;
  const source = event.target.closest(".sentence-source");
  if (!source || source.contains(event.relatedTarget)) return;
  clearTimeout(hoverTranslationTimer);
  const text = source.dataset.translationText || source.textContent.trim();
  if (getCachedChineseTranslation(text)) return;
  hoverTranslationTimer = setTimeout(() => {
    if (source.isConnected) requestChineseTranslation(text).catch(() => {});
  }, 250);
});
document.addEventListener("pointerout", (event) => {
  const source = event.target.closest(".sentence-source");
  if (source && !source.contains(event.relatedTarget)) clearTimeout(hoverTranslationTimer);
});

document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || !menuOpen) return;
  if (event.target.closest('.sidebar, .sidebar-edge, .mobile-menu')) return;
  setMenuOpen(false);
});

document.addEventListener('pointerdown', (event) => {
  if (menuOpen && !event.target.closest('.sidebar, .sidebar-edge, .mobile-menu')) setMenuOpen(false);
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-search-form]")) return;
  event.preventDefault();
  const q = new FormData(event.target).get("q")?.toString().trim() || "";
  location.hash = "#/search?q=" + encodeURIComponent(q);
});

document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".book-figure[data-art]")) {
    event.preventDefault();
    modalId = event.target.dataset.art;
    modal();
    return;
  }
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".sentence-source")) {
    event.preventDefault();
    toggleSentenceTranslation(event.target);
    return;
  }
  if (event.key === "Escape") {
    if (modalId) { document.querySelector(".lightbox")?.remove(); modalId = null; document.body.style.overflow = ""; }
    else if (menuOpen) { setMenuOpen(false); document.querySelector('.mobile-menu')?.focus(); }
  }
  if (modalId && event.key === "ArrowLeft") moveModal(-1);
  if (modalId && event.key === "ArrowRight") moveModal(1);
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    const input = document.querySelector(".top-search input") || document.querySelector('[data-search-form] input');
    if (input && getComputedStyle(input).display !== "none") input.focus();
    else location.hash = "#/search";
  }
});

window.addEventListener("hashchange", () => {
  document.querySelector(".lightbox")?.remove();
  document.body.style.overflow = "";
  modalId = null;
  menuOpen = false;
  render();
  window.scrollTo(0, 0);
});

Promise.all([
  fetch("content.json").then((r) => { if (!r.ok) throw new Error("The book text could not be loaded"); return r.json(); }),
  fetch("illustrations.json").then((r) => { if (!r.ok) throw new Error("The illustration index could not be loaded"); return r.json(); })
]).then(([content, images]) => {
  book = content;
  artwork = images;
  render();
}).catch((error) => {
  app.innerHTML = '<div class="error"><h1>The reading atlas could not open</h1><p>' + safe(error.message) + '</p><button class="btn btn-primary" onclick="location.reload()">Reload</button></div>';
});
