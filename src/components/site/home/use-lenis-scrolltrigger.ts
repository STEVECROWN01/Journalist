"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis-store";

/**
 * Synchronise Lenis (défilement fluide global du site) avec ScrollTrigger :
 * chaque position lissée notifie GSAP afin que les animations « scrub »
 * restent parfaitement alignées sur le défilement virtuel.
 * Sans Lenis (motion réduite), ScrollTrigger continue de fonctionner
 * sur le défilement natif.
 */
export function useLenisScrollTrigger() {
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    return () => {
      lenis.off("scroll", update);
    };
  }, []);
}
