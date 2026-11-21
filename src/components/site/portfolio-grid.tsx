"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductionView } from "@/lib/content";
import { ProductionCard } from "./production-card";
import { Reveal } from "./reveal";

const CATEGORIES = [
  "all",
  "reportage",
  "documentaire",
  "interview",
  "communication",
] as const;

type Category = (typeof CATEGORIES)[number];

/** Grille de productions avec filtres par catégorie. */
export function PortfolioGrid({ productions }: { productions: ProductionView[] }) {
  const t = useTranslations();
  const [filter, setFilter] = useState<Category>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? productions
        : productions.filter((p) => p.category === filter),
    [filter, productions]
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of productions)
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [productions]);

  const categoryLabel = (cat: string) =>
    t(`productions.portfolio.filters.${cat}`);

  return (
    <div>
      {/* Filtres */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label={categoryLabel("all")}
      >
        {CATEGORIES.map((cat) => {
          const count =
            cat === "all" ? productions.length : (counts.get(cat) ?? 0);
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                active
                  ? "border-or bg-or text-white"
                  : "border-mist/20 text-silver hover:border-mist/50 hover:text-white"
              } ${count === 0 && !active ? "opacity-40" : ""}`}
            >
              {categoryLabel(cat)}
              <span className="ml-2 text-[0.65rem] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grille */}
      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07} className="h-full min-w-0">
              <ProductionCard
                production={p}
                categoryLabel={categoryLabel(p.category)}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-lg border border-dashed border-mist/15 p-10 text-center text-steel">
          {t("productions.portfolio.empty")}
        </p>
      )}
    </div>
  );
}
