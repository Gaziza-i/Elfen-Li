/* Interactions: cart, toast, filters, price range, colors, load more, reveal */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Toast ---------- */
    var toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
    var t;
    function showToast(msg) {
      toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l4 4L19 7"/></svg>' + msg;
      toast.classList.add("show");
      clearTimeout(t);
      t = setTimeout(function () { toast.classList.remove("show"); }, 2200);
    }

    /* ---------- Cart ---------- */
    var cart = 3;
    document.body.addEventListener("click", function (e) {
      if (e.target.closest("[data-add-cart]")) {
        cart++;
        document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = cart; });
        showToast("Товар добавлен в корзину");
      }
      var chip = e.target.closest(".color-chip");
      if (chip) { chip.classList.toggle("on"); }
      if (e.target.closest("[data-toast]")) showToast(e.target.closest("[data-toast]").getAttribute("data-toast"));
    });

    /* ---------- Search ---------- */
    document.querySelectorAll("[data-search]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = f.querySelector("input").value.trim();
        showToast(q ? 'Поиск: «' + q + '»' : "Введите запрос для поиска");
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

    /* ---------- Load more (demo clones) ---------- */
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

    /* ---------- Reveal on scroll ---------- */
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
