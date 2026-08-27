/* =========================================================
   Shared behaviour for all three templates.
   Every function checks for the relevant elements before
   running, so this single file works unmodified across
   template1.html, template2.html and template3.html.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initBeforeAfterSliders();
  initLightbox();
  initAccordions();
  initReviewCarousel();
  initContactForms();
  initBaThumbs();
});

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  var toggle = document.querySelector('[data-nav-toggle]');
  var list = document.querySelector('[data-nav-list]');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    list.classList.toggle('is-open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  list.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'false');
      list.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      toggle.setAttribute('aria-expanded', 'false');
      list.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ---------- Before / after comparison slider ---------- */
function initBeforeAfterSliders() {
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var afterEl = slider.querySelector('.ba-after');
    var handle = slider.querySelector('.ba-handle');
    var range = slider.querySelector('input[type="range"]');
    if (!afterEl || !range) return;

    function update(value) {
      afterEl.style.clipPath = 'inset(0 0 0 ' + value + '%)';
      if (handle) handle.style.left = value + '%';
    }

    range.addEventListener('input', function () {
      update(range.value);
    });

    update(range.value || 50);
  });
}

/* ---------- Lightbox for gallery / before-after images ---------- */
function initLightbox() {
  var lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return;
  var content = lightbox.querySelector('[data-lightbox-content]');
  var closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var label = trigger.getAttribute('data-lightbox-label') || trigger.textContent.trim();
      if (content) {
        content.innerHTML = '';
        var block = document.createElement('div');
        block.className = 'ph-img';
        block.setAttribute('data-label', label);
        block.style.aspectRatio = '4 / 3';
        content.appendChild(block);
      }
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn && closeBtn.focus();
    });
  });

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  closeBtn && closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
}

/* ---------- Accordion ---------- */
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (!panel) return;
      panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
    });
  });
}

/* ---------- Simple review carousel (Template 2) ---------- */
function initReviewCarousel() {
  var wrap = document.querySelector('[data-review-carousel]');
  if (!wrap) return;
  var slides = wrap.querySelectorAll('[data-review-slide]');
  var dotsWrap = document.querySelector('[data-review-dots]');
  if (!slides.length) return;

  var dots = [];
  if (dotsWrap) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { show(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function show(index) {
    slides.forEach(function (slide, i) {
      slide.style.display = i === index ? '' : 'none';
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
  }

  show(0);
}

/* ---------- Before/after thumbnail switcher (Template 3) ---------- */
function initBaThumbs() {
  var thumbWrap = document.querySelector('[data-ba-thumbs]');
  if (!thumbWrap) return;
  var buttons = thumbWrap.querySelectorAll('button');
  var slider = document.querySelector('[data-ba-target]');
  if (!slider) return;
  var before = slider.querySelector('.ba-before');
  var after = slider.querySelector('.ba-after');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var label = btn.getAttribute('data-case') || btn.textContent.trim();
      if (before) before.setAttribute('data-label', 'Before — ' + label);
      if (after) after.setAttribute('data-label', 'After — ' + label);
    });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForms() {
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('input[required], textarea[required]').forEach(function (field) {
        field.classList.add('touched');
        var errorEl = form.querySelector('[data-error-for="' + field.name + '"]');
        var fieldValid = field.checkValidity();
        if (!fieldValid) valid = false;
        if (errorEl) {
          errorEl.textContent = fieldValid ? '' : (field.validationMessage || 'Please check this field.');
        }
      });

      if (status) {
        status.textContent = valid
          ? 'Thanks — this is a design draft, so the form does not send yet. Once approved, this will notify [BUSINESS NAME] directly.'
          : 'Please fill in the required fields above.';
        status.style.color = valid ? 'var(--accent-dark)' : '#A9694F';
      }
    });

    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () {
        field.classList.add('touched');
      });
    });
  });
}
