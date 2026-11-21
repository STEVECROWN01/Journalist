/**
 * Configuration centrale du site — Alexandre Morel.
 */
export const site = {
  name: "Alexandre Morel",
  shortName: "A. Morel",
  role: {
    fr: "Journaliste international · Réalisateur · Conseil",
    en: "International journalist · Documentary director · Consultant",
  },
  email: "contact@alexandre-morel.example",
  phone: "+33 (0)1 00 00 00 00",
  city: "Paris",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://journalistefr.vercel.app",
  defaultLocale: "fr" as const,
  ogImage: "/assets/og-image.jpg",
};

/**
 * Mots-clés de référencement du site — source unique.
 * Utilisés dans les métadonnées (meta keywords, JSON-LD `knowsAbout`)
 * et présentés dans la bande défilante au bas du hero de l'accueil.
 */
export const SEO_KEYWORDS: Record<"fr" | "en", string[]> = {
  fr: [
    "Journaliste international",
    "Reportage de terrain",
    "Grand reporter",
    "Documentaire",
    "Réalisateur de documentaires",
    "Production audiovisuelle",
    "Journalisme d'investigation",
    "Interviews exclusives",
    "Analyse géopolitique",
    "Communication & Conseil",
    "Formation au journalisme",
    "Journaliste à Paris",
  ],
  en: [
    "International journalist",
    "Field reporting",
    "Foreign correspondent",
    "Documentary",
    "Documentary filmmaker",
    "Audiovisual production",
    "Investigative journalism",
    "Exclusive interviews",
    "Geopolitical analysis",
    "Communications & Consulting",
    "Journalism training",
    "Journalist in Paris",
  ],
};

/** Clés de sujet du formulaire de contact */
export const CONTACT_SUBJECTS = [
  "collaboration-journalistique",
  "production-documentaire",
  "conseil-communication",
  "formation",
  "autre",
] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

/** Catégories de productions (identiques FR/EN côté données) */
export const PRODUCTION_CATEGORIES = [
  "reportage",
  "documentaire",
  "interview",
  "communication",
] as const;
export type ProductionCategory = (typeof PRODUCTION_CATEGORIES)[number];
