"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

export interface ApproachStep {
  title: string;
  desc: string;
}

/**
 * Étapes de la méthode — calque exact de la section « Comment je
 * travaille » du site de référence : cartes arrondies sur fond sombre,
 * numéro fantôme géant, bouton pleine largeur (titre à gauche, cercle
 * « + » / « − » à droite) et panneau qui se déplie par la grille CSS
 * (0fr ↔ 1fr) — aucune mesure JavaScript, fluide dans les deux sens,
 * insensible aux recalculs de mise en page. Aucun état de survol
 * spécifique, comme le référent : seuls les états ouvert / fermé
 * transitionnent (300 ms).
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

  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, i) => {
        const open = openIndex === i;
        return (
          <Reveal
            as="li"
            key={step.title}
            delay={0.06 * i}
            from="left"
            toggle
          >
            <div
              className={`relative overflow-hidden rounded-2xl border bg-surface transition-colors duration-300 ${
                open ? "border-mist/35" : "border-mist/12"
              }`}
            >
              {/* Numéro fantôme — repère visuel géant, hors interaction */}
              <span
                aria-hidden="true"
                className="font-serif pointer-events-none absolute -left-2 -top-6 select-none text-[5.5rem] font-bold leading-none text-mist/10"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="dt-step-title">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`etape-panneau-${i}`}
                  id={`etape-bouton-${i}`}
                  className="relative flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 sm:px-8"
                >
                  <span className="dt-step-name font-serif font-semibold leading-snug text-white">
                    {step.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      open
                        ? "border-mist bg-mist text-ink"
                        : "border-mist/25 text-mist"
                    }`}
                  >
                    {open ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                  <span className="sr-only">
                    {open ? collapseLabel : expandLabel}
                  </span>
                </button>
              </h3>

              {/* Panneau dépliable — grille CSS 0fr ↔ 1fr, sans JS */}
              <div
                id={`etape-panneau-${i}`}
                role="region"
                aria-labelledby={`etape-bouton-${i}`}
                className={`dt-step-panel grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-7 sm:px-8">
                    <p className="dt-step-desc max-w-xl text-[0.95rem] leading-relaxed text-silver">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
