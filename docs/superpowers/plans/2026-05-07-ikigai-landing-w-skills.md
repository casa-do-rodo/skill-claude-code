# Ikigai Landing W/Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `ikigai-landing-w-skills/` — landing page institucional Ikigai Brand com estética Dark & Bold, Bebas Neue + Inter, sempre dark, animações cinematográficas via IntersectionObserver.

**Architecture:** HTML/CSS/JS puro, 4 arquivos CSS (tokens → base → components → sections) + 1 JS. Sem frameworks, sem build tools. Abre via `file://` direto no browser.

**Tech Stack:** HTML5, CSS3 (custom properties, clip-path, grid), Vanilla JS (IntersectionObserver), Google Fonts (Bebas Neue + Inter).

---

## Mapa de Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `ikigai-landing-w-skills/index.html` | Estrutura HTML completa, todas as seções, links de fontes e CSS |
| `ikigai-landing-w-skills/css/tokens.css` | Custom properties: cores, tipografia, espaçamentos, sombras, transições |
| `ikigai-landing-w-skills/css/base.css` | Reset, body, tipografia global, classes de animação (.reveal-up, .fade-up) |
| `ikigai-landing-w-skills/css/components.css` | Navbar, hamburger, overlay, botões, badges, cards, galeria, formulário, social |
| `ikigai-landing-w-skills/css/sections.css` | Layout específico de cada seção + breakpoints responsivos |
| `ikigai-landing-w-skills/js/main.js` | IntersectionObserver, navbar scroll, mobile menu, form submit |

---

## Task 1: Scaffold + tokens.css

**Files:**
- Create: `ikigai-landing-w-skills/css/tokens.css`
- Create dirs: `ikigai-landing-w-skills/css/` e `ikigai-landing-w-skills/js/`

- [ ] **Step 1: Criar estrutura de diretórios**

```powershell
New-Item -ItemType Directory -Force -Path "ikigai-landing-w-skills/css"
New-Item -ItemType Directory -Force -Path "ikigai-landing-w-skills/js"
```

- [ ] **Step 2: Criar `ikigai-landing-w-skills/css/tokens.css`**

```css
/* ============================================================
   TOKENS — Ikigai Landing W/Skills
   Always dark. No theme toggle.
   ============================================================ */

:root {
  /* --- Backgrounds --- */
  --color-bg:       #080808;
  --color-bg-alt:   #0F0F0F;
  --color-bg-card:  #141414;
  --color-bg-footer:#040404;

  /* --- Accent: Amber only --- */
  --color-amber:       #E8970A;
  --color-amber-light: #F5B83D;
  --color-amber-glow:  rgba(232, 151, 10, 0.15);
  --color-amber-border:rgba(232, 151, 10, 0.30);

  /* --- Category colors --- */
  --color-aqua:  #0EA5E9;
  --color-trail: #22C55E;
  --color-urban: #A855F7;

  /* --- Text --- */
  --color-text:        #F5F5F5;
  --color-text-muted:  rgba(255, 255, 255, 0.45);
  --color-text-subtle: rgba(255, 255, 255, 0.20);

  /* --- Borders --- */
  --color-border:       rgba(255, 255, 255, 0.08);
  --color-border-amber: rgba(232, 151, 10, 0.30);

  /* --- Typography --- */
  --font-display: 'Bebas Neue', 'Impact', sans-serif;
  --font-body:    'Inter', system-ui, sans-serif;

  /* --- Font sizes --- */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;

  /* --- Spacing --- */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* --- Border radius --- */
  --radius-sm:   2px;
  --radius-md:   4px;
  --radius-lg:   8px;
  --radius-xl:   12px;
  --radius-2xl:  20px;
  --radius-full: 9999px;

  /* --- Shadows --- */
  --shadow-amber:    0 20px 40px rgba(232, 151, 10, 0.12);
  --shadow-amber-sm: 0 8px 20px rgba(232, 151, 10, 0.08);
  --shadow-card:     0 4px 24px rgba(0, 0, 0, 0.4);

  /* --- Transitions --- */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 600ms cubic-bezier(0.16, 1, 0.3, 1);

  /* --- Z-index --- */
  --z-navbar:  100;
  --z-overlay: 200;
  --z-drawer:  300;
}
```

- [ ] **Step 3: Verificar arquivo**

Abrir `ikigai-landing-w-skills/css/tokens.css` e confirmar que todas as variáveis estão presentes.

---

## Task 2: base.css

**Files:**
- Create: `ikigai-landing-w-skills/css/base.css`

- [ ] **Step 1: Criar `ikigai-landing-w-skills/css/base.css`**

