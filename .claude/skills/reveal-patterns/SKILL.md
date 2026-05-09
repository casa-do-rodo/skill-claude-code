---
name: reveal-patterns
description: Padrões para reveals on-scroll — quando usar `data-delay` por elemento (1-3 items) vs CSS stagger via classe injetada (grid 4+ items) vs animation-delay com nth-child (animações complexas). Resolve o anti-pattern de "cards aparecendo abruptamente fora de ordem em grids" e define threshold guidance por contexto.
---

# Reveal Patterns

Diferentes situações pedem diferentes estratégias de reveal on-scroll. Escolher errado causa bugs visuais sutis: cards aparecendo fora de ordem, todos ao mesmo tempo, ou nenhum animando.

## Decision tree rápido

```
Quantos elementos vou revelar?
├─ 1-3 (header isolado, hero, ações)
│   └─ Estratégia A: data-delay por elemento
├─ 4+ items em grid simétrico
│   └─ Estratégia B: classe injetada no container + CSS stagger
└─ Animações keyframe complexas (não só fade)
    └─ Estratégia C: animation-fill-mode + nth-child
```

---

## Estratégia A — `data-delay` por elemento

**Quando usar:**
- Hero (badge + headline + sub + actions)
- Section header (label + title + sub)
- 1-3 botões/CTAs
- 1-3 paragraphs ou elementos isolados

**Markup:**
```html
<span class="hero-badge reveal" data-delay="0">Badge</span>
<h1 class="hero-headline reveal" data-delay="120">Headline grande</h1>
<p class="hero-sub reveal" data-delay="240">Subtítulo</p>
<div class="hero-actions reveal" data-delay="360">
  <a class="btn">CTA</a>
</div>
```

**JavaScript (vanilla):**
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

**CSS:**
```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible { opacity: 1; transform: none; }
```

**Vantagens:**
- Controle fino por elemento (cada um pode ter delay próprio)
- Markup simples
- Cada reveal observa-se independentemente

**Limitações:**
- Falha em grid de 4+ items se rolar muito rápido — todos entram na viewport quase simultaneamente, delays se confundem com observer fire times
- Pode parecer caótico em grids (item bottom-right pode aparecer antes do top-left dependendo de scroll position)

---

## Estratégia B — CSS stagger via classe injetada (RECOMENDADO para grids)

**Quando usar:**
- Grid de cards (Arsenal, Benefits, Features, Pricing)
- Lista de logos/clients
- Qualquer agrupamento simétrico de 4+ items

**Markup:**
```html
<div class="arsenal-grid">
  <article class="arsenal-card">…</article>
  <article class="arsenal-card">…</article>
  <article class="arsenal-card">…</article>
  <article class="arsenal-card">…</article>
  <article class="arsenal-card">…</article>
  <article class="arsenal-card">…</article>
</div>
```

**CSS:**
```css
/* Estado inicial dos cards */
.arsenal-grid .arsenal-card {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Container ativo: cards revelam */
.arsenal-grid.revealed .arsenal-card {
  opacity: 1;
  transform: none;
}

/* Stagger via nth-child — ordem visual top-left → bottom-right respeitada */
.arsenal-grid.revealed .arsenal-card:nth-child(1) { transition-delay: 0ms; }
.arsenal-grid.revealed .arsenal-card:nth-child(2) { transition-delay: 100ms; }
.arsenal-grid.revealed .arsenal-card:nth-child(3) { transition-delay: 200ms; }
.arsenal-grid.revealed .arsenal-card:nth-child(4) { transition-delay: 300ms; }
.arsenal-grid.revealed .arsenal-card:nth-child(5) { transition-delay: 400ms; }
.arsenal-grid.revealed .arsenal-card:nth-child(6) { transition-delay: 500ms; }
```

**JavaScript (observer no container):**
```js
const gridObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('revealed');
    gridObserver.unobserve(entry.target);
  }
}, { threshold: 0.08 });

document.querySelectorAll('.arsenal-grid').forEach(el => gridObserver.observe(el));
```

**Vantagens:**
- **Ordem visual sempre respeitada** independente de velocidade de scroll
- Performance: 1 observer por grid em vez de N por items
- CSS-driven, fácil de ajustar timings via DevTools

