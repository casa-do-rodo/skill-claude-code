# Spec: FacioFlow Dashboard — Analytics da Agência

**Data:** 2026-05-09
**Pasta:** `facioflow-dashboard/` (raiz do repo)
**Stack:** Next.js 15 (App Router) + React 19 + Supabase + ClickUp API
**Audiência:** Carlos + time FacioFlow (uso interno real, não cliente-facing nesta versão)

---

## Contexto e propósito

Primeira saída do padrão "vanilla LP" do projeto. Dashboard de uso interno real que reflete dados do **ClickUp workspace da FacioFlow**, conectando 3 spaces (IMBIL / Kopenhagen / FacioFlow Dropshipping LATAM) — 80 tasks distribuídas em 4 folders e 23 lists.

**Duplo objetivo:**
1. **Showcase** — testar pipeline com framework (Next.js), validar 3 skills `vercel-*` paradas e 3 skills Supabase paradas (`supabase`, `supabase-postgres-best-practices`, `supabase-schema-testing`)
2. **Uso interno real** — dashboard que Carlos usa pra ter visão única dos projetos da agência (substitui abrir ClickUp toda hora)

**Não é cliente-facing.** Não precisa de auth complexa. Anon access ou single-user fictício basta.

---

## Arquitetura

```
ClickUp (source of truth)
    ↓ [Edge Function: sync-clickup, cron 1h]
Supabase (cache + histórico)
    ↓ [Server Components + supabase-js]
Next.js Dashboard
```

- **ClickUp** mantém os dados reais (tasks, lists, folders, spaces)
- **Supabase** é cache (queries rápidas) + histórico (snapshots permitem charts "ao longo do tempo")
- **Next.js** lê só do Supabase. Nenhuma página chama ClickUp API direto

---

## Estética: Editorial Dark herdado

Mesma paleta da `facioflow-agency`:

| Token | Valor |
|---|---|
| `--bg` | `#080808` |
| `--bg-elevated` | `#141414` |
| `--bg-surface` | `#1C1C1C` |
| `--accent` | `#2463EB` |
| `--text` | `#FFFFFF` |
| `--text-muted` | `#6B7280` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--font-display` | Tomorrow, 700 |
| `--font-body` | Inter |
| Grain texture | SVG feTurbulence global, opacity 0.04 |

Charts usam: accent azul, cyan `#9DDBFF`, verde `#3ECF8E` (Supabase brand), vermelho `#EA4B48` (n8n brand) — aplicando `brand-aware-defaults` quando o stack for relevante.

---

## Layout: Sidebar collapsible + topbar

- **Sidebar** começa expandida (240px) com logo + 3 nav items + footer (settings); pode colapsar para 64px (icon-only) via toggle
- **Topbar** 56px com botão de toggle da sidebar à esquerda + breadcrumb + última sync timestamp à direita
- **Content area** com scroll independente

Estado da sidebar persistido em `localStorage` para sobreviver a refresh.

---

## Estrutura de arquivos (Next.js App Router)

```
facioflow-dashboard/
├── app/
│   ├── layout.tsx                  # root layout: sidebar + topbar
│   ├── page.tsx                    # Overview
│   ├── projetos/
│   │   ├── page.tsx                # Lista de spaces
│   │   └── [spaceId]/page.tsx      # Drill-down: módulos do space
│   ├── clientes/
│   │   └── page.tsx                # 3 cards de cliente
│   └── api/
│       └── sync-clickup/route.ts   # Trigger manual de sync (debug)
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
│   ├── charts/
│   │   ├── status-donut.tsx        # Donut chart
│   │   ├── space-bars.tsx          # Bar chart horizontal
│   │   └── animated-counter.tsx    # KPI counter animado
│   ├── kpi-card.tsx
│   ├── task-list.tsx
│   └── space-card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # browser client
│   │   ├── server.ts               # server component client
│   │   └── types.ts                # generated types from schema
│   └── clickup/
│       └── client.ts               # ClickUp API wrapper
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql
│   └── functions/
│       └── sync-clickup/index.ts   # Edge Function
├── public/
│   └── (assets)
└── package.json
```

---

## Páginas

### 1. Overview (`/`)

