(() => {
  'use strict';
  const canvas = document.querySelector('#hero-wind');
  SeaMotion(canvas, 'assets/shore-wide.png', {
    strength: 1,
    autoplay: true
  });
})();
