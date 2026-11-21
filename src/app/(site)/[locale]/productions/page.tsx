import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { PortfolioGrid } from "@/components/site/portfolio-grid";
import { getProductions } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productions.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ProductionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("productions");
  const productions = await getProductions(locale as "fr" | "en");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        paragraphs={[t("hero.p1"), t("hero.p2")]}
        image="/assets/production-terrain-partage.jpg"
        imageAlt={
          locale === "fr"
            ? "Moment de partage sur un terrain de tournage documentaire"
            : "A shared moment on a documentary field shoot"
        }
        ctaLabel={t("hero.cta")}
        ctaHref="/contact"
      />

      {/* Approche de production */}
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
              </div>
              <p className="mt-8 max-w-xl border-l-2 border-or pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
                {t("approach.p2")}
              </p>
              <Link href="/contact" className="btn-accent mt-10">
                {t("approach.cta")}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Portfolio avec filtres */}
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
          <div className="mt-14">
            <PortfolioGrid productions={productions} />
          </div>
        </div>
      </section>
    </>
  );
}
