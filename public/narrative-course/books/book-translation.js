/** Shared, synchronous English/Chinese bookmark for the five writing readers. */
let nextBookmark = 0;

export function createBookTranslation(scope) {
  const doc = scope.ownerDocument;
  const viewport = doc.defaultView;
  if (!doc.getElementById('book-translation-style')) {
    const style = doc.createElement('link');
    style.id = 'book-translation-style';
    style.rel = 'stylesheet';
    style.href = new URL('book-translation.css?v=20261111-bookmark', import.meta.url).href;
    doc.head.append(style);
  }

  const id = 'book-translation-' + ++nextBookmark;
  const panel = doc.createElement('aside');
  panel.id = id;
  panel.className = 'book-translation';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', id + '-en');
  panel.setAttribute('aria-describedby', id + '-zh');
  panel.innerHTML = '<div class="book-translation__heading"><span lang="zh-CN">中文释义</span><button type="button" class="book-translation__close" aria-label="关闭翻译">×</button></div>'
    + '<p class="book-translation__en" lang="en"></p><p class="book-translation__zh" lang="zh-CN"></p>';
  const english = panel.querySelector('.book-translation__en');
  const chinese = panel.querySelector('.book-translation__zh');
  const dismiss = panel.querySelector('.book-translation__close');
  english.id = id + '-en';
  chinese.id = id + '-zh';
  doc.body.append(panel);

  let selected = null;

  function close(restoreFocus = false) {
    const previous = selected;
    panel.hidden = true;
    selected = null;
    if (!previous) return;
    for (const fragment of previous.fragments) {
      fragment.classList.remove('is-book-translation-active');
      fragment.removeAttribute('aria-controls');
      fragment.setAttribute('aria-expanded', 'false');
    }
    if (restoreFocus && previous.button.isConnected) previous.button.focus({preventScroll: true});
  }

  function position(clientX) {
    if (!selected) return;
    const button = selected.button;
    const rect = button.getBoundingClientRect();
    if (!button.isConnected || rect.bottom < 0 || rect.top > viewport.innerHeight
        || rect.right < 0 || rect.left > viewport.innerWidth) {
      close();
      return;
    }
    const {width, height} = panel.getBoundingClientRect();
    const gap = 12;
    const center = Number.isFinite(clientX) ? clientX : rect.left + rect.width / 2;
    const left = Math.max(gap, Math.min(viewport.innerWidth - width - gap, center - width / 2));
    const below = rect.bottom + gap;
    const preferredTop = below + height <= viewport.innerHeight - gap ? below : rect.top - height - gap;
    const top = Math.max(gap, Math.min(viewport.innerHeight - height - gap, preferredTop));
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  function toggle(entry, button, event) {
    if (!entry?.en || !entry.zh) return;
    if (selected?.id === entry.id) {
      close(event?.detail === 0);
      return;
    }
    close();
    const related = [...scope.querySelectorAll('[data-book-translation-key="' + CSS.escape(entry.id) + '"]')];
    const fragments = related.includes(button) ? related : [...related, button];
    selected = {id: entry.id, button, fragments};
    for (const fragment of fragments) {
      fragment.classList.add('is-book-translation-active');
      fragment.setAttribute('aria-expanded', 'true');
      fragment.setAttribute('aria-controls', id);
    }
    english.textContent = entry.en;
    chinese.textContent = entry.zh;
    panel.scrollTop = 0;
    panel.hidden = false;
    position(event?.detail ? event.clientX : undefined);
    if (event?.detail === 0 && !panel.hidden) dismiss.focus({preventScroll: true});
  }

  function outside(event) {
    if (!selected) return;
    const path = event.composedPath();
    if (!path.includes(panel) && !selected.fragments.some(fragment => path.includes(fragment))) close();
  }

  function escape(event) {
    if (event.key !== 'Escape' || !selected) return;
    event.preventDefault();
    event.stopPropagation();
    close(true);
  }

  function follow(event) {
    if (!event.target?.nodeType || !panel.contains(event.target)) position();
  }

  dismiss.addEventListener('click', () => close(true));
  doc.addEventListener('pointerdown', outside, true);
  doc.addEventListener('keydown', escape, true);
  doc.addEventListener('scroll', follow, true);
  viewport.addEventListener('resize', follow);

  return {
    get currentId() { return selected?.id ?? null; },
    close,
    toggle,
    destroy() {
      close();
      doc.removeEventListener('pointerdown', outside, true);
      doc.removeEventListener('keydown', escape, true);
      doc.removeEventListener('scroll', follow, true);
      viewport.removeEventListener('resize', follow);
      panel.remove();
    },
  };
}
