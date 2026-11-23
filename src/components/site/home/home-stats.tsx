"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenisScrollTrigger } from "./use-lenis-scrolltrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface StatItem {
  /** Valeur finale du compteur */
  value: number;
  /** Préfixe affiché (« + » pour les années) */
  prefix?: string;
  label: string;
}

/**
 * Bande de chiffres clés — même écriture que le titre du hero (Sora
 * semibold, interlettrage serré), point final à l'accent du site.
 * Chaque statistique s'anime à l'entrée dans l'écran : filet qui se
 * trace, compteur qui grimpe, libellé qui monte. Sans JS ou avec
 * prefers-reduced-motion, les valeurs finales restent affichées.
 */
export function HomeStats({
  stats,
  label,
}: {
  stats: StatItem[];
  label: string;
}) {
  const root = useRef<HTMLElement>(null);

  useLenisScrollTrigger();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        { reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduce } = context.conditions!;
          if (reduce) return;

          gsap.utils
            .toArray<HTMLElement>(".dt-stat", root.current)
            .forEach((item, index) => {
              const numBox = item.querySelector<HTMLElement>(".dt-stat-num");
              const numEl = item.querySelector<HTMLElement>(
                ".dt-stat-num-value"
              );
              const target = Number(numEl?.dataset.value ?? 0);
              const prefix = numEl?.dataset.prefix ?? "";
              const counter = { v: 0 };
              /* État initial du compteur : la valeur finale n'apparaît
                 que par l'animation (le bloc est masqué au départ). */
              if (numEl) {
                numEl.textContent = prefix + "00";
              }

              gsap
                .timeline({
                  delay: index * 0.1,
                  scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    once: true,
                  },
                })
                /* Filet : se déploie depuis le centre */
                .fromTo(
                  item.querySelector(".dt-stat-rule"),
                  { scaleX: 0 },
                  {
                    scaleX: 1,
                    duration: 0.85,
                    ease: "power3.out",
                  },
                  0
                )
                /* Chiffre : bascule 3D + montée (le bloc entier,
                   point final compris) */
                .fromTo(
                  numBox,
                  { y: 36, opacity: 0, rotateX: -40 },
                  {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    transformPerspective: 700,
                    duration: 0.8,
                    ease: "power3.out",
                  },
                  0.05
                )
                /* Compteur : grimpe jusqu'à la valeur finale */
                .to(
                  counter,
                  {
                    v: target,
                    duration: 1.4,
                    ease: "power2.out",
                    onUpdate: () => {
                      if (numEl) {
                        numEl.textContent =
                          prefix +
                          String(Math.round(counter.v)).padStart(2, "0");
                      }
                    },
                  },
                  0.1
                )
                /* Libellé : monte en douceur */
                .fromTo(
                  item.querySelector(".dt-stat-label"),
                  { y: 16, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                  },
                  0.34
                );
            });
        }
      );
      return () => media.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-label={label} className="dt-stats">
      <dl className="dt-stats-grid">
        {stats.map((stat) => (
          <div className="dt-stat" key={stat.label}>
            <span className="dt-stat-rule" aria-hidden="true" />
            <dt className="dt-stat-num">
              <span
                className="dt-stat-num-value"
                data-value={stat.value}
                data-prefix={stat.prefix ?? ""}
              >
                {(stat.prefix ?? "") + String(stat.value).padStart(2, "0")}
              </span>
              <span className="dt-stat-dot" aria-hidden="true">
                .
              </span>
            </dt>
            <dd className="dt-stat-label">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
