import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";
import { DemoBadge } from "@/components/site/demo-badge";
import { PublicationCard } from "@/components/site/publication-card";
import { CtaSection } from "@/components/site/cta-section";
import { ShareButtons } from "@/components/site/share-buttons";
import { getPublicationBySlug, getRelatedPublications } from "@/lib/content";
import { demoPublications } from "@/content/demo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return demoPublications.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const publication = await getPublicationBySlug(slug, locale as "fr" | "en");
  if (!publication) return {};
  return {
    title: publication.title,
    description: publication.excerpt,
    alternates: {
      canonical: `${site.siteUrl}/${locale}/publications/${slug}`,
      languages: {
        fr: `${site.siteUrl}/fr/publications/${slug}`,
        en: `${site.siteUrl}/en/publications/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: publication.title,
      description: publication.excerpt,
      publishedTime: publication.publishedAt,
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
  const tC = await getTranslations("common");

  const [publication, related] = await Promise.all([
    getPublicationBySlug(slug, locale as "fr" | "en"),
    getRelatedPublications(slug, locale as "fr" | "en", 2),
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
    image: publication.coverImage
      ? `${site.siteUrl}${publication.coverImage}`
      : undefined,
    mainEntityOfPage: `${site.siteUrl}/${locale}/publications/${slug}`,
  };

  const labels = {
    readMore: tC("actions.readMore"),
    readingTime: t.raw("readingTime") as string,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28">
        <header className="mx-auto max-w-3xl px-6">
          <Reveal>
            <Link
              href="/publications"
              className="link-editorial text-[0.78rem] font-medium uppercase tracking-[0.14em]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {t("detail.back")}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <p className="eyebrow !text-rouge">{publication.category}</p>
              <DemoBadge />
            </div>
            <h1 className="display-2 mt-6 text-balance text-white">
              {publication.title}
            </h1>
            <p className="meta mt-6">
              <span className="whitespace-nowrap">
                {t("publishedOn", { date: dateLabel })}
                <span className="mx-2 text-graphite" aria-hidden="true">·</span>
              </span>
              <span className="whitespace-nowrap">
                {t("readingTime", { minutes: publication.readingMinutes })}
              </span>
            </p>
          </Reveal>
        </header>

        {/* Image facultative */}
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

        {/* Corps de l'article */}
        <Reveal className="mx-auto mt-14 max-w-3xl px-6">
          <p className="border-l-2 border-rouge pl-6 font-serif text-[1.3rem] leading-[1.6] text-mist">
            {publication.excerpt}
          </p>
          <div className="prose-editorial mt-12">
            <ReactMarkdown>{publication.content}</ReactMarkdown>
          </div>
        </Reveal>

        {/* Partage */}
        <div className="mx-auto mt-14 max-w-3xl px-6">
          <div className="border-t border-mist/10 pt-8">
            <ShareButtons
              url={`${site.siteUrl}/${locale}/publications/${slug}`}
              title={publication.title}
            />
          </div>
        </div>

        {/* Articles associés */}
        {related.length > 0 ? (
          <section
            aria-labelledby="sec-related"
            className="mt-20 border-t border-mist/10 bg-surface/40"
          >
            <div className="mx-auto max-w-6xl px-6 py-20">
              <Reveal>
                <h2 id="sec-related" className="display-3 text-white">
                  {t("detail.related")}
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-10 md:grid-cols-2">
                {related.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <PublicationCard publication={p} labels={labels} />
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
