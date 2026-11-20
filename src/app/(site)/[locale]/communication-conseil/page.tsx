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

  const domainItems = t.raw("domains.items") as Array<{
    title: string;
    desc: string;
  }>;
  const audienceItems = t.raw("audiences.items") as Array<{
    title: string;
    desc: string;
  }>;
  const methodSteps = t.raw("method.steps") as Array<{
    title: string;
    desc: string;
  }>;
  const formats = t.raw("support.formats") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image="/assets/reunion-communication-entreprise.jpg"
        imageAlt={
          locale === "fr"
            ? "Réunion de travail en entreprise, présentation stratégique"
            : "Corporate working meeting, strategic presentation"
        }
      />

      {/* Positionnement et proposition de valeur */}
      <EditorialSection
        eyebrow={t("value.eyebrow")}
        title={t("value.title")}
        titleId="sec-value"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("value.p1")}</p>
          <p>{t("value.p2")}</p>
          <p className="border-l-2 border-rouge pl-6 text-white">
            {t("value.p3")}
          </p>
        </div>
      </EditorialSection>

      {/* Domaines d'intervention */}
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
        <p className="mt-8 flex items-center gap-3 text-[0.8rem] italic text-steel">
          <DemoBadge />
          {t("domains.note")}
        </p>
      </EditorialSection>

      {/* Conseil éditorial */}
      <EditorialSection
        eyebrow={t("editorial.eyebrow")}
        title={t("editorial.title")}
        titleId="sec-editorial"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("editorial.p1")}</p>
          <p>{t("editorial.p2")}</p>
        </div>
      </EditorialSection>

      {/* Stratégie de communication */}
      <EditorialSection
        eyebrow={t("strategy.eyebrow")}
        title={t("strategy.title")}
        titleId="sec-strategy"
        tinted
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("strategy.p1")}</p>
          <p>{t("strategy.p2")}</p>
        </div>
      </EditorialSection>

      {/* Accompagnement et expertise */}
      <EditorialSection
        eyebrow={t("support.eyebrow")}
        title={t("support.title")}
        titleId="sec-support"
      >
        <p className="max-w-2xl text-[1rem] leading-[1.85] text-silver/90">
          {t("support.p1")}
        </p>
        <Reveal className="mt-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {formats.map((format) => (
              <li
                key={format}
                className="flex items-start gap-3 rounded-lg border border-mist/10 bg-surface/50 p-4 text-[0.9rem] text-mist/90"
              >
                <span
                  className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-rouge"
                  aria-hidden="true"
                />
                {format}
              </li>
            ))}
          </ul>
        </Reveal>
      </EditorialSection>

      {/* Approche méthodologique */}
      <EditorialSection
        eyebrow={t("method.eyebrow")}
        title={t("method.title")}
        titleId="sec-method"
        tinted
      >
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methodSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.06}>
              <div className="h-full border-t-2 border-rouge/70 pt-5">
                <p className="font-serif text-[1.05rem] italic text-graphite">
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

      {/* Organisations concernées */}
      <EditorialSection
        eyebrow={t("audiences.eyebrow")}
        title={t("audiences.title")}
        titleId="sec-audiences"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audienceItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="card-editorial h-full p-6">
                <h3 className="font-serif text-[1.15rem] leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.87rem] leading-relaxed text-steel">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
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
