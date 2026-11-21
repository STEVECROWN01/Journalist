import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { ShareButtons } from "@/components/site/share-buttons";
import {
  getAdjacentPublications,
  getPublicationBySlug,
} from "@/lib/content";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const publication = await getPublicationBySlug(slug, locale as "fr" | "en");
  if (!publication) return {};

  /* L'alternative anglaise n'est annoncée que si une version validée existe. */
  const languages: Record<string, string> = {
    fr: `${site.siteUrl}/fr/publications/${slug}`,
  };
  if (publication.hasEn) {
    languages.en = `${site.siteUrl}/en/publications/${slug}`;
  }

  return {
    title: publication.title,
    description: publication.excerpt,
    alternates: {
      canonical: `${site.siteUrl}/${locale}/publications/${slug}`,
      languages,
    },
    openGraph: {
      type: "article",
      title: publication.title,
      description: publication.excerpt,
      publishedTime: publication.publishedAt,
      authors: [site.name],
      images: publication.coverImage ? [{ url: publication.coverImage }] : undefined,
    },
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("publications");

  const [publication, adjacent] = await Promise.all([
    getPublicationBySlug(slug, locale as "fr" | "en"),
    getAdjacentPublications(slug, locale as "fr" | "en"),
  ]);

  if (!publication) notFound();

  const dateLabel = new Date(publication.publishedAt).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: publication.title,
    description: publication.excerpt,
    datePublished: publication.publishedAt,
    inLanguage: locale,
    author: { "@type": "Person", name: site.name },
    publisher: { "@type": "Person", name: site.name },
    image: publication.coverImage
      ? `${site.siteUrl}${publication.coverImage}`
      : undefined,
    mainEntityOfPage: `${site.siteUrl}/${locale}/publications/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28">
        {/* ===== En-tête éditorial ===== */}
        <header className="mx-auto max-w-3xl px-6">
          <Reveal>
            <Link
              href="/publications"
              className="link-editorial text-[0.78rem] font-medium uppercase tracking-[0.14em]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {t("detail.back")}
            </Link>
            <p className="eyebrow mt-8 !text-or">{publication.categoryLabel}</p>
            <h1 className="display-2 mt-6 text-balance text-white">
              {publication.title}
            </h1>
            <p className="meta mt-6">
              <span className="whitespace-nowrap">
                {t("detail.by")} {site.name}
                <span className="mx-2 text-graphite" aria-hidden="true">·</span>
              </span>{" "}
              <span className="whitespace-nowrap">
                {dateLabel}
                <span className="mx-2 text-graphite" aria-hidden="true">·</span>
              </span>{" "}
              <span className="whitespace-nowrap">
                {t("readingTime", { minutes: publication.readingMinutes })}
              </span>
            </p>
          </Reveal>
        </header>

        {/* Image de couverture, si elle apporte une valeur éditoriale */}
        {publication.coverImage ? (
          <Reveal className="mx-auto mt-12 max-w-4xl px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-mist/10">
              <Image
                src={publication.coverImage}
                alt={publication.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </Reveal>
        ) : null}

        {/* ===== Corps de l'article ===== */}
        <Reveal className="mx-auto mt-14 max-w-3xl px-6">
          <p className="border-l-2 border-or pl-6 font-serif text-[1.3rem] leading-[1.6] text-mist">
            {publication.excerpt}
          </p>
          <div className="prose-editorial mt-12">
            <ReactMarkdown>{publication.content}</ReactMarkdown>
          </div>
        </Reveal>

        {/* ===== Partage ===== */}
        <div className="mx-auto mt-14 max-w-3xl px-6">
          <div className="border-t border-mist/10 pt-8">
            <ShareButtons
              url={`${site.siteUrl}/${locale}/publications/${slug}`}
              title={publication.title}
            />
          </div>
        </div>

        {/* ===== Navigation éditoriale ===== */}
        <nav
          aria-label={t("detail.navLabel")}
          className="mt-16 border-t border-mist/10 bg-surface/40"
        >
          <div className="mx-auto max-w-4xl px-6 py-14">
            <div className="grid gap-8 sm:grid-cols-2">
              {adjacent.prev ? (
                <Link
                  href={`/publications/${adjacent.prev.slug}`}
                  className="group border-t border-mist/15 pt-5 transition-colors hover:border-or/60"
                >
                  <span className="meta !text-steel">
                    <ArrowLeft
                      size={12}
                      className="mr-2 inline align-[-2px]"
                      aria-hidden="true"
                    />
                    {t("detail.previous")}
                  </span>
                  <span className="mt-3 block font-serif text-[1.2rem] leading-snug text-mist transition-colors group-hover:text-white">
                    {adjacent.prev.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {adjacent.next ? (
                <Link
                  href={`/publications/${adjacent.next.slug}`}
                  className="group border-t border-mist/15 pt-5 text-right transition-colors hover:border-or/60 sm:text-right"
                >
                  <span className="meta !text-steel">
                    {t("detail.next")}
                    <ArrowRight
                      size={12}
                      className="ml-2 inline align-[-2px]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-3 block font-serif text-[1.2rem] leading-snug text-mist transition-colors group-hover:text-white">
                    {adjacent.next.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
            </div>

            <Reveal className="mt-12 flex justify-center">
              <Link href="/publications" className="btn-outline">
                {t("detail.moreCta")}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </nav>
      </article>

      {/* ===== Contact ===== */}
      <CtaSection
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        text={t("contact.text")}
        buttonLabel={t("contact.button")}
        buttonHref="/contact"
      />
    </>
  );
}
