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
