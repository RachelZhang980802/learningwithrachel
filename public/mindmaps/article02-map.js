const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = "./article02-map.css?v=source-map-2";
document.head.append(stylesheet);

document.title = "Should the Robots Be Taxed? · Mindmap";
document.documentElement.lang = "en";
document.body.className = "single-map";
document.body.classList.toggle("embedded-lesson", window.self !== window.top);
document.body.innerHTML = `
  <main class="lesson-shell">
    <h1 class="screen-reader-only">Should the Robots Be Taxed?</h1>
    <div class="lesson-toolbar" aria-label="Mindmap controls" role="group">
      <div class="lesson-tools">
        <button type="button" id="fit-map">Fit map</button>
        <button type="button" id="read-size" title="Zoom to reading size">Read size</button>
        <button type="button" id="map-minus" aria-label="Zoom out">−</button>
        <button type="button" id="map-plus" aria-label="Zoom in">+</button>
        <output id="map-zoom" aria-label="Zoom percentage"></output>
        <button type="button" id="map-fullscreen" aria-label="Full screen" title="Full screen">⛶</button>
      </div>
      <div class="lesson-tools">
        <output id="gap-count" aria-label="Answers revealed">0 / 10</output>
        <button type="button" id="lesson-details">Hide details</button>
        <button type="button" id="reset-lesson">Reset lesson</button>
      </div>
    </div>
    <p class="lesson-help" id="lesson-help">Click any text to interact. Questions open branches, blanks reveal answers, and arrows trace connections.</p>
    <div class="lesson-viewport" id="lesson-viewport" role="region" aria-label="Interactive reading map" tabindex="0" aria-busy="true">
      <div class="lesson-sheet" id="lesson-sheet"></div>
    </div>
    <span class="screen-reader-only" role="status" id="lesson-status"></span>
  </main>`;

const get = (id) => document.getElementById(id);
const viewport = get("lesson-viewport");
const shell = document.querySelector(".lesson-shell");
const help = get("lesson-help");
const defaultHelp = help.textContent;
const status = get("lesson-status");
const relations = {
  "tools-pattern": [484, 590],
  "pattern-example": [667, 849],
  "example-prediction": [849, 1469],
  "prediction-evaluation": [1482, 1516],
  "population-capacity": [2029, 1898],
};

function message(text) {
  help.textContent = text || defaultHelp;
  help.title = text || "";
  status.textContent = text;
}

function makeButton(element, label, onAction) {
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  element.setAttribute("aria-label", label);
  element.addEventListener("click", onAction);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!event.repeat) onAction();
  });
}

