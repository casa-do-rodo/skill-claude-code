# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Continuity

At the start of every session, read this file if it exists:
1. `.remember/checkpoint.md` — mid-session state (most recent task context). Read it manually via the Read tool.

Do NOT try to read `.remember/remember.md` — the plugin already injected its content into context via the SessionStart hook and cleared the file. It will be empty if read.

The `.remember/` folder is managed by the `remember:remember` plugin (dpt-plugins). Key files:
- `remember.md` — manual handoff written via `/remember:remember`. Auto-injected at session start then cleared (one-shot).
- `checkpoint.md` — mid-session snapshot written via `/checkpoint`. Read manually; injected by PreCompact hook.
- `now.md` — autonomous Haiku summary of session activity. Auto-injected at session start.
- `today-YYYY-MM-DD.md` — daily compressed activity log. Auto-injected at session start.

## Checkpoint

Invoke the `checkpoint` skill proactively — without waiting to be asked — when:
- 15+ tool calls have happened in this session
- You are about to start a new major subtask
- A complex decision was just made that affects the rest of the work
- The conversation feels long and context-heavy

Run it silently — no need to announce it. Just invoke and continue working.

## Project Purpose

This is a **demo project for the Claude Code skills ecosystem** (superpowers). Its goal is to demonstrate how skills transform the quality and structure of AI-assisted development. Landing pages are the primary demo artifact — the same brief is built with progressively more skills to show the difference.

## Skills Installed

Skills instaladas via marketplaces vivem em `.agents/skills/` (instaladas com `npx skills add <repo> --skill <name>`, tracked in `skills-lock.json`). Skills custom feitas pra este projeto vivem em `.claude/skills/`.

> ⚠️ **Cuidado ao instalar skills**: sempre use `--skill <name>` pra evitar instalar o repo inteiro. Sem o flag, o `npx skills add` baixa todas as skills do repo. Use a skill `find-skills` quando precisar descobrir uma skill nova.

### Pipeline de desenvolvimento

| Skill | Source | Quando ativa |
|---|---|---|
| `using-superpowers` | obra/superpowers | Meta-skill: verifica skills aplicáveis antes de qualquer ação |
| `brainstorming` | obra/superpowers | Antes de qualquer feature — design e spec antes de código |
| `writing-plans` | obra/superpowers | Após brainstorming — plano detalhado com tasks decompostas |
| `executing-plans` | obra/superpowers | Execução inline do plano com checkpoints |
| `subagent-driven-development` | obra/superpowers | Execução via subagentes frescos por task com dual review (recomendado) |
| `frontend-design` | anthropics/skills | Entre brainstorming e writing-plans para projetos visuais |
| `webapp-testing` | anthropics/skills | Captura screenshots via Playwright — integrado ao `frontend-audit-gate` (Step 0 do audit híbrido) |
| `verification-before-completion` | obra/superpowers | Obrigatório antes de qualquer claim de conclusão |
| `remember:remember` | dpt-plugins (plugin) | Handoff de sessão para `.remember/remember.md` |

### Qualidade e debugging

| Skill | Source | Quando ativa |
|---|---|---|
| `systematic-debugging` | obra/superpowers | Ao encontrar qualquer bug — antes de propor qualquer fix |
| `test-driven-development` | obra/superpowers | Ao implementar features ou bugfixes — RED-GREEN-REFACTOR |
| `requesting-code-review` | obra/superpowers | Após tasks, features, antes de merge |
| `receiving-code-review` | obra/superpowers | Ao receber feedback de review — verificar antes de implementar |
| `dispatching-parallel-agents` | obra/superpowers | Quando 2+ problemas independentes podem ser resolvidos em paralelo |

### Git e branches

| Skill | Source | Quando ativa |
|---|---|---|
| `finishing-a-development-branch` | obra/superpowers | Após implementação completa — merge, PR, ou discard |
| `using-git-worktrees` | obra/superpowers | Ao iniciar features que precisam de workspace isolado |

### Criação de skills

