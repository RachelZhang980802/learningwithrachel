(() => {
  document.querySelectorAll('.glass-nav a').forEach(link => {
    const destinations = { Greece: 'greece-rome.html#chapter-greece-1', Rome: 'greece-rome.html#chapter-rome-3' };
    const destination = destinations[link.textContent.trim()];
    if (destination) link.href = destination;
  });
  const nav = document.querySelector('.glass-nav');
  if (!nav) return;
  const items = [...nav.querySelectorAll('.nav-item')];
  const defaultItem = items.find(item => item.getAttribute('aria-current') === 'page') || items[0];
  let selected = defaultItem;
  const highlight = item => {
    nav.style.setProperty('--highlight-x', `${item.offsetLeft}px`);
    nav.style.setProperty('--highlight-width', `${item.offsetWidth}px`);
  };
  const syncSelection = () => {
    selected = items.find(item => item.pathname === location.pathname && item.hash && item.hash === location.hash) || defaultItem;
    items.forEach(item => {
      if (item === selected) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    highlight(selected);
  };
  items.forEach(item => {
    item.addEventListener('pointerenter', () => highlight(item));
    item.addEventListener('focus', () => highlight(item));
  });
  nav.addEventListener('pointerleave', () => highlight(selected));
  nav.addEventListener('focusout', () => requestAnimationFrame(() => highlight(selected)));
  nav.addEventListener('click', () => requestAnimationFrame(syncSelection));
  addEventListener('hashchange', syncSelection);
  addEventListener('popstate', syncSelection);
  new ResizeObserver(() => highlight(selected)).observe(nav);
  document.fonts.ready.then(() => highlight(selected));
  syncSelection();
})();
