/**
 * Formata um timestamp ISO em pt-BR como tempo relativo compacto.
 *
 * Granularidade adaptativa: <1min "agora há pouco" / <60min min /
 * <24h h / <30d dias / resto meses (aproximação 30d/mês).
 *
 * Usado em Server Components (overview KPI "última sync", clientes
 * "última atividade") e Client Components (topbar sync indicator).
 * Mantém um único call site evita drift de copy entre lugares.
 */
export function formatRelativeTime(isoTimestamp: string): string {
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "agora há pouco";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days}d`;
  const months = Math.floor(days / 30);
  return `há ${months} ${months > 1 ? "meses" : "mês"}`;
}
