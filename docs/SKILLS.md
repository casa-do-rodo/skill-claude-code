# Skills — Referência Completa

Catálogo de todas as **38 skills** instaladas no projeto + **1 subagente custom**, organizadas por função, com explicação de como elas se conectam.

---

## Sumário por categoria

| Categoria | Skills | Origem dominante |
|---|---|---|
| Pipeline & Process | 8 | obra/superpowers + anthropics |
| Frontend Specialty | 9 | anthropics + leonxlnx + vercel-labs + supermemoryai + custom |
| Quality | 6 | obra/superpowers + anthropics |
| Stack: Supabase | 3 | supabase/agent-skills + custom |
| Stack: n8n | 8 | czlonkowski/n8n-skills + custom |
| Git & Branches | 2 | obra/superpowers |
| Meta & Memory | 4 | obra/superpowers + dpt-plugins + vercel-labs |

**Customs:** 4 skills (`frontend-audit-gate`, `checkpoint`, `n8n-workflow-testing`, `supabase-schema-testing`) + 1 subagente (`ui-subagent`).

---

## 1. Pipeline & Process

O motor do workflow. Define **como** se trabalha, em que ordem.

| Skill | Origem | Quando ativa | Conecta com |
|---|---|---|---|
| `using-superpowers` | obra/superpowers | **Sempre** ao início de uma sessão. Meta-skill que dispara verificação de outras skills aplicáveis. | Dispara as outras |
| `brainstorming` | obra/superpowers | Antes de qualquer feature/projeto novo. Produz spec aprovado. | Antecede `frontend-design` (visual) ou `writing-plans` direto |
| `frontend-design` | anthropics/skills | Após brainstorming, em projetos visuais. Direção estética (lean by design). | Compõe com skills frontend specialty |
| `writing-plans` | obra/superpowers | Pós-spec, em projetos com tasks decomponíveis. Plano detalhado. | Antecede `executing-plans` ou `subagent-driven-development` |
| `executing-plans` | obra/superpowers | Execução inline do plano com checkpoints. | Alternativa a subagent-driven |
| `subagent-driven-development` | obra/superpowers | Execução paralela via subagentes frescos. **UI tasks → `ui-subagent`** | Despacha `ui-subagent` pra UI |
| `verification-before-completion` | obra/superpowers | Obrigatório antes de qualquer claim de "pronto". Exige evidência. | Gate antes de `finishing` |
| `finishing-a-development-branch` | obra/superpowers | Após implementação completa — merge, PR, ou cleanup. | Terminal state |

### Flow típico

```
using-superpowers → brainstorming → [frontend-design] → writing-plans (opcional)
                         ↓
              [executing | subagent-driven]
                         ↓
              verification-before-completion
                         ↓
              finishing-a-development-branch
```

---

## 2. Frontend Specialty

Skills especialistas que compõem com `frontend-design`. Cada uma cobre uma área técnica específica.

| Skill | Origem | O que faz | Quando ativa |
|---|---|---|---|
| `design-taste-frontend` | leonxlnx/taste-skill | Rigor técnico em UI: DESIGN_VARIANCE/MOTION_INTENSITY metrics, anti-slop rules, GPU-safe motion | Construindo qualquer UI séria |
| `svg-animations` | supermemoryai/skills | SMIL, motion paths, masks, filters, stroke drawing, morphing, keySplines | Qualquer animação SVG |
| `web-design-guidelines` | vercel-labs/agent-skills | Audit de UI contra Vercel Web Interface Guidelines (a11y, focus, anti-patterns) | "review my UI", "check accessibility" |
| `redesign-existing-projects` | leonxlnx/taste-skill | Audit de gosto: identifica genericidade AI, propõe upgrades estéticos | Auditar projeto existente |
| `full-output-enforcement` | leonxlnx/taste-skill | Anti-truncation: força output completo em tasks longas | Outputs grandes (componentes, refatorações) |
| `vercel-composition-patterns` | vercel-labs/agent-skills | React composition (compound components, render props, contexts) | React refactor |
| `vercel-react-best-practices` | vercel-labs/agent-skills | Performance React/Next.js (rendering, bundle, data fetching) | React/Next perf |
| `vercel-react-view-transitions` | vercel-labs/agent-skills | View Transition API pra animações de página/rota | React transitions |
| `frontend-audit-gate` | **custom** | **Gate obrigatório** antes de finishing. Orquestra 3 audits, agrega findings, oferece aplicação paralela via `ui-subagent` | Antes de finalizar projeto frontend |

### Como se conectam

