# FacioFlow Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Visual tasks (HTML, CSS, SVG, React components com intenção estética) MUST go to ui-subagent (Opus 4.7).** A sessão principal coordena; o Opus executa o visual.

**Goal:** Build `facioflow-dashboard/` — Next.js 15 dashboard interno conectando 3 spaces ClickUp via Supabase mirror, com Editorial Dark herdado e charts custom SVG.

**Architecture:** ClickUp (source-of-truth) → Edge Function `sync-clickup` (cron 1h via pg_cron) → Supabase schema `facioflow_dashboard` (cache + histórico) → Next.js App Router (Server Components lendo via supabase-js).

**Tech Stack:** Next.js 15 · React 19 · TypeScript · @supabase/ssr · @supabase/supabase-js · Vanilla CSS (tokens herdados de `facioflow-agency`) · Custom SVG charts · pnpm

**Spec:** `docs/superpowers/specs/2026-05-09-facioflow-dashboard-design.md`

---

## Arquivos a criar

| Arquivo | Responsabilidade |
|---|---|
| `facioflow-dashboard/package.json` | Deps + scripts |
| `facioflow-dashboard/next.config.ts` | Config Next.js |
| `facioflow-dashboard/tsconfig.json` | TS config |
| `facioflow-dashboard/.env.local` | Env vars (não commitar) |
| `facioflow-dashboard/styles/tokens.css` | Design tokens Editorial Dark |
| `facioflow-dashboard/styles/base.css` | Reset + grain texture + reveal |
| `facioflow-dashboard/app/layout.tsx` | Root layout (sidebar + topbar) |
| `facioflow-dashboard/app/page.tsx` | Overview (Server Component) |
| `facioflow-dashboard/app/projetos/page.tsx` | Lista spaces |
| `facioflow-dashboard/app/projetos/[spaceId]/page.tsx` | Drill-down |
| `facioflow-dashboard/app/clientes/page.tsx` | Cards de cliente |
| `facioflow-dashboard/app/api/sync-clickup/route.ts` | Trigger manual sync |
| `facioflow-dashboard/components/layout/sidebar.tsx` | Sidebar collapsible |
| `facioflow-dashboard/components/layout/topbar.tsx` | Topbar |
| `facioflow-dashboard/components/charts/status-donut.tsx` | Donut chart SVG |
| `facioflow-dashboard/components/charts/space-bars.tsx` | Bar chart horizontal |
| `facioflow-dashboard/components/charts/animated-counter.tsx` | KPI counter |
| `facioflow-dashboard/components/kpi-card.tsx` | Card de KPI |
| `facioflow-dashboard/components/space-card.tsx` | Card de space/cliente |
| `facioflow-dashboard/components/task-list.tsx` | Lista de tasks |
| `facioflow-dashboard/lib/supabase/server.ts` | Server Component client |
| `facioflow-dashboard/lib/supabase/client.ts` | Browser client |
| `facioflow-dashboard/lib/supabase/types.ts` | Types gerados do schema |
| `facioflow-dashboard/lib/clickup/client.ts` | ClickUp API wrapper |
| `facioflow-dashboard/lib/clickup/types.ts` | Types ClickUp API |
| `facioflow-dashboard/supabase/functions/sync-clickup/index.ts` | Edge Function |

---

## Task 1: Scaffold Next.js + dependências + estilos base

**Files:**
- Create: `facioflow-dashboard/package.json`, `facioflow-dashboard/next.config.ts`, `facioflow-dashboard/tsconfig.json`, `facioflow-dashboard/styles/tokens.css`, `facioflow-dashboard/styles/base.css`, `facioflow-dashboard/.env.local`, `facioflow-dashboard/.gitignore`

- [ ] **Step 1: Criar diretório e inicializar Next.js**

Rodar na raiz do repo:
```bash
cd "C:/Users/Carlos/Documents/Skill Claude Code"
mkdir -p facioflow-dashboard && cd facioflow-dashboard
pnpm create next-app@latest . --ts --app --no-tailwind --no-eslint --no-src-dir --import-alias "@/*" --turbopack
```

Quando perguntar sobre Tailwind, escolher **No**. ESLint **No** (vamos manter simples). Turbopack **Yes**.

- [ ] **Step 2: Instalar deps Supabase**

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 3: Criar `.env.local`** (não commitar — adicionar ao .gitignore)

```env
NEXT_PUBLIC_SUPABASE_URL=https://jzzirxvhnvczqnscnetr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get_from_supabase_dashboard>
SUPABASE_SERVICE_ROLE_KEY=<get_from_supabase_dashboard>
CLICKUP_API_TOKEN=<get_from_clickup_settings>
```

Get keys via MCP: `mcp__claude_ai_Supabase__get_publishable_keys` (project_id: `jzzirxvhnvczqnscnetr`). Carlos provê `CLICKUP_API_TOKEN` separadamente.

- [ ] **Step 4: Confirmar `.gitignore` cobre `.env.local`**

Next.js já cria com `.env*.local` por default. Verificar:
```bash
grep -q ".env*.local" facioflow-dashboard/.gitignore && echo "OK" || echo "FALTA"
```

- [ ] **Step 5: Criar `styles/tokens.css`**

Copiar de `facioflow-agency/css/tokens.css` e adicionar tokens de marca extras:

