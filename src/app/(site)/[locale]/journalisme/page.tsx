import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Search, ShieldCheck, FileSearch, Radio, Layers } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { EditorialSection } from "@/components/site/editorial-section";
import { CtaSection } from "@/components/site/cta-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journalism.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function JournalismPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("journalism");

  const coverageItems = t.raw("coverage.items") as Array<{
    title: string;
    desc: string;
  }>;
  const reportingPractices = t.raw("reporting.practices") as string[];
  const researchPractices = t.raw("research.practices") as string[];
  const methodSteps = t.raw("method.steps") as Array<{
    title: string;
    desc: string;
  }>;

  const practiceIcons = [Radio, Search, ShieldCheck, FileSearch, Layers];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image="/assets/salle-redaction-internationale.jpg"
        imageAlt={
          locale === "fr"
            ? "Salle de rédaction internationale, journalistes au travail"
            : "International newsroom, journalists at work"
        }
      />

      {/* Positionnement */}
      <EditorialSection
        eyebrow={t("positioning.eyebrow")}
        title={t("positioning.title")}
        titleId="sec-positioning"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("positioning.p1")}</p>
          <p className="border-l-2 border-rouge pl-6 text-white">
            {t("positioning.p2")}
          </p>
        </div>
      </EditorialSection>

      {/* Domaines de couverture */}
      <EditorialSection
        eyebrow={t("coverage.eyebrow")}
        title={t("coverage.title")}
        titleId="sec-coverage"
        tinted
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 sm:grid-cols-2 lg:grid-cols-3">
          {coverageItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="h-full bg-ink p-7 transition-colors hover:bg-surface">
                <span className="font-serif text-[1.5rem] italic leading-none text-rouge">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-[1.2rem] leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-steel">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </EditorialSection>

      {/* Reportage & investigation */}
      <EditorialSection
        eyebrow={t("reporting.eyebrow")}
        title={t("reporting.title")}
        titleId="sec-reporting"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("reporting.p1")}</p>
          <p>{t("reporting.p2")}</p>
        </div>
        <Reveal className="mt-9">
          <ul className="grid gap-3 sm:grid-cols-2">
            {reportingPractices.map((practice, i) => {
              const Icon = practiceIcons[i % practiceIcons.length];
              return (
                <li
                  key={practice}
                  className="flex items-start gap-4 rounded-lg border border-mist/10 bg-surface/50 p-4"
                >
                  <Icon size={17} className="mt-1 shrink-0 text-rouge" aria-hidden="true" />
                  <span className="text-[0.9rem] leading-relaxed text-mist/90">
                    {practice}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </EditorialSection>

      {/* Recherche et collecte */}
      <EditorialSection
        eyebrow={t("research.eyebrow")}
        title={t("research.title")}
        titleId="sec-research"
        tinted
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("research.p1")}</p>
          <p>{t("research.p2")}</p>
        </div>
        <Reveal className="mt-9">
          <ul className="space-y-3">
            {researchPractices.map((practice) => (
              <li
                key={practice}
                className="flex items-start gap-3 border-b border-mist/8 pb-3 text-[0.92rem] text-mist/90"
              >
                <span
                  className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-rouge"
                  aria-hidden="true"
                />
                {practice}
              </li>
            ))}
          </ul>
        </Reveal>
      </EditorialSection>

      {/* Analyse des contextes */}
      <EditorialSection
        eyebrow={t("analysis.eyebrow")}
        title={t("analysis.title")}
        titleId="sec-analysis"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("analysis.p1")}</p>
          <p className="border-l-2 border-rouge pl-6 text-white">
            {t("analysis.p2")}
          </p>
        </div>
      </EditorialSection>

      {/* Méthodologie */}
      <EditorialSection
        eyebrow={t("method.eyebrow")}
        title={t("method.title")}
        titleId="sec-method"
        tinted
      >
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {methodSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.06}>
              <div className="h-full border-t-2 border-rouge/70 pt-5">
                <p className="font-serif text-[1.25rem] italic leading-none text-steel">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-serif text-[1.15rem] text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-steel">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </EditorialSection>

      {/* Sélection de travaux */}
      <EditorialSection
        eyebrow={t("work.eyebrow")}
        title={t("work.title")}
        titleId="sec-work"
      >
        <p className="max-w-2xl text-[0.98rem] leading-relaxed text-silver/90">
          {t("work.text")}
        </p>
        <Reveal className="mt-8">
          <div className="flex flex-wrap gap-4">
            <Link href="/productions" className="btn-outline">
              {t("work.productionsCta")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/publications" className="btn-outline">
              {t("work.publicationsCta")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
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
