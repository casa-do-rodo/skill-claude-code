# Spec: Skills Claude Code — Landing Page Demo

**Data:** 2026-05-08
**Objetivo:** Landing page que demonstra o ecossistema de skills do Claude Code para o GitHub do projeto.

---

## Contexto

Quarta demo do projeto (após `ikigai-landing`, `ikigai-landing-refined`, `ikigai-landing-w-skills`). Esta é a única que fala sobre o próprio ecossistema de skills — a página é o produto que demonstra a si mesma. Público: devs (como o Angelo) que vão ver o repositório no GitHub.

---

## Conceito

**Jornada de transformação** — o visitante sente o impacto antes de entender a mecânica. Começa com o claim emocional, depois prova com evidência.

- **Tema:** Claude Code / skills ecosystem
- **Objetivo:** equilibrar explicação do conceito + demonstração de qualidade
- **Tom:** inspiracional e aspiracional ("seu AI dev ficou mais poderoso")
- **Idioma:** Português

---

## Estrutura — 6 Seções

### 1. Hero
- Headline: **"Seu AI dev ficou mais poderoso."**
- Subtítulo: Skills transformam o Claude Code num pipeline de engenharia estruturado.
- CTA primário: "Ver o Pipeline →" (ancora para seção 3)

### 2. O Problema
- Título: "AI sem estrutura não escala"
- 3 cards com ícones SVG stroke-based:
  - **Output genérico** — respostas sem contexto do projeto
  - **Sem processo** — cada sessão recomeça do zero
  - **Sem memória** — conhecimento do projeto se perde

### 3. O Pipeline
- Título: "Conheça o pipeline"
- Flow visual horizontal com 4 nós conectados por setas:
  - `brainstorming` → `frontend-design` → `writing-plans` → `execução`
- Cada nó com ícone SVG + nome da skill
- Nó de execução destacado com acento azul

### 4. Antes / Depois
- Título: "A diferença em prática"
- Comparação lado a lado implementada como mockup CSS (as pastas de demo estão no `.gitignore`, sem screenshots disponíveis):
  - Esquerda: representação visual minimalista de uma página sem design intencional
  - Direita: representação visual rica com tipografia, hierarquia e acento de cor
- Labels: "❌ Sem skills" / "✓ Com pipeline completo"

### 5. O Arsenal
- Título: "Skills instaladas"
- Grid de tags com todas as skills do projeto agrupadas por categoria:
  - **Pipeline:** brainstorming, frontend-design, writing-plans, executing-plans, subagent-driven-development
  - **Qualidade:** tdd, systematic-debugging, requesting-code-review, receiving-code-review, verification-before-completion
  - **Stack:** supabase, supabase-postgres-best-practices, n8n-workflow-patterns, n8n-mcp-tools-expert, + 7 mais
  - **Git:** finishing-a-development-branch, using-git-worktrees

### 6. CTA Final
- Frase: "Pronto pra elevar seu AI dev?"
- Botão primário: "Ver no GitHub"
- Botão secundário: "Explorar Skills"

---

## Design System

### Cores
```css
--bg:       #070A13   /* dark navy profundo — fundo */
--accent:   #2463EB   /* azul elétrico — acento principal */
--text:     #FFFFFF   /* branco — texto primário */
--muted:    #8B949E   /* cinza — texto secundário */
--surface:  #0D1220   /* superfície elevada — cards */
--border:   #1A2235   /* bordas sutis */
```

### Tipografia
- **Tomorrow** (Google Fonts) — títulos, labels, botões (weights: 700, 900)
- **Inter** (Google Fonts) — corpo, subtítulos (weights: 400, 500)

### Ícones
- SVG inline, stroke-based (estilo Feather Icons)
- `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`
- Sem fill, sem emojis

### Animações
- Entrada escalonada por seção (`animation-delay` incremental, `translateY` + `opacity`)
- Hover nos cards: `translateY(-2px)` + `box-shadow` com glow azul
- Pipeline: hover nos nós com `border-color` azul

---

## Arquitetura de Arquivos

Mesma estrutura das demos anteriores, pasta `skills-landing/`:

```
skills-landing/
  index.html
  css/
    tokens.css      — variáveis CSS (cores, tipografia, espaçamento)
    base.css        — reset, keyframes, utilitários
    components.css  — navbar, botões, cards, tags
    sections.css    — layout por seção + responsivo
  js/
    main.js         — IntersectionObserver, scroll, mobile menu
```

- Vanilla HTML/CSS/JS, sem build step
- Sem dependências externas além das Google Fonts
- Abre via `file://` ou servidor estático local

---

## Decisões de Design (travadas)

- Sempre dark, sem toggle de tema
- Tomorrow + Inter como par tipográfico fixo
- `#2463EB` como único acento — sem âmbar, sem verde
- Ícones SVG stroke-based — nunca emojis
