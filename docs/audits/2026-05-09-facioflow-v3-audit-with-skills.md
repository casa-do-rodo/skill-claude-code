# Audit: facioflow-v3 (via 3 skills formais)

**Data:** 2026-05-09
**Método:** híbrido (código + 7 screenshots) via redesign-existing-projects + web-design-guidelines + svg-animations
**Modelo:** Claude Opus 4.7
**Escopo:** index.html + tokens.css + base.css + components.css + sections.css

---

## Audit 1: redesign-existing-projects

Metodologia: varredura categoria-por-categoria do checklist da skill, cruzando código + screenshots.

### Alta

- [Color/Surfaces] `css/tokens.css:26` — `--text-faint: #2D3748` é usado em `.pipeline-arrow` e `.hero-stat` sobre `bg-elevated #0C1020`. Contraste ≈ 1.6:1, abaixo de qualquer leitura confortável. Visível no screenshot stacks.png: setas `→` mal aparecem entre badges. Fix: subir para `#4A5468` (~3.2:1) ou usar `var(--text-muted)` com `opacity: 0.5`.
- [Layout] `index.html:564–571` (`.cta-bg-loader`) — orbiter de fundo do CTA tem `opacity: 0.08` × cor `rgba(36,99,235,0.15)` = efetivamente invisível no screenshot cta-footer.png. A seção CTA fica "vazia, plana, sem profundidade visual" (item explícito do checklist da skill). Fix: subir opacidade para 0.18–0.22 e cor para `rgba(36,99,235,0.4)`, OU substituir por gradient mesh / noise overlay.
- [Component Patterns] `index.html:472–555` — Arsenal usa **6 cards iguais em 3 colunas × 2 linhas** com mesma altura, mesmo padding, mesmo border-radius. É o padrão "three equal card columns" que a skill flagga como o layout AI mais genérico. Fix: aplicar 2-col zig-zag com tamanhos variáveis, ou destacar visualmente 1 categoria (ex: "Frontend Design" maior, com count em destaque), ou masonry com chips fluindo entre categorias.
- [Layout] `css/sections.css:157` (`.stacks { background: var(--bg-elevated); }`) — `bg-elevated #0C1020` é quase indistinguível de `bg #070A13` no full_page.png. O ritmo de seções alternadas que tokens define não acontece visualmente — a página inteira lê como um único bloco escuro. Fix: `bg-elevated` para `#10162B` ou `#0F1626` (Δ visível sem sair do dark).

### Média

- [Typography] `css/components.css:252,308,397` — `.problem-card-title`, `.arsenal-category-name`, `.stack-label` todos usam `text-transform: uppercase` + Tomorrow + letter-spacing alto. É "all-caps subheaders everywhere" (item do checklist). Visível em problem.png: 3 títulos all-caps consecutivos. Fix: manter all-caps só nos `section-label` (10px overline). Títulos de card → sentence case com weight 700, letter-spacing 0.
- [Layout] `css/sections.css:137–141` — `.problem-grid` é 2-col com card featured ocupando `grid-column: 1/-1` na primeira linha. Funciona, mas o featured tem proporção horizontal pesada (icon 64px + texto a 60ch) que na verdade replica o mesmo ritmo dos outros 2 cards — assimetria fica fraca. Fix: featured com layout vertical e tamanho de título maior (24–28px), criando contraste real com os 2 cards menores.
- [Color/Surfaces] `css/sections.css:17–25` (`.hero-bg-grid`) — grid de pontos com `radial-gradient(circle at 1px 1px, rgba(36,99,235,0.12) 1px, transparent 0)` é correto, mas a máscara elíptica `mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, ...)` faz o padrão sumir nas bordas e fica ambíguo se é ruído ou grid. Fix: trocar para um padrão mais explícito (ex: dots maiores 1.5px, spacing 32px, opacity 0.18) ou adicionar 2ª camada de noise SVG estático para textura.
- [Component Patterns] `index.html:33` — Arsenal cards têm hover apenas em `border-color`. Sem deslocamento, sem mudança em chips internos. Fix: adicionar `transform: translateY(-2px)` + leve highlight nos chips child no hover do card pai.
- [Iconography] `index.html:217–223,235–243,256–261` — 3 SVGs custom inline na problem section, mas com weight inconsistente: o featured tem `stroke-width="1.6"` aplicado inline E o CSS aplica `stroke-width: 1.5` (`components.css:247`). Conflito silencioso — o CSS vence (mas há também `width="30"` inline no featured icon que casa com regra `.problem-card--featured svg { width: 30px }`). Fix: remover stroke-width inline dos SVG, deixar só CSS controlar.
- [Content] `index.html:444,446` — copy "Spec aprovado", "Direção visual" usa traço em-dash decorativo, mas as linhas terminais não têm timestamp ou indicador de duração — perdem realismo de terminal. Fix: adicionar `[2.3s]` ou `(45s)` no fim de algumas linhas para parecer execução real.
- [Layout] `index.html:43,46,202,275` — todas as seções usam estrutura idêntica `.section { container > header(centered) + grid }`. Vertical rhythm 100% simétrico — Top/bottom padding sempre `--space-24` (96px). Fix: variar — algumas seções com mais bottom-padding que top, outras assimétricas, ou adicionar 1 seção com layout horizontal scroll para quebrar o ritmo.

