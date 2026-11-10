const filterButtons = [...document.querySelectorAll('[data-filter]')];
const bookCards = [...document.querySelectorAll('.book-card')];
const filterStatus = document.querySelector('#filter-status');

function selectFilter(category) {
  let visible = 0;
  for (const card of bookCards) {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible += 1;
  }
  for (const button of filterButtons) {
    const selected = button.dataset.filter === category;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  filterStatus.textContent = `Showing ${visible} ${visible === 1 ? 'book' : 'books'}.`;
}

for (const button of filterButtons) {
  button.addEventListener('click', () => selectFilter(button.dataset.filter));
}

const preview = document.querySelector('#book-preview');
const previewImage = preview.querySelector('.book-preview__cover');
const previewTitle = preview.querySelector('#preview-title');
const previewSubtitle = preview.querySelector('#preview-subtitle');

document.querySelector('#book-grid').addEventListener('click', event => {
  const card = event.target.closest('[data-preview]');
  if (!card) return;
  const image = card.querySelector('img');
  previewImage.src = image.currentSrc || image.src;
  previewImage.alt = image.alt;
  previewTitle.textContent = card.querySelector('.book-card__caption strong').textContent;
  previewSubtitle.textContent = card.querySelector('.book-card__caption small').textContent;
  preview.showModal();
});

preview.querySelector('.book-preview__close').addEventListener('click', () => preview.close());
preview.addEventListener('click', event => {
  if (event.target === preview) preview.close();
});
