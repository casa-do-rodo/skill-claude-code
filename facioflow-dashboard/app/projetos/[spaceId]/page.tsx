import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import styles from "./page.module.css";

// Drill-down sempre fresh — número de tasks pode mudar entre clicks.
export const dynamic = "force-dynamic";

type Params = { spaceId: string };

/**
 * `/projetos/[spaceId]` — drill-down do space.
 *
 * Hierarquia: space → folders → lists → tasks (expandable).
 * Tudo renderiza num único Server Component com 1 query nested.
 *
 * Em Next.js 16, `params` é Promise — precisa await.
 */
export default async function SpaceDrilldownPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { spaceId } = await params;
  const sb = await getSupabaseServer();

  // 1 query buscando todo o tree do space.
  // Para 80 tasks total no schema isso é trivial; se crescer pra >1k tasks
  // o approach seria paginar tasks por list (lazy load).
  const { data: spaceRes } = await sb
    .from("spaces")
    .select(
      `
      id, name, type,
      folders:folders(
        id, name,
        lists:lists(
          id, name,
          tasks:tasks(id, name, status, priority, url, date_updated)
        )
      )
    `,
    )
    .eq("id", spaceId)
    .maybeSingle();

  // 404 se space não existir — Next.js renderiza app/not-found.tsx
  if (!spaceRes) {
    notFound();
  }

  // Cast: nosso Database type é gerado e não declara aliases nested.
  // Shape conhecida via cast unknown — mesma técnica do app/page.tsx.
  type SpaceFull = {
    id: string;
    name: string;
    type: "client" | "internal";
    folders: Array<{
      id: string;
      name: string;
      lists: Array<{
        id: string;
        name: string;
        tasks: Array<{
          id: string;
          name: string;
          status: string;
          priority: string | null;
          url: string | null;
          date_updated: string | null;
        }>;
      }>;
    }>;
  };

  const space = spaceRes as unknown as SpaceFull;

  // ---------- Métricas agregadas ----------
  // flatMap em 2 níveis: folders → lists → tasks. 80 rows é instantâneo.
  const allTasks = space.folders.flatMap((f) =>
    f.lists.flatMap((l) => l.tasks),
  );
  const totalTasks = allTasks.length;
  const completeTasks = allTasks.filter((t) => t.status === "complete").length;
  const pendingTasks = totalTasks - completeTasks;
  const completePct =
    totalTasks > 0 ? Math.round((completeTasks / totalTasks) * 100) : 0;
  const urgentTasks = allTasks.filter(
    (t) => t.priority === "urgent" && t.status !== "complete",
  ).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/projetos" className={styles.back}>
          ← Projetos
        </Link>
        <span className={`${styles.badge} ${styles[`badge_${space.type}`]}`}>
          {space.type}
        </span>
        <h1 className={styles.title}>{space.name}</h1>
        <p className={styles.subtitle}>
          {space.folders.length}{" "}
          {space.folders.length === 1 ? "folder" : "folders"} · {totalTasks}{" "}
          tasks · {completePct}% completas
        </p>
      </header>

      {/* ---------- KPIs ---------- */}
      <section className={styles.kpis} aria-label="Métricas do projeto">
        <Kpi label="Tasks total" value={totalTasks} />
        <Kpi
          label="Completas"
          value={completeTasks}
          accent="var(--supabase)"
        />
        <Kpi label="Pendentes" value={pendingTasks} accent="var(--accent)" />
        <Kpi
          label="Urgentes abertas"
          value={urgentTasks}
          accent="var(--n8n)"
        />
      </section>

      {/* ---------- Folders → Lists → Tasks ---------- */}
      <section
        className={styles.foldersSection}
        aria-label="Hierarquia do projeto"
      >
        {space.folders.map((folder) => {
          const folderTasks = folder.lists.flatMap((l) => l.tasks);
          const folderComplete = folderTasks.filter(
            (t) => t.status === "complete",
          ).length;
          const folderPct =
            folderTasks.length > 0
              ? Math.round((folderComplete / folderTasks.length) * 100)
              : 0;

          return (
            <article key={folder.id} className={styles.folder}>
              <header className={styles.folderHead}>
                <h2 className={styles.folderName}>{folder.name}</h2>
                <span className={styles.folderMeta}>
                  {folder.lists.length}{" "}
                  {folder.lists.length === 1 ? "módulo" : "módulos"} ·{" "}
                  {folderTasks.length} tasks · {folderPct}% completas
                </span>
              </header>

              <div className={styles.lists}>
                {folder.lists.map((list) => {
                  const listComplete = list.tasks.filter(
                    (t) => t.status === "complete",
                  ).length;
                  const listPct =
                    list.tasks.length > 0
                      ? Math.round((listComplete / list.tasks.length) * 100)
                      : 0;

                  return (
                    <details key={list.id} className={styles.listItem}>
                      <summary className={styles.listSummary}>
                        {/* SVG inline em vez do glyph "▸" UTF-8: tamanho
                            consistente entre browsers (fontes podem inflar/
                            distorcer o triângulo) e currentColor herda do
                            estado [open] sem reset extra. */}
                        <svg
                          className={styles.summaryIcon}
                          viewBox="0 0 12 12"
                          width="10"
                          height="10"
                          aria-hidden="true"
                        >
                          <path d="M3 2 L9 6 L3 10 Z" fill="currentColor" />
                        </svg>
                        <span className={styles.listName}>{list.name}</span>
                        <span className={styles.listMeta}>
                          {list.tasks.length} tasks · {listPct}% complete
                        </span>
                      </summary>
                      {list.tasks.length === 0 ? (
                        <p className={styles.taskEmpty}>Sem tasks aqui.</p>
                      ) : (
                        <ul className={styles.taskInner}>
                          {list.tasks.map((t) => (
                            <li key={t.id} className={styles.taskItem}>
                              {t.url ? (
                                <a
                                  href={t.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.taskName}
                                >
                                  {t.name}
                                  {/* External-link glyph: sinaliza que abre
                                      em nova aba antes do click. fill=none +
                                      stroke=currentColor herda do hover. */}
                                  <svg
                                    className={styles.externalIcon}
                                    viewBox="0 0 12 12"
                                    width="10"
                                    height="10"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M5 2 H10 V7 M10 2 L4 8 M3 4 H2 V10 H8 V9"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </a>
                              ) : (
                                <span className={styles.taskName}>
                                  {t.name}
                                </span>
                              )}
                              <span
                                className={styles.statusBadge}
                                style={{
                                  ["--status-color" as string]:
                                    statusColor(t.status),
                                }}
                              >
                                {t.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </details>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

/**
 * Kpi inline — específico desta page (mais compacto que KpiCard global,
 * sem `hint` slot, sem `children` flexibility). Mantém colocado pra
 * evitar overhead de generalização prematura.
 */
function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className={styles.kpi}>
      <span className={styles.kpiLabel}>{label}</span>
      <strong
        className={styles.kpiValue}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </strong>
    </div>
  );
}

/**
 * Mapeia status string → cor do design system.
 * Mesmas cores do StatusBadge em components/task-list.tsx — mantém
 * consistência entre overview e drill-down.
 *
 * Status string vem do ClickUp (livre); usamos color-mix no CSS pra
 * gerar o background tintado a partir desta variable única.
 */
function statusColor(status: string): string {
  switch (status) {
    case "complete":
      return "var(--supabase)";
    case "pendente":
      return "var(--accent)";
    case "to do":
      return "var(--cyan)";
    case "update required":
      return "var(--warning)";
    default:
      return "var(--text-muted)";
  }
}
