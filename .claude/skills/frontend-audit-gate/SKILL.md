---
name: frontend-audit-gate
description: Gate obrigatório de qualidade frontend — captura screenshots via webapp-testing (audit híbrido), orquestra os 3 audits (redesign-existing-projects, web-design-guidelines, svg-animations) cruzando código e contexto visual, agrega findings e oferece aplicação manual ou paralela via ui-subagent. Híbrido produz ~2× mais findings que code-only. Use ANTES de finishing-a-development-branch em qualquer projeto frontend.
---

# Frontend Audit Gate

Gate de qualidade que roda antes de finalizar qualquer projeto frontend. Captura screenshots do projeto rodando, orquestra 3 audits cruzando código e contexto visual, agrega tudo num relatório único.

**Audit híbrido vs code-only:** código + screenshots passa ~2× mais findings (validado: 27 vs 15 numa LP real). Híbrido é o padrão. Fallback para code-only se servidor não estiver disponível — registrar no relatório.

## Quando rodar

Antes de invocar `finishing-a-development-branch` em qualquer projeto que tenha:
- HTML/CSS/JS (vanilla ou framework)
- React, Vue, Svelte, etc.
- SVG inline animado
- Componentes UI

**Não rodar em:** projetos puramente backend, scripts CLI, código de infra.

---

## Processo

### Step 0 — Captura visual (determina híbrido vs code-only)

**Verifique se existe script de captura no projeto:**

```bash
ls scripts/audit_visual.mjs   # script customizado (recomendado)
```

**Se `scripts/audit_visual.mjs` existir:**

Informe o usuário:
> "Para audit híbrido (código + screenshots), preciso de um servidor na porta 8080. Rode `! python -m http.server 8080` na raiz e confirme quando estiver pronto."

Aguarde confirmação. Execute:
```bash
node scripts/audit_visual.mjs
```

Screenshots vão para `docs/audits/screenshots/`.

**Se não existir script customizado:**

Use a skill `webapp-testing` para navegar no projeto rodando e capturar screenshots das seções principais (hero, problema, pipeline, features, CTA/footer — adapte ao projeto).

**Se servidor não disponível / usuário não quiser:**

Registre `Método: code-only` e prossiga para Step 1 sem screenshots. Anote no relatório: "audit code-only — rodar híbrido antes do próximo ship para cobertura completa."

**Com screenshots disponíveis:**

Leia cada screenshot via Read tool (Claude lê imagens PNG/JPG). Screenshots revelam o que código não revela: contraste real, proporção visual, hierarquia renderizada, overflow em viewport, animações imperceptíveis.

---

### Step 1 — Detectar escopo

Identifique o que existe no projeto:

1. Glob por `**/*.{html,jsx,tsx,vue,svelte}` — existe markup?
2. Glob por `**/*.css` — existe CSS?
3. Grep por `<svg` ou `viewBox=` — tem SVG inline animado?
4. Grep por `@keyframes|animate|transition` — tem motion?

Use isso pra decidir quais dos 3 audits rodar (sempre rode pelo menos os 2 primeiros).

---

### Step 2 — Rodar os 3 audits

**Para cada audit, o contexto inclui: arquivos de código + screenshots lidos (se disponíveis).**

**Audit 1: Gosto / genericidade**
- Invoque `redesign-existing-projects` skill
- Cruze achados de código com o que os screenshots mostram — o que parece idêntico no código pode ser radicalmente diferente renderizado
- Capture findings de design genérico, typography, layout, color

**Audit 2: Compliance técnico**
- Invoque `web-design-guidelines` skill
- Screenshots revelam contraste real, estados visíveis, overflow em viewport real
- Output: formato `arquivo:linha — problema`

**Audit 3: SVG animation (condicional)**
- Rode apenas se Step 1 detectou SVG inline animado
- Invoque `svg-animations` skill
- Screenshots ajudam a avaliar visibilidade real da animação (o que parece bom no código pode ser imperceptível renderizado, e vice-versa)

