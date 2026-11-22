import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { PublicationView } from "@/lib/content";

interface PublicationCardProps {
  publication: PublicationView;
  labels: {
    readMore: string;
    readingTime: string;
  };
  featured?: boolean;
  className?: string;
}

/** Carte de publication — dominante texte, image seulement pour la une. */
export function PublicationCard({
  publication,
  labels,
  featured = false,
  className = "",
}: PublicationCardProps) {
  const locale = useLocale();
  const dateLabel = new Date(publication.publishedAt).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  if (featured) {
    return (
      <article className={`group grid gap-8 md:grid-cols-2 ${className}`}>
        <Link
          href={`/publications/${publication.slug}`}
          className="relative block aspect-[3/2] overflow-hidden rounded-lg border border-mist/10"
          aria-hidden="true"
          tabIndex={-1}
        >
          {publication.coverImage ? (
            <Image
              src={publication.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
  quality={95}
/>
          ) : null}
        </Link>
        <div className="flex flex-col justify-center">
          <p className="meta">
            <span className="whitespace-nowrap">
              <span className="text-or">{publication.categoryLabel}</span>
              <span className="mx-2 text-graphite" aria-hidden="true">·</span>
            </span>{" "}
            <span className="whitespace-nowrap">
              {dateLabel}
              <span className="mx-2 text-graphite" aria-hidden="true">·</span>
            </span>{" "}
            <span className="whitespace-nowrap">
              {labels.readingTime.replace("{minutes}", String(publication.readingMinutes))}
            </span>
          </p>
          <h3 className="display-3 mt-4 text-white">
            <Link href={`/publications/${publication.slug}`}>{publication.title}</Link>
          </h3>
          <p className="mt-4 line-clamp-4 text-[0.95rem] leading-relaxed text-silver/90">
            {publication.excerpt}
          </p>
          <Link
            href={`/publications/${publication.slug}`}
            className="link-editorial mt-6 text-[0.8rem] font-medium uppercase tracking-[0.14em]"
          >
            {labels.readMore}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group border-t border-mist/10 pt-7 transition-colors hover:border-mist/25 ${className}`}
    >
      <p className="meta">
        <span className="whitespace-nowrap">
          <span className="text-or">{publication.categoryLabel}</span>
          <span className="mx-2 text-graphite" aria-hidden="true">·</span>
        </span>{" "}
        <span className="whitespace-nowrap">
          {dateLabel}
          <span className="mx-2 text-graphite" aria-hidden="true">·</span>
        </span>{" "}
        <span className="whitespace-nowrap">
          {labels.readingTime.replace("{minutes}", String(publication.readingMinutes))}
        </span>
      </p>
      <h3 className="mt-3 font-serif text-[1.4rem] leading-snug text-white">
        <Link
          href={`/publications/${publication.slug}`}
          className="transition-colors hover:text-mist"
        >
          {publication.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-2 text-[0.92rem] leading-relaxed text-steel">
        {publication.excerpt}
      </p>
      <Link
        href={`/publications/${publication.slug}`}
        className="link-editorial mt-4 text-[0.78rem] font-medium uppercase tracking-[0.14em]"
      >
        {labels.readMore}
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </article>
  );
}
