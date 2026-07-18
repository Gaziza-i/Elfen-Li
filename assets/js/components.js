/* Shared header & footer for Elfen lied, injected on every page.
   Works over file:// (no fetch). */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var ICON = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 20.3l-1.45-1.32C5.4 14.24 2 11.16 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.66-3.4 6.74-8.55 11.48L12 20.3z"/></svg>',
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
      a('index.html#contacts', 'Контакты', 'contacts', '') +
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
          '<button type="button" data-open-login aria-label="Профиль">' + ICON.user + '</button>' +
          '<button class="badge" data-open-cart aria-label="Корзина">' + ICON.bag + '<span data-cart-count>0</span></button>' +
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
        col('Компания', [['О нас', 'index.html#catalog'], ['Блог', 'index.html#blog'], ['Доставка', '#'], ['Контакты', 'index.html#contacts']]) +
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

  var mirrorSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><ellipse cx="12" cy="9" rx="6" ry="8"/><path d="M12 17v5M8 22h8"/></svg>';

  function modalsHTML() {
    return '' +
    '<div class="overlay" data-overlay></div>' +
    // product quick-view
    '<div class="modal" id="quickview" role="dialog" aria-modal="true">' +
      '<div class="modal__grid">' +
        '<div class="modal__media"><div class="obj">' + mirrorSVG + '</div></div>' +
        '<div class="modal__body">' +
          '<button class="modal__close" data-close aria-label="закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
          '<div class="modal__collection">коллекция</div>' +
          '<h3 class="modal__title" data-qv-name>Santa Trinita</h3>' +
          '<div class="modal__art" data-qv-art>Арт. GNM007</div>' +
          '<div class="modal__props">' +
            '<div class="modal__prop"><span>Цвет:</span><strong data-qv-color>Лаванда</strong></div>' +
            '<div class="modal__prop"><span>Высота:</span><strong>60 см</strong></div>' +
          '</div>' +
          '<p class="modal__desc">Функциональная дизайнерская лампа для создания максимально комфортного освещения.</p>' +
          '<div class="modal__buy">' +
            '<span class="modal__price" data-qv-price>150 000 ₽</span>' +
            '<button class="buy-tag" data-qv-buy>Купить</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // cart drawer
    '<aside class="drawer" id="cart" aria-label="Корзина">' +
      '<div class="drawer__head"><h3>Ваш заказ</h3>' +
        '<button class="modal__close" data-close aria-label="закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>' +
      '<div class="drawer__body" data-cart-list></div>' +
      '<form class="checkout" data-checkout>' +
        '<div class="total"><span>Итого</span><b data-cart-total>0 ₽</b></div>' +
        '<h4>Оформление заказа</h4>' +
        '<div class="field"><input type="text" placeholder="Ваше имя" required /></div>' +
        '<div class="field"><input type="text" placeholder="Адрес" required /></div>' +
        '<div class="field"><input type="tel" placeholder="Телефон" required /></div>' +
        '<button type="submit" class="btn-solid">Заказать</button>' +
      '</form>' +
    '</aside>' +
    // login modal — figma node 2576:4668 (mobile "окно")
    '<div class="login-modal" id="login" role="dialog" aria-modal="true">' +
      '<button class="login-modal__close" data-close aria-label="закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<h3 class="login-modal__title">Вход</h3>' +
      '<form class="login-modal__form" data-login-form>' +
        '<div class="login-modal__field"><label>E-mail</label><input type="email" required /></div>' +
        '<div class="login-modal__field"><label>Пароль</label><input type="password" required /></div>' +
        '<button type="submit" class="login-modal__submit"><span class="login-modal__oval"></span><span>Войти</span></button>' +
      '</form>' +
      '<div class="login-modal__foot">' +
        '<span>Нет аккаунта?</span>' +
        '<a href="#" data-open-register>Регистрация <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16M14 6l6 6-6 6"/></svg></a>' +
      '</div>' +
    '</div>' +
    // registration modal — figma node 2576:4793 (mobile "окно")
    '<div class="login-modal" id="register" role="dialog" aria-modal="true">' +
      '<button class="login-modal__close" data-close aria-label="закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<h3 class="login-modal__title">Регистрация</h3>' +
      '<form class="login-modal__form" data-register-form>' +
        '<div class="login-modal__field"><label>E-mail</label><input type="email" required /></div>' +
        '<div class="login-modal__field"><label>Пароль</label><input type="password" required /></div>' +
        '<div class="login-modal__field"><label>Повторите пароль</label><input type="password" required /></div>' +
        '<button type="submit" class="login-modal__submit login-modal__submit--wide"><span class="login-modal__oval login-modal__oval--wide"></span><span>Регистрация</span></button>' +
      '</form>' +
      '<div class="login-modal__foot">' +
        '<a href="#" data-open-login>Вход <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16M14 6l6 6-6 6"/></svg></a>' +
      '</div>' +
    '</div>' +
    // category quick-view modal — figma node "Модальное при клике на категорию" (2712:5000)
    '<div class="category-modal" id="categoryModal" role="dialog" aria-modal="true">' +
      '<button class="category-modal__close" data-close aria-label="закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<h3 class="category-modal__title" data-category-title></h3>' +
      '<div class="category-modal__list" data-category-list></div>' +
    '</div>';
  }

  window.ElfenUI = { ICON: ICON, mirrorSVG: mirrorSVG };

  document.addEventListener("DOMContentLoaded", function () {
    var h = document.querySelector("[data-header]");
    if (h) h.outerHTML = headerHTML(h.getAttribute("data-header"));
    var f = document.querySelector("[data-footer]");
    if (f) f.outerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", modalsHTML());

    var burger = document.getElementById("burger");
    var mnav = document.getElementById("mainNav");
    if (burger && mnav) burger.addEventListener("click", function () { mnav.classList.toggle("open"); });
  });
})();
