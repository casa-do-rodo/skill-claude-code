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

| Skill | Source | Role in pipeline |
|---|---|---|
| `brainstorming` | obra/superpowers | Design exploration before code, Visual Companion UI |
| `writing-plans` | obra/superpowers | Full implementation plan with decomposed tasks |
| `executing-plans` | obra/superpowers | Bridges plan to execution choice |
| `subagent-driven-development` | obra/superpowers | Dispatches fresh subagents per task with dual review |
| `frontend-design` | anthropics/skills | Visual direction and production-grade UI |
| `webapp-testing` | anthropics/skills | Playwright-based browser verification |
| `verification-before-completion` | obra/superpowers | Evidence-first before claiming success |
| `remember:remember` | dpt-plugins (plugin) | Session handoff to `.remember/remember.md` |

### Supabase

| Skill | Source | Quando ativa |
|---|---|---|
| `supabase` | supabase/agent-skills | Qualquer task com Supabase: DB, Auth, RLS, Edge Functions, pgvector, CLI |
| `supabase-postgres-best-practices` | supabase/agent-skills | Queries, schema design, otimização Postgres (30 regras) |

### n8n

| Skill | Source | Quando ativa |
|---|---|---|
| `n8n-workflow-patterns` | czlonkowski/n8n-skills | Projetando workflows: AI agents, webhooks, database sync, batch |
| `n8n-mcp-tools-expert` | czlonkowski/n8n-skills | Usando o MCP do n8n — consultar ANTES de qualquer tool call |
| `n8n-node-configuration` | czlonkowski/n8n-skills | Configurando nodes com operações dependentes entre campos |
| `n8n-validation-expert` | czlonkowski/n8n-skills | Interpretando e corrigindo erros de validação |
| `n8n-expression-syntax` | czlonkowski/n8n-skills | Escrevendo expressões `{{}}`, `$json`, `$node` |
| `n8n-code-javascript` | czlonkowski/n8n-skills | Code nodes em JS (padrão para 95% dos casos) |
| `n8n-code-python` | czlonkowski/n8n-skills | Code nodes em Python (apenas quando explicitamente solicitado) |

## Skills Pipeline

```
brainstorming → writing-plans → executing-plans → subagent-driven-development
                                                         ↑ verification-before-completion + webapp-testing (final check)
```

`frontend-design` should be invoked between `brainstorming` and `writing-plans` to refine the visual spec before planning.

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
