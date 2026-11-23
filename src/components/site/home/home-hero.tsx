"use client";

import { Fragment, useRef } from "react";
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
  ctaPrimary: string;
  ctaSecondary: string;
  /** Cibles clientes sous les boutons (séparées par de gros points) */
  audiences: string[];
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
    "/assets/Journalist_holding_microphone_in…_0b601b53.jpg",
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

          /* Mobile : la galerie défile en continu (marquee vertical) —
             chaque colonne boucle sans fin, la colonne centrale à
             contre-sens pour le rythme visuel. */
          if (!wide) {
            gsap.utils
              .toArray<HTMLElement>(".dt-mosaic-track", root.current)
              .forEach((track, index) => {
                const downward = index === 1;
                gsap.fromTo(
                  track,
                  { yPercent: downward ? -50 : 0 },
                  {
                    yPercent: downward ? 0 : -50,
                    duration: 22 + index * 6,
                    ease: "none",
                    repeat: -1,
                  }
                );
              });
            return;
          }

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
              /* Retour à zéro : la mosaïque finit droite — netteté au pixel */
              { rotationX: 0, rotationY: 0, rotationZ: 0, z: 0, duration: 1 },
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
                        /* Le portrait du journaliste face caméra, micro
                           en main, reste en couleur originale en
                           permanence — les autres vignettes jouent le
                           noir et blanc. */
                        className={`dt-mosaic-tile ${
                          src.includes("Journalist_holding_microphone")
                            ? "dt-tile-color"
                            : ""
                        }`}
  quality={95}
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

      {/* Contenu éditorial — dégagé de l'en-tête fixe. Le hero occupe
          AU MOINS l'écran (min-height : 100svh) : tous ses éléments
          (sous-titre, complément, cibles) restent visibles à toutes
          les tailles — sur les écrans peu hauts la section grandit
          au lieu de rogner. Sur desktop (≥ 1024 px), le bloc texte
          reste poussé vers le bas (mt-auto) : tout l'espace libre se
          place AU-DESSUS du texte. Sur mobile et tablette (< 1024 px),
          le bloc se CENTRE dans l'espace sous l'en-tête (voir
          .hero-copy-anchor dans globals.css). */}
      <div className="dt-hero-content hero-pad relative z-[2] mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
        <div className="hero-copy-anchor mt-auto w-full">
        <Reveal>
          <p className="hero-eyebrow-row">
            <span className="dt-experience">
              <span className="dt-experience-plus" aria-hidden="true">
                {/* Étoile à quatre pointes (haut, bas, gauche, droite) —
                    même gabarit que l'ancien « + », remplie, qui brille */}
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M12 1.5c.65 6.85 3.65 9.85 10.5 10.5-6.85.65-9.85 3.65-10.5 10.5-.65-6.85-3.65-9.85-10.5-10.5C8.35 11.35 11.35 8.35 12 1.5Z" />
                </svg>
              </span>
              {copy.eyebrow}
            </span>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="hero-title"
            className="display-1 hero-title hero-block mt-6 max-w-4xl text-white md:mt-7"
          >
            {copy.title1}
            <br />
            {copy.title2}
            {/* La portion en écriture différente démarre toujours sur
                sa propre ligne (desktop) — jamais à cheval sur deux lignes */}
            <br className="hidden md:block" />{" "}
            <em className="hero-title-accent">{copy.title3}</em>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="hero-subtitle hero-block mt-7 max-w-2xl text-[1.02rem] leading-[1.8] text-mist/85 md:mt-9">
            {copy.subtitle}
          </p>
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
        {/* Cibles — à qui s'adresse le travail : médias, producteurs,
            organisations, entreprises. Gros points séparateurs, même
            pastille que la bande de mots-clés. */}
        <Reveal delay={0.32}>
          <p className="hero-audiences mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 md:mt-9">
            {copy.audiences.map((audience, index) => (
              <Fragment key={audience}>
                {index > 0 ? (
                  <span className="dt-audience-dot" aria-hidden="true" />
                ) : null}
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-mist/75">
                  {audience}
                </span>
              </Fragment>
            ))}
          </p>
        </Reveal>
        </div>
      </div>

      {/* Bande de mots-clés de référencement — défilement continu
          de la droite vers la gauche, points de séparation simples */}
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