**Top: 4 KPIs (animated counters)**
- Total de tasks: `80`
- Tasks completas: `13` (16%)
- Projetos ativos: `3`
- Última sync: `há 12 min`

**Mid: 2 charts lado a lado**

**Status Donut (1/3 width):**
- Distribuição: complete (16%) / pendente (55%) / to do (28%) / update required (1%)
- Cores: verde / azul / cyan / amarelo

**Space Bars (2/3 width):**
- Horizontal bars: IMBIL (44) · FacioFlow Dropshipping (22) · Kopenhagen (14)
- Cada barra colorida pelo "tipo": cliente externo (azul) / interno (cyan)
- Hover mostra % progresso

**Bottom: 2 listas**

**Atividade recente (1/2):**
- 5 tasks mais recentemente atualizadas
- Cada item: nome · status badge · space · prioridade

**Próximas urgentes (1/2):**
- 5 tasks com `priority: urgent` ainda não completas
- Mostra qual stack (IMBIL marketing, IMBIL whatsapp, Dropshipping)

### 2. Projetos (`/projetos`)

Lista 3 cards de space (mesmo design dos `space-card`):
- IMBIL — 44 tasks · 0% complete · 17 módulos · cliente externo
- Kopenhagen — 14 tasks · 93% complete · 6 módulos · cliente externo
- FacioFlow Dropshipping LATAM — 22 tasks · 0% complete · 6 módulos · interno

Click no card → `/projetos/[spaceId]` drill-down:
- Header com nome do space + KPIs do space (tasks total, % complete, próximo marco)
- Lista de módulos (folders) com progress bar de cada
- Cada módulo expandível mostra tasks com status badges

### 3. Clientes (`/clientes`)

3 cards de cliente em grid:
- **IMBIL** — cliente externo · 17 módulos ativos · 44 tasks total · status: em desenvolvimento
- **Kopenhagen** — cliente externo · 6 módulos · 14 tasks (13 ✓) · status: entregue
- **FacioFlow Dropshipping** — interno · 6 módulos · 22 tasks · status: planejamento

Cada card: avatar (inicial estilizada com cor accent), nome, status badge, métricas chave, "última atividade".

---

## Schema Supabase

```sql
-- Mirror simplificado do ClickUp workspace
create table spaces (
  id text primary key,
  name text not null,
  type text check (type in ('client', 'internal')) default 'client',
  created_at timestamptz default now(),
  last_synced_at timestamptz default now()
);

create table folders (
  id text primary key,
  space_id text references spaces(id) on delete cascade,
  name text not null,
  last_synced_at timestamptz default now()
);

create table lists (
  id text primary key,
  folder_id text references folders(id) on delete cascade,
  name text not null,
  order_index int,
  last_synced_at timestamptz default now()
);

create table tasks (
  id text primary key,
  list_id text references lists(id) on delete cascade,
  name text not null,
  status text not null,
  priority text,
  due_date timestamptz,
  url text,
  date_created timestamptz,
  date_updated timestamptz,
  last_synced_at timestamptz default now()
);

create index tasks_list_id_idx on tasks(list_id);
create index tasks_status_idx on tasks(status);
create index tasks_priority_idx on tasks(priority) where priority is not null;

-- Histórico de syncs para charts "ao longo do tempo"
create table sync_log (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz default now(),
  finished_at timestamptz,
  spaces_synced int default 0,
  tasks_synced int default 0,
  status text check (status in ('running', 'success', 'error')) default 'running',
  error_message text
);

-- Snapshot diário de KPIs (para chart "evolução de tasks completas")
create table kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  captured_at timestamptz default now(),
  total_tasks int,
  completed_tasks int,
  by_status jsonb,  -- {"complete": 13, "pendente": 44, ...}
  by_space jsonb    -- {"IMBIL": {"total": 44, "complete": 0}, ...}
);

-- RLS aberto pra leitura (showcase, sem auth complexa)
alter table spaces enable row level security;
alter table folders enable row level security;
alter table lists enable row level security;
alter table tasks enable row level security;
alter table sync_log enable row level security;
alter table kpi_snapshots enable row level security;

create policy "public read" on spaces for select using (true);
create policy "public read" on folders for select using (true);
create policy "public read" on lists for select using (true);
create policy "public read" on tasks for select using (true);
create policy "public read" on sync_log for select using (true);
create policy "public read" on kpi_snapshots for select using (true);

-- Escrita só via service role (Edge Function usa SUPABASE_SERVICE_KEY)
```

