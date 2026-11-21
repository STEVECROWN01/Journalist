/**
 * Registre des médias éditoriaux disponibles pour les couvertures.
 * (Registre statique déterministe — fonctionne aussi sur Vercel.)
 */
export interface MediaAsset {
  file: string;
  label: string;
}

export const mediaAssets: MediaAsset[] = [
  { file: "/assets/journaliste-reportage-microphone.jpg", label: "Reportage — micro, toits de Paris" },
  { file: "/assets/editorial-presse-magazines.jpg", label: "Presse — magazines et ordinateur" },
  { file: "/assets/realisation-documentaire-tournage.jpg", label: "Tournage — direction d'équipe" },
  { file: "/assets/formation-masterclass-journalisme.jpg", label: "Formation — masterclass en amphithéâtre" },
  { file: "/assets/portrait-studio-professionnel.jpg", label: "Portrait — studio, tablette" },
  { file: "/assets/portrait-bureau-direction.jpg", label: "Portrait — bureau, vue sur Paris" },
  { file: "/assets/reunion-communication-entreprise.jpg", label: "Communication — réunion d'entreprise" },
  { file: "/assets/salle-redaction-internationale.jpg", label: "Rédaction — salle de presse" },
  { file: "/assets/production-ligne-directe.jpg", label: "Couverture — Ligne directe" },
  { file: "/assets/production-terrain-partage.jpg", label: "Couverture — Terrain partagé" },
  { file: "/assets/production-contrepoints.jpg", label: "Couverture — Contrepoints" },
  { file: "/assets/production-cap-organisations.jpg", label: "Couverture — Cap sur les organisations" },
  { file: "/assets/publication-comprendre-terrain.jpg", label: "Couverture — Comprendre un terrain" },
];

export function isValidMedia(file: string | null | undefined): file is string {
  return !!file && mediaAssets.some((m) => m.file === file);
}