```
                ┌──────────────────────────────────────────────────┐
                │            frontend-design (lean)                │
                │       Direção estética, sem receitas técnicas    │
                └──────────────────────────┬───────────────────────┘
                                           │ compõe com:
                ┌──────────────────────────┴───────────────────────┐
                ↓                          ↓                       ↓
    design-taste-frontend          svg-animations         vercel-* (3)
    (rigor técnico)                (animação SVG)         (React only)
                │                          │
                └─────────────┬────────────┘
                              ↓
                    Audit fase (no fim do build):
                              ↓
                    frontend-audit-gate (custom)
                              ↓ orquestra:
                    ┌─────────┴─────────┬──────────────────┐
                    ↓                   ↓                  ↓
            redesign-existing  web-design-guidelines  svg-animations
            (gosto/genericidade) (compliance Vercel)  (SVG-specific)
                              ↓ agrega findings:
                    Manual OU paralelo via ui-subagent
```

**Filosofia:** `frontend-design` é lean por design (Anthropic). NÃO inflar. Compor com especialistas.

---

## 3. Quality

Garantia de qualidade durante e após desenvolvimento.

| Skill | Origem | Quando ativa | Conecta com |
|---|---|---|---|
| `test-driven-development` | obra/superpowers | Antes de implementar feature/bugfix. RED-GREEN-REFACTOR. | Acompanha `executing-plans` por task |
| `systematic-debugging` | obra/superpowers | Ao encontrar QUALQUER bug, antes de propor fix. | Substitui ad-hoc debugging |
| `requesting-code-review` | obra/superpowers | Após task/feature completa, antes de merge. | Antes de `finishing` |
| `receiving-code-review` | obra/superpowers | Ao receber feedback. Verificar antes de implementar (não cega). | Recebe output de `requesting-code-review` |
| `dispatching-parallel-agents` | obra/superpowers | 2+ problemas independentes resolvíveis em paralelo. | Padrão usado pelo `frontend-audit-gate` |
| `webapp-testing` | anthropics/skills | Verificação UI via Playwright. | Ferramenta pra `verification-before-completion` |

---

## 4. Stack: Supabase

Para projetos com banco de dados, auth, edge functions.

| Skill | Origem | O que faz |
|---|---|---|
| `supabase` | supabase/agent-skills | Skill principal. Database, Auth, RLS, Edge Functions, pgvector, CLI |
| `supabase-postgres-best-practices` | supabase/agent-skills | 30 regras de performance/schema/queries Postgres |
| `supabase-schema-testing` | **custom** | Adapta RED-GREEN-REFACTOR pra schemas (antes de migration, RLS, pgvector) |

**Padrão:** sempre invocar `supabase` antes de qualquer tool call do MCP Supabase. Pra criar/alterar schemas, ativar `supabase-schema-testing` antes.

---

## 5. Stack: n8n

Pra workflows de automação, AI agents, integrações.

| Skill | Origem | O que faz |
|---|---|---|
| `n8n-mcp-tools-expert` | czlonkowski/n8n-skills | **Sempre consultar antes de qualquer tool call MCP n8n.** Previne erros de nodeType, parâmetros |
| `n8n-workflow-patterns` | czlonkowski/n8n-skills | Padrões arquiteturais: webhooks, AI agents, batch, schedule |
| `n8n-node-configuration` | czlonkowski/n8n-skills | Configuração operation-aware de nodes |
| `n8n-validation-expert` | czlonkowski/n8n-skills | Interpretação de erros de validação |
| `n8n-expression-syntax` | czlonkowski/n8n-skills | Sintaxe de expressões `{{}}`, `$json`, `$node` |
| `n8n-code-javascript` | czlonkowski/n8n-skills | Code nodes em JS (95% dos casos) |
| `n8n-code-python` | czlonkowski/n8n-skills | Code nodes em Python (quando explicitamente solicitado) |
| `n8n-workflow-testing` | **custom** | Adapta RED-GREEN-REFACTOR pra workflows (antes de ativar/AI agents) |

**Ordem típica:** `n8n-mcp-tools-expert` → `n8n-workflow-patterns` (escolher arquitetura) → `n8n-node-configuration` → `n8n-expression-syntax`/`n8n-code-javascript` → `n8n-validation-expert` → `n8n-workflow-testing` (antes de ativar).

---

## 6. Git & Branches

| Skill | Origem | Quando ativa |
|---|---|---|
| `using-git-worktrees` | obra/superpowers | Ao iniciar feature que precisa de workspace isolado |
| `finishing-a-development-branch` | obra/superpowers | Implementação completa, decidir merge / PR / discard |

---

## 7. Meta & Memory

Skills que tratam do próprio sistema.

