"use client";

import type Lenis from "lenis";

/**
 * Partage de l'instance Lenis entre le fournisseur de défilement fluide
 * (SmoothScroll) et les composants qui doivent suspendre/reprendre le
 * défilement (menu plein écran de l'en-tête).
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
