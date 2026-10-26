/** Load source artwork only when its page comes into view. */
export function initUnitTheoryArt(root) {
  const artwork = [...root.querySelectorAll('.ut-native-art[data-src]')];
  if (!('IntersectionObserver' in window)) {
    artwork.forEach(node => { node.data = node.dataset.src; });
    return () => {};
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const node = entry.target;
      node.data = node.dataset.src;
      observer.unobserve(node);
    }
  }, { rootMargin: '800px' });
  artwork.forEach(node => observer.observe(node));
  return () => observer.disconnect();
}
