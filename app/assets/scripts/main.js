'use strict';

var menuWrapper = document.querySelector('[data-hook="menu:wrapper"]');
var menuToggle = menuWrapper.querySelector('[data-hook="menu:toggle"]');

menuToggle.addEventListener('click', (e) => {
  e.preventDefault();
  menuWrapper.classList.toggle('pb--revealed');
});
