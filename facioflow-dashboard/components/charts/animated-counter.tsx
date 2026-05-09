"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "@/lib/hooks/use-in-view";
import styles from "./animated-counter.module.css";

export type AnimatedCounterProps = {
  value: number;
  /** Duração total da animação em ms (default 1500). */
  duration?: number;
  /** Texto antes do número, ex: "$", "+". */
  prefix?: string;
  /** Texto depois do número, ex: "%", " tasks". */
  suffix?: string;
  /** Casas decimais (default 0 = inteiros). */
  decimals?: number;
  className?: string;
};

/**
 * Detecta preferência de motion reduzido. Returna boolean estático
 * — não atualiza ao vivo (suficiente pra single-fire).
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Formata o número com decimais e separadores brasileiros.
 * Mantém locale pt-BR pra alinhar com o resto do dashboard.
 */
function formatNumber(n: number, decimals: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function AnimatedCounter({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  // Threshold 0.5 — counter precisa estar bem visível antes de animar.
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [display, setDisplay] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    // Reduced motion: pula a animação, exibe valor final direto.
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cúbico — desacelera no final, sem overshoot
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Garante valor final exato (evita drift de ponto flutuante)
        setDisplay(to);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [inView, value, duration]);

  // Formatação consistente: decimals=0 usa Math.round pra evitar "0.0"
  // antes do tick final; decimals>0 deixa toLocaleString cuidar.
  const rendered =
    decimals === 0
      ? formatNumber(Math.round(display), 0)
      : formatNumber(display, decimals);

  // aria-label memoizado: só recalcula quando o valor final muda,
  // não a cada tick do RAF. Screen readers leem o valor estável.
  const finalLabel = useMemo(
    () => `${prefix}${formatNumber(value, decimals)}${suffix}`,
    [prefix, value, decimals, suffix]
  );

  const classes = className ? `${styles.counter} ${className}` : styles.counter;

  return (
    <span
      ref={ref}
      className={classes}
      aria-label={finalLabel}
      role="status"
      aria-atomic="true"
    >
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