function initialize(map) {
  const details = [...map.querySelectorAll("[data-detail]")];
  const questions = [...map.querySelectorAll("[data-question]")];
  const gaps = [...map.querySelectorAll("[data-gap]")];
  const gapsByLabel = new Map(gaps.map((gap) => [gap.parentElement, gap]));
  const glyphs = [...map.querySelectorAll("[data-answer-glyph]")];
  const links = [...map.querySelectorAll("[data-link]")];
  const linkArtwork = [...map.querySelectorAll("[data-link-art]")];
  const labels = new Map([...map.querySelectorAll("[data-label]")].map((node) => [
    Number(node.dataset.label), node,
  ]));
  const sectionIds = questions.map(({ dataset }) => dataset.question);
  const hiddenSections = new Set();
  const answers = new Set();
  const comparison = map.querySelector("[data-compare]");
  const labelText = (node) => node.querySelector(".semantic-text").textContent;
  const textButtons = new Map();
  let compared = false;
  let activeLink;
  let selectedLabel;

  function updateLesson() {
    const endpoints = relations[activeLink] ?? [];
    if (selectedLabel && hiddenSections.has(selectedLabel.dataset.detail)) selectedLabel = undefined;
    details.forEach((node) => node.classList.toggle("detail-hidden", hiddenSections.has(node.dataset.detail)));
    questions.forEach((node) => node.setAttribute("aria-expanded", String(!hiddenSections.has(node.dataset.question))));
    glyphs.forEach((glyph) => glyph.classList.toggle("is-revealed", answers.has(glyph.dataset.answerGlyph)));
    gaps.forEach((gap) => {
      const { gap: number, answer } = gap.dataset;
      const visible = answers.has(number);
      gap.setAttribute("aria-pressed", String(visible));
      gap.setAttribute("aria-label", visible ? `Hide answer ${number}, ${answer}` : `Reveal blank ${number}`);
      const text = gap.parentElement.querySelector(".semantic-text");
      text.textContent = visible ? text.dataset.original : text.dataset.prompt;
    });
    get("gap-count").textContent = `${answers.size} / ${gaps.length}`;
    get("lesson-details").textContent = hiddenSections.size === sectionIds.length ? "Show details" : "Hide details";
    comparison.setAttribute("aria-pressed", String(compared));
    map.classList.toggle("comparison-active", compared);
    labels.forEach((node, id) => {
      node.classList.toggle("link-endpoint", endpoints.includes(id));
      const button = textButtons.get(node);
      if (button) {
        button.setAttribute("aria-pressed", String(node === selectedLabel));
        if (gapsByLabel.has(node)) button.setAttribute("aria-label", labelText(node));
      }
    });
    links.forEach((link) => link.setAttribute("aria-pressed", String(link.dataset.link === activeLink)));
    linkArtwork.forEach((path) => path.classList.toggle("link-active", path.dataset.linkArt === activeLink));
  }

  questions.forEach((question) => {
    const label = labelText(question);
    makeButton(question, label, () => {
      const section = question.dataset.question;
      const opening = hiddenSections.delete(section);
      if (!opening) {
        hiddenSections.add(section);
        if (section === "example") compared = false;
        if ((relations[activeLink] ?? []).some((id) => labels.get(id).dataset.detail === section)) activeLink = undefined;
      }
      updateLesson();
      message(opening ? "Branch details shown." : "Branch details hidden.");
    });
  });

  gaps.forEach((gap) => {
    const text = gap.parentElement.querySelector(".semantic-text");
    const { gap: number, answer } = gap.dataset;
    text.dataset.prompt = text.textContent;
    text.dataset.original = text.textContent.replace("blank", answer);
    makeButton(gap, `Reveal blank ${number}`, () => {
      if (answers.delete(number)) message(`Blank ${number} hidden.`);
      else {
        answers.add(number);
        message(`Answer ${number} · ${answer}`);
      }
      updateLesson();
    });
  });

  labels.forEach((node) => {
    if (node.hasAttribute("data-question") || node === comparison) return;
    const gap = gapsByLabel.get(node);
    const text = node.querySelector(".semantic-text");
    text.setAttribute("aria-hidden", "true");
    // When the whole label is a blank, the blank is the only control it needs.
    if (gap && text.dataset.original === gap.dataset.answer) return;
    const marker = node.querySelector(".node-marker");
    makeButton(marker, labelText(node), () => {
      selectedLabel = selectedLabel === node ? undefined : node;
      updateLesson();
      message(selectedLabel ? labelText(selectedLabel) : "");
    });
    textButtons.set(node, marker);
  });

  makeButton(comparison, labelText(comparison), () => {
    compared = !compared;
    updateLesson();
    message(compared ? "Teaching cue · Weaving in green. Factory production in orange." : "");
  });

  links.forEach((link) => {
    const targetIds = relations[link.dataset.link];
    const endpoints = targetIds.map((id) => labels.get(id));
    const explanation = endpoints.map(labelText).join(" → ");
    makeButton(link, `Trace connection: ${explanation}`, () => {
      activeLink = activeLink === link.dataset.link ? undefined : link.dataset.link;
      if (activeLink) endpoints.forEach((endpoint) => hiddenSections.delete(endpoint.dataset.detail));
      updateLesson();
      message(activeLink ? `Connection · ${explanation}` : "");
    });
  });

  get("lesson-details").addEventListener("click", () => {
    const hide = hiddenSections.size < sectionIds.length;
    hiddenSections.clear();
    if (hide) sectionIds.forEach((section) => hiddenSections.add(section));
    compared = false;
    activeLink = undefined;
    updateLesson();
    message(hide ? "Details hidden. Click a question to reveal its branch." : "All branch details shown.");
  });

  get("reset-lesson").addEventListener("click", () => {
    hiddenSections.clear();
    answers.clear();
    compared = false;
    activeLink = undefined;
    selectedLabel = undefined;
    updateLesson();
    message("Lesson reset. All ten blanks are ready.");
  });

  updateLesson();
  setupViewport(map);
}

