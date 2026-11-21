"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import type { PublicationView } from "@/lib/content";
import { PUBLICATION_CATEGORIES } from "@/lib/site";
import { publicationCategoryLabel } from "@/lib/site";
import { PublicationCard } from "./publication-card";
import { Reveal } from "./reveal";

interface ExplorerProps {
  publications: PublicationView[];
}

/** Explorateur de publications : filtres éditoriaux et recherche. */
export function PublicationsExplorer({ publications }: ExplorerProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  /* Une catégorie n'est proposée que si des publications publiées s'y rattachent. */
  const activeCategories = useMemo(
    () =>
      PUBLICATION_CATEGORIES.filter((c) =>
        publications.some((p) => p.categoryKey === c)
      ),
    [publications]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publications.filter((p) => {
      const matchCategory = category === "all" || p.categoryKey === category;
      const matchQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [publications, query, category]);

  const labels = {
    readMore: t("publications.readArticle"),
    readingTime: t.raw("publications.readingTime") as string,
  };

  return (
    <div>
      {/* Recherche + catégories éditoriales */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label={t("publications.filters.label")}
        >
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={`rounded-full border px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
              category === "all"
                ? "border-or bg-or text-white"
                : "border-mist/20 text-silver hover:border-mist/50 hover:text-white"
            }`}
          >
            {t("publications.filters.all")}
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full border px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                category === cat
                  ? "border-or bg-or text-white"
                  : "border-mist/20 text-silver hover:border-mist/50 hover:text-white"
              }`}
            >
              {publicationCategoryLabel(cat, locale === "fr" ? "fr" : "en", true)}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm lg:w-auto">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("publications.search.placeholder")}
            aria-label={t("publications.search.label")}
            className="h-11 w-full rounded-full border border-mist/20 bg-surface/60 pl-11 pr-10 text-[0.9rem] text-white placeholder:text-steel focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-or/40"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-steel hover:text-white"
              aria-label={t("publications.search.placeholder")}
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Résultats */}
      {publications.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-mist/15 p-10 text-center text-steel">
          {t("publications.listing.empty")}
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-mist/15 p-10 text-center text-steel">
          {t("publications.search.noResults")}
        </p>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05} className="min-w-0">
              <PublicationCard publication={p} labels={labels} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
