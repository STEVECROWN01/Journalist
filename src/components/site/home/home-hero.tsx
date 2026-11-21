"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/site/reveal";
import { useLenisScrollTrigger } from "./use-lenis-scrolltrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface HomeHeroCopy {
  eyebrow: string;
  title1: string;
  title2: string;
  title3: string;
  subtitle: string;
  complement: string;
  approach: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Mots-clés de référencement du site (bande défilante) */
  keywords: string[];
  keywordsLabel: string;
}

/* Mosaïque du hero : douze visuels réels du site (reportages, tournages,
   salles de rédaction, productions). Aucun portrait inventé. */
const MOSAIC_COLUMNS: string[][] = [
  [
    "/assets/production-ligne-directe.jpg",
    "/assets/production-terrain-partage.jpg",
    "/assets/production-contrepoints.jpg",
    "/assets/production-cap-organisations.jpg",
  ],
  [
    "/assets/realisation-documentaire-tournage.jpg",
    "/assets/journaliste-reportage-microphone.jpg",
    "/assets/salle-redaction-internationale.jpg",
    "/assets/editorial-presse-magazines.jpg",
  ],
  [
    "/assets/formation-masterclass-journalisme.jpg",
    "/assets/reunion-communication-entreprise.jpg",
    "/assets/publication-comprendre-terrain.jpg",
    "/assets/salle-redaction-internationale.jpg",
  ],
];

/**
 * Hero plein écran — contenu éditorial à gauche, mosaïque photographique
 * inclinée en 3D à droite. Au premier défilement, la mosaïque se déplie
 * (la matrice porte l'orientation, chaque colonne son défilement vertical),
 * puis la section reste épinglée le temps de l'ouverture.
 */
export function HomeHero({ copy }: { copy: HomeHeroCopy }) {
  const root = useRef<HTMLElement>(null);

  useLenisScrollTrigger();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          wide: "(min-width: 760px)",
          tall: "(min-height: 650px)",
        },
        (context) => {
          const { reduce, wide, tall } = context.conditions!;
          if (reduce) return;

          const unfurl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end:
                wide && tall
                  ? () => "+=" + Math.round(innerHeight * 0.7)
                  : "bottom top",
              pin: !!(wide && tall),
              pinSpacing: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          unfurl
            .addLabel("unfurl", 0)
            .fromTo(
              ".dt-mosaic-grid",
              { rotationX: 18, rotationY: -24, rotationZ: -12, z: -150 },
              { rotationX: 3, rotationY: -3, rotationZ: -5, z: 0, duration: 1 },
              "unfurl"
            );
          gsap.utils
            .toArray<HTMLElement>(".dt-mosaic-track", root.current)
            .forEach((track, index) => {
              unfurl.fromTo(
                track,
                { yPercent: index === 1 ? -24 : -3 },
                { yPercent: index === 1 ? -4 : -25, duration: 1 },
                "unfurl"
              );
            });
        }
      );
      return () => media.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="dt-hero hero-full relative flex flex-col overflow-clip bg-ink-deep"
    >
      {/* Mosaïque 3D — décorative, masquée pour la lisibilité du texte */}
      <div className="dt-mosaic" aria-hidden="true">
        <div className="dt-mosaic-grid">
          {MOSAIC_COLUMNS.map((column, index) => (
            <div className="dt-mosaic-column" key={index}>
              <div className="dt-mosaic-track">
                {[0, 1].map((copyIndex) => (
                  <div className="dt-mosaic-set" key={copyIndex}>
                    {column.map((src, tile) => (
                      <Image
                        key={src + tile}
                        src={src}
                        alt=""
                        width={358}
                        height={411}
                        sizes="(min-width: 760px) 22vw, 42vw"
                        priority={index === 1 && copyIndex === 0 && tile < 2}
                        className="dt-mosaic-tile"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voile de lisibilité entre la mosaïque et le texte */}
      <div className="dt-hero-shade" aria-hidden="true" />

      {/* Contenu éditorial — copywriting inchangé */}
      <div className="dt-hero-content hero-pad relative z-[2] mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-14 sm:py-16 lg:py-20">
        <Reveal>
          <p className="eyebrow hero-eyebrow-row">{copy.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="hero-title"
            className="display-1 hero-title hero-block mt-6 max-w-4xl text-white md:mt-7"
          >
            {copy.title1}
            <br />
            {copy.title2}{" "}
            <em className="text-mist">{copy.title3}</em>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="hero-subtitle hero-block mt-7 max-w-2xl text-[1.02rem] leading-[1.8] text-mist/85 md:mt-9">
            {copy.subtitle}
          </p>
          <div className="hero-complement mt-4 max-w-xl space-y-3 text-[0.92rem] leading-[1.75] text-silver/90">
            <p>{copy.complement}</p>
            <p className="hero-complement-p2">{copy.approach}</p>
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="hero-ctas mt-8 flex flex-wrap items-center gap-4 md:mt-10">
            <Link href="/productions" className="btn-accent dt-hero-cta">
              {copy.ctaPrimary}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-outline">
              {copy.ctaSecondary}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Bande de mots-clés de référencement — défilement continu
          de la droite vers la gauche, points de séparation dorés */}
      <div className="dt-hero-band relative z-10 overflow-clip border-t border-white/[0.08] bg-ink-deep/40 backdrop-blur-sm">
        <div className="dt-keywords">
          <div className="dt-keywords-track">
            {[0, 1].map((setIndex) => (
              <ul
                key={setIndex}
                className="dt-keywords-set"
                aria-label={copy.keywordsLabel}
                aria-hidden={setIndex === 1 ? true : undefined}
              >
                {copy.keywords.map((keyword) => (
                  <li key={keyword}>
                    {keyword}
                    <i className="dt-keywords-dot" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
