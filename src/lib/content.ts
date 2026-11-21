import { db } from "@/lib/db";
import { demoProductions, type DemoProduction } from "@/content/demo";
import type { Locale } from "@/i18n/routing";
import { publicationCategoryLabel } from "@/lib/site";

/* ============================ Vues publiques ============================ */

export interface PublicationView {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryKey: string;
  categoryLabel: string;
  coverImage: string | null;
  readingMinutes: number;
  publishedAt: string; // YYYY-MM-DD
  hasEn: boolean;
}

export interface ProductionView {
  slug: string;
  title: string;
  category: string;
  year: number;
  territory: string;
  role: string;
  context: string;
  description: string;
  coverImage: string | null;
  videoUrl: string | null;
}

export interface SettingsView {
  ownerName: string;
  baseCity: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  vimeo: string;
}

/* ============================ Helpers ============================ */

function isoDate(d: Date | string | null | undefined): string {
  if (!d) return new Date().toISOString();
  if (typeof d === "string") return d;
  return d.toISOString();
}

/** Temps de lecture estimé (≈ 200 mots/minute, minimum 1 minute). */
function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Une version anglaise n'est proposée que si elle est rédigée et validée. */
function hasEnglishVersion(r: {
  titleEn: string | null;
  contentEn: string | null;
}): boolean {
  return !!(r.titleEn?.trim() && r.contentEn?.trim());
}

function mapPublication(
  p: {
    slug: string;
    titleFr: string;
    titleEn: string | null;
    excerptFr: string;
    excerptEn: string | null;
    contentFr: string;
    contentEn: string | null;
    category: string;
    coverImage: string | null;
    publishedAt: Date | string | null;
  },
  locale: Locale
): PublicationView {
  const fr = locale === "fr";
  const content = fr ? p.contentFr : p.contentEn || p.contentFr;
  return {
    slug: p.slug,
    title: fr ? p.titleFr : p.titleEn || p.titleFr,
    excerpt: fr ? p.excerptFr : p.excerptEn || p.excerptFr,
    content,
    categoryKey: p.category,
    categoryLabel: publicationCategoryLabel(p.category, fr ? "fr" : "en"),
    coverImage: p.coverImage,
    readingMinutes: estimateReadingMinutes(content),
    publishedAt: isoDate(p.publishedAt).slice(0, 10),
    hasEn: hasEnglishVersion(p),
  };
}

function mapProduction(
  p: {
    slug: string;
    titleFr: string;
    titleEn: string;
    category: string;
    year: number;
    territoryFr: string;
    territoryEn: string;
    roleFr: string;
    roleEn: string;
    contextFr: string;
    contextEn: string;
    descriptionFr: string;
    descriptionEn: string;
    coverImage: string | null;
    videoUrl: string | null;
  },
  locale: Locale
): ProductionView {
  const fr = locale === "fr";
  return {
    slug: p.slug,
    title: fr ? p.titleFr : p.titleEn,
    category: p.category,
    year: p.year,
    territory: fr ? p.territoryFr : p.territoryEn,
    role: fr ? p.roleFr : p.roleEn,
    context: fr ? p.contextFr : p.contextEn,
    description: fr ? p.descriptionFr : p.descriptionEn,
    coverImage: p.coverImage,
    videoUrl: p.videoUrl,
  };
}

function mapDemoProduction(p: DemoProduction, locale: Locale): ProductionView {
  return mapProduction(p, locale);
}

/* ============================ Publications ============================ */

export async function getPublications(locale: Locale): Promise<PublicationView[]> {
  try {
    const rows = await db.publication.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    // Sans version anglaise validée, l'article n'apparaît que sur le site
    // français — aucune traduction approximative n'est présentée.
    return rows
      .filter((r) => locale === "fr" || hasEnglishVersion(r))
      .map((r) => mapPublication(r, locale));
  } catch {
    // Base indisponible : aucune publication n'est affichée (aucun faux contenu)
    return [];
  }
}

export async function getPublicationBySlug(
  slug: string,
  locale: Locale
): Promise<PublicationView | null> {
  try {
    const row = await db.publication.findFirst({
      where: { slug, status: "published" },
    });
    if (!row) return null;
    if (locale === "en" && !hasEnglishVersion(row)) return null;
    return mapPublication(row, locale);
  } catch {
    return null;
  }
}

/** Navigation éditoriale : article précédent (plus ancien) et suivant (plus récent). */
export async function getAdjacentPublications(
  slug: string,
  locale: Locale
): Promise<{ prev: PublicationView | null; next: PublicationView | null }> {
  const all = await getPublications(locale);
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < all.length - 1 ? all[index + 1] : null,
    next: index > 0 ? all[index - 1] : null,
  };
}

/* ============================ Productions ============================ */

export async function getProductions(locale: Locale): Promise<ProductionView[]> {
  try {
    const rows = await db.production.findMany({
      where: { status: "published" },
      orderBy: [{ order: "asc" }, { year: "desc" }],
    });
    if (rows.length > 0) return rows.map((r) => mapProduction(r, locale));
    return [];
  } catch {
    return demoProductions.map((p) => mapDemoProduction(p, locale));
  }
}

export async function getProductionBySlug(
  slug: string,
  locale: Locale
): Promise<ProductionView | null> {
  try {
    const row = await db.production.findFirst({
      where: { slug, status: "published" },
    });
    if (row) return mapProduction(row, locale);
    return null;
  } catch {
    const demo = demoProductions.find((p) => p.slug === slug);
    return demo ? mapDemoProduction(demo, locale) : null;
  }
}

/* ============================ Paramètres ============================ */

const defaultSettings: SettingsView = {
  ownerName: "Alexandre Morel",
  baseCity: "Paris, France",
  email: "contact@alexandre-morel.example",
  phone: "+33 (0)1 00 00 00 00",
  linkedin: "https://www.linkedin.com/in/alexandre-morel",
  twitter: "https://x.com/alexandre_morel",
  vimeo: "https://vimeo.com/alexandremorel",
};

export async function getSettings(): Promise<SettingsView> {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (!row) return defaultSettings;
    return {
      ownerName: row.ownerName,
      baseCity: row.baseCity,
      email: row.email,
      phone: row.phone,
      linkedin: row.linkedin,
      twitter: row.twitter,
      vimeo: row.vimeo,
    };
  } catch {
    return defaultSettings;
  }
}

/* ============================ Paramètres ============================ */
