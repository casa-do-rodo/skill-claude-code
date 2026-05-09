import styles from "./space-card.module.css";

export type SpaceCardProps = {
  name: string;
  type: "client" | "internal";
  taskCount: number;
  folderCount: number;
  listCount: number;
  completeCount: number;
};

/**
 * SpaceCard — card de space na lista `/projetos`.
 *
 * Server Component (sem `"use client"`): só recebe data já agregada e renderiza.
 * O hover effect (border-color shift + lift) é controlado pelo `<Link>` pai
 * via seletor `.cardLink:hover .card` no CSS — mantém o card "burro".
 *
 * Layout:
 *  - Header: avatar inicial (esquerda) + badge type (direita)
 *  - Nome em grande font-display
 *  - Stats grid 3 cols: Tasks / Módulos / Folders
 *  - Progress bar fina + label "{complete}/{total} ({pct}%)"
 */
export function SpaceCard({
  name,
  type,
  taskCount,
  folderCount,
  listCount,
  completeCount,
}: SpaceCardProps) {
  // Edge case: space sem tasks → 0% (sem divisão por zero).
  const pct = taskCount > 0 ? Math.round((completeCount / taskCount) * 100) : 0;
  // First grapheme — `[...name][0]` lida com emoji/acentos melhor que charAt.
  const initial = (name.trim()[0] ?? "?").toUpperCase();

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div
          className={`${styles.avatar} ${styles[`avatar_${type}`]}`}
          aria-hidden="true"
        >
          {initial}
        </div>
        <span className={`${styles.badge} ${styles[`badge_${type}`]}`}>
          {type}
        </span>
      </header>

      <h2 className={styles.name}>{name}</h2>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>Tasks</dt>
          <dd>{taskCount}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Módulos</dt>
          <dd>{listCount}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Folders</dt>
          <dd>{folderCount}</dd>
        </div>
      </dl>

      <div
        className={styles.progressWrap}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso de ${name}: ${pct}% completo`}
      >
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          {completeCount}/{taskCount} ({pct}%)
        </span>
      </div>
    </article>
  );
}