```css
/* ============================================================
   BASE — Reset, body, tipografia global, animações
   ============================================================ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  overflow-x: hidden;
}

a    { color: inherit; text-decoration: none; }
img  { display: block; max-width: 100%; }
ul   { list-style: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }

/* ---- Container ---- */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* ---- Tipografia global ---- */
h1, h2, h3, h4 {
  font-family: var(--font-display);
  letter-spacing: 0.02em;
  line-height: 1;
}

/* ---- Utilitários de seção ---- */
.section-tag {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-amber);
  margin-bottom: var(--space-4);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--color-text);
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: var(--space-6);
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: var(--space-12);
}

/* ---- Animações de entrada ---- */

/* Clip-path reveal — para títulos */
.reveal-up {
  clip-path: inset(100% 0 0 0);
  opacity: 0;
  transition:
    clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
}
.reveal-up.visible {
  clip-path: inset(0% 0 0 0);
  opacity: 1;
}

/* Fade + slide — para cards e conteúdo */
.fade-up {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.6s ease,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays — aplicar data-delay="N" no HTML */
[data-delay="1"] { transition-delay: 0.10s; }
[data-delay="2"] { transition-delay: 0.20s; }
[data-delay="3"] { transition-delay: 0.30s; }
[data-delay="4"] { transition-delay: 0.40s; }
[data-delay="5"] { transition-delay: 0.50s; }
[data-delay="6"] { transition-delay: 0.60s; }

/* ---- Keyframes ---- */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(232, 151, 10, 0.3); }
  50%       { box-shadow: 0 0 22px rgba(232, 151, 10, 0.65); }
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50%       { transform: translateY(7px); opacity: 1; }
}

@keyframes amber-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

- [ ] **Step 2: Verificar**

Confirmar que `.reveal-up`, `.fade-up`, `[data-delay]` e os dois keyframes estão presentes.

---

## Task 3: components.css — Navbar, Botões, Badges

**Files:**
- Create: `ikigai-landing-w-skills/css/components.css`

- [ ] **Step 1: Criar `ikigai-landing-w-skills/css/components.css` com navbar, botões e badges**

```css
/* ============================================================
   COMPONENTS — Navbar, Botões, Badges, Cards, Form, Social
   ============================================================ */

/* ---- NAVBAR ---- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-navbar);
  background: rgba(8, 8, 8, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-base);
}

.navbar.scrolled {
  border-bottom-color: var(--color-border-amber);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-text);
  letter-spacing: 0.08em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-links a {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  text-transform: uppercase;
  transition: color var(--transition-fast);
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--color-amber);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* ---- HAMBURGER ---- */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  gap: 6px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  transition: transform var(--transition-base), opacity var(--transition-fast);
}

.hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

/* ---- NAV OVERLAY (mobile) ---- */
.nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: var(--z-overlay);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-base);
}

.nav-overlay.open {
  opacity: 1;
  pointer-events: all;
}

/* ---- BOTÕES ---- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.08em;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.btn-amber {
  background: var(--color-amber);
  color: #000;
  border: 2px solid var(--color-amber);
}

.btn-amber:hover {
  background: var(--color-amber-light);
  border-color: var(--color-amber-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232, 151, 10, 0.3);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.btn-ghost:hover {
  border-color: var(--color-amber);
  color: var(--color-amber);
  transform: translateY(-2px);
}

/* ---- BADGES DE CATEGORIA ---- */
.badge {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-4);
}

.badge-aqua  { background: rgba(14, 165, 233, 0.15); color: #0EA5E9; }
.badge-trail { background: rgba(34, 197, 94, 0.15);  color: #22C55E; }
.badge-urban { background: rgba(168, 85, 247, 0.15); color: #A855F7; }

/* ---- PRODUCT CARDS ---- */
.produto-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition:
    transform var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.produto-card:hover {
  transform: translateY(-8px);
  border-color: rgba(232, 151, 10, 0.6);
  box-shadow: var(--shadow-amber);
}

.produto-image {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  color: var(--color-text-subtle);
  position: relative;
  overflow: hidden;
}

.produto-info {
  padding: var(--space-6);
}

.produto-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.04em;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.produto-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.produto-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.produto-price {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-amber);
  letter-spacing: 0.04em;
}

.produto-link {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  opacity: 0;
  transition: opacity var(--transition-base), color var(--transition-fast);
}

.produto-card:hover .produto-link {
  opacity: 1;
  color: var(--color-amber);
}

/* ---- DIFERENCIAL CARDS ---- */
.diferencial-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  transition: border-color var(--transition-base);
}

.diferencial-card:hover {
  border-color: var(--color-border-amber);
}

.diferencial-icon {
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-4);
  color: var(--color-amber);
}

.diferencial-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.diferencial-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.65;
}

