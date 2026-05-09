import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { SpaceCard } from "@/components/space-card";
import styles from "./page.module.css";

// Same rationale as overview: dashboard interno, espelha último estado.
// Cache estático criaria stale após sync sem revalidate manual.
export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  const sb = await getSupabaseServer();

  // ---------- Queries ----------
  // Promise.all evita waterfall: nested counts + completeBySpace independentes.
  const [spacesRes, completeRes] = await Promise.all([
    // 1. Spaces com nested counts via foreign key relationship.
    //    1 query single-roundtrip; supabase-js + PostgREST resolvem sem N+1.
    sb.from("spaces").select(`
      id,
      name,
      type,
      folders:folders(
        id,
        lists:lists(
          id,
          tasks:tasks(count)
        )
      )
    `),

    // 2. Tasks completas agrupadas por space — usamos !inner pra o filter
    //    `status = 'complete'` se aplicar via JOIN (não vira null branch).
    //    Retornamos só o aninhado spaces.id pra mapear count em JS.
    //    Para 80 rows isso é trivial; >10k rows seria RPC com GROUP BY.
    sb
      .from("tasks")
      .select("id, lists!inner(folders!inner(spaces!inner(id)))")
      .eq("status", "complete"),
  ]);

  // ---------- Spaces shape ----------
  // Cast: nosso Database type não declara aggregations `tasks(count)`.
  // Mesma técnica do app/page.tsx — shape conhecida via cast unknown.
  type SpaceWithCounts = {
    id: string;
    name: string;
    type: "client" | "internal";
    folders: Array<{
      id: string;
      lists: Array<{ id: string; tasks: Array<{ count: number }> }> | null;
    }> | null;
  };

  const spacesData = ((spacesRes.data ?? []) as unknown as SpaceWithCounts[]).map(
    (s) => {
      const folderCount = (s.folders ?? []).length;
      const listCount = (s.folders ?? []).reduce(
        (acc, f) => acc + (f.lists?.length ?? 0),
        0,
      );
      const taskCount = (s.folders ?? []).reduce(
        (acc, f) =>
          acc +
          (f.lists ?? []).reduce(
            (la, l) => la + (l.tasks?.[0]?.count ?? 0),
            0,
          ),
        0,
      );
      return {
        id: s.id,
        name: s.name,
        type: s.type,
        folderCount,
        listCount,
        taskCount,
      };
    },
  );

  // ---------- Complete count por space ----------
  // Shape esperada: cada row tem lists.folders.spaces.id depois do JOIN.
  // Em nested relationships com PostgREST, o supabase-js infere arrays —
  // por isso navegamos via [0] no caminho. Defensive: || ?? em cada nível.
  type CompleteRow = {
    id: string;
    lists:
      | { folders: { spaces: { id: string } | null } | null }
      | Array<{ folders: { spaces: { id: string } | null } | null }>
      | null;
  };

  const completeBySpace: Record<string, number> = {};
  for (const row of (completeRes.data ?? []) as unknown as CompleteRow[]) {
    const list = Array.isArray(row.lists) ? row.lists[0] : row.lists;
    const folder = list?.folders;
    const space = folder?.spaces;
    const sid = space?.id;
    if (sid) {
      completeBySpace[sid] = (completeBySpace[sid] ?? 0) + 1;
    }
  }

  const totalTasksAcrossSpaces = spacesData.reduce(
    (a, s) => a + s.taskCount,
    0,
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="section-label">Projetos</span>
        <span className="accent-line" />
        <h1 className={styles.title}>Projetos da agência</h1>
        <p className={styles.subtitle}>
          {spacesData.length}{" "}
          {spacesData.length === 1 ? "projeto" : "projetos"} ·{" "}
          {totalTasksAcrossSpaces} tasks total
        </p>
      </header>

      <div className={styles.grid}>
        {spacesData.map((s) => (
          <Link
            key={s.id}
            href={`/projetos/${s.id}`}
            className={styles.cardLink}
          >
            <SpaceCard
              name={s.name}
              type={s.type}
              taskCount={s.taskCount}
              folderCount={s.folderCount}
              listCount={s.listCount}
              completeCount={completeBySpace[s.id] ?? 0}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
