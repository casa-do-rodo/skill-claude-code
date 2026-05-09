# Audit: facioflow-agency

**Data:** 2026-05-09
**Método:** híbrido (código + 8 screenshots) via redesign-existing-projects + web-design-guidelines + svg-animations
**Modelo:** Claude Opus 4.7
**Escopo:** index.html + 4 CSS + main.js
**Audits rodados:** redesign-existing-projects, web-design-guidelines, svg-animations

---

## Alta prioridade

- [web-guidelines] `facioflow-agency/css/tokens.css:15` — `--text-faint: #374151` tem contraste de ~1.7:1 sobre `#080808`. Falha AA para qualquer tamanho de texto. É usado em `.footer-copyright` (10px), `.footer-links span` (separadores) e várias `<rect>`/`<line>` dos SVGs onde já não importa, mas no copyright e separadores torna o texto quase invisível. Fix: substituir os usos de copy real por `--text-muted` (#6B7280, ~5:1) e manter `--text-faint` apenas para elementos puramente decorativos (separadores SVG). O copyright "© 2026 FacioFlow" precisa ler.

- [web-guidelines] `facioflow-agency/index.html:344-345` — `.security-badge` usa `color: var(--accent)` (#2463EB) sobre fundo `var(--bg-elevated)` (#141414). Contraste do azul puro sobre cinza escuro fica em ~3.4:1. Para badges com texto 11px (small) isso falha AA (precisa 4.5:1). Fix: clarear o accent quando usado como texto sobre dark, ou aumentar peso do contraste — um `--accent-text: #4F84F0` para textos pequenos resolve sem mexer no accent canônico.

- [redesign] `facioflow-agency/index.html:11` — favicon aponta para `../assets/icone_branco 1-1.svg`. O path relativo com espaço e numeração suja pode quebrar em alguns hostings (Vercel/Netlify aceitam, mas o `1-1` no nome sugere asset duplicado mal organizado). Fix: copiar o asset para `facioflow-agency/assets/favicon.svg` e referenciar localmente — tira a dependência do path `../assets/`. A LP fica self-contained.

- [redesign] `facioflow-agency/index.html:28,371` — logos da nav e footer também referenciam `../assets/logo_branco 1-1.svg`. Mesmo problema do favicon: a LP depende de pasta irmã. Fix: mover assets pra dentro de `facioflow-agency/assets/` e atualizar paths.

- [web-guidelines] `facioflow-agency/index.html:340,357` — `style="margin-left: auto; margin-right: auto;"` inline em `.accent-line` dentro de security e cta-final. Inline styles violam separação de concerns e pioram manutenção. Fix: criar modifier `.accent-line--center` em base.css com as duas margins automáticas e usar a classe.

---

## Média prioridade

- [redesign] `facioflow-agency/css/components.css:148` — comentário `/* Tom mais escuro do accent pra hover — não há token */` sinaliza dívida técnica: `#1d4fd8` é hardcoded. Fix: criar `--accent-hover: #1D4FD8` em tokens.css e usar a variável. Mantém o pattern de tokens consistente.

- [redesign] `facioflow-agency/css/components.css:155-156` — `.btn-primary:active` só zera o `translateY` mas não o `box-shadow`. Resultado: o glow continua visível enquanto o botão "afunda". Fix: adicionar `box-shadow: 0 2px 12px var(--accent-glow);` ao `:active` para reduzir o halo no clique e manter coerência com a profundidade simulada.

- [redesign] `facioflow-agency/css/components.css:236-237` — `.process-connector` é uma linha 1px x 32px de cor `--border` (rgba(255,255,255,0.08)) entre os steps. No screenshot `process.png` ela é praticamente invisível, e no mobile (sections.css:93-97) vira 1px x 24px vertical, ainda menos visível. Fix: aumentar opacidade pra `rgba(255,255,255,0.16)` ou trocar pra `--accent` em opacidade 0.4 pra reforçar o fluxo entre etapas — sem isso os 5 cards parecem soltos.

- [redesign] `facioflow-agency/css/components.css:268-283` — `.benefit-card` e `.benefit-card--featured` usam o mesmo `border-radius: var(--radius-md)` (12px). O featured vira só um card maior, não diferenciado. Fix: dar `--radius-lg` (16px) ao featured, e/ou aumentar contraste do `--bg-surface` (atual #1C1C1C vs #141414 do regular) — a diferença visual é sutil demais no screenshot `benefits.png`.

- [redesign] `facioflow-agency/index.html:308` — `.benefit-card--featured` tem 540 caracteres de descrição enquanto os outros benefits têm ~120-140. A diferença de altura é grande mas sem ser intencional graficamente — fica desbalanceada. Fix: encurtar para ~250 chars OU adicionar uma assinatura visual no featured (número grande "01" no canto, ou metric tipo "3x menos retrabalho") pra justificar o tamanho.

- [redesign] `facioflow-agency/css/sections.css:104-108` — `.benefits-grid` é 3 colunas iguais com `gap: var(--space-4)` (16px). No screenshot `benefits.png` os cards ficam apertados, sem respiro. Fix: aumentar gap para `var(--space-5)` (20px) ou `var(--space-6)` (24px) — densidade atual lembra dashboard, não LP.

- [web-guidelines] `facioflow-agency/index.html:202` — `<text>` SVG escreve "CONVERSAO" sem til. Fix: trocar para "CONVERSÃO" — o caractere especial funciona em SVG inline desde que o `<meta charset="UTF-8">` esteja no head (e está, linha 4). Sem o til, parece bug de encoding.

- [redesign] `facioflow-agency/css/components.css:200-208` — `.service-title` tem clamp(20px, 2.5vw, 28px). No desktop dá 28px. Comparado com `.section-title` (44px) e `.hero-headline` (88px) a hierarquia tipográfica fica pulada — h2 da seção é 60% maior que h3 dos serviços. Fix: subir `.service-title` para clamp(22px, 3vw, 32px) — a leitura ganha peso sem competir com o título da seção.

- [svg] `facioflow-agency/index.html:111-251` — os 4 SVGs dos serviços são wireframes estáticos. Para a estética editorial estática faz sentido, mas hover no `.service-visual` poderia revelar uma microanimação (path drawing de 1.2s no conector do workflow, fade-in da check no chat, bar growth no dashboard, cursor blink no code) — só no hover, sem motion na entrada. Fix: adicionar `animation` keyframes triggadas por `:hover` no container, respeitando `prefers-reduced-motion`. Mantém a página silenciosa em scroll mas adiciona vida na exploração ativa.

- [web-guidelines] `facioflow-agency/index.html:111` — `<svg ... role="img">` mas sem `<title>` interno descrevendo o que a ilustração mostra. Como `aria-hidden="true"` está no `.service-visual` pai (linha 110), o screen reader pula tudo, então `role="img"` está redundante. Fix: ou remover o `role="img"` (já que o pai está oculto) ou tirar `aria-hidden` do pai e adicionar `<title>` em cada SVG ("Diagrama de workflow com nós conectados"). Decidir qual estratégia — mas não ter as duas.

- [redesign] `facioflow-agency/index.html:289` — process step 5 usa `process-step--accent` com `background: var(--accent-dim)`. No screenshot `process.png` o card 05 fica visivelmente diferenciado — bom. Mas o `border-color: var(--border-accent)` (rgba(36,99,235,0.3)) sobre o fundo já azulado fica tênue. Fix: usar `border-color: var(--accent)` direto (sem a opacidade) no `--accent`, dando moldura crisp no destaque final.

---

## Baixa prioridade

- [redesign] `facioflow-agency/css/base.css:48` — `section { padding: var(--space-24) 0; }` (96px top/bottom). Para LP editorial, o padrão estético sugere padding bottom levemente maior que o top (ajuste óptico). Fix: usar `padding: 96px 0 112px` para criar respiro entre seções — é detalhe sutil mas alinha com o checklist da skill (Symmetrical vertical padding).

- [redesign] `facioflow-agency/css/components.css:74-83` — `.btn-nav` tem padding `7px 16px` enquanto `.btn` tem `14px 28px`. Diferença é proposital (botão de nav é menor) mas a mistura de unidades (px direto vs `var(--space-*)`) quebra consistência. Fix: padronizar para `var(--space-2) var(--space-4)` (8px 16px) — perde 1px de altura, ganha rigor de design system.

- [redesign] `facioflow-agency/index.html:201` — letter-spacing da label "CONVERSAO" no SVG é `letter-spacing="1"` em px, sem unidade. Em SVG `<text>` letter-spacing é interpretado como user-units (igual ao viewBox), funciona mas não é semântico. Fix: trocar para `letter-spacing="1px"` ou usar `0.1em` para escalar com o font-size.

- [redesign] `facioflow-agency/css/components.css:267-273` — `.benefit-card` tem `transition: border-color var(--trans);` no hover. Falta o `transform: translateY(-2px)` ou similar — hover atual só muda a cor da borda, sem feedback de profundidade. Fix: adicionar `transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4);` no `:hover` e `transition: all var(--trans);`.

- [redesign] `facioflow-agency/index.html:34` — link "Fale conosco" no nav tem classe `.btn-nav` mas o texto continua minúsculo (10px conforme `.navbar-links a`). O CSS de `.btn-nav` adiciona border + padding mas não muda font-size. Fix: bumpar para `font-size: 11px` no `.btn-nav` para dar peso de CTA, alinhado com `.btn` que é 11px.

- [redesign] `facioflow-agency/css/components.css:221` — `.process-step` em mobile (sections.css:88-97) entra em coluna mas mantém border-radius `--radius-md`. Cards verticais empilhados ficam parecendo lista de tarefas, não timeline. Fix: no mobile, reduzir border-radius para `--radius-sm` ou tirar de cima/baixo dos cards intermediários para parecer continuum vertical.

- [web-guidelines] `facioflow-agency/index.html:382` — copyright "© 2026 FacioFlow" — ano está correto pra LP nova mas o footer não tem links legais reais (só Privacidade que aponta pro domínio externo). Sem Termos de Uso ou Contato direto. Fix: adicionar pelo menos `Termos` e `Contato` (mailto ou link) ao footer-links.

- [web-guidelines] `facioflow-agency/js/main.js:1-4` — `window.addEventListener('scroll', ..., { passive: true })` é OK mas o handler chama `classList.toggle` em todo scroll. Fix: usar requestAnimationFrame throttle ou IntersectionObserver no top da página para detectar `scrollY > 20`. Performance ganha em mobile lento. Não-crítico.

- [svg] `facioflow-agency/css/base.css:23-26` — grain SVG via feTurbulence com `baseFrequency='0.65'`, `opacity: 0.04`, `mix-blend-mode: overlay`. Está bem dimensionado e sutil. Único caveat: `numOctaves='3'` é caro pra renderizar — o browser cacheia o data-url, mas em mobile low-end pode causar paint inicial lento. Fix opcional: pre-gerar PNG estático do grain (256x256) e importar como `background-image: url('grain.png')` — perde flexibilidade de custom render mas ganha 30-50ms no first paint. Apenas considerar se métricas mostrarem regressão.

- [svg] `facioflow-agency/index.html:248-250` — cursor do code editor é um `<rect>` estático. A skill svg-animations tem o pattern de "Cursor blink" (animar `opacity` com `<animate>` SMIL ou CSS). Adicionar o blink (1s, infinite) custaria ~5 linhas e daria vida ao SVG sem competir com o resto. Não-crítico já que a estética é estática, mas é a única microanimação que se justifica no contexto.

- [redesign] `facioflow-agency/index.html:382` — `<span class="footer-copyright">© 2026 FacioFlow</span>`. Date de hoje é 2026-05-09, então 2026 está correto, mas se a LP ficar no ar até 2027 o copyright trava. Fix: em LP estática, adicionar `<script>` 1-liner que injete o ano via JS, ou usar `[data-year]` com CSS-only `attr()` quando suportado. Não bloqueia merge mas evita stale copyright.

---

## Resumo

**Total: 23 findings (5 alta, 12 média, 6 baixa)**

**Por skill:**
- redesign-existing-projects: 14
- web-design-guidelines: 6
- svg-animations: 3

### Quick wins

1. **Fix `--text-faint` no copyright/separadores** (`tokens.css:15` ou trocar usos): contraste WCAG falhando, leitura travada — 5 min, alto impacto a11y.
2. **Mover assets pra dentro de `facioflow-agency/assets/`** (paths em `index.html:11,28,371`): elimina fragilidade do `../assets/` — 10 min, LP vira self-contained.
3. **Aumentar contraste do `.process-connector`** (`components.css:243`): linha entre steps quase invisível torna o fluxo "5 cards soltos" — 1 linha de CSS, ganho visual imediato no screenshot `process.png`.

### Concerns

- **Sem concerns críticos** que bloqueiem merge. As 5 issues de alta prioridade são fixáveis em ~30 min total.
- **A estética editorial está bem mantida** — o audit confirmou que decisões intencionais (grain sutil, headline sem animação, italic accent no `<em>`) funcionam. Os findings reforçam o que já está bem, polindo arestas.
- **Hierarquia tipográfica** (finding média sobre `.service-title`): vale revisitar antes do merge se o time quiser que os serviços ganhem mais peso visual. Pode ser considerado design choice.
- **SVG animations**: respeitada a decisão de página silenciosa. Único hover-state proposto (microanimação no `.service-visual`) é opcional e cabe em iteração futura.