function setupViewport(map) {
  const [, , width, height] = map.getAttribute("viewBox").split(/\s+/).map(Number);
  let scale = 1;
  let fitMode = true;
  const fitScale = () => Math.min((viewport.clientWidth - 16) / width, (viewport.clientHeight - 16) / height);

  function zoom(newScale, clientX, clientY) {
    if (clientX === undefined || clientY === undefined) {
      const rect = viewport.getBoundingClientRect();
      clientX = rect.left + viewport.clientWidth / 2;
      clientY = rect.top + viewport.clientHeight / 2;
    }
    const previous = map.getBoundingClientRect();
    const x = (clientX - previous.left) / scale;
    const y = (clientY - previous.top) / scale;
    scale = Math.min(3, Math.max(Math.min(fitScale(), 1), newScale));
    map.style.width = `${width * scale}px`;
    map.style.height = `${height * scale}px`;
    const current = map.getBoundingClientRect();
    viewport.scrollLeft += current.left + x * scale - clientX;
    viewport.scrollTop += current.top + y * scale - clientY;
    get("map-zoom").textContent = `${Math.round(scale * 100)}%`;
    get("map-minus").disabled = scale <= fitScale() + 0.001;
    get("map-plus").disabled = scale >= 3;
  }

  function fit() {
    fitMode = true;
    zoom(fitScale());
    viewport.scrollTo(0, 0);
  }

  function step(factor, x, y) {
    fitMode = false;
    zoom(scale * factor, x, y);
  }

  get("fit-map").addEventListener("click", fit);
  get("read-size").addEventListener("click", () => {
    fitMode = false;
    zoom(1.5);
    viewport.scrollTo({ left: Math.min(viewport.scrollWidth, 310 * scale), top: 0 });
  });
  get("map-minus").addEventListener("click", () => step(1 / 1.35));
  get("map-plus").addEventListener("click", () => step(1.35));
  const fullscreen = get("map-fullscreen");
  fullscreen.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.requestFullscreen();
    } catch {
      message("Full screen is unavailable in this browser.");
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const name = document.fullscreenElement ? "Exit full screen" : "Full screen";
    fullscreen.title = name;
    fullscreen.setAttribute("aria-label", name);
  });
  if (!shell.requestFullscreen) fullscreen.hidden = true;

  new ResizeObserver(() => { if (fitMode) fit(); }).observe(viewport);
  viewport.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    step(event.deltaY < 0 ? 1.12 : 1 / 1.12, event.clientX, event.clientY);
  }, { passive: false });

  let drag;
  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest('[role="button"]')) return;
    if (!map.contains(event.target) && event.target !== get("lesson-sheet")) return;
    drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!drag) return;
    viewport.classList.add("is-panning");
    viewport.scrollTo(drag.left + drag.x - event.clientX, drag.top + drag.y - event.clientY);
  });
  viewport.addEventListener("lostpointercapture", () => {
    drag = undefined;
    viewport.classList.remove("is-panning");
  });
  map.addEventListener("focusin", (event) => {
    const bounds = event.target.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    if (bounds.left < frame.left || bounds.right > frame.left + viewport.clientWidth
      || bounds.top < frame.top || bounds.bottom > frame.top + viewport.clientHeight) {
      event.target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  });
  fit();
}

try {
  const response = await fetch("./assets/article02-map.svg?v=source-map-2");
  if (!response.ok) throw new Error(`Reading map returned ${response.status}`);
  const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml").documentElement;
  if (svg.localName !== "svg") throw new Error("Invalid reading map");
  const map = document.importNode(svg, true);
  get("lesson-sheet").append(map);
  initialize(map);
} catch (error) {
  console.error(error);
  message("The reading map could not load. Reload the page to try again.");
} finally {
  viewport.removeAttribute("aria-busy");
}
