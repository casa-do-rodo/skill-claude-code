"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { openMobileSidebar } from "./sidebar";
import styles from "./topbar.module.css";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Overview",
  "/projetos": "Projetos",
  "/clientes": "Clientes",
};

/**
 * Threshold pra considerar sync "stale" — visual cue (dot cinza vs verde).
 * 1h em ms.
 */
const STALE_THRESHOLD_MS = 60 * 60 * 1000;

function getBreadcrumbLabel(pathname: string): string {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  // Fallback: pega primeiro segmento e capitaliza
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  if (!segment) return "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Wrap do helper compartilhado: topbar exibe "nunca" quando ainda não houve
 * sync, enquanto o helper canônico só trata timestamps existentes. Esse
 * fallback fica isolado aqui pra não poluir a API do helper.
 */
function describeLastSync(isoDate: string | null): string {
  if (!isoDate) return "nunca";
  return formatRelativeTime(isoDate);
}

export function Topbar() {
  const pathname = usePathname();
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchLastSync = useCallback(async () => {
    try {
      const sb = getSupabaseBrowser();
      const { data } = await sb
        .from("sync_log")
        .select("finished_at")
        .eq("status", "success")
        .order("finished_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setLastSyncAt(data?.finished_at ?? null);
    } catch {
      // Silencioso — sem timestamp se Supabase falhar
      setLastSyncAt(null);
    }
  }, []);

  useEffect(() => {
    fetchLastSync();
  }, [fetchLastSync]);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/sync-clickup", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[sync-clickup] falhou", body);
      }
      // Pequeno delay pra DB committar antes do refetch
      await new Promise((r) => setTimeout(r, 500));
      await fetchLastSync();
    } catch (err) {
      console.error("[sync-clickup] erro de rede", err);
    } finally {
      setSyncing(false);
    }
  };

  const isStale =
    !lastSyncAt || Date.now() - new Date(lastSyncAt).getTime() > STALE_THRESHOLD_MS;

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.hamburger}
        onClick={openMobileSidebar}
        aria-label="Abrir menu"
      >
        <svg className={styles.hamburgerIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18 M3 12h18 M3 18h18" />
        </svg>
      </button>

      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbLabel}>{getBreadcrumbLabel(pathname)}</span>
      </div>

      <div className={styles.right}>
        <div
          className={styles.syncStatus}
          title={
            lastSyncAt
              ? new Date(lastSyncAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : "Nunca sincronizado"
          }
        >
          <span className={styles.syncDot} data-stale={isStale ? "true" : "false"} />
          <span>Última sync {describeLastSync(lastSyncAt)}</span>
        </div>

        <button
          type="button"
          className={styles.syncButton}
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing && <span className={styles.spinner} aria-hidden="true" />}
          {syncing ? "Sincronizando..." : "Sync agora"}
        </button>
      </div>
    </header>
  );
}