| Skill | Source | Quando ativa |
|---|---|---|
| `writing-skills` | obra/superpowers | Ao criar ou editar skills — TDD aplicado à documentação |
| `find-skills` | vercel-labs/skills | Ao precisar descobrir/instalar uma skill nova — evita instalar repos inteiros à toa |

### Frontend Design (specialty)

| Skill | Source | Quando ativa |
|---|---|---|
| `design-taste-frontend` | leonxlnx/taste-skill | Rigor técnico em UI: DESIGN_VARIANCE/MOTION_INTENSITY metrics, anti-slop, GPU-safe motion |
| `svg-animations` | supermemoryai/skills | Qualquer animação SVG: path drawing, motion paths, masks, filters, SMIL, keySplines |
| `svg-animations-pitfalls` | custom | **Sempre junto com `svg-animations`.** Catálogo de bugs comuns: transform-box, animate r não-GPU, animateMotion em paths complexos, IDs colidindo, ARIA conflicts |
| `web-design-guidelines` | vercel-labs/agent-skills | Audit de UI contra Vercel Web Interface Guidelines (a11y, focus, anti-patterns) |
| `redesign-existing-projects` | leonxlnx/taste-skill | Audit de gosto: identifica genericidade AI, propõe upgrades estéticos |
| `full-output-enforcement` | leonxlnx/taste-skill | Anti-truncation: força output completo em tasks longas |
| `vercel-composition-patterns` | vercel-labs/agent-skills | React composition patterns (compound components, render props, contexts) |
| `vercel-react-best-practices` | vercel-labs/agent-skills | Performance React/Next.js: rendering, bundle, data fetching |
| `vercel-react-view-transitions` | vercel-labs/agent-skills | Animações de transição de página/rota com View Transition API |
| `frontend-audit-gate` | custom | **Gate obrigatório** antes de `finishing-a-development-branch`. Step 0 captura screenshots (audit híbrido via `webapp-testing`), orquestra os 3 audits cruzando código + visual, propõe aplicação via `ui-subagent`. Híbrido produz ~2× mais findings que code-only. |
| `interactive-mockups` | custom | Padrão de "service visuals" animados (workflow, chat, dashboard, code). Templates reutilizáveis + IntersectionObserver single-fire. Use quando seção descreve processo dinâmico do produto. |
| `reveal-patterns` | custom | Padrões de reveal on-scroll: `data-delay` (1-3 items) vs CSS stagger via classe (grid 4+) vs animation-fill-mode (mockups complexos). Threshold guidance por contexto. |
| `brand-aware-defaults` | custom | Tabela de cores de marcas conhecidas (n8n, Supabase, GitHub, etc.). Use ao especificar LP/app que mencione serviços terceiros — default à cor de marca real, não accent genérico. |

### Supabase

| Skill | Source | Quando ativa |
|---|---|---|
| `supabase` | supabase/agent-skills | Qualquer task com Supabase: DB, Auth, RLS, Edge Functions, pgvector, CLI |
| `supabase-postgres-best-practices` | supabase/agent-skills | Queries, schema design, otimização Postgres (30 regras) |
| `supabase-schema-testing` | custom (stack) | Antes de aplicar qualquer migration, criar RLS policies ou configurar pgvector. Adapta RED-GREEN-REFACTOR para Supabase. |

### n8n

| Skill | Source | Quando ativa |
|---|---|---|
| `n8n-workflow-testing` | custom (stack) | Antes de ativar qualquer workflow, ao validar AI agents ou debug de outputs. Adapta RED-GREEN-REFACTOR para n8n. |
| `n8n-workflow-patterns` | czlonkowski/n8n-skills | Projetando workflows: AI agents, webhooks, database sync, batch |
| `n8n-mcp-tools-expert` | czlonkowski/n8n-skills | Usando o MCP do n8n — consultar ANTES de qualquer tool call |
| `n8n-node-configuration` | czlonkowski/n8n-skills | Configurando nodes com operações dependentes entre campos |
| `n8n-validation-expert` | czlonkowski/n8n-skills | Interpretando e corrigindo erros de validação |
| `n8n-expression-syntax` | czlonkowski/n8n-skills | Escrevendo expressões `{{}}`, `$json`, `$node` |
| `n8n-code-javascript` | czlonkowski/n8n-skills | Code nodes em JS (padrão para 95% dos casos) |
| `n8n-code-python` | czlonkowski/n8n-skills | Code nodes em Python (apenas quando explicitamente solicitado) |

