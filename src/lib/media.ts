/**
 * Registre des médias éditoriaux disponibles pour les couvertures.
 * (Registre statique déterministe — fonctionne aussi sur Vercel.)
 */
export interface MediaAsset {
  file: string;
  label: string;
}

export const mediaAssets: MediaAsset[] = [
  { file: "/assets/Journalist_holding_microphone_in…_0b601b53.jpg", label: "Reportage — micro, toits de Paris" },
  { file: "/assets/editorial-presse-magazines.jpg", label: "Presse — magazines et ordinateur" },
  { file: "/assets/realisation-documentaire-tournage.jpg", label: "Tournage — direction d'équipe" },
  { file: "/assets/Man_directing_film_crew_f7c433ef.jpg_f49f5942.jpg", label: "Tournage — équipe de reportage" },
  { file: "/assets/Man_holding_tablet_in_studio_ea89e09a.jpg", label: "Studio — tablette en main" },
  { file: "/assets/formation-masterclass-journalisme.jpg", label: "Formation — masterclass en amphithéâtre" },
  { file: "/assets/portrait-studio-professionnel.jpg", label: "Portrait — studio, tablette" },
  { file: "/assets/portrait-bureau-direction.jpg", label: "Portrait — bureau, vue sur Paris" },
  { file: "/assets/reunion-communication-entreprise.jpg", label: "Communication — réunion d'entreprise" },
  { file: "/assets/salle-redaction-internationale.jpg", label: "Rédaction — salle de presse" },
  { file: "/assets/production-ligne-directe.jpg", label: "Reportage — tournage sur le terrain" },
  { file: "/assets/production-terrain-partage.jpg", label: "Documentaire — série, terrain" },
  { file: "/assets/production-contrepoints.jpg", label: "Interview — studio" },
  { file: "/assets/production-cap-organisations.jpg", label: "Communication — film d'organisation" },
  { file: "/assets/publication-comprendre-terrain.jpg", label: "Publication — comprendre le terrain" },
];

export function isValidMedia(file: string | null | undefined): file is string {
  return !!file && mediaAssets.some((m) => m.file === file);
}
