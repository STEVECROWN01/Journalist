"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

/**
 * Défilement fluide à inertie (momentum) sur l'ensemble du site.
 * Désactivé automatiquement si l'utilisateur préfère réduire les animations.
 */

let lenisInstance: Lenis | null = null;

/** Fige le défilement (menu plein écran ouvert, modale…). */
export function stopSmoothScroll(): void {
  lenisInstance?.stop();
}

/** Relance le défilement fluide. */
export function startSmoothScroll(): void {
  lenisInstance?.start();
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      gestureOrientation: "vertical",
    });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
