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
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.dataset.delay) el.dataset.delay = i * 80;
  observer.observe(el);
});

// Observer dedicado pro arsenal-grid: trigga a classe que ativa o stagger via CSS
const arsenalGrid = document.querySelector('.arsenal-grid');
if (arsenalGrid) {
  const arsenalObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('arsenal-revealed');
      arsenalObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  arsenalObserver.observe(arsenalGrid);
}
