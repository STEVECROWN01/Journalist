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
 * et présentés dans la bande défilante claire entre la section
 * « Approche journalistique » et la section « Productions sélectionnées ».
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
    "Zones de crise",
    "Correspondant de guerre",
    "Protection des sources",
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
    "Crisis zones",
    "War correspondent",
    "Source protection",
    "Geopolitical analysis",
    "Communications & Consulting",
    "Journalism training",
    "Journalist in Paris",
  ],
};

/**
 * Médias, producteurs et organisations avec lesquels Alexandre Morel
 * a collaboré — noms issus exclusivement du contenu réel du site
 * (parcours, productions, CV). Présentés dans la bande défilante au
 * bas du hero de l'accueil.
 */
export const PARTNERS: string[] = [
  "ARTE",
  "France 24",
  "Al Jazeera",
  "France 5",
  "Public Sénat",
  "Radio France",
  "Libération",
  "Le Temps",
  "L'Express",
  "Agat Films",
  "Association Aïna",
  "Cambodge Soir",
];

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

/** Catégories éditoriales des publications — valeurs stockées en base */
export const PUBLICATION_CATEGORIES = [
  "analyse",
  "reportage",
  "decryptage",
] as const;
export type PublicationCategory = (typeof PUBLICATION_CATEGORIES)[number];

/** Libellés localisés des catégories éditoriales (singulier / pluriel) */
export const PUBLICATION_CATEGORY_LABELS: Record<
  PublicationCategory,
  { fr: { one: string; other: string }; en: { one: string; other: string } }
> = {
  analyse: {
    fr: { one: "Analyse", other: "Analyses" },
    en: { one: "Analysis", other: "Analyses" },
  },
  reportage: {
    fr: { one: "Reportage", other: "Reportages" },
    en: { one: "Report", other: "Reports" },
  },
  decryptage: {
    fr: { one: "Décryptage", other: "Décryptages" },
    en: { one: "Explainer", other: "Explainers" },
  },
};

export function isPublicationCategory(v: string): v is PublicationCategory {
  return (PUBLICATION_CATEGORIES as readonly string[]).includes(v);
}

/** Libellé localisé d'une catégorie éditoriale (chaîne vide si inconnue) */
export function publicationCategoryLabel(
  key: string,
  locale: "fr" | "en",
  plural = false
): string {
  if (!isPublicationCategory(key)) return "";
  return PUBLICATION_CATEGORY_LABELS[key][locale][plural ? "other" : "one"];
}
