"use client";

import { useInView } from "@/lib/hooks/use-in-view";
import styles from "./status-donut.module.css";

export type DonutSegment = {
  label: string;
  value: number;
  /** Cor CSS — pode ser var(--token), hex, rgb, etc. */
  color: string;
};

export type StatusDonutProps = {
  data: DonutSegment[];
  /** Largura/altura do SVG em px (default 200). */
  size?: number;
  /** Espessura do anel em px (default 24). */
  thickness?: number;
  /** Mostra legenda abaixo do donut (default true). */
  showLegend?: boolean;
  /** Label mostrado abaixo do total no centro (default "tasks"). */
  centerLabel?: string;
  className?: string;
};

/**
 * Donut chart custom SVG.
 *
 * Estratégia de stacking de segments:
 *  - Cada segment é um <circle> com stroke colorido sobre o raio do donut.
 *  - stroke-dasharray = "<segmentLength> <gap>" desenha apenas a fatia do segment.
 *  - stroke-dashoffset cumulativo posiciona cada segment após o anterior.
 *  - <g> parent rotacionado -90deg pra começar do topo (12h).
 *
 * Animação on-mount via classe .active aplicada quando inView=true:
 *  - estado inicial: stroke-dashoffset = circumference + cumulativeOffset (oculto)
 *  - estado final:   stroke-dashoffset = cumulativeOffset
 *  - transition CSS + transition-delay stagger por nth-child
 *  - prefers-reduced-motion desativa transition (estado final imediato)
 */
export function StatusDonut({
  data,
  size = 200,
  thickness = 24,
  showLegend = true,
  centerLabel = "tasks",
  className,
}: StatusDonutProps) {
  const { ref, inView } = useInView<SVGSVGElement>(0.3);

  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((acc, seg) => acc + seg.value, 0);

  // Segmentos com offsets pré-calculados.
  // cumulativeStart é a soma dos percents anteriores (em fração 0..1).
  const segments = (() => {
    let cumulative = 0;
    return data.map((seg) => {
      const percent = total > 0 ? seg.value / total : 0;
      const segmentLength = percent * circumference;
      // Offset negativo "rotaciona" o início do dash ao redor do círculo.
      // -cumulative * circumference posiciona este segment após os anteriores.
      const offset = -cumulative * circumference;
      cumulative += percent;
      return { ...seg, percent, segmentLength, offset };
    });
  })();

  const containerClass = [
    styles.donut,
    inView ? styles.active : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      <div className={styles.chartWrap} style={{ width: size, height: size }}>
        <svg
          ref={ref}
          className={styles.svg}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Distribuição: ${data
            .map((s) => `${s.label} ${s.value}`)
            .join(", ")}`}
        >
          {/* Track de fundo — anel cinza completo */}
          <circle
            className={styles.track}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={thickness}
          />

          {/* Grupo rotacionado -90deg pra primeiro segment começar no topo (12h).
              Usamos o atributo `transform` do SVG (não CSS) — funciona consistente
              em todos os browsers, sem dependência de transform-box/origin. */}
          <g transform={`rotate(-90 ${center} ${center})`}>
            {segments.map((seg, i) => {
              // CSS custom properties carregam os valores finais.
              // O CSS module aplica estado inicial (escondido) e transition.
              const style = {
                "--seg-length": seg.segmentLength,
                "--seg-offset": seg.offset,
                "--seg-circumference": circumference,
                "--seg-color": seg.color,
                "--seg-delay": `${i * 100}ms`,
              } as React.CSSProperties;

              return (
                <circle
                  key={`${seg.label}-${i}`}
                  className={styles.segment}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  strokeWidth={thickness}
                  strokeLinecap="butt"
                  style={style}
                />
              );
            })}
          </g>
        </svg>

        {/* Center: total + label. HTML overlay > SVG <text> pra herdar fonts/typography. */}
        <div className={styles.center} aria-hidden="true">
          <span className={styles.total}>{total}</span>
          <span className={styles.totalLabel}>{centerLabel}</span>
        </div>
      </div>

      {showLegend && (
        <ul className={styles.legend}>
          {data.map((seg, i) => (
            <li key={`${seg.label}-${i}`} className={styles.legendItem}>
              <span
                className={styles.swatch}
                style={{ background: seg.color }}
                aria-hidden="true"
              />
              <span className={styles.legendLabel}>{seg.label}</span>
              <span className={styles.legendValue}>{seg.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
