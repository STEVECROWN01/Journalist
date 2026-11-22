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
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        paragraphs={[
          t("hero.p1"),
          t("hero.p2"),
          t("hero.p3"),
        ]}
        image="/assets/Man_directing_film_crew_f7c433ef.jpg_f49f5942.jpg"
        imageAlt={
          locale === "fr"
            ? "Alexandre Morel dirigeant une équipe de tournage sur un toit de Paris"
            : "Alexandre Morel directing a film crew on a Paris rooftop"
        }
      />

      {/* Parcours */}
      <section aria-labelledby="sec-parcours" className="border-t border-mist/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("journey.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 id="sec-parcours" className="display-2 max-w-2xl text-balance text-white">
                {t("journey.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("journey.p1")}</p>
                <p>{t("journey.p2")}</p>
                <p>{t("journey.p3")}</p>
                <p className="border-l-2 border-or pl-6 text-white">
                  {t("journey.p4")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section
        aria-labelledby="sec-vision"
        className="border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("vision.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 id="sec-vision" className="display-2 max-w-2xl text-balance text-white">
                {t("vision.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("vision.p1")}</p>
                <p>{t("vision.p2")}</p>
              </div>
              <p className="mt-8 max-w-xl border-l-2 border-or pl-6 font-serif text-[1.25rem] leading-[1.6] text-white">
                {t("vision.p3")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Au-delà du journalisme */}
      <section aria-labelledby="sec-beyond" className="border-t border-mist/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[1fr_2.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">{t("beyond.eyebrow")}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 id="sec-beyond" className="display-2 max-w-2xl text-balance text-white">
                {t("beyond.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
                <p className="lede">{t("beyond.p1")}</p>
                <p>{t("beyond.p2")}</p>
                <p>{t("beyond.p3")}</p>
              </div>
              <Link href="/contact" className="btn-accent mt-10">
                {t("beyond.cta")}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
