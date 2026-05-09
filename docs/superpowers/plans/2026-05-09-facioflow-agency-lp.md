# FacioFlow Agency LP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Visual tasks (HTML, CSS, SVG) MUST go to ui-subagent (Opus 4.7).** A sessão principal coordena; o Opus executa o visual.

**Goal:** Build `facioflow-agency/` — LP da FacioFlow como agência de tech com estética Editorial Dark, 7 seções, copy real do site, layout de serviços alternado e benefícios assimétricos.

**Architecture:** Vanilla HTML/CSS/JS sem framework, 4 arquivos CSS (tokens → base → components → sections), IntersectionObserver para reveals. Pasta independente, sem dependências de outros projetos.

**Tech Stack:** HTML5 · CSS custom properties · Vanilla JS · Tomorrow + Inter (Google Fonts) · SVG inline para grain texture e visuals mockados dos serviços

**Spec:** `docs/superpowers/specs/2026-05-09-facioflow-agency-lp-design.md`

---

## Arquivos a criar

| Arquivo | Responsabilidade |
|---|---|
| `facioflow-agency/index.html` | Estrutura completa, 7 seções, todo o copy |
| `facioflow-agency/css/tokens.css` | Design tokens Editorial Dark |
| `facioflow-agency/css/base.css` | Reset, grain texture global, reveal utility, section spacing |
| `facioflow-agency/css/components.css` | Navbar, botões, service-block, process-step, benefit-card, badges |
| `facioflow-agency/css/sections.css` | Layout por seção, alternating services, asymmetric benefits, responsivo |
| `facioflow-agency/js/main.js` | Navbar scroll, IntersectionObserver reveals, aria-expanded mobile |

---

## Task 1: Criar estrutura de diretórios + tokens.css + base.css + main.js

**Files:**
- Create: `facioflow-agency/css/tokens.css`
- Create: `facioflow-agency/css/base.css`
- Create: `facioflow-agency/js/main.js`

- [ ] **Step 1: Criar pasta**

```bash
mkdir -p facioflow-agency/css facioflow-agency/js
```

- [ ] **Step 2: Criar tokens.css**

```css
:root {
  /* Backgrounds Editorial Dark — diferença visível entre camadas */
  --bg:              #080808;
  --bg-elevated:     #141414;
  --bg-surface:      #1C1C1C;

  /* Brand */
  --accent:          #2463EB;
  --accent-dim:      rgba(36, 99, 235, 0.12);
  --accent-glow:     rgba(36, 99, 235, 0.24);

  /* Text */
  --text:            #FFFFFF;
  --text-muted:      #6B7280;
  --text-faint:      #374151;

  /* Borders */
  --border:          rgba(255, 255, 255, 0.08);
  --border-accent:   rgba(36, 99, 235, 0.3);

  /* Typography */
  --font-display:    'Tomorrow', sans-serif;
  --font-body:       'Inter', sans-serif;
  --font-mono:       'SF Mono', 'Fira Code', Consolas, monospace;

  /* Spacing (4px base) */
  --space-1:  4px;   --space-2:  8px;   --space-3:  12px;
  --space-4:  16px;  --space-5:  20px;  --space-6:  24px;
  --space-8:  32px;  --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;  --space-24: 96px;

  /* Radius */
  --radius-sm: 4px;  --radius: 8px;  --radius-md: 12px;  --radius-lg: 16px;

  /* Transitions */
  --trans:      0.2s ease;
  --trans-slow: 0.45s ease;
}
```

- [ ] **Step 3: Criar base.css com grain texture global**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; color-scheme: dark; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  position: relative;
}

/* Grain texture global via SVG feTurbulence — sutil, elimina digital flatness */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  mix-blend-mode: overlay;
}

