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

  const careerItems = t.raw("career.items") as Array<{
    period: string;
    title: string;
    desc: string;
  }>;
  const experienceItems = t.raw("experience.items") as Array<{
    role: string;
    org: string;
    period: string;
    desc: string;
  }>;
  const specItems = t.raw("specializations.items") as Array<{
    title: string;
    desc: string;
  }>;
  const skillGroups = ["journalism", "audiovisual", "advisory"] as const;
  const values = t.raw("vision.values") as string[];
  const languages = t.raw("languages.items") as Array<{
    name: string;
    level: string;
  }>;

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image="/assets/portrait-studio-professionnel.jpg"
        imageAlt={
          locale === "fr"
            ? "Alexandre Morel dans son studio, portrait professionnel"
            : "Alexandre Morel in his studio, professional portrait"
        }
      />

      {/* Biographie */}
      <EditorialSection
        eyebrow={t("bio.eyebrow")}
        title={t("bio.title")}
        titleId="sec-bio"
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("bio.p1")}</p>
          <p>{t("bio.p2")}</p>
          <p>{t("bio.p3")}</p>
          <p className="border-l-2 border-rouge pl-6 text-white">{t("bio.p4")}</p>
        </div>
        <p className="mt-8 flex items-center gap-3 text-[0.8rem] italic text-steel">
          <DemoBadge />
          {t("bio.note")}
        </p>
      </EditorialSection>

      {/* Parcours international */}
      <EditorialSection
        eyebrow={t("career.eyebrow")}
        title={t("career.title")}
        titleId="sec-career"
        tinted
      >
        <ol className="relative space-y-0 border-l border-mist/15 pl-8">
          {careerItems.map((item) => (
            <Reveal as="li" key={item.title} className="relative pb-10 last:pb-0">
              <span
                className="absolute -left-[2.15rem] top-1.5 size-[9px] rounded-full border-2 border-rouge bg-ink"
                aria-hidden="true"
              />
              <p className="meta">{item.period}</p>
              <h3 className="mt-2 font-serif text-[1.35rem] text-white">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-steel">
                {item.desc}
              </p>
            </Reveal>
          ))}
        </ol>
      </EditorialSection>

      {/* Expériences professionnelles */}
      <EditorialSection
        eyebrow={t("experience.eyebrow")}
        title={t("experience.title")}
        titleId="sec-exp"
      >
        <div className="divide-y divide-mist/10 border-y border-mist/10">
          {experienceItems.map((item) => (
            <Reveal key={item.role}>
              <div className="grid gap-3 py-7 md:grid-cols-[1.4fr_1fr_auto] md:gap-8">
                <div>
                  <h3 className="font-serif text-[1.25rem] text-white">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-[0.9rem] text-silver">{item.org}</p>
                </div>
                <p className="text-[0.88rem] leading-relaxed text-steel md:pt-1">
                  {item.desc}
                </p>
                <p className="meta whitespace-nowrap md:pt-2">{item.period}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 flex items-center gap-3 text-[0.8rem] italic text-steel">
          <DemoBadge />
          {t("experience.note")}
        </p>
      </EditorialSection>

      {/* Domaines de spécialisation */}
      <EditorialSection
        eyebrow={t("specializations.eyebrow")}
        title={t("specializations.title")}
        titleId="sec-spec"
        tinted
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {specItems.map((item) => (
            <Reveal key={item.title}>
              <div className="card-editorial h-full p-7">
                <h3 className="font-serif text-[1.2rem] text-white">
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

      {/* Compétences */}
      <EditorialSection
        eyebrow={t("skills.eyebrow")}
        title={t("skills.title")}
        titleId="sec-skills"
      >
        <div className="grid gap-10 md:grid-cols-3">
          {skillGroups.map((g, i) => {
            const items = t.raw(`skills.groups.${g}.items`) as string[];
            return (
              <Reveal key={g} delay={i * 0.06}>
                <div className="border-t border-mist/15 pt-6">
                  <h3 className="font-serif text-[1.25rem] text-white">
                    {t(`skills.groups.${g}.title`)}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.9rem] text-steel"
                      >
                        <span
                          className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-rouge"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* Vision */}
      <EditorialSection
        eyebrow={t("vision.eyebrow")}
        title={t("vision.title")}
        titleId="sec-vision"
        tinted
      >
        <div className="max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p>{t("vision.p1")}</p>
          <p>{t("vision.p2")}</p>
        </div>
        <Reveal className="mt-10">
          <ul className="flex flex-wrap gap-3">
            {values.map((v) => (
              <li
                key={v}
                className="rounded-full border border-mist/20 px-5 py-2 font-serif text-[1.05rem] text-mist"
              >
                {v}
              </li>
            ))}
          </ul>
        </Reveal>
      </EditorialSection>

      {/* Langues */}
      <EditorialSection
        eyebrow={t("languages.eyebrow")}
        title={t("languages.title")}
        titleId="sec-languages"
      >
        <p className="max-w-2xl text-[0.98rem] leading-relaxed text-silver/90">
          {t("languages.p1")}
        </p>
        <dl className="mt-8 divide-y divide-mist/10 border-y border-mist/10">
          {languages.map((l) => (
            <Reveal key={l.name}>
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="font-serif text-[1.2rem] text-white">{l.name}</dt>
                <dd className="text-right text-[0.88rem] text-steel">{l.level}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
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