```css
:root {
  --bg:              #080808;
  --bg-elevated:     #141414;
  --bg-surface:      #1C1C1C;

  --accent:          #2463EB;
  --accent-dim:      rgba(36, 99, 235, 0.12);
  --accent-glow:     rgba(36, 99, 235, 0.24);
  --accent-hover:    #1D4FD8;
  --accent-text:     #4F84F0;

  /* Brand colors para charts (brand-aware-defaults) */
  --supabase:        #3ECF8E;
  --supabase-dim:    rgba(62, 207, 142, 0.12);
  --n8n:             #EA4B48;
  --n8n-dim:         rgba(234, 75, 72, 0.12);
  --cyan:            #9DDBFF;

  --text:            #FFFFFF;
  --text-muted:      #6B7280;
  --text-faint:      #374151;

  --border:          rgba(255, 255, 255, 0.08);
  --border-accent:   rgba(36, 99, 235, 0.3);

  --font-display:    'Tomorrow', sans-serif;
  --font-body:       'Inter', sans-serif;
  --font-mono:       'SF Mono', 'Fira Code', Consolas, monospace;

  --space-1:  4px;   --space-2:  8px;   --space-3:  12px;
  --space-4:  16px;  --space-5:  20px;  --space-6:  24px;
  --space-8:  32px;  --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;  --space-24: 96px;

  --radius-sm: 4px;
  --radius:    8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  --trans:      0.2s ease;
  --trans-slow: 0.45s ease;

  /* Sidebar */
  --sidebar-width-expanded: 240px;
  --sidebar-width-collapsed: 64px;
  --topbar-height: 56px;
}
```

- [ ] **Step 6: Criar `styles/base.css`**

Copiar adaptado de `facioflow-agency/css/base.css` — reset + grain texture + reveal + section-label/title/sub. Adicionar imports do Google Fonts no topo.

- [ ] **Step 7: Atualizar `app/layout.tsx` para importar globals**

Substituir conteúdo padrão por:
```tsx
import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/base.css";

export const metadata: Metadata = {
  title: "FacioFlow Dashboard",
  description: "Analytics interno da agência FacioFlow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tomorrow:wght@700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Verificar dev server inicia**

```bash
cd facioflow-dashboard && pnpm dev
```

Expected: dev server em `http://localhost:3000`, página padrão Next.js com fonts Tomorrow/Inter aplicadas.

Encerrar com Ctrl+C.

- [ ] **Step 9: Commit**

```bash
cd "C:/Users/Carlos/Documents/Skill Claude Code"
git add facioflow-dashboard/
git commit -m "scaffold: facioflow-dashboard Next.js 15 + Supabase deps + tokens herdados"
```

---

## Task 2: Schema Supabase + RLS + permissions

**Files:**
- Create: migration aplicada via `mcp__claude_ai_Supabase__apply_migration` (não cria arquivo local nesta etapa, fica no projeto Supabase)

**Pré-requisito:** Carlos precisa **expor o schema `facioflow_dashboard`** no painel Supabase: **Settings → API → Exposed schemas** — adicionar `facioflow_dashboard` à lista (default só vem `public`). Sem isso o supabase-js não consegue queryar.

- [ ] **Step 1: Aplicar migration via MCP Supabase**

Tool: `mcp__claude_ai_Supabase__apply_migration`
- `project_id`: `jzzirxvhnvczqnscnetr`
- `name`: `0001_initial_schema_facioflow_dashboard`
- `query`:

```sql
create schema if not exists facioflow_dashboard;
grant usage on schema facioflow_dashboard to anon, authenticated, service_role;
alter default privileges in schema facioflow_dashboard grant select on tables to anon, authenticated;
alter default privileges in schema facioflow_dashboard grant all on tables to service_role;

create table facioflow_dashboard.spaces (
  id text primary key,
  name text not null,
  type text check (type in ('client', 'internal')) default 'client',
  created_at timestamptz default now(),
  last_synced_at timestamptz default now()
);

create table facioflow_dashboard.folders (
  id text primary key,
  space_id text references facioflow_dashboard.spaces(id) on delete cascade,
  name text not null,
  last_synced_at timestamptz default now()
);

create table facioflow_dashboard.lists (
  id text primary key,
  folder_id text references facioflow_dashboard.folders(id) on delete cascade,
  name text not null,
  order_index int,
  last_synced_at timestamptz default now()
);

create table facioflow_dashboard.tasks (
  id text primary key,
  list_id text references facioflow_dashboard.lists(id) on delete cascade,
  name text not null,
  status text not null,
  priority text,
  due_date timestamptz,
  url text,
  date_created timestamptz,
  date_updated timestamptz,
  last_synced_at timestamptz default now()
);

create index tasks_list_id_idx on facioflow_dashboard.tasks(list_id);
create index tasks_status_idx on facioflow_dashboard.tasks(status);
create index tasks_priority_idx on facioflow_dashboard.tasks(priority) where priority is not null;

create table facioflow_dashboard.sync_log (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz default now(),
  finished_at timestamptz,
  spaces_synced int default 0,
  tasks_synced int default 0,
  status text check (status in ('running', 'success', 'error')) default 'running',
  error_message text
);

create table facioflow_dashboard.kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  captured_at timestamptz default now(),
  total_tasks int,
  completed_tasks int,
  by_status jsonb,
  by_space jsonb
);

alter table facioflow_dashboard.spaces enable row level security;
alter table facioflow_dashboard.folders enable row level security;
alter table facioflow_dashboard.lists enable row level security;
alter table facioflow_dashboard.tasks enable row level security;
alter table facioflow_dashboard.sync_log enable row level security;
alter table facioflow_dashboard.kpi_snapshots enable row level security;

create policy "public read" on facioflow_dashboard.spaces for select using (true);
create policy "public read" on facioflow_dashboard.folders for select using (true);
create policy "public read" on facioflow_dashboard.lists for select using (true);
create policy "public read" on facioflow_dashboard.tasks for select using (true);
create policy "public read" on facioflow_dashboard.sync_log for select using (true);
create policy "public read" on facioflow_dashboard.kpi_snapshots for select using (true);
```