/* ---- GALERIA ---- */
.galeria-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.galeria-item-bg {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.galeria-item:hover .galeria-item-bg {
  transform: scale(1.05);
}

.galeria-overlay {
  position: absolute;
  inset: 0;
  background: rgba(8, 8, 8, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.galeria-item:hover .galeria-overlay {
  opacity: 1;
}

.galeria-overlay-icon {
  width: 36px;
  height: 36px;
  color: var(--color-amber);
}

.galeria-overlay-text {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  color: var(--color-text);
}

/* ---- DEPOIMENTO CARDS ---- */
.depoimento-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-8) var(--space-6) var(--space-6);
  position: relative;
  overflow: hidden;
}

.depoimento-quote-mark {
  font-family: var(--font-display);
  font-size: 7rem;
  color: var(--color-amber);
  opacity: 0.15;
  line-height: 1;
  position: absolute;
  top: var(--space-2);
  left: var(--space-4);
  pointer-events: none;
}

.depoimento-text {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: var(--space-6);
  position: relative;
}

.depoimento-stars {
  display: flex;
  gap: 2px;
  margin-bottom: var(--space-4);
}

.depoimento-stars span {
  color: var(--color-amber);
  font-size: var(--text-sm);
}

.depoimento-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.depoimento-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-amber);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-amber);
  flex-shrink: 0;
}

.depoimento-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.depoimento-role {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* ---- FLOAT LABEL FORM ---- */
.form-group {
  position: relative;
  margin-bottom: var(--space-5);
}

.form-input,
.form-textarea {
  width: 100%;
  background: var(--color-bg-card);
  border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-base);
  padding: var(--space-5) 0 var(--space-2);
  outline: none;
  transition: border-color var(--transition-base);
}

.form-input::placeholder,
.form-textarea::placeholder { color: transparent; }

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-label {
  position: absolute;
  left: 0;
  top: var(--space-4);
  font-size: var(--text-base);
  color: var(--color-text-muted);
  pointer-events: none;
  transition: all var(--transition-base);
}

.form-input:focus ~ .form-label,
.form-input:not(:placeholder-shown) ~ .form-label,
.form-textarea:focus ~ .form-label,
.form-textarea:not(:placeholder-shown) ~ .form-label {
  top: 0;
  font-size: var(--text-xs);
  color: var(--color-amber);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.form-input:focus,
.form-textarea:focus {
  border-bottom-color: var(--color-amber);
}

.form-line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: var(--color-amber);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.form-input:focus ~ .form-line,
.form-textarea:focus ~ .form-line {
  transform: scaleX(1);
}

/* ---- FORM SUCCESS ---- */
#formSuccess {
  display: none;
  text-align: center;
  padding: var(--space-12);
}

#formSuccess.show {
  display: block;
}

#formSuccess .success-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

#formSuccess h3 {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-amber);
  letter-spacing: 0.04em;
  margin-bottom: var(--space-2);
}

#formSuccess p {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

/* ---- SOCIAL LINKS ---- */
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  transition: all var(--transition-base);
}

.social-link:hover {
  border-color: var(--color-amber);
  color: var(--color-amber);
  transform: translateY(-3px);
}

/* ---- NAV CTA ---- */
.nav-cta {
  padding: var(--space-2) var(--space-5);
  font-size: 0.85rem;
}
```

- [ ] **Step 2: Verificar**

Confirmar que `.produto-card`, `.diferencial-card`, `.depoimento-card`, `.form-group`, `.galeria-item` estão no arquivo.

---

## Task 4: sections.css

**Files:**
- Create: `ikigai-landing-w-skills/css/sections.css`

- [ ] **Step 1: Criar `ikigai-landing-w-skills/css/sections.css`**

```css
/* ============================================================
   SECTIONS — Layout específico de cada seção
   ============================================================ */

/* ---- HERO ---- */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  overflow: hidden;
  text-align: center;
  padding: 0 var(--space-6);
}

.hero-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(232, 151, 10, 0.18) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-amber);
  margin-bottom: var(--space-6);
  animation: glow-pulse 2.5s ease-in-out infinite;
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-amber);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(4rem, 10vw, 10rem);
  color: var(--color-text);
  letter-spacing: -0.02em;
  line-height: 0.9;
  margin-bottom: var(--space-6);
}

.hero-title span {
  color: var(--color-amber);
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--color-text-muted);
  line-height: 1.65;
  max-width: 480px;
  margin: 0 auto var(--space-8);
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero-scroll {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.hero-scroll span {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.hero-scroll-chevron {
  width: 20px;
  height: 20px;
  color: var(--color-amber);
  animation: bounce-down 1.8s ease-in-out infinite;
}

.hero-wave {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  line-height: 0;
  z-index: 2;
}

.hero-wave svg {
  width: 100%;
  height: 60px;
  display: block;
}

/* ---- SOBRE ---- */
.sobre {
  padding: var(--space-24) 0;
  background: var(--color-bg-alt);
}

.sobre-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.sobre-text-wrap {
  position: relative;
}

.sobre-year {
  position: absolute;
  top: -20px;
  left: -10px;
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 8rem);
  color: var(--color-text);
  opacity: 0.04;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.sobre-accent {
  border-left: 3px solid var(--color-amber);
  padding-left: var(--space-5);
  margin: var(--space-6) 0;
}

.sobre-accent p {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.75;
  font-style: italic;
}

.sobre-text {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: var(--space-5);
}

.sobre-image-wrap {
  position: relative;
}

.sobre-image-wrap img,
.sobre-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border-amber);
  box-shadow: 0 0 40px rgba(232, 151, 10, 0.1);
  object-fit: cover;
}

