import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Paragraphes d'introduction (le premier est mis en avant) */
  paragraphs?: string[];
  /** Ancien champ simple — conservé pour compatibilité */
  subtitle?: string;
  image: string;
  imageAlt: string;
  /** CTA facultatif du hero (lien interne ou ancre) */
  ctaLabel?: string;
  ctaHref?: string;
}

/** Hero éditorial pleine largeur : image, dégradés, titre serif, CTA. */
export function PageHero({
  eyebrow,
  title,
  paragraphs,
  subtitle,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
}: PageHeroProps) {
  const lines = paragraphs ?? (subtitle ? [subtitle] : []);
  return (
    <section className="relative flex min-h-[68vh] items-end overflow-hidden bg-ink-deep">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="hero-kenburns object-cover"
  quality={95}
/>
      <div className="hero-overlay-top absolute inset-0" aria-hidden="true" />
      <div className="hero-overlay absolute inset-0" aria-hidden="true" />
      <div className="hero-overlay-bottom absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40 md:pb-24">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-1 mt-6 max-w-4xl text-balance text-white">
            {title}
          </h1>
          {lines.length > 0 ? (
            <div className="mt-8 max-w-2xl space-y-4">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[1.05rem] leading-[1.8] text-mist/85"
                      : "text-[0.95rem] leading-[1.75] text-silver/85"
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          ) : null}
          {ctaLabel && ctaHref ? (
            ctaHref.startsWith("#") ? (
              <a href={ctaHref} className="btn-primary mt-9">
                {ctaLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            ) : (
              <Link href={ctaHref} className="btn-primary mt-9">
                {ctaLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            )
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
