# Audit: facioflow-dashboard

**Data:** 2026-05-09
**Método:** híbrido (código + 4 screenshots) via redesign-existing-projects + web-design-guidelines + svg-animations
**Modelo:** Claude Opus 4.7
**Audits rodados:** redesign-existing-projects, web-design-guidelines, svg-animations
**Screenshots cruzados:** overview.png, projetos.png, projetos-imbil.png, clientes.png

Decisões intencionais excluídas do audit (não flagadas): Editorial Dark `#080808`/`#2463EB`/Tomorrow+Inter, `dynamic = "force-dynamic"`, custom SVG charts sem libs, multi-route com sidebar+topbar, single-fire IntersectionObserver, `as unknown as` casts em nested Supabase queries.

---

## Alta prioridade

- **[web-guidelines] components/layout/sidebar.tsx:108-113 — `<img>` em vez de `next/image` + alt vazio mas role aria-hidden incorreto**
  O logo da sidebar usa `<img src="/icone-branco.svg" alt="" aria-hidden>`. Em Next.js o pattern é `next/image`. Mais grave: o `aria-hidden` somado ao texto irmão `<span>FacioFlow</span>` está OK só porque o wordmark tem o nome completo. Quando a sidebar colapsa (data-collapsed=true), o wordmark vira `opacity:0; pointer-events:none` mas continua no DOM, então screen readers ainda leem "FacioFlow". OK funcionalmente, mas o `pointer-events:none` não esconde de AT — use `visibility:hidden` ou `aria-hidden` dinâmico no wordmark colapsado.
  **Fix:** alternar `aria-hidden` no wordmark quando `collapsed=true`, e/ou usar `next/image` com width/height fixos pra logo.

- **[web-guidelines] components/layout/sidebar.tsx:144-150 — backdrop sem `role="button"` mas com `onClick`**
  O `<div className={styles.backdrop} onClick={() => setMobileOpen(false)} aria-hidden="true">` recebe clique mas não tem keyboard handler nem role. Usuário de teclado não consegue fechar o drawer clicando fora. Como já existe um botão hamburger acessível, o impacto é menor, mas a interação click-outside não é alcançável via teclado.
  **Fix:** adicionar `Escape` keydown listener pra fechar mobile drawer (alinha com pattern de modal/dialog). Backdrop pode permanecer `aria-hidden`.

- **[web-guidelines] components/layout/sidebar.tsx:101-106 — sidebar não é navegação landmark consistente**
  `<aside aria-label="Navegação principal">` — semanticamente, navegação principal pede `<nav>` como landmark, não `<aside>` (aside é conteúdo tangencial). O `<nav>` interno (linha 117) é o landmark correto, mas estar dentro de `<aside>` faz dupla landmark. Screen readers leem ambos.
  **Fix:** trocar `<aside>` por `<nav aria-label="Navegação principal">` e remover o `<nav>` interno (deixar só os Links). Ou manter `<aside>` mas sem `aria-label` (deixa o `<nav>` interno ser o único landmark).

- **[web-guidelines] components/layout/topbar.tsx:91-100 + components/layout/sidebar.tsx — botões interativos sem `:focus-visible` ring custom**
  Hamburger, sync button, toggle (sidebar collapse) só têm `:hover` definido. Nenhum `:focus-visible` explícito. Os `<button>` herdam o outline default do navegador, que num bg `#141414` com elementos azuis fica fraco. CSS de `cardLink:focus-visible` em projetos/page.module.css:67-69 é o único focus ring custom no projeto.
  **Fix:** adicionar regra global em `styles/base.css`: `*:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }` ou definir `:focus-visible` por componente.

