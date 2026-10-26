/** Keep the source layout while allowing inline translations to grow naturally. */
export function initUnitThreeQuotes(root) {
  const slides = [...root.querySelectorAll('.u3-native-slide:has(.u3-quote)')];
  const widths = new WeakMap();
  let frame = 0;
  let disposed = false;
  function layout() {
    frame = 0;
    for (const slide of slides) {
      const width = slide.clientWidth;
      if (!width) continue;
      const objects = [...slide.querySelectorAll('[data-u3-y]')];
      const groups = [...slide.querySelectorAll('.u3-transform')].filter(node => !node.parentElement.closest('.u3-transform'));
      // Reset first so measuring a rotated decoration never includes last toggle's movement.
      objects.forEach(node => { node.style.top = `${Number(node.dataset.u3Y) * width}px`; });
      groups.forEach(node => { node.style.translate = ''; });
      const bounds = slide.getBoundingClientRect();
      const quotes = objects.filter(node => node.classList.contains('u3-quote-object'));
      const expansion = quotes.map(node => ({
        node,
        y: Number(node.dataset.u3Y) * width,
        x: Number(node.dataset.u3X) * width,
        right: (Number(node.dataset.u3X) + Number(node.dataset.u3Width)) * width,
        growth: node.querySelector('.u3-quote[open]')
          ? Math.max(0, node.getBoundingClientRect().height - Number(node.dataset.u3Height) * width) : 0,
      }));
      const units = objects.filter(node => !node.parentElement.closest('.u3-transform')).map(node => ({
        node, group: false, y: Number(node.dataset.u3Y) * width,
        x: Number(node.dataset.u3X) * width,
        right: (Number(node.dataset.u3X) + Number(node.dataset.u3Width)) * width,
      }));
      for (const node of groups) {
        const rects = [...node.querySelectorAll('[data-u3-y]')].map(child => child.getBoundingClientRect());
        if (rects.length) units.push({node, group: true,
          y: Math.min(...rects.map(rect => rect.top)) - bounds.top,
          x: Math.min(...rects.map(rect => rect.left)) - bounds.left,
          right: Math.max(...rects.map(rect => rect.right)) - bounds.left,
        });
      }
      for (const item of units) {
        const shift = expansion.reduce((sum, quote) => sum + (
          quote.node !== item.node && item.y > quote.y + .1 &&
          (item.group || (item.right > quote.x && item.x < quote.right)) ? quote.growth : 0
        ), 0);
        if (item.group) item.node.style.translate = `0 ${shift}px`;
        else item.node.style.top = `${item.y + shift}px`;
      }
      const extra = expansion.reduce((sum, quote) => sum + quote.growth, 0);
      const openQuotes = quotes.filter(node => node.querySelector('.u3-quote[open]'));
      const bottom = Math.max(0, ...openQuotes.map(node => node.getBoundingClientRect().bottom - bounds.top + 12));
      slide.style.height = openQuotes.length ? `${Math.max(width * 9 / 16 + extra, bottom)}px` : '';
    }
  }
  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(layout);
  }
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (widths.get(entry.target) !== entry.contentRect.width) {
        widths.set(entry.target, entry.contentRect.width);
        schedule();
      }
    }
  });
  slides.forEach(slide => observer.observe(slide));
  root.addEventListener('toggle', schedule, true);
  document.fonts.ready.then(schedule);
  schedule();
  return () => {
    disposed = true;
    observer.disconnect();
    root.removeEventListener('toggle', schedule, true);
    cancelAnimationFrame(frame);
  };
}
