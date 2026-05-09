# Audit Híbrido: facioflow-skills-landing (v2 — código + screenshots)

**Data:** 2026-05-09
**Modelo:** Claude Opus 4.7
**Método:** Análise cruzada — 7 screenshots Playwright + 5 arquivos de código
**Escopo:** index.html, tokens.css, base.css, components.css, sections.css

---

## 🔴 Alta prioridade (8 findings)

- **[Hero] `index.html:55-59`** — Tomorrow `font-weight: 900` causa artefatos visuais (RGB-split/chromatic aberration) em "AI", "ficou", "poderoso" — glyph 900 tem outline nativo defeituoso que parece chromatic aberration mas não é intencional. Afeta sistematicamente todas as headlines. **Fix:** trocar para `font-weight: 700` globalmente nas headlines, ou aplicar `text-shadow: 0 0 1px rgba(36,99,235,0.4)` controlado. Confirmar em Chrome e Firefox.

- **[Problem] `index.html:210`** — Mesmo bug de RGB-split em "AI sem estrutura / não escala." — "ã" e "ç" especialmente afetados. Mesmo fix sistêmico do hero.

- **[Pipeline] `index.html:277`** — Mesmo bug em "Conheça o / fluxo completo". Padrão sistêmico: todo h2 com Tomorrow 900 sofre. Corrigir globalmente em `base.css:88` (`.section-title`), `sections.css:67` (`.hero-headline`) e `sections.css` (`.cta-title`).

- **[Pipeline] `index.html:289` + screenshot `pipeline.png`** — Falta `tree-vline` entre `tree-diamond-wrap` e `tree-fork-wrap` — o diamond "Que tipo de projeto?" fica solto sem linha descendo ao split horizontal. **Fix:** adicionar `<div class="tree-vline" aria-hidden="true"></div>` entre os dois elementos no HTML.

- **[Pipeline] `index.html:335-340` + screenshot `pipeline.png`** — Merge U-shape (`border-radius: 0 0 6px`) não conecta visualmente à coluna LP/Componente (apenas 4 nodes vs 7 no lado App/Dashboard). A coluna esquerda fica órfã sem ligação até `frontend-audit-gate`. **Fix:** equalizar alturas das colunas com `align-items: stretch` no `.tree-fork`, ou usar SVG path para o merge.

- **[Capabilities] `sections.css:352-355`** — `.capabilities-header` sem `text-align: center` nem `margin: 0 auto` — todos os outros section-headers são centralizados, quebrando o ritmo visual. **Fix:** adicionar `text-align: center; margin: 0 auto var(--space-16);` à regra.

- **[A11y] `index.html` (ausente)** — Skip-link estilizado em `components.css:2-11` mas **completamente ausente do HTML**. **Fix:** adicionar `<a class="skip-link" href="#main-content">Pular para o conteúdo</a>` como primeiro filho do `<body>`.

- **[A11y] `js/main.js` + `index.html:38`** — `aria-expanded="false"` no `navbar-mobile-toggle` nunca é atualizado — JS precisa togglar entre `"false"` / `"true"` e `aria-label` entre "Abrir menu" / "Fechar menu". Leitores de tela informam estado errado.

---

## 🟡 Média prioridade (12 findings)

- **[Hero SVG] `index.html:103-105`** — `feGaussianBlur` aplicado a 3+4 partículas com `animateMotion` contínuo é caro em GPU — funciona mas pode derrubar fps em mobile/laptops fracos. **Fix:** usar `filter` apenas em hover state ou substituir por `radialGradient` no fill.

- **[Hero SVG] `index.html:140-154`** — Ondas pulsantes (3 circles com animate `r` 10→380) dentro do clipPath do F são pouco visíveis no screenshot (contornos finos da letra escondem o efeito) mas têm alto custo de renderização. Avaliar custo/benefício.

- **[Hero] `sections.css:31`** — Grid `1fr 420px` com coluna fixa. Em viewports 901-1024px o F ocupa quase metade da tela. **Fix:** `minmax(320px, 420px)` na segunda coluna.

- **[Problem] `index.html:210-263`** — **Anti-pattern de AI clássico**: 3 cards visualmente idênticos (mesmo padding, mesmo ícone azul num quadrado, mesmo título uppercase, mesmo parágrafo de 3 linhas). **Fix sugerido:** variar tamanho/proporção, layout escalonado (1 grande + 2 menores), ou desalinhar baseline.

- **[Pipeline] `sections.css:187-190`** — `.tree-diamond` com `transform: rotate(-1deg)` + inner `rotate(1deg)` — efeito quase imperceptível no screenshot, parece bug de renderização. Aumentar para 3-5deg para virar intenção visível, ou remover.

