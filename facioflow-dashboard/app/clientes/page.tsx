import { getSupabaseServer } from "@/lib/supabase/server";
import styles from "./page.module.css";

// Dashboard interno: deve refletir último estado da DB (sync n8n).
// Cache estático ficaria stale; força-dynamic alinha com /projetos.
export const dynamic = "force-dynamic";

/**
 * /clientes — visão cliente-first dos mesmos spaces de /projetos.
 *
 * Server Component. Single-roundtrip: nested select traz folders → lists →
 * tasks numa query só. Status do projeto deriva do progresso (pct) em JS.
 *
 * Card é inline (3 itens) — se virar 10+, extrair pra `<ClienteCard>`.
 */
export default async function ClientesPage() {
  const sb = await getSupabaseServer();

  // Nested select: PostgREST resolve em 1 roundtrip.
  // Trazemos `status` e `date_updated` de cada task pra calcular pct +
  // última atividade no client (em memória, sem extra query).
  const { data: spaces } = await sb.from("spaces").select(`
    id, name, type,
    folders:folders(
      id,
      lists:lists(
        id,
        tasks:tasks(id, status, date_updated)
      )
    )
  `);

  // Cast unknown: nosso Database type não declara nested arrays profundos.
  // Mesma técnica de /projetos (shape conhecida via API).
  type SpaceFull = {
    id: string;
    name: string;
    type: "client" | "internal";
    folders: Array<{
      id: string;
      lists: Array<{
        id: string;
        tasks: Array<{ id: string; status: string; date_updated: string | null }>;
      }>;
    }>;
  };

  const rows = ((spaces ?? []) as unknown as SpaceFull[]).map((s) => {
    // Achata 3 níveis (folders → lists → tasks) pra agregações lineares.
    const allTasks = s.folders.flatMap((f) =>
      f.lists.flatMap((l) => l.tasks),
    );
    const total = allTasks.length;
    const complete = allTasks.filter((t) => t.status === "complete").length;
    // Edge case 0 tasks → 0% (sem div/0). 0% triggers "planejamento".
    const pct = total > 0 ? Math.round((complete / total) * 100) : 0;
    const moduleCount = s.folders.reduce(
      (acc, f) => acc + f.lists.length,
      0,
    );
    // localeCompare reverso = sort ISO desc → primeiro elemento é o mais recente.
    const lastUpdated =
      allTasks
        .map((t) => t.date_updated)
        .filter((d): d is string => Boolean(d))
        .sort((a, b) => b.localeCompare(a))[0] ?? null;

    // Status derivado do pct — não há campo `status` no space, é inferido.
    let status: "planejamento" | "desenvolvimento" | "entregue";
    if (pct === 0) status = "planejamento";
    else if (pct >= 100) status = "entregue";
    else status = "desenvolvimento";

    return {
      id: s.id,
      name: s.name,
      type: s.type,
      total,
      complete,
      pct,
      moduleCount,
      lastUpdated,
      status,
    };
  });

  const clientCount = rows.filter((r) => r.type === "client").length;
  const internalCount = rows.filter((r) => r.type === "internal").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="section-label">Clientes</span>
        <span className="accent-line" />
        <h1 className={styles.title}>Clientes &amp; projetos internos</h1>
        <p className={styles.subtitle}>
          {clientCount} {clientCount === 1 ? "cliente" : "clientes"} ·{" "}
          {internalCount}{" "}
          {internalCount === 1 ? "projeto interno" : "projetos internos"}
        </p>
      </header>

      <div className={styles.grid}>
        {rows.map((r) => {
          // First grapheme via [...] lida com emoji/acentos melhor que charAt.
          const initial = ([...r.name.trim()][0] ?? "?").toUpperCase();
          return (
            <article key={r.id} className={styles.card}>
              <header className={styles.cardHead}>
                <div className={styles.avatar} aria-hidden="true">
                  {initial}
                </div>
                <span
                  className={`${styles.typeBadge} ${
                    styles[`type_${r.type}`]
                  }`}
                >
                  {r.type === "client" ? "cliente" : "interno"}
                </span>
              </header>

              <h2 className={styles.name}>{r.name}</h2>

              <span
                className={`${styles.statusBadge} ${
                  styles[`status_${r.status}`]
                }`}
              >
                {r.status === "planejamento"
                  ? "Em planejamento"
                  : r.status === "desenvolvimento"
                    ? "Em desenvolvimento"
                    : "Entregue"}
              </span>

              <dl className={styles.stats}>
                <div className={styles.stat}>
                  <dt>Tasks</dt>
                  <dd>{r.total}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Módulos</dt>
                  <dd>{r.moduleCount}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Completo</dt>
                  <dd>{r.pct}%</dd>
                </div>
              </dl>

              <div
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={r.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${r.pct}% completo`}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${r.pct}%` }}
                />
              </div>

              <footer className={styles.footer}>
                <span className={styles.lastActivity}>
                  {r.lastUpdated
                    ? `Última atividade: ${humanize(r.lastUpdated)}`
                    : "Sem atividade ainda"}
                </span>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/**
 * humanize — formata ISO date como "há X min/h/d/meses".
 *
 * Pt-BR, sem libs (date-fns/dayjs). Ranges escolhidos por legibilidade:
 * < 60min → minutos · < 24h → horas · < 30d → dias · resto → meses (30d).
 * Aproximação 30d/mês é OK pra "última atividade" (não é financeiro).
 */
function humanize(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days}d`;
  const months = Math.floor(days / 30);
  return `há ${months} ${months > 1 ? "meses" : "mês"}`;
}
