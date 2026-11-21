import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { PublicationsExplorer } from "@/components/site/publications-explorer";
import { CtaSection } from "@/components/site/cta-section";
import { getPublications } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "publications.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("publications");

  /* Seules les publications réellement publiées sont présentées. */
  const publications = await getPublications(locale as "fr" | "en");

  return (
    <>
      {/* ============ HERO ÉDITORIAL ============ */}
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        paragraphs={[t("hero.p1"), t("hero.p2"), t("hero.p3")]}
        image="/assets/editorial-presse-magazines.jpg"
        imageAlt={
          locale === "fr"
            ? "Magazines et ordinateur portable sur un bureau de rédaction"
            : "Magazines and laptop on an editorial desk"
        }
        ctaLabel={t("hero.cta")}
        ctaHref="#sec-listing"
      />

      {/* ============ INTRODUCTION : LA DÉMARCHE ============ */}
      <section aria-labelledby="sec-intro" className="border-t border-mist/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("intro.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2
                id="sec-intro"
                className="display-2 max-w-2xl text-balance text-white"
              >
                {t("intro.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("intro.p1")}</p>
                <p>{t("intro.p2")}</p>
                <p>{t("intro.p3")}</p>
              </div>
              <p className="mt-8 max-w-xl border-l-2 border-or pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
                {t("intro.p4")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ ARTICLES & ANALYSES : FILTRES + GRILLE ============ */}
      <section
        id="sec-listing"
        aria-labelledby="sec-articles"
        className="scroll-mt-24 border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="eyebrow">{t("listing.eyebrow")}</p>
            <h2
              id="sec-articles"
              className="display-2 mt-5 max-w-2xl text-balance text-white"
            >
              {t("listing.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 max-w-2xl space-y-4 text-[0.98rem] leading-[1.8] text-steel">
              <p>{t("listing.p1")}</p>
              <p>{t("listing.p2")}</p>
            </div>
          </Reveal>

          <div className="mt-14">
            <PublicationsExplorer publications={publications} />
          </div>
        </div>
      </section>

      {/* ============ COLLABORATION + ACCÈS CONTACT ============ */}
      <CtaSection
        eyebrow={t("collaboration.eyebrow")}
        title={t("collaboration.title")}
        paragraphs={[
          t("collaboration.p1"),
          t("collaboration.p2"),
          t("collaboration.p3"),
        ]}
        buttonLabel={t("collaboration.cta")}
        buttonHref="/contact"
      />
    </>
  );
}
