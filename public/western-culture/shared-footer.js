(() => {
  const install = () => {
    const existing = [...document.querySelectorAll('footer.university-footer, footer.review-site-footer, footer.quiz-footer, footer#site-footer')];
    // Embedded lessons use the parent app's footer, once, below the frame.
    if (window.self !== window.top) {
      existing.forEach(footer => footer.remove());
      return;
    }
    if (!document.querySelector('link[data-shared-campus-footer]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/western-culture/shared-footer.css';
      link.dataset.sharedCampusFooter = 'true';
      document.head.append(link);
    }
    if (location.pathname.startsWith('/mindmaps/')) document.documentElement.classList.add('standalone-mindmap');
    const footer = existing.shift() || document.createElement('footer');
    existing.forEach(duplicate => duplicate.remove());
    footer.id = 'site-footer';
    footer.className = 'library-footer';
    footer.setAttribute('aria-label', 'China West Normal University');
    footer.innerHTML = `
      <div class="library-footer-identity">
        <span><strong>CHINA WEST NORMAL</strong><em>UNIVERSITY</em></span>
        <img src="/western-culture/allusions-assets/university-seal.png" width="78" height="78" alt="China West Normal University seal">
      </div>
      <div class="library-footer-registrations">
        <small>© 2026 China West Normal University</small>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">蜀ICP备2026060108号</a>
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=51010502015976" target="_blank" rel="noopener noreferrer">川公网安备51010502015976号</a>
      </div>`;
    document.body.append(footer);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