- **[redesign] app/projetos/[spaceId]/page.module.css:197-218 — marker custom usa caractere literal "▸"**
  Triângulo via `content: "▸"` resolve mas é frágil: depende da font fallback ter o glyph (UnicodeBlock Geometric Shapes), e a rotação é aplicada num glyph com baseline tipográfica (fica oticamente offset do label). Resultado é o que se vê na screenshot projetos-imbil.png: o triângulo está visualmente desalinhado com o "Marketing"/"WhatsApp" headers.
  **Fix:** trocar por SVG inline (`<svg viewBox="0 0 12 12"><path d="M3 2l6 4-6 4z"/></svg>`) com `transform-origin: center` pra rotação limpa, ou usar pseudo `::before` com `border` triangle (pure CSS, sem font dependency).

- **[redesign] components/layout/topbar.tsx:29-39 + app/page.tsx:219-228 — duplicação de `formatRelativeTime` / `humanizeRelativeTime`**
  Duas funções fazem a mesma coisa com formatos ligeiramente diferentes:
  - `formatRelativeTime` (topbar): `"há 4 h"` (com espaço)
  - `humanizeRelativeTime` (overview): `"há 4h"` (sem espaço)
  Inconsistência visível entre o KPI "Última sync" e o status do topbar. Quebra a regra "consistência beats variety".
  **Fix:** extrair pra `lib/format/relative-time.ts`, escolher uma forma só (recomendo "há 4h" pra alinhar com o resto editorial dark/compacto), atualizar ambos os call sites.

- **[redesign] app/clientes/page.module.css:75-91 + app/projetos/[spaceId]/page.module.css — avatar circular genérico**
  As iniciais "I", "K", "F" das screenshots `projetos.png` e `clientes.png` aparecem em círculos perfeitos, todos azuis. Isso é exatamente o "Avatar circles exclusively" que a skill `redesign-existing-projects` flag como genérico. Soma-se: todos com mesma cor (--accent-dim), só a inicial muda. Internal projects (FacioFlow) ainda usam azul mesmo com badge cyan ao lado — incongruência visual.
  **Fix:** (1) trocar `border-radius: 50%` por `border-radius: var(--radius-md)` (squircle/rounded square); (2) variar bg do avatar conforme `type` (cliente=accent-dim, internal=cyan-dim) pra reforçar a categoria sem precisar do badge.

- **[svg-animations] components/charts/status-donut.tsx:108-133 — `<g transform="rotate(-90 cx cy)">` sem proteção pra reduce-motion final state**
  O grupo rotacionado funciona, mas o estado inicial dos segments (`stroke-dashoffset: calc((var(--seg-offset) + var(--seg-circumference)) * 1px)`) deixa os segments invisíveis até `.active`. Em `prefers-reduced-motion`, status-donut.module.css:166-168 força `stroke-dashoffset: calc(var(--seg-offset) * 1px)` MAS o donut só ganha `.active` quando inView dispara. Se o usuário com reduced-motion ativa nunca scrolla até o gráfico (rare em desktop, comum em mobile portrait), os segments ficam invisíveis. Idem o `.center` total e legenda — todos têm `opacity: 0` inicial sem fallback fora do `.active`.
  **Fix:** mover o estado final pro estado base e usar `.donut:not(.active)` pra esconder, ou em `@media (prefers-reduced-motion: reduce)` adicionar regra que zera `opacity` e `stroke-dashoffset` independente de `.active`.

- **[svg-animations] components/charts/space-bars.module.css:53-59 — `transform: scaleX(0)` em estado base sem fallback reduce-motion fora de `.active`**
  Mesmo bug do donut: `.fill { transform: scaleX(0); }` é o estado inicial. Em reduced-motion, a regra força `scaleX(1)` (linha 105) — ok. Mas se o user agent não der `inView` (ex: navegação SSR rendered estática sem JS, ou bug do IntersectionObserver), as bars ficam invisíveis. O fallback `if (typeof IntersectionObserver === "undefined") setInView(true)` em use-in-view.ts:23-26 cobre só o caso do hook, mas não cobre JS desativado.
  **Fix:** considerar inverter o pattern: estado base = visível (final), e adicionar classe quando JS hidrata pra "esconder + animar". Alternativamente, adicionar `<noscript>` style override pro estado final.

