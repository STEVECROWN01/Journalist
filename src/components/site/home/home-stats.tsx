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
 * semibold, interlettrage serré). À CHAQUE fois que la bande entre
 * dans l'écran par le haut (scroll-down), les compteurs repartent de
 * zéro et grimpent jusqu'à la valeur finale ; en remontant, tout se
 * réinitialise. Sans JS ou avec prefers-reduced-motion, les valeurs
 * finales restent affichées.
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
      /* Attention : gsap.matchMedia().add() n'exécute le callback que
         si AU MOINS une condition correspond. « prefers-reduced-motion:
         reduce » seule ne correspond jamais chez un utilisateur normal
         (valeur « no-preference ») — le callback ne serait jamais
         appelé et les compteurs resteraient figés. On déclare donc
         explicitement les deux états. */
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
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

              gsap
                .timeline({
                  delay: index * 0.09,
                  scrollTrigger: {
                    trigger: item,
                    start: "top 88%",
                    /* restart à chaque entrée par le haut, remise à
                       zéro en sortie par le haut : chaque scroll-down
                       rejoue le compteur depuis 0. */
                    toggleActions: "restart none none reset",
                  },
                  onStart: () => {
                    counter.v = 0;
                    if (numEl) {
                      numEl.textContent = prefix + "00";
                    }
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
                /* Chiffre : bascule 3D + montée */
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
                /* Compteur : grimpe de 0 jusqu'à la valeur finale */
                .fromTo(
                  counter,
                  { v: 0 },
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
            </dt>
            <dd className="dt-stat-label">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
