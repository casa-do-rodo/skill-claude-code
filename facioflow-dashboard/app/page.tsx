import { getSupabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const sb = await getSupabaseServer();
  const { data: tasks, error } = await sb
    .from("tasks")
    .select("id, name, status")
    .limit(5);

  return (
    <main className="container" style={{ paddingTop: "var(--space-24)" }}>
      <span className="section-label">Scaffold</span>
      <span className="accent-line" />
      <h1 className="section-title">FacioFlow Dashboard</h1>
      <p className="section-sub">
        Smoke test — Server Component lendo de <code>facioflow_dashboard.tasks</code>.
      </p>

      <div style={{ marginTop: "var(--space-8)", padding: "var(--space-6)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Status: {error ? `❌ ${error.message}` : `✓ conectado · ${tasks?.length ?? 0} tasks retornadas`}
        </p>
        {tasks && tasks.length > 0 && (
          <ul style={{ marginTop: "var(--space-4)", paddingLeft: "var(--space-5)" }}>
            {tasks.map((t) => (
              <li key={t.id} style={{ color: "var(--text)", fontSize: "13px", marginBottom: "4px" }}>
                {t.name} <span style={{ color: "var(--text-muted)" }}>({t.status})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
