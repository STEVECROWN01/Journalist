import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
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
        paragraphs={[t("hero.p1"), t("hero.p2")]}
        image="/assets/editorial-presse-magazines.jpg"
        imageAlt={
          locale === "fr"
            ? "Magazines et ordinateur portable sur un bureau de rédaction"
            : "Magazines and laptop on an editorial desk"
        }
        ctaLabel={t("hero.cta")}
        ctaHref="#sec-listing"
      />

      {/* Publications : mise en avant + archives */}
      <section
        id="sec-listing"
        aria-labelledby="sec-publications"
        className="scroll-mt-24 border-t border-mist/10"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="eyebrow">{t("section.eyebrow")}</p>
            <h2 id="sec-publications" className="display-2 mt-5 max-w-2xl text-balance text-white">
              {t("section.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 max-w-2xl space-y-4 text-[0.98rem] leading-[1.8] text-steel">
              <p>{t("section.p1")}</p>
              <p>{t("section.p2")}</p>
              <p>{t("section.p3")}</p>
            </div>
          </Reveal>

          {featured ? (
            <Reveal className="mt-14">
              <p className="eyebrow !text-or">{t("featured.label")}</p>
              <div className="mt-8">
                <PublicationCard publication={featured} featured labels={labels} />
              </div>
            </Reveal>
          ) : null}

          <div className="mt-16">
            {publications.length > 0 ? (
              <PublicationsExplorer publications={publications} />
            ) : (
              <p className="rounded-lg border border-dashed border-mist/15 p-10 text-center text-steel">
                {t("latest.empty")}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
