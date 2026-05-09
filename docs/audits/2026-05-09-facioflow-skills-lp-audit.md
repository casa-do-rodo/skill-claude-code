# Audit: facioflow-skills-landing

**Data:** 2026-05-09
**Escopo:** index.html, css/tokens.css, css/base.css, css/components.css, css/sections.css, js/main.js
**Audits rodados:** redesign-existing-projects, web-design-guidelines, svg-animations

---

## 🔴 Alta prioridade

- [redesign + web-guidelines] `sections.css:3` — `min-height: 100vh` → `min-height: 100dvh` — iOS Safari viewport height bug (UI chrome dinâmico)
- [web-guidelines] `index.html:4-7` — Missing: `<link rel="icon">`, `og:title`, `og:description`, `og:image`, `twitter:card` — essencial pra compartilhamento e branding
- [redesign] `index.html:46` — `hero-badge` tem `::before` CSS bullet E literal `•` no texto — ponto duplicado visualmente
- [redesign] `index.html:280` — `.tree-node-meta` ("governa tudo") usada no HTML mas não definida no CSS — texto renderiza sem estilo, inline solto
- [web-guidelines] `base.css + index.html` — Missing `color-scheme: dark` no `<html>` — afeta scrollbars e form controls nativos

## 🟡 Média prioridade

- [redesign] `index.html:body` — Sem `<main>` wrapping main content — `<header>` + `<section>`s soltos no `<body>` sem landmark de navegação para screen readers
- [redesign] `index.html:338` — Emoji `⬡` literal no tree-node do `frontend-audit-gate` — trocar por SVG stroke ou adicionar `aria-hidden="true"` explícito
- [redesign] `base.css:46-52` — `@keyframes ff-glitch` dead code — não é mais usado após mover glitch para dentro do SVG (agora usa `ff2-glitch` inline)
- [web-guidelines] `components.css` — `logo-breathe` animation sem `@media (prefers-reduced-motion: no-preference)` guard explícito
- [redesign] `css/base.css + sections.css` — `text-wrap: balance` ausente em `.section-title`, `.cta-title`, `.hero-headline` — previne widows/orphans
- [redesign] `index.html:49-51` — `<span class="reveal">` dentro do `<h1>` sem `display: block` explícito — quebra de linha pode falhar em alguns browsers

## 🔵 Baixa prioridade (polish)

- [svg-animations] `index.html:SVG` — Pulse waves sem `calcMode="spline"` — linear interpolation; easing orgânico daria feeling mais natural
- [svg-animations] `index.html:SVG` — `feGaussianBlur stdDeviation="5"` nos 4 dots orbitais — caro em low-end devices; considerar reduzir ou desativar em mobile
- [web-guidelines] `components.css` — `touch-action: manipulation` ausente em `.btn` e `.navbar-mobile-toggle` — remove 300ms tap delay iOS
- [redesign] `index.html + sections.css` — `font-variant-numeric: tabular-nums` ausente no `38+` (hero-stat) e contagens do arsenal

---

## Resumo

**Total: 15 findings** — 5 alta, 6 média, 4 baixa

### Independentes (paralelizáveis)
Todos os findings acima são independentes entre si, exceto:
- Finding 3 (hero-badge bullet) e finding 6 (main wrapper) tocam o mesmo arquivo mas em linhas diferentes — podem ser paralelos
- Finding 5 (color-scheme) é 1 linha no HTML + 1 no CSS — micro fix

### Dependências
Nenhuma dependência crítica entre findings.