.sobre-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #141414 0%, #1a1a2e 100%);
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-amber);
  opacity: 0.4;
}

/* ---- PRODUTOS ---- */
.produtos {
  padding: var(--space-24) 0;
  background: var(--color-bg);
}

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

/* ---- DIFERENCIAIS ---- */
.diferenciais {
  padding: var(--space-24) 0;
  background: var(--color-bg-alt);
}

.diferenciais-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

/* ---- GALERIA ---- */
.galeria {
  padding: var(--space-24) 0;
  background: var(--color-bg);
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 280px;
  gap: var(--space-4);
}

.galeria-item--wide {
  grid-column: span 2;
}

/* ---- DEPOIMENTOS ---- */
.depoimentos {
  padding: var(--space-24) 0;
  background: var(--color-bg-alt);
}

.depoimentos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  align-items: start;
}

/* ---- CONTATO ---- */
.contato {
  padding: var(--space-24) 0;
  background: var(--color-bg);
}

.contato-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-16);
  align-items: start;
}

.contato-info-title {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.04em;
  color: var(--color-amber);
  margin-bottom: var(--space-2);
}

.contato-info-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-6);
}

.contato-detail {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.contato-detail-icon {
  width: 18px;
  height: 18px;
  color: var(--color-amber);
  flex-shrink: 0;
  margin-top: 2px;
}

.contato-detail-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.contato-social {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.contato-form-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}

/* ---- FOOTER ---- */
.footer {
  background: var(--color-bg-footer);
  padding: var(--space-16) 0 0;
  border-top: 1px solid rgba(232, 151, 10, 0.2);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: var(--space-8);
  padding-bottom: var(--space-12);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.footer-tagline {
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  line-height: 1.65;
  max-width: 280px;
}

.footer-col-title {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-5);
}

.footer-links li {
  margin-bottom: var(--space-3);
}

.footer-links a {
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-amber);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--space-6) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.footer-copyright {
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
}

.footer-bottom-links {
  display: flex;
  gap: var(--space-5);
}

.footer-bottom-links a {
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
  transition: color var(--transition-fast);
}

.footer-bottom-links a:hover { color: var(--color-amber); }

/* ============================================================
   RESPONSIVO
   ============================================================ */

@media (max-width: 1024px) {
  .nav-links  { display: none; }
  .hamburger  { display: flex; }
  .nav-links.mobile-open {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: #0F0F0F;
    padding: var(--space-20) var(--space-8);
    z-index: var(--z-drawer);
    gap: var(--space-6);
    border-left: 1px solid var(--color-border);
  }

  .sobre-grid       { grid-template-columns: 1fr; }
  .produtos-grid    { grid-template-columns: repeat(2, 1fr); }
  .diferenciais-grid{ grid-template-columns: repeat(2, 1fr); }
  .depoimentos-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid      { grid-template-columns: 1fr 1fr; gap: var(--space-10); }
}

