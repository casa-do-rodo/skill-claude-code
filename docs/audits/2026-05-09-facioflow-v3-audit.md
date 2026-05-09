# Audit: facioflow-v3

**Data:** 2026-05-09
**Método:** híbrido (código + 7 screenshots)
**Modelo:** Claude Opus 4.7
**Escopo:** index.html, css/tokens.css, css/base.css, css/components.css, css/sections.css
**Audits rodados:** redesign-existing-projects, web-design-guidelines, svg-animations

---

## 🔴 Alta prioridade (5 findings)

- **[Stacks/SVG] `index.html:294-296` + `components.css:330-336`** — Concentric Pulse (#15) não anima: apenas 1 anel estático cyan visível no screenshot. `transform-box: fill-box` em `<circle>` coloca transform-origin fora da bbox do elemento — anéis r2/r3 somem. **Fix:** trocar `transform-box: fill-box` → `transform-box: view-box` no `.loader-concentric-pulse .r` e `.loader-divider .r`, ou animar `r` diretamente: `@keyframes pulseR15 { 0% { r: 16; opacity: 1 } 100% { r: 80; opacity: 0 } }`.

- **[Stacks/SVG] `components.css:350`** — Wavy Ring (#06) aparece estático no screenshot. `transform` em `<path>` exige `transform-box: view-box; transform-origin: 100px 100px;` explícito. **Fix:** adicionar ambas as propriedades no `.loader-wavy-ring .wave`.

- **[A11y] `sections.css:103`** — `.hero-stat` usa `color: var(--text-faint)` (#2D3748) sobre `#070A13`. Contraste ≈ 2.0:1 — abaixo de WCAG AA (4.5:1). No screenshot o texto "skills · stacks · audit híbrido" é quase ilegível. **Fix:** trocar para `color: var(--text-muted)` (#8B949E, contraste ≈ 6.4:1).

- **[A11y] `index.html:43`** — Skip-link aponta para `#main-content` mas `<main>` não tem `tabindex="-1"` — foco programático não confiável em todos os browsers. **Fix:** `<main id="main-content" tabindex="-1">`.

- **[A11y] `index.html:418-452`** — Compare panels diferenciam before/after apenas por cor (dot vermelho/verde). Inacessível para color-blind. **Fix:** adicionar `aria-label` descritivo nos headers: `aria-label="Estado: sem estrutura"` e `aria-label="Estado: com FacioFlow"`.

---

## 🟡 Média prioridade (10 findings)

- **[Pipeline arrows] `components.css:466`** — `.pipeline-arrow` usa `font-family: var(--font-display)` (Tomorrow). Glyph `→` desalinha verticalmente vs. badges no screenshot. **Fix:** trocar para `font-family: var(--font-body)` (Inter).

- **[Tipografia] `components.css:450`** — `.pipeline-badge` usa `font-size: 9px` com Tomorrow — ilegível em viewport real. **Fix:** `font-size: 10px; letter-spacing: 0.5px`.

- **[Tipografia] `components.css:401`** — `.stack-label` usa `font-size: 9px`. Mesmo problema. **Fix:** `font-size: 10px`.

- **[Stack header alignment] `components.css:377`** — `.stack-card-header` com `align-items: center` causa desalinhamento óptico entre loader (48px) e label+name empilhados. **Fix:** `align-items: flex-start` + `padding-top: 4px` em `.stack-card-meta`.

- **[Section title] `base.css:48`** — `line-height: 1.1` em `section-title` causa gap desigual com Tomorrow (alta x-height). **Fix:** `line-height: 1.05` para h2 de seção.

- **[Compare differentiation] `components.css:533`** — Painéis before/after visualmente quase idênticos. **Fix:** adicionar `background: rgba(255,95,86,0.03)` no `.compare-panel--before .compare-panel-header`.

- **[Problem featured] `components.css:270`** — Card featured ocupa full-width mas sobra muito espaço vazio à direita. Ícone SVG `30x30` parece pequeno no container `64x64`. **Fix:** ícone para `36x36` ou container para `56x56`, OU adicionar elemento decorativo à direita.

- **[Hero headline accent] `sections.css:79`** — `.hero-headline-accent` (ponto final azul) quase imperceptível no hero.png. **Fix:** considerar substituir por SVG dot maior ou simplesmente remover — impacto visual mínimo.

- **[CTA loader] `components.css:544`** — `.cta-bg-loader` com `opacity: 0.08` é quase invisível mas consome GPU. **Fix:** aumentar para `opacity: 0.15` (proposital visível) OU remover animação (`animation: none`).

- **[Arsenal count] `components.css:315`** — `.arsenal-category-count` não tem `font-variant-numeric: tabular-nums` mas `.hero-stat strong` tem. **Fix:** adicionar `font-variant-numeric: tabular-nums` para consistência.

---

## 🔵 Baixa prioridade (7 findings)

- **[HTML dead element] `index.html:53`** — `<span class="hero-badge-dot">` sem CSS associado. **Fix:** remover a tag.

- **[A11y] `index.html:28`** — `aria-label="FacioFlow início"` no `<a>` + `alt="FacioFlow"` no `<img>` causa double-announce. **Fix:** trocar `alt="FacioFlow"` para `alt=""`.

- **[Footer] `index.html:597-598`** — Primeiro `footer-sep` ("·") aparece sem nada à esquerda. **Fix:** remover o primeiro `·` ou adicionar copyright/ano antes dele.

- **[Network] `index.html:15`** — Carrega Tomorrow `wght@400;700` mas 400 nunca é usado no CSS. **Fix:** `family=Tomorrow:wght@700` (remove peso morto da network).

- **[Stagger] vários data-delay** — Arsenal usa delays até 500ms; outras seções usam 80-240ms. Inconsistente. **Fix:** padronizar em 80-100ms entre items em todas as seções.

- **[Layout] `sections.css:170`** — `max-width: 760px` nos stacks pode causar quebra de linha em pipeline badges longos (n8n tem 5 badges). **Fix:** `max-width: 820px`.

- **[Tokens radius] `tokens.css`** — Escala de radius pula de 14px para 20px. **Fix:** considerar `--radius-lg: 16px`.

---

## Resumo

**Total: 22 findings** — 5 alta, 10 média, 7 baixa

### Quick wins (alta prioridade, baixo esforço)
1. `transform-box: view-box` no Concentric Pulse + Wavy Ring (2 linhas CSS) — resolve os loaders
2. `color: var(--text-muted)` no hero-stat (1 linha) — resolve contraste WCAG
3. `tabindex="-1"` no `<main>` (1 atributo) — fix a11y skip-link
4. `font-family: var(--font-body)` nas pipeline-arrows (1 linha) — alinha setas
5. `font-size: 10px` em pipeline-badge e stack-label (2 linhas) — legibilidade Tomorrow
