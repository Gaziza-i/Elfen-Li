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
    mirrors: {
      title: "Напольные зеркала",
      items: [
        { name: "Kristin",  kind: "Зеркало напольное", price: 150000, color: "#5b9bd5", img: "assets/img/product-kristin.png" },
        { name: "Arlene",   kind: "Зеркало напольное", price: 150000, color: "#e85fc0", img: "assets/img/product-arlene.png" },
        { name: "Colleen",  kind: "Зеркало напольное", price: 150000, color: "#5b9bd5", img: "assets/img/product-colleen.png" },
        { name: "Coppelia", kind: "Зеркало напольное", price: 150000, color: "#c9c9d1", img: "assets/img/product-coppelia.png" },
        { name: "Artemide", kind: "Зеркало напольное", price: 150000, color: "#e85fc0", img: "assets/img/product-artemide.png" }
      ]
    },
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
    var favoritesDrawer = document.getElementById("favorites");
    var loginModal = document.getElementById("login");
    var registerModal = document.getElementById("register");
    var categoryModal = document.getElementById("categoryModal");
    var allOverlayed = [quickview, cartDrawer, favoritesDrawer, loginModal, registerModal, categoryModal];
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

    /* ---------- Favorites state ---------- */
    var favorites = [];
    function favButtonName(b) {
      var card = b.closest(".product-card");
      if (card) return card.querySelector(".product-card__name").textContent.trim();
      var item = b.closest(".category-modal__item");
      if (item) return item.getAttribute("data-name");
      return null;
    }
    function syncFavButtons(name, isFav) {
      document.querySelectorAll("[data-add-favorite]").forEach(function (b) {
        if (favButtonName(b) === name) b.classList.toggle("is-active", isFav);
      });
    }
    function renderFavorites() {
      var list = document.querySelector("[data-favorites-list]");
      var count = document.querySelectorAll("[data-fav-count]");
      count.forEach(function (c) { c.textContent = favorites.length; });
      if (!list) return;
      if (!favorites.length) { list.innerHTML = '<div class="cart-empty">Список избранного пуст</div>'; return; }
      list.innerHTML = favorites.map(function (i, idx) {
        return '<div class="cart-item">' +
          '<div class="cart-item__media">' + mirror + '</div>' +
          '<div><div class="cart-item__name">' + i.name + '</div><div class="cart-item__kind">' + i.kind + '</div></div>' +
          '<div class="cart-item__price"><b>' + money(i.price) + '</b></div>' +
          '<button class="cart-item__remove" data-remove-favorite="' + idx + '" aria-label="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '</div>';
      }).join("");
    }
    function toggleFavorite(name, kind, price) {
      var idx = favorites.findIndex(function (f) { return f.name === name; });
      if (idx >= 0) {
        favorites.splice(idx, 1);
        syncFavButtons(name, false);
      } else {
        favorites.push({ name: name, kind: kind, price: price });
        syncFavButtons(name, true);
        showToast("«" + name + "» в избранном");
      }
      renderFavorites();
    }
    renderFavorites();

    /* ---------- Category quick-view ---------- */
    function openCategory(key) {
      var data = CATEGORIES[key];
      // below 1000px: subcategories open in the quick-view modal instead of the inline catalog
      var isMobile = !window.matchMedia("(min-width: 1001px)").matches;
      if (!isMobile || !data || !categoryModal) {
        // desktop (or no quick-view data yet) — reveal & scroll to the inline catalog
        // (the whole catalog stays hidden site-wide until a category is opened)
        var catalog = document.getElementById("products");
        if (catalog) {
          catalog.classList.add("is-visible");
          catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
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
                '<button type="button" class="category-modal__fav" data-add-favorite aria-label="В избранное">' + ICON_HEART + '</button>' +
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
    var ICON_HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 20.3l-1.45-1.32C5.4 14.24 2 11.16 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.66-3.4 6.74-8.55 11.48L12 20.3z"/></svg>';

    /* ---------- Delegated clicks ---------- */
    var currentQV = null;
    document.body.addEventListener("click", function (e) {
      // open cart
      if (e.target.closest("[data-open-cart]")) { open(cartDrawer); return; }
      // open favorites
      if (e.target.closest("[data-open-favorites]")) { open(favoritesDrawer); return; }
      // toggle favorite from product card
      var favBtn = e.target.closest("[data-add-favorite]");
      if (favBtn) {
        var favCard = favBtn.closest(".product-card");
        var favItem = !favCard && favBtn.closest(".category-modal__item");
        if (favCard) {
          toggleFavorite(
            favCard.querySelector(".product-card__name").textContent.trim(),
            favCard.querySelector(".product-card__kind").textContent.trim(),
            parseInt(favCard.querySelector(".product-card__price").textContent.replace(/\D/g, ""), 10)
          );
        } else if (favItem) {
          toggleFavorite(
            favItem.getAttribute("data-name"),
            favItem.getAttribute("data-kind"),
            parseInt(favItem.getAttribute("data-price"), 10)
          );
        }
        return;
      }
      // remove from favorites
      var rmFav = e.target.closest("[data-remove-favorite]");
      if (rmFav) {
        var rmName = favorites[+rmFav.getAttribute("data-remove-favorite")].name;
        favorites.splice(+rmFav.getAttribute("data-remove-favorite"), 1);
        syncFavButtons(rmName, false);
        renderFavorites();
        return;
      }
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
      var toggle = f.querySelector("[data-search-toggle]");
      var input = f.querySelector("input");
      if (toggle && input) {
        toggle.addEventListener("click", function () {
          // collapsed on mobile (input hidden): first tap just reveals + focuses it
          if (!f.classList.contains("is-open") && window.matchMedia("(max-width: 760px)").matches) {
            f.classList.add("is-open");
            input.focus();
            return;
          }
          f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event("submit", { cancelable: true }));
        });
        input.addEventListener("blur", function () {
          if (!input.value) f.classList.remove("is-open");
        });
      }
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

    /* ---------- Hero: reveal other slides ---------- */
    var slidesToggle = document.querySelector("[data-toggle-slides]");
    var heroRow = document.querySelector(".hero__row");
    if (slidesToggle && heroRow) {
      slidesToggle.addEventListener("click", function () {
        var open = heroRow.classList.toggle("is-open");
        slidesToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    /* ---------- Category row prev/next arrows ---------- */
    var catRow = document.querySelector(".cat-row");
    document.querySelectorAll("[data-cat-scroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!catRow) return;
        var card = catRow.querySelector(".figcat-card");
        var step = card ? card.getBoundingClientRect().width + 26 : 300;
        catRow.scrollBy({ left: step * Number(btn.getAttribute("data-cat-scroll")), behavior: "smooth" });
      });
    });

    /* ---------- Blog dots (replace scrollbar) ---------- */
    var blogGrid = document.querySelector("[data-blog-grid]");
    var blogDots = document.querySelectorAll("[data-blog-dot]");
    if (blogGrid && blogDots.length) {
      var blogCards = blogGrid.querySelectorAll(".blog-card");
      blogDots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var card = blogCards[Number(dot.getAttribute("data-blog-dot"))];
          if (card) blogGrid.scrollTo({ left: card.offsetLeft - blogGrid.offsetLeft, behavior: "smooth" });
        });
      });
      var blogScrollTimer;
      blogGrid.addEventListener("scroll", function () {
        clearTimeout(blogScrollTimer);
        blogScrollTimer = setTimeout(function () {
          var pos = blogGrid.scrollLeft + blogGrid.offsetWidth / 2;
          var activeIdx = 0;
          blogCards.forEach(function (card, i) {
            var cardMid = card.offsetLeft - blogGrid.offsetLeft + card.offsetWidth / 2;
            if (cardMid <= pos) activeIdx = i;
          });
          blogDots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === activeIdx); });
        }, 80);
      });
    }

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

    /* ---------- Hero slider (slide 2/3 swap into "товар дня") ---------- */
    var heroMain = document.querySelector(".hero__main");
    var heroPanels = document.querySelectorAll(".hero__panel");
    if (heroMain && heroPanels.length) {
      var HERO_SLIDES = [
        { num: "01", img: "assets/img/hero-santa-trinita.png",
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2c-2 3-3 6 0 9 3-3 2-6 0-9zM12 11c-3-1-6 0-7 3 3 1 6 0 7-3zM12 11c3-1 6 0 7 3-3 1-6 0-7-3zM12 11v9M8 22h8"/></svg>' },
        { num: "02", img: "assets/img/hero-style-02.png",
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M7 3v9M17 3v9M6 12h12l-1 4H7l-1-4zM8 16v5M16 16v5"/></svg>' },
        { num: "03", img: "assets/img/hero-style-03.png",
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M3 8h18M5 8v12M19 8v12M3 8l3-4h12l3 4"/></svg>' }
      ];
      var heroActive = 0;
      function renderHero() {
        var mainObj = heroMain.querySelector(".hero__object");
        var mainSlide = HERO_SLIDES[heroActive];
        mainObj.classList.remove("has-img");
        mainObj.style.backgroundImage = "";
        mainObj.innerHTML = mainSlide.icon;
        mainObj.setAttribute("data-img", mainSlide.img);
        tryImg(mainObj, mainSlide.img);

        var others = [0, 1, 2].filter(function (i) { return i !== heroActive; });
        heroPanels.forEach(function (panel, i) {
          var idx = others[i];
          var slide = HERO_SLIDES[idx];
          var obj = panel.querySelector(".obj");
          obj.classList.remove("has-img");
          obj.style.backgroundImage = "";
          obj.innerHTML = slide.icon;
          obj.setAttribute("data-img", slide.img);
          tryImg(obj, slide.img);
          panel.querySelector(".hero__panel-foot .num").textContent = slide.num;
          panel.setAttribute("data-slide-index", idx);
        });
      }
      heroPanels.forEach(function (panel) {
        panel.style.cursor = "pointer";
        panel.addEventListener("click", function () {
          heroActive = Number(panel.getAttribute("data-slide-index"));
          renderHero();
        });
      });
      renderHero();
    }

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