- [ ] **Step 2: Verificar tabelas existem (RED→GREEN test)**

Tool: `mcp__claude_ai_Supabase__execute_sql`
- `project_id`: `jzzirxvhnvczqnscnetr`
- `query`:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'facioflow_dashboard'
ORDER BY table_name;
```

Expected: 6 rows — `folders`, `kpi_snapshots`, `lists`, `sync_log`, `spaces`, `tasks`.

- [ ] **Step 3: Verificar policies aplicadas**

```sql
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'facioflow_dashboard'
ORDER BY tablename;
```

Expected: 6 rows, todas com policy "public read".

- [ ] **Step 4: Confirmar com Carlos que `facioflow_dashboard` está exposto no painel**

Bloqueio se não estiver: chamadas supabase-js falham com schema not found.

---

## Task 3: ClickUp API client wrapper

**Files:**
- Create: `facioflow-dashboard/lib/clickup/types.ts`, `facioflow-dashboard/lib/clickup/client.ts`

- [ ] **Step 1: Criar types.ts**

```ts
// facioflow-dashboard/lib/clickup/types.ts
export type ClickUpSpace = {
  id: string;
  name: string;
};

export type ClickUpFolder = {
  id: string;
  name: string;
  space: { id: string; name: string };
};

export type ClickUpList = {
  id: string;
  name: string;
  orderindex: number | string;
  folder: { id: string; name: string };
  space: { id: string; name: string };
};

export type ClickUpTask = {
  id: string;
  name: string;
  status: { status: string };
  priority: { priority: string } | null;
  due_date: string | null;
  url: string;
  date_created: string;
  date_updated: string;
  list: { id: string };
};
```

- [ ] **Step 2: Criar client.ts**

```ts
// facioflow-dashboard/lib/clickup/client.ts
import type { ClickUpSpace, ClickUpFolder, ClickUpList, ClickUpTask } from "./types";

const BASE = "https://api.clickup.com/api/v2";

function headers(token: string) {
  return { Authorization: token, "Content-Type": "application/json" };
}

export async function getSpaces(token: string, teamId: string): Promise<ClickUpSpace[]> {
  const res = await fetch(`${BASE}/team/${teamId}/space?archived=false`, { headers: headers(token) });
  if (!res.ok) throw new Error(`ClickUp getSpaces failed: ${res.status}`);
  const data = await res.json();
  return data.spaces;
}

export async function getFolders(token: string, spaceId: string): Promise<ClickUpFolder[]> {
  const res = await fetch(`${BASE}/space/${spaceId}/folder?archived=false`, { headers: headers(token) });
  if (!res.ok) throw new Error(`ClickUp getFolders failed: ${res.status}`);
  const data = await res.json();
  return data.folders;
}

export async function getLists(token: string, folderId: string): Promise<ClickUpList[]> {
  const res = await fetch(`${BASE}/folder/${folderId}/list?archived=false`, { headers: headers(token) });
  if (!res.ok) throw new Error(`ClickUp getLists failed: ${res.status}`);
  const data = await res.json();
  return data.lists;
}

export async function getTasks(token: string, listId: string): Promise<ClickUpTask[]> {
  // ClickUp pagination: 100 tasks por page
  const tasks: ClickUpTask[] = [];
  let page = 0;
  while (true) {
    const res = await fetch(
      `${BASE}/list/${listId}/task?archived=false&include_closed=true&page=${page}`,
      { headers: headers(token) }
    );
    if (!res.ok) throw new Error(`ClickUp getTasks failed: ${res.status}`);
    const data = await res.json();
    tasks.push(...data.tasks);
    if (data.tasks.length < 100) break;
    page++;
  }
  return tasks;
}
```

- [ ] **Step 3: Commit**

```bash
git add facioflow-dashboard/lib/clickup/
git commit -m "feat: ClickUp API client wrapper (spaces, folders, lists, tasks)"
```

---

## Task 4: Edge Function `sync-clickup`

**Files:**
- Create: `facioflow-dashboard/supabase/functions/sync-clickup/index.ts`

- [ ] **Step 1: Criar Edge Function**

```ts
// facioflow-dashboard/supabase/functions/sync-clickup/index.ts
import { createClient } from "jsr:@supabase/supabase-js@2";

const CLICKUP_BASE = "https://api.clickup.com/api/v2";
const CLICKUP_TEAM_ID = "90171171297";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const clickupToken = Deno.env.get("CLICKUP_API_TOKEN")!;