.container {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (max-width: 768px) { .container { padding: 0 var(--space-5); } }

/* Accent line — elemento gráfico único: 2px × 40px acima de headings */
.accent-line {
  display: block;
  width: 40px;
  height: 2px;
  background: var(--accent);
  margin-bottom: var(--space-6);
}

/* Section spacing */
section { padding: var(--space-24) 0; }

.section-label {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: var(--space-4);
  display: block;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  line-height: 1.05;
  color: var(--text);
  margin-bottom: var(--space-5);
  text-wrap: balance;
}

.section-sub {
  font-size: 17px;
  color: var(--text-muted);
  max-width: 560px;
  line-height: 1.7;
}

/* Reveal utility */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Criar main.js**

```js
// Navbar scroll state
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile menu
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

// Reveal on scroll
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
```

- [ ] **Step 5: Commit**

```bash
git add facioflow-agency/
git commit -m "scaffold: facioflow-agency foundation (tokens, base, main.js)"
```

---

## Task 2: index.html — estrutura completa (7 seções)

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-agency/index.html`

**Brief para o ui-subagent:**

Criar `facioflow-agency/index.html` com 7 seções usando este copy real extraído do site FacioFlow:

**Head:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Automação que começa pelo problema, não pela ferramenta. FacioFlow — automação de processos, agentes de IA e plataformas sob medida.">
  <meta property="og:title" content="FacioFlow — Inteligência Tecnológica">
  <meta property="og:description" content="Automação que começa pelo problema, não pela ferramenta.">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#080808">
  <link rel="icon" type="image/svg+xml" href="../assets/icone_branco 1-1.svg">
  <title>FacioFlow — Inteligência Tecnológica que Escala seu Negócio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tomorrow:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/sections.css">
</head>
```

**Seção 1 — Hero:**
```html
<section class="hero" id="hero" aria-labelledby="hero-title">
  <div class="container">
    <div class="hero-inner">
      <span class="accent-line" aria-hidden="true"></span>
      <h1 class="hero-headline reveal" id="hero-title">
        Automação que começa pelo problema,<br>
        <em>não pela ferramenta.</em>
      </h1>
      <p class="hero-sub reveal" data-delay="120">
        Conectamos seus sistemas, eliminamos o trabalho repetitivo e aplicamos IA
        onde ela gera resultado mensurável. Sem promessa vazia. Sem stack inflada.
      </p>
      <div class="hero-actions reveal" data-delay="240">
        <a href="#contato" class="btn btn-primary">Fale com um especialista</a>
        <a href="#servicos" class="btn btn-ghost">Ver serviços →</a>
      </div>
    </div>
  </div>
</section>
```

**Seção 2 — Por que agora (Context):**
Stat do Gartner + copy de posicionamento. Background `--bg-elevated`.

```html
<section class="context" id="context" aria-labelledby="context-title">
  <div class="container">
    <div class="context-inner">
      <div class="context-stat reveal">
        <span class="stat-number">US$ 2,5T</span>
        <span class="stat-label">em IA até 2026 — Gartner</span>
      </div>
      <div class="context-stat reveal" data-delay="80">
        <span class="stat-number">40%</span>
        <span class="stat-label">das aplicações com agentes integrados</span>
      </div>
    </div>
    <div class="context-copy reveal" data-delay="160">
      <span class="accent-line" aria-hidden="true"></span>
      <h2 class="section-title" id="context-title">A automação deixou de ser diferencial e virou a base.</h2>
      <p class="section-sub">
        Empresas que não automatizam ficam para trás. Quem automatiza sem estratégia perde dinheiro.
        A FacioFlow existe para ocupar esse meio — traduzir o que sua operação precisa em automações
        reais, integradas e mensuráveis.
      </p>
    </div>
  </div>
</section>
```

**Seção 3 — Serviços (4 blocos alternados):**

Usar `class="service-block"` para cada serviço. Os de índice par (0, 2) têm `service-block--reverse` para inverter a ordem visual.

```html
<section class="services" id="servicos" aria-labelledby="services-title">
  <div class="container">
    <span class="section-label reveal">Serviços</span>
    <h2 class="section-title reveal" data-delay="80" id="services-title">O que entregamos</h2>

    <!-- Serviço 1: visual à direita -->
    <article class="service-block reveal" data-delay="0">
      <div class="service-content">
        <h3 class="service-title">Automação de processos e integrações</h3>
        <p class="service-desc">Workflows que conectam ferramentas e eliminam tarefas manuais e repetitivas em qualquer área da operação. Vendas, marketing, financeiro, logística, RH — cada processo é mapeado, modelado e automatizado com gatilhos, validações e regras de negócio próprias da sua empresa.</p>
      </div>
      <div class="service-visual" aria-hidden="true"><!-- SVG workflow mockup --></div>
    </article>

    <!-- Serviço 2: visual à esquerda (reverse) -->
    <article class="service-block service-block--reverse reveal" data-delay="0">
      <div class="service-content">
        <h3 class="service-title">Agentes de IA e atendimento automatizado</h3>
        <p class="service-desc">Chatbots e agentes inteligentes em WhatsApp, site e canais internos, com contexto próprio do seu negócio via arquitetura RAG. Qualificação de leads, suporte ao cliente, triagem inicial e atendimento interno.</p>
      </div>
      <div class="service-visual" aria-hidden="true"><!-- SVG chat mockup --></div>
    </article>

    <!-- Serviço 3: visual à direita -->
    <article class="service-block reveal" data-delay="0">
      <div class="service-content">
        <h3 class="service-title">Dashboards e inteligência de dados</h3>
        <p class="service-desc">Painéis personalizados que centralizam indicadores de marketing, vendas, operação e atendimento em uma única interface. Dados consolidados das ferramentas que você já usa, atualizados automaticamente.</p>
      </div>
      <div class="service-visual" aria-hidden="true"><!-- SVG dashboard mockup --></div>
    </article>

    <!-- Serviço 4: visual à esquerda (reverse) -->
    <article class="service-block service-block--reverse reveal" data-delay="0">
      <div class="service-content">
        <h3 class="service-title">Plataformas sob medida</h3>
        <p class="service-desc">Aplicações web completas quando ferramenta de prateleira não resolve. Painéis administrativos, sistemas internos, portais de cliente — construídos com stack moderna e arquitetura escalável.</p>
      </div>
      <div class="service-visual" aria-hidden="true"><!-- SVG code/app mockup --></div>
    </article>
  </div>
</section>
```

**Seção 4 — Como trabalhamos (5 etapas):**

```html
<section class="process" id="processo" aria-labelledby="process-title">
  <div class="container">
    <span class="section-label reveal">Processo</span>
    <h2 class="section-title reveal" data-delay="80" id="process-title">Automação que começa pelo planejamento, não pela ferramenta.</h2>
    <div class="process-timeline">
      <div class="process-step reveal" data-delay="0">
        <div class="process-step-number">01</div>
        <h3 class="process-step-title">Análise</h3>
        <p class="process-step-desc">Entendemos seus objetivos e restrições</p>
      </div>
      <div class="process-connector" aria-hidden="true"></div>
      <div class="process-step reveal" data-delay="80">
        <div class="process-step-number">02</div>
        <h3 class="process-step-title">Especificação</h3>
        <p class="process-step-desc">Criamos o escopo e o cronograma do projeto</p>
      </div>
      <div class="process-connector" aria-hidden="true"></div>
      <div class="process-step reveal" data-delay="160">
        <div class="process-step-number">03</div>
        <h3 class="process-step-title">Construção</h3>
        <p class="process-step-desc">Desenvolvemos o projeto e testes na aplicação</p>
      </div>
      <div class="process-connector" aria-hidden="true"></div>
      <div class="process-step reveal" data-delay="240">
        <div class="process-step-number">04</div>
        <h3 class="process-step-title">Lançamento</h3>
        <p class="process-step-desc">Implementamos o sistema e treinamos a equipe</p>
      </div>
      <div class="process-connector" aria-hidden="true"></div>
      <div class="process-step process-step--accent reveal" data-delay="320">
        <div class="process-step-number">05</div>
        <h3 class="process-step-title">Otimização Contínua</h3>
        <p class="process-step-desc">Verificamos métricas e sugerimos melhorias com base nos dados</p>
      </div>
    </div>
  </div>
</section>
```

**Seção 5 — Benefícios (1 grande + 5 compactos):**

```html
<section class="benefits" id="beneficios" aria-labelledby="benefits-title">
  <div class="container">
    <span class="section-label reveal">Benefícios</span>
    <h2 class="section-title reveal" data-delay="80" id="benefits-title">O que muda na prática</h2>
    <div class="benefits-grid">
      <!-- 1 item grande: col-span 2 -->
      <article class="benefit-card benefit-card--featured reveal">
        <h3 class="benefit-title">Previsibilidade e confiabilidade</h3>
        <p class="benefit-desc">Os processos rodam do mesmo jeito todos os dias, sem depender de quem está no plantão. Cada execução é registrada, auditável e mensurável.</p>
      </article>
      <!-- 5 itens compactos -->
      <article class="benefit-card reveal" data-delay="80">
        <h3 class="benefit-title">Velocidade</h3>
        <p class="benefit-desc">Respostas em segundos. Atendimento, qualificação e envio de propostas que acontecem a qualquer momento.</p>
      </article>
      <article class="benefit-card reveal" data-delay="160">
        <h3 class="benefit-title">Escalabilidade</h3>
        <p class="benefit-desc">Quando a demanda dobra, sua estrutura não precisa dobrar junto.</p>
      </article>
      <article class="benefit-card reveal" data-delay="240">
        <h3 class="benefit-title">Visibilidade Real</h3>
        <p class="benefit-desc">O que antes estava espalhado entre planilhas e sistemas vira uma única fonte confiável.</p>
      </article>
      <article class="benefit-card reveal" data-delay="320">
        <h3 class="benefit-title">Integração</h3>
        <p class="benefit-desc">ERP, CRM, planilha e WhatsApp passam a trabalhar como uma operação conjunta.</p>
      </article>
      <article class="benefit-card reveal" data-delay="400">
        <h3 class="benefit-title">Foco no que importa</h3>
        <p class="benefit-desc">Tarefas repetitivas saem da rotina. Sobra energia pra pensar, planejar e construir.</p>
      </article>
    </div>
  </div>
</section>
```

**Seção 6 — Segurança:**

```html
<section class="security" id="seguranca" aria-labelledby="security-title">
  <div class="container">
    <div class="security-inner reveal">
      <h2 class="section-title" id="security-title">Segurança e Privacidade de Dados</h2>
      <p class="section-sub">A segurança dos seus dados é prioridade absoluta. Toda a nossa operação é construída em conformidade com a LGPD e o GDPR.</p>
      <div class="security-badges">
        <span class="security-badge">LGPD</span>
        <span class="security-badge">GDPR</span>
      </div>
    </div>
  </div>
</section>
```

**Seção 7 — CTA Final + Footer:**

```html
<section class="cta-final" id="contato" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta-inner reveal">
      <span class="accent-line" aria-hidden="true"></span>
      <h2 class="cta-headline" id="cta-title">Pronto para elevar os processos da sua empresa?</h2>
      <p class="cta-sub">Vamos discutir seus desafios e construir um sistema que te ajuda a tomar decisões baseadas em dados.</p>
      <a href="https://facioflow.com.br" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Fale com a FacioFlow</a>
    </div>
  </div>
</section>

<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-inner">
      <a href="#hero" class="footer-logo" aria-label="FacioFlow — início">
        <img src="../assets/logo_branco 1-1.svg" alt="" height="20" width="auto">
      </a>
      <nav class="footer-links" aria-label="Links do rodapé">
        <a href="#hero">Início</a>
        <span aria-hidden="true">·</span>
        <a href="#servicos">Serviços</a>
        <span aria-hidden="true">·</span>
        <a href="#processo">Processo</a>
        <span aria-hidden="true">·</span>
        <a href="https://facioflow.com.br/privacidade" target="_blank" rel="noopener noreferrer">Privacidade</a>
      </nav>
      <span class="footer-copyright">© 2026 FacioFlow</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 1: Criar index.html completo** (ui-subagent Opus)

Montar o arquivo completo com: DOCTYPE + head + skip-link + navbar + main (7 seções acima) + script tag para main.js.

Navbar:
```html
<a href="#main-content" class="skip-link">Pular para o conteúdo</a>
<nav class="navbar" aria-label="Navegação principal">
  <div class="container">
    <div class="navbar-inner">
      <a href="#hero" class="navbar-logo" aria-label="FacioFlow início">
        <img src="../assets/logo_branco 1-1.svg" alt="" height="22" width="auto">
      </a>
      <ul class="navbar-links" id="navbar-links" role="list">
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#processo">Processo</a></li>
        <li><a href="#beneficios">Benefícios</a></li>
        <li><a href="#contato" class="btn-nav">Fale conosco</a></li>
      </ul>
      <button class="navbar-mobile-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="navbar-links" type="button">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<main id="main-content" tabindex="-1">
```

- [ ] **Step 2: Verificar que o arquivo existe e tem ~300+ linhas**

```bash
wc -l facioflow-agency/index.html
```

- [ ] **Step 3: Commit**

```bash
git add facioflow-agency/index.html
git commit -m "feat: facioflow-agency index.html — 7 seções, copy real FacioFlow"
```

---

## Task 3: components.css

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-agency/css/components.css`

**Componentes a implementar:**

**Skip link, Navbar** (mesma estrutura que v3, mas adaptada para Editorial Dark — sem `rgba(7,10,19,0.88)`, usar `rgba(8,8,8,0.92)`).

**Botões:**
- `.btn-primary`: `background: var(--accent); color: #fff; padding: 14px 28px`
- `.btn-ghost`: `background: transparent; border: 1px solid var(--border); color: var(--text-muted)` — hover: border-color accent, color white
- `.btn-nav`: `border: 1px solid var(--border)` no navbar

**Service block** (componente principal da seção de serviços):
```css
.service-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
  padding: var(--space-12) 0;
  border-bottom: 1px solid var(--border);
}
.service-block--reverse {
  direction: rtl; /* inverte a ordem dos filhos */
}
.service-block--reverse > * {
  direction: ltr; /* reseta para o conteúdo interno */
}
.service-title {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-4);
}
.service-desc {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
}
.service-visual {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
```

**Service visuals (SVG inline mockados):** Criar 4 SVGs simples dentro dos `.service-visual`:
1. Workflow: nodes retangulares conectados por linhas com setas
2. Chat: balões de conversa com checkmarks
3. Dashboard: barras de gráfico + número em destaque
4. Code: linhas de código estilizadas (rectangles coloridos simulando syntax highlighting)

**Process step:**
```css
.process-timeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-top: var(--space-12);
}
.process-step {
  flex: 1;
  padding: var(--space-6);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.process-step--accent {
  border-color: var(--border-accent);
  background: var(--accent-dim);
}
.process-connector {
  width: 40px;
  height: 1px;
  background: var(--border);
  align-self: center;
  flex-shrink: 0;
}
.process-step-number {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 2px;
  margin-bottom: var(--space-3);
}
.process-step-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-2);
}
.process-step-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}
```

**Benefit card (featured + normal):**
```css
.benefit-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
}
.benefit-card--featured {
  grid-column: 1 / 3; /* span 2 colunas */
  padding: var(--space-8);
  border-color: var(--border-accent);
  background: var(--bg-surface);
}
.benefit-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-3);
}
.benefit-card--featured .benefit-title {
  font-size: 20px;
  margin-bottom: var(--space-4);
}
.benefit-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}
```

**Security badges:**
```css
.security-badge {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 12px;
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  color: var(--accent);
}
```

**Context stats:**
```css
.stat-number {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 700;
  color: var(--text);
  display: block;
  line-height: 1;
}
.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  display: block;
  margin-top: var(--space-2);
}
```

**Focus-visible:**
```css
.btn:focus-visible,
.navbar-links a:focus-visible,
.navbar-logo:focus-visible,
.footer-links a:focus-visible,
.navbar-mobile-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

- [ ] **Step 1: Criar components.css completo** (ui-subagent)
- [ ] **Step 2: Commit**

```bash
git add facioflow-agency/css/components.css
git commit -m "feat: facioflow-agency components.css — navbar, btns, service-block, process, benefits"
```

---

## Task 4: sections.css — layouts de todas as seções

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-agency/css/sections.css`

**Hero:**
```css
.hero {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  background: var(--bg);
}
.hero-inner {
  max-width: 760px;
}
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -2px;
  color: var(--text);
  margin-bottom: var(--space-6);
  text-wrap: balance;
}
.hero-headline em {
  font-style: normal;
  color: var(--accent);
}
.hero-sub {
  font-size: 18px;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: var(--space-10);
}
.hero-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}
```

**Context:**
```css
.context { background: var(--bg-elevated); }
.context-inner {
  display: flex;
  gap: var(--space-16);
  margin-bottom: var(--space-12);
}
.context-copy { max-width: 680px; }
```

**Services:**
```css
.services { background: var(--bg); }
/* .service-block e .service-block--reverse estão em components.css */
@media (max-width: 768px) {
  .service-block,
  .service-block--reverse {
    grid-template-columns: 1fr;
    direction: ltr;
  }
}
```

**Process:**
```css
.process { background: var(--bg-elevated); }
@media (max-width: 900px) {
  .process-timeline {
    flex-direction: column;
    gap: var(--space-3);
  }
  .process-connector {
    width: 1px;
    height: 24px;
    align-self: flex-start;
    margin-left: var(--space-6);
  }
}
```

**Benefits:**
```css
.benefits { background: var(--bg); }
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-top: var(--space-12);
}
/* benefit-card--featured ocupa 2 colunas (definido em components.css) */
@media (max-width: 900px) {
  .benefits-grid { grid-template-columns: repeat(2, 1fr); }
  .benefit-card--featured { grid-column: 1 / -1; }
}
@media (max-width: 600px) {
  .benefits-grid { grid-template-columns: 1fr; }
  .benefit-card--featured { grid-column: auto; }
}
```

**Security:**
```css
.security { background: var(--bg-elevated); text-align: center; }
.security-inner { max-width: 600px; margin: 0 auto; }
.security-badges {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin-top: var(--space-6);
}
```

**CTA Final:**
```css
.cta-final { background: var(--bg); text-align: center; }
.cta-inner { max-width: 640px; margin: 0 auto; }
.cta-headline {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.05;
  color: var(--text);
  margin-bottom: var(--space-5);
  text-wrap: balance;
}
.cta-sub {
  font-size: 17px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-8);
}
```

**Footer:**
```css
.footer {
  padding: var(--space-8) 0;
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}
.footer-links {
  display: flex;
  gap: var(--space-5);
  align-items: center;
}
.footer-links a {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--trans);
}
.footer-links a:hover { color: var(--text); }
.footer-copyright {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--text-faint);
  letter-spacing: 1px;
}
@media (max-width: 600px) {
  .footer-inner { flex-direction: column; text-align: center; }
}
```

- [ ] **Step 1: Criar sections.css completo** (ui-subagent)
- [ ] **Step 2: Commit**

```bash
git add facioflow-agency/css/sections.css
git commit -m "feat: facioflow-agency sections.css — hero, context, services alt, process, benefits asymmetric"
```

---

## Task 5: verification-before-completion

**Files:** nenhum criado — verificação visual

- [ ] **Step 1: Atualizar script de audit para apontar para facioflow-agency**

Editar `scripts/audit_visual.mjs` — trocar URL de `facioflow-v3` para `facioflow-agency` e atualizar sections:
```js
const URL = 'http://localhost:8080/facioflow-agency/';
const sections = [
  { name: 'hero',      selector: '.hero' },
  { name: 'context',   selector: '.context' },
  { name: 'services',  selector: '.services' },
  { name: 'process',   selector: '.process' },
  { name: 'benefits',  selector: '.benefits' },
  { name: 'cta-footer', selector: null },
];
```

- [ ] **Step 2: Iniciar servidor**

```bash
python -m http.server 8080
```

- [ ] **Step 3: Abrir no browser e verificar checklist**

Abrir `http://localhost:8080/facioflow-agency/` e confirmar:
- [ ] Grain texture visível (sutil) em todas as seções
- [ ] Hero: headline grande, `em` em azul, sem elemento animado
- [ ] Context: stats do Gartner em tipografia grande
- [ ] Serviços: layout alternado esquerda/direita visível em 1280px
- [ ] Serviços: em 768px, layout empilha em coluna única
- [ ] Processo: timeline horizontal em desktop, vertical em mobile
- [ ] Benefícios: 1 card grande (span 2 colunas) + 5 menores
- [ ] CTA: centralizado, headline grande, botão primário
- [ ] Footer: logo + links + copyright em linha
- [ ] Responsivo 375px: tudo empilhado sem overflow

- [ ] **Step 4: Capturar screenshots**

```bash
node scripts/audit_visual.mjs
```

- [ ] **Step 5: Commit do script atualizado**

```bash
git add scripts/audit_visual.mjs
git commit -m "chore: atualiza audit script para facioflow-agency"
```

---

## Task 6: frontend-audit-gate (híbrido) + finishing

- [ ] Invocar `frontend-audit-gate` com os screenshots capturados no Task 5
- [ ] Aplicar findings Alta e Média via ui-subagent
- [ ] Commit final dos fixes
- [ ] Invocar `finishing-a-development-branch`

---

## Self-review

**Spec coverage:**
- ✅ `facioflow-agency/` folder → Task 1
- ✅ Tokens Editorial Dark → Task 1
- ✅ Grain texture → Task 1 (base.css body::before)
- ✅ 7 seções com copy real → Task 2
- ✅ Accent line → base.css `.accent-line` + usada no index.html
- ✅ Service blocks alternating → Task 3 (`.service-block--reverse`) + Task 4
- ✅ Process timeline 5 etapas → Task 3 + Task 2
- ✅ Benefits 1 grande + 5 compactos → Task 3 (`.benefit-card--featured`) + Task 4
- ✅ Segurança LGPD/GDPR → Task 2
- ✅ verification-before-completion → Task 5 (obrigatório)
- ✅ Tomorrow weight 700 max → documentado nas regras do task 3
- ✅ Responsivo → Task 4 (breakpoints em cada seção)

**Gaps:** nenhum.

**Type consistency:** `.service-block--reverse` definido em Task 3, referenciado em Task 4 e usado em Task 2. ✅
