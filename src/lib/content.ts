import { db } from "@/lib/db";
import {
  demoPublications,
  demoProductions,
  type DemoPublication,
  type DemoProduction,
} from "@/content/demo";
import type { Locale } from "@/i18n/routing";

/* ============================ Vues publiques ============================ */

export interface PublicationView {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  readingMinutes: number;
  featured: boolean;
  publishedAt: string; // YYYY-MM-DD
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

function mapPublication(
  p:
    | {
        slug: string;
        titleFr: string;
        titleEn: string;
        excerptFr: string;
        excerptEn: string;
        contentFr: string;
        contentEn: string;
        categoryFr: string;
        categoryEn: string;
        coverImage: string | null;
        readingMinutes: number;
        featured: boolean;
        publishedAt: Date | string | null;
      },
  locale: Locale
): PublicationView {
  const fr = locale === "fr";
  return {
    slug: p.slug,
    title: fr ? p.titleFr : p.titleEn,
    excerpt: fr ? p.excerptFr : p.excerptEn,
    content: fr ? p.contentFr : p.contentEn,
    category: fr ? p.categoryFr : p.categoryEn,
    coverImage: p.coverImage,
    readingMinutes: p.readingMinutes,
    featured: p.featured,
    publishedAt: isoDate(p.publishedAt).slice(0, 10),
  };
}

function mapDemoPublication(p: DemoPublication, locale: Locale): PublicationView {
  return mapPublication(
    {
      ...p,
      publishedAt: p.publishedAt,
    },
    locale
  );
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
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    if (rows.length > 0) return rows.map((r) => mapPublication(r, locale));
    return [];
  } catch {
    // Base indisponible (ex. déploiement sans DATABASE_URL) : repli statique
    return demoPublications.map((p) => mapDemoPublication(p, locale));
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
    if (row) return mapPublication(row, locale);
    return null;
  } catch {
    const demo = demoPublications.find((p) => p.slug === slug);
    return demo ? mapDemoPublication(demo, locale) : null;
  }
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
  baseCity: "Paris",
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

/* ============================ Articles associés ============================ */

export async function getRelatedPublications(
  slug: string,
  locale: Locale,
  limit = 2
): Promise<PublicationView[]> {
  const all = await getPublications(locale);
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current?.category);
  return [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, limit);
}
