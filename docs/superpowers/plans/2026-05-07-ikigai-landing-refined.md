# Ikigai Landing Refined — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `ikigai-landing-refined/` — a polished institutional landing page for Ikigai Brand with elevated color palette, CSS design token system, and first-class dark mode.

**Architecture:** Pure HTML/CSS/JS static site split into focused CSS files (`tokens.css`, `base.css`, `components.css`, `sections.css`) and two JS files (`theme.js` for dark mode, `main.js` for interactions). Dark mode uses `[data-theme="dark"]` on `<html>` with a FOUC-prevention inline script, preference persisted in `localStorage`.

**Tech Stack:** HTML5, CSS3 custom properties, Vanilla JavaScript (ES6+), Google Fonts (Poppins 300–700)

---

## File Map

| File | Responsibility |
|---|---|
| `ikigai-landing-refined/index.html` | Full page structure — all sections, inline FOUC script |
| `ikigai-landing-refined/css/tokens.css` | CSS custom properties: colors (light + dark), spacing, typography, shadows |
| `ikigai-landing-refined/css/base.css` | Reset, body, typography globals, `.container`, `.fade-up`, `.section-tag`, `.section-title` |
| `ikigai-landing-refined/css/components.css` | Navbar, logo, dark mode toggle, buttons, product cards, diferencial cards, testimonial cards, gallery items, contact form (float labels), social links |
| `ikigai-landing-refined/css/sections.css` | Hero, Sobre, Produtos, Diferenciais, Galeria, Depoimentos, Contato, Footer — section-level layout |
| `ikigai-landing-refined/js/theme.js` | Dark mode toggle, `localStorage` persistence, exported inline FOUC script text |
| `ikigai-landing-refined/js/main.js` | IntersectionObserver fade-up, navbar scroll class, mobile drawer, active nav link, form feedback |

---

## Task 1: Project Scaffold

**Files:**
- Create: `ikigai-landing-refined/` (folder)
- Create: `ikigai-landing-refined/css/` (folder)
- Create: `ikigai-landing-refined/js/` (folder)

- [ ] **Step 1: Create the directory structure**

```
ikigai-landing-refined/
├── css/
└── js/
```

Run in PowerShell from project root:
```powershell
New-Item -ItemType Directory -Path "ikigai-landing-refined\css"
New-Item -ItemType Directory -Path "ikigai-landing-refined\js"
```

Expected: no errors, folders created.

---

## Task 2: Design Tokens — `tokens.css`

**Files:**
- Create: `ikigai-landing-refined/css/tokens.css`

- [ ] **Step 1: Create `tokens.css` with full light + dark token set**

```css
/* ============================================================
   DESIGN TOKENS — Ikigai Brand Refined
   All CSS custom properties. Light mode is default.
   Dark mode overrides applied via [data-theme="dark"] on <html>.
   ============================================================ */

:root {
  /* --- Colors: Primary --- */
  --color-primary:       #2D55C9;
  --color-primary-dark:  #1E3D9A;
  --color-primary-light: #5B7FE0;

  /* --- Colors: Accent --- */
  --color-accent:        #E8970A;
  --color-accent-light:  #F5B83D;

  /* --- Colors: Secondary --- */
  --color-coral:         #E85D2F;
  --color-green:         #3D9B0E;

  /* --- Colors: Surfaces --- */
  --color-surface:       #FFFFFF;
  --color-surface-alt:   #F7F8FC;
  --color-surface-card:  #FFFFFF;

  /* --- Colors: Text --- */
  --color-text-primary:   #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted:     #9CA3AF;

  /* --- Colors: Border --- */
  --color-border: #E5E7EB;

  /* --- Shadows --- */
  --shadow-sm:         0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md:         0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg:         0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  --shadow-xl:         0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
  --shadow-card-hover: 0 20px 40px rgba(45, 85, 201, 0.15);

  /* --- Typography --- */
  --font-family: 'Poppins', sans-serif;

  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;
  --font-size-3xl:  1.875rem;
  --font-size-4xl:  2.25rem;
  --font-size-5xl:  3rem;
  --font-size-6xl:  3.75rem;

  /* --- Spacing (multiples of 0.25rem) --- */
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

  /* --- Border Radius --- */
  --radius-sm:   0.375rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-2xl:  1.5rem;
  --radius-full: 9999px;

  /* --- Transitions --- */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* --- Z-index --- */
  --z-navbar:  100;
  --z-overlay: 200;
  --z-drawer:  300;
}

/* ============================================================
   DARK MODE OVERRIDES
   ============================================================ */
[data-theme="dark"] {
  --color-primary:       #5B7FE0;
  --color-primary-dark:  #4468C8;
  --color-primary-light: #8FAAF0;

  --color-accent:        #F5B83D;
  --color-accent-light:  #F9D070;

  --color-coral:         #F07A52;
  --color-green:         #5BBF2A;

  --color-surface:       #0D1117;
  --color-surface-alt:   #161B27;
  --color-surface-card:  #1C2333;

  --color-text-primary:   #F9FAFB;
  --color-text-secondary: #D1D5DB;
  --color-text-muted:     #6B7280;

  --color-border: #1F2937;

  --shadow-card-hover: 0 20px 40px rgba(91, 127, 224, 0.2);
}
```

---

## Task 3: Base Styles — `base.css`

**Files:**
- Create: `ikigai-landing-refined/css/base.css`

- [ ] **Step 1: Create `base.css`**