| Skill | Origem | Quando ativa |
|---|---|---|
| `find-skills` | vercel-labs/skills | Ao procurar skill nova. **Usa antes de instalar repo inteiro à toa** |
| `checkpoint` | **custom** (esta sessão) | Mid-session state save (antes de compaction, decisões importantes) |
| `remember:remember` | dpt-plugins | Handoff de sessão via `.remember/` |
| `writing-skills` | obra/superpowers | Ao criar/editar skills (TDD aplicado à documentação) |

---

## 8. Subagente custom

| Subagente | Modelo | Tools | Skills pré-carregadas | Uso |
|---|---|---|---|---|
| `ui-subagent` | claude-opus-4-7 | Read, Edit, Write, Glob, Grep | frontend-design, design-taste-frontend, svg-animations, web-design-guidelines, redesign-existing-projects | Tasks de UI durante build paralelo, aplicação de fixes do audit-gate |

**Limitação conhecida:** custom subagents em `.claude/agents/` precisam de **restart de sessão** pra serem auto-discovered pelo Agent tool. Workaround testado: `general-purpose` + `model: "opus"` com briefings inline. Funcionalmente equivalente.

---

## Como tudo se conecta — workflow patterns

### Pattern 1: LP simples (validado nesta sessão)

```
brainstorming → frontend-design → build iterativo → frontend-audit-gate → finishing
```

Skills auxiliares:
- Durante build: `using-superpowers` (sempre), nada mais
- No audit-gate: `redesign-existing-projects`, `web-design-guidelines`, `svg-animations` (orquestrados)
- Aplicação de fixes: paralelo via `ui-subagent` × N

### Pattern 2: App / Dashboard

```
brainstorming → frontend-design → writing-plans
              ↓
              subagent-driven-development:
                ├─ UI tasks → ui-subagent (Opus 4.7)
                └─ logic   → subagente genérico
              ↓ (por task: TDD + code-review)
              ↓
              frontend-audit-gate
              ↓
              verification-before-completion → finishing
```

### Pattern 3: Workflow n8n

```
brainstorming → n8n-mcp-tools-expert → n8n-workflow-patterns
              ↓
              [escolher arquitetura: webhook / AI agent / batch / scheduled]
              ↓
              n8n-node-configuration + n8n-expression-syntax + n8n-code-javascript
              ↓
              n8n-validation-expert (loop até validar)
              ↓
              n8n-workflow-testing → finishing
```

### Pattern 4: Migration Supabase

```
brainstorming → supabase → supabase-postgres-best-practices
              ↓
              supabase-schema-testing (RED-GREEN-REFACTOR)
              ↓
              apply migration → finishing
```

---

## Origens (atribuição)

| Origem | Skills | URL |
|---|---|---|
| obra/superpowers | 14 | github.com/obra/superpowers |
| anthropics/skills | 3 | github.com/anthropics/skills |
| czlonkowski/n8n-skills | 7 | github.com/czlonkowski/n8n-skills |
| supabase/agent-skills | 2 | github.com/supabase/agent-skills |
| leonxlnx/taste-skill | 3 | github.com/leonxlnx/taste-skill |
| vercel-labs/agent-skills | 4 | github.com/vercel-labs/agent-skills |
| vercel-labs/skills | 1 | github.com/vercel-labs/skills (find-skills) |
| supermemoryai/skills | 1 | github.com/supermemoryai/skills (svg-animations) |
| dpt-plugins (plugin) | 1 | remember:remember |
| **Custom (este projeto)** | 4 + 1 subagente | `.claude/skills/` + `.claude/agents/` |

---

## Como instalar uma skill nova (lição aprendida)

**SEMPRE use o flag `--skill`** — sem ele, o `npx skills add` baixa o repo inteiro:

```bash
# ✅ Certo: instala só uma
npx skills add owner/repo --skill nome-da-skill

# ❌ Errado: baixa todas as skills do repo
npx skills add owner/repo

# Pra listar antes de instalar:
npx skills add owner/repo --list

# Pra remover:
npx skills remove nome-da-skill
```

Pra descobrir uma skill nova, invoque o `find-skills` primeiro — ele consulta marketplaces (skills.sh, claudemarketplaces.com, repos GitHub) e sugere, evitando bulk install.

---

## Onde cada coisa mora

```
.agents/skills/<name>/SKILL.md         ← skills instaladas via npx
.claude/skills/<name>/SKILL.md         ← skills custom (deste projeto)
.claude/agents/<name>.md               ← subagentes custom (Opus fixo, etc.)
.claude/settings.local.json            ← permissões + tools
skills-lock.json                       ← versions trackada das skills marketplace
docs/superpowers/specs/                ← design specs (output do brainstorming)
docs/superpowers/plans/                ← planos (output do writing-plans)
docs/audits/                           ← relatórios do frontend-audit-gate
.remember/                             ← memória de sessão (gitignored)
```
