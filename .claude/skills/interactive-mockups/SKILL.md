---
name: interactive-mockups
description: Padrão para "service visuals" — mockups SVG que ilustram o que o produto faz (workflow, dashboard, chat, code editor). Define quando devem ser estáticos vs animados, 4 templates reutilizáveis (workflow / chat / dashboard / code) e implementação com IntersectionObserver single-fire. Use ao construir LP/landing onde uma seção descreve um processo ou produto dinâmico.
---

# Interactive Product Mockups

Mockups visuais que ilustram **o que o produto faz** — não decoração genérica, mas representação visual do que a seção descreve em copy.

## Quando animar vs deixar estático

**Animar** (default em LPs de produto SaaS/agência):
- Seção descreve um **processo dinâmico** (workflow, conversa, dashboard com dados, código sendo digitado)
- Usuário precisa entender "o que acontece" sem ler tudo
- Brand do projeto é tech/produto (não editorial puro)

**Deixar estático**:
- Estética editorial deliberada (LP minimalista com foco em tipografia)
- Mockup é só ilustração de apoio (ícone grande)
- `prefers-reduced-motion: reduce` → fallback estático automático

**Regra de ouro:** se a seção mostra **o que o produto faz**, o mockup precisa de movimento sutil. Se a seção é descritiva (sobre quem somos, valores), pode ser estático.

---

## 4 templates comuns

### Template 1: Workflow / Pipeline

**Quando:** seção sobre automação, integração entre sistemas, fluxo de dados, processos ETL.

**Visual:** 3 nodes retangulares conectados por linhas com setas. Nó central destacado.

**Animação on-scroll (single-fire):**
1. 3 nodes aparecem com fade-in stagger (0/200/400ms)
2. Conectores em L "desenham" via `stroke-dasharray` + `stroke-dashoffset` (path drawing, ~700-900ms)
3. Após desenhar, dot pulsando aparece no nó central (loop infinito 2s — convenção de "ativo")

**Markup base:**
```html
<svg class="svc-1" viewBox="0 0 250 200" fill="none">
  <!-- Conectores (drawn) -->
  <path class="anim-connector c1" d="M 60 100 H 110" stroke="..." stroke-dasharray="50" stroke-dashoffset="50"/>
  <path class="anim-connector c2" d="M 140 100 H 190" stroke="..." stroke-dasharray="50" stroke-dashoffset="50"/>
  <!-- Nodes -->
  <rect class="anim-node n1" x="20" y="80" width="40" height="40"/>
  <rect class="anim-node n2 active" x="105" y="75" width="50" height="50"/>
  <rect class="anim-node n3" x="190" y="80" width="40" height="40"/>
  <!-- Pulse dot no nó central (após desenhar) -->
  <circle class="anim-pulse" cx="150" cy="80" r="4"/>
</svg>
```

```css
.svc-1 .anim-node { opacity: 0; transform: translateY(8px); }
.svc-1 .anim-connector { /* dashoffset already at full */ }

.service-visual.svc-active .svc-1 .anim-node { animation: svc-fade-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.service-visual.svc-active .svc-1 .n2 { animation-delay: 200ms; }
.service-visual.svc-active .svc-1 .n3 { animation-delay: 400ms; }
.service-visual.svc-active .svc-1 .anim-connector { animation: svc-draw 600ms ease-out both; }
.service-visual.svc-active .svc-1 .c1 { animation-delay: 600ms; }
.service-visual.svc-active .svc-1 .c2 { animation-delay: 900ms; }
.service-visual.svc-active .svc-1 .anim-pulse { animation: svc-pulse 2s 1500ms infinite; }
```

---

### Template 2: Chat / Messaging

**Quando:** seção sobre AI agents, atendimento automatizado, chatbots, comunicação.

**Visual:** 3 balões alternados (esq/dir/esq), com checkmarks ou indicadores.

**Animação on-scroll (single-fire):**
1. Balão 1 (esq) slide-in da esquerda + fade-in (0ms, 500ms duration)
2. Checkmark do balão 1 aparece com scale 0→1 (delay 500ms)
3. Balão 2 (dir) slide-in da direita (delay 700ms)
4. Antes do balão 3: 3 dots de "typing" aparecem com bounce stagger (delay 1300ms, 600ms duration total)
5. Dots desaparecem; balão 3 (esq) slide-in (delay 2000ms)
6. Checkmark do balão 3 (delay 2500ms)

```css
@keyframes svc-typing-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-3px); opacity: 1; }
}
```

---

### Template 3: Dashboard / Metrics

**Quando:** seção sobre dados, analytics, visibilidade, dashboards.

**Visual:** 4 barras crescentes (alturas variadas) + métrica grande (`+27%` etc.) + label.

