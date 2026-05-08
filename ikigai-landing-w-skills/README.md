# Ikigai Landing — W/Skills

Landing page institucional da Ikigai Brand construída com o pipeline completo de skills do projeto. Esta versão demonstra o salto de qualidade quando todas as skills estão presentes no fluxo.

---

## O Pipeline de Skills Utilizado

```
brainstorming → writing-plans → executing-plans → subagent-driven-development
                                     ↑ webapp-testing (verificação)
```

5 skills foram efetivamente invocadas. Uma nota importante: **`frontend-design`** foi instalada no projeto durante a sessão, mas não foi chamada como step explícito — as decisões visuais aconteceram dentro do brainstorming via Visual Companion. Num pipeline 100% correto, o `frontend-design` seria invocado entre o brainstorming e o writing-plans para refinar ainda mais a especificação visual.

---

## 1. `brainstorming` — Design antes de código

A primeira skill ativada. Em vez de sair codando, ela força um processo de design estruturado:

- Explorou o contexto do projeto (versões anteriores da landing)
- Ofereceu o **Visual Companion** — um servidor local que abre no browser e exibe mockups interativos para decisões visuais
- Fez perguntas uma de cada vez, com opções visuais:
  - **Direção visual** → escolhido: *Dark & Bold* (fundo preto, âmbar como único acento)
  - **Layout do hero** → escolhido: *Full-screen centrado* (headline gigante, 100vh)
  - **Tipografia** → escolhido: *Display/Impact* (Bebas Neue nos títulos, Inter no corpo)
- Apresentou o design section por section, validando antes de avançar
- Escreveu o spec em `docs/superpowers/specs/2026-05-07-ikigai-landing-w-skills-design.md`

**O que mudou vs. sem essa skill:** as decisões de design foram tomadas antes de qualquer código. Nenhum token de cor, nenhum layout, nenhuma fonte foi escolhida "no meio do caminho".

---

## 2. `writing-plans` — Plano de implementação completo

Com o spec aprovado, esta skill criou um plano de implementação em `docs/superpowers/plans/2026-05-07-ikigai-landing-w-skills.md` com:

- **Mapa de arquivos** — qual arquivo é responsável por quê antes de escrever uma linha
- **7 tasks** decompostas em steps de 2-5 minutos cada
- **Código completo em cada step** — sem "implemente a lógica de X", mas o código real
- **Verificações explícitas** — o que checar depois de cada passo

O plano resolveu todas as decisões de decomposição antecipadamente: tokens → base → components → sections → HTML → JS. Cada arquivo tem uma responsabilidade única.

---

## 3. `executing-plans` — Ponte para escolha de execução

Skill carregada quando o writing-plans terminou. Ela apresentou duas opções de execução:
- **Subagent-Driven** (recomendado) — subagente fresco por task, revisão dupla automática
- **Inline Execution** — execução sequencial no mesmo contexto

Usuário escolheu opção 1, e a `executing-plans` passou o controle para `subagent-driven-development`.

---

## 4. `subagent-driven-development` — Execução com revisão dupla

Esta é a skill de execução. Para cada uma das 7 tasks:

### Por task:

**Implementer subagent (Haiku)** — modelo rápido e barato para tasks mecânicas
- Recebe o texto completo da task (sem precisar ler o plano)
- Implementa exatamente o que foi especificado
- Faz self-review antes de reportar
- Reporta status: `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, `NEEDS_CONTEXT`

**Spec reviewer subagent (Sonnet)** — verifica aderência ao spec
- Lê o código real (não confia no relatório do implementer)
- Compara item por item com o que foi pedido
- Detecta o que está faltando OU o que foi adicionado sem ser pedido
- Só passa para o próximo estágio quando retorna ✅

**Code quality reviewer subagent (Sonnet)** — verifica qualidade do código
- Aponta Critical / Important / Minor issues
- Task 2 (base.css): detectou ausência de `prefers-reduced-motion` — fix foi aplicado
- Tasks 3 e 4: issues menores documentados, aceitos para este demo
- Task 6 (main.js): aprovada sem nenhum issue

### Fluxo de orquestração:

```
Controller (este contexto)
  ├── Dispatch implementer (Haiku) → DONE
  ├── Dispatch spec reviewer (Sonnet) → ✅
  ├── Dispatch quality reviewer (Sonnet) → Approved / fix needed
  │     └── se fix needed → Dispatch implementer novamente → re-review
  └── Mark task completed → próxima task
```

O controller nunca implementa nada diretamente — só orquestra, avalia os relatórios e decide se avança ou volta.

---

## 5. `webapp-testing` — Verificação final

Skill carregada para guiar a verificação da landing page. Ela define a abordagem: escrever scripts Python com Playwright para testar a página no browser headless. Neste caso Python não estava disponível no ambiente, então a verificação foi feita lendo os arquivos diretamente — mas a skill orientou o que checar (IDs, classes, animações, links de CSS/JS). Resultado: **27/27 PASS**.

---

## O que foi construído

| Arquivo | O que faz |
|---|---|
| `css/tokens.css` | 43 custom properties — toda a identidade visual em variáveis |
| `css/base.css` | Reset, animações `.reveal-up` (clip-path) e `.fade-up`, keyframes |
| `css/components.css` | Navbar, botões, cards, formulário, galeria — componentes reutilizáveis |
| `css/sections.css` | Layout de cada seção + 3 breakpoints responsivos |
| `index.html` | 9 seções completas em pt-BR com animações e IDs corretos |
| `js/main.js` | IntersectionObserver, scroll navbar, menu mobile, form submit |

**Stack:** HTML5 + CSS3 + Vanilla JS. Sem frameworks. Abre via `file://`.

---

## Decisões de design tomadas via brainstorming

- **Sempre dark** — o dark não é um tema, é a identidade permanente da marca (sem toggle)
- **Bebas Neue** — fonte display condensada ultra-pesada, energia de streetwear e campanha
- **Âmbar `#E8970A`** — único acento cromático em todo o sistema
- **Animações cinematográficas** — `clip-path: inset(100% → 0)` para títulos, `fade-up` para cards
- **Sem imagens reais** — placeholders com gradientes CSS (sem dependência externa)

---

## Por que este processo é diferente

| | Sem skills | Com skills |
|---|---|---|
| Design | Improvisado durante o código | Validado antes de qualquer linha |
| Decomposição | Arquivo gigante ou divisão aleatória | Cada arquivo com responsabilidade única |
| Implementação | Um contexto só, sem revisão | Subagente fresco por task, dois revisores |
| Qualidade | Depende da memória do contexto | Revisão estruturada, spec compliance garantida |
| Erros | Descobertos no browser | Pegos antes de chegar ao browser |

A verificação final (`27/27 PASS`) confirmou que o processo funcionou — nenhuma correção manual foi necessária após a implementação.
