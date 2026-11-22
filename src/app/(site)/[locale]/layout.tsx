import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Sora, Inter, Playfair_Display } from "next/font/google";
import { routing } from "@/i18n/routing";
import { site, SEO_KEYWORDS } from "@/lib/site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSettings } from "@/lib/content";
import "../../globals.css";

/* Typographie exacte du site de référence : Sora pour les titres
   (600–800), Inter pour le corps et les éléments fonctionnels (400–500).
   Polices VARIABLES : un seul fichier par famille couvre toutes les
   graisses — chargement optimal, aucune requête supplémentaire. */
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Playfair Display ITALIQUE — uniquement pour l'accent éditorial du hero
   (« qui éclairent le monde. ») : l'élégance italique d'un titre de presse
   magazine, en contraste avec la neutralité géométrique de Sora. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });

  return {
    metadataBase: new URL(site.siteUrl),
    title: {
      default: t("title"),
      template: `%s — ${site.name}`,
    },
    description: t("description"),
    keywords: SEO_KEYWORDS[locale === "en" ? "en" : "fr"],
    authors: [{ name: site.name, url: `${site.siteUrl}/${locale}` }],
    creator: site.name,
    applicationName: site.name,
    alternates: {
      canonical: `${site.siteUrl}/${locale}`,
      languages: {
        fr: `${site.siteUrl}/fr`,
        en: `${site.siteUrl}/en`,
        "x-default": `${site.siteUrl}/fr`,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      title: t("title"),
      description: t("description"),
      url: `${site.siteUrl}/${locale}`,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [site.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  width: "device-width",
  initialScale: 1,
};

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const settings = await getSettings();

  return (
    <html lang={locale} className={`${sora.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider>
          <SmoothScroll />
          <SiteHeader
            socials={{
              linkedin: settings.linkedin,
              twitter: settings.twitter,
              vimeo: settings.vimeo,
            }}
          />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