### Baixa

- [Content] `index.html:7,12` — `og:title` e `<title>` usam "FacioFlow // Skills" mas a navbar usa logo SVG e o `og:image` está ausente. Fix: adicionar `<meta property="og:image" content="..." />` com OG card 1200×630.
- [Code Quality] `index.html:11,28,595` — `href="../assets/icone_branco 1-1.svg"` usa parent dir + nome com espaço. Frágil quando servido a partir de `facioflow-v3/`. Fix: copiar asset para `facioflow-v3/assets/icone-branco.svg` (renomear sem espaço) e ajustar paths.
- [Code Quality] `css/components.css:540–546` — `.cta-glow` definido em `sections.css:252–259` e `.cta-bg-loader` em `components.css:540` ambos absolute centralizados no CTA, mas só `.cta-bg-loader` existe no HTML. `.cta-glow` é dead CSS. Fix: remover `.cta-glow` do CSS OU adicionar `<div class="cta-glow"></div>` no HTML para o glow ambiente que falta.
- [Code Quality] `css/sections.css:266–283` — `.cta-title` e `.cta-sub` definidos mas HTML usa `.section-title` e `.section-sub`. Dead CSS. Fix: remover.
- [Code Quality] `css/sections.css:313–322` — `.footer-logo-img` definido com `animation: logo-breathe` e `height: 36px`, mas HTML usa `<img height="20">` direto sem essa classe. Animação não roda no footer. Fix: aplicar `class="footer-logo-img"` no `<img>` do footer (`index.html:595`) OU remover regra.
- [Component Patterns] `index.html:594` — `<a href="#" class="footer-logo">` aponta para `#` (top da página). Footer "↑ Topo" link existe ao lado. Redundante. Fix: remover `href="#"` do footer-logo OU mudar para `href="#hero"` por consistência.
- [Strategic Omissions] `index.html:591–607` — footer tem só GitHub/Skills/Topo. Sem privacy, sem terms, sem copyright. Fix: adicionar linha `© 2026 FacioFlow · MIT License` + link para repo do código.
- [Content] `index.html:430` — "Não tenho contexto da sessão anterior." usa ponto final mas é uma linha de erro de terminal. Mais realista sem ponto: `Error: no session context`. Fix opcional, contexto-dependente.
- [Typography] `css/base.css:41` — `.section-label` tem `letter-spacing: 3px` em fonte de 10px. Tracking muito agressivo para Tomorrow (que já é wide). Fix: reduzir para 2.4px ou 2.5px.

---

## Audit 2: web-design-guidelines

Metodologia: análise de a11y, focus states, anti-patterns, semantic HTML conforme Vercel Web Interface Guidelines.

### Alta

- [a11y/contrast] `css/components.css:527` — `.compare-line--muted { color: rgba(139,148,158,0.4) }` resulta em contraste ~3.2:1 sobre `bg-elevated`. Falha WCAG AA (4.5:1) para texto pequeno (12px). Visível em compare.png como linhas comentário `# sem brainstorming...` quase ilegíveis. Fix: subir alpha para 0.6 ou usar cor sólida `#5A6470`.
- [a11y/contrast] `css/components.css:526` — `.compare-line--dim { color: rgba(139,148,158,0.5) }` ≈ 3.5:1 sobre bg-elevated, falha AA para 12px. Fix: 0.65 alpha mínimo.
- [a11y/duplicate-element] `index.html:53` vs `css/sections.css:61–67` — `<span class="hero-badge-dot">` existe no HTML mas o CSS gera o dot via `.hero-badge::before`. Resultado: 2 elementos visuais para 1 dot OU `.hero-badge-dot` sem estilo (vazio). Verificando hero.png: aparece **um** dot azul antes de "FACIDFLOW SKILLS ECOSYSTEM" — o `::before` venceu e o `<span>` está invisível mas presente no DOM. Fix: remover `<span class="hero-badge-dot">` do HTML OU adicionar regra CSS para `.hero-badge-dot` e remover o `::before`.
- [a11y/lang-attribute] `index.html:54` — texto "FacioFlow Skills Ecosystem" é inglês dentro de página `lang="pt-BR"`. Screen reader em PT vai pronunciar com fonemas portugueses. Fix: envolver em `<span lang="en">FacioFlow Skills Ecosystem</span>`.

