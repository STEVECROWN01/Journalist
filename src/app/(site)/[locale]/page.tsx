import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getProductions, getPublications } from "@/lib/content";
import { site } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { ProductionCard } from "@/components/site/production-card";
import { PublicationCard } from "@/components/site/publication-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
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

  const [t, tC, tP, tPub] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getTranslations("productions"),
    getTranslations("publications"),
  ]);
  const [productions, publications] = await Promise.all([
    getProductions(locale as "fr" | "en"),
    getPublications(locale as "fr" | "en"),
  ]);
  const featured = publications.find((p) => p.featured) ?? publications[0];
  const recent = publications.filter((p) => p.slug !== featured?.slug).slice(0, 2);
  const reassurance = t.raw("hero.reassurance") as string[];

  /* Données structurées : personne + site */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.name,
        url: `${site.siteUrl}/${locale}`,
        jobTitle:
          locale === "fr"
            ? "Journaliste international et réalisateur de documentaires"
            : "International journalist and documentary filmmaker",
        address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
        knowsLanguage: ["fr", "en", "es"],
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: `${site.siteUrl}/${locale}`,
        inLanguage: locale,
      },
    ],
  };

  /* Domaines d'intervention (4 cartes) */
  const expertiseItems = [
    { key: "journalism", href: "/journalisme", num: "01" },
    { key: "documentary", href: "/documentaire", num: "02" },
    { key: "comms", href: "/communication-conseil", num: "03" },
    { key: "training", href: "/formation", num: "04" },
  ] as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============ 01 — HERO ÉDITORIAL ============ */}
      {/* Hauteur = écran exact (100svh) : entièrement visible sans
          défilement, du mobile au 4K — voir .hero-full dans globals.css */}
      <section className="hero-full relative flex flex-col overflow-hidden bg-ink-deep">
        <Image
          src="/assets/journaliste-reportage-microphone.jpg"
          alt={
            locale === "fr"
              ? "Journaliste en reportage, micro en main, sur un toit de Paris au coucher du soleil"
              : "Journalist reporting, microphone in hand, on a Paris rooftop at sunset"
          }
          fill
          priority
          sizes="100vw"
          className="hero-kenburns object-cover"
        />
        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
        <div className="hero-overlay-top absolute inset-0" aria-hidden="true" />
        <div className="hero-overlay-bottom absolute inset-0" aria-hidden="true" />

        <div className="hero-pad relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-14 sm:py-16 lg:py-20">
          <Reveal>
            <p className="eyebrow hero-eyebrow-row">{t("hero.eyebrow")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-1 hero-title hero-block mt-6 max-w-4xl text-white md:mt-7">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}{" "}
              <em className="text-mist">{t("hero.title3")}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="hero-subtitle hero-block mt-7 max-w-2xl text-[1.02rem] leading-[1.8] text-mist/85 md:mt-9">
              {t("hero.subtitle")}
            </p>
            <div className="hero-complement mt-4 max-w-xl space-y-3 text-[0.92rem] leading-[1.75] text-silver/90">
              <p>{t("hero.complement")}</p>
              <p className="hero-complement-p2">{t("hero.approach")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="hero-ctas mt-8 flex flex-wrap items-center gap-4 md:mt-10">
              <Link href="/productions" className="btn-primary">
                {t("hero.ctaPrimary")}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-outline">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Bandeau de réassurance + indicateur de défilement */}
        <div className="relative z-10 border-t border-white/[0.08] bg-ink-deep/30 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {reassurance.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-steel"
                >
                  <span
                    className="size-[3px] rounded-full bg-rouge"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="hero-scroll hidden shrink-0 items-center gap-2 text-steel md:flex"
              aria-hidden="true"
            >
              <span className="text-[0.65rem] uppercase tracking-[0.2em]">
                {t("hero.scroll")}
              </span>
              <ChevronDown size={14} className="animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 — INTRODUCTION ============ */}
      <section aria-labelledby="sec-intro" className="border-t border-mist/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("intro.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 id="sec-intro" className="display-2 max-w-2xl text-balance text-white">
                {t("intro.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("intro.p1")}</p>
                <p>{t("intro.p2")}</p>
                <p>{t("intro.p3")}</p>
                <p className="border-l-2 border-rouge pl-6 text-white">
                  {t("intro.p4")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 03 — APPROCHE JOURNALISTIQUE ============ */}
      <section
        aria-labelledby="sec-approach"
        className="border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("approach.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 id="sec-approach" className="display-2 max-w-2xl text-balance text-white">
                {t("approach.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("approach.p1")}</p>
                <p>{t("approach.p2")}</p>
              </div>
              <p className="mt-8 max-w-xl border-l-2 border-rouge pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
                {t("approach.p3")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 04 — DOMAINES D'INTERVENTION ============ */}
      <section aria-labelledby="sec-expertise" className="border-t border-mist/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("expertise.eyebrow")}
            title={t("expertise.title")}
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 sm:grid-cols-2">
            {expertiseItems.map((item, i) => (
              <Reveal key={item.key} delay={i * 0.06}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-surface md:p-10"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-[1.25rem] italic text-steel">
                      {item.num}
                    </span>
                    <ArrowRight
                      size={16}
                      className="-translate-x-2 text-rouge opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-[1.5rem] leading-snug text-white">
                    {t(`expertise.items.${item.key}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-steel">
                    {t(`expertise.items.${item.key}.desc`)}
                  </p>
                  <span className="link-editorial mt-6 text-[0.78rem] font-medium uppercase tracking-[0.14em]">
                    {t(`expertise.items.${item.key}.cta`)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 05 — PRODUCTIONS SÉLECTIONNÉES ============ */}
      <section
        aria-labelledby="sec-productions"
        className="border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("productions.eyebrow")}
            title={t("productions.title")}
            intro={t("productions.intro1")}
          />
          <Reveal delay={0.08}>
            <div className="mt-6 max-w-2xl space-y-4 text-[0.98rem] leading-[1.8] text-steel">
              <p>{t("productions.intro2")}</p>
              <p>{t("productions.intro3")}</p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {productions.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07} className="min-w-0">
                <ProductionCard
                  production={p}
                  categoryLabel={tP(`portfolio.filters.${p.category}`)}
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 flex justify-center">
            <Link href="/productions" className="btn-outline">
              {t("productions.cta")}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 06 — PUBLICATIONS ============ */}
      <section aria-labelledby="sec-publications" className="border-t border-mist/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("publications.eyebrow")}
            title={t("publications.title")}
            intro={t("publications.intro1")}
          />
          <Reveal delay={0.08}>
            <div className="mt-6 max-w-2xl space-y-4 text-[0.98rem] leading-[1.8] text-steel">
              <p>{t("publications.intro2")}</p>
              <p>{t("publications.intro3")}</p>
            </div>
          </Reveal>

          {featured ? (
            <Reveal className="mt-14">
              <PublicationCard
                publication={featured}
                featured
                labels={{
                  readMore: tC("actions.readMore"),
                  readingTime: tPub.raw("readingTime") as string,
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
                      readingTime: tPub.raw("readingTime") as string,
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
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("collaboration.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 id="sec-collab" className="display-2 max-w-2xl text-balance text-white">
                {t("collaboration.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p>{t("collaboration.p1")}</p>
                <p>{t("collaboration.p2")}</p>
                <p className="border-l-2 border-rouge pl-6 text-white">
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
