# Skills Demo — Claude Code

> Um estudo aplicado de como **dar processo a um AI assistant** muda o que sai do outro lado.

---

## A pergunta que esse repo responde

Você abre o Claude Code (ou outro AI assistant) e pede: *"constrói uma landing page sobre Ikigai"*.

Sem nenhuma orientação, ele te entrega **código que funciona**. Estética genérica, layout previsível, fonte Inter, gradientes roxos, três cards iguais — aquela "cara de IA" que você reconhece de longe.

Agora, e se em vez de pedir direto, você fizesse o assistant seguir um **processo estruturado** — brainstorming pra alinhar requisitos, frontend-design pra definir estética, audits pra pegar genericidade, subagentes paralelos pra aplicar fixes, verificação antes de finalizar?

A diferença de output é grande o suficiente pra valer um repo de estudo. **Isso é esse repo.**

---

## O que são "skills"?

No Claude Code, uma **skill** é um workflow reutilizável definido num arquivo markdown. Quando você pede algo, o Claude verifica se alguma skill instalada se aplica e segue o processo descrito nela. Se houver, ele invoca antes de fazer qualquer ação.

Exemplos do que uma skill faz:
- `brainstorming` força o Claude a alinhar requisitos com o usuário antes de codar
- `test-driven-development` exige que ele escreva o teste antes da implementação
- `frontend-design` dá direção estética pra evitar AI slop visual

São como prompts especializados que o próprio assistant decide quando usar. **Não é mágica — é processo.**

---

## O experimento

Quatro landing pages. Mesmo briefing. Ferramental progressivamente mais sofisticado.

| Pasta | Como foi feito | Skills usadas |
|---|---|---|
| `ikigai-landing/` | Pediu direto, sem orientação | 0 |
| `ikigai-landing-refined/` | Adicionou planejamento básico | 3 (brainstorming, writing-plans, executing-plans) |
| `ikigai-landing-w-skills/` | Pipeline completo com revisão | ~5 (+ frontend-design, verification) |
| `skills-landing/` | Pipeline + audit gate + 6 subagentes Opus 4.7 paralelos | ~15 |

> *Ikigai é um conceito japonês: "razão de ser". Bom tema pra landing porque é abstrato — o assistant precisa interpretar.*

**A diferença entre a primeira e a última você vê em segundos** abrindo as duas no browser. Tipografia, hierarquia, paleta, animações, micro-interações, acessibilidade — tudo muda.

A skills-landing (a quarta) é a única que **fala sobre o próprio ecossistema** que a gerou. Hero com o **F do FacioFlow** (marca do Carlos) vetorizado e animado: 3 ondas pulsando dos terminais do logo, 2 anéis orbitais com partículas viajando ao redor. Tudo SVG inline, sem framework.

> *As pastas `ikigai-*` são gitignored (não foram pushadas). O diff visível no GitHub é a `skills-landing/`. Mas o caminho até ela está documentado nos commits e nos `docs/superpowers/specs/`.*

---

## A descoberta principal

A skill `frontend-design` da Anthropic é **propositalmente lean** — ela só dá direção estética. Não cobre receitas técnicas (animação SVG, multi-layer effects, brand integration).

O caminho **não é inflar essa skill**, é **compor com skills especialistas**:

```
frontend-design (lean — direção estética)
       │
       ├─ design-taste-frontend (rigor técnico, anti-slop)
       ├─ svg-animations (SMIL, masks, keySplines, motion paths)
       └─ vercel-* (React/Next-specific patterns)
                 │
                 └─→ no fim do build:
                     │
                     frontend-audit-gate (custom, criado neste repo)
                     │
                     ├─ redesign-existing-projects (audit de gosto)
                     ├─ web-design-guidelines (compliance Vercel)
                     └─ svg-animations (audit técnico SVG)
                                │
                                └─→ findings agregados → aplica
                                                            │
                                                            ├─ manual, OU
                                                            └─ paralelo via ui-subagent (Opus 4.7 × N)
```

