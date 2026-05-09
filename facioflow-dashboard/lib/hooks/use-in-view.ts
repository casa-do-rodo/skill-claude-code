"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver hook single-fire — dispara `inView=true` na primeira
 * vez que o elemento cruza o threshold e desconecta.
 *
 * Uso típico: triggerar animação on-mount-into-viewport sem repetir ao
 * scrollar de volta.
 *
 * @param threshold 0..1 — fração do elemento visível pra disparar (default 0.3)
 */
export function useInView<T extends Element = HTMLElement>(threshold: number = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // SSR/older browsers — fallback: marcar como visível direto
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