- **[redesign] styles/base.css:18-27 — `z-index: 9999` arbitrário no grain overlay**
  Arbitrary z-index value flagado pela skill ("Arbitrary z-index values like 9999. Establish a clean z-index scale"). Sidebar usa `z-index: 50`, topbar `40`, backdrop `49` — ou seja, há uma escala (40-50). O grain pula pra `9999`.
  **Fix:** definir tokens em `tokens.css`: `--z-content: 1; --z-dropdown: 30; --z-topbar: 40; --z-sidebar-backdrop: 49; --z-sidebar: 50; --z-overlay: 100; --z-grain: 200;`. Usar tokens nos lugares.

---

## Média prioridade

- **[redesign] app/page.tsx:147-152 — paleta de status mistura `var(--supabase)` (verde) com hex literal `#FBBF24` (amarelo)**
  Quatro status colors: 3 vêm de tokens (`--supabase`, `--accent`, `--cyan`), o quarto é `#FBBF24` literal. Mesmo padrão se repete em `components/task-list.tsx:139` (STATUS_COLORS), `app/projetos/[spaceId]/page.tsx:258` (statusColor), e `components/task-list.tsx:144` (`high: "#FBBF24"`). 4 cópias do mesmo hex.
  **Fix:** criar `--warning: #FBBF24` em tokens.css + `--warning-dim: rgba(251, 191, 36, 0.12)`, atualizar 4 call sites.

- **[redesign] app/projetos/page.module.css:39-41 + app/clientes/page.module.css:39-43 — "three equal card columns as feature row"**
  Skill flag direto: `grid-template-columns: repeat(3, 1fr)` é o layout AI-mais-genérico. Visível nas 2 telas (projetos.png, clientes.png) — três cards do mesmo tamanho lado a lado. Para 3 itens fixos com narrativa hierárquica (cliente1 vs cliente2 vs interno), a proposta da skill é um zig-zag, asymmetric grid ou variação de altura.
  **Fix opcional (visual):** dar largura ligeiramente maior pro card "em desenvolvimento" (Kopenhagen — 93%) com `grid-template-columns: 1fr 1.15fr 1fr` quando o status varia. Ou apenas aumentar gap pra `var(--space-6)` e variar levemente `min-height` dos cards conforme conteúdo (clientes já varia naturalmente, projetos não).

- **[web-guidelines] app/projetos/[spaceId]/page.tsx:175-184 — `<a target="_blank">` sem indicação visual de external link**
  Tasks com URL abrem em nova aba, mas o link não tem ícone external (ex: `↗`) ou diferenciação visual além de hover color. Usuários não sabem que vai abrir nova aba até clicar. Vercel Web Interface Guidelines pede indicação clara.
  **Fix:** adicionar `<svg>` external-link pequeno (8-10px) `aria-hidden` ao lado do task name quando há `t.url`. Mesmo na overview (`components/task-list.tsx:54-61`).

- **[web-guidelines] app/projetos/[spaceId]/page.tsx:162-204 — `<details>` summary sem `aria-expanded`**
  Os `<details>` nativos têm semântica de disclosure, mas screen readers/teclado dependem do summary expor o estado. O HTML5 `<details>` por default já expõe via `aria-expanded` implícito quando o browser tem suporte completo. Em browsers mais antigos ou com `list-style: none + display: flex` o estado pode não ser anunciado. Mais grave: `.listSummary { user-select: none; list-style: none }` + `::-webkit-details-marker { display: none }` remove o disclosure triangle nativo — usuários sem o triangle perdem o cue visual; o triangle custom (`::before { content: "▸" }`) só funciona se a font tiver o glyph.
  **Fix:** garantir que `details > summary` continue tendo `display: list-item` (não foi sobrescrito mas vale verificar) ou explicitar `aria-expanded` no summary. Já flagado o triangle separadamente acima.

