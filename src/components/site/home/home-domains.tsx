"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/site/reveal";
import { MaskLines } from "@/components/site/motion";
import { useLenisScrollTrigger } from "./use-lenis-scrolltrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

export interface DomainPlate {
  key: string;
  num: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  image: string;
  /** Style de plaque : nuances issues exclusivement de la palette */
  plate: "sand" | "mist" | "steel" | "dune";
  tilt: number;
}

/* Vagues tracées derrière les plaques (large + mobile) */
const WAVES = [
  {
    layout: "wide",
    box: "0 0 1120 390",
    path: "M -20 190 C 60 190 66 134 140 134 S 300 234 420 234 S 582 114 700 114 S 864 214 980 214 S 1080 170 1140 170",
  },
  {
    layout: "phone",
    box: "0 0 400 560",
    path: "M -16 150 C 35 150 45 110 100 110 S 245 175 300 175 C 425 175 420 390 300 390 S 155 335 100 335 C 10 335 -5 470 50 520",
  },
];

/**
 * Section « Domaines d'intervention » — quatre plaques photographiques
 * posées le long d'une ligne tracée au défilement. Chaque plaque s'ouvre
 * (plaque de fond, photographie, cartouche) puis mène à la page du
 * domaine ; la grille détaillée sous le champ reprend l'intégralité du
 * texte éditorial (copywriting inchangé).
 */
