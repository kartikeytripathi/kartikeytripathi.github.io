"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Lenis-powered momentum scrolling for the revamp preview.
 * Fully disabled when the visitor prefers reduced motion — native scroll only.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // gentle exponential ease-out — smooth but not floaty
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
