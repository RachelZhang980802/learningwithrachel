(() => {
  const install = () => {
    if (!document.querySelector('link[data-shared-navigation],link[href*="shared-navigation.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/western-culture/shared-navigation.css';
      link.dataset.sharedNavigation = 'true';
      document.head.append(link);
    }

    const nav = document.querySelector('nav.glass-nav');
    if (nav) {
      nav.classList.add('shared-glass-nav');
      if (!nav.closest('.review-site-header') && !nav.querySelector('.shared-nav-brand')) {
        const brand = document.createElement('a');
        brand.className = 'shared-nav-brand';
        brand.href = '/';
        brand.setAttribute('aria-label', 'NegentropyLearning home');
        brand.innerHTML = '<img src="https://assets.negentropylearning.com.cn/media/brand/fat-cat-wordmark.png" alt=""><span>NegentropyLearning</span>';
        const highlight = nav.querySelector('.nav-highlight');
        if (highlight?.nextSibling) nav.insertBefore(brand, highlight.nextSibling);
        else nav.prepend(brand);
      }
    }

    const reviewHeader = document.querySelector('.review-site-header');
    const reviewBrand = reviewHeader?.querySelector('.review-brand');
    if (reviewHeader && reviewBrand && !reviewBrand.querySelector('img')) {
      reviewHeader.classList.add('shared-review-header');
      reviewBrand.innerHTML = '<img src="https://assets.negentropylearning.com.cn/media/brand/fat-cat-wordmark.png" alt=""><span>NegentropyLearning<br>Western Culture</span>';
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
