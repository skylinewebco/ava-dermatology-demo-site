/* ============================================================
   AVA DERMATOLOGY — Main interactions
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = $("#themeToggle");
  function syncThemeButton() {
    var dark = root.getAttribute("data-theme") === "dark";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(dark));
    var meta = document.querySelector('meta[name="theme-color"]');
  }
  syncThemeButton();
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark";
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ava-theme", next); } catch (e) {}
      syncThemeButton();
    });
  }
  // Respect system change only if user hasn't chosen
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!localStorage.getItem("ava-theme")) {
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
        syncThemeButton();
      }
    });
  } catch (e) {}

  /* ---------- Nav scroll state ---------- */
  var nav = $("#nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var hamburger = $("#hamburger");
  var mobileMenu = $("#mobileMenu");
  function setMenu(open) {
    hamburger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      setMenu(!mobileMenu.classList.contains("open"));
    });
    $$(".mobile-menu__links a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link (scrollspy) ---------- */
  var sections = ["home","about","treatments","results","doctor","reviews","faq","contact"];
  var navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- Render treatments ---------- */
  var grid = $("#treatmentsGrid");
  var treatments = window.AVA_TREATMENTS || [];
  if (grid) {
    treatments.forEach(function (t, i) {
      var card = document.createElement("article");
      card.className = "treatment-card reveal";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Learn more about " + t.title);
      var hue = (window.AVA_TREATMENT_HUES || [])[i];
      var thumb = (window.AVA_TREATMENT_IMAGES || [])[i] ||
        ((typeof window.avaThumb === "function" && hue != null) ? window.avaThumb(hue) : "");
      card.innerHTML =
        '<div class="treatment-card__media">' +
          (thumb ? '<img src="' + thumb + '" alt="" loading="lazy" decoding="async" />' : '') +
        '</div>' +
        '<div class="treatment-card__body">' +
          '<div class="treatment-card__icon" aria-hidden="true">' + t.icon + '</div>' +
          '<h3>' + t.title + '</h3>' +
          '<p>' + t.short + '</p>' +
          '<span class="treatment-card__more">Learn more</span>' +
        '</div>';
      card.addEventListener("click", function () { openModal(i); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(i); }
      });
      // subtle 3D tilt + spotlight
      if (!reduceMotion) {
        card.addEventListener("mousemove", function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--mx", (px * 100) + "%");
          card.style.setProperty("--my", (py * 100) + "%");
          var rx = (0.5 - py) * 6, ry = (px - 0.5) * 6;
          card.style.transform = "translateY(-8px) perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        });
        card.addEventListener("mouseleave", function () { card.style.transform = ""; });
      }
      grid.appendChild(card);
      if (!("IntersectionObserver" in window) || reduceMotion) card.classList.add("in");
      else ro.observe(card);
    });
  }

  /* ---------- Treatment modal ---------- */
  var modal = $("#treatmentModal");
  var lastFocus = null;
  function openModal(i) {
    var t = treatments[i];
    if (!t || !modal) return;
    lastFocus = document.activeElement;
    $("#modalIcon").textContent = t.icon;
    $("#modalTitle").textContent = t.title;
    $("#modalDesc").textContent = t.desc;
    var pts = $("#modalPoints");
    pts.innerHTML = "";
    (t.points || []).forEach(function (p) {
      var li = document.createElement("li");
      li.textContent = p;
      pts.appendChild(li);
    });
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    $$("[data-close-modal]", modal).forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  /* ---------- Concerns ---------- */
  var cloud = $("#concernsCloud");
  if (cloud) {
    (window.AVA_CONCERNS || []).forEach(function (c) {
      var chip = document.createElement("span");
      chip.className = "concern-chip";
      chip.textContent = c;
      cloud.appendChild(chip);
    });
  }

  /* ---------- Results ---------- */
  var resultsGrid = $("#resultsGrid");
  if (resultsGrid) {
    (window.AVA_RESULTS || []).forEach(function (r) {
      var card = document.createElement("article");
      card.className = "result-card reveal";
      var RI = window.AVA_RESULT_IMAGES || {};
      var beforeSrc = RI.before || "assets/img/before.svg";
      var afterSrc = RI.after || "assets/img/after.svg";
      card.innerHTML =
        '<div class="result-card__imgs">' +
          '<div class="result-ph result-ph--before">' +
            '<img src="' + beforeSrc + '" alt="Before treatment placeholder for ' + r.title + '" loading="lazy" decoding="async" />' +
            '<span>Before</span>' +
          '</div>' +
          '<div class="result-ph result-ph--after">' +
            '<img src="' + afterSrc + '" alt="After treatment placeholder for ' + r.title + '" loading="lazy" decoding="async" />' +
            '<span>After</span>' +
          '</div>' +
        '</div>' +
        '<div class="result-card__body"><h3>' + r.title + '</h3><p>' + r.note + '</p></div>';
      resultsGrid.appendChild(card);
      if (!("IntersectionObserver" in window) || reduceMotion) card.classList.add("in");
      else ro.observe(card);
    });
  }

  /* ---------- Trust ---------- */
  var trustGrid = $("#trustGrid");
  if (trustGrid) {
    (window.AVA_TRUST || []).forEach(function (item) {
      var card = document.createElement("article");
      card.className = "trust-card reveal";
      card.innerHTML =
        '<div class="trust-card__icon" aria-hidden="true">' + item.icon + '</div>' +
        '<h3>' + item.title + '</h3><p>' + item.text + '</p>';
      trustGrid.appendChild(card);
      if (!("IntersectionObserver" in window) || reduceMotion) card.classList.add("in");
      else ro.observe(card);
    });
  }

  /* ---------- Reviews carousel ---------- */
  var track = $("#reviewsTrack");
  var reviews = window.AVA_REVIEWS || [];
  var dotsWrap = $("#reviewsDots");
  var idx = 0, autoTimer = null;
  if (track && reviews.length) {
    reviews.forEach(function (r, i) {
      var card = document.createElement("div");
      card.className = "review-card";
      var stars = "";
      for (var s = 0; s < (r.stars || 5); s++) stars += "★";
      card.innerHTML =
        '<div class="review-card__avatar" aria-hidden="true">' + r.name.charAt(0) + '</div>' +
        '<div class="review-card__stars" aria-label="' + (r.stars || 5) + ' out of 5 stars">' + stars + '</div>' +
        '<p class="review-card__quote">' + r.quote + '</p>' +
        '<div class="review-card__author">' +
          '<span class="review-card__name">' + r.name + '</span>' +
          '<span class="review-card__meta">' + r.meta + '</span>' +
        '</div>';
      track.appendChild(card);

      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", function () { go(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });
    function go(i) {
      idx = (i + reviews.length) % reviews.length;
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      $$("button", dotsWrap).forEach(function (d, di) { d.classList.toggle("active", di === idx); d.setAttribute("aria-selected", String(di === idx)); });
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    $("#reviewNext").addEventListener("click", function () { next(); resetAuto(); });
    $("#reviewPrev").addEventListener("click", function () { prev(); resetAuto(); });
    function startAuto() { if (reduceMotion) return; autoTimer = setInterval(next, 6000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    var carousel = $(".reviews__carousel");
    carousel.addEventListener("mouseenter", function () { clearInterval(autoTimer); });
    carousel.addEventListener("mouseleave", startAuto);
    // basic swipe
    var sx = 0;
    carousel.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetAuto(); }
    }, { passive: true });
    go(0);
    startAuto();
  }

  /* ---------- FAQ ---------- */
  var faqList = $("#faqList");
  if (faqList) {
    (window.AVA_FAQ || []).forEach(function (f, i) {
      var item = document.createElement("div");
      item.className = "faq-item reveal";
      var qid = "faq-q-" + i, aid = "faq-a-" + i;
      item.innerHTML =
        '<button class="faq-item__q" id="' + qid + '" aria-expanded="false" aria-controls="' + aid + '">' +
          '<span>' + f.q + '</span><span class="faq-item__icon" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="faq-item__a" id="' + aid + '" role="region" aria-labelledby="' + qid + '">' +
          '<div class="faq-item__a-inner">' + f.a + '</div>' +
        '</div>';
      faqList.appendChild(item);
      var btn = item.querySelector(".faq-item__q");
      var ans = item.querySelector(".faq-item__a");
      btn.addEventListener("click", function () {
        var open = item.classList.contains("open");
        // close others
        $$(".faq-item.open", faqList).forEach(function (o) {
          if (o !== item) {
            o.classList.remove("open");
            o.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
            o.querySelector(".faq-item__a").style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !open);
        btn.setAttribute("aria-expanded", String(!open));
        ans.style.maxHeight = open ? null : ans.scrollHeight + "px";
      });
      if (!("IntersectionObserver" in window) || reduceMotion) item.classList.add("in");
      else ro.observe(item);
    });
  }

  /* ---------- WhatsApp ---------- */
  var cfg = window.AVA_CONFIG || {};
  function whatsappHref() {
    var num = (cfg.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    var msg = encodeURIComponent(cfg.WHATSAPP_MESSAGE || "Hello");
    return "https://wa.me/" + num + "?text=" + msg;
  }
  var placeholderNum = !cfg.WHATSAPP_NUMBER || /^0+$/.test(cfg.WHATSAPP_NUMBER.replace(/\D/g, ""));
  $$("#whatsappBtn, #whatsappBtn2").forEach(function (btn) {
    btn.setAttribute("href", whatsappHref());
    btn.setAttribute("target", "_blank");
    if (placeholderNum) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("WhatsApp number is a placeholder — set WHATSAPP_NUMBER in js/data.js");
      });
    }
  });

  /* ---------- Toast ---------- */
  var toast = $("#toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.hidden = true; }, 500);
    }, 3800);
  }

  /* ---------- Booking form validation ---------- */
  var form = $("#bookingForm");
  if (form) {
    var successBox = $("#bookingSuccess");
    var minDate = new Date().toISOString().split("T")[0];
    var dateInput = $("#f-date");
    if (dateInput) dateInput.min = minDate;

    function setError(name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      var err = form.querySelector('[data-error-for="' + name + '"]');
      if (field) field.classList.toggle("invalid", !!msg);
      if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) { err.textContent = msg || ""; err.classList.toggle("show", !!msg); }
      return !msg;
    }
    function validate() {
      var ok = true;
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      ok = setError("name", name ? "" : "Please enter your name.") && ok;
      ok = setError("phone", /[0-9]{6,}/.test(phone.replace(/[^\d]/g, "")) ? "" : "Please enter a valid phone number.") && ok;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      ok = setError("email", emailOk ? "" : "Please enter a valid email address.") && ok;
      return ok;
    }
    // live-clear on input
    ["name", "phone", "email"].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) el.addEventListener("input", function () {
        if (el.classList.contains("invalid")) setError(n, "");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstBad = form.querySelector(".invalid");
        if (firstBad) firstBad.focus();
        return;
      }
      var nm = form.name.value.trim().split(" ")[0] || "there";
      $("#successName").textContent = nm;
      successBox.hidden = false;
      form.setAttribute("aria-hidden", "false");
      // (Placeholder) here you'd POST to your booking backend / email service.
    });

    var resetBtn = $("#bookingReset");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      form.reset();
      successBox.hidden = true;
      ["name","phone","email"].forEach(function (n) { setError(n, ""); });
      form.name.focus();
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (mx * 0.18) + "px," + (my * 0.28) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Smooth anchor + nav offset ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- Gentle parallax on bg orbs + scroll-parallax elements ---------- */
  if (!reduceMotion) {
    var orbs = $$(".bg-orb");
    var scrollPx = $$("[data-scroll-parallax]");
    var ticking = false;
    function updateParallax() {
      var y = window.scrollY;
      orbs.forEach(function (o, i) {
        o.style.transform = "translateY(" + (y * (0.02 + i * 0.015)) + "px)";
      });
      var vh = window.innerHeight;
      scrollPx.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-scroll-parallax")) || 0.4;
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translateY(" + (-center * f * 0.08).toFixed(1) + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Hero continuous float + mouse parallax (depth) ---------- */
  var heroLayers = $$(".hero__chip, .hero__card");
  var heroSection = $(".hero");
  if (heroLayers.length && heroSection && !reduceMotion) {
    var hm = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener("mousemove", function (e) {
      hm.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      hm.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    var ht0 = performance.now();
    var heroVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { heroVisible = en.isIntersecting; });
      }, { threshold: 0.01 }).observe(heroSection);
    }
    (function heroLoop(now) {
      requestAnimationFrame(heroLoop);
      if (!heroVisible || document.hidden) return;
      hm.x += (hm.tx - hm.x) * 0.05;
      hm.y += (hm.ty - hm.y) * 0.05;
      var t = (now - ht0) / 1000;
      for (var i = 0; i < heroLayers.length; i++) {
        var el = heroLayers[i];
        var depth = parseFloat(el.getAttribute("data-parallax")) || 0.5;
        var amp = 5 + depth * 5;
        var fx = Math.sin(t * 0.5 + i * 1.7) * amp * 0.5;
        var fy = Math.cos(t * 0.42 + i * 1.15) * amp;
        var px = -hm.x * depth * 20;
        var py = -hm.y * depth * 20;
        el.style.transform = "translate3d(" + (fx + px).toFixed(2) + "px," + (fy + py).toFixed(2) + "px,0)";
      }
    })(ht0);
  }

  /* ---------- Subtle 3D tilt on featured visuals ---------- */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    $$("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 5, ry = (px - 0.5) * 5;
        el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }
})();
