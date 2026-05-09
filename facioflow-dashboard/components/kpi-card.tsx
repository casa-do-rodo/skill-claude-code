import styles from "./kpi-card.module.css";

export type KpiCardProps = {
  label: string;
  children: React.ReactNode;
  /** Contexto curto abaixo do valor — ex: "16% do total". */
  hint?: string;
};

/**
 * Card numérico do bloco KPI da overview.
 *
 * Server Component — não tem estado nem evento. Recebe o `children`
 * já renderizado (string crua, ou um <AnimatedCounter /> Client Component).
 * Esse padrão "Server Component como casca + Client filho" é exatamente
 * o que está documentado em getting-started/server-and-client-components.
 */
export function KpiCard({ label, children, hint }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{children}</div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}
