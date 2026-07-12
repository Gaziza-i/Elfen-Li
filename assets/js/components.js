/* Shared header & footer, injected on every page.
   Works over file:// because it uses no fetch. */
(function () {
  "use strict";

  // Mark JS as available so reveal-animations only hide content when they can be shown.
  document.documentElement.classList.add("js");

  var ICON = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7l8-4 8 4v10l-8 4-8-4V7z"/><path d="M12 3v18M4 7l8 4 8-4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.3L2.8 11.6c-.9.4-.9 1.6.1 1.9l4.7 1.5 1.8 5.6c.2.6 1 .8 1.5.3l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6L23 5.6c.2-.9-.7-1.7-1.5-1.3z"/></svg>',
    vk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 17c-5 0-8.3-3.5-8.4-9.2h2.6c.1 4.2 2 6 3.5 6.4V7.8h2.5v3.7c1.5-.2 3-1.8 3.5-3.7h2.5c-.4 2.3-2 3.9-3.1 4.6 1.1.6 2.9 2 3.6 4.6h-2.7c-.5-1.8-1.9-3.1-3.8-3.4V17H13z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C16.1 4.8 12 4.8 12 4.8h0s-4.1 0-7.1.2c-.4 0-1.3.1-2.1.9C2.2 6.5 2 8 2 8s-.2 1.7-.2 3.5v1c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 6.8.2 6.8.2s4.1 0 7.1-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5v-1C22.2 9.7 22 8 22 8zM10 14.6V9.4l4.2 2.6L10 14.6z"/></svg>'
  };

  function headerHTML(active) {
    function link(href, label, key) {
      return '<li><a href="' + href + '"' + (active === key ? ' class="is-active"' : '') + '>' + label + '</a></li>';
    }
    return '' +
    '<header class="site-header">' +
      '<div class="container site-header__inner">' +
        '<a class="logo" href="index.html">' +
          '<span class="logo__mark">' + ICON.logo + '</span>' +
          '<span class="logo__text">Dell Store</span>' +
        '</a>' +
        '<nav class="main-nav" id="mainNav"><ul>' +
          link('index.html', 'Главная', 'home') +
          link('catalog.html', 'Каталог', 'catalog') +
          link('index.html#contacts', 'Контакты', 'contacts') +
        '</ul></nav>' +
        '<div class="header-actions">' +
          '<button class="icon-btn icon-btn--search" aria-label="Поиск" data-toast="Поиск скоро появится">' + ICON.search + '</button>' +
          '<a class="icon-btn icon-btn--hide-sm" href="account.html" aria-label="Профиль">' + ICON.user + '</a>' +
          '<a class="icon-btn icon-btn--hide-sm" href="account.html" aria-label="Избранное">' + ICON.heart + '</a>' +
          '<a class="icon-btn" href="account.html" aria-label="Корзина">' + ICON.bag + '<span class="icon-btn__badge" data-cart-count>3</span></a>' +
          '<button class="icon-btn burger" id="burger" aria-label="Меню">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  function footerCol(title, links) {
    var items = links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('');
    return '<div class="footer-col"><h4>' + title + '</h4>' + items + '</div>';
  }

  function footerHTML() {
    return '' +
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="site-footer__top">' +
          '<div class="footer-brand">' +
            '<a class="logo" href="index.html"><span class="logo__mark">' + ICON.logo + '</span><span class="logo__text">Dell Store</span></a>' +
            '<p>Официальный партнёр Dell в России и странах СНГ.</p>' +
          '</div>' +
          footerCol('Каталог', [
            ['Ноутбуки', 'laptops.html'], ['Персональные компьютеры', 'catalog.html'],
            ['Серверы', 'catalog.html'], ['Dell EMC', 'catalog.html'],
            ['Запасные части к Dell EMC', 'catalog.html']
          ]) +
          footerCol('Личный кабинет', [
            ['Профиль', 'account.html'], ['История заказов', 'account.html'],
            ['SMS-уведомления', 'account.html'], ['Избранное', 'account.html'],
            ['Сравнение товаров', 'account.html']
          ]) +
          footerCol('Помощь', [
            ['Доставка и оплата', 'catalog.html'], ['Контакты', 'index.html#contacts'],
            ['FAQ', '#'], ['Наш АСЦ', '#']
          ]) +
        '</div>' +
        '<div class="site-footer__bottom">' +
          '<div class="foot-info"><span>Адрес</span><span>Москва, ул. 3-я Хорошевская, дом 2, строение 1</span></div>' +
          '<div class="foot-info"><span>Телефон</span><span>+7 495 737-06-01</span></div>' +
          '<div class="foot-info"><span>E-mail</span><span>dell_ru@gmail.com</span></div>' +
          '<div class="socials">' +
            '<a href="#" aria-label="Telegram">' + ICON.tg + '</a>' +
            '<a href="#" aria-label="VK">' + ICON.vk + '</a>' +
            '<a href="#" aria-label="YouTube">' + ICON.yt + '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  window.DellUI = { ICON: ICON };

  document.addEventListener("DOMContentLoaded", function () {
    var h = document.querySelector("[data-header]");
    if (h) h.outerHTML = headerHTML(h.getAttribute("data-header"));
    var f = document.querySelector("[data-footer]");
    if (f) f.outerHTML = footerHTML();

    // burger toggle
    var burger = document.getElementById("burger");
    var nav = document.getElementById("mainNav");
    if (burger && nav) {
      burger.addEventListener("click", function () { nav.classList.toggle("open"); });
    }
  });
})();
