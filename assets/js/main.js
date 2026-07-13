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
