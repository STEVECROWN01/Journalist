"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { useLenisScrollTrigger } from "./use-lenis-scrolltrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

export interface HomeIntroCopy {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

export interface HomeIntroCards {
  /** Grande photographie de scène (tournage) */
  stage: { src: string; alt: string; href: string; linkLabel: string };
  /** Carte flottante haute : publication à la une */
  question: {
    src: string | null;
    title: string;
    meta: string;
    href: string;
  } | null;
  /** Carte flottante basse : production à la une */
  result: { src: string; title: string; href: string } | null;
}

/**
 * Section « Introduction » — split éditorial : à gauche une scène
 * photographique (tournage documentaire) sur laquelle viennent s'assembler
 * deux cartes flottantes reliées par un fil rouge tracé au défilement ;
 * à droite, le texte éditorial (copywriting inchangé).
 */
export function HomeIntro({
  copy,
  cards,
}: {
  copy: HomeIntroCopy;
  cards: HomeIntroCards;
}) {
  const root = useRef<HTMLElement>(null);

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

          const timeline = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 88%",
              end: wide ? "center 43%" : "top 12%",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .addLabel("grow", 0)
            .fromTo(
              ".dt-editorial-media",
              { scale: 0.65, yPercent: 12 },
              { scale: 1, yPercent: 0, duration: 0.75, ease: "none" },
              "grow"
            )
            .addLabel("assemble", 0.42)
            .fromTo(
              ".dt-editorial-question",
              { x: 38, y: 26, scale: 0.7, autoAlpha: 0 },
              {
                x: 0,
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.43,
                ease: "back.out(1.1)",
              },
              "assemble+=.14"
            )
            .fromTo(
              ".dt-editorial-heading",
              { x: 35, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.35 },
              "assemble+=.15"
            )
            .fromTo(
              ".dt-editorial-text",
              { x: 30, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.32, stagger: 0.06 },
              "assemble+=.2"
            )
            .fromTo(
              ".dt-editorial-connector",
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 0.4, ease: "none" },
              "assemble+=.38"
            )
            .fromTo(
              ".dt-editorial-result",
              { scale: 0.85, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.25 },
              "assemble+=.66"
            );

          /* Un utilisateur au clavier peut atteindre une carte avant que le
             scrub ne l'ait révélée : on déplie immédiatement la composition. */
          const reveal = (event: FocusEvent) => {
            if (
              (event.target as HTMLElement).closest(".dt-editorial-stage")
            ) {
              timeline.scrollTrigger?.getTween()?.progress(1);
              timeline.progress(1);
            }
          };
          root.current?.addEventListener("focusin", reveal);
          return () => {
            root.current?.removeEventListener("focusin", reveal);
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
      aria-labelledby="sec-intro"
      className="dt-editorial dt-wrap"
    >
      <figure className="dt-editorial-figure">
        <div className="dt-editorial-stage">
          <div className="dt-editorial-media">
            <Link
              className="dt-editorial-photo"
              href={cards.stage.href}
              aria-label={cards.stage.linkLabel}
            >
              <Image
                src={cards.stage.src}
                alt={cards.stage.alt}
                width={920}
                height={1010}
                sizes="(min-width: 760px) 40vw, 88vw"
                className="dt-editorial-img"
              />
            </Link>
          </div>

          {/* Fil rouge : relie la scène à la publication à la une */}
          <svg
            className="dt-editorial-line"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="dt-editorial-connector"
              d="M 86 61 H 94 Q 97 61 97 64 V 85 Q 97 88 94 88 H 79 M 82 86 L 79 88 L 82 90"
            />
          </svg>

          {cards.question ? (
            <Link
              className="dt-editorial-card dt-editorial-question"
              href={cards.question.href}
            >
              <span className="dt-mini-image">
                {cards.question.src ? (
                  <Image
                    src={cards.question.src}
                    alt=""
                    width={358}
                    height={231}
                    sizes="120px"
                  />
                ) : null}
                <i aria-hidden="true">
                  <ArrowUpRight size={9} />
                </i>
              </span>
              <strong>{cards.question.title}</strong>
              <small>{cards.question.meta}</small>
            </Link>
          ) : null}

          {cards.result ? (
            <Link
              className="dt-editorial-card dt-editorial-result"
              href={cards.result.href}
            >
              <Image
                src={cards.result.src}
                alt=""
                width={358}
                height={231}
                sizes="140px"
              />
              <strong>{cards.result.title}</strong>
            </Link>
          ) : null}
        </div>
      </figure>

      <div className="dt-editorial-content">
        <p className="eyebrow dt-editorial-heading">{copy.eyebrow}</p>
        <h2
          id="sec-intro"
          className="display-2 dt-editorial-heading mt-6 max-w-2xl text-balance text-white"
        >
          {copy.title}
        </h2>
        <div className="dt-editorial-textwrap mt-8 max-w-2xl space-y-5 text-[1rem] leading-[1.85] text-silver/90">
          <p className="lede dt-editorial-text">{copy.p1}</p>
          <p className="dt-editorial-text">{copy.p2}</p>
          <p className="dt-editorial-text">{copy.p3}</p>
          <p className="dt-editorial-text border-l-2 border-or pl-6 text-white">
            {copy.p4}
          </p>
        </div>
      </div>
    </section>
  );
}