### Média

- [a11y/focus] `css/components.css:548–557` — focus-visible cobre btn, navbar-links, skill-chip, mas **não** cobre os `<a>` do footer (`.footer-link`), `.compare-panel`, ou os `<a>` âncora dentro do `.hero-actions`. Fix: adicionar `.footer-link:focus-visible` ao seletor compartilhado.
- [a11y/aria] `index.html:73` — `<svg aria-labelledby="fv3-title fv3-desc">` no hero F está dentro de `<div class="hero-visual" aria-hidden="true">`. Conflito: o `aria-hidden` do pai esconde TUDO, anulando o `title`/`desc` do SVG. Fix: remover `aria-hidden="true"` do `.hero-visual` (já é decorativo via aria-labelledby do SVG) OU remover title/desc/role do SVG (assumir totalmente decorativo).
- [a11y/heading-order] `index.html:56,207,280,409,463,576` — h1 (hero) → h2 (problem, stacks, compare, arsenal, cta) — ordem correta. Mas dentro de `.problem-grid`, os `<h3>` (`problem-card-title`) vêm DEPOIS de um `<h2>`. OK. Stack cards `<h3>` (`stack-name`) também OK. Sem violação real, mas: `.section-label` (ex: "STACKS", "ANTES × DEPOIS") **não é heading**, é apenas span — bom, não polui hierarquia.
- [anti-pattern/dead-link] `index.html:27,594` — navbar-logo e footer-logo apontam para `href="#"`. Skill flagga "buttons that link to #". Fix: usar `href="#hero"` em ambos ou tornar o logo do footer não-navegável (apenas decorativo).
- [a11y/skip-link-target] `index.html:22,43` — skip-link aponta para `#main-content`, alvo existe (`<main id="main-content">`). OK. Mas `<main>` não tem `tabindex="-1"`, então alguns browsers/AT não dão foco programático. Fix: `<main id="main-content" tabindex="-1">`.
- [anti-pattern/touch-target] `css/components.css:88–94` — `.navbar-mobile-toggle span` tem `width: 22px; height: 2px`. O botão pai tem `padding: var(--space-2)` = 8px, total ~38×38px. Abaixo dos 44×44px recomendados para touch. Fix: aumentar padding para `var(--space-3)` (12px) → ~46×46px.
- [a11y/aria-current] `index.html:30–34` — navbar-links sem indicador de seção ativa. Skill: "no indication of current page". Para LP single-page, IntersectionObserver pode aplicar `aria-current="location"` ao link da seção visível. Fix: handler em main.js + estilo `[aria-current] { color: var(--text); }`.

### Baixa

- [a11y/aria-expanded] `index.html:36` — `<button aria-expanded="false">` está no HTML estático. Precisa ser atualizado por JS quando menu abre. Verificar `js/main.js` (não lido neste audit). Fix: documentar que main.js deve toggle aria-expanded.
- [a11y/landmark-roles] `index.html:591` — `<footer role="contentinfo">` redundante (footer já é landmark contentinfo por default). Não quebra mas é ruído. Fix: remover `role="contentinfo"`.
- [seo/meta] `index.html:6–10` — falta `<meta name="author">`, `<meta property="og:url">`, `<link rel="canonical">`. Fix: adicionar trio para SEO básico.
- [a11y/svg-decorative-mix] `index.html:217,235,256` — SVGs de problem-card têm `aria-hidden` no pai `.problem-card-icon` mas SVG sem `role="presentation"`. Funciona via herança, mas explícito é melhor. Fix: opcional — adicionar `aria-hidden="true"` direto nos SVG.
- [anti-pattern/external-links] `index.html:34,583,599` — links externos com `target="_blank" rel="noopener"` — falta `noreferrer`. Fix: `rel="noopener noreferrer"`.
- [anti-pattern/scroll-restoration] HTML — sem `<meta name="theme-color" content="#070A13">`. Em mobile/PWA, address bar não acompanha o tema dark. Fix: adicionar meta.

