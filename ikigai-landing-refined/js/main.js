/* ============================================================
   MAIN — Scroll animations, navbar, mobile menu, active nav,
           form feedback. initTheme() is defined in theme.js
           and loaded before this script in index.html.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initForm();
});

/* ---- Fade-up on scroll ---- */
function initScrollAnimations() {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });
}

/* ---- Navbar scroll class ---- */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile drawer ---- */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  var overlay   = document.getElementById('navOverlay');
  if (!hamburger || !navLinks || !overlay) return;

  function open() {
    hamburger.classList.add('open');
    navLinks.classList.add('mobile-open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    hamburger.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', close);
  });
}

/* ---- Active nav link on scroll ---- */
function initActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (s) { observer.observe(s); });
}

/* ---- Contact form feedback ---- */
function initForm() {
  var form    = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');
  });
}
