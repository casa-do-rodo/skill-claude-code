---
name: frontend-audit-gate
description: Gate obrigatório de qualidade frontend — orquestra os 3 audits (redesign-existing-projects, web-design-guidelines, svg-animations), agrega findings, classifica por prioridade e oferece aplicação manual ou paralela via ui-subagent. Use ANTES de finishing-a-development-branch em qualquer projeto que tenha código frontend (HTML/CSS/JS, React, SVG animado, landing pages, dashboards, componentes).
---

# Frontend Audit Gate

Gate de qualidade que roda antes de finalizar qualquer projeto frontend. Orquestra 3 audits independentes, agrega findings num relatório único e oferece caminhos de aplicação.

## Quando rodar

Antes de invocar `finishing-a-development-branch` em qualquer projeto que tenha:
- HTML/CSS/JS (vanilla ou framework)
- React, Vue, Svelte, etc.
- SVG inline animado
- Componentes UI

**Não rodar em:** projetos puramente backend, scripts CLI, código de infra.

## Processo

### Passo 1 — Detectar escopo

Antes de rodar audits, identifique o que existe no projeto:

1. Glob por `**/*.{html,jsx,tsx,vue,svelte}` — existe markup?
2. Glob por `**/*.css` — existe CSS?
3. Grep por `<svg` ou `viewBox=` — tem SVG inline animado?
4. Grep por `@keyframes\|animate\|transition` — tem motion?

Use isso pra decidir quais dos 3 audits rodar (sempre rode pelo menos os 2 primeiros).

### Passo 2 — Rodar os 3 audits em sequência

**Audit 1: Gosto / genericidade**
- Invoque `redesign-existing-projects` skill
- Aplique o checklist às páginas/componentes principais
- Capture findings na categoria de design genérico, typography, layout, color

**Audit 2: Compliance técnico**
- Invoque `web-design-guidelines` skill
- A skill busca guidelines do Vercel via WebFetch
- Aplique aos arquivos identificados no Passo 1
- Output: formato `arquivo:linha - problema`

**Audit 3: SVG animation (condicional)**
- Só rode se Passo 1 detectou SVG inline animado
- Invoque `svg-animations` skill
- Aplique lens dela aos SVGs animados (acessibilidade, easing, performance, best practices)

### Passo 3 — Agregar findings em relatório único

Crie arquivo `docs/audits/YYYY-MM-DD-<project-name>-audit.md` com estrutura:

```markdown
# Audit: <project-name>

**Data:** YYYY-MM-DD
**Escopo:** <arquivos audidatos>
**Audits rodados:** redesign-existing-projects, web-design-guidelines, [svg-animations]

## 🔴 Alta prioridade
- [Audit A] [arquivo:linha] — descrição curta + sugestão de fix

## 🟡 Média prioridade
- ...

## 🔵 Baixa prioridade (polish)
- ...

## Resumo
Total: N findings (X alta, Y média, Z baixa)
```

**Critérios de classificação:**

- **🔴 Alta:** a11y crítico (a11y violations, missing aria, missing focus), anti-patterns explícitos (transition: all, div with onClick), generic AI patterns claros (3-card row, Inter everywhere, purple gradient)
- **🟡 Média:** polish (text-wrap balance, optical alignment, micro-interactions ausentes), refinements de typography, color shadows tinted
- **🔵 Baixa:** preferences subjetivas, easter eggs, optimizations marginais

### Passo 4 — Apresentar caminhos de aplicação

Após o relatório, apresente ao usuário:

**Opção A — Aplicação manual sequencial**
- Você (sessão principal) aplica cada finding um por um
- Vantagem: controle total, pode iterar em cada
- Desvantagem: lento

**Opção B — Aplicação paralela via `ui-subagent`** (recomendado pra 5+ findings independentes)
- Cada finding alta/média independente vira uma task delegada ao `ui-subagent` (Opus 4.7)
- Subagentes rodam em paralelo via `dispatching-parallel-agents`
- Cada subagente recebe: arquivo, linha, descrição, fix proposto, critério de aceitação
- Vantagem: rápido, qualidade Opus consistente
- Desvantagem: precisa revisar agregado depois

Aguarde escolha do usuário antes de proceder.

### Passo 5 — Aplicar fixes (manual OU paralelo)

**Se manual:**
- Aplique findings em ordem de prioridade (🔴 primeiro)
- Confirme com usuário a cada finding aplicado
- Atualize o relatório marcando applied/skipped

**Se paralelo:**
- Use a skill `dispatching-parallel-agents`
- Para cada finding alta/média independente:
  - Despache 1 `ui-subagent` com briefing claro
  - Briefing deve conter: contexto do projeto, arquivo, linha, descrição da issue, fix esperado, critério de aceitação
- Após todos retornarem, agregue resultados no relatório
- Apresente ao usuário pra revisão final

### Passo 6 — Commit do relatório

Após aplicação, commitar `docs/audits/YYYY-MM-DD-<project-name>-audit.md` (mesmo se findings foram skippados — fica histórico).

## Tasks que NÃO são paralelizáveis

Mesmo no modo paralelo, alguns findings devem ser sequenciais:
- Fixes que tocam o MESMO arquivo nas mesmas linhas
- Decisões de design que afetam todo o projeto (ex: trocar a paleta inteira)
- Findings com dependência (fix B só faz sentido depois de fix A)

Detecte essas dependências e agrupe ou aplique sequencialmente.

## Output esperado da skill

Ao terminar:
1. Relatório committed em `docs/audits/`
2. N fixes aplicados (manualmente ou via subagentes)
3. Resumo final ao usuário com:
   - Total de findings encontrados
   - Total aplicados / skippados
   - Path do relatório
   - Próximo passo sugerido (geralmente `finishing-a-development-branch`)

## Princípios

- **Nunca pular o gate** — mesmo que o projeto pareça polished, sempre rodar. Audits revelam coisas que olho não pega.
- **Todos os findings ficam registrados** — mesmo skippados. Histórico permite revisitar depois.
- **Subagente paralelo é o caminho default pra 5+ fixes** — só aplicar manual se findings forem interdependentes ou se o usuário pedir explicitamente.
- **Audit não bloqueia ship** — usuário pode escolher skippar findings (especialmente baixa prioridade). Mas tudo é registrado.
