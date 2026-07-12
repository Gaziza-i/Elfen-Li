/* Interactions: cart, toast, price range, tabs, quantity, forms, reveal */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Toast ---------- */
    var toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
    var toastTimer;
    function showToast(msg) {
      toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l4 4L19 7"/></svg>' + msg;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
    }

    /* ---------- Cart ---------- */
    var cartCount = 3;
    function updateCart(n) {
      cartCount += n;
      document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = cartCount; });
    }
    document.body.addEventListener("click", function (e) {
      var addBtn = e.target.closest("[data-add-cart]");
      if (addBtn) {
        updateCart(1);
        showToast("Товар добавлен в корзину");
      }
      var toastBtn = e.target.closest("[data-toast]");
      if (toastBtn) {
        showToast(toastBtn.getAttribute("data-toast"));
      }
      var fav = e.target.closest("[data-fav]");
      if (fav) {
        fav.classList.toggle("is-on");
        showToast(fav.classList.contains("is-on") ? "Добавлено в избранное" : "Убрано из избранного");
      }
    });

    /* ---------- Price range ---------- */
    document.querySelectorAll("[data-range]").forEach(function (wrap) {
      var min = wrap.querySelector("[data-range-min]");
      var max = wrap.querySelector("[data-range-max]");
      var outMin = wrap.querySelector("[data-out-min]");
      var outMax = wrap.querySelector("[data-out-max]");
      function fmt(v) { return Number(v).toLocaleString("ru-RU"); }
      function sync() {
        if (Number(min.value) > Number(max.value)) {
          var t = min.value; min.value = max.value; max.value = t;
        }
        if (outMin) outMin.textContent = fmt(min.value);
        if (outMax) outMax.textContent = fmt(max.value);
      }
      if (min && max) { min.addEventListener("input", sync); max.addEventListener("input", sync); sync(); }
    });

    /* ---------- Tabs ---------- */
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var btns = group.querySelectorAll("[data-tab]");
      btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var target = btn.getAttribute("data-tab");
          btns.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
          group.querySelectorAll("[data-panel]").forEach(function (p) {
            p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
          });
        });
      });
    });

    /* ---------- Quantity ---------- */
    document.querySelectorAll("[data-qty]").forEach(function (q) {
      var out = q.querySelector("span");
      var val = 1;
      q.addEventListener("click", function (e) {
        if (e.target.closest("[data-qty-inc]")) val++;
        if (e.target.closest("[data-qty-dec]")) val = Math.max(1, val - 1);
        out.textContent = val;
      });
    });

    /* ---------- Gallery thumbs ---------- */
    document.querySelectorAll("[data-gallery]").forEach(function (g) {
      var thumbs = g.querySelectorAll("[data-thumb]");
      thumbs.forEach(function (t) {
        t.addEventListener("click", function () {
          thumbs.forEach(function (x) { x.classList.toggle("is-active", x === t); });
        });
      });
    });

    /* ---------- Forms ---------- */
    document.querySelectorAll("[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var kind = form.getAttribute("data-form");
        var err = form.querySelector(".form-error");
        // demo "wrong login" behaviour
        if (kind === "login") {
          var pass = form.querySelector('input[type="password"]');
          if (pass && pass.value !== "" && pass.value.length < 4) {
            if (err) err.classList.add("show");
            return;
          }
        }
        if (err) err.classList.remove("show");
        showToast("Готово! Данные отправлены");
        if (kind === "callback" || kind === "register") form.reset();
      });
    });

    /* ---------- Load more (demo) ---------- */
    document.querySelectorAll("[data-load-more]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var grid = document.querySelector(btn.getAttribute("data-load-more"));
        if (!grid) return;
        var cards = grid.querySelectorAll(".product-card");
        var clones = Math.min(3, cards.length);
        for (var i = 0; i < clones; i++) {
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
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach(observe);
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    }
  });
})();