- **[svg-animations] components/charts/animated-counter.tsx:24-27 — `prefersReducedMotion()` checado uma vez no mount**
  A função é chamada dentro de `useEffect` com `[inView, value, duration]` deps, então é re-checada quando inView vira true. Tudo OK em prática. MAS se o user mudar a preferência DURANTE a sessão (ex: macOS Reduce Motion toggle no Control Center), o counter já tocou — não há re-mount. É um caso edge mas a skill svg-animations recomenda ouvir `matchMedia` events com `addEventListener('change', ...)`.
  **Fix opcional:** trocar por hook `useReducedMotion()` que escuta `mql.addEventListener('change')` e retorna o estado live.

- **[svg-animations] components/layout/sidebar.tsx:166-200 — paths SVG com múltiplos sub-paths em um `d` único**
  O ícone "overview" usa `d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z"` — 4 retângulos em 1 path. O ícone "clientes" tem 4 sub-paths em 1 path. Funciona, mas: (1) impossível animar individualmente; (2) difícil de manter; (3) o path "clientes" tem espaço entre coordenadas inconsistente (`M16 21v-2a4 4 0 0 0-4-4H6...`) — typo provável, é Lucide-style mas os strokes-cap/join vêm do CSS (linhas 113-117). Mais importante: a skill `redesign-existing-projects` flag "Lucide or Feather icons exclusively" — esses paths são exatamente Lucide.
  **Fix opcional:** trocar pelos Phosphor (`SquaresFour`, `FolderSimple`, `UsersThree`) — diferenciação visual sem muda de tech. Ou separar em múltiplos `<path>` dentro do mesmo SVG pra animatabilidade futura.

- **[redesign] app/clientes/page.tsx:122-122 + components/space-card.tsx:49 — entity name `<h2>` em sentence-case mas badge ALL CAPS**
  Names são "IMBIL", "Kopenhagen", "FacioFlow" (mixed case), badges são "CLIENTE"/"INTERNO" (uppercase forçado pelo CSS via `text-transform: uppercase`). A skill flag "All-caps subheaders everywhere" — aqui os badges ALL CAPS estão em todos os contextos (sidebar não tem mas headers de página têm via `.section-label`, badges de tipo, badges de status, KPI labels). Excesso de UPPERCASE em telas pequenas vira ruído.
  **Fix opcional:** descascar o uppercase de pelo menos 1 nível: por ex, badges de tipo poderiam ser `text-transform: none; font-weight: 500` (sentence case "cliente" / "interno"). Mantém uppercase pros section-labels e KPI labels onde funciona como microtipografia.

- **[redesign] app/page.module.css:49-56 — `chartsGrid` 2fr 1fr quebra rhythm da grade KPI 4-col**
  KPI grid acima é 4-col equal (`repeat(4, 1fr)`). Charts abaixo é 2fr+1fr — não há alinhamento vertical entre as colunas. Visível na screenshot overview.png: a borda direita do donut não alinha com nada. Princípio editorial seria alinhar colunas hierárquicas.
  **Fix opcional:** usar `grid-template-columns: 3fr 1fr` (alinha left edge do donut com o 4º KPI) ou explicitamente compor um grid 4-col onde o left chart spans 3 cols e o right chart 1 col. Skill: "vertical rhythm in side-by-side elements".

- **[web-guidelines] app/clientes/page.tsx:155-163 — progressbar sem texto de valor exposto a AT**
  O `role="progressbar"` tem `aria-valuenow={r.pct}` e `aria-label`, mas o `aria-label` é o pct apenas. Screen reader anuncia "0% completo, progressbar". Falta a descrição (qual progress? do quê?). E o `aria-label` usa template-string pt-BR — OK. Mais subtle: `aria-valuemin={0}` e `aria-valuemax={100}` estão corretos.
  **Fix:** mudar pra `aria-label={\`Progresso de ${r.name}: ${r.pct}%\`}`.

