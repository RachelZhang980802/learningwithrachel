// Keep the live question exactly over the printed search field as the artwork crops.
function positionSearchQuestion() {
  const hero = document.querySelector('.hero');
  const question = document.querySelector('.hero-search');
  if (!hero || !question) return;
  const width = hero.clientWidth;
  const height = hero.clientHeight;
  const scale = Math.max(width / 736, height / 736);
  const rendered = 736 * scale;
  const cropX = (width - rendered) / 2;
  const cropY = (height - rendered) * 0.5;
  const searchLeft = cropX + 116 * scale;
  const searchTop = cropY + 311 * scale;
  question.style.left = `${Math.max(14, searchLeft)}px`;
  question.style.top = `${searchTop}px`;
  question.style.width = `${Math.min(width - 28, 507 * scale)}px`;
  question.style.height = `${38 * scale}px`;
}
positionSearchQuestion();
window.addEventListener('resize', positionSearchQuestion);