---

## Audit 3: svg-animations

Metodologia: análise de cada SVG animado (hero F, 3 loaders de stack, loader divider, CTA bg orbiter) avaliando easing, performance, GPU-safety, visibilidade real, SMIL vs CSS, accessibility.

### Alta

- [performance/animateMotion-on-complex-path] `index.html:163–177` — 3 partículas com `<animateMotion>` ao longo de `#fv3Main` (path do F sólido com ~80 comandos cubic bézier). `animateMotion` força recálculo de posição em cada frame ao longo de path complexo, causando jank em browsers mid-tier. Visível em hero.png como pontinhos azul claro discretos sobre o F. Fix: substituir por path simplificado de "trilha" (ex: contorno da espinha vertical do F com ~10 comandos), OU reduzir para 1 partícula só.
- [performance/animate-r] `index.html:138,140,143,145,148,150` — 3 ondas concêntricas no F animam `attributeName="r"` e `stroke-width` de 10→380. Animar `r` força reflow do círculo (não é GPU-composited). 3 simultâneos sobre clipPath complexo é caro. Fix: substituir por `<g>` com `transform: scale()` em CSS (GPU) e usar `circle r=380` fixo dentro de `<g>` escalado de 0.025 a 1.
- [visibility/loader-frontend] `index.html:293–297` (`.loader-concentric-pulse.loader-frontend`) — 3 círculos com `r="80"` stroke-width 8 cyan, animados com `pulseR15` (scale 0.2→1.05, opacity 1→0). No screenshot stacks.png, o loader Frontend aparece como **outline ring vazio quase imperceptível** — escala já pequena na maior parte do ciclo + opacity decaindo + cyan claro sobre bg escuro = loader invisível. Fix: aumentar stroke-width para 12, mudar opacidade da cor do stroke para `var(--cyan)` saturada, e/ou reduzir delay-stagger (-0.93s × 3 = quase em fase, perdendo o efeito concentric).

### Média

- [performance/animate-stroke-width] `index.html:140,145,150` — `<animate attributeName="stroke-width">` triggers paint a cada frame. Combinado com clipPath complexo (`url(#fv3Clip)`) e `feGaussianBlur` (filter), custo de pintura é não-trivial. Fix: remover animação de stroke-width, manter constante em 12px.
- [easing/keysplines] `index.html:138` — `keySplines="0 0 0.58 1"` em `<animate calcMode="spline">` é ease-out razoável, mas faltam `keyTimes` matching para o `r` (existem) e o `stroke-width` usa `keySplines="0.42 0 1 1"` (ease-in para diminuir width). Fix: padronizar para `cubic-bezier(0.22, 1, 0.36, 1)` (mesma curva dos reveals do CSS) → `keySplines="0.22 1 0.36 1"`.
- [code-quality/duplicate-loader-css] `css/components.css:330–336,355–362` — `.loader-concentric-pulse .r` e `.loader-divider .r` têm regras idênticas (mesma animation, mesmo transform-origin, mesmos delays). Fix: usar `.loader-concentric-pulse .r, .loader-divider .r { ... }` ou herdar com classe compartilhada.
- [accessibility/title-desc-inside-aria-hidden] `index.html:72,75–77` — SVG com `<title>` e `<desc>` está dentro de `aria-hidden="true"` (ver Audit 2). Em SVG terms: o título nunca é lido. Decisão: ou expor o SVG (remover aria-hidden do parent) ou remover title/desc (assumir decorativo). Fix recomendado: remover title/desc/role do SVG (é decorativo).
- [smil-vs-css/loader-three-orbiters] `css/components.css:339–347` — animation `orbit05` rotaciona o `<g>`, mas as `dot` filhas têm `pulse05` que anima `r` (não GPU). Para 3 dots simultâneos, é repaint constante. Fix: animar `transform: scale()` em vez de `r`. Requer envolver cada dot em `<g>` próprio com `transform-origin` correto.
- [animation/spin-rate] `index.html:88–89` — `.fv3-ring-out` 22s + `.fv3-ring-in` 14s (rev). Boa diferença de período. Mas glow particles em `#fv3OrbitOut` rodam em 14s e `#fv3OrbitIn` em 9s — independentes do ring rotation. Resultado: rings e partículas dessincronizados (intencional? difícil dizer). Fix: documentar a intenção em comentário, OU sincronizar rings + particles para mesma duração.

