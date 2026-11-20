import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { EditorialSection } from "@/components/site/editorial-section";
import { CtaSection } from "@/components/site/cta-section";
import { DemoBadge } from "@/components/site/demo-badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "training.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("training");

  const domainItems = t.raw("domains.items") as Array<{
    title: string;
    desc: string;
  }>;
  const audienceItems = t.raw("audiences.items") as Array<{
    title: string;
    desc: string;
  }>;
  const formatItems = t.raw("formats.items") as Array<{
    title: string;
    desc: string;
  }>;

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image="/assets/formation-masterclass-journalisme.jpg"
        imageAlt={
          locale === "fr"
            ? "Masterclass de journalisme devant un amphithéâtre d'étudiants"
            : "Journalism masterclass in front of a lecture hall of students"
        }
      />

      {/* Philosophie pédagogique */}
      <EditorialSection
        eyebrow={t("philosophy.eyebrow")}
        title={t("philosophy.title")}
        titleId="sec-philosophy"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("philosophy.p1")}</p>
          <p className="border-l-2 border-rouge pl-6 text-white">
            {t("philosophy.p2")}
          </p>
        </div>
      </EditorialSection>

      {/* Domaines de formation */}
      <EditorialSection
        eyebrow={t("domains.eyebrow")}
        title={t("domains.title")}
        titleId="sec-domains"
        tinted
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 sm:grid-cols-2 lg:grid-cols-3">
          {domainItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="h-full bg-ink p-7 transition-colors hover:bg-surface">
                <span className="font-serif text-[1rem] italic text-rouge">
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

      {/* Publics concernés */}
      <EditorialSection
        eyebrow={t("audiences.eyebrow")}
        title={t("audiences.title")}
        titleId="sec-audiences"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {audienceItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="card-editorial h-full p-7">
                <h3 className="font-serif text-[1.2rem] leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-steel">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </EditorialSection>

      {/* Approche et méthodologie */}
      <EditorialSection
        eyebrow={t("approach.eyebrow")}
        title={t("approach.title")}
        titleId="sec-approach"
        tinted
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("approach.p1")}</p>
          <p>{t("approach.p2")}</p>
        </div>
      </EditorialSection>

      {/* Formats d'intervention */}
      <EditorialSection
        eyebrow={t("formats.eyebrow")}
        title={t("formats.title")}
        titleId="sec-formats"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {formatItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="h-full border-t border-mist/15 pt-6">
                <span className="font-serif text-[1.05rem] italic text-rouge">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-[1.2rem] text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.87rem] leading-relaxed text-steel">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </EditorialSection>

      {/* Expérience et références vérifiées */}
      <EditorialSection
        eyebrow={t("experience.eyebrow")}
        title={t("experience.title")}
        titleId="sec-experience"
        tinted
      >
        <p className="max-w-2xl text-[1rem] leading-[1.85] text-silver/90">
          {t("experience.p1")}
        </p>
        <p className="mt-8 flex items-center gap-3 text-[0.8rem] italic text-steel">
          <DemoBadge />
          {t("experience.note")}
        </p>
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