---

## Sync strategy

**Edge Function `sync-clickup`:**
1. Authenticated com `CLICKUP_API_TOKEN` (env var)
2. Busca workspace hierarchy + tasks de cada space
3. Upsert em `spaces`, `folders`, `lists`, `tasks` (idempotente — mesmo registro re-rodado não duplica)
4. Insere row em `sync_log` no início e finaliza com `finished_at`
5. Captura snapshot de KPIs em `kpi_snapshots` (1× por dia, dedup por `date_trunc('day', captured_at)`)

**Cron schedule:**
- Supabase pg_cron OU GitHub Actions com `curl` no endpoint
- Default: a cada 1h
- Trigger manual via `/api/sync-clickup` (botão na topbar para Carlos forçar)

---

## Charts library: custom SVG (não Recharts)

**Decisão:** custom SVG inline em vez de Recharts/Tremor.

**Por quê:**
- Editorial Dark é específico — bibliotecas vêm com defaults difíceis de matar
- Já temos skill `interactive-mockups` codificando 4 templates (workflow, chat, dashboard, code) — Dashboard cabe no template "dashboard"
- Já temos `svg-animations` + `svg-animations-pitfalls` para animação de chart entry
- Bundle menor (sem dependências Recharts: ~80kb gzip)
- Tipos só os que precisamos: 1 donut, 1 bar horizontal, 1 line/area pra histórico futuro

**Animações:**
- KPIs: counter `requestAnimationFrame` + ease-out cúbico (template do `interactive-mockups`)
- Bars: `transform: scaleX()` from left com stagger (Estratégia C do `reveal-patterns`)
- Donut: `stroke-dashoffset` desenhando o arco at fade-in

---

## Verificação

1. Servidor: `pnpm dev` (Next.js dev server)
2. Abrir `http://localhost:3000` e validar:
   - Sidebar abre/fecha, estado persiste em refresh
   - Topbar mostra "última sync há X min"
   - Overview: 4 KPIs animam, 2 charts renderizam, 2 listas com dados reais
   - `/projetos`: 3 cards com progresso correto
   - `/projetos/[spaceId]`: drill-down funciona
   - `/clientes`: 3 cards corretos
   - Responsivo: 768px (sidebar vira drawer), 375px (mobile)
3. `node scripts/audit_visual.mjs --project=facioflow-dashboard --port=3000` (script aceita porta custom)
4. Frontend audit gate híbrido com Opus
5. Verificação Supabase:
   - Migration aplicada
   - Edge Function deployada e responde 200
   - Cron rodando (verificar `sync_log` ter entries recentes)
6. `verification-before-completion`: tudo ok no browser

---

## Decisões deferidas pra discussão antes do plano

- **Supabase project**: criar novo? Usar existente do Carlos?
- **Org Supabase**: qual usar?
- **Hosting Next.js**: Vercel? Local-only?
- **Cron Edge Function**: pg_cron interno do Supabase ou GitHub Actions?
- **Auth**: confirmamos que é anon-only nesta versão? Ou single-user com magic link?

---

## Skills relevantes neste projeto

- `frontend-design` (lean, direção estética)
- `vercel-composition-patterns` (compound components pra cards/charts)
- `vercel-react-best-practices` (Server Components, streaming, perf)
- `vercel-react-view-transitions` (transições entre `/projetos` e drill-down)
- `interactive-mockups` (template "dashboard" com counter + bars)
- `svg-animations` + `svg-animations-pitfalls` (charts custom)
- `reveal-patterns` (Estratégia C pra charts e KPIs)
- `brand-aware-defaults` (n8n vermelho, Supabase verde nos charts)
- `supabase` (schema, RLS, Edge Function)
- `supabase-postgres-best-practices` (índices, queries)
- `supabase-schema-testing` (TDD na migration antes de aplicar)
- `frontend-audit-gate` (híbrido, antes do finishing)
- `verification-before-completion` (obrigatório)
