import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { EditorialSection } from "@/components/site/editorial-section";
import { CtaSection } from "@/components/site/cta-section";
import { PublicationCard } from "@/components/site/publication-card";
import { PublicationsExplorer } from "@/components/site/publications-explorer";
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
  const tC = await getTranslations("common");
  const publications = await getPublications(locale as "fr" | "en");
  const featured = publications.find((p) => p.featured) ?? publications[0];

  const labels = {
    readMore: tC("actions.readMore"),
    readingTime: t.raw("readingTime") as string,
  };

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image="/assets/editorial-presse-magazines.jpg"
        imageAlt={
          locale === "fr"
            ? "Magazines et ordinateur portable sur un bureau de rédaction"
            : "Magazines and laptop on an editorial desk"
        }
      />

      {/* Publication mise en avant */}
      {featured ? (
        <section
          aria-labelledby="sec-featured"
          className="border-b border-mist/10"
        >
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <Reveal>
              <p className="eyebrow !text-rouge">{t("featured.label")}</p>
            </Reveal>
            <div className="mt-10">
              <Reveal delay={0.08}>
                <PublicationCard
                  publication={featured}
                  featured
                  labels={labels}
                />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* Dernières publications : recherche, filtres, archives */}
      <EditorialSection
        eyebrow={tC("nav.publications")}
        title={t("latest.title")}
        titleId="sec-latest"
      >
        {publications.length > 0 ? (
          <PublicationsExplorer publications={publications} />
        ) : (
          <p className="rounded-lg border border-dashed border-mist/15 p-10 text-center text-steel">
            {t("latest.empty")}
          </p>
        )}
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
