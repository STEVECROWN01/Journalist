import Image from "next/image";
import { Reveal } from "./reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
}

/** Hero éditorial pleine largeur : image, dégradés, titre serif. */
export function PageHero({ eyebrow, title, subtitle, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[68vh] items-end overflow-hidden bg-ink-deep">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="hero-kenburns object-cover"
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
          {subtitle ? (
            <p className="mt-8 max-w-2xl text-[1.05rem] leading-[1.8] text-mist/85">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