```css
/* ============================================================
   BASE STYLES — Reset, body, typography, layout utilities
   ============================================================ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  transition: background-color 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

img {
  max-width: 100%;
  display: block;
  object-fit: cover;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

button {
  font-family: var(--font-family);
  border: none;
  cursor: pointer;
  background: none;
}

/* ============================================================
   LAYOUT
   ============================================================ */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */

.fade-up {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}

.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delay helpers */
.fade-up:nth-child(2) { transition-delay: 0.08s; }
.fade-up:nth-child(3) { transition-delay: 0.16s; }
.fade-up:nth-child(4) { transition-delay: 0.24s; }
.fade-up:nth-child(5) { transition-delay: 0.32s; }
.fade-up:nth-child(6) { transition-delay: 0.40s; }

/* ============================================================
   SECTION GLOBALS
   ============================================================ */

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-tag {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
  background: rgba(45, 85, 201, 0.08);
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

[data-theme="dark"] .section-tag {
  background: rgba(91, 127, 224, 0.15);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

.accent { color: var(--color-primary); }

/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 768px) {
  .section-title { font-size: var(--font-size-3xl); }
  .section-subtitle { font-size: var(--font-size-base); }
}

@media (max-width: 480px) {
  .section-title { font-size: var(--font-size-2xl); }
  .container { padding: 0 var(--space-4); }
}
```

---

## Task 4: Components — `components.css`

**Files:**
- Create: `ikigai-landing-refined/css/components.css`

- [ ] **Step 1: Create `components.css`**

```css
/* ============================================================
   COMPONENTS — Navbar, Logo, Dark Toggle, Buttons,
                Cards, Gallery, Form, Social, Footer
   ============================================================ */

/* ---- LOGO ---- */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-text-primary);
  transition: color var(--transition-base);
}

.hero .logo-text { color: white; }

/* ---- NAVBAR ---- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-navbar);
  padding: var(--space-4) 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all var(--transition-base);
}

[data-theme="dark"] .navbar {
  background: rgba(13, 17, 23, 0.8);
}

.navbar.scrolled {
  padding: var(--space-3) 0;
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-md);
}

.nav-container {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin: 0 auto;
}

.nav-links a {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  position: relative;
  transition: color var(--transition-base);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform var(--transition-base);
  border-radius: var(--radius-full);
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--color-primary);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  transform: scaleX(1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-left: auto;
}

/* ---- DARK MODE TOGGLE ---- */
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.theme-toggle:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(45, 85, 201, 0.05);
}

.theme-toggle .icon-sun,
.theme-toggle .icon-moon {
  transition: opacity var(--transition-fast), transform var(--transition-base);
}

.theme-toggle .icon-moon { display: none; }

[data-theme="dark"] .theme-toggle .icon-sun  { display: none; }
[data-theme="dark"] .theme-toggle .icon-moon { display: block; }

/* ---- HAMBURGER ---- */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-2);
  border-radius: var(--radius-md);
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* ---- MOBILE DRAWER ---- */
.nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-overlay);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.nav-overlay.open {
  display: block;
  opacity: 1;
}

/* ---- BUTTONS ---- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
  text-align: center;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-accent {
  background: var(--color-accent);
  color: white;
}
.btn-accent:hover {
  filter: brightness(0.92);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232, 151, 10, 0.35);
}

.btn-outline {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}
.btn-outline:hover {
  background: var(--color-primary);
  color: white;
}

.btn-outline-white {
  border-color: rgba(255, 255, 255, 0.55);
  color: white;
  background: transparent;
}
.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
}

/* ---- PRODUCT CARDS ---- */
.produto-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
}

.produto-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(45, 85, 201, 0.2);
}

.produto-img-wrap {
  position: relative;
  overflow: hidden;
  height: 220px;
}

.produto-img-wrap img {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.produto-card:hover .produto-img-wrap img {
  transform: scale(1.05);
}

.produto-badge {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.produto-badge-bestseller { background: var(--color-accent); color: white; }
.produto-badge-new        { background: var(--color-primary); color: white; }

.produto-body {
  padding: var(--space-6);
}

.produto-category {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}

.categoria-aqua  { color: var(--color-primary); }
.categoria-trail { color: var(--color-green); }
.categoria-urban { color: var(--color-coral); }

.produto-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--color-text-primary);
}

.produto-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin-bottom: var(--space-5);
}

.produto-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.produto-price {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.produto-price strong {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.produto-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity var(--transition-base), transform var(--transition-base), color var(--transition-fast);
}

.produto-card:hover .produto-link {
  opacity: 1;
  transform: translateX(0);
}

.produto-link:hover { color: var(--color-primary-dark); }

/* ---- DIFERENCIAL CARDS ---- */
.diferencial-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.diferencial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.diferencial-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: rgba(45, 85, 201, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
  color: var(--color-primary);
  transition: background var(--transition-base);
}

[data-theme="dark"] .diferencial-icon {
  background: rgba(91, 127, 224, 0.15);
}

.diferencial-card:hover .diferencial-icon {
  background: var(--color-primary);
  color: white;
}

.diferencial-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.diferencial-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
}

/* ---- GALLERY ITEMS ---- */
.galeria-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  break-inside: avoid;
  margin-bottom: var(--space-5);
}

.galeria-item img {
  width: 100%;
  transition: transform 0.5s ease;
}

.galeria-item:hover img {
  transform: scale(1.06);
}

.galeria-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13, 17, 23, 0.75) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: var(--space-6);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.galeria-item:hover .galeria-overlay {
  opacity: 1;
}

.galeria-overlay-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.galeria-overlay-content span {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
}

.galeria-zoom {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* ---- TESTIMONIAL CARDS ---- */
.depoimento-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  position: relative;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.depoimento-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.depoimento-quote {
  position: absolute;
  top: var(--space-6);
  right: var(--space-8);
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-accent);
  opacity: 0.25;
  font-family: Georgia, serif;
  user-select: none;
}

.depoimento-stars {
  display: flex;
  gap: var(--space-1);
  color: var(--color-accent);
  margin-bottom: var(--space-5);
}

.depoimento-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin-bottom: var(--space-6);
  font-style: italic;
}

.depoimento-author {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.depoimento-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
}

.depoimento-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.depoimento-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* ---- CONTACT FORM (FLOAT LABELS) ---- */
.form-group {
  position: relative;
  margin-bottom: var(--space-6);
}

.form-group label {
  position: absolute;
  top: 50%;
  left: var(--space-4);
  transform: translateY(-50%);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  background: var(--color-surface);
  padding: 0 var(--space-1);
  transition: all var(--transition-base);
  pointer-events: none;
  border-radius: var(--radius-sm);
}

.form-group.textarea label {
  top: var(--space-5);
  transform: none;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--space-4) var(--space-4);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base), background var(--transition-base);
}

.form-group textarea {
  resize: vertical;
  min-height: 130px;
  padding-top: var(--space-5);
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(45, 85, 201, 0.1);
}

/* Float label up when focused or has content */
.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label,
.form-group textarea:focus + label,
.form-group textarea:not(:placeholder-shown) + label {
  top: -1px;
  transform: translateY(-50%);
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: 600;
}

.form-group.textarea input:focus + label,
.form-group.textarea textarea:focus + label,
.form-group.textarea textarea:not(:placeholder-shown) + label {
  top: -1px;
}

/* Trick: inputs must have a real placeholder to use :not(:placeholder-shown) */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: transparent;
}

.form-success {
  display: none;
  text-align: center;
  padding: var(--space-10) var(--space-8);
}

.form-success.show { display: block; }

.form-success-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  background: rgba(61, 155, 14, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-5);
  color: var(--color-green);
}

.form-success h3 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.form-success p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

/* ---- SOCIAL LINKS ---- */
.social-link {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-base);
}

.social-link:hover { transform: translateY(-3px); }
.social-link.instagram:hover { background: #E1306C; border-color: #E1306C; color: white; }
.social-link.facebook:hover  { background: #1877F2; border-color: #1877F2; color: white; }
.social-link.youtube:hover   { background: #FF0000; border-color: #FF0000; color: white; }
.social-link.linkedin:hover  { background: #0A66C2; border-color: #0A66C2; color: white; }

/* ---- VALORES LIST (Sobre section) ---- */
.valores-list {
  margin: var(--space-6) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.valor-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.valor-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  flex-shrink: 0;
}

/* ---- MOBILE RESPONSIVE ---- */
@media (max-width: 1024px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }

  .nav-links.mobile-open {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background: var(--color-surface);
    padding: var(--space-20) var(--space-8);
    gap: var(--space-6);
    z-index: var(--z-drawer);
    box-shadow: var(--shadow-xl);
    transform: translateX(0);
    transition: transform var(--transition-slow);
  }

  .nav-links a { font-size: var(--font-size-base); }

  .nav-cta { display: none; }
}

@media (max-width: 768px) {
  .produto-card:hover .produto-link { opacity: 1; transform: none; }
}
```

