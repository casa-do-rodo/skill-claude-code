# Spec: FacioFlow Agency LP

**Data:** 2026-05-09
**Pasta:** `facioflow-agency/`
**Stack:** Vanilla HTML/CSS/JS · sem framework · sem build step
**Audiência:** PMEs, startups e enterprise que já sabem que precisam de automação/IA

---

## Narrativa central

**Hook:** "Automação que começa pelo problema, não pela ferramenta."

Diferencial posicional: a FacioFlow mapeia a operação antes de propor qualquer tecnologia. Sem promessa vazia, sem stack inflada. A LP prova esse diferencial através da estrutura — começa pelo problema do cliente, não pelo catálogo de serviços.

---

## Estética: Editorial Dark

| Token | Valor |
|---|---|
| `--bg` | `#080808` |
| `--bg-elevated` | `#141414` |
| `--bg-surface` | `#1C1C1C` |
| `--accent` | `#2463EB` |
| `--text` | `#FFFFFF` |
| `--text-muted` | `#6B7280` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--font-display` | Tomorrow, 700 max |
| `--font-body` | Inter |

**Grain texture:** SVG inline `<feTurbulence>` com `baseFrequency="0.65"` e `stitchTiles="stitch"`, blend-mode overlay, opacity 0.04 — aplicado como `::before` no `body`. Sutil o suficiente pra não distrair, presente o suficiente pra eliminar a sensação de digital flat.

**Elemento gráfico único:** linha horizontal `2px × 40px` em `var(--accent)` acima de headings chave (hero, seções principais). Único elemento decorativo — sem partículas, sem gradientes espaciais, sem blobs.

**Diferença de superfície:** `#080808` → `#141414` → `#1C1C1C` — diferença de ~10 levels entre cada camada, visualmente perceptível ao contrário dos tokens da v3 (`#070A13` vs `#0C1020`).

---

## Estrutura de arquivos

```
facioflow-agency/
├── index.html
├── css/
│   ├── tokens.css
│   ├── base.css        (reset, grain keyframe, reveal, section spacing)
│   ├── components.css  (navbar, btns, service-block, process-step, benefit-card)
│   └── sections.css    (layout por seção, responsivo)
└── js/
    └── main.js         (navbar scroll, reveal IntersectionObserver)
```

---

## Seções (7)

### 1. Hero
- Navbar: logo FacioFlow (`../assets/logo_branco 1-1.svg`) + links (Serviços, Processo, Benefícios) + CTA "Fale com especialista"
- Accent line 2px azul
- H1 Tomorrow grande (`clamp(48px, 7vw, 88px)`): *"Automação que começa pelo problema, não pela ferramenta."*
- Sub Inter 18px: "Conectamos seus sistemas, eliminamos o trabalho repetitivo e aplicamos IA onde ela gera resultado mensurável. Sem promessa vazia. Sem stack inflada."
- 2 CTAs: `btn-primary` "Fale com um especialista" + `btn-ghost` "Ver serviços →"
- Sem elemento visual animado no hero — a tipografia é o visual

### 2. Por que agora? (Context)
- Background `--bg-elevated`
- Stat do Gartner em destaque tipográfico: "**US$ 2,5 trilhões** em IA até 2026. **40%** das aplicações empresariais com agentes integrados."
- Fonte: Gartner (label discreto)
- Copy: "A automação deixou de ser diferencial e virou a base. Empresas que não automatizam ficam para trás. Quem automatiza sem estratégia perde dinheiro."
- Posicionamento: "A FacioFlow existe para ocupar esse meio — traduzir o que sua operação precisa em automações reais, integradas e mensuráveis."

### 3. Serviços (4 blocos, alternating left/right)
Layout: `.service-block` com `display: grid; grid-template-columns: 1fr 1fr` — imagem par à esquerda, ímpar à direita.

| # | Serviço | Visual mockado |
|---|---|---|
| 1 | Automação de processos e integrações | Workflow com nodes conectados (SVG minimalista) |
| 2 | Agentes de IA e atendimento automatizado | Chat window simulado (WhatsApp-style) |
| 3 | Dashboards e inteligência de dados | Mini-dashboard com métricas (barras + números) |
| 4 | Plataformas sob medida | Code editor / app skeleton |

Copy real do site para cada serviço (texto completo da página `/servicos`).

### 4. Como trabalhamos (5 etapas)
Timeline horizontal com connector line entre etapas. Em mobile, vertical.

1. **Análise** — Entendemos seus objetivos e restrições
2. **Especificação** — Criamos o escopo e o cronograma
3. **Construção** — Desenvolvemos e testamos
4. **Lançamento** — Implementamos e treinamos a equipe
5. **Otimização Contínua** — Verificamos métricas e sugerimos melhorias

Etapa atual highlighted em `--accent`. As demais em `--bg-surface` com border.

### 5. Benefícios (6 itens, grid assimétrico)
Layout: 1 item grande (col-span 2) + 5 itens compactos num grid de 3 colunas.
O item grande: **Previsibilidade e confiabilidade** (o mais diferencial — "processos rodam do mesmo jeito todos os dias, sem depender de quem está no plantão").
Os 5 compactos: Velocidade · Escalabilidade · Visibilidade Real · Integração · Foco

### 6. Segurança (LGPD/GDPR)
Bloco compacto centrado, background `--bg-elevated`.
Copy: "A segurança dos seus dados é prioridade absoluta. Operação em conformidade com LGPD e GDPR."
Badge: `LGPD` + `GDPR` como labels discretos.

### 7. CTA Final
Background `--bg` com grain mais pronunciado (opacity 0.06).
H2: "Pronto para elevar os processos da sua empresa?"
Sub: "Vamos discutir seus desafios e construir um sistema que te ajuda a tomar decisões baseadas em dados."
CTA: "Fale com a FacioFlow" → link para contato

Footer: logo + links (Início · Serviços · Privacidade) + copyright

---

## Regras de design

- **Tomorrow weight 700 max** — sem 900 (causa RGB-split documentado)
- **Nenhum elemento visual genérico** — sem partículas, sem blobs, sem gradientes espaciais
- **Serviços em layout alternado** — nunca grid simétrico 2×2
- **Benefícios assimétricos** — 1 grande + 5 compactos, nunca 6 iguais
- **Grain texture presente em todas as seções** — via body::before global
- **Visually distinct da v3 e do site atual** — mesma marca, diferente linguagem visual

---

## Verificação (antes do finishing)

1. Servidor: `python -m http.server 8080`
2. Abrir `http://localhost:8080/facioflow-agency/`
3. Confirmar grain visível em todas as seções
4. Confirmar alternating layout dos serviços em 1280px e 768px
5. Confirmar benefícios assimétricos (1 grande + 5)
6. Confirmar responsivo mobile (375px)
7. `node scripts/audit_visual.mjs` (atualizar URL para `facioflow-agency/`)
