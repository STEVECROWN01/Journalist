import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { ProductionCard } from "@/components/site/production-card";
import { CtaSection } from "@/components/site/cta-section";
import { getProductions } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documentary.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function DocumentaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("documentary");
  const tP = await getTranslations("productions");
  const productions = await getProductions(locale as "fr" | "en");
  const documentaries = productions.filter((p) => p.category === "documentaire");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        paragraphs={[t("hero.p1"), t("hero.p2")]}
        image="/assets/realisation-documentaire-tournage.jpg"
        imageAlt={
          locale === "fr"
            ? "Tournage documentaire en extérieur, équipe de réalisation"
            : "Documentary filming outdoors, production crew"
        }
        ctaLabel={t("hero.cta")}
        ctaHref="/productions"
      />

      {/* Approche documentaire */}
      <section aria-labelledby="sec-approach" className="border-t border-mist/10">
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
              <p className="mt-8 max-w-xl border-l-2 border-or pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
                {t("approach.p3")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Portfolio documentaire */}
      <section
        aria-labelledby="sec-portfolio"
        className="border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="eyebrow">{t("portfolio.eyebrow")}</p>
            <h2 id="sec-portfolio" className="display-2 mt-5 max-w-2xl text-balance text-white">
              {t("portfolio.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 max-w-2xl space-y-4 text-[0.98rem] leading-[1.8] text-steel">
              <p>{t("portfolio.p1")}</p>
              <p>{t("portfolio.p2")}</p>
            </div>
          </Reveal>

          {documentaries.length > 0 ? (
            <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {documentaries.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.07} className="min-w-0">
                  <ProductionCard
                    production={p}
                    categoryLabel={tP(`portfolio.filters.${p.category}`)}
                  />
                </Reveal>
              ))}
            </div>
          ) : null}

          <Reveal className="mt-14 flex justify-center">
            <Link href="/productions" className="btn-outline">
              {t("portfolio.cta")}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Publications liées aux sujets documentaires */}
      <CtaSection
        eyebrow={t("editorialCta.eyebrow")}
        title={t("editorialCta.title")}
        text={t("editorialCta.text")}
        buttonLabel={t("editorialCta.button")}
        buttonHref="/publications"
      />
    </>
  );
}
