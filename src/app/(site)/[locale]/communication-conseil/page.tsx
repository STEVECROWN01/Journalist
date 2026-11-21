import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "comms.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function CommsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("comms");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        paragraphs={[t("hero.p1"), t("hero.p2")]}
        image="/assets/reunion-communication-entreprise.jpg"
        imageAlt={
          locale === "fr"
            ? "Réunion de travail en entreprise, présentation stratégique"
            : "Corporate working meeting, strategic presentation"
        }
        ctaLabel={t("hero.cta")}
        ctaHref="/contact"
      />

      {/* Approche */}
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
              <p className="mt-8 max-w-xl border-l-2 border-rouge pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
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
    </>
  );
}