**Animação on-scroll (single-fire):**
1. As 4 barras crescem do bottom via `transform: scaleY()` com `transform-origin: bottom` (stagger 100ms)
2. Número anima de 0 → valor final via JavaScript (`requestAnimationFrame`, ease-out cúbico, ~1500ms)
3. Label aparece com fade-in após o número (delay 1500ms)

**JavaScript counter (vanilla):**
```js
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = 27;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = `+${Math.round(target * eased)}%`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
```

**CSS bar:**
```css
.svc-3 .anim-bar { transform: scaleY(0); transform-origin: bottom; transform-box: fill-box; }
.service-visual.svc-active .svc-3 .anim-bar {
  animation: svc-bar-grow 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.service-visual.svc-active .svc-3 .b1 { animation-delay: 0ms; }
.service-visual.svc-active .svc-3 .b2 { animation-delay: 100ms; }
.service-visual.svc-active .svc-3 .b3 { animation-delay: 200ms; }
.service-visual.svc-active .svc-3 .b4 { animation-delay: 300ms; }

@keyframes svc-bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
```

---

### Template 4: Code Editor

**Quando:** seção sobre desenvolvimento, plataformas sob medida, integração técnica, APIs.

**Visual:** window frame (3 dots traffic light) + 6 linhas de "código" (rectangles de larguras variadas com cores syntax) + cursor.

**Animação on-scroll (single-fire):**
1. As 6 linhas aparecem top→bottom com `transform: scaleX()` (origin left) stagger 150ms cada
2. Após todas aparecerem, cursor pisca em loop infinito 1s `steps(1, end)` (cursor não usa easing — convenção de terminal/editor)

```css
.svc-4 .anim-line { transform: scaleX(0); transform-origin: left; transform-box: fill-box; }
.service-visual.svc-active .svc-4 .anim-line {
  animation: svc-line-grow 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.service-visual.svc-active .svc-4 .l1 { animation-delay: 0ms; }
.service-visual.svc-active .svc-4 .l2 { animation-delay: 150ms; }
.service-visual.svc-active .svc-4 .l3 { animation-delay: 300ms; }
.service-visual.svc-active .svc-4 .l4 { animation-delay: 450ms; }
.service-visual.svc-active .svc-4 .l5 { animation-delay: 600ms; }
.service-visual.svc-active .svc-4 .l6 { animation-delay: 750ms; }

.service-visual.svc-active .svc-4 .anim-cursor {
  animation: svc-blink 1s steps(1, end) 1200ms infinite;
}

@keyframes svc-line-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes svc-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
```

---

## Trigger pattern: single-fire IntersectionObserver

**NÃO** usar loop infinito nas animações principais. Trigger uma vez quando entra na viewport.

```js
const svcObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('svc-active');
      svcObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.service-visual').forEach(el => svcObserver.observe(el));
```

**Threshold 0.3** — usuário precisa ver 30% do mockup antes da animação rodar. Evita "perdi o que aconteceu" se a animação dispara fora da tela.

**Single-fire via `unobserve`** — após injetar `.svc-active`, remover o observer do elemento. Performance + correção de comportamento.

---

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .service-visual.svc-active .svc-1 *,
  .service-visual.svc-active .svc-2 *,
  .service-visual.svc-active .svc-3 *,
  .service-visual.svc-active .svc-4 * {
    animation: none !important;
  }
}
```

Para counter JS: detectar `prefers-reduced-motion` no JS e setar valor final direto sem animar:
```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  element.textContent = '+27%';
  return;
}
```

---

## Anti-patterns

- ❌ Animar todos os mockups simultaneamente (visualmente caótico — entram sequencialmente, on-scroll)
- ❌ Loop infinito em todas as animações (poluição visual — só pulse dot e cursor blink são exceções legítimas por convenção)
- ❌ Animation total > 3s (perde atenção — mantenha 1.5-2.5s)
- ❌ Threshold = 0.0 (anima fora da tela — usuário perde o efeito)
- ❌ Mockup sem context — visual decorativo genérico não conta como "interactive mockup". Tem que ilustrar o que a seção descreve.

---

## Quando NÃO usar interactive mockup

- LP minimalista editorial (foco em tipografia)
- Seção que NÃO descreve processo dinâmico (sobre nós, valores, manifesto)
- Clientes com brand cool/serene onde animação distrai
- Quando o copy já é forte o suficiente sozinho — animação seria gilding the lily

---

## Caso real

`facioflow-agency` — 4 service-visuals (workflow, chat, dashboard, code) implementados como inline SVG em `index.html` + keyframes globais em `base.css` + observer dedicado em `main.js`. Single-fire, threshold 0.3, prefers-reduced-motion respeitado. Counter "+27%" com `requestAnimationFrame` + ease-out cúbico. Total commit: ~140 linhas adicionadas, dá vida aos 4 mockups sem poluir scroll.
