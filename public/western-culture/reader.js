(() => {
  if (location.hash === '#question-list') {
    location.replace(new URL('question-list.html', location.href));
    return;
  }
  const tabs = [...document.querySelectorAll('[data-work]')];
  const select = tab => {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    }
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') index = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index === undefined) return;
      event.preventDefault(); select(tabs[index]); tabs[index].focus();
    });
  });
  const dialog = document.querySelector('.image-dialog');
  let origin;
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    origin = button;
    const img = button.querySelector('img');
    dialog.querySelector('img').src = img.src;
    dialog.querySelector('img').alt = img.alt;
    dialog.querySelector('p').textContent = button.closest('figure').querySelector('figcaption').textContent;
    dialog.showModal();
  }));
  dialog.querySelector('.image-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => origin?.focus());
  const ids = ['concepts', 'images', 'dialogue', 'study'];
  const labels = ['Concepts', 'Art & Symbols', 'Ideas & Dialogue', 'Study Guide'];
  const panels = [...document.querySelectorAll('.chapter, .utility-view')];
  const chapterLinks = [...document.querySelectorAll('[data-chapter]')];
  const pager = document.querySelector('.lesson-pagination');
  let currentChapter = 'concepts';
  const navigate = (hash, scroll = true, focus = false) => {
    const id = decodeURIComponent((hash || '').replace(/^#/, ''));
    const target = document.getElementById(id);
    const panel = target?.closest('.chapter, .utility-view') || document.getElementById('concepts');
    const opening = !id || id === 'opening-title' || id === 'reading';
    document.body.classList.toggle('in-lesson', !opening);
    document.body.classList.add('lesson-ready');
    panels.forEach(p => { p.hidden = p !== panel; });
    const index = ids.indexOf(panel.id);
    if (index >= 0) currentChapter = panel.id;
    document.body.dataset.chapter = currentChapter;
    chapterLinks.forEach(link => {
      const active = link.dataset.chapter === panel.id;
      if (active) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
    });
    const previous = pager.querySelector('[data-previous]');
    const next = pager.querySelector('[data-next]');
    const position = pager.querySelector('.lesson-position');
    if (index >= 0) {
      previous.href = index > 0 ? `#${ids[index - 1]}` : '#opening-title';
      previous.textContent = index > 0 ? `← ${labels[index - 1]}` : '← Opening';
      next.href = index < 3 ? `#${ids[index + 1]}` : '#terms';
      next.textContent = index < 3 ? `${labels[index + 1]} →` : 'Review terminology →';
      position.textContent = `0${index + 1} / 04 · ${labels[index]}`;
    } else {
      previous.href = `#${currentChapter}`; previous.textContent = '← Back to the lesson';
      next.href = '#opening-title'; next.textContent = 'Opening →';
      position.textContent = panel.id === 'terms' ? 'Terminology' : panel.id === 'question-list' ? 'Question List' : 'Sources & notes';
    }
    if (scroll) requestAnimationFrame(() => {
      const destination = opening ? document.querySelector('.opening') : (target || panel);
      destination.scrollIntoView({behavior:'instant', block:'start'});
      if (focus && !opening) {
        if (!destination.hasAttribute('tabindex')) destination.tabIndex = -1;
        destination.focus({preventScroll:true});
      }
    });
  };
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (!document.getElementById(link.hash.slice(1))) return;
    event.preventDefault(); history.pushState(null, '', link.hash); navigate(link.hash, true, true);
  }));
  addEventListener('popstate', () => navigate(location.hash));
  addEventListener('hashchange', () => navigate(location.hash));
  navigate(location.hash, Boolean(location.hash));
  const help = document.querySelector('.language-help');
  help.addEventListener('click', () => {
    const enabled = help.getAttribute('aria-pressed') !== 'true';
    help.setAttribute('aria-pressed', String(enabled));
    help.querySelector('span').textContent = enabled ? 'ON' : 'OFF';
    document.body.classList.toggle('show-chinese', enabled);
  });
  const chips = [...document.querySelectorAll('[data-gloss]')];
  chips.forEach((chip, i) => {
    const note = document.createElement('span');
    note.className = 'term-gloss'; note.id = `gloss-${i}`; note.lang = 'zh-CN'; note.hidden = true;
    note.textContent = chip.dataset.gloss;
    chip.setAttribute('aria-controls', note.id); chip.after(note);
    chip.addEventListener('click', () => {
      const expanded = chip.getAttribute('aria-expanded') !== 'true';
      chip.setAttribute('aria-expanded', String(expanded)); note.hidden = !expanded;
    });
    chip.addEventListener('keydown', event => {
      if (event.key === 'Escape') {chip.setAttribute('aria-expanded','false');note.hidden=true;}
    });
  });
})();