**Limitações:**
- Stagger fixo via `nth-child` (precisa adicionar regras se número de items mudar)
- Requer container DOM-stable (não funciona se items são adicionados dinamicamente após reveal)

---

## Estratégia C — `animation-fill-mode` + `nth-child` (animações complexas)

**Quando usar:**
- Mockups animados (service visuals, illustrations interativas)
- Elementos que precisam de keyframe complexo (não só fade — path drawing, scale com origin específico, multi-step)

**Markup:**
```html
<div class="service-visual">
  <svg class="svc-1">
    <rect class="anim-node n1"/>
    <rect class="anim-node n2"/>
    <rect class="anim-node n3"/>
  </svg>
</div>
```

**CSS:**
```css
/* Estado inicial */
.svc-1 .anim-node {
  opacity: 0;
  transform: translateY(8px);
}

/* Trigger via classe injetada no parent */
.service-visual.svc-active .svc-1 .anim-node {
  animation: svc-fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Stagger via nth-child */
.service-visual.svc-active .svc-1 .anim-node:nth-child(2) { animation-delay: 200ms; }
.service-visual.svc-active .svc-1 .anim-node:nth-child(3) { animation-delay: 400ms; }

@keyframes svc-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**`animation-fill-mode: both`** preserva estado inicial (antes do delay) e final (depois do término). Sem isso, o elemento pisca para o estado inicial após terminar.

**JavaScript:**
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

**Vantagens:**
- Suporta keyframes complexos (path drawing, multi-step, easing custom)
- Estados preservados por `animation-fill-mode: both`
- Combina com counters JS, SMIL, etc.

**Limitações:**
- Mais código que B, justifique a complexidade
- Se animation-name mudar dinamicamente, requer cleanup

---

## Threshold guidance

| Threshold | Quando usar | Razão |
|---|---|---|
| `0.12` (default) | Elementos individuais que entram totalmente na viewport | Trigger quando 12% do elemento está visível — natural para itens pequenos |
| `0.08` | Containers grandes (grids) | Container pode ser maior que viewport — 8% basta para começar |
| `0.3` | Mockups onde usuário precisa ver contexto antes da animação | Evita "perdi o que aconteceu" — mockup já está bem visível quando anima |
| `0.5` | Counters animados com números | Usuário precisa ver bem antes do número começar a contar (mais "comprometido" com o elemento) |

---

## Anti-patterns

- ❌ Estratégia A em grid de 6 cards — bugs visuais inevitáveis em scroll rápido
- ❌ `threshold: 0` — anima offscreen, usuário perde o efeito
- ❌ Sem `unobserve()` após disparo — observer continua firando em re-entrada (memory leak + visual repeat)
- ❌ `data-delay` muito grande (>500ms) — usuário perde atenção esperando
- ❌ Múltiplos observers no mesmo elemento sem coordenação — animations colidem

---

## Reduced motion (sempre obrigatório)

```css
@media (prefers-reduced-motion: reduce) {
  /* Estratégia A */
  .reveal { opacity: 1; transform: none; transition: none; }

  /* Estratégia B */
  .arsenal-grid .arsenal-card { opacity: 1; transform: none; transition: none; }

  /* Estratégia C */
  .service-visual .svc-1 .anim-node,
  .service-visual .svc-2 .anim-bubble,
  /* etc */ {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}
```

Para counters JS: detectar via `window.matchMedia('(prefers-reduced-motion: reduce)').matches` e setar valor final direto.

---

## Anti-pattern resolvido (caso real)

`facioflow-v3` Arsenal — 6 cards usavam Estratégia A com `data-delay` 0/100/200/300/400/500. Em scroll rápido, cards apareceram fora de ordem (bottom-right antes de top-left) ou simultaneamente.

**Fix aplicado:** migrado para Estratégia B (classe `.arsenal-revealed` injetada no `.arsenal-grid` + CSS stagger via `nth-child`). Comportamento correto independente de velocidade de scroll.

**Lição:** para grids 4+ items, **sempre** usar Estratégia B desde o início. A regressão visual é difícil de reproduzir em dev mas afeta usuário real.
