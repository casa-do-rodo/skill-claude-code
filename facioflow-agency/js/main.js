const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const toggle = document.querySelector('.navbar-mobile-toggle');
const links  = document.querySelector('.navbar-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.setAttribute('aria-label', 'Abrir menu');
    })
  );
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.dataset.delay) el.dataset.delay = i * 60;
  observer.observe(el);
});

/* ============================================================
   Service visual SVG animations
   Observer dedicado: adiciona .svc-active aos .service-visual
   na primeira entrada (single-fire via unobserve).
   threshold 0.3 para o usuário ver o contexto antes da animação rodar.
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const svcObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('svc-active');
      svcObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.service-visual').forEach(el => svcObserver.observe(el));

/* Counter "+27%" no dashboard (svc-3) — anima de 0 a 27 com ease-out cúbico.
   Trigger separado: aguarda as barras começarem a crescer (~300ms após svc-active). */
const dashSvg  = document.querySelector('.svc-3');
const dashText = document.getElementById('dashboard-pct');

if (dashSvg && dashText) {
  if (prefersReducedMotion) {
    // Sem animação — mostra valor final direto
    dashText.textContent = '+27%';
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const target = 27;
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cúbico (combina com cubic-bezier(0.22, 1, 0.36, 1))
          const eased = 1 - Math.pow(1 - progress, 3);
          const v = Math.round(target * eased);
          dashText.textContent = `+${v}%`;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counterObserver.observe(dashSvg);
  }
}
