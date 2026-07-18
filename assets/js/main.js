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

  // цвета плашек — визуально оценены по скриншоту Figma (точные hex ассетов недоступны)
  var CATEGORIES = {
    lamps: {
      title: "Торшеры и лампы",
      items: [
        { name: "Aubrey",   kind: "Лампа настольная", price: 150000, color: "#f2a65c", img: "assets/img/lamp-aubrey.png" },
        { name: "Darrell",  kind: "Лампа настольная", price: 150000, color: "#f06fc4", img: "assets/img/lamp-darrell.png" },
        { name: "Coppelia", kind: "Лампа настольная", price: 150000, color: "#4fd1c5", img: "assets/img/lamp-coppelia.png" },
        { name: "Artemide", kind: "Лампа настольная", price: 150000, color: "#4fa8e0", img: "assets/img/lamp-artemide.png" }
      ]
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var mirror = (window.ElfenUI && window.ElfenUI.mirrorSVG) ||
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><ellipse cx="12" cy="9" rx="6" ry="8"/><path d="M12 17v5M8 22h8"/></svg>';
    var lampSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M8 3h8l2 6H6l2-6z"/><path d="M12 9v9M8 21h8"/></svg>';

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
    var loginModal = document.getElementById("login");
    var registerModal = document.getElementById("register");
    var categoryModal = document.getElementById("categoryModal");
    var allOverlayed = [quickview, cartDrawer, loginModal, registerModal, categoryModal];
    function open(el) {
      allOverlayed.forEach(function (m) { if (m && m !== el) m.classList.remove("open"); });
      if (overlay) overlay.classList.add("open");
      if (el) el.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeAll() {
      if (overlay) overlay.classList.remove("open");
      allOverlayed.forEach(function (m) { if (m) m.classList.remove("open"); });
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

    /* ---------- Category quick-view ---------- */
    function openCategory(key) {
      var data = CATEGORIES[key];
      if (!data || !categoryModal) return;
      var titleEl = categoryModal.querySelector("[data-category-title]");
      var listEl = categoryModal.querySelector("[data-category-list]");
      if (titleEl) titleEl.textContent = data.title;
      if (listEl) {
        listEl.innerHTML = data.items.map(function (item) {
          return '<div class="category-modal__item" data-name="' + item.name + '" data-kind="' + item.kind + '" data-price="' + item.price + '">' +
            '<div class="category-modal__media obj" data-img="' + item.img + '">' + lampSVG + '</div>' +
            '<div class="category-modal__info">' +
              '<div class="category-modal__row1">' +
                '<span class="category-modal__swatch" style="background:' + item.color + '"></span>' +
                '<span class="category-modal__name">' + item.name + '</span>' +
              '</div>' +
              '<div class="category-modal__kind">' + item.kind + '</div>' +
              '<div class="category-modal__row2">' +
                '<span class="category-modal__price">' + money(item.price) + '</span>' +
                '<button class="category-modal__buy" data-add-cart aria-label="Купить">' + ICON_CART + 'Купить</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join("");
        if (window.__elfenTryImg) {
          listEl.querySelectorAll("[data-img]").forEach(function (el) { window.__elfenTryImg(el, el.getAttribute("data-img")); });
        }
      }
      open(categoryModal);
    }
    var ICON_CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';

    /* ---------- Delegated clicks ---------- */
    var currentQV = null;
    document.body.addEventListener("click", function (e) {
      // open cart
      if (e.target.closest("[data-open-cart]")) { open(cartDrawer); return; }
      // open login
      var openLogin = e.target.closest("[data-open-login]");
      if (openLogin) { e.preventDefault(); open(loginModal); return; }
      // open register
      var openRegister = e.target.closest("[data-open-register]");
      if (openRegister) { e.preventDefault(); open(registerModal); return; }
      // open category quick-view
      var openCat = e.target.closest("[data-open-category]");
      if (openCat) { openCategory(openCat.getAttribute("data-open-category")); return; }
      // remove from cart
      var rm = e.target.closest("[data-remove]");
      if (rm) { cart.splice(+rm.getAttribute("data-remove"), 1); renderCart(); return; }
      // add to cart from product card / category quick-view item
      var add = e.target.closest("[data-add-cart]");
      if (add) {
        var card = add.closest(".product-card");
        var catItem = !card && add.closest(".category-modal__item");
        var name = "Товар", kind = "", price = 150000;
        if (card) {
          name = card.querySelector(".product-card__name").textContent;
          kind = card.querySelector(".product-card__kind").textContent;
          price = parseInt(card.querySelector(".product-card__price").textContent.replace(/\D/g, ""), 10);
        } else if (catItem) {
          name = catItem.getAttribute("data-name");
          kind = catItem.getAttribute("data-kind");
          price = parseInt(catItem.getAttribute("data-price"), 10);
        }
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

    /* ---------- Login / register ---------- */
    document.querySelectorAll("[data-login-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.reset(); closeAll();
        showToast("Вход скоро появится");
      });
    });
    document.querySelectorAll("[data-register-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.reset(); closeAll();
        showToast("Регистрация скоро появится");
      });
    });

    /* ---------- Contact form ---------- */
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.reset();
        showToast("Сообщение отправлено! Мы свяжемся с вами");
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
    // blog: assets/img/blog-01.png …
    document.querySelectorAll(".blog-grid .blog-card").forEach(function (c, i) {
      var m = c.querySelector(".blog-card__media");
      if (m) tryImg(m, "assets/img/blog-0" + (i + 1) + ".png");
    });
    window.__elfenTryImg = tryImg; // reused by quick-view

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