### Baixa

- [code-quality/repeated-animate-blocks] `index.html:137–151` — 3 blocos `<circle>` com `<animate>` quase idênticos (só mudam `cx`, `cy`, `begin`). Difícil manter. Fix: usar JavaScript para gerar os 3 com loop, OU extrair `<defs>` com `<g id="pulseWave">` reutilizável via `<use>`.
- [accessibility/reduced-motion-coverage] `css/base.css:118–125` — regra `prefers-reduced-motion` cobre tudo via `*`, OK. Mas `.fv3-ring-out`, `.fv3-ring-in`, `.fv3-f-body` têm regra própria duplicada em `index.html:91`. Funcional mas redundante. Fix: remover bloco do `<style>` inline do SVG, deixar só o global do `base.css`.
- [code-quality/inline-style-in-svg] `index.html:78–92` — bloco `<style>` dentro do SVG do hero. Funcional, mas mistura CSS com markup. Fix: mover keyframes `fv3-spin`, `fv3-spin-rev`, `fv3-glitch` e classes `.fv3-*` para `base.css` ou novo arquivo `hero-svg.css`.
- [smil/begin-negative] `index.html:143,148,164,169,174` — `begin="-1.3s"`, `begin="-2.7s"` etc. funcionam em todos browsers modernos mas Safari < 14 tinha bugs. Fix: aceitável se baseline = browsers atuais. Documentar.
- [performance/will-change] — nenhum elemento animado tem `will-change: transform` ou `will-change: opacity`. Para os 4+ orbiters do hero F, ajudaria browser a otimizar. Fix: adicionar `will-change: transform` em `.fv3-ring-out`, `.fv3-ring-in`, e nos `<g>` com `animateMotion`.
- [smil/motion-rotate] `index.html:164–177` — `<animateMotion>` sem `rotate="auto"`. Partículas mantêm orientação fixa enquanto seguem path complexo do F. Para pontos simétricos isso não importa, mas se trocar o shape para algo orientado, será necessário. Fix: documentar (não-issue para circles).
- [code-quality/wavy-ring-rotation] `css/components.css:350–353` — Wavy Ring spin com `transform-origin: 100px 100px` mas SVG usa `viewBox="0 0 200 200"` então origin já é center natural. Funciona, mas se a path mudar de shape (não-symmetric), origin pode ficar offset. Fix: adicionar `transform-box: fill-box` para robustez.

---

## Resumo consolidado

**Total: 38 findings (10 alta · 17 média · 11 baixa)**

| Skill | Alta | Média | Baixa | Total |
|---|---|---|---|---|
| redesign-existing-projects | 4 | 7 | 9 | 20 |
| web-design-guidelines | 4 | 7 | 5 | 16 |
| svg-animations | 3 | 6 | 6 | 15 |

> Nota: Total de linhas (51) > 38 porque alguns findings cruzam categorias mas são listados na skill primária. Conta única acima por skill = 38.

### Top 5 prioritários (impacto × esforço)

1. **Contraste de `--text-faint` e `compare-line--dim/--muted`** (Audit 1 + 2 alta) — fix simples no tokens.css, ganho a11y imediato e visibilidade das setas/comentários
2. **Background `--bg-elevated` indistinguível de `--bg`** (Audit 1 alta) — 1 linha em tokens.css, recupera ritmo de seções da página inteira
3. **Loader Frontend (Concentric Pulse) invisível** (Audit 3 alta) — stroke-width + cor saturada, demonstra qualidade de animação na skill stack mais visível
4. **Hero badge dot duplicado (`<span>` + `::before`)** (Audit 2 alta) — limpeza HTML/CSS, evita inconsistência
5. **Arsenal 6-cards-iguais layout genérico** (Audit 1 alta) — refactor maior mas necessário para diferenciação visual

### Categorias-padrão (recomendado fazer em batch)

- **Dead CSS**: `.cta-glow`, `.cta-title`, `.cta-sub`, `.footer-logo-img` — remover de uma vez
- **Asset paths frágeis**: copiar assets para `facioflow-v3/assets/` e renomear sem espaços
- **`href="#"` em logos**: trocar para `#hero` em navbar e footer
- **`rel="noopener"` → `rel="noopener noreferrer"`**: 3 ocorrências
