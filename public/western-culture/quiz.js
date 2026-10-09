(() => {
  const root = document.querySelector('[data-quiz-root]');
  const stage = document.querySelector('.quiz-app');
  const tabs = [...document.querySelectorAll('[data-quiz-chapter]')];
  const questionViewport = document.querySelector('.quiz-question-viewport');
  const progress = document.querySelector('[data-quiz-progress]');
  const progressLabel = document.querySelector('[data-quiz-progress-label]');
  const chapterLabel = document.querySelector('[data-quiz-chapter-label]');
  const art = document.querySelector('[data-quiz-art]');
  if (!root || !stage || !questionViewport || !progress) return;

  const dataUrl = new URL('assets/quiz-data.json', document.baseURI);
  const chapterArts = {
    one: 'https://assets.negentropylearning.com.cn/western-culture/assets/quiz/chapter-one-art-transparent.png',
    two: 'https://assets.negentropylearning.com.cn/western-culture/assets/quiz/chapter-two-continuous-sea.png',
    three: 'https://assets.negentropylearning.com.cn/western-culture/assets/quiz/chapter-three-art-transparent.png',
    four: 'https://assets.negentropylearning.com.cn/western-culture/assets/quiz/chapter-four-art-transparent.png'
  };
  const scrollCueAsset = 'https://assets.negentropylearning.com.cn/western-culture/assets/quiz/three-crossed-arrows-down.png';
  const escapeHtml = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  let chapters = [];
  let activeChapter = 'one';
  let activeIndex = 0;
  let answerRevealed = false;
  let wheelLockedUntil = 0;

  const getChapter = id => chapters.find(chapter => chapter.id === id) || chapters[0];
  const currentChapter = () => getChapter(activeChapter);
  const answerLetters = answer => String(answer || '').toUpperCase().match(/[A-D]/g) || [];

  function renderQuestion(item, index) {
    const number = index + 1;
    const letters = answerLetters(item.answer);
    const options = item.options.map((option, optionIndex) => {
      const letter = String.fromCharCode(65 + optionIndex);
      const correct = letters.includes(letter);
      return `<li class="${correct ? 'is-answer' : ''}" data-option-letter="${letter}">
        <span class="quiz-option-letter">${letter}</span><span class="quiz-option-text">${escapeHtml(option)}</span>
      </li>`;
    }).join('');

    return `<article class="quiz-question ${answerRevealed ? 'is-revealed' : ''}" data-quiz-question>
      <button class="quiz-question-trigger" type="button" data-quiz-toggle aria-pressed="${answerRevealed}" aria-label="${answerRevealed ? 'Hide' : 'Show'} the correct answer">
        <span class="quiz-question-kicker">Question ${String(item.number || number).padStart(2, '0')}</span>
        <span class="quiz-question-copy">${escapeHtml(item.question)}</span>
      </button>
      <ol class="quiz-options" aria-label="Answer options">${options}</ol>
      <img class="quiz-down-cue" src="${scrollCueAsset}" alt="" aria-hidden="true">
    </article>`;
  }

  function updateProgress(chapter, index) {
    const total = chapter.questions.length;
    const displayNumber = index + 1;
    progress.max = String(total);
    progress.value = String(displayNumber);
    progress.style.setProperty('--quiz-progress', `${total <= 1 ? 100 : ((index / (total - 1)) * 100).toFixed(2)}%`);
    if (progressLabel) progressLabel.textContent = `${String(displayNumber).padStart(2, '0')} / ${total}`;
    if (chapterLabel) chapterLabel.textContent = chapter.label;
  }

  function setQuestion(index, { focus = false } = {}) {
    const chapter = currentChapter();
    if (!chapter || !chapter.questions.length) return;
    activeIndex = Math.max(0, Math.min(index, chapter.questions.length - 1));
    answerRevealed = false;
    const item = chapter.questions[activeIndex];
    const complexity = String(item.question || '').length + item.options.reduce((total, option) => total + String(option).length, 0);
    stage.classList.toggle('is-long-question', complexity > 420);
    root.innerHTML = renderQuestion(item, activeIndex);
    updateProgress(chapter, activeIndex);
    questionViewport.scrollTop = 0;
    if (focus) questionViewport.focus({ preventScroll: true });
  }

  function renderChapter(id) {
    const chapter = getChapter(id);
    if (!chapter) return;
    activeChapter = chapter.id;
    activeIndex = 0;
    answerRevealed = false;
    stage.dataset.scene = chapter.id;
    if (art) {
      art.src = chapterArts[chapter.id] || chapterArts.one;
      art.alt = `${chapter.label} hand-drawn illustration`;
    }
    tabs.forEach(tab => {
      const selected = tab.dataset.quizChapter === activeChapter;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    setQuestion(0);
  }

  function canScrollInsideQuestion(deltaY) {
    const question = root.querySelector('[data-quiz-question]');
    if (!question || question.scrollHeight <= question.clientHeight + 2) return false;
    if (deltaY > 0) return question.scrollTop < question.scrollHeight - question.clientHeight - 2;
    return question.scrollTop > 2;
  }

  function changeBy(delta) {
    const chapter = currentChapter();
    if (!chapter) return;
    const next = Math.max(0, Math.min(activeIndex + delta, chapter.questions.length - 1));
    if (next !== activeIndex) setQuestion(next, { focus: true });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderChapter(tab.dataset.quizChapter));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      renderChapter(tabs[nextIndex].dataset.quizChapter);
    });
  });

  progress.addEventListener('input', () => setQuestion(Number(progress.value) - 1));
  root.addEventListener('click', event => {
    const trigger = event.target.closest('[data-quiz-toggle]');
    if (!trigger) return;
    answerRevealed = !answerRevealed;
    root.innerHTML = renderQuestion(currentChapter().questions[activeIndex], activeIndex);
    updateProgress(currentChapter(), activeIndex);
    root.querySelector('[data-quiz-toggle]')?.focus({ preventScroll: true });
  });

  window.addEventListener('wheel', event => {
    if (event.target.closest('a, input, .quiz-nav, .quiz-footer')) return;
    const deltaY = event.deltaY;
    if (!deltaY || canScrollInsideQuestion(deltaY)) return;
    event.preventDefault();
    const now = performance.now();
    if (now < wheelLockedUntil) return;
    wheelLockedUntil = now + 560;
    changeBy(deltaY > 0 ? 1 : -1);
  }, { passive: false });

  questionViewport.addEventListener('keydown', event => {
    if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      changeBy(1);
    } else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault();
      changeBy(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setQuestion(0, { focus: true });
    } else if (event.key === 'End') {
      event.preventDefault();
      setQuestion(currentChapter().questions.length - 1, { focus: true });
    }
  });

  fetch(dataUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Quiz data request failed: ${response.status}`);
      return response.json();
    })
    .then(payload => {
      chapters = payload.map(chapter => ({ ...chapter, total: chapter.questions.length }));
      renderChapter(activeChapter);
    })
    .catch(error => {
      root.innerHTML = `<p class="quiz-error">Quiz data could not be loaded. ${escapeHtml(error.message)}</p>`;
    });
})();
