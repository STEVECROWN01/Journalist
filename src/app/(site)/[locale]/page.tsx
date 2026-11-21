import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getProductions, getPublications } from "@/lib/content";
import { site } from "@/lib/site";
import { Reveal, RevealImage } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { CtaSection } from "@/components/site/cta-section";
import { ProductionCard } from "@/components/site/production-card";
import { PublicationCard } from "@/components/site/publication-card";
import { DemoBadge } from "@/components/site/demo-badge";

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

  /* Données structurées : personne + site (informations de démonstration) */
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

  const expertiseItems = [
    { key: "journalism", href: "/journalisme", num: "01" },
    { key: "documentary", href: "/productions", num: "02" },
    { key: "comms", href: "/communication-conseil", num: "03" },
    { key: "training", href: "/formation", num: "04" },
  ] as const;

  const collaborationItems = ["media", "producers", "organizations", "institutions"] as const;

  const journeyItems = t.raw("journey.items") as Array<{
    period: string;
    title: string;
    desc: string;
  }>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============ 01 — HERO ÉDITORIAL ============ */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-deep">
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
        <div className="hero-overlay-bottom absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-44 md:pb-32">
          <Reveal>
            <p className="eyebrow">{t("hero.eyebrow")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-1 mt-7 max-w-4xl text-white">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
              <br />
              <em className="text-mist">{t("hero.title3")}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-9 max-w-2xl text-[1.02rem] leading-[1.8] text-mist/85">
              {t("hero.subtitle")}
            </p>
            <p className="mt-4 max-w-xl text-[0.92rem] leading-[1.75] text-steel">
              {t("hero.complement")}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/a-propos" className="btn-primary">
                {t("hero.ctaPrimary")}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/productions" className="btn-outline">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </Reveal>
        </div>

        <div
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-steel md:flex"
          aria-hidden="true"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.2em]">
            {t("hero.scroll")}
          </span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ============ 02 — INTRODUCTION & POSITIONNEMENT ============ */}
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
                <p>{t("intro.p1")}</p>
                <p>{t("intro.p2")}</p>
                <p className="border-l-2 border-rouge pl-6 text-white">
                  {t("intro.p3")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 03 — DOMAINES D'EXPERTISE ============ */}
      <section aria-labelledby="sec-expertise" className="border-t border-mist/10 bg-surface/40">
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
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-steel">
                    {t(`expertise.items.${item.key}.desc`)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 04 — SYNTHÈSE DU PARCOURS ============ */}
      <section aria-labelledby="sec-journey" className="border-t border-mist/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("journey.eyebrow")}
            title={t("journey.title")}
            intro={t("journey.intro")}
          />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {journeyItems.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.08} className="border-t-2 border-rouge/70 pt-6">
                <p className="meta">{item.period}</p>
                <h3 className="mt-3 font-serif text-[1.3rem] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-steel">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 05 — PRODUCTIONS SÉLECTIONNÉES ============ */}
      <section aria-labelledby="sec-productions" className="border-t border-mist/10 bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("productions.eyebrow")}
              title={t("productions.title")}
              intro={t("productions.intro")}
            />
            <Reveal>
              <Link
                href="/productions"
                className="link-editorial shrink-0 text-[0.8rem] font-medium uppercase tracking-[0.14em]"
              >
                {tC("actions.allProductions")}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {productions.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <ProductionCard
                  production={p}
                  categoryLabel={tP(`portfolio.filters.${p.category}`)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 06 — APPROCHE & VISION ============ */}
      <section aria-labelledby="sec-approach" className="border-t border-mist/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("approach.eyebrow")}
            title={t("approach.title")}
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {(
              [
                { key: "listen", num: "01" },
                { key: "verify", num: "02" },
                { key: "narrate", num: "03" },
              ] as const
            ).map((item, i) => (
              <Reveal key={item.key} delay={i * 0.08}>
                <div className="h-full border-t border-mist/15 pt-6">
                  <span className="font-serif text-[1.5rem] italic leading-none text-rouge">
                    {item.num}
                  </span>
                  <h3 className="mt-3 font-serif text-[1.35rem] text-white">
                    {t(`approach.items.${item.key}.title`)}
                  </h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-steel">
                    {t(`approach.items.${item.key}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <RevealImage className="mt-20">
            <figure className="mx-auto max-w-3xl text-center">
              <span
                className="font-serif text-[3.5rem] leading-none text-rouge"
                aria-hidden="true"
              >
                “
              </span>
              <blockquote className="-mt-4 font-serif text-[1.5rem] leading-[1.5] text-mist md:text-[1.75rem]">
                {t("approach.quote")}
              </blockquote>
            </figure>
          </RevealImage>
        </div>
      </section>

      {/* ============ 07 — PUBLICATIONS RÉCENTES ============ */}
      <section aria-labelledby="sec-publications" className="border-t border-mist/10 bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("publications.eyebrow")}
              title={t("publications.title")}
              intro={t("publications.intro")}
            />
            <Reveal>
              <Link
                href="/publications"
                className="link-editorial shrink-0 text-[0.8rem] font-medium uppercase tracking-[0.14em]"
              >
                {tC("actions.allPublications")}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

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
                <Reveal key={p.slug}>
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
        </div>
      </section>

      {/* ============ 08 — POSSIBILITÉS DE COLLABORATION ============ */}
      <section aria-labelledby="sec-collab" className="border-t border-mist/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHeading
            eyebrow={t("collaboration.eyebrow")}
            title={t("collaboration.title")}
            intro={t("collaboration.intro")}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collaborationItems.map((key, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <div className="card-editorial h-full p-7">
                  <h3 className="font-serif text-[1.2rem] leading-snug text-white">
                    {t(`collaboration.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-steel">
                    {t(`collaboration.items.${key}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <div className="flex justify-end">
              <DemoBadge />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 09 — APPEL À L'ACTION FINAL ============ */}
      <CtaSection
        title={t("cta.title")}
        text={t("cta.text")}
        buttonLabel={t("cta.button")}
        buttonHref="/contact"
      />
    </>
  );
}
