// Navbar scroll state
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu
const toggle = document.querySelector('.navbar-mobile-toggle');
const links  = document.querySelector('.navbar-links');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Pipeline node active state on scroll-into-view
const pipelineSection = document.querySelector('.pipeline-flow');
if (pipelineSection) {
  const pipeObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const nodes = document.querySelectorAll('.pipe-node');
      nodes.forEach((node, i) => {
        setTimeout(() => node.classList.add('active'), i * 200);
      });
      pipeObserver.unobserve(pipelineSection);
    }
  }, { threshold: 0.3 });
  pipeObserver.observe(pipelineSection);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