---

## Task 5: Dark Mode — `theme.js`

**Files:**
- Create: `ikigai-landing-refined/js/theme.js`

- [ ] **Step 1: Create `theme.js`**

```javascript
/* ============================================================
   THEME — Dark mode toggle with localStorage persistence.

   FOUC prevention: The inline script below must be pasted
   verbatim into <head> BEFORE any <link rel="stylesheet">.
   It reads localStorage and sets data-theme before first paint.
   ============================================================ */

/* -- INLINE SCRIPT (paste into <head> of index.html) --
(function () {
  const saved = localStorage.getItem('ikigai-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
*/

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ikigai-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ikigai-theme', 'dark');
    }
  });
}

export { initTheme };
```

---

## Task 6: Main Interactions — `main.js`

**Files:**
- Create: `ikigai-landing-refined/js/main.js`

- [ ] **Step 1: Create `main.js`**

```javascript
import { initTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initForm();
});

/* ---- Fade-up on scroll ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
}

/* ---- Navbar scroll class ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile drawer ---- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');
  if (!hamburger || !navLinks || !overlay) return;

  const open = () => {
    hamburger.classList.add('open');
    navLinks.classList.add('mobile-open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);

  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

/* ---- Active nav link on scroll ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---- Contact form feedback ---- */
function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');
  });
}
```

---

## Task 7: HTML — `index.html`

**Files:**
- Create: `ikigai-landing-refined/index.html`

