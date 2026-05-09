import { getSupabaseServer } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { AnimatedCounter } from "@/components/charts/animated-counter";
import { StatusDonut } from "@/components/charts/status-donut";
import { SpaceBars } from "@/components/charts/space-bars";
import { KpiCard } from "@/components/kpi-card";
import { TaskList, type TaskListItem } from "@/components/task-list";
import styles from "./page.module.css";

// Sempre data fresh — overview reflete último estado da agência.
// Cache aqui criaria stale após sync sem revalidate. Trade-off:
// SSR a cada request, custo aceitável pra dashboard interno.
export const dynamic = "force-dynamic";

export default async function Home() {
  const sb = await getSupabaseServer();

  // ---------- Parallel queries ----------
  // Promise.all evita waterfall (cada query bloqueando a próxima).
  // Total ~6 queries; 80 rows na maior — sem pressão.
  const [
    totalCountRes,
    statusRes,
    spacesRes,
    syncRes,
    recentRes,
    urgentRes,
  ] = await Promise.all([
    // 1. Total tasks — head:true não baixa rows, só count.
    //    Best practice: query-count-head-true (supabase-postgres-best-practices).
    sb.from("tasks").select("*", { count: "exact", head: true }),

    // 2. Status counts — agregação em JS (1 query, não N).
    //    Para >10k rows seria RPC aggregate, aqui 80 é fine.
    sb.from("tasks").select("status"),

    // 3. Spaces com nested counts via foreign key relationship.
    //    1 query single-roundtrip; tasks(count) usa o connection pooler do
    //    PostgREST sem N+1.
    sb.from("spaces").select(`
      id,
      name,
      type,
      folders:folders(
        lists:lists(
          tasks:tasks(count)
        )
      )
    `),

    // 4. Última sync com sucesso. maybeSingle retorna null se vazio
    //    (não erra como single).
    sb
      .from("sync_log")
      .select("finished_at")
      .eq("status", "success")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    // 5. Atividade recente — 5 mais updated.
    //    nullsFirst:false → tasks sem date_updated ficam ao final.
    sb
      .from("tasks")
      .select(`
        id, name, status, priority, url, date_updated,
        lists!inner(
          name,
          folders!inner(
            name,
            spaces!inner(name)
          )
        )
      `)
      .order("date_updated", { ascending: false, nullsFirst: false })
      .limit(5),

    // 6. Top 5 urgentes não completas.
    sb
      .from("tasks")
      .select(`
        id, name, status, priority, url, date_updated,
        lists!inner(
          name,
          folders!inner(
            name,
            spaces!inner(name)
          )
        )
      `)
      .eq("priority", "urgent")
      .neq("status", "complete")
      .order("date_updated", { ascending: false })
      .limit(5),
  ]);

  const totalTasks = totalCountRes.count ?? 0;

  // ---------- Status agregação ----------
  const statusCounts: Record<string, number> = {};
  for (const t of statusRes.data ?? []) {
    statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;
  }
  const completedTasks = statusCounts["complete"] ?? 0;
  const completedPct = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // ---------- Spaces nested reduce ----------
  // Estrutura nested vinda do Supabase:
  //   spaces[].folders[].lists[].tasks[].count
  // Reduce: sum(tasks.count) por space.
  //
  // Cast: nosso `Database` em lib/supabase/types.ts não declara aggregation
  // `tasks(count)`. Tipos manuais não conseguem inferir o `count` da string
  // do select, então casteamos a shape conhecida.
  type SpaceWithCounts = {
    id: string;
    name: string;
    type: "client" | "internal";
    folders: Array<{
      lists: Array<{ tasks: Array<{ count: number }> }> | null;
    }> | null;
  };
  const spacesRows = (spacesRes.data ?? []) as unknown as SpaceWithCounts[];
  const spacesData = spacesRows.map((s) => {
    const total = (s.folders ?? []).reduce(
      (acc, f) =>
        acc +
        (f.lists ?? []).reduce(
          (la, l) => la + (l.tasks?.[0]?.count ?? 0),
          0,
        ),
      0,
    );
    return { name: s.name, value: total, type: s.type };
  });
  const totalSpaces = spacesData.length;

  // ---------- Render ----------
  // Tasks dos lists do Supabase castadas para o shape do TaskListItem.
  // Veja `components/task-list.tsx` — aceita array | object | null em cada
  // nível dos relationships. supabase-js infere arrays por default.
  const recentTasks = (recentRes.data ?? []) as unknown as TaskListItem[];
  const urgentTasks = (urgentRes.data ?? []) as unknown as TaskListItem[];

  // Status donut: filtra zeros pra não desenhar segments invisíveis.
  const statusDonutData = [
    { label: "complete", value: statusCounts["complete"] ?? 0, color: "var(--supabase)" },
    { label: "pendente", value: statusCounts["pendente"] ?? 0, color: "var(--accent)" },
    { label: "to do", value: statusCounts["to do"] ?? 0, color: "var(--cyan)" },
    { label: "update required", value: statusCounts["update required"] ?? 0, color: "var(--warning)" },
  ].filter((s) => s.value > 0);

  return (
    <div className={styles.overview}>
      <header className={styles.sectionHeader}>
        <span className="section-label">Overview</span>
        <span className="accent-line" />
        <h1 className={styles.title}>Visão geral</h1>
        <p className={styles.subtitle}>
          {totalTasks} tasks em {totalSpaces} {totalSpaces === 1 ? "projeto" : "projetos"}
        </p>
      </header>

      <section className={styles.kpiGrid}>
        <KpiCard label="Total de tasks">
          <AnimatedCounter value={totalTasks} />
        </KpiCard>
        <KpiCard label="Tasks completas" hint={`${completedPct}% do total`}>
          <AnimatedCounter value={completedTasks} />
        </KpiCard>
        <KpiCard label="Projetos ativos">
          <AnimatedCounter value={totalSpaces} />
        </KpiCard>
        <KpiCard label="Última sync">
          {/* Não usa AnimatedCounter — string formatada, animar bytes não faz sentido */}
          {syncRes.data?.finished_at
            ? formatRelativeTime(syncRes.data.finished_at)
            : "—"}
        </KpiCard>
      </section>

      <section className={styles.chartsGrid}>
        <div className={styles.chartLeft}>
          <h2 className={styles.chartHeading}>Tasks por projeto</h2>
          <SpaceBars data={spacesData} />
        </div>
        <div className={styles.chartRight}>
          <h2 className={styles.chartHeading}>Distribuição por status</h2>
          {statusDonutData.length > 0 ? (
            <StatusDonut data={statusDonutData} />
          ) : (
            <p className={styles.emptyChart}>Nenhuma task ainda.</p>
          )}
        </div>
      </section>

      <section className={styles.listsGrid}>
        <TaskList
          title="Atividade recente"
          tasks={recentTasks}
          emptyText="Nenhuma atividade ainda."
        />
        <TaskList
          title="Próximas urgentes"
          tasks={urgentTasks}
          emptyText="Sem tasks urgentes pendentes."
        />
      </section>
    </div>
  );
}
