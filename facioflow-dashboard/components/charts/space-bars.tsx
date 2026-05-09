"use client";

import { useInView } from "@/lib/hooks/use-in-view";
import styles from "./space-bars.module.css";

export type BarItem = {
  name: string;
  value: number;
  /** Categoria opcional — se passada, define a cor automática. */
  type?: "client" | "internal";
  /** Override manual da cor (ganha de `type`). */
  color?: string;
};

export type SpaceBarsProps = {
  data: BarItem[];
  /** Valor máximo da escala. Default: max(data.value). */
  maxValue?: number;
  /** Limita altura da bar (default 8px). */
  barHeight?: number;
  className?: string;
};

/**
 * Lista vertical de bars horizontais. Cada item: label esquerda, bar centro,
 * valor direita.
 *
 * Animação: transform: scaleX(0) → scaleX(1) com transform-origin: left.
 * Performance: HTML <div>, não SVG <rect> — evita o quebra-cabeça de
 * transform-box: fill-box (pitfall #1 em svg-animations-pitfalls).
 *
 * Stagger 100ms entre bars via nth-child.
 */
export function SpaceBars({
  data,
  maxValue,
  barHeight = 8,
  className,
}: SpaceBarsProps) {
  const { ref, inView } = useInView<HTMLUListElement>(0.3);

  // Calcula max só do array atual se não passado.
  // Math.max(...[]) → -Infinity, então proteger.
  const max =
    maxValue ??
    (data.length > 0 ? Math.max(...data.map((d) => d.value)) : 1);

  const containerClass = [
    styles.bars,
    inView ? styles.active : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ul ref={ref} className={containerClass}>
      {data.map((item, i) => {
        // Percent vai pro width do fill — não animamos width direto (causaria reflow).
        // Em vez disso, fill tem width: percent% e animamos transform: scaleX.
        const percent = max > 0 ? (item.value / max) * 100 : 0;
        const color = resolveColor(item);

        // Custom props no <li> pra serem herdadas por label, fill e value (descendentes).
        // --bar-delay no fill é redundante (também pega via cascade) mas torna
        // explícito de onde vem o stagger.
        const rowStyle = {
          "--bar-height": `${barHeight}px`,
          "--bar-delay": `${i * 100}ms`,
        } as React.CSSProperties;

        const fillStyle = {
          width: `${percent}%`,
          background: color,
        } as React.CSSProperties;

        return (
          <li key={`${item.name}-${i}`} className={styles.row} style={rowStyle}>
            <span className={styles.label}>{item.name}</span>
            <div
              className={styles.track}
              role="progressbar"
              aria-label={`${item.name}: ${item.value}`}
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={max}
            >
              <div className={styles.fill} style={fillStyle} />
            </div>
            <span className={styles.value}>{item.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Resolve cor: prop `color` direta > tipo > fallback accent.
 * Mantém centralizado pra alterar paleta sem mexer no JSX.
 */
function resolveColor(item: BarItem): string {
  if (item.color) return item.color;
  if (item.type === "client") return "var(--accent)";
  if (item.type === "internal") return "var(--cyan)";
  return "var(--accent)";
}
