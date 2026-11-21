import type { MetadataRoute } from "next";
import { getProductions, getPublications } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Sitemap XML : pages statiques + pages dynamiques bilingues avec hreflang. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["fr", "en"] as const;
  const lastModified = new Date();

  const staticPaths: Record<string, { fr: string; en: string }> = {
    "/": { fr: "/", en: "/" },
    "/a-propos": { fr: "/a-propos", en: "/about" },
    "/journalisme": { fr: "/journalisme", en: "/journalism" },
    "/documentaire": { fr: "/documentaire", en: "/documentary" },
    "/productions": { fr: "/productions", en: "/productions" },
    "/publications": { fr: "/publications", en: "/publications" },
    "/communication-conseil": {
      fr: "/communication-conseil",
      en: "/communications-consulting",
    },
    "/formation": { fr: "/formation", en: "/training" },
    "/contact": { fr: "/contact", en: "/contact" },
  };

  const entries: MetadataRoute.Sitemap = [];

  for (const [, paths] of Object.entries(staticPaths)) {
    for (const locale of locales) {
      entries.push({
        url: `${site.siteUrl}/${locale}${paths[locale] === "/" ? "" : paths[locale]}`,
        lastModified,
        changeFrequency: "monthly",
        priority: paths[locale] === "/" ? 1 : 0.8,
        alternates: {
          languages: {
            fr: `${site.siteUrl}/fr${paths.fr === "/" ? "" : paths.fr}`,
            en: `${site.siteUrl}/en${paths.en === "/" ? "" : paths.en}`,
          },
        },
      });
    }
  }

  /* Pages dynamiques : publications et productions.
     Une URL anglaise n'est proposée que si une version validée existe. */
  const [publications, productions] = await Promise.all([
    getPublications("fr"),
    getProductions("fr"),
  ]);

  for (const p of publications) {
    const languages: Record<string, string> = {
      fr: `${site.siteUrl}/fr/publications/${p.slug}`,
    };
    if (p.hasEn) {
      languages.en = `${site.siteUrl}/en/publications/${p.slug}`;
    }
    entries.push({
      url: `${site.siteUrl}/fr/publications/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: { languages },
    });
    if (p.hasEn) {
      entries.push({
        url: `${site.siteUrl}/en/publications/${p.slug}`,
        lastModified: new Date(p.publishedAt),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  for (const p of productions) {
    for (const locale of locales) {
      entries.push({
        url: `${site.siteUrl}/${locale}/productions/${p.slug}`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: {
          languages: {
            fr: `${site.siteUrl}/fr/productions/${p.slug}`,
            en: `${site.siteUrl}/en/productions/${p.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
