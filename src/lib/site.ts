/**
 * Configuration centrale du site.
 * Identité de démonstration (fictive) — à personnaliser après validation.
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
