/* Shared header & footer for Elfen lied, injected on every page.
   Works over file:// (no fetch). */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var ICON = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.3L2.8 11.6c-.9.4-.9 1.6.1 1.9l4.7 1.5 1.8 5.6c.2.6 1 .8 1.5.3l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6L23 5.6c.2-.9-.7-1.7-1.5-1.3z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-2.5 13.5c.2 1 .8 3.6 1 4.4.1.5.5.6.8.1.4-.7 1.6-3 2.2-4.4A7 7 0 0 0 12 2zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>'
  };

  function nav(active) {
    function a(href, label, key, icon) {
      return '<li><a href="' + href + '"' + (active === key ? ' class="is-active"' : '') + '>' +
        (icon ? icon + ' ' : '') + label + '</a></li>';
    }
    return '<nav class="main-nav" id="mainNav"><ul>' +
      a('index.html#catalog', 'Каталог', 'catalog', ICON.grid) +
      a('index.html#blog', 'Блог', 'blog', '') +
      a('index.html#footer', 'Контакты', 'contacts', '') +
    '</ul></nav>';
  }

  function headerHTML(active) {
    return '' +
    '<header class="site-header"><div class="container"><div class="site-header__inner">' +
      '<a class="logo" href="index.html">Elfen lied</a>' +
      nav(active) +
      '<div class="header-actions">' +
        '<form class="search-box" data-search><span>' + ICON.search + '</span><input type="text" placeholder="Поиск" aria-label="Поиск" /></form>' +
        '<div class="icon-cluster">' +
          '<a href="index.html#catalog" aria-label="Избранное">' + ICON.heart + '</a>' +
          '<a href="index.html#footer" aria-label="Профиль">' + ICON.user + '</a>' +
          '<a class="badge" href="index.html#catalog" aria-label="Корзина">' + ICON.bag + '<span data-cart-count>3</span></a>' +
          '<button class="burger" id="burger" aria-label="Меню"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
        '</div>' +
      '</div>' +
    '</div></div></header>';
  }

  function col(title, links) {
    return '<div class="footer-col"><h4>' + title + '</h4>' +
      links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('') + '</div>';
  }

  function footerHTML() {
    return '' +
    '<footer class="site-footer" id="footer"><div class="container site-footer__inner">' +
      '<div class="site-footer__top">' +
        '<div class="footer-brand">' +
          '<a class="logo" href="index.html">Elfen lied</a>' +
          '<p>Дизайнерский декор, который превращает интерьер в искусство.</p>' +
        '</div>' +
        col('Каталог', [['Напольные зеркала', 'index.html#catalog'], ['Торшеры и лампы', 'index.html#catalog'], ['Кресла и стулья', 'index.html#catalog'], ['Столы и тумбы', 'index.html#catalog']]) +
        col('Компания', [['О нас', 'index.html#catalog'], ['Блог', 'index.html#blog'], ['Доставка', '#'], ['Контакты', 'index.html#footer']]) +
        col('Контакты', [['+7 495 737-06-01', 'tel:+74957370601'], ['hello@elfenlied.ru', 'mailto:hello@elfenlied.ru'], ['Москва, ул. 3-я Хорошевская, 2', '#']]) +
      '</div>' +
      '<div class="site-footer__bottom">' +
        '<span>© 2023 Elfen lied. Creating a great art.</span>' +
        '<div class="socials">' +
          '<a href="#" aria-label="Instagram">' + ICON.ig + '</a>' +
          '<a href="#" aria-label="Telegram">' + ICON.tg + '</a>' +
          '<a href="#" aria-label="Pinterest">' + ICON.pin + '</a>' +
        '</div>' +
      '</div>' +
    '</div></footer>';
  }

  window.ElfenUI = { ICON: ICON };

  document.addEventListener("DOMContentLoaded", function () {
    var h = document.querySelector("[data-header]");
    if (h) h.outerHTML = headerHTML(h.getAttribute("data-header"));
    var f = document.querySelector("[data-footer]");
    if (f) f.outerHTML = footerHTML();

    var burger = document.getElementById("burger");
    var mnav = document.getElementById("mainNav");
    if (burger && mnav) burger.addEventListener("click", function () { mnav.classList.toggle("open"); });
  });
})();