- **[redesign] components/space-card.module.css:31-47 + components/space-card.tsx:41 — avatar com `aria-hidden` mas sem fallback semântico**
  O `<div aria-hidden>` com a inicial é puramente decorativo, OK. MAS o name está num `<h2>` ao lado, e a inicial é redundante. Em telas com muitos cards, screen readers ignoram a inicial (correto), mas usuários sighted veem 3 letras "I K F" — pouco diferenciador semântico. Skill: stock "diverse team" / generic placeholder feel.
  **Fix opcional:** trocar inicial por logo cliente real quando disponível (next/image com fallback graceful pra inicial).

- **[redesign] styles/tokens.css:17 — token `--cyan: #9DDBFF` muito claro pra accent secundário sobre dark bg**
  O cyan é usado em badge "INTERNO", em status "to do", e em "planejamento". `#9DDBFF` é luz (HSL: 200, 100%, 81%) — em bg `#141414`, contraste é alto (~13:1) mas em bg-surface (`#1C1C1C`) com background `var(--cyan-dim)` (12% opacity) o texto pode ficar low-contrast. Ainda dentro de WCAG AA, mas a skill flag "Oversaturated accent colors. Keep saturation below 80%". Esse cyan tem 100% saturação.
  **Fix opcional:** desaturar pra `#A0CCDF` (saturação ~50%) ou alinhar com a paleta dim — manter contraste mas reduzir vibração. Validar contraste sobre `--bg-elevated` e `--bg-surface`.

---

## Baixa prioridade

- **[redesign] app/projetos/page.module.css:13-14 + app/clientes/page.module.css:13-14 + app/page.module.css:7-12 — padding header/section duplicado em 3 pages**
  `.page { padding: var(--space-12) var(--space-8); max-width: 1280px; margin: 0 auto }` aparece literal em 3 arquivos. DRY/consolidação: extrair pra classe utility `.dashboard-page` em `styles/base.css`.

- **[redesign] components/layout/sidebar.module.css:107-117 + topbar.module.css:44-52 — props SVG common via `currentColor` ok mas stroke-width fixo 1.5**
  Todos os ícones usam `stroke-width: 1.5`. A skill flag "Inconsistent stroke widths" como problema, e aqui está consistente (bom). Worth noting que com `width:20px` o 1.5 stroke fica chunky; pode ficar mais elegante com 1.25.

- **[redesign] app/clientes/page.module.css:198-204 — `progressFill` transition mas progress ainda monta sem classe `.active`**
  A transition de width só dispara em re-render (mudança de prop). Server Component nunca re-renderiza no client, então o fill aparece estático no estado final. Animação é dead code aqui (diferente do `<SpaceBars>` que é Client Component).
  **Fix opcional:** ou remover a transition (clean code), ou converter em Client Component com `useInView` se quiser anim on-scroll.

- **[svg-animations] components/charts/status-donut.module.css:39-49 — `stroke-linecap: butt` é default, redundante**
  Linha 128 do TSX seta `strokeLinecap="butt"` explicitamente — `butt` é o default SVG. Worth keeping pra explicitness, mas o comentário do CSS não explica por que (vs round, que arredondaria as pontas dos segments).
  **Fix opcional:** comentar a escolha (`/* butt: linhas retas onde segments se encontram, sem overlap visual */`).

- **[redesign] components/layout/topbar.tsx:107-110 — `title` attr no syncStatus tem ISO bruto**
  `title={lastSyncAt ?? "Nunca sincronizado"}` — passa `2026-05-09T10:34:21.000Z` como tooltip. Para devs é util, pra users finais é ruído.
  **Fix:** formatar pra pt-BR locale: `new Date(lastSyncAt).toLocaleString('pt-BR')` ou remover o title (já tem o "há X min" visível).

- **[redesign] app/page.tsx:160-162 — hardcoded "tasks" / "projetos" em singular/plural mas sem helper**
  Lógica `${count === 1 ? "projeto" : "projetos"}` se repete em 3 pages (clientes:97-99, projetos:117-118, overview:161). Pluralização ad-hoc.
  **Fix opcional:** helper `lib/format/plural-pt.ts` com tabela `{ projeto: ['projeto', 'projetos'], task: ['task', 'tasks'], cliente: ['cliente', 'clientes'] }`.

