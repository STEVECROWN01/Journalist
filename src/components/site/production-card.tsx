import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import type { ProductionView } from "@/lib/content";

interface ProductionCardProps {
  production: ProductionView;
  categoryLabel: string;
  className?: string;
}

/** Carte de production éditoriale : couverture, métadonnées, lien. */
export function ProductionCard({
  production,
  categoryLabel,
  className = "",
}: ProductionCardProps) {
  return (
    <article className={`group h-full ${className}`}>
      <Link
        href={`/productions/${production.slug}`}
        className="flex h-full flex-col"
        aria-label={production.title}
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-mist/10 bg-surface">
          {production.coverImage ? (
            <Image
              src={production.coverImage}
              alt={production.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
  quality={95}
/>
          ) : null}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-deep/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="meta">
              <span className="whitespace-nowrap">
                <span className="text-or">{categoryLabel}</span>
                <span className="mx-2 text-graphite" aria-hidden="true">·</span>
              </span>{" "}
              <span className="whitespace-nowrap">
                {production.year}
                <span className="mx-2 text-graphite" aria-hidden="true">·</span>
              </span>{" "}
              <span className="whitespace-nowrap">{production.territory}</span>
            </p>
            <h3 className="mt-2.5 font-serif text-[1.45rem] leading-snug text-white transition-colors group-hover:text-mist">
              {production.title}
            </h3>
            <p className="mt-1.5 text-[0.85rem] text-steel">{production.role}</p>
          </div>
          <span className="mt-2 flex size-9 shrink-0 items-center justify-center rounded-full border border-mist/15 text-silver transition-all duration-300 group-hover:border-or group-hover:bg-or group-hover:text-white">
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
