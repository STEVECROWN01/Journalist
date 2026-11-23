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

/* Retour en haut au rechargement — script inline exécuté pendant le
   parse du HTML, AVANT l'hydratation : Chrome et Firefox restaurent
   sinon la position de défilement de la page précédente.
   Double verrou :
   1. la restauration native est neutralisée (mode « manual ») pour ce
      rechargement, hors ancre explicite ;
   2. un sentinel remonte la page si une restauration tardive la fait
      malgré tout sauter — grand décalage sans aucune interaction.
   Le mode « auto » est rétabli à la première interaction passée un
   délai de sécurité après le chargement (la tentative de restauration
   du navigateur est alors passée) : les navigations retour / avant
   continuent de retrouver leurs positions, comme attendu. */
const RELOAD_TO_TOP_SCRIPT = `(function () {
  try {
    if (window.location.hash) return;
    var nav = performance.getEntriesByType("navigation")[0];
    var reload = nav
      ? nav.type === "reload"
      : performance.navigation && performance.navigation.type === 1;
    if (!reload) return;

    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    var inputs = ["wheel", "pointerdown", "keydown", "touchstart"];
    var touched = false;
    var mark = function () { touched = true; };
    inputs.forEach(function (name) {
      window.addEventListener(name, mark, { capture: true, passive: true, once: true });
    });

    /* Sentinel : saut de scroll sans interaction = restauration → top. */
    var settled = false;
    var onScroll = function () {
      if (touched || settled) return;
      if (window.scrollY > 200) window.scrollTo(0, 0);
    };
    window.addEventListener("scroll", onScroll, true);

    /* Rétablit « auto » (retour / avant) à la première interaction,
       une fois la fenêtre de restauration du navigateur passée. */
    var armedAt = 0;
    var onInteract = function () {
      if (!armedAt || performance.now() < armedAt) return;
      history.scrollRestoration = "auto";
      inputs.forEach(function (name) {
        window.removeEventListener(name, onInteract, true);
      });
      window.removeEventListener("scroll", onScroll, true);
    };
    inputs.forEach(function (name) {
      window.addEventListener(name, onInteract, { capture: true, passive: true });
    });
    var arm = function () {
      armedAt = performance.now() + 2000;
      setTimeout(function () { if (!touched) settled = true; }, 2500);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
  } catch (e) {}
})();`;

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
        <script dangerouslySetInnerHTML={{ __html: RELOAD_TO_TOP_SCRIPT }} />
        <NextIntlClientProvider>
          <SmoothScroll />
          <SiteHeader
            socials={{
              linkedin: settings.linkedin,
              twitter: settings.twitter,
              vimeo: settings.vimeo,
              email: settings.email,
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