- **[web-guidelines] app/layout.tsx:17-22 — `<head>` manual com `<link>` tags em vez de `next/font`**
  Tomorrow + Inter via Google Fonts URL em `<link rel="stylesheet">`. Next.js tem `next/font/google` que self-hostam, eliminam render-blocking, e adicionam font-display swap automaticamente. Como cosumir Tomorrow do `next/font` exige verificar disponibilidade no Google Fonts.
  **Fix:** trocar por `import { Tomorrow, Inter } from "next/font/google"` no layout (verificar API atual no Next.js 16 — vide AGENTS.md), exportar variables CSS, atualizar tokens.css.

- **[svg-animations] components/charts/animated-counter.tsx:97-102 — `aria-label` recalcula valor formatado a cada tick**
  `aria-label={\`${prefix}${formatNumber(value, decimals)}${suffix}\`}` chama `formatNumber` em todo render durante o RAF tick. Não impacta perf (calls cheap), mas o `aria-label` muda em cada frame. Screen readers podem se confundir / spam events. A skill svg-animations sugere ARIA estável.
  **Fix:** memoizar `aria-label` via `useMemo([value, prefix, suffix, decimals])` ou apenas setar uma vez no estado final.

- **[redesign] app/page.tsx:147-152 — empty state do StatusDonut é texto italic puro**
  `"Nenhuma task ainda."` em italic + muted color. Skill: "no empty states. Design a composed 'getting started' view." Mesmo no caso bem coberto (raramente vazio), uma ilustração SVG simples ou ícone faria o estado se sentir intencional.
  **Fix opcional:** adicionar SVG inline de "donut vazio" (anel cinza completo sem segments) com texto ao lado.

---

## Resumo

**Total: 28 findings (10 alta, 12 média, 6 baixa)**

**Por skill:**
- redesign-existing-projects: 12 (3 alta, 6 média, 3 baixa)
- web-design-guidelines: 7 (4 alta, 2 média, 1 baixa)
- svg-animations: 9 (3 alta, 2 média, 4 baixa)

### Quick wins (top 3)

1. **Adicionar `:focus-visible` global em `styles/base.css`** — uma regra cobre sidebar nav items, hamburger, sync button, toggle, e todos os botões futuros. Maior ganho de a11y por linha de código.
2. **Consolidar `formatRelativeTime`/`humanizeRelativeTime`** em `lib/format/relative-time.ts` — fixa inconsistência visível entre topbar e KPI, remove duplicação.
3. **Extrair `--warning: #FBBF24` token + `:focus-visible` outline tokens** — 1 commit, 4 call sites atualizados, alinha paleta.

### Concerns

- **Reduced-motion fallback frágil** nos charts SVG: estado base esconde elementos via `transform: scaleX(0)` / `stroke-dashoffset`. Se IntersectionObserver não disparar (JS off, scroll programático, viewport bug), os charts ficam invisíveis em vez de mostrar o estado final. Padrão correto seria base = final state, classe `.animating` esconde temporariamente, ou usar `@starting-style` (Chrome 117+).
- **Avatares circulares idênticos** com mesma cor pra entidades distintas (3 spaces) é o tipo de detalhe que comunica "AI default" mesmo num projeto bem polido. Squircle + cor por type + (idealmente) logo real subiriam o gosto perceptível.
- **Triangle marker via glyph "▸"** depende de font fallback ter o caractere — em sistemas sem geometric shapes (raro mas possível em Linux distro mínima ou print stylesheet), some. SVG inline resolve definitivamente.
- **`<aside>` envolvendo `<nav>`** — landmark duplo. Pequena dor pra usuários AT navegando por landmarks.
- **`force-dynamic` em todas as pages** é decisão consciente (declarada como contexto), MAS topbar.tsx já é Client Component que faz `getSupabaseBrowser()` — então a "última sync" é dupla-fetched (server na overview KPI + client no topbar). Não é bug visual, mas vale revisar se a single source of truth poderia ser passar via prop ou Context.