---

### Step 3 — Agregar findings em relatório único

Crie `docs/audits/YYYY-MM-DD-<project-name>-audit.md`:

```markdown
# Audit: <project-name>

**Data:** YYYY-MM-DD
**Método:** híbrido (código + N screenshots) | code-only
**Modelo:** Claude Opus 4.7
**Escopo:** <arquivos auditados>
**Audits rodados:** redesign-existing-projects, web-design-guidelines, [svg-animations]

## 🔴 Alta prioridade
- [fonte] `arquivo:linha` — descrição + fix sugerido

## 🟡 Média prioridade
- ...

## 🔵 Baixa prioridade (polish)
- ...

## Resumo
Total: N findings (X alta, Y média, Z baixa)

### Quick wins
1. ...
```

**Critérios de classificação:**
- **🔴 Alta:** a11y crítico (missing aria, missing focus, contraste < 3:1), anti-patterns explícitos (`transition: all`, div com onClick), generic AI patterns claros (3-card row idêntico, Inter everywhere, purple gradient)
- **🟡 Média:** polish (text-wrap, optical alignment, micro-interactions ausentes), typography refinements, color/shadows, problemas de proporção visual
- **🔵 Baixa:** preferences subjetivas, optimizations marginais, naming/code-only

---

### Step 4 — Apresentar caminhos de aplicação

**Opção A — Aplicação manual sequencial**
- Sessão principal aplica cada finding em ordem de prioridade (🔴 primeiro)
- Vantagem: controle total, pode iterar em cada
- Desvantagem: lento

**Opção B — Aplicação paralela via `ui-subagent`** (recomendado pra 5+ findings independentes)
- Cada finding alta/média independente → 1 task no `ui-subagent` (Opus 4.7)
- Subagentes rodam em paralelo via `dispatching-parallel-agents`
- Briefing por subagente: contexto do projeto, arquivo, linha, descrição, fix proposto, critério de aceitação
- Vantagem: rápido, qualidade Opus consistente em todos os fixes

Aguarde escolha do usuário antes de proceder.

---

### Step 5 — Aplicar fixes

**Manual:**
- Aplique em ordem de prioridade
- Marque applied/skipped no relatório a cada finding

**Paralelo:**
- Use `dispatching-parallel-agents`
- Para cada finding alta/média independente: despache 1 `ui-subagent` com briefing claro
- Após todos retornarem: agregue resultados, apresente ao usuário para revisão

---

### Step 6 — Commit do relatório

Commitar `docs/audits/YYYY-MM-DD-<project-name>-audit.md` após aplicação (mesmo findings skippados — fica histórico).

---

## Tasks que NÃO são paralelizáveis

- Fixes no mesmo arquivo nas mesmas linhas
- Decisões de design que afetam todo o projeto (ex: trocar paleta inteira)
- Findings com dependência (fix B só faz sentido após fix A)

Detecte essas dependências e agrupe ou aplique sequencialmente.

---

## Output esperado da skill

1. Screenshots em `docs/audits/screenshots/` (modo híbrido)
2. Relatório committed em `docs/audits/`
3. N fixes aplicados (manual ou via subagentes)
4. Resumo ao usuário: total encontrados / aplicados / skippados + próximo passo (`finishing-a-development-branch`)

---

## Princípios

- **Nunca pular o gate** — mesmo projeto polished sempre revela algo. Screenshots revelam o que código esconde.
- **Híbrido é o padrão** — code-only só se não tiver servidor. Sempre anotar no relatório quando for code-only.
- **Todos os findings ficam registrados** — mesmo skippados. Histórico permite revisitar.
- **Paralelo é o default pra 5+ fixes independentes** — só manual se interdependentes ou usuário pedir.
- **Audit não bloqueia ship** — usuário pode skippar findings. Mas tudo é registrado.
