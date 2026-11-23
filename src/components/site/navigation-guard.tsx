"use client";

import { useEffect } from "react";

/* Garde-fou de pré-lancement : sur la page d'accueil, tous les liens
   et boutons de navigation sont neutralisés AU CLIC — aucun accès aux
   autres pages. Le survol reste intact : l'URL cible continue de
   s'afficher dans l'angle inférieur gauche du navigateur, exactement
   comme sur le web.
   Pour tout réactiver : passer NAVIGATION_DISABLED à false. */
const NAVIGATION_DISABLED = true;

/* Racines de langue : la navigation reste active entre les accueils
   FR / EN et le retour en haut (aucune « autre page » n'est atteinte). */
const ALLOWED_HREFS = new Set(["/", "/fr", "/en"]);

/**
 * Neutre toute navigation au clic sur l'accueil : l'écouteur capture
 * l'événement au niveau du document AVANT React et le navigateur.
 * preventDefault bloque la redirection, stopPropagation empêche les
 * gestionnaires intermédiaires de réagir.
 */
export function NavigationGuard() {
  useEffect(() => {
    if (!NAVIGATION_DISABLED) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      /* Clic principal uniquement — le clavier n'est pas concerné. */
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      /* Ancres pures au sein de la page (accessibilité) : actives. */
      if (!href || href.startsWith("#")) return;
      /* Accueils FR / EN : la navigation entre pages d'accueil reste
         possible, le clic sur le nom remonte en haut de l'accueil. */
      if (ALLOWED_HREFS.has(href)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
