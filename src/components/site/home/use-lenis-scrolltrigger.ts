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
 *
 * Fiabilité : les positions des déclencheurs sont recalculées après le
 * chargement des polices (Sora/Inter changent les métriques du texte)
 * puis après le chargement complet de la page (images comprises).
 * Sans ces rafraîchissements, des blocs animés pouvaient rester
 * invisibles jusqu'à un rechargement manuel de la page.
 */
export function useLenisScrollTrigger() {
  useEffect(() => {
    const lenis = getLenis();
    const update = () => ScrollTrigger.update();
    lenis?.on("scroll", update);

    /* Recalcul dès que les polices variables sont prêtes */
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh, { once: true });
    /* Dernier filet : les images lazy déplacent le contenu — un recalcul
       différé couvre les chargements tardifs sans surcoût visible. */
    const late = window.setTimeout(refresh, 1500);

    return () => {
      cancelled = true;
      lenis?.off("scroll", update);
      window.removeEventListener("load", refresh);
      window.clearTimeout(late);
    };
  }, []);
}
