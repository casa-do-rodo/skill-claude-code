# Spec: Evolução do Workflow Frontend

**Data:** 2026-05-08
**Objetivo:** Codificar o workflow validado nesta sessão (skills-landing) em ferramental reutilizável: decision tree no CLAUDE.md + audit gate automatizado + subagente UI com Opus 4.7 fixo.

---

## Contexto

Sessão de construção da `skills-landing` revelou padrões importantes:

1. Diferentes tipos de projeto exigem **pipelines diferentes** de skills (LP simples ≠ dashboard).
2. Após build, faz sentido um **audit gate obrigatório** que roda as 3 skills de auditoria (redesign-existing-projects + web-design-guidelines + svg-animations) e agrega findings.
3. Tasks de UI se beneficiam claramente de **modelo Opus 4.7**, mesmo quando a sessão principal é Sonnet — qualidade visual é sensível ao modelo.
4. Quando o audit gate retorna N findings independentes, **paralelizar com subagentes** é o caminho natural — cada subagente aplica 1 fix.

A skill `frontend-design` é propositalmente lean (filosofia da Anthropic). Não vamos inflar ela. Vamos **compor**: skills especialistas + orquestradores customizados.

---

## Componentes

### 1. CLAUDE.md — Decision Tree de Pipeline

**Onde:** atualização da seção "Skills Pipeline" no `CLAUDE.md` raiz do projeto.

**O que adiciona:** decision tree que mapeia tipo de projeto → pipeline correto.

```
Static LP / Marketing      → brainstorming → frontend-design → build iterativo → audit-gate → ship
Componente / Widget        → brainstorming → build → audit-gate → ship
App / Dashboard            → pipeline completo (writing-plans + subagent-driven + TDD + audit-gate + verification)
Refactor / Migration       → writing-plans → subagent-driven-development
```

**Regras adicionais:**
- `frontend-audit-gate` é **gate obrigatório** antes de `finishing-a-development-branch` em qualquer projeto frontend
- Tasks de UI dentro de `subagent-driven-development` devem ser delegadas ao `ui-subagent` (não ao subagente genérico)

**Por que CLAUDE.md e não skill:** decisão é simples (decision tree), CLAUDE.md já é auto-carregado, evita criar mais 1 skill pra orquestrar. Menos é mais.

---

### 2. `frontend-audit-gate` — Skill custom

**Onde mora:** `.claude/skills/frontend-audit-gate/SKILL.md`

**Trigger:** invocada antes de `finishing-a-development-branch` em qualquer projeto que tenha código frontend.

**O que faz:**
1. Detecta o tipo de código (HTML/CSS/JS, React, SVG presente?) pra saber quais audits aplicar
2. Roda as 3 skills de auditoria em sequência:
   - `redesign-existing-projects` (gosto/genericidade)
   - `web-design-guidelines` (compliance Vercel)
   - `svg-animations` (se houver SVG animado no projeto)
3. Agrega findings num único relatório, classifica por prioridade:
   - **Alta** (a11y crítico, anti-patterns, generic UI patterns)
   - **Média** (polish, optical alignment, micro-interactions)
   - **Baixa** (typography refinement, easter eggs)
4. Apresenta 2 caminhos de aplicação:
   - **Manual** — você revisa cada finding individualmente
   - **Paralelo via ui-subagent** — N findings → N subagentes Opus 4.7 simultâneos

**Output:** relatório em `docs/audits/YYYY-MM-DD-<project>-audit.md` (committed) + decisão de aplicação.

---

### 3. `ui-subagent` — Subagente custom (Opus 4.7 fixo)

**Onde mora:** `.claude/agents/ui-subagent.md`

**Modelo:** Opus 4.7 fixado (independente do modelo da sessão principal).

**Tools permitidas:** Read, Edit, Write, Glob, Grep — restrito a operações de UI/visual. **Sem** Bash arbitrário, **sem** git, **sem** WebFetch.

**Skills pré-carregadas:**
- `frontend-design` (direção estética)
- `design-taste-frontend` (rigor técnico)
- `svg-animations` (animação SVG)
- `web-design-guidelines` (compliance reference)
- `redesign-existing-projects` (padrões de polish)

**Quem invoca:**
- `subagent-driven-development` → tasks de UI durante build paralelo
- `frontend-audit-gate` → aplicação paralela de fixes
- Manualmente, quando se quer qualidade Opus em ponto específico

**Briefing pattern:** quem invoca passa: contexto do projeto + arquivos relevantes + task específica + critérios de aceitação. Subagente retorna código pronto pra revisão.

**Diferença pra subagente genérico:** modelo fixo + skills visuais carregadas + tools restritas + foco único em UI.

---

## Como tudo se conecta

**LP (cenário skills-landing):**
```
você: "constrói uma LP"
   ↓
[CLAUDE.md decision tree → minimal pipeline]
   ↓
brainstorming → frontend-design → build iterativo
   ↓
frontend-audit-gate → 3 audits → findings agregados
   ↓ (você escolhe: manual ou paralelo)
ui-subagent × N (Opus 4.7) aplicam fixes em paralelo
   ↓
finishing-a-development-branch
```

**Dashboard:**
```
você: "constrói um dashboard"
   ↓
[CLAUDE.md decision tree → pipeline completo]
   ↓
brainstorming → frontend-design → writing-plans
   ↓
subagent-driven-development distribui:
   ├─ tasks de UI    → ui-subagent (Opus 4.7)
   └─ tasks de logic → subagente genérico (Sonnet)
   ↓ (por task: TDD + code-review)
frontend-audit-gate → fixes via ui-subagent paralelo
   ↓
verification-before-completion → finishing
```

---

## Ordem de Construção

1. **`ui-subagent` primeiro** — componente mais isolado, alto valor mesmo sozinho (você pode invocar manualmente). Sem dependências.
2. **`frontend-audit-gate` segundo** — depende de `ui-subagent` existir pra delegar fixes em paralelo. Mas é simples (orquestra 3 skills).
3. **CLAUDE.md update por último** — referencia os 2 componentes acima como regras do pipeline. Sem sentido atualizar antes de eles existirem.

---

## Decisões travadas (não mudar sem nova brainstorming)

- **CLAUDE.md decision tree em vez de workflow-router skill** — evita overengineering, decisão é simples, CLAUDE.md já auto-carrega.
- **Modelo Opus 4.7 fixo no ui-subagent** — foi observado nesta sessão que Sonnet não consegue qualidade visual equivalente em SVG complexo.
- **3 skills no audit gate (redesign + web-design + svg-animations)** — testadas nesta sessão, cobrem áreas complementares sem overlap.
- **Skills custom em `.claude/skills/`** (não `.agents/skills/`) — convenção do projeto: custom = `.claude/`, instalado via npx = `.agents/`.
- **Subagente em `.claude/agents/`** — convenção Claude Code para subagentes.

---

## Não-objetivos

- **Não** modificar/inflar a skill `frontend-design` — fica lean por design.
- **Não** criar skill `svg-advanced-patterns` agora — `svg-animations` cobre 80% e está sendo mantida.
- **Não** criar skill router — substituída por CLAUDE.md decision tree.
- **Não** automatizar disparo do audit-gate — sempre invocação explícita pra preservar controle.
