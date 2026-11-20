import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { EditorialSection } from "@/components/site/editorial-section";
import { CtaSection } from "@/components/site/cta-section";
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

  const methodSteps = t.raw("method.steps") as Array<{
    title: string;
    desc: string;
  }>;
  const skills = t.raw("skills.items") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image="/assets/realisation-documentaire-tournage.jpg"
        imageAlt={
          locale === "fr"
            ? "Tournage documentaire en extérieur, direction d'une équipe"
            : "Documentary shoot outdoors, directing a crew"
        }
      />

      {/* Approche audiovisuelle */}
      <EditorialSection
        eyebrow={t("approach.eyebrow")}
        title={t("approach.title")}
        titleId="sec-approach"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("approach.p1")}</p>
          <p className="border-l-2 border-rouge pl-6 text-white">
            {t("approach.p2")}
          </p>
        </div>
      </EditorialSection>

      {/* Portfolio avec filtres */}
      <EditorialSection
        eyebrow={t("portfolio.eyebrow")}
        title={t("portfolio.title")}
        titleId="sec-portfolio"
        tinted
      >
        <PortfolioGrid productions={productions} />
      </EditorialSection>

      {/* Méthodologie de production */}
      <EditorialSection
        eyebrow={t("method.eyebrow")}
        title={t("method.title")}
        titleId="sec-method"
      >
        <ol className="grid gap-8 sm:grid-cols-2">
          {methodSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.06}>
              <div className="card-editorial h-full p-7">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[1.6rem] italic text-rouge">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-[1.25rem] text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-steel">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </EditorialSection>

      {/* Compétences audiovisuelles */}
      <EditorialSection
        eyebrow={t("skills.eyebrow")}
        title={t("skills.title")}
        titleId="sec-skills"
        tinted
      >
        <ul className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <Reveal as="li" key={skill}>
              <span className="inline-block rounded-full border border-mist/20 px-4 py-2 text-[0.85rem] text-mist/90">
                {skill}
              </span>
            </Reveal>
          ))}
        </ul>
      </EditorialSection>

      <CtaSection
        title={t("cta.title")}
        text={t("cta.text")}
        buttonLabel={t("cta.button")}
        buttonHref="/contact"
      />
    </>
  );
}
