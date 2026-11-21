import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import { routing } from "@/i18n/routing";
import { site, SEO_KEYWORDS } from "@/lib/site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSettings } from "@/lib/content";
import "../../globals.css";

/* Typographie éditoriale : Source Serif 4 pour les titres,
   Source Sans 3 pour les textes fonctionnels (superfamille cohérente).
   Chargées en polices VARIABLES : un seul fichier par style couvre
   toutes les graisses (400 à 700) — ~2× moins de poids qu'une
   liste de graisses statiques. */
const sourceSerif = Source_Serif_4({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
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
    <html lang={locale} className={`${sourceSerif.variable} ${sourceSans.variable}`}>
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
