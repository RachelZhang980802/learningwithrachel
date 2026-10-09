(() => {
  'use strict';
  const canvas = document.querySelector('#hero-wind');
  SeaMotion(canvas, 'https://assets.negentropylearning.com.cn/western-culture/assets/shore-wide.png', {
    strength: 1,
    autoplay: true
  });
})();