O `frontend-audit-gate` é uma skill que criamos pra **orquestrar os 3 audits** automaticamente antes de fechar um projeto frontend. Quando ele acha N findings independentes, despacha N subagentes Opus 4.7 em paralelo pra aplicar os fixes.

**Na prática, neste repo:** 11 fixes aplicados em ~67 segundos vs. ~3-4 minutos sequencial.

---

## O que tem instalado aqui

**38 skills** organizadas em 7 categorias funcionais:

| Categoria | O que cobre |
|---|---|
| Pipeline & Process | Como se trabalha (brainstorming → plan → execute → verify → ship) |
| Frontend Specialty | Estética, animações SVG, audits, padrões React/Next |
| Quality | TDD, debugging sistemático, code review |
| Stack: Supabase | DB, auth, RLS, edge functions, schema testing |
| Stack: n8n | Workflows, AI agents, validação, code nodes |
| Git & Branches | Worktrees, finalização de branches |
| Meta & Memory | Descobrir skills, persistir contexto entre sessões |

Plus **4 skills custom** (criadas pra este projeto) e **1 subagente custom** (`ui-subagent`, Opus 4.7 fixo, restrito a Read/Edit/Write em UI).

A referência completa com tabela detalhada de cada skill (origem, quando ativa, como conecta) está em **[`docs/SKILLS.md`](docs/SKILLS.md)**.

---

## Stack técnica das demos

- **HTML5 + CSS vanilla + JS vanilla** — sem framework, sem build step
- **CSS organizado** em `tokens.css` (design system) → `base.css` (reset, animations) → `components.css` (componentes) → `sections.css` (layouts)
- **SVG inline animado** com SMIL (`<animateMotion>`, `<animate>`, `clipPath`, gradient masks)
- **Vanilla JS** com IntersectionObserver pra scroll reveals

Sem React/Next até porque a skills-landing é uma LP estática. As skills `vercel-*` instaladas entrariam em projetos com state complexo (dashboards, apps).

---

## Estrutura do repo

```
skill-claude-code/
├── README.md                    ← você está aqui
├── CLAUDE.md                    ← decision tree do pipeline (lido pelo Claude Code)
├── docs/
│   ├── SKILLS.md                ← referência completa de todas as 38 skills
│   ├── superpowers/specs/       ← design specs (output do brainstorming)
│   └── audits/                  ← relatórios do frontend-audit-gate
├── skills-landing/              ← demo final (com hero do F animado)
├── facioflow-f-animated.svg     ← F animado standalone (reutilizável)
├── .claude/
│   ├── agents/ui-subagent.md    ← subagente UI Opus 4.7 fixo
│   └── skills/                  ← skills custom
└── .agents/skills/              ← skills instaladas via marketplace
```

As pastas `ikigai-landing*` ficam fora do git (são iterações de teste).

---

## Próximos passos

- Validar pipelines de **n8n** e **Supabase** num caso real (já temos as skills instaladas, mas nunca testamos end-to-end pra ver se precisam de orchestrator/subagent dedicado como o frontend tem)
- Aplicar o pipeline numa task **diferente de landing page** — provavelmente um dashboard pra validar o cenário "App / Dashboard" do decision tree
- Re-testar o `ui-subagent` em sessão nova (precisa de restart pra ser auto-discovered pelo Agent tool — limitação documentada)

---

## Referências

- **Skills detalhadas:** [`docs/SKILLS.md`](docs/SKILLS.md)
- **Pipeline guidance pro Claude Code:** [`CLAUDE.md`](CLAUDE.md)
- **Design specs (output do brainstorming):** [`docs/superpowers/specs/`](docs/superpowers/specs/)
- **Audit reports:** [`docs/audits/`](docs/audits/)

---

**Quem fez:** Carlos ([@carlostfive](https://github.com/casa-do-rodo)) — desenvolvedor por trás da [FacioFlow](#).
**Stack do repo:** Claude Code (Sonnet 4.6 + Opus 4.7) + skills marketplace + processo iterativo com humano no loop.
