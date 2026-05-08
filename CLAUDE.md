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

Skills live in `.agents/skills/`. Installed via `npx skills add <source>/<repo>`, tracked in `skills-lock.json`.

### Pipeline de desenvolvimento

| Skill | Source | Quando ativa |
|---|---|---|
| `using-superpowers` | obra/superpowers | Meta-skill: verifica skills aplicáveis antes de qualquer ação |
| `brainstorming` | obra/superpowers | Antes de qualquer feature — design e spec antes de código |
| `writing-plans` | obra/superpowers | Após brainstorming — plano detalhado com tasks decompostas |
| `executing-plans` | obra/superpowers | Execução inline do plano com checkpoints |
| `subagent-driven-development` | obra/superpowers | Execução via subagentes frescos por task com dual review (recomendado) |
| `frontend-design` | anthropics/skills | Entre brainstorming e writing-plans para projetos visuais |
| `webapp-testing` | anthropics/skills | Verificação de UI via Playwright antes de declarar pronto |
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

```
using-superpowers (meta — governa tudo)
        ↓
brainstorming → [frontend-design — projetos visuais] → writing-plans
                                          ↓
                           subagent-driven-development  ←  (recomendado)
                           executing-plans              ←  (alternativa inline)
                                          ↓
                              [por task: test-driven-development]
                              [por task: requesting-code-review]
                                          ↓
                           verification-before-completion
                                          ↓
                           finishing-a-development-branch

PARALELO: systematic-debugging (qualquer bug)
          dispatching-parallel-agents (2+ problemas independentes)
          using-git-worktrees (workspace isolado)
```

## Project Structure

```
docs/superpowers/specs/   — design specs produced by brainstorming
docs/superpowers/plans/   — implementation plans produced by writing-plans
ikigai-landing/           — demo v1: no skills, direct code
ikigai-landing-refined/   — demo v2: brainstorming + writing-plans + executing-plans
ikigai-landing-w-skills/  — demo v3: full pipeline (all 5+ skills)
```

Landing pages are vanilla HTML/CSS/JS with no build step. Open via `file://` in the browser or use a local static server.

## Landing Page Architecture (ikigai-landing-w-skills)

- `css/tokens.css` — all design tokens (colors, spacing, typography) as CSS custom properties
- `css/base.css` — reset, keyframe animations (`reveal-up`, `fade-up`)
- `css/components.css` — reusable UI components (navbar, buttons, cards, form)
- `css/sections.css` — per-section layout + responsive breakpoints
- `index.html` — 9 sections, pt-BR, no external dependencies
- `js/main.js` — IntersectionObserver, scroll behavior, mobile menu, form

Design decisions (locked — do not change without brainstorming):
- Always dark, no light mode toggle
- Bebas Neue (display) + Inter (body)
- Amber `#E8970A` as the sole accent color