## Skills Pipeline

**Override da skill `brainstorming`:** a skill diz "do NOT invoke frontend-design — the ONLY skill after brainstorming is writing-plans." Esta instrução é overridden para projetos visuais (landing pages, dashboards, UI): após aprovação do spec e antes de invocar `writing-plans`, invocar `frontend-design` para refinar a direção visual. Esta instrução de usuário tem prioridade máxima sobre a skill.

### Decision Tree por tipo de projeto

A skill `using-superpowers` invoca `brainstorming` no início. **Após brainstorming aprovar o spec**, escolher pipeline:

| Tipo de projeto | Pipeline |
|---|---|
| **LP estática / Marketing** | `frontend-design` → build iterativo → `frontend-audit-gate` → `verification-before-completion` → `finishing-a-development-branch` |
| **Componente / Widget** | build direto → `frontend-audit-gate` → `verification-before-completion` → `finishing-a-development-branch` |
| **App / Dashboard** | `frontend-design` → `writing-plans` → `subagent-driven-development` (UI tasks vão pro `ui-subagent`) → `frontend-audit-gate` → `verification-before-completion` → `finishing-a-development-branch` |
| **Refactor / Migration** | `writing-plans` → `subagent-driven-development` → `frontend-audit-gate` (se mexer em UI) → `verification-before-completion` → `finishing-a-development-branch` |

### Regras invioláveis

- **`frontend-audit-gate` é gate obrigatório** antes de `finishing-a-development-branch` em **qualquer projeto frontend**. Sem exceção.
- **O gate deve rodar no modo híbrido** (código + screenshots Playwright). Se não tiver servidor disponível, registrar `code-only` no relatório e sugerir rodar híbrido antes do próximo ship.
- **Qualquer trabalho visual vai pro `ui-subagent` (Opus 4.7)** — sem exceção. Inclui: construção de componentes HTML/CSS, animações SVG, polish visual, refinamento de layout, aplicação de fixes do audit-gate, qualquer edição em arquivo `.html`, `.css` ou SVG com intenção estética. A sessão principal (Sonnet) coordena e revisa; o Opus executa o visual.
- **Tasks de UI dentro de `subagent-driven-development` vão pro `ui-subagent`** (não pro subagente genérico). Mantém qualidade visual Opus 4.7 mesmo se a sessão principal for Sonnet.
- **`verification-before-completion` é obrigatório** antes de `finishing-a-development-branch` em **qualquer projeto frontend** — sem exceção, incluindo LP simples. Exige: abrir no browser, confirmar visualmente que animações rodam, responsivo funciona e nenhum elemento está quebrado. Evidência antes de qualquer claim de "pronto".
- **Para LP/componente simples, `writing-plans` é opcional** — se a build for iterativa com feedback visual em tempo real, dispensável. Para projetos com state/lógica complexa, é obrigatório.

### Checklist obrigatório do brainstorming (projetos visuais)

Após o spec ser aprovado e antes de partir pro `writing-plans`, brainstorming **deve** validar:

- [ ] **Brand awareness** — spec menciona serviço conhecido (n8n, Supabase, GitHub, etc.)? Se sim, consultar `brand-aware-defaults` e definir tokens de marca antes de assumir accent genérico
- [ ] **Motion intensity** — cada visual da LP é estático ou animado? Default em LPs de produto = animado (`interactive-mockups`). Default em LPs editorais = estático
- [ ] **Service visuals** — seções que descrevem processo dinâmico precisam de mockup animado (workflow / chat / dashboard / code via `interactive-mockups`)
- [ ] **Reveal strategy por seção** — grids de 4+ items usam `reveal-patterns` Estratégia B (CSS stagger via classe injetada). 1-3 items podem usar Estratégia A (`data-delay`)
- [ ] **SVG pitfalls** — qualquer animação SVG nova consulta `svg-animations-pitfalls` durante implementação (não só após audit)