@media (max-width: 768px) {
  .hero-title { font-size: clamp(3rem, 12vw, 5rem); }

  .galeria-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 200px; }
  .galeria-item--wide { grid-column: span 2; }

  .contato-grid    { grid-template-columns: 1fr; }
  .produtos-grid   { grid-template-columns: 1fr; }
  .depoimentos-grid{ grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero-actions     { flex-direction: column; }
  .hero-actions .btn{ width: 100%; justify-content: center; }

  .diferenciais-grid{ grid-template-columns: 1fr; }
  .galeria-grid     { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .galeria-item--wide{ grid-column: span 1; }
  .footer-grid      { grid-template-columns: 1fr; }
  .footer-bottom    { flex-direction: column; text-align: center; }
}
```

- [ ] **Step 2: Verificar**

Confirmar que `.hero`, `.sobre`, `.produtos`, `.diferenciais`, `.galeria`, `.depoimentos`, `.contato`, `.footer` e os 3 breakpoints estão no arquivo.

---

## Task 5: index.html

**Files:**
- Create: `ikigai-landing-w-skills/index.html`

- [ ] **Step 1: Criar `ikigai-landing-w-skills/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ikigai Brand — Encontre seu propósito em movimento</title>
  <meta name="description" content="Ikigai Brand — Moda e equipamentos para quem vive a vida em movimento.">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/sections.css">
</head>
<body>

  <!-- OVERLAY -->
  <div class="nav-overlay" id="navOverlay"></div>

  <!-- NAVBAR -->
  <nav class="navbar" id="navbar">
    <div class="container nav-container">
      <a href="#" class="logo">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E8970A"/>
          <circle cx="20" cy="20" r="12" stroke="#000" stroke-width="2" fill="none"/>
          <circle cx="20" cy="20" r="5" fill="#000"/>
          <line x1="20" y1="4" x2="20" y2="36" stroke="#000" stroke-width="1.8"/>
          <line x1="4" y1="20" x2="36" y2="20" stroke="#000" stroke-width="1.8"/>
        </svg>
        <span class="logo-text">IKIGAI</span>
      </a>

      <ul class="nav-links" id="navLinks">
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#produtos">Produtos</a></li>
        <li><a href="#diferenciais">Por que Ikigai</a></li>
        <li><a href="#galeria">Galeria</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>

      <div class="nav-actions">
        <a href="#contato" class="btn btn-amber nav-cta">Conhecer</a>
        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero" id="hero">
    <div class="hero-glow"></div>
    <div class="hero-content">
      <div class="hero-badge fade-up">
        <span class="hero-badge-dot"></span>
        Nova Coleção 2025
      </div>
      <h1 class="hero-title reveal-up">
        VIVA CADA<br/><span>MOVIMENTO</span>
      </h1>
      <p class="hero-subtitle fade-up" data-delay="2">
        Equipamentos e moda para quem encontrou seu propósito no movimento. Esportes aquáticos, trail e estilo urbano.
      </p>
      <div class="hero-actions fade-up" data-delay="3">
        <a href="#produtos" class="btn btn-amber">Explorar Coleção</a>
        <a href="#sobre" class="btn btn-ghost">Nossa História</a>
      </div>
    </div>

    <div class="hero-scroll">
      <span>Scroll</span>
      <svg class="hero-scroll-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>

    <div class="hero-wave">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0F0F0F"/>
      </svg>
    </div>
  </section>

  <!-- SOBRE -->
  <section class="sobre" id="sobre">
    <div class="container">
      <div class="sobre-grid">
        <div class="sobre-text-wrap">
          <div class="sobre-year" aria-hidden="true">2019</div>
          <span class="section-tag fade-up">Nossa história</span>
          <h2 class="section-title reveal-up">QUEM SOMOS</h2>
          <div class="sobre-accent fade-up" data-delay="1">
            <p>"Ikigai é a razão de ser — aquilo que nos faz levantar todos os dias com propósito."</p>
          </div>
          <p class="sobre-text fade-up" data-delay="2">
            Fundada em 2019 por atletas apaixonados, a Ikigai Brand nasceu da crença de que movimento e propósito são inseparáveis. Cada produto que desenvolvemos é pensado para quem não para — seja na água, na trilha ou na cidade.
          </p>
          <p class="sobre-text fade-up" data-delay="3">
            Nossa missão é criar equipamentos que acompanham sua jornada, com design funcional e materiais de alta performance que respeitam o meio ambiente.
          </p>
          <a href="#produtos" class="btn btn-amber fade-up" data-delay="4">Ver Produtos</a>
        </div>

        <div class="sobre-image-wrap fade-up" data-delay="2">
          <div class="sobre-placeholder">⊕</div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUTOS -->
  <section class="produtos" id="produtos">
    <div class="container">
      <span class="section-tag fade-up">Coleção</span>
      <h2 class="section-title reveal-up">NOSSOS PRODUTOS</h2>
      <p class="section-subtitle fade-up" data-delay="1">Três linhas desenvolvidas para diferentes formas de movimento — todas com o mesmo compromisso de qualidade.</p>

      <div class="produtos-grid">
        <!-- Card 1 -->
        <article class="produto-card fade-up" data-delay="1">
          <div class="produto-image" style="background: linear-gradient(135deg, #0a1628 0%, #0e2040 100%);">
            <span class="badge badge-aqua">AQUA</span>
          </div>
          <div class="produto-info">
            <span class="badge badge-aqua">AQUA</span>
            <h3 class="produto-name">LINHA AQUA</h3>
            <p class="produto-desc">Equipamentos desenvolvidos para esportes aquáticos. Materiais resistentes à água salgada e UV, com tecnologia de secagem rápida.</p>
            <div class="produto-footer">
              <span class="produto-price">R$ 289</span>
              <span class="produto-link">Ver Produto →</span>
            </div>
          </div>
        </article>

        <!-- Card 2 -->
        <article class="produto-card fade-up" data-delay="2">
          <div class="produto-image" style="background: linear-gradient(135deg, #0a1a0e 0%, #0d2812 100%);">
            <span class="badge badge-trail">TRAIL</span>
          </div>
          <div class="produto-info">
            <span class="badge badge-trail">TRAIL</span>
            <h3 class="produto-name">LINHA TRAIL</h3>
            <p class="produto-desc">Para trilhas e aventuras outdoor. Resistência extrema, leveza máxima. Desenvolvida com atletas de trail running e mountain bike.</p>
            <div class="produto-footer">
              <span class="produto-price">R$ 349</span>
              <span class="produto-link">Ver Produto →</span>
            </div>
          </div>
        </article>

        <!-- Card 3 -->
        <article class="produto-card fade-up" data-delay="3">
          <div class="produto-image" style="background: linear-gradient(135deg, #130a1f 0%, #1e0f30 100%);">
            <span class="badge badge-urban">URBAN</span>
          </div>
          <div class="produto-info">
            <span class="badge badge-urban">URBAN</span>
            <h3 class="produto-name">LINHA URBAN</h3>
            <p class="produto-desc">Estilo e performance para o dia a dia urbano. Design contemporâneo que transita entre o treino e a rua sem abrir mão de nada.</p>
            <div class="produto-footer">
              <span class="produto-price">R$ 219</span>
              <span class="produto-link">Ver Produto →</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- DIFERENCIAIS -->
  <section class="diferenciais" id="diferenciais">
    <div class="container">
      <span class="section-tag fade-up">Por que Ikigai</span>
      <h2 class="section-title reveal-up">NOSSOS DIFERENCIAIS</h2>
      <p class="section-subtitle fade-up" data-delay="1">Cada detalhe foi pensado para quem leva a sério seu movimento.</p>

      <div class="diferenciais-grid">
        <div class="diferencial-card fade-up" data-delay="1">
          <svg class="diferencial-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <h3 class="diferencial-title">ALTA PERFORMANCE</h3>
          <p class="diferencial-text">Materiais selecionados com tecnologia de ponta para suportar as condições mais extremas sem comprometer o conforto.</p>
        </div>
        <div class="diferencial-card fade-up" data-delay="2">
          <svg class="diferencial-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <h3 class="diferencial-title">DURABILIDADE</h3>
          <p class="diferencial-text">Testados por atletas em condições reais. Garantia de 2 anos em todos os produtos da linha técnica.</p>
        </div>
        <div class="diferencial-card fade-up" data-delay="3">
          <svg class="diferencial-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <h3 class="diferencial-title">SUSTENTABILIDADE</h3>
          <p class="diferencial-text">Materiais reciclados e processos de produção que minimizam o impacto ambiental. Porque cuidar da natureza é cuidar do nosso campo.</p>
        </div>
        <div class="diferencial-card fade-up" data-delay="4">
          <svg class="diferencial-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <h3 class="diferencial-title">ENTREGA RÁPIDA</h3>
          <p class="diferencial-text">Logística otimizada para todo o Brasil. Pedidos confirmados até 14h saem no mesmo dia útil.</p>
        </div>
        <div class="diferencial-card fade-up" data-delay="5">
          <svg class="diferencial-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          <h3 class="diferencial-title">COMUNIDADE</h3>
          <p class="diferencial-text">Mais de 15.000 atletas na comunidade Ikigai. Eventos, treinos coletivos e conexão com quem compartilha seu propósito.</p>
        </div>
        <div class="diferencial-card fade-up" data-delay="6">
          <svg class="diferencial-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
          <h3 class="diferencial-title">SATISFAÇÃO GARANTIDA</h3>
          <p class="diferencial-text">30 dias para troca ou devolução sem burocracia. Se não ficou perfeito, resolvemos.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- GALERIA -->
  <section class="galeria" id="galeria">
    <div class="container">
      <span class="section-tag fade-up">Galeria</span>
      <h2 class="section-title reveal-up">EM MOVIMENTO</h2>
      <p class="section-subtitle fade-up" data-delay="1">A Ikigai Brand em ação — atletas reais, momentos reais.</p>

      <div class="galeria-grid">
        <div class="galeria-item galeria-item--wide fade-up" data-delay="1">
          <div class="galeria-item-bg" style="height: 100%; background: linear-gradient(135deg, #0a1628 0%, #1a3050 100%);"></div>
          <div class="galeria-overlay">
            <svg class="galeria-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="galeria-overlay-text">AQUA SERIES</span>
          </div>
        </div>

        <div class="galeria-item fade-up" data-delay="2">
          <div class="galeria-item-bg" style="height: 100%; background: linear-gradient(135deg, #0a1a0e 0%, #1a3018 100%);"></div>
          <div class="galeria-overlay">
            <svg class="galeria-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="galeria-overlay-text">TRAIL RUN</span>
          </div>
        </div>

        <div class="galeria-item fade-up" data-delay="1">
          <div class="galeria-item-bg" style="height: 100%; background: linear-gradient(135deg, #130a1f 0%, #251040 100%);"></div>
          <div class="galeria-overlay">
            <svg class="galeria-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="galeria-overlay-text">URBAN STYLE</span>
          </div>
        </div>

        <div class="galeria-item fade-up" data-delay="2">
          <div class="galeria-item-bg" style="height: 100%; background: linear-gradient(135deg, #1a0f08 0%, #2a1a08 100%);"></div>
          <div class="galeria-overlay">
            <svg class="galeria-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="galeria-overlay-text">OUTDOOR</span>
          </div>
        </div>

        <div class="galeria-item galeria-item--wide fade-up" data-delay="3">
          <div class="galeria-item-bg" style="height: 100%; background: linear-gradient(135deg, #080808 0%, #1a1a2e 50%, #16213e 100%);"></div>
          <div class="galeria-overlay">
            <svg class="galeria-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="galeria-overlay-text">CAMPANHA 2025</span>
          </div>
        </div>

        <div class="galeria-item fade-up" data-delay="4">
          <div class="galeria-item-bg" style="height: 100%; background: linear-gradient(135deg, #0f0a00 0%, #1a1200 100%);"></div>
          <div class="galeria-overlay">
            <svg class="galeria-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="galeria-overlay-text">ACESSÓRIOS</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- DEPOIMENTOS -->
  <section class="depoimentos" id="depoimentos">
    <div class="container">
      <span class="section-tag fade-up">Depoimentos</span>
      <h2 class="section-title reveal-up">O QUE DIZEM</h2>
      <p class="section-subtitle fade-up" data-delay="1">Quem usa Ikigai sente a diferença.</p>

      <div class="depoimentos-grid">
        <div class="depoimento-card fade-up" data-delay="1">
          <div class="depoimento-quote-mark" aria-hidden="true">"</div>
          <div class="depoimento-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p class="depoimento-text">A linha Aqua é incrível. Já testei em competições de stand-up paddle e o material aguenta sem perder a forma. Vale cada centavo.</p>
          <div class="depoimento-author">
            <div class="depoimento-avatar">MR</div>
            <div>
              <div class="depoimento-name">Marina Rocha</div>
              <div class="depoimento-role">Atleta de SUP — São Paulo</div>
            </div>
          </div>
        </div>

        <div class="depoimento-card fade-up" data-delay="2">
          <div class="depoimento-quote-mark" aria-hidden="true">"</div>
          <div class="depoimento-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p class="depoimento-text">Uso a linha Trail há 8 meses, já fiz três ultramaratonas com os produtos deles. Qualidade absurda e o pós-venda é excelente.</p>
          <div class="depoimento-author">
            <div class="depoimento-avatar">TC</div>
            <div>
              <div class="depoimento-name">Thiago Costa</div>
              <div class="depoimento-role">Ultra runner — Curitiba</div>
            </div>
          </div>
        </div>

        <div class="depoimento-card fade-up" data-delay="3">
          <div class="depoimento-quote-mark" aria-hidden="true">"</div>
          <div class="depoimento-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p class="depoimento-text">A linha Urban é o equilíbrio perfeito. Vou do treino pra reunião sem precisar trocar de roupa. Design sem igual no mercado.</p>
          <div class="depoimento-author">
            <div class="depoimento-avatar">AL</div>
            <div>
              <div class="depoimento-name">Ana Lima</div>
              <div class="depoimento-role">Designer + atleta — Rio de Janeiro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTATO -->
  <section class="contato" id="contato">
    <div class="container">
      <div class="contato-grid">
        <div>
          <span class="section-tag fade-up">Contato</span>
          <h2 class="section-title reveal-up">FALE COM A GENTE</h2>
          <p class="contato-info-text fade-up" data-delay="1">Dúvidas sobre produtos, parcerias ou só quer falar sobre movimento? Estamos aqui.</p>

          <div class="contato-detail fade-up" data-delay="2">
            <svg class="contato-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="contato-detail-text">São Paulo, SP — Brasil</span>
          </div>
          <div class="contato-detail fade-up" data-delay="3">
            <svg class="contato-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span class="contato-detail-text">contato@ikigaibrand.com.br</span>
          </div>
          <div class="contato-detail fade-up" data-delay="4">
            <svg class="contato-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14h0v2.92z"/></svg>
            <span class="contato-detail-text">+55 (11) 98765-4321</span>
          </div>

          <div class="contato-social fade-up" data-delay="5">
            <a href="#" class="social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Strava">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 12 10 4 14 12"/><polyline points="10 12 14 20 18 12"/></svg>
            </a>
          </div>
        </div>

        <div class="contato-form-wrap fade-up" data-delay="2">
          <form id="contactForm">
            <div class="form-group">
              <input type="text" id="nome" class="form-input" placeholder="Nome" required>
              <label for="nome" class="form-label">Nome completo</label>
              <span class="form-line"></span>
            </div>
            <div class="form-group">
              <input type="email" id="email" class="form-input" placeholder="Email" required>
              <label for="email" class="form-label">E-mail</label>
              <span class="form-line"></span>
            </div>
            <div class="form-group">
              <textarea id="mensagem" class="form-textarea" placeholder="Mensagem" rows="4" required></textarea>
              <label for="mensagem" class="form-label">Mensagem</label>
              <span class="form-line"></span>
            </div>
            <button type="submit" class="btn btn-amber" style="width:100%; justify-content:center; margin-top: 1rem; font-size: 1.1rem; padding: 1rem;">
              ENVIAR MENSAGEM
            </button>
          </form>

          <div id="formSuccess">
            <div class="success-icon">✦</div>
            <h3>MENSAGEM ENVIADA</h3>
            <p>Entraremos em contato em até 24 horas.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#E8970A"/>
              <circle cx="20" cy="20" r="12" stroke="#000" stroke-width="2" fill="none"/>
              <circle cx="20" cy="20" r="5" fill="#000"/>
              <line x1="20" y1="4" x2="20" y2="36" stroke="#000" stroke-width="1.8"/>
              <line x1="4" y1="20" x2="36" y2="20" stroke="#000" stroke-width="1.8"/>
            </svg>
            <span class="logo-text" style="font-size: 1.3rem;">IKIGAI</span>
          </div>
          <p class="footer-tagline">Movimento é propósito. Cada produto criado para quem não para.</p>
        </div>
        <div>
          <h4 class="footer-col-title">Produtos</h4>
          <ul class="footer-links">
            <li><a href="#produtos">Linha Aqua</a></li>
            <li><a href="#produtos">Linha Trail</a></li>
            <li><a href="#produtos">Linha Urban</a></li>
            <li><a href="#produtos">Acessórios</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Empresa</h4>
          <ul class="footer-links">
            <li><a href="#sobre">Sobre nós</a></li>
            <li><a href="#diferenciais">Por que Ikigai</a></li>
            <li><a href="#galeria">Galeria</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Suporte</h4>
          <ul class="footer-links">
            <li><a href="#contato">Contato</a></li>
            <li><a href="#contato">Trocas e devoluções</a></li>
            <li><a href="#contato">Rastrear pedido</a></li>
            <li><a href="#contato">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">© 2025 Ikigai Brand. Todos os direitos reservados.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificar IDs críticos**

Confirmar que os seguintes IDs existem no HTML:
- `#navbar`, `#hamburger`, `#navLinks`, `#navOverlay`
- `#hero`, `#sobre`, `#produtos`, `#diferenciais`, `#galeria`, `#depoimentos`, `#contato`
- `#contactForm`, `#formSuccess`, `#nome`, `#email`, `#mensagem`

---

## Task 6: js/main.js

**Files:**
- Create: `ikigai-landing-w-skills/js/main.js`

- [ ] **Step 1: Criar `ikigai-landing-w-skills/js/main.js`**

```javascript
/* ============================================================
   MAIN — Animações, navbar, menu mobile, active nav, form
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initRevealAnimations();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initForm();
});

/* ---- Animações de entrada (reveal-up + fade-up) ---- */
function initRevealAnimations() {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal-up, .fade-up').forEach(function (el) {
    observer.observe(el);
  });
}

/* ---- Navbar: borda âmbar no scroll ---- */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Menu mobile ---- */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  var overlay   = document.getElementById('navOverlay');
  if (!hamburger || !navLinks || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('mobile-open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
}

/* ---- Active nav link no scroll ---- */
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

/* ---- Formulário de contato ---- */
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
```

- [ ] **Step 2: Verificar funções**

Confirmar que `initRevealAnimations`, `initNavbar`, `initMobileMenu`, `initActiveNav` e `initForm` estão no arquivo.

---

## Task 7: Verificação final

**Files:** nenhum novo — apenas verificação

- [ ] **Step 1: Abrir no browser**

Abrir `ikigai-landing-w-skills/index.html` diretamente (via `file://`). Confirmar que a página carrega sem erros no console.

- [ ] **Step 2: Checar seções**

Scroll pela página inteira e verificar:
- [ ] Navbar fixa no topo
- [ ] Hero com headline gigante em Bebas Neue e glow âmbar
- [ ] Seção Sobre com grid 2 colunas e elemento "2019" no fundo
- [ ] 3 product cards com badges coloridos
- [ ] 6 cards de diferenciais
- [ ] 6 itens de galeria (2 wide)
- [ ] 3 depoimentos com aspas tipográficas
- [ ] Formulário de contato com float labels
- [ ] Footer com 4 colunas

- [ ] **Step 3: Checar animações**

- Scroll para baixo: títulos surgem com clip-path reveal ✓
- Cards surgem com fade-up staggered ✓
- Navbar ganha borda âmbar após 20px de scroll ✓

- [ ] **Step 4: Checar interações**

- Hover nos produto cards: `translateY(-8px)` + borda âmbar + glow ✓
- Hover galeria: overlay aparece ✓
- Formulário: preencher e submeter → form some, mensagem de sucesso aparece ✓

- [ ] **Step 5: Checar mobile (768px)**

Reduzir o browser para 768px de largura e verificar:
- Hamburger aparece
- Clicar no hamburger: drawer abre pela direita
- Clicar no overlay: drawer fecha
- Layout em coluna única