- [ ] **Step 1: Create `index.html` with full page structure**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ikigai Brand — Encontre seu propósito em movimento</title>
  <meta name="description" content="Ikigai Brand — Moda e equipamentos para quem vive a vida em movimento. Esportes aquáticos, aventura outdoor e estilo com propósito.">

  <!-- FOUC Prevention: set theme before first paint -->
  <script>
    (function () {
      var saved = localStorage.getItem('ikigai-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/sections.css">
</head>
<body>

  <!-- ==================== OVERLAY ==================== -->
  <div class="nav-overlay" id="navOverlay"></div>

  <!-- ==================== NAVBAR ==================== -->
  <nav class="navbar" id="navbar">
    <div class="container nav-container">
      <a href="#" class="logo">
        <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="var(--color-primary)"/>
          <circle cx="20" cy="20" r="12" stroke="white" stroke-width="1.8" fill="none"/>
          <circle cx="20" cy="20" r="5" fill="white"/>
          <line x1="20" y1="4" x2="20" y2="36" stroke="white" stroke-width="1.6"/>
          <line x1="4" y1="20" x2="36" y2="20" stroke="white" stroke-width="1.6"/>
          <line x1="9.5" y1="9.5" x2="30.5" y2="30.5" stroke="white" stroke-width="1.2" opacity="0.6"/>
          <line x1="30.5" y1="9.5" x2="9.5" y2="30.5" stroke="white" stroke-width="1.2" opacity="0.6"/>
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
        <button class="theme-toggle" id="themeToggle" aria-label="Alternar tema">
          <!-- Sun icon -->
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon icon -->
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <a href="#contato" class="btn btn-primary nav-cta">Conheça a Marca</a>

        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- ==================== HERO ==================== -->
  <section class="hero" id="hero">
    <div class="hero-bg"></div>
    <div class="hero-shapes">
      <svg class="hero-wave-1" viewBox="0 0 600 200" fill="none">
        <path d="M0,100 C100,20 200,180 300,100 C400,20 500,180 600,100" stroke="rgba(255,255,255,0.25)" stroke-width="3" fill="none"/>
        <path d="M0,130 C100,50 200,210 300,130 C400,50 500,210 600,130" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none"/>
        <path d="M0,70 C100,-10 200,150 300,70 C400,-10 500,150 600,70" stroke="rgba(232,151,10,0.4)" stroke-width="2" fill="none"/>
      </svg>
      <svg class="hero-wave-2" viewBox="0 0 600 200" fill="none">
        <path d="M0,100 C100,20 200,180 300,100 C400,20 500,180 600,100" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" fill="none"/>
        <path d="M0,130 C100,50 200,210 300,130 C400,50 500,210 600,130" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" fill="none"/>
      </svg>
    </div>

    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-badge fade-up">
          <span class="hero-badge-dot"></span>
          Nova Coleção 2026
        </div>
        <h1 class="hero-title fade-up">
          Encontre o seu<br><span class="hero-highlight">Ikigai</span>
        </h1>
        <p class="hero-subtitle fade-up">
          Movimento, propósito e estilo — uma marca para quem vive a vida em movimento e encontra sentido em cada aventura.
        </p>
        <div class="hero-actions fade-up">
          <a href="#produtos" class="btn btn-accent">Explorar Produtos</a>
          <a href="#sobre" class="btn btn-outline-white">Nossa História</a>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="hero-stats">
        <div class="stat-item fade-up">
          <div class="stat-number">12+</div>
          <div class="stat-label">Anos de história</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item fade-up">
          <div class="stat-number">50K</div>
          <div class="stat-label">Clientes ativos</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item fade-up">
          <div class="stat-number">120+</div>
          <div class="stat-label">Produtos na linha</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item fade-up">
          <div class="stat-number">30</div>
          <div class="stat-label">Países alcançados</div>
        </div>
      </div>
    </div>

    <div class="hero-wave-divider">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,80 L0,80 Z" fill="var(--color-surface)"/>
      </svg>
    </div>
  </section>

  <!-- ==================== SOBRE ==================== -->
  <section class="sobre" id="sobre">
    <div class="container">
      <div class="sobre-grid">
        <div class="sobre-content">
          <span class="section-tag fade-up">Nossa História</span>
          <h2 class="section-title fade-up">Uma marca com<br><span class="accent">propósito real</span></h2>

          <div class="sobre-accent-line fade-up">
            <p>Ikigai nasceu da busca por encontrar sentido no movimento. Assim como o conceito japonês que nos inspira — a interseção entre o que você ama, o que você faz bem, o que o mundo precisa e o que te sustenta — nossa marca existe para quem vive com intenção.</p>
          </div>

          <p class="sobre-text fade-up">Cada produto é desenvolvido para acompanhar aventuras reais: do surf ao trekking, da academia à cidade. Qualidade, funcionalidade e estilo que duram além de uma temporada.</p>

          <ul class="valores-list fade-up">
            <li class="valor-item"><span class="valor-dot"></span>Design funcional sem abrir mão do estilo</li>
            <li class="valor-item"><span class="valor-dot"></span>Materiais sustentáveis e responsáveis</li>
            <li class="valor-item"><span class="valor-dot"></span>Comunidade de aventureiros e exploradores</li>
            <li class="valor-item"><span class="valor-dot"></span>Produção ética e transparente</li>
          </ul>

          <a href="#produtos" class="btn btn-primary fade-up">Ver Coleção Completa</a>
        </div>

        <div class="sobre-image-wrap fade-up">
          <img
            src="https://picsum.photos/seed/ikigai-sobre/640/520"
            alt="Pessoa em aventura outdoor com equipamentos Ikigai"
            loading="lazy"
          >
          <div class="sobre-image-badge">
            <div class="badge-year">2012</div>
            <div class="badge-label">Fundada</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PRODUTOS ==================== -->
  <section class="produtos" id="produtos">
    <div class="container">
      <div class="section-header">
        <span class="section-tag fade-up">Coleção 2026</span>
        <h2 class="section-title fade-up">Produtos para cada <span class="accent">aventura</span></h2>
        <p class="section-subtitle fade-up">Desenvolvidos para performers exigentes que não abrem mão do visual. Do mar à montanha.</p>
      </div>

      <div class="produtos-grid">
        <!-- Linha Aqua -->
        <div class="produto-card fade-up">
          <div class="produto-img-wrap">
            <img src="https://picsum.photos/seed/ikigai-p1/480/300" alt="Linha Aqua" loading="lazy">
            <span class="produto-badge produto-badge-bestseller">Mais Vendido</span>
          </div>
          <div class="produto-body">
            <div class="produto-category categoria-aqua">Linha Aqua</div>
            <h3 class="produto-title">Esportes Aquáticos</h3>
            <p class="produto-desc">Roupas e acessórios de alta performance para surf, stand-up paddle e esportes aquáticos. Tecido secagem rápida e proteção UV+50.</p>
            <div class="produto-footer">
              <div class="produto-price">
                A partir de
                <strong>R$ 189</strong>
              </div>
              <a href="#contato" class="produto-link">
                Explorar linha
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Linha Trail -->
        <div class="produto-card fade-up">
          <div class="produto-img-wrap">
            <img src="https://picsum.photos/seed/ikigai-p2/480/300" alt="Linha Trail" loading="lazy">
            <span class="produto-badge produto-badge-new">Novo</span>
          </div>
          <div class="produto-body">
            <div class="produto-category categoria-trail">Linha Trail</div>
            <h3 class="produto-title">Trilha & Trekking</h3>
            <p class="produto-desc">Equipamentos e vestuário para trilha, trekking e caminhada. Leveza, durabilidade e conforto para as longas jornadas na natureza.</p>
            <div class="produto-footer">
              <div class="produto-price">
                A partir de
                <strong>R$ 249</strong>
              </div>
              <a href="#contato" class="produto-link">
                Explorar linha
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Linha Urban -->
        <div class="produto-card fade-up">
          <div class="produto-img-wrap">
            <img src="https://picsum.photos/seed/ikigai-p3/480/300" alt="Linha Urban" loading="lazy">
          </div>
          <div class="produto-body">
            <div class="produto-category categoria-urban">Linha Urban</div>
            <h3 class="produto-title">Estilo Cotidiano</h3>
            <p class="produto-desc">O espírito aventureiro no seu dia a dia. Roupas casuais com DNA outdoor para quem carrega o estilo Ikigai além das trilhas e praias.</p>
            <div class="produto-footer">
              <div class="produto-price">
                A partir de
                <strong>R$ 129</strong>
              </div>
              <a href="#contato" class="produto-link">
                Explorar linha
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== DIFERENCIAIS ==================== -->
  <section class="diferenciais" id="diferenciais">
    <div class="container">
      <div class="section-header">
        <span class="section-tag fade-up">Nossos Diferenciais</span>
        <h2 class="section-title fade-up">Por que escolher <span class="accent">Ikigai</span>?</h2>
        <p class="section-subtitle fade-up">Não somos apenas uma marca. Somos uma comunidade que encontra sentido em cada movimento.</p>
      </div>

      <div class="diferenciais-grid">
        <div class="diferencial-card fade-up">
          <div class="diferencial-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 class="diferencial-title">Qualidade Premium</h3>
          <p class="diferencial-text">Cada produto passa por rigoroso controle de qualidade. Materiais selecionados que resistem às condições mais extremas sem perder o estilo.</p>
        </div>

        <div class="diferencial-card fade-up">
          <div class="diferencial-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
          </div>
          <h3 class="diferencial-title">Sustentabilidade</h3>
          <p class="diferencial-text">Compromisso real com o planeta. Usamos materiais reciclados, embalagens biodegradáveis e processos de produção que minimizam o impacto ambiental.</p>
        </div>

        <div class="diferencial-card fade-up">
          <div class="diferencial-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 class="diferencial-title">Comunidade Viva</h3>
          <p class="diferencial-text">Mais de 50 mil aventureiros em todo o mundo. Eventos, trilhas, sessões de surf e encontros que conectam pessoas com o mesmo propósito.</p>
        </div>

        <div class="diferencial-card fade-up">
          <div class="diferencial-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <h3 class="diferencial-title">Alta Performance</h3>
          <p class="diferencial-text">Design desenvolvido junto a atletas profissionais. Cada detalhe otimizado para maximizar performance sem comprometer a liberdade de movimento.</p>
        </div>

        <div class="diferencial-card fade-up">
          <div class="diferencial-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h3 class="diferencial-title">Propósito Genuíno</h3>
          <p class="diferencial-text">Ikigai não é só uma palavra japonesa bonita. É nossa filosofia de marca: ajudar cada pessoa a encontrar e viver seu próprio propósito.</p>
        </div>

        <div class="diferencial-card fade-up">
          <div class="diferencial-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49"/></svg>
          </div>
          <h3 class="diferencial-title">Suporte 360°</h3>
          <p class="diferencial-text">Atendimento especializado, troca facilitada e garantia estendida. Nossa equipe é formada por aventureiros que entendem o que você precisa.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== GALERIA ==================== -->
  <section class="galeria" id="galeria">
    <div class="container">
      <div class="section-header">
        <span class="section-tag fade-up">Galeria</span>
        <h2 class="section-title fade-up">A vida em <span class="accent">movimento</span></h2>
        <p class="section-subtitle fade-up">Aventuras reais de quem usa Ikigai no dia a dia. Do mar à montanha, passando pela cidade.</p>
      </div>

      <div class="galeria-grid">
        <div class="galeria-item galeria-item--wide fade-up">
          <img src="https://picsum.photos/seed/ikigai-g1/800/400" alt="Surf — Linha Aqua" loading="lazy">
          <div class="galeria-overlay">
            <div class="galeria-overlay-content">
              <span>Surf — Linha Aqua</span>
              <div class="galeria-zoom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="galeria-item fade-up">
          <img src="https://picsum.photos/seed/ikigai-g2/400/400" alt="Trekking — Linha Trail" loading="lazy">
          <div class="galeria-overlay">
            <div class="galeria-overlay-content">
              <span>Trekking — Trail</span>
              <div class="galeria-zoom"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
            </div>
          </div>
        </div>

        <div class="galeria-item fade-up">
          <img src="https://picsum.photos/seed/ikigai-g3/400/400" alt="Linha Urban" loading="lazy">
          <div class="galeria-overlay">
            <div class="galeria-overlay-content">
              <span>Linha Urban</span>
              <div class="galeria-zoom"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
            </div>
          </div>
        </div>

        <div class="galeria-item galeria-item--wide fade-up">
          <img src="https://picsum.photos/seed/ikigai-g4/800/400" alt="Comunidade Ikigai" loading="lazy">
          <div class="galeria-overlay">
            <div class="galeria-overlay-content">
              <span>Comunidade Ikigai — 2026</span>
              <div class="galeria-zoom"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
            </div>
          </div>
        </div>

        <div class="galeria-item fade-up">
          <img src="https://picsum.photos/seed/ikigai-g5/400/400" alt="Stand-up Paddle" loading="lazy">
          <div class="galeria-overlay">
            <div class="galeria-overlay-content">
              <span>Stand-up Paddle</span>
              <div class="galeria-zoom"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
            </div>
          </div>
        </div>

        <div class="galeria-item fade-up">
          <img src="https://picsum.photos/seed/ikigai-g6/400/400" alt="Expedição Trail" loading="lazy">
          <div class="galeria-overlay">
            <div class="galeria-overlay-content">
              <span>Expedição Trail</span>
              <div class="galeria-zoom"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== DEPOIMENTOS ==================== -->
  <section class="depoimentos" id="depoimentos">
    <div class="container">
      <div class="section-header">
        <span class="section-tag fade-up">Depoimentos</span>
        <h2 class="section-title fade-up">O que nossa <span class="accent">comunidade</span> diz</h2>
        <p class="section-subtitle fade-up">Histórias reais de aventureiros que encontraram o propósito com a Ikigai.</p>
      </div>

      <div class="depoimentos-grid">
        <div class="depoimento-card fade-up">
          <span class="depoimento-quote">"</span>
          <div class="depoimento-stars">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <p class="depoimento-text">"Uso a Linha Aqua há dois anos surfando todos os dias em Fernando de Noronha. A qualidade não tem igual — durável, confortável e com um visual que combina fora d'água também."</p>
          <div class="depoimento-author">
            <img class="depoimento-avatar" src="https://picsum.photos/seed/avatar1/48/48" alt="Rafael Mendonça" loading="lazy">
            <div>
              <div class="depoimento-name">Rafael Mendonça</div>
              <div class="depoimento-role">Surfista Profissional · Noronha, PE</div>
            </div>
          </div>
        </div>

        <div class="depoimento-card fade-up">
          <span class="depoimento-quote">"</span>
          <div class="depoimento-stars">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <p class="depoimento-text">"A Linha Trail me acompanhou em 14 dias de expedição na Patagônia. Temperatura de -5°C, chuva forte, vento. O equipamento aguentou tudo. Não volto mais para outra marca."</p>
          <div class="depoimento-author">
            <img class="depoimento-avatar" src="https://picsum.photos/seed/avatar2/48/48" alt="Camila Figueiredo" loading="lazy">
            <div>
              <div class="depoimento-name">Camila Figueiredo</div>
              <div class="depoimento-role">Alpinista · Porto Alegre, RS</div>
            </div>
          </div>
        </div>

        <div class="depoimento-card fade-up">
          <span class="depoimento-quote">"</span>
          <div class="depoimento-stars">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <p class="depoimento-text">"Encontrei a Ikigai pelo Instagram e me identifiquei imediatamente com a filosofia. Hoje uso a Linha Urban no dia a dia e lembro que viver com propósito é uma escolha diária."</p>
          <div class="depoimento-author">
            <img class="depoimento-avatar" src="https://picsum.photos/seed/avatar3/48/48" alt="Thiago Castelo" loading="lazy">
            <div>
              <div class="depoimento-name">Thiago Castelo</div>
              <div class="depoimento-role">Empreendedor · São Paulo, SP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== CONTATO ==================== -->
  <section class="contato" id="contato">
    <div class="container">
      <div class="contato-grid">
        <div class="contato-info">
          <span class="section-tag fade-up">Fale Conosco</span>
          <h2 class="section-title fade-up">Pronto para encontrar<br>seu <span class="accent">Ikigai</span>?</h2>
          <p class="section-subtitle fade-up" style="text-align:left;max-width:none;">Tire suas dúvidas, solicite informações sobre produtos ou venha fazer parte da nossa comunidade de aventureiros.</p>

          <div class="contato-social fade-up">
            <a href="#" class="social-link instagram" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" class="social-link facebook" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="social-link youtube" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
            <a href="#" class="social-link linkedin" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        <div class="contato-form-wrap fade-up">
          <form class="contato-form" id="contactForm" novalidate>
            <div class="form-group">
              <input type="text" id="nome" name="nome" placeholder=" " required autocomplete="name">
              <label for="nome">Nome completo</label>
            </div>
            <div class="form-group">
              <input type="email" id="email" name="email" placeholder=" " required autocomplete="email">
              <label for="email">E-mail</label>
            </div>
            <div class="form-group">
              <input type="text" id="assunto" name="assunto" placeholder=" " autocomplete="off">
              <label for="assunto">Assunto</label>
            </div>
            <div class="form-group textarea">
              <textarea id="mensagem" name="mensagem" placeholder=" " required></textarea>
              <label for="mensagem">Mensagem</label>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
              Enviar Mensagem
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>

          <div class="form-success" id="formSuccess">
            <div class="form-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>Mensagem enviada!</h3>
            <p>Nossa equipe entrará em contato em breve. Até lá, siga-nos nas redes sociais.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="logo">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="var(--color-primary)"/>
              <circle cx="20" cy="20" r="12" stroke="white" stroke-width="1.8" fill="none"/>
              <circle cx="20" cy="20" r="5" fill="white"/>
              <line x1="20" y1="4" x2="20" y2="36" stroke="white" stroke-width="1.6"/>
              <line x1="4" y1="20" x2="36" y2="20" stroke="white" stroke-width="1.6"/>
              <line x1="9.5" y1="9.5" x2="30.5" y2="30.5" stroke="white" stroke-width="1.2" opacity="0.6"/>
              <line x1="30.5" y1="9.5" x2="9.5" y2="30.5" stroke="white" stroke-width="1.2" opacity="0.6"/>
            </svg>
            <span class="logo-text" style="color:white;">IKIGAI</span>
          </a>
          <p class="footer-tagline">Encontre seu propósito em cada movimento. Desde 2012 inspirando aventureiros a viverem com intenção.</p>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Produtos</h4>
          <ul class="footer-links">
            <li><a href="#produtos">Linha Aqua</a></li>
            <li><a href="#produtos">Linha Trail</a></li>
            <li><a href="#produtos">Linha Urban</a></li>
            <li><a href="#produtos">Acessórios</a></li>
            <li><a href="#produtos">Novidades</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Empresa</h4>
          <ul class="footer-links">
            <li><a href="#sobre">Sobre nós</a></li>
            <li><a href="#diferenciais">Nossa missão</a></li>
            <li><a href="#galeria">Galeria</a></li>
            <li><a href="#contato">Trabalhe conosco</a></li>
            <li><a href="#contato">Imprensa</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Suporte</h4>
          <ul class="footer-links">
            <li><a href="#contato">Contato</a></li>
            <li><a href="#contato">Trocas e devoluções</a></li>
            <li><a href="#contato">Guia de tamanhos</a></li>
            <li><a href="#contato">FAQ</a></li>
            <li><a href="#contato">Política de privacidade</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">© 2026 Ikigai Brand. Todos os direitos reservados.</p>
        <div class="footer-bottom-links">
          <a href="#">Termos de uso</a>
          <a href="#">Privacidade</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## Task 8: Section Styles — `sections.css`

**Files:**
- Create: `ikigai-landing-refined/css/sections.css`

- [ ] **Step 1: Create `sections.css`**

```css
/* ============================================================
   SECTIONS — Layout specific to each page section
   ============================================================ */

/* ---- HERO ---- */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(80px + var(--space-16)) 0 0;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a2f7a 0%, #2D55C9 45%, #1a3a5c 100%);
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 75% 30%, rgba(232, 151, 10, 0.12) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(232, 93, 47, 0.08) 0%, transparent 50%);
}

.hero-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-wave-1 {
  position: absolute;
  top: 15%;
  left: -5%;
  width: 55%;
  opacity: 0.6;
}

.hero-wave-2 {
  position: absolute;
  bottom: 20%;
  right: -5%;
  width: 50%;
  opacity: 0.5;
}

.hero-container {
  position: relative;
  z-index: 2;
  padding-bottom: var(--space-16);
}

.hero-content {
  max-width: 650px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: white;
  margin-bottom: var(--space-6);
}

.hero-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: var(--radius-full);
  background: var(--color-accent-light);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(0.85); }
}

.hero-title {
  font-size: var(--font-size-6xl);
  font-weight: 700;
  line-height: 1.1;
  color: white;
  margin-bottom: var(--space-6);
}

.hero-highlight {
  color: var(--color-accent-light);
  display: inline-block;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.65;
  margin-bottom: var(--space-8);
  max-width: 520px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.hero-stats {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-2xl);
  padding: var(--space-6) var(--space-8);
  margin-top: var(--space-16);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.65);
  margin-top: var(--space-1);
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.hero-wave-divider {
  position: relative;
  z-index: 2;
  margin-top: var(--space-8);
  line-height: 0;
}

.hero-wave-divider svg {
  width: 100%;
  height: 80px;
}

/* ---- SOBRE ---- */
.sobre {
  padding: var(--space-24) 0;
  background: var(--color-surface);
}

.sobre-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.sobre-accent-line {
  border-left: 3px solid var(--color-accent);
  padding-left: var(--space-5);
  margin: var(--space-6) 0;
}

.sobre-accent-line p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.sobre-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin-bottom: var(--space-5);
}

.sobre-image-wrap {
  position: relative;
}

.sobre-image-wrap img {
  width: 100%;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  aspect-ratio: 4/3;
}

.sobre-image-badge {
  position: absolute;
  bottom: var(--space-6);
  left: calc(-1 * var(--space-8));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.badge-year {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.badge-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: var(--space-1);
}

/* ---- PRODUTOS ---- */
.produtos {
  padding: var(--space-24) 0;
  background: var(--color-surface-alt);
}

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

/* ---- DIFERENCIAIS ---- */
.diferenciais {
  padding: var(--space-24) 0;
  background: var(--color-surface);
}

.diferenciais-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

/* ---- GALERIA ---- */
.galeria {
  padding: var(--space-24) 0;
  background: var(--color-surface-alt);
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.galeria-item--wide {
  grid-column: span 2;
}

/* ---- DEPOIMENTOS ---- */
.depoimentos {
  padding: var(--space-24) 0;
  background: var(--color-surface);
}

.depoimentos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  align-items: start;
}

/* ---- CONTATO ---- */
.contato {
  padding: var(--space-24) 0;
  background: var(--color-surface-alt);
}

.contato-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-16);
  align-items: start;
}

.contato-social {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.contato-form-wrap {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
}

/* ---- FOOTER ---- */
.footer {
  background: #0D1117;
  padding: var(--space-16) 0 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: var(--space-8);
  padding-bottom: var(--space-12);
}

.footer-tagline {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.5);
  margin-top: var(--space-5);
  line-height: 1.65;
  max-width: 280px;
}

.footer-col-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-5);
}

.footer-links li {
  margin-bottom: var(--space-3);
}

.footer-links a {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.45);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: rgba(255, 255, 255, 0.9);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: var(--space-6) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.footer-copyright {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.3);
}

.footer-bottom-links {
  display: flex;
  gap: var(--space-5);
}

.footer-bottom-links a {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.3);
  transition: color var(--transition-fast);
}

.footer-bottom-links a:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 1024px) {
  .hero-title { font-size: var(--font-size-5xl); }

  .sobre-grid { grid-template-columns: 1fr; }
  .sobre-image-wrap { order: -1; }
  .sobre-image-badge { left: var(--space-6); }

  .produtos-grid      { grid-template-columns: repeat(2, 1fr); }
  .diferenciais-grid  { grid-template-columns: repeat(2, 1fr); }
  .depoimentos-grid   { grid-template-columns: repeat(2, 1fr); }
  .footer-grid        { grid-template-columns: 1fr 1fr; gap: var(--space-10); }
}

@media (max-width: 768px) {
  .hero { padding-top: calc(70px + var(--space-12)); }
  .hero-title { font-size: var(--font-size-4xl); }
  .hero-subtitle { font-size: var(--font-size-base); }

  .hero-stats {
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .stat-divider { display: none; }
  .stat-item { min-width: 40%; }

  .galeria-grid { grid-template-columns: 1fr 1fr; }
  .galeria-item--wide { grid-column: span 2; }

  .contato-grid    { grid-template-columns: 1fr; }
  .produtos-grid   { grid-template-columns: 1fr; }
  .depoimentos-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-title { font-size: var(--font-size-3xl); }
  .hero-actions { flex-direction: column; }
  .hero-actions .btn { width: 100%; justify-content: center; }

  .diferenciais-grid { grid-template-columns: 1fr; }
  .galeria-grid { grid-template-columns: 1fr; }
  .galeria-item--wide { grid-column: span 1; }
}
```

---

## Task 9: Verification

**Files:** None created — browser testing only.

- [ ] **Step 1: Open in browser**

Open `ikigai-landing-refined/index.html` in Chrome or Firefox (double-click or use Live Server extension).

Expected: Page renders with the indigo-blue gradient hero, stats bar, and all sections visible.

- [ ] **Step 2: Verify dark mode toggle**

Click the sun/moon icon in the navbar.

Expected:
- Page smoothly transitions to dark background (`#0D1117`)
- Toggle icon switches from sun to moon
- No flash on toggle

- [ ] **Step 3: Verify FOUC prevention**

While in dark mode, reload the page.

Expected: Page loads already in dark mode — no white flash before CSS applies.

- [ ] **Step 4: Verify scroll animations**

Scroll from top to bottom.

Expected: Each `.fade-up` element animates in from below as it enters the viewport.

- [ ] **Step 5: Verify product card hover**

Hover over each product card.

Expected:
- Card lifts (`translateY(-6px)`) with elevated shadow
- "Explorar linha →" link fades in
- Image zooms slightly

- [ ] **Step 6: Verify mobile menu (resize to < 1024px)**

Either use DevTools responsive mode or resize browser.

Expected:
- Hamburger icon appears, nav links hide
- Click hamburger → drawer slides in from right
- Dark overlay covers the rest of the page
- Clicking overlay or a nav link closes the drawer

- [ ] **Step 7: Verify float labels in contact form**

Click each form field.

Expected:
- Label floats up and shrinks when field is focused
- Label stays up after typing (`:not(:placeholder-shown)`)
- Focused field shows blue border + glow

- [ ] **Step 8: Verify form submission**

Fill in all required fields and submit.

Expected:
- Form hides
- Success state appears with green checkmark icon
- Text: "Mensagem enviada!"

- [ ] **Step 9: Visual comparison**

Open `ikigai-landing/index.html` in a second tab and compare.

Expected: Refined version has visibly more polished colors (no harsh electric blue/yellow), cleaner card design, dark mode capability, and better float-label form.

- [ ] **Step 10: Verify footer is always dark**

Toggle to light mode. Scroll to footer.

Expected: Footer background stays `#0D1117` (dark) regardless of theme — it overrides the theme tokens intentionally.

---

## Self-Review Notes

**Spec coverage:**
- ✅ Navbar with backdrop blur + dark mode toggle
- ✅ Hero with glassmorphism stats + wave shapes
- ✅ Sobre with accent-line + refined badge
- ✅ Produtos with category colors + hover CTA reveal
- ✅ Diferenciais grid with animated icon backgrounds
- ✅ Galeria with masonry-like grid + zoom overlay
- ✅ Depoimentos with typographic quote element
- ✅ Contato with float labels + animated focus
- ✅ Footer always dark
- ✅ Dark mode first-class (tokens, FOUC script, toggle)
- ✅ Responsive (1024px, 768px, 480px breakpoints)

**Type consistency check:**
- `initTheme()` exported from `theme.js`, imported and called in `main.js` ✅
- `#themeToggle`, `#hamburger`, `#navLinks`, `#navOverlay`, `#contactForm`, `#formSuccess` — all IDs match between `index.html` and `main.js` ✅
- CSS classes referenced in JS: `.scrolled`, `.mobile-open`, `.open`, `.visible` — all defined in CSS ✅