- **[Capabilities] `components.css:381-390`** — Lista dos feature cards usa `font-family: var(--font-display)` (Tomorrow) a 11px em sentenças longas — Tomorrow é display font, ilegível em corpo pequeno. **Fix:** usar `var(--font-body)` (Inter) nas listas `.feature-card-list li`.

- **[Arsenal] `components.css:174-181`** — `.skill-chip.highlight` usa `color: rgba(36,99,235,0.8)` a 10px sobre `rgba(255,255,255,0.03)` — **contraste WCAG < 3:1**. Trocar para `color: var(--cyan)` (`#9DDBFF`) que tem contraste adequado no fundo dark.

- **[Arsenal] `index.html:443-525`** — Frontend Design tem `.highlight` em todos os 7 chips — se tudo é highlight, nada é. Os outros 5 grupos não têm highlight, criando assimetria visual. **Fix:** aplicar `.highlight` seletivamente (ex: apenas 2-3 skills mais relevantes por categoria).

- **[Arsenal] screenshot `arsenal.png`** — Alturas desiguais entre categorias (Pipeline=5, Frontend=7, Git=4) criam células vazias no grid. **Fix:** `align-items: start` no `.arsenal-grid` para evitar card esticado.

- **[Footer] `tokens.css:12` + screenshot `cta-footer.png`** — Texto do footer usa `--text-faint: #2D3748` sobre `#070A13` — contraste ~3:1, abaixo de WCAG AA para texto normal. **Fix:** trocar para `--text-muted` ou `rgba(139,148,158,0.6)`.

- **[Tipografia] `components.css:33,56,117,155,189,252,271,307,362,382,418,426`** — Tomorrow usado em buttons, chips, badges, listas, footer text — display font em micro-elementos (8-10px) prejudica legibilidade. **Fix:** reservar Tomorrow para h1/h2/section-label; usar Inter em componentes de UI.

- **[A11y] `index.html:38`** — `aria-label="Abrir menu"` estático mesmo quando o menu está aberto. Deve togglar para "Fechar menu" via JS. (Mesma task do `aria-expanded` — aplicar junto.)

---

## 🔵 Baixa prioridade (7 findings)

- **[Tokens] `tokens.css:33-37`** — 5 níveis de radius (sm/md/regular/lg/xl) over-engineered; na prática usa 4 valores. Consolidar.

- **[SVG hero] `index.html:140-154`** — `<animate>` das pulse waves com `calcMode="spline"` sem `keyTimes` definido nos `r` e `stroke-width` — tecnicamente o spline pode não funcionar como esperado. Adicionar `keyTimes="0;1"` nos animates afetados.

- **[Pipeline] `sections.css:184`** — `.tree-diamond` nomeado "diamond" mas é retângulo com leve rotate. Naming confuso para manutenção futura.

- **[Hero] `sections.css:106-108`** — `will-change: transform` no `.hero-f-wrapper` mas o wrapper não anima — só o SVG interno. `will-change` desnecessário e custoso. Remover.

- **[Cards] `components.css:208-230`** — Hover `translateY(-3px)` em `.problem-card` e `.feature-card` é padrão genérico. Considerar hover mais memorável (gradient sweep, border highlight animado).

- **[Conteúdo] `index.html:69-70`** — "38+ skills instaladas" com round number. Trocar por número exato aumenta credibilidade. Copy do hero repete literalmente no arsenal header (`index.html:434`).

- **[Conteúdo] `index.html:412-416`** — "~67 segundos" — til antes de número específico é estranho. Usar "67 segundos" ou "~1 minuto".

---

## Resumo

**Total: 27 findings** — 8 alta, 12 média, 7 baixa

### Quick wins (alta prioridade, baixo esforço)
1. `font-weight: 900` → `700` nas headlines (1 mudança global em CSS)
2. Adicionar skip-link no HTML (1 linha)
3. Centralizar `.capabilities-header` (2 linhas CSS)
4. Adicionar `tree-vline` entre diamond e fork (1 linha HTML)
5. `aria-expanded` dinâmico em main.js (3 linhas JS)

### Temas sistêmicos
1. **Tomorrow weight 900** — bug de renderização afeta todas as headlines
2. **Pipeline connectors** — diamond solto + merge órfão no lado esquerdo
3. **Tipografia Tomorrow overused** — usada em micro-elementos ilegíveis
4. **A11y básica** — skip-link e aria-expanded ausentes/estáticos
5. **Arsenal highlight** — tudo highlighted = nada highlighted
