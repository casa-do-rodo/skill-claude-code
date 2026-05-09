# Spec: FacioFlow Skills LP v2

**Data:** 2026-05-09
**Objetivo:** Landing page v2 do ecossistema de skills do Claude Code — mesma premissa da `skills-landing`, brand FacioFlow, mais conteúdo (38+ skills, ui-subagent, audit-gate).

---

## Contexto

Quinta demo do projeto. Evolução direta da `skills-landing` (v1 com 6 seções, 22 skills). Esta versão usa a brand FacioFlow completa, incorpora as capacidades custom construídas nas últimas sessões (ui-subagent Opus 4.7, frontend-audit-gate) e apresenta o pipeline completo com decision tree visual. Público: devs como Angelo vendo o repositório no GitHub.

---

## Conceito

**Mesma jornada de transformação da v1** — visitante sente o impacto antes de entender a mecânica. Porém com narrativa mais madura: o pipeline é um decision tree real, não um fluxo linear simplificado.

- **Tema:** Claude Code / skills ecosystem
- **Tom:** direto, bold, orientado a resultado + aspiracional
- **Idioma:** Português
- **Abordagem:** Narrative-first — cada seção tem propósito claro, sem seções fracas

---

## Estrutura — 6 Seções

### 1. Hero

- **Headline:** "Skills. Subagentes. Pipeline."
- **Subtítulo:** "38+ skills transformam o Claude Code num pipeline de engenharia estruturado. Cada decisão tem um processo. Cada sessão tem memória."
- **Badge:** `Claude Code · Skills Ecosystem`
- **Stat:** `38+ skills instaladas`
- **CTA primário:** "Ver o Pipeline →" (ancora para seção 3)
- **Visual:** F animado da FacioFlow (direção A+B — ver seção SVG abaixo), tamanho maior que v1

### 2. O Problema

- **Título:** "AI sem estrutura não escala."
- 3 cards com ícones SVG stroke-based:
  - **Output genérico** — respostas sem contexto do projeto
  - **Sem processo** — cada sessão recomeça do zero
  - **Sem memória** — conhecimento do projeto se perde

### 3. O Pipeline

- **Título:** "Conheça o pipeline"
- Decision tree visual com dois ramos:
  - Fork: "LP / Componente" → `frontend-design` → build iterativo
  - Fork: "App / Dashboard" → `frontend-design` → `writing-plans` → `subagent-driven-development` (com sub-nós: UI tasks → `ui-subagent` Opus 4.7 / logic → subagente genérico)
  - Convergência obrigatória: `frontend-audit-gate` → aplicação dos fixes → `finishing-a-development-branch`
- Nós em destaque (border azul + cor cyan): `using-superpowers`, `frontend-audit-gate`, `ui-subagent`
- Badge "Opus 4.7" no nó `ui-subagent`
- Diamante de decisão "Que tipo de projeto?" como fork central

### 4. Custom Capabilities

- **Título:** "Além das skills — capacidades custom"
- 2 feature cards lado a lado:

| ui-subagent | frontend-audit-gate |
|---|---|
| Modelo Opus 4.7 fixo | Gate obrigatório antes do ship |
| Skills visuais pré-carregadas | Orquestra 3 audits em paralelo |
| Exclusivo para tasks de UI | Classifica findings por prioridade |
| Badge: "Opus 4.7" | Badge: "67s · 6 subagentes paralelos" |

### 5. O Arsenal

- **Título:** "Skills instaladas"
- Grid de tags agrupado por 6 categorias:

| Categoria | Skills |
|---|---|
| Pipeline | brainstorming, frontend-design, writing-plans, executing-plans, subagent-driven-development |
| Qualidade | tdd, systematic-debugging, requesting-code-review, receiving-code-review, verification-before-completion |
| Frontend Design | design-taste-frontend, svg-animations, web-design-guidelines, redesign-existing-projects, full-output-enforcement |
| Supabase | supabase, supabase-postgres-best-practices, supabase-schema-testing |
| n8n | n8n-workflow-patterns, n8n-mcp-tools-expert, n8n-node-configuration, n8n-validation-expert, n8n-expression-syntax, n8n-code-javascript, n8n-workflow-testing |
| Git | finishing-a-development-branch, using-git-worktrees |

### 6. CTA Final

- **Frase:** "Pronto pra elevar seu AI dev?"
- Botão primário: "Ver no GitHub →"
- Botão secundário: "Explorar Skills"

---

## Hero SVG — Direção de Animação

**Combinação A+B ("Circuit + Pulse"):**
- Base: F sólido `rgba(125,180,255,0.75)`
- Do A (Circuit Trace): partículas percorrendo o contorno do F via `<animateMotion>` + stroke-dashoffset animado (efeito circuito sendo desenhado)
- Do B (Pulse Core): 3 ondas pulsantes emergindo de dentro do F, clipped ao shape
- Anéis orbitais (outer 22s horário, inner 14s anti-horário)
- Scan line horizontal varrendo dentro do F (clipped)
- Glitch: translateX intermitente a cada ~5s
- **Tamanho:** maior que v1 — usar o espaço disponível no hero (360px+)
- **Base:** `icone_branco 1-1.svg` (viewBox `0 0 2048 2048`), não o animated SVG

---

## Design System

Idêntico à `skills-landing` (mesma brand):

```css
--bg:       #070A13   /* dark navy profundo */
--accent:   #2463EB   /* azul elétrico */
--text:     #FFFFFF
--muted:    #8B949E
--surface:  #0D1220
--border:   #1A2235
--cyan:     #9DDBFF   /* highlight / partículas SVG */
```

- **Tomorrow** (Google Fonts) — títulos, labels, botões (700, 900)
- **Inter** (Google Fonts) — corpo, subtítulos (400, 500)
- Ícones SVG inline, stroke-based, `stroke-width: 1.5`
- Animações: entrada escalonada por seção (`translateY` + `opacity`)

---

## Arquitetura de Arquivos

Nova pasta `facioflow-skills-landing/`:

```
facioflow-skills-landing/
  index.html
  css/
    tokens.css
    base.css
    components.css
    sections.css
  js/
    main.js
```

- Vanilla HTML/CSS/JS, sem build step
- Reaproveita estrutura de arquivos da `skills-landing` como referência

---

## Decisões de Design (travadas)

- Sempre dark, sem toggle de tema
- Tomorrow + Inter como par tipográfico fixo
- `#2463EB` como único acento primário, `#9DDBFF` como cyan de apoio
- Ícones SVG stroke-based — nunca emojis
- Hero SVG usa `icone_branco 1-1.svg` como base (cru, sem animações pré-embutidas)
- Pipeline = decision tree visual, não fluxo linear
