import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";
import { ProductionCard } from "@/components/site/production-card";
import { CtaSection } from "@/components/site/cta-section";
import { getProductionBySlug, getProductions } from "@/lib/content";
import { demoProductions } from "@/content/demo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return demoProductions.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const production = await getProductionBySlug(slug, locale as "fr" | "en");
  if (!production) return {};
  return {
    title: production.title,
    description: production.context,
    alternates: {
      canonical: `${site.siteUrl}/${locale}/productions/${slug}`,
      languages: {
        fr: `${site.siteUrl}/fr/productions/${slug}`,
        en: `${site.siteUrl}/en/productions/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: production.title,
      description: production.context,
      images: production.coverImage ? [{ url: production.coverImage }] : undefined,
    },
  };
}

export default async function ProductionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("productions");
  const [production, all] = await Promise.all([
    getProductionBySlug(slug, locale as "fr" | "en"),
    getProductions(locale as "fr" | "en"),
  ]);

  if (!production) notFound();

  const index = all.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const others = all.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: production.title,
    dateCreated: String(production.year),
    description: production.context,
    image: production.coverImage ? `${site.siteUrl}${production.coverImage}` : undefined,
    inLanguage: locale,
    creator: {
      "@type": "Person",
      name: site.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28">
        {/* En-tête */}
        <header className="mx-auto max-w-6xl px-6">
          <Reveal>
            <Link
              href="/productions"
              className="link-editorial text-[0.78rem] font-medium uppercase tracking-[0.14em]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {t("portfolio.title")}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <p className="eyebrow !text-or">
                {t(`portfolio.filters.${production.category}`)}
              </p>
            </div>
            <h1 className="display-1 mt-6 max-w-3xl text-balance text-white">
              {production.title}
            </h1>
          </Reveal>
        </header>

        {/* Couverture */}
        {production.coverImage ? (
          <Reveal className="mx-auto mt-12 max-w-6xl px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-mist/10">
              <Image
                src={production.coverImage}
                alt={production.title}
                fill
                priority
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="object-cover"
              />
            </div>
          </Reveal>
        ) : null}

        {/* Métadonnées + texte */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-6 pb-8 lg:grid-cols-[1fr_2.4fr]">
          <aside>
            <dl className="space-y-6 border-t border-mist/15 pt-6 lg:sticky lg:top-28">
              <div>
                <dt className="meta">{t("detail.category")}</dt>
                <dd className="mt-1.5 text-[0.95rem] text-white">
                  {t(`portfolio.filters.${production.category}`)}
                </dd>
              </div>
              <div>
                <dt className="meta">{t("detail.year")}</dt>
                <dd className="mt-1.5 text-[0.95rem] text-white">
                  {production.year}
                </dd>
              </div>
              <div>
                <dt className="meta">{t("detail.territory")}</dt>
                <dd className="mt-1.5 text-[0.95rem] text-white">
                  {production.territory}
                </dd>
              </div>
              <div>
                <dt className="meta">{t("detail.role")}</dt>
                <dd className="mt-1.5 text-[0.95rem] text-white">
                  {production.role}
                </dd>
              </div>
              {production.videoUrl ? (
                <div>
                  <dt className="meta">Vidéo</dt>
                  <dd className="mt-1.5">
                    <a
                      href={production.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-editorial text-[0.95rem]"
                    >
                      {t("detail.video")}
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>

          <div>
            <Reveal>
              <p className="meta">{t("detail.context")}</p>
              <p className="mt-3 font-serif text-[1.45rem] leading-[1.5] text-white">
                {production.context}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-10 space-y-5 border-t border-mist/10 pt-8 text-[1rem] leading-[1.85] text-silver/90">
                {production.description
                  .split(/\n\n+/)
                  .map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Navigation entre réalisations */}
        <nav
          aria-label={t("detail.otherWork")}
          className="mx-auto mt-10 grid max-w-6xl gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 px-0 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/productions/${prev.slug}`}
              className="group flex items-center gap-4 bg-ink p-7 transition-colors hover:bg-surface"
            >
              <ArrowLeft
                size={18}
                className="shrink-0 text-steel transition-colors group-hover:text-or"
                aria-hidden="true"
              />
              <span>
                <span className="meta block">{t("detail.prev")}</span>
                <span className="mt-1.5 block font-serif text-[1.2rem] text-white">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <div className="hidden bg-ink sm:block" aria-hidden="true" />
          )}
          {next ? (
            <Link
              href={`/productions/${next.slug}`}
              className="group flex items-center justify-end gap-4 bg-ink p-7 text-right transition-colors hover:bg-surface"
            >
              <span>
                <span className="meta block">{t("detail.next")}</span>
                <span className="mt-1.5 block font-serif text-[1.2rem] text-white">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 text-steel transition-colors group-hover:text-or"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <div className="hidden bg-ink sm:block" aria-hidden="true" />
          )}
        </nav>

        {/* Autres réalisations */}
        {others.length > 0 ? (
          <section aria-labelledby="sec-others" className="border-t border-mist/10">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <Reveal>
                <h2
                  id="sec-others"
                  className="display-3 text-white"
                >
                  {t("detail.otherWork")}
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-10 md:grid-cols-3">
                {others.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <ProductionCard
                      production={p}
                      categoryLabel={t(`portfolio.filters.${p.category}`)}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <CtaSection
        title={t("cta.title")}
        text={t("cta.text")}
        buttonLabel={t("cta.button")}
        buttonHref="/contact"
      />
    </>
  );
}
