/* Interactions: quick-view modal, cart drawer, filters, price range, reveal */
(function () {
  "use strict";

  var ART = {
    Kristin: { art: "Арт. GNM011", color: "Голубой" },
    Arlene:  { art: "Арт. GNM024", color: "Розовый" },
    Colleen: { art: "Арт. GNM032", color: "Зеленый" },
    Coppelia:{ art: "Арт. GNM045", color: "Лаванда" },
    Artemide:{ art: "Арт. GNM058", color: "Синий" }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var mirror = (window.ElfenUI && window.ElfenUI.mirrorSVG) ||
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><ellipse cx="12" cy="9" rx="6" ry="8"/><path d="M12 17v5M8 22h8"/></svg>';

    /* ---------- Toast ---------- */
    var toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
    var tt;
    function showToast(msg) {
      toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l4 4L19 7"/></svg>' + msg;
      toast.classList.add("show");
      clearTimeout(tt);
      tt = setTimeout(function () { toast.classList.remove("show"); }, 2200);
    }

    /* ---------- Overlay / modal helpers ---------- */
    var overlay = document.querySelector("[data-overlay]");
    var quickview = document.getElementById("quickview");
    var cartDrawer = document.getElementById("cart");
    function open(el) { if (overlay) overlay.classList.add("open"); if (el) el.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeAll() {
      if (overlay) overlay.classList.remove("open");
      if (quickview) quickview.classList.remove("open");
      if (cartDrawer) cartDrawer.classList.remove("open");
      document.body.style.overflow = "";
    }
    if (overlay) overlay.addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    document.body.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeAll(); });

    /* ---------- Cart state ---------- */
    var cart = [];
    function money(n) { return n.toLocaleString("ru-RU") + " ₽"; }
    function renderCart() {
      var list = document.querySelector("[data-cart-list]");
      var totalEl = document.querySelector("[data-cart-total]");
      var count = document.querySelectorAll("[data-cart-count]");
      var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
      count.forEach(function (c) { c.textContent = cart.length; });
      if (totalEl) totalEl.textContent = money(total);
      if (!list) return;
      if (!cart.length) { list.innerHTML = '<div class="cart-empty">Корзина пуста</div>'; return; }
      list.innerHTML = cart.map(function (i, idx) {
        return '<div class="cart-item">' +
          '<div class="cart-item__media">' + mirror + '</div>' +
          '<div><div class="cart-item__name">' + i.name + '</div><div class="cart-item__kind">' + i.kind + '</div></div>' +
          '<div class="cart-item__price"><b>' + money(i.price) + '</b><span>x1</span></div>' +
          '<button class="cart-item__remove" data-remove="' + idx + '" aria-label="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '</div>';
      }).join("");
    }
    function addToCart(name, kind, price) { cart.push({ name: name, kind: kind, price: price }); renderCart(); }
    renderCart();

    /* ---------- Delegated clicks ---------- */
    var currentQV = null;
    document.body.addEventListener("click", function (e) {
      // open cart
      if (e.target.closest("[data-open-cart]")) { open(cartDrawer); return; }
      // remove from cart
      var rm = e.target.closest("[data-remove]");
      if (rm) { cart.splice(+rm.getAttribute("data-remove"), 1); renderCart(); return; }
      // add to cart from product card
      var add = e.target.closest("[data-add-cart]");
      if (add) {
        var card = add.closest(".product-card");
        var name = card ? card.querySelector(".product-card__name").textContent : "Товар";
        var kind = card ? card.querySelector(".product-card__kind").textContent : "";
        var price = card ? parseInt(card.querySelector(".product-card__price").textContent.replace(/\D/g, ""), 10) : 150000;
        addToCart(name, kind, price);
        showToast("«" + name + "» в корзине");
        open(cartDrawer);
        return;
      }
      // quick-view buy
      if (e.target.closest("[data-qv-buy]") && currentQV) {
        addToCart(currentQV.name, currentQV.kind, currentQV.price);
        showToast("«" + currentQV.name + "» в корзине");
        if (quickview) quickview.classList.remove("open");
        open(cartDrawer);
        return;
      }
      // open quick-view
      var qv = e.target.closest("[data-quickview]");
      if (qv) {
        var c = qv.closest(".product-card");
        var nm = c.querySelector(".product-card__name").textContent.trim();
        var kd = c.querySelector(".product-card__kind").textContent.trim();
        var pr = parseInt(c.querySelector(".product-card__price").textContent.replace(/\D/g, ""), 10);
        currentQV = { name: nm, kind: kd, price: pr };
        var meta = ART[nm] || { art: "Арт. GNM007", color: "Лаванда" };
        setText("[data-qv-name]", nm);
        setText("[data-qv-art]", meta.art);
        setText("[data-qv-color]", meta.color);
        setText("[data-qv-price]", money(pr));
        // sync modal image with the product (falls back to SVG if missing)
        var mObj = document.querySelector("#quickview .modal__media .obj");
        if (mObj) {
          mObj.classList.remove("has-img"); mObj.style.backgroundImage = "";
          if (window.__elfenTryImg) window.__elfenTryImg(mObj, "assets/img/product-" + nm.toLowerCase().trim() + ".png");
        }
        open(quickview);
        return;
      }
      // color chip toggle
      var chip = e.target.closest(".color-chip");
      if (chip) chip.classList.toggle("on");
      // generic toast
      if (e.target.closest("[data-toast]")) showToast(e.target.closest("[data-toast]").getAttribute("data-toast"));
    });
    // keyboard access for quick-view media
    document.body.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-quickview]")) { e.preventDefault(); e.target.click(); }
    });
    function setText(sel, val) { var el = document.querySelector(sel); if (el) el.textContent = val; }

    /* ---------- Search ---------- */
    document.querySelectorAll("[data-search]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = f.querySelector("input").value.trim();
        showToast(q ? "Поиск: «" + q + "»" : "Введите запрос для поиска");
      });
    });

    /* ---------- Checkout ---------- */
    document.querySelectorAll("[data-checkout]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!cart.length) { showToast("Добавьте товары в корзину"); return; }
        cart = []; renderCart(); form.reset(); closeAll();
        showToast("Заказ оформлен! Мы свяжемся с вами");
      });
    });

    /* ---------- Filters toggle ---------- */
    var ft = document.querySelector("[data-filter-toggle]");
    var fp = document.getElementById("filters");
    if (ft && fp) ft.addEventListener("click", function () { fp.classList.toggle("open"); });

    /* ---------- Price range ---------- */
    document.querySelectorAll("[data-range]").forEach(function (wrap) {
      var min = wrap.querySelector("[data-range-min]");
      var max = wrap.querySelector("[data-range-max]");
      var outMin = wrap.querySelector("[data-out-min]");
      var outMax = wrap.querySelector("[data-out-max]");
      function fmt(v) { return Number(v).toLocaleString("ru-RU"); }
      function sync() {
        if (Number(min.value) > Number(max.value)) { var s = min.value; min.value = max.value; max.value = s; }
        if (outMin) outMin.textContent = fmt(min.value);
        if (outMax) outMax.textContent = fmt(max.value);
      }
      if (min && max) { min.addEventListener("input", sync); max.addEventListener("input", sync); sync(); }
    });

    /* ---------- Load more ---------- */
    document.querySelectorAll("[data-load-more]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var grid = document.querySelector(btn.getAttribute("data-load-more"));
        if (!grid) return;
        var cards = grid.querySelectorAll(".product-card");
        var n = Math.min(5, cards.length);
        for (var i = 0; i < n; i++) {
          var clone = cards[i].cloneNode(true);
          clone.classList.add("reveal");
          grid.appendChild(clone);
          observe(clone);
        }
        showToast("Загружены ещё товары");
      });
    });

    /* ---------- Real images (progressive enhancement) ---------- */
    function slug(s) {
      return s.toLowerCase().trim().replace(/ё/g, "e")
        .replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "");
    }
    function tryImg(el, src) {
      if (!el || !src) return;
      var im = new Image();
      im.onload = function () { el.classList.add("has-img"); el.style.backgroundImage = 'url("' + src + '")'; };
      im.onerror = function () { el.classList.remove("has-img"); el.style.backgroundImage = ""; };
      im.src = src;
    }
    // explicit data-img (hero object, panels, …)
    document.querySelectorAll("[data-img]").forEach(function (el) { tryImg(el, el.getAttribute("data-img")); });
    // products: assets/img/product-<name>.png
    document.querySelectorAll(".product-card").forEach(function (c) {
      var n = c.querySelector(".product-card__name"), o = c.querySelector(".obj");
      if (n && o) tryImg(o, "assets/img/product-" + slug(n.textContent) + ".png");
    });
    // categories (in order): mirrors, lamps, chairs, tables
    var catMap = ["cat-mirrors", "cat-lamps", "cat-chairs", "cat-tables"];
    document.querySelectorAll(".cat-row .cat-card").forEach(function (c, i) {
      var o = c.querySelector(".obj");
      if (o && catMap[i]) tryImg(o, "assets/img/" + catMap[i] + ".png");
    });
    // blog: assets/img/blog-01.png …
    document.querySelectorAll(".blog-grid .blog-card").forEach(function (c, i) {
      var m = c.querySelector(".blog-card__media");
      if (m) tryImg(m, "assets/img/blog-0" + (i + 1) + ".png");
    });
    window.__elfenTryImg = tryImg; // reused by quick-view

    /* ---------- Category card curved ring text ----------
       "изготовление на заказ" — 21 letters, exact per-letter rotate
       (deg) and box (x, y, w, h) copied verbatim from Figma
       (node 2468:2500, "надпись"). Identical on all 4 category
       cards, so generated once per .figcat__ring found on the page. */
    var RING_LETTERS = [
      { c: "и", deg: -142, x: 94.12, y: 418.59, w: 14.652, h: 14.825 },
      { c: "з", deg: -137, x: 86.15, y: 411.25, w: 13.353, h: 13.501 },
      { c: "г", deg: -134, x: 80.14, y: 404.66, w: 12.775, h: 12.677 },
      { c: "о", deg: -131, x: 72.44, y: 397.62, w: 14.862, h: 14.764 },
      { c: "т", deg: -128, x: 67.07, y: 390.46, w: 13.593, h: 13.076 },
      { c: "о", deg: -125, x: 60.26, y: 381.75, w: 14.746, h: 14.501 },
      { c: "в", deg: -121, x: 55.36, y: 373.31, w: 14.064, h: 13.38 },
      { c: "л", deg: -118, x: 49.3,  y: 363,    w: 14.407, h: 13.994 },
      { c: "е", deg: -115, x: 43.77, y: 354.14, w: 14.196, h: 13.712 },
      { c: "н", deg: -112, x: 40.25, y: 343.3,  w: 13.945, h: 13.393 },
      { c: "и", deg: -109, x: 35.74, y: 332.48, w: 13.656, h: 13.036 },
      { c: "е", deg: -106, x: 32.24, y: 320.68, w: 13.33,  h: 12.645 },
      { c: " ", deg: -104, x: 31.03, y: 313.73, w: 11.641, h: 6.542 },
      { c: "н", deg: -102, x: 28.92, y: 304.97, w: 12.839, h: 12.069 },
      { c: "а", deg: -99,  x: 26.43, y: 293.2,  w: 12.429, h: 11.598 },
      { c: " ", deg: -97,  x: 25.51, y: 284.35, w: 11.405, h: 5.311 },
      { c: "з", deg: -95,  x: 25.3,  y: 276.54, w: 11.655, h: 8.928 },
      { c: "а", deg: -93,  x: 24.48, y: 264.72, w: 11.508, h: 10.562 },
      { c: "к", deg: -90,  x: 24,    y: 253.5,  w: 11,     h: 9 },
      { c: "а", deg: -88,  x: 24,    y: 243.2,  w: 11.342, h: 10.378 },
      { c: "з", deg: -86,  x: 24,    y: 232.39, w: 11.531, h: 8.748 }
    ];
    document.querySelectorAll("[data-ring]").forEach(function (ring) {
      var frag = document.createDocumentFragment();
      RING_LETTERS.forEach(function (l) {
        var span = document.createElement("span");
        span.style.left = l.x + "px";
        span.style.top = l.y + "px";
        span.style.width = l.w + "px";
        span.style.height = l.h + "px";
        var i = document.createElement("i");
        i.style.transform = "rotate(" + l.deg + "deg)";
        i.textContent = l.c;
        span.appendChild(i);
        frag.appendChild(span);
      });
      ring.appendChild(frag);
    });

    /* ---------- Reveal ---------- */
    var io;
    function observe(el) { if (io) io.observe(el); }
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll(".reveal").forEach(observe);
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    }
  });
})();