### Diagrama visual

```
using-superpowers (governa tudo)
        ↓
brainstorming → spec aprovado
        ↓
[CLAUDE.md decision tree → seleciona pipeline]
        ↓
   ┌────┴───────────────────────────────────────┐
   ↓                                            ↓
LP/componente:                          App/Dashboard:
frontend-design                         frontend-design
   ↓                                       ↓
build iterativo                         writing-plans
                                           ↓
                                        subagent-driven-development
                                        ├─ UI tasks → ui-subagent (Opus 4.7)
                                        └─ logic    → subagente genérico
                                           ↓
                                        [por task: TDD + code-review]
   ↓                                       ↓
   └──────────┬─────────────────────────────┘
              ↓
        frontend-audit-gate (OBRIGATÓRIO)
              ↓ Step 0: webapp-testing → screenshots Playwright
              ↓ Steps 1-3: audits cruzando código + visual (híbrido)
              ↓ (aplicação: manual OU paralelo via ui-subagent)
        aplicação dos fixes
              ↓
        verification-before-completion (OBRIGATÓRIO — todos os projetos frontend)
              ↓ abrir no browser, confirmar animações, responsivo, nada quebrado
        finishing-a-development-branch

PARALELO: systematic-debugging (qualquer bug)
          dispatching-parallel-agents (2+ problemas independentes)
          using-git-worktrees (workspace isolado)
```

## Subagentes Custom

Subagentes ficam em `.claude/agents/<name>.md`. São diferentes de skills — têm modelo fixo, tools restritas, e podem ser invocados por outras skills/sessions.

| Subagente | Modelo | Quando usar |
|---|---|---|
| `ui-subagent` | claude-opus-4-7 | Tasks de UI (build de componentes, aplicação de fixes do audit gate, refinamento de SVG animation). Skills visuais pré-carregadas (frontend-design, design-taste-frontend, svg-animations, web-design-guidelines, redesign-existing-projects). Tools restritas a Read/Edit/Write/Glob/Grep — sem Bash, sem git, sem WebFetch. |

## Project Structure

```
assets/                        — brand assets FacioFlow (SVGs, logos, PDF)
docs/audits/                   — relatórios de audit + screenshots Playwright
docs/audits/screenshots/       — capturas do webapp-testing para audit híbrido
docs/superpowers/specs/        — design specs produced by brainstorming
docs/superpowers/plans/        — implementation plans produced by writing-plans
facioflow-skills-landing/      — LP ativa (v2, produção) — brand FacioFlow
skills-landing/                — LP anterior (v1) — referência histórica
scripts/audit_visual.mjs       — captura screenshots via Playwright (porta 8080)
scripts/audit_visual.py        — versão Python equivalente
```

Landing pages are vanilla HTML/CSS/JS with no build step. Open via `file://` in the browser or use a local static server (`python -m http.server 8080`).

## Landing Page Architecture (facioflow-skills-landing)

- `css/tokens.css` — all design tokens (colors, spacing, typography) as CSS custom properties
- `css/base.css` — reset, keyframe animations
- `css/components.css` — reusable UI components (navbar, buttons, cards, chips, badges)
- `css/sections.css` — per-section layout + responsive breakpoints
- `index.html` — 6 sections, pt-BR, no external dependencies
- `js/main.js` — IntersectionObserver, scroll behavior, mobile menu, aria-expanded

Design decisions (locked — do not change without brainstorming):
- Always dark, no light mode toggle
- Tomorrow (display, weight 700 max) + Inter (body)
- Accent `#2463EB` (blue) + cyan `#9DDBFF` como secondary
- `font-weight: 900` no Tomorrow causa artefato RGB-split — sempre usar `700` em headlines