export function HomeDomains({
  eyebrow,
  title,
  domains,
}: {
  eyebrow: string;
  title: string;
  domains: DomainPlate[];
}) {
  const root = useRef<HTMLElement>(null);
  const field = useRef<HTMLDivElement>(null);

  useLenisScrollTrigger();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          wide: "(min-width: 760px)",
        },
        (context) => {
          const { reduce, wide } = context.conditions!;
          if (reduce) return;

          /* Une séquence réversible : la ligne se trace, les plaques
             arrivent le long de leur courbe, puis photographie et
             cartouche s'ouvrent. Rien ne tourne en boucle au repos.
             Le déclenchement est précoce : la composition est entièrement
             révélée pendant que la section occupe l'écran, jamais après
             l'avoir presque dépassée. */
          const peopleTimeline = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "clamp(top 85%)",
              end: "clamp(center 55%)",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          peopleTimeline
            .fromTo(
              ".dt-portrait-line",
              { y: 40 },
              { y: 0, duration: 1.5 },
              0
            )
            .fromTo(
              ".dt-portrait-trace",
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1.65, ease: "none" },
              0.12
            );

          gsap.utils
            .toArray<HTMLElement>(".dt-creator-arrival", root.current)
            .forEach((item, index) => {
              const inner = index === 1 || index === 2;
              const side = index < 2 ? -1 : 1;
              const at = inner
                ? 0.22 + (index - 1) * 0.09
                : 1.02 + (index === 3 ? 0.08 : 0);
              const plate = item.querySelector(".dt-creator-backplate");
              const avatar = item.querySelector(".dt-creator-avatar");
              const body = item.querySelector(".dt-creator-body");
              const caption = item.querySelector(".dt-creator-caption");
              const travel =
                (field.current?.clientWidth ?? 800) * (wide ? 0.34 : 0.23);
              if (inner) {
                peopleTimeline.fromTo(
                  item,
                  { y: 110, scale: 0.7 },
                  { y: 0, scale: 1, duration: 0.94 },
                  0
                );
              } else {
                peopleTimeline.fromTo(
                  item,
                  { x: side * travel, y: 56, scale: 0.72 },
                  {
                    motionPath: {
                      path: [
                        { x: side * travel, y: 56 },
                        { x: side * travel * 0.43, y: -28 },
                        { x: 0, y: 0 },
                      ],
                      curviness: 1.2,
                    },
                    scale: 1,
                    duration: 1.05,
                  },
                  0.48
                );
              }
              peopleTimeline
                .fromTo(
                  plate,
                  {
                    opacity: 0,
                    rotation: domains[index].tilt + side * 16,
                  },
                  {
                    opacity: 1,
                    /* Netteté : la plaque termine droite */
                    rotation: 0,
                    duration: 0.85,
                  },
                  inner ? 0 : 0.2
                )
                .fromTo(
                  avatar,
                  { scale: 0.1, autoAlpha: 0 },
                  { scale: 1, autoAlpha: 1, duration: 0.46, ease: "power3.out" },
                  at
                )
                .fromTo(
                  body,
                  { clipPath: "circle(2% at 50% 27%)", opacity: 0 },
                  { clipPath: "circle(100% at 50% 45%)", opacity: 1, duration: 0.48 },
                  at + 0.24
                )
                .fromTo(
                  caption,
                  { y: 8, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 0.25 },
                  at + 0.47
                );
            });

          gsap.utils
            .toArray<HTMLElement>(".dt-particle-arrival", root.current)
            .forEach((dot, index) => {
              const direction = index % 2 ? -1 : 1;
              const reach = wide ? 135 : 45;
              peopleTimeline.fromTo(
                dot,
                { x: direction * -reach, y: 62, autoAlpha: 0 },
                {
                  autoAlpha: 1,
                  duration: 1.9,
                  ease: "none",
                  motionPath: {
                    path: [
                      { x: direction * -reach, y: 62 },
                      { x: direction * -reach * 0.2, y: -48 - index * 7 },
                      { x: 0, y: 0 },
                    ],
                    curviness: 1.5,
                  },
                },
                index * 0.035
              );
            });

          /* Au clavier, déplie immédiatement la composition si le focus
             atteint une plaque avant la fin du scrub. */
          const revealFocused = (event: FocusEvent) => {
            if (
              (event.target as HTMLElement).matches(".dt-creator:focus-visible")
            ) {
              peopleTimeline.scrollTrigger?.getTween()?.progress(1);
              peopleTimeline.progress(1);
            }
          };
          field.current?.addEventListener("focusin", revealFocused);
          return () => {
            field.current?.removeEventListener("focusin", revealFocused);
          };
        }
      );
      return () => media.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-labelledby="sec-expertise"
      className="dt-people border-t border-mist/10"
    >
      <div className="dt-wrap">
        <Reveal>
          <p className="eyebrow justify-center">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id="sec-expertise"
            className="display-2 mx-auto mt-6 max-w-3xl text-balance text-white"
          >
            <MaskLines delay={0.05}>{title}</MaskLines>
          </h2>
        </Reveal>
      </div>

      <div className="dt-portrait-field" ref={field}>
        {WAVES.map(({ layout, box, path }) => (
          <svg
            key={layout}
            className={`dt-portrait-line dt-portrait-line-${layout}`}
            viewBox={box}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="dt-portrait-trace" d={path} />
          </svg>
        ))}
        {[0, 1, 2, 3].map((index) => (
          <span
            className={`dt-particle-arrival particle-${index}`}
            key={index}
            aria-hidden="true"
          >
            <i className="dt-particle" />
          </span>
        ))}
        <ul className="dt-creators">
          {domains.map((domain) => (
            <li className="dt-creator-arrival" key={domain.key}>
              <Link
                href={domain.href}
                className="dt-creator"
                aria-label={domain.cta}
              >
                <span className="dt-creator-plate">
                  <span
                    className={`dt-creator-backplate ${domain.plate}`}
                    aria-hidden="true"
                  />
                  <span className="dt-creator-body" aria-hidden="true" />
                  <span className="dt-creator-avatar">
                    <Image
                      src={domain.image}
                      alt={domain.title}
                      width={358}
                      height={358}
                      sizes="(min-width: 760px) 13vw, 38vw"
                      className="dt-creator-img"
  quality={95}
/>
                  </span>
                  <span className="dt-creator-caption">
                    <strong>{domain.title}</strong>
                    <span className="dt-creator-badge">
                      {domain.num}
                      <ArrowUpRight aria-hidden="true" size={10} />
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Grille détaillée : l'intégralité du texte éditorial des domaines */}
      <div className="dt-wrap dt-domain-details">
        {domains.map((domain, i) => (
          <Reveal key={domain.key} delay={i * 0.06}>
            <Link
              href={domain.href}
              className="group flex h-full flex-col border-t border-mist/15 pt-6 transition-colors duration-300 hover:border-or/60"
            >
              <span className="font-serif text-[1.1rem] italic text-steel">
                {domain.num}
              </span>
              <h3 className="mt-4 font-serif text-[1.25rem] leading-snug text-white">
                {domain.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-steel">
                {domain.desc}
              </p>
              <span className="link-editorial mt-5 text-[0.74rem] font-medium uppercase tracking-[0.14em]">
                {domain.cta}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