async function clickupFetch(path: string) {
  const res = await fetch(`${CLICKUP_BASE}${path}`, {
    headers: { Authorization: clickupToken, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`ClickUp ${path}: ${res.status}`);
  return res.json();
}

Deno.serve(async () => {
  const sb = createClient(supabaseUrl, serviceKey, {
    db: { schema: "facioflow_dashboard" },
  });

  // 1. Iniciar sync_log
  const { data: log } = await sb
    .from("sync_log")
    .insert({ status: "running" })
    .select()
    .single();

  let spacesSynced = 0;
  let tasksSynced = 0;

  try {
    // 2. Buscar spaces
    const { spaces } = await clickupFetch(`/team/${CLICKUP_TEAM_ID}/space?archived=false`);

    for (const space of spaces) {
      const type = space.name === "FacioFlow" ? "internal" : "client";
      await sb.from("spaces").upsert({
        id: space.id,
        name: space.name,
        type,
        last_synced_at: new Date().toISOString(),
      });
      spacesSynced++;

      // 3. Folders do space
      const { folders } = await clickupFetch(`/space/${space.id}/folder?archived=false`);
      for (const folder of folders) {
        await sb.from("folders").upsert({
          id: folder.id,
          space_id: space.id,
          name: folder.name,
          last_synced_at: new Date().toISOString(),
        });

        // 4. Lists do folder
        const { lists } = await clickupFetch(`/folder/${folder.id}/list?archived=false`);
        for (const list of lists) {
          const orderIdx = typeof list.orderindex === "string"
            ? parseInt(list.orderindex, 10) || 0
            : list.orderindex || 0;
          await sb.from("lists").upsert({
            id: list.id,
            folder_id: folder.id,
            name: list.name,
            order_index: orderIdx,
            last_synced_at: new Date().toISOString(),
          });

          // 5. Tasks da list (paginado)
          let page = 0;
          while (true) {
            const { tasks } = await clickupFetch(
              `/list/${list.id}/task?archived=false&include_closed=true&page=${page}`
            );
            for (const task of tasks) {
              await sb.from("tasks").upsert({
                id: task.id,
                list_id: list.id,
                name: task.name,
                status: task.status?.status || "unknown",
                priority: task.priority?.priority || null,
                due_date: task.due_date ? new Date(parseInt(task.due_date)).toISOString() : null,
                url: task.url,
                date_created: task.date_created
                  ? new Date(parseInt(task.date_created)).toISOString()
                  : null,
                date_updated: task.date_updated
                  ? new Date(parseInt(task.date_updated)).toISOString()
                  : null,
                last_synced_at: new Date().toISOString(),
              });
              tasksSynced++;
            }
            if (tasks.length < 100) break;
            page++;
          }
        }
      }
    }

    // 6. KPI snapshot (1 por dia, dedup)
    const today = new Date().toISOString().slice(0, 10);
    const { data: existingSnapshot } = await sb
      .from("kpi_snapshots")
      .select("id")
      .gte("captured_at", `${today}T00:00:00Z`)
      .lt("captured_at", `${today}T23:59:59Z`)
      .maybeSingle();

    if (!existingSnapshot) {
      const { count: total } = await sb.from("tasks").select("*", { count: "exact", head: true });
      const { count: completed } = await sb
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "complete");
      await sb.from("kpi_snapshots").insert({
        total_tasks: total,
        completed_tasks: completed,
        by_status: {},
        by_space: {},
      });
    }

    // 7. Finalizar sync_log
    await sb
      .from("sync_log")
      .update({
        finished_at: new Date().toISOString(),
        spaces_synced: spacesSynced,
        tasks_synced: tasksSynced,
        status: "success",
      })
      .eq("id", log!.id);

    return new Response(
      JSON.stringify({ success: true, spaces_synced: spacesSynced, tasks_synced: tasksSynced }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    await sb
      .from("sync_log")
      .update({
        finished_at: new Date().toISOString(),
        status: "error",
        error_message: error,
      })
      .eq("id", log!.id);

    return new Response(
      JSON.stringify({ success: false, error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

- [ ] **Step 2: Deploy Edge Function via MCP**

Tool: `mcp__claude_ai_Supabase__deploy_edge_function`
- `project_id`: `jzzirxvhnvczqnscnetr`
- `name`: `sync-clickup`
- `entrypoint_path`: `index.ts`
- `files`: `[{name: "index.ts", content: <full content above>}]`

- [ ] **Step 3: Adicionar `CLICKUP_API_TOKEN` aos secrets do Supabase**

Carlos faz isso manualmente no painel: **Settings → Edge Functions → Secrets → Add new secret** com nome `CLICKUP_API_TOKEN` e valor do token dele.

- [ ] **Step 4: Commit**

```bash
git add facioflow-dashboard/supabase/
git commit -m "feat: Edge Function sync-clickup — pull workspace + upsert + log"
```

---

## Task 5: Trigger primeiro sync e validar dados

**Files:** nenhum criado — verificação E2E

- [ ] **Step 1: Trigger Edge Function**

Tool: `mcp__claude_ai_Supabase__execute_sql`
- `project_id`: `jzzirxvhnvczqnscnetr`
- `query`:
```sql
SELECT net.http_post(
  url := 'https://jzzirxvhnvczqnscnetr.supabase.co/functions/v1/sync-clickup',
  headers := jsonb_build_object(
    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
  )
) as request_id;
```

OU (mais simples) Carlos roda via curl:
```bash
curl -X POST https://jzzirxvhnvczqnscnetr.supabase.co/functions/v1/sync-clickup \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```

- [ ] **Step 2: Aguardar sync terminar e validar via SQL**

```sql
SELECT
  (SELECT COUNT(*) FROM facioflow_dashboard.spaces) as spaces,
  (SELECT COUNT(*) FROM facioflow_dashboard.folders) as folders,
  (SELECT COUNT(*) FROM facioflow_dashboard.lists) as lists,
  (SELECT COUNT(*) FROM facioflow_dashboard.tasks) as tasks,
  (SELECT status FROM facioflow_dashboard.sync_log ORDER BY started_at DESC LIMIT 1) as last_sync_status,
  (SELECT tasks_synced FROM facioflow_dashboard.sync_log ORDER BY started_at DESC LIMIT 1) as last_tasks_synced;
```

Expected:
- spaces: 3 (IMBIL, Kopenhagen, FacioFlow)
- folders: 4 (Marketing, WhatsApp, Kop, Dropshipping LATAM)
- lists: 23
- tasks: 80
- last_sync_status: success
- last_tasks_synced: 80

- [ ] **Step 3: Verificar tipos de space classificados corretos**

```sql
SELECT name, type FROM facioflow_dashboard.spaces ORDER BY name;
```

Expected:
- FacioFlow → internal
- IMBIL → client
- Kopenhagen → client

- [ ] **Step 4: Se algum count divergir, debugar via `sync_log`**

```sql
SELECT * FROM facioflow_dashboard.sync_log ORDER BY started_at DESC LIMIT 5;
```

Procurar `status: error` e ler `error_message`.

---

## Task 6: pg_cron agendamento de sync (1h)

**Files:** migration aplicada via MCP

- [ ] **Step 1: Verificar se pg_cron está habilitado**

Tool: `mcp__claude_ai_Supabase__list_extensions` (project_id: `jzzirxvhnvczqnscnetr`).

Procurar `pg_cron` na lista. Se não estiver `installed`, próximo step instala.

- [ ] **Step 2: Aplicar migration que habilita pg_cron + agenda job**

Tool: `mcp__claude_ai_Supabase__apply_migration`
- `project_id`: `jzzirxvhnvczqnscnetr`
- `name`: `0002_pg_cron_sync_clickup`
- `query`:

```sql
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Job rodando a cada 1h (no minuto 0)
select cron.schedule(
  'sync-clickup-hourly',
  '0 * * * *',
  $$
    select net.http_post(
      url := 'https://jzzirxvhnvczqnscnetr.supabase.co/functions/v1/sync-clickup',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      )
    );
  $$
);
```

**Nota:** `service_role_key` precisa estar acessível via `current_setting`. Se falhar, alternativa: hardcode o token na query (não ideal — Carlos pode rotacionar via UI Supabase depois).

- [ ] **Step 3: Verificar job agendado**

```sql
SELECT jobname, schedule, active FROM cron.job WHERE jobname = 'sync-clickup-hourly';
```

Expected: 1 row, active=true.

---

## Task 7: Supabase clients para Next.js

**Files:**
- Create: `facioflow-dashboard/lib/supabase/server.ts`, `facioflow-dashboard/lib/supabase/client.ts`, `facioflow-dashboard/lib/supabase/types.ts`

- [ ] **Step 1: Gerar types do schema**

Tool: `mcp__claude_ai_Supabase__generate_typescript_types` (project_id: `jzzirxvhnvczqnscnetr`)

Salvar output em `facioflow-dashboard/lib/supabase/types.ts`.

**Importante:** o tool gera types para schema `public` por default. Precisamos do schema `facioflow_dashboard`. Se o tool não suportar custom schema, criar types manualmente baseados no schema da Task 2.

Fallback manual:
```ts
// facioflow-dashboard/lib/supabase/types.ts
export type Database = {
  facioflow_dashboard: {
    Tables: {
      spaces: {
        Row: { id: string; name: string; type: 'client' | 'internal'; created_at: string; last_synced_at: string };
        Insert: { id: string; name: string; type?: 'client' | 'internal' };
        Update: Partial<{ name: string; type: 'client' | 'internal' }>;
      };
      folders: {
        Row: { id: string; space_id: string; name: string; last_synced_at: string };
        Insert: { id: string; space_id: string; name: string };
        Update: Partial<{ name: string; space_id: string }>;
      };
      lists: {
        Row: { id: string; folder_id: string; name: string; order_index: number | null; last_synced_at: string };
        Insert: { id: string; folder_id: string; name: string; order_index?: number };
        Update: Partial<{ name: string; folder_id: string; order_index: number }>;
      };
      tasks: {
        Row: {
          id: string; list_id: string; name: string; status: string;
          priority: string | null; due_date: string | null; url: string | null;
          date_created: string | null; date_updated: string | null; last_synced_at: string;
        };
        Insert: { id: string; list_id: string; name: string; status: string; priority?: string; due_date?: string; url?: string };
        Update: Partial<{ name: string; status: string; priority: string }>;
      };
      sync_log: {
        Row: {
          id: string; started_at: string; finished_at: string | null;
          spaces_synced: number; tasks_synced: number; status: 'running' | 'success' | 'error'; error_message: string | null;
        };
        Insert: never;
        Update: never;
      };
      kpi_snapshots: {
        Row: {
          id: string; captured_at: string; total_tasks: number | null; completed_tasks: number | null;
          by_status: Record<string, number>; by_space: Record<string, { total: number; complete: number }>;
        };
        Insert: never;
        Update: never;
      };
    };
  };
};
```

- [ ] **Step 2: Criar server client**

```ts
// facioflow-dashboard/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database, "facioflow_dashboard">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          try {
            cookies.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context — ignore
          }
        },
      },
      db: { schema: "facioflow_dashboard" },
    }
  );
}
```

- [ ] **Step 3: Criar browser client**

```ts
// facioflow-dashboard/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function getSupabaseBrowser() {
  return createBrowserClient<Database, "facioflow_dashboard">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "facioflow_dashboard" } }
  );
}
```

- [ ] **Step 4: Smoke test — Server Component que lê tasks**

Modificar `app/page.tsx` provisoriamente:
```tsx
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const sb = await getSupabaseServer();
  const { data, error } = await sb.from("tasks").select("id, name, status").limit(5);
  return (
    <main style={{ padding: 24 }}>
      <h1>FacioFlow Dashboard</h1>
      <p>Erro: {error?.message ?? "—"}</p>
      <ul>{data?.map((t) => <li key={t.id}>{t.name} ({t.status})</li>)}</ul>
    </main>
  );
}
```

- [ ] **Step 5: Verificar dev server lê do Supabase**

```bash
cd facioflow-dashboard && pnpm dev
```

Abrir `http://localhost:3000`. Expected: lista de 5 tasks reais com seus status. Se erro `schema "facioflow_dashboard" not found`, voltar e expor schema no painel (Task 2 pré-requisito).

- [ ] **Step 6: Commit**

```bash
git add facioflow-dashboard/lib/supabase/ facioflow-dashboard/app/page.tsx
git commit -m "feat: Supabase clients (server + browser) com schema facioflow_dashboard"
```

---

## Task 8: Layout — sidebar collapsible + topbar

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-dashboard/components/layout/sidebar.tsx`, `facioflow-dashboard/components/layout/topbar.tsx`, `facioflow-dashboard/components/layout/sidebar.module.css`, `facioflow-dashboard/components/layout/topbar.module.css`
- Modify: `facioflow-dashboard/app/layout.tsx`

**Brief para o ui-subagent:**

Criar sidebar collapsible (240px ↔ 64px) e topbar (56px). Sidebar é Client Component (`"use client"`) por causa do estado de toggle. Topbar pode ser Server Component que recebe `lastSyncTimestamp` via props.

**Sidebar requirements:**
- Logo `assets/icone-branco.svg` no topo (precisa copiar de `facioflow-agency/assets/icone-branco.svg` para `facioflow-dashboard/public/icone-branco.svg`)
- 3 nav items com ícones SVG: Overview (`/`), Projetos (`/projetos`), Clientes (`/clientes`)
- Footer com botão de toggle
- Estado persiste em `localStorage` com key `facioflow_sidebar_collapsed`
- Active route highlighted com `usePathname` do `next/navigation`
- Animação de collapse: `transition: width var(--trans-slow)`
- Quando collapsed, esconder labels (só ícones)

**Topbar requirements:**
- Botão de toggle da sidebar (mostra hamburger ou X)
- Breadcrumb: nome da seção atual (Overview / Projetos / Clientes)
- "Última sync há X min" à direita (calcular do `sync_log` table mais recente)
- Botão "Sync agora" (chama `/api/sync-clickup` POST)

**Layout root** (`app/layout.tsx`) deve renderizar:
```
<body>
  <Sidebar />
  <div className="dashboard-shell">
    <Topbar lastSyncAt={...} />
    <main>{children}</main>
  </div>
</body>
```

Estilos via CSS Modules. Tokens vindos de `styles/tokens.css` (já importado globalmente).

Mobile (max-width 768px): sidebar vira drawer overlay (transform: translateX(-100%) → 0 quando aberta), com backdrop semi-transparente.

- [ ] **Step 1: Despachar ui-subagent com brief acima**
- [ ] **Step 2: Smoke test**: dev server, abrir, validar collapse persistente, navegação funciona
- [ ] **Step 3: Commit**

```bash
git add facioflow-dashboard/components/layout/ facioflow-dashboard/app/layout.tsx facioflow-dashboard/public/
git commit -m "feat: layout com sidebar collapsible (localStorage) + topbar com sync timestamp"
```

---

## Task 9: API route `/api/sync-clickup` (trigger manual)

**Files:**
- Create: `facioflow-dashboard/app/api/sync-clickup/route.ts`

- [ ] **Step 1: Criar route handler**

```ts
// facioflow-dashboard/app/api/sync-clickup/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-clickup`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

- [ ] **Step 2: Smoke test**

```bash
curl -X POST http://localhost:3000/api/sync-clickup
```

Expected: JSON com `success: true, spaces_synced: 3, tasks_synced: 80`.

- [ ] **Step 3: Commit**

```bash
git add facioflow-dashboard/app/api/
git commit -m "feat: /api/sync-clickup proxy para Edge Function"
```

---

## Task 10: Custom SVG charts (donut + bars + counter)

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-dashboard/components/charts/status-donut.tsx`, `facioflow-dashboard/components/charts/space-bars.tsx`, `facioflow-dashboard/components/charts/animated-counter.tsx`
- Create: arquivo de keyframes `facioflow-dashboard/components/charts/charts.module.css`

**Brief para o ui-subagent:**

Construir 3 chart components custom SVG. Consultar **`svg-animations`**, **`svg-animations-pitfalls`** (transform-box, GPU pitfalls), **`reveal-patterns`** (Estratégia C — animation-fill-mode + nth-child), **`interactive-mockups`** (template Dashboard).

**`<StatusDonut data={[{label, value, color}]} size={200}/>`:**
- SVG donut chart com `<circle>` + `stroke-dasharray` calculado
- Legend abaixo do chart
- Animação on-mount: stroke-dashoffset desenha o arco
- 4 cores: complete=verde, pendente=accent, "to do"=cyan, "update required"=amarelo

**`<SpaceBars data={[{name, value, type}]} />`:**
- Horizontal bars com `transform: scaleX()` from left
- Cor por tipo: client=accent, internal=cyan
- Stagger 100ms entre cada bar via `nth-child`
- Label e value à direita de cada bar
- Animação on-scroll via IntersectionObserver (Estratégia C)

**`<AnimatedCounter value={80} duration={1500} prefix="" suffix="" />`:**
- Counter animando de 0 ao value via `requestAnimationFrame` + ease-out cúbico
- Trigger: IntersectionObserver threshold 0.5
- Respeitar `prefers-reduced-motion` (set valor final direto)

Componentes são Client Components (`"use client"`) porque usam state/effect.

- [ ] **Step 1: Despachar ui-subagent**
- [ ] **Step 2: Smoke test isolado**: criar `app/test-charts/page.tsx` temporário com mocks dos 3 charts e validar cada um
- [ ] **Step 3: Remover test-charts page**
- [ ] **Step 4: Commit**

```bash
git add facioflow-dashboard/components/charts/
git commit -m "feat: 3 charts custom SVG (donut, bars, counter) com on-scroll animation"
```

---

## Task 11: Overview page (`/`)

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Modify: `facioflow-dashboard/app/page.tsx`
- Create: `facioflow-dashboard/components/kpi-card.tsx`, `facioflow-dashboard/components/task-list.tsx`, `facioflow-dashboard/app/page.module.css`

**Brief para o ui-subagent:**

`page.tsx` é Server Component. Buscar dados via supabase server client:

```ts
const sb = await getSupabaseServer();

// 4 KPIs
const { count: totalTasks } = await sb.from("tasks").select("*", { count: "exact", head: true });
const { count: completedTasks } = await sb.from("tasks").select("*", { count: "exact", head: true }).eq("status", "complete");
const { count: spacesCount } = await sb.from("spaces").select("*", { count: "exact", head: true });
const { data: lastSync } = await sb.from("sync_log").select("finished_at").eq("status", "success").order("started_at", { ascending: false }).limit(1).single();

// Status breakdown
const { data: statusBreakdown } = await sb.rpc("status_counts");
// (criar rpc OU agregar via JS — escolher caminho mais simples; agregar JS é OK)

// Tasks por space
const { data: spaceCounts } = await sb.from("spaces").select("id, name, type, tasks:tasks(count)");

// Recent activity
const { data: recent } = await sb.from("tasks").select("*, list:lists(name, folder:folders(name, space:spaces(name)))").order("date_updated", { ascending: false }).limit(5);

// Urgent
const { data: urgent } = await sb.from("tasks").select("*, list:lists(name, folder:folders(name, space:spaces(name)))").eq("priority", "urgent").neq("status", "complete").limit(5);
```

Layout do page (Editorial Dark):
```
[Section header: "Overview" + última sync]
[Grid 4 cols: 4 KPI cards com AnimatedCounter]
[Grid 2 cols com gap-6:
  Left (2/3): SpaceBars
  Right (1/3): StatusDonut
]
[Grid 2 cols com gap-6:
  Left: TaskList "Atividade recente"
  Right: TaskList "Próximas urgentes"
]
```

`KpiCard` recebe props `{label, value, suffix?, accent?}` e renderiza em `bg-elevated` com `border` e `radius-md`.

`TaskList` recebe props `{title, tasks: Task[]}` e renderiza lista compacta com nome (truncate), badge de status, breadcrumb (space → folder), prioridade.

- [ ] **Step 1: Despachar ui-subagent**
- [ ] **Step 2: Smoke test no browser**: KPIs animam, charts aparecem, listas com 5 items
- [ ] **Step 3: Commit**

```bash
git add facioflow-dashboard/app/page.tsx facioflow-dashboard/app/page.module.css facioflow-dashboard/components/kpi-card.tsx facioflow-dashboard/components/task-list.tsx
git commit -m "feat: Overview page com 4 KPIs + 2 charts + 2 listas (data real)"
```

---

## Task 12: Projetos page (`/projetos`) + drill-down

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-dashboard/app/projetos/page.tsx`, `facioflow-dashboard/app/projetos/[spaceId]/page.tsx`, `facioflow-dashboard/components/space-card.tsx`

**Brief para o ui-subagent:**

`/projetos` (Server Component): lista 3 cards de space com:
- Nome do space
- Badge `client` ou `internal`
- Contador: "X tasks · Y módulos"
- Progress bar com % complete
- Link para `/projetos/[spaceId]`

`/projetos/[spaceId]` (Server Component): drill-down com:
- Header: nome do space + breadcrumb back
- KPIs do space: total tasks, complete, pendente, próximo marco
- Lista de folders (cards) com lists dentro:
  - Cada list mostra: nome + count tasks por status
  - Click expande tasks da list

Query data:
```ts
// /projetos
const { data: spaces } = await sb.from("spaces").select(`
  *,
  folders:folders(count),
  lists:folders(lists:lists(count, tasks:tasks(count, status)))
`);

// Calcular % complete via JS
```

Use `space-card.tsx` reutilizável para Cards de space.

- [ ] **Step 1: Despachar ui-subagent**
- [ ] **Step 2: Smoke test**: 3 cards aparecem, click leva pro drill-down, dados reais
- [ ] **Step 3: Commit**

```bash
git add facioflow-dashboard/app/projetos/ facioflow-dashboard/components/space-card.tsx
git commit -m "feat: /projetos lista + drill-down /projetos/[spaceId]"
```

---

## Task 13: Clientes page (`/clientes`)

**⚠️ UI TASK — delegar ao ui-subagent Opus 4.7**

**Files:**
- Create: `facioflow-dashboard/app/clientes/page.tsx`

**Brief para o ui-subagent:**

`/clientes` (Server Component): grid de 3 cards (1 por space, treated as cliente).

Cada card:
- Avatar: inicial estilizada (ex: "I" pra IMBIL, "K" pra Kopenhagen, "F" pra FacioFlow) com bg `--accent-dim`
- Nome do cliente (= nome do space)
- Badge: `client` ou `internal`
- Status calculado:
  - 0% complete → "Em planejamento"
  - 1-99% complete → "Em desenvolvimento"
  - 100% complete → "Entregue"
- Stats: módulos ativos, total tasks, % complete (progress bar)
- "Última atividade" (date_updated mais recente entre tasks do space)

Layout: grid 3 cols (responsivo: 2 cols em 900px, 1 col em 600px).

Reutilizar `space-card.tsx` da Task 12 com prop modifier `variant="cliente"` se necessário.

- [ ] **Step 1: Despachar ui-subagent**
- [ ] **Step 2: Smoke test**: 3 cards corretos com dados reais
- [ ] **Step 3: Commit**

```bash
git add facioflow-dashboard/app/clientes/
git commit -m "feat: /clientes 3 cards com status calculado e última atividade"
```

---

## Task 14: verification-before-completion + Playwright

**Files:**
- Modify: `scripts/audit_visual.mjs` (adicionar entry pro dashboard)

- [ ] **Step 1: Atualizar audit script para suportar dashboard**

Adicionar ao `sectionsByProject` em `scripts/audit_visual.mjs`:
```js
'facioflow-dashboard': [
  { name: 'overview',  selector: 'main' },
  // dashboard tem múltiplas rotas — capturar via URLs separadas
],
```

Como dashboard tem rotas, modificar lógica do script: aceitar param `--routes=overview,projetos,clientes` e capturar uma screenshot por rota.

Alternativa simples: usar `webapp-testing` skill para navegar manualmente nas 3 rotas e capturar.

- [ ] **Step 2: Iniciar dev server**

```bash
cd facioflow-dashboard && pnpm dev
```

Aguardar `Ready in Xms` e a porta 3000.

- [ ] **Step 3: Verificação manual no browser**

Walkthrough:
- [ ] `/` carrega: 4 KPIs animam, status donut renderiza, space bars animam, 2 listas com tasks reais
- [ ] Sidebar abre/fecha, estado persiste em refresh
- [ ] Topbar mostra "Última sync há X min"
- [ ] Botão "Sync agora" funciona (chama API e dá feedback)
- [ ] `/projetos` mostra 3 cards, click leva pro drill-down
- [ ] `/projetos/[spaceId]` carrega corretamente para os 3 spaces
- [ ] `/clientes` mostra 3 cards
- [ ] Mobile (375px): sidebar vira drawer, layout responsivo
- [ ] Console sem erros

- [ ] **Step 4: Capturar screenshots via Playwright**

```bash
node scripts/audit_visual.mjs --project=facioflow-dashboard --port=3000
```

Output em `docs/audits/screenshots/facioflow-dashboard/`.

- [ ] **Step 5: Commit do script atualizado**

```bash
git add scripts/audit_visual.mjs
git commit -m "chore: audit_visual.mjs suporta facioflow-dashboard com múltiplas rotas"
```

---

## Task 15: frontend-audit-gate (híbrido) + apply findings + finishing

- [ ] **Step 1: Invocar `frontend-audit-gate`** — Step 0 já feito (screenshots da Task 14)
- [ ] **Step 2: Audit via ui-subagent Opus** — ler 3 skills + screenshots + código, gerar relatório em `docs/audits/2026-05-09-facioflow-dashboard-audit.md`
- [ ] **Step 3: Apresentar findings** — usuário escolhe manual ou paralelo
- [ ] **Step 4: Aplicar findings via ui-subagent paralelo** (recomendado pra 5+ findings independentes)
- [ ] **Step 5: Re-capturar screenshots** após fixes
- [ ] **Step 6: `verification-before-completion`** final — abrir browser, validar tudo
- [ ] **Step 7: Commit + push**
- [ ] **Step 8: Invocar `finishing-a-development-branch`**

---

## Self-review

**Spec coverage:**
- ✅ Next.js 15 + React 19 + TypeScript scaffold → Task 1
- ✅ Schema Supabase com `facioflow_dashboard` → Task 2
- ✅ ClickUp API client → Task 3
- ✅ Edge Function sync-clickup → Tasks 4-5
- ✅ pg_cron 1h → Task 6
- ✅ Supabase clients (server + browser) → Task 7
- ✅ Sidebar collapsible + topbar → Task 8
- ✅ /api/sync-clickup → Task 9
- ✅ Custom SVG charts (donut + bars + counter) → Task 10
- ✅ Overview page com 4 KPIs + 2 charts + 2 listas → Task 11
- ✅ /projetos lista + drill-down → Task 12
- ✅ /clientes 3 cards → Task 13
- ✅ Editorial Dark herdado → Task 1 (tokens.css)
- ✅ verification-before-completion → Task 14
- ✅ frontend-audit-gate híbrido → Task 15
- ✅ finishing → Task 15

**Gaps:** nenhum.

**Type consistency:** schema names usam `facioflow_dashboard` consistentemente em todos os Supabase clients e Edge Function. Tipos `Database` referenciados em todos os clients.

**Skills aplicadas no plano:**
- `vercel-react-best-practices` (Server Components nas pages)
- `vercel-composition-patterns` (KpiCard, SpaceCard, TaskList compoundables)
- `interactive-mockups` (template Dashboard nos charts)
- `svg-animations` + `svg-animations-pitfalls` (charts custom)
- `reveal-patterns` (Estratégia C nos charts)
- `brand-aware-defaults` (tokens Supabase verde, n8n vermelho)
- `supabase` + `supabase-postgres-best-practices` (schema, índices, RLS)
- `supabase-schema-testing` (migration testada via SQL queries em Task 2)
- `frontend-audit-gate` (Task 15)
- `verification-before-completion` (Task 14)
