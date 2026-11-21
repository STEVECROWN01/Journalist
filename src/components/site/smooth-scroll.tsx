"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/lenis-store";

/**
 * Défilement fluide à inertie (type Lenis) sur tout le site public.
 * — Molette : lissage avec vélocité et inertie, comme le site de référence.
 * — Tactile : comportement natif conservé (l'OS fournit déjà l'inertie).
 * — prefers-reduced-motion : désactivé, retour au défilement natif.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      infinite: false,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Si le menu était ouvert au moment d'un rendu client, ne pas laisser
    // le défilement reprendre derrière le panneau.
    if (document.body.style.overflow === "hidden") lenis.stop();

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (getLenis() === lenis) setLenis(null);
    };
  }, []);

  return null;
}
