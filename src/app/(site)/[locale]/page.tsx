import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { getProductions, getPublications, getSettings } from "@/lib/content";
import { site, SEO_KEYWORDS } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";
import { MaskLines } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { PublicationCard } from "@/components/site/publication-card";
import { HomeHero } from "@/components/site/home/home-hero";
import { HomeIntro } from "@/components/site/home/home-intro";
import { HomeDomains, type DomainPlate } from "@/components/site/home/home-domains";
import {
  HomeMarquee,
  type MarqueeCard,
} from "@/components/site/home/home-marquee";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale === "fr";

  const [t, tC, tP, tPub] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getTranslations("productions"),
    getTranslations("publications"),
  ]);
  const [productions, publications, settings] = await Promise.all([
    getProductions(locale as "fr" | "en"),
    getPublications(locale as "fr" | "en"),
    getSettings(),
  ]);
  const featured = publications[0] ?? null;
  const recent = publications.slice(1, 3);

  /* Données structurées : personne + site */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.name,
        alternateName: site.shortName,
        url: `${site.siteUrl}/${locale}`,
        jobTitle: fr
          ? "Journaliste international et réalisateur de documentaires"
          : "International journalist and documentary filmmaker",
        address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
        knowsLanguage: ["fr", "en", "es"],
        knowsAbout: SEO_KEYWORDS[fr ? "fr" : "en"],
        sameAs: [settings.linkedin, settings.twitter, settings.vimeo],
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: `${site.siteUrl}/${locale}`,
        inLanguage: locale,
      },
    ],
  };

  /* Domaines d'intervention : quatre plaques photographiques */
  const domains: DomainPlate[] = [
    {
      key: "journalism",
      num: "01",
      href: "/journalisme",
      image: "/assets/journaliste-reportage-microphone.jpg",
      plate: "sand",
      tilt: -8,
      title: t("expertise.items.journalism.title"),
      desc: t("expertise.items.journalism.desc"),
      cta: t("expertise.items.journalism.cta"),
    },
    {
      key: "documentary",
      num: "02",
      href: "/documentaire",
      image: "/assets/realisation-documentaire-tournage.jpg",
      plate: "mist",
      tilt: 6,
      title: t("expertise.items.documentary.title"),
      desc: t("expertise.items.documentary.desc"),
      cta: t("expertise.items.documentary.cta"),
    },
    {
      key: "comms",
      num: "03",
      href: "/communication-conseil",
      image: "/assets/reunion-communication-entreprise.jpg",
      plate: "steel",
      tilt: -5,
      title: t("expertise.items.comms.title"),
      desc: t("expertise.items.comms.desc"),
      cta: t("expertise.items.comms.cta"),
    },
    {
      key: "training",
      num: "04",
      href: "/formation",
      image: "/assets/formation-masterclass-journalisme.jpg",
      plate: "dune",
      tilt: 8,
      title: t("expertise.items.training.title"),
      desc: t("expertise.items.training.desc"),
      cta: t("expertise.items.training.cta"),
    },
  ];

  /* Galerie défilante : voies productions + publications */
  const productionIcon: Record<string, "mic" | "clapper" | "users" | "megaphone"> = {
    reportage: "mic",
    documentaire: "clapper",
    interview: "users",
    communication: "megaphone",
  };
  const productionCards: MarqueeCard[] = productions.map((p) => ({
    kind: "media",
    key: `prod-${p.slug}`,
    href: `/productions/${p.slug}`,
    image: p.coverImage ?? "/assets/production-ligne-directe.jpg",
    caption: p.title,
    icon: productionIcon[p.category] ?? "clapper",
    meta: `${tP(`portfolio.filters.${p.category}`)} — ${p.year}`,
  }));
  const readingTime = tPub.raw("readingTime") as string;
  const publicationCards: MarqueeCard[] = publications.map((p) =>
    p.coverImage
      ? {
          kind: "media",
          key: `pub-${p.slug}`,
          href: `/publications/${p.slug}`,
          image: p.coverImage,
          caption: p.title,
          icon: "file",
          meta: readingTime.replace("{minutes}", String(p.readingMinutes)),
        }
      : {
          kind: "note",
          key: `pub-${p.slug}`,
          href: `/publications/${p.slug}`,
          kicker: p.categoryLabel,
          title: p.title,
          meta: readingTime.replace("{minutes}", String(p.readingMinutes)),
          cta: tC("actions.readMore"),
        }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============ 01 — HERO : contenu + mosaïque 3D ============ */}
      <HomeHero
        copy={{
          eyebrow: t("hero.eyebrow"),
          title1: t("hero.title1"),
          title2: t("hero.title2"),
          title3: t("hero.title3"),
          subtitle: t("hero.subtitle"),
          complement: t("hero.complement"),
          approach: t("hero.approach"),
          ctaPrimary: t("hero.ctaPrimary"),
          ctaSecondary: t("hero.ctaSecondary"),
          keywords: SEO_KEYWORDS[fr ? "fr" : "en"],
          keywordsLabel: t("hero.keywordsLabel"),
        }}
      />

      {/* ============ 02 · À PROPOS : split éditorial (section claire,
            collée à la bande de mots-clés du hero — aucune marge) ============ */}
      <div className="dt-light">
        <HomeIntro
          copy={{
            eyebrow: t("intro.eyebrow"),
            title: t("intro.title"),
            p1: t("intro.p1"),
            p2: t("intro.p2"),
            p3: t("intro.p3"),
            p4: t("intro.p4"),
          }}
          cards={{
            stage: {
              src: "/assets/realisation-documentaire-tournage.jpg",
              alt: fr
                ? "Tournage d'un reportage documentaire en immersion sur le terrain"
                : "Documentary shoot filmed in immersion in the field",
              href: "/productions",
              linkLabel: t("hero.ctaPrimary"),
            },
            question: featured
              ? {
                  src: featured.coverImage,
                  title: featured.title,
                  meta: featured.categoryLabel,
                  href: `/publications/${featured.slug}`,
                }
              : null,
            result: productions[0]
              ? {
                  src: productions[0].coverImage ?? "/assets/production-ligne-directe.jpg",
                  title: productions[0].title,
                  href: `/productions/${productions[0].slug}`,
                }
              : null,
          }}
        />
      </div>

      {/* ============ 03 — APPROCHE JOURNALISTIQUE ============ */}
      <section
        aria-labelledby="sec-approach"
        className="dt-panel relative border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("approach.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2
                id="sec-approach"
                className="display-2 max-w-2xl text-balance text-white"
              >
                <MaskLines delay={0.06}>{t("approach.title")}</MaskLines>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("approach.p1")}</p>
                <p>{t("approach.p2")}</p>
              </div>
              <p className="mt-8 max-w-xl border-l-2 border-or pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
                {t("approach.p3")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 04 — DOMAINES D'INTERVENTION : plaques ============ */}
      <HomeDomains
        eyebrow={t("expertise.eyebrow")}
        title={t("expertise.title")}
        domains={domains}
      />

      {/* ============ 05 — PRODUCTIONS : galerie défilante ============ */}
      <HomeMarquee
        copy={{
          eyebrow: t("productions.eyebrow"),
          title: t("productions.title"),
          intro1: t("productions.intro1"),
          intro2: t("productions.intro2"),
          intro3: t("productions.intro3"),
          cta: t("productions.cta"),
          pause: t("gallery.pause"),
          resume: t("gallery.resume"),
          readMore: tC("actions.readMore"),
        }}
        lanes={[
          { label: t("productions.title"), cards: productionCards },
          { label: t("publications.title"), cards: publicationCards },
        ]}
      />

      {/* ============ 06 — PUBLICATIONS (section claire alternée) ============ */}
      <section
        aria-labelledby="sec-publications"
        className="dt-light"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("publications.eyebrow")}
            title={t("publications.title")}
            intro={t("publications.intro1")}
          />

          {featured ? (
            <Reveal className="mt-14">
              <PublicationCard
                publication={featured}
                featured
                labels={{
                  readMore: tC("actions.readMore"),
                  readingTime,
                }}
              />
            </Reveal>
          ) : null}

          {recent.length > 0 ? (
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {recent.map((p) => (
                <Reveal key={p.slug} className="min-w-0">
                  <PublicationCard
                    publication={p}
                    labels={{
                      readMore: tC("actions.readMore"),
                      readingTime,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          ) : null}

          <Reveal className="mt-14 flex justify-center">
            <Link href="/publications" className="btn-outline">
              {t("publications.cta")}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 07 — COLLABORATIONS ============ */}
      <section
        aria-labelledby="sec-collab"
        className="border-t border-mist/10 bg-ink-deep"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[0.95fr_2.05fr]">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow">{t("collaboration.eyebrow")}</p>
            </Reveal>
            {/* Portrait du journaliste — grande plaque dont la hauteur
                épouse celle du bloc de texte à sa droite */}
            <Reveal
              delay={0.12}
              className="mt-8 lg:mt-10 lg:flex lg:h-[calc(100%-3.75rem)]"
            >
              <figure className="group relative flex w-full max-w-[420px] flex-col lg:max-w-none">
                <span
                  className="absolute -inset-2.5 -rotate-3 rounded-2xl bg-surface-2/60 transition-transform duration-500 group-hover:rotate-0"
                  aria-hidden="true"
                />
                <span
                  className="absolute -right-2 -top-2 size-3 rounded-full bg-or"
                  aria-hidden="true"
                />
                <div className="relative aspect-[5/6] w-full overflow-hidden rounded-xl lg:aspect-auto lg:min-h-0 lg:flex-1">
                  <Image
                    src="/assets/portrait-studio-professionnel.jpg"
                    alt={fr
                      ? "Alexandre Morel, journaliste international, en studio"
                      : "Alexandre Morel, international journalist, in the studio"}
                    fill
                    sizes="(min-width: 1024px) 30vw, 92vw"
                    className="object-cover"
                    quality={95}
                  />
                </div>
                <figcaption className="mt-3.5 px-3 text-center text-[0.7rem] font-medium uppercase tracking-[0.16em] text-steel">
                  {site.name} — {site.city}
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2
                id="sec-collab"
                className="display-2 max-w-2xl text-balance text-white"
              >
                <MaskLines delay={0.06}>{t("collaboration.title")}</MaskLines>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p>{t("collaboration.p1")}</p>
                <p>{t("collaboration.p2")}</p>
                <p className="border-l-2 border-or pl-6 text-white">
                  {t("collaboration.p3")}
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/contact" className="btn-accent">
                  {t("collaboration.ctaPrimary")}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <a href={`mailto:${site.email}`} className="btn-outline">
                  {t("collaboration.ctaSecondary")}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
