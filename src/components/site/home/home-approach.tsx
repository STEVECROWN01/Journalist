"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

export interface ApproachStep {
  title: string;
  desc: string;
}

/**
 * Étapes de la méthode — design des cartes RESTAURÉ TEL QUEL (cartes
 * arrondies sur fond sombre, bouton pleine largeur, cercle « + » / « − »
 * à droite, panneau déplié par la grille CSS 0fr ↔ 1fr — aucune mesure
 * JavaScript, fluide dans les deux sens). SEULS LES NUMÉROS changent :
 * ils reviennent au style d'écriture précédent — « 01 » en serif
 * italique, acier, doré au survol — posé à gauche du titre, à la place
 * du numéro fantôme géant.
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
              className={`group relative overflow-hidden rounded-2xl border bg-surface transition-colors duration-300 ${
                open ? "border-mist/35" : "border-mist/12"
              }`}
            >
              <h3 className="dt-step-title">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`etape-panneau-${i}`}
                  id={`etape-bouton-${i}`}
                  className="relative flex w-full cursor-pointer items-center gap-5 px-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 sm:gap-6 sm:px-8"
                >
                  {/* Numéro — style d'écriture précédent : serif italique
                      « 01 », acier, doré au survol de la carte */}
                  <span
                    className="dt-step-num font-serif italic transition-colors duration-300 group-hover:text-or"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="dt-step-name font-serif font-semibold leading-snug text-white">
                    {step.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      open
                        ? "border-mist bg-mist text-ink"
                        : "border-mist/25 text-mist group-hover:border-mist/55"
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
