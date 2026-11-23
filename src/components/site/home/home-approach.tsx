"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

export interface ApproachStep {
  title: string;
  desc: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Étapes de la méthode — style précédent restauré : liste à filets
 * horizontaux (aucune carte), numéro serif italique « 01 » à gauche du
 * titre (acier, doré au survol), « + » qui pivote en croix à droite.
 * Fermé, seule la première ligne de la description reste visible ;
 * ouvert, l'intégralité se déplie (hauteur animée, fluide dans les
 * deux sens, respect de prefers-reduced-motion).
 */
export function HomeApproachSteps({
  steps,
  expandLabel,
  collapseLabel,
}: {
  steps: ApproachStep[];
  expandLabel: string;
  collapseLabel: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <ol>
      {steps.map((step, i) => {
        const open = openIndex === i;
        return (
          <Reveal
            as="li"
            key={step.title}
            delay={0.05 * i}
            className={`dt-step group border-t border-mist/10 ${
              i === 0 ? "border-t-0 pt-0" : "pt-6"
            } ${i === steps.length - 1 ? "border-b" : ""} pb-6 ${
              open ? "is-open" : ""
            }`}
          >
            <h3 className="dt-step-title">
              <button
                type="button"
                className="dt-step-head"
                aria-expanded={open}
                aria-controls={`etape-corps-${i}`}
                id={`etape-bouton-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span
                  className="dt-step-num font-serif italic transition-colors duration-300 group-hover:text-or"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="dt-step-name font-serif">{step.title}</span>
                <span
                  className={`dt-step-toggle ${open ? "is-open" : ""}`}
                  aria-hidden="true"
                >
                  <Plus size={15} strokeWidth={2.4} />
                </span>
                <span className="sr-only">
                  {open ? collapseLabel : expandLabel}
                </span>
              </button>
            </h3>
            <motion.div
              id={`etape-corps-${i}`}
              role="region"
              aria-labelledby={`etape-bouton-${i}`}
              initial={false}
              animate={
                reduce
                  ? undefined
                  : open
                    ? { height: "auto", opacity: 1 }
                    : { height: 31, opacity: 0.72 }
              }
              transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
              className="dt-step-body"
            >
              <p
                className={`dt-step-desc ${
                  open ? "" : "is-clamped"
                } transition-opacity duration-500`}
              >
                {step.desc}
              </p>
            </motion.div>
          </Reveal>
        );
      })}
    </ol>
  );
}
