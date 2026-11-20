"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import type { PublicationView } from "@/lib/content";
import { PublicationCard } from "./publication-card";
import { Reveal } from "./reveal";

interface ExplorerProps {
  publications: PublicationView[];
}

/** Explorateur de publications : recherche, catégories, archives par année. */
export function PublicationsExplorer({ publications }: ExplorerProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(publications.map((p) => p.category));
    return Array.from(set);
  }, [publications]);

  const years = useMemo(() => {
    const set = new Set(publications.map((p) => p.publishedAt.slice(0, 4)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [publications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publications.filter((p) => {
      const matchCategory = category === "all" || p.category === category;
      const matchQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [publications, query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, PublicationView[]>();
    for (const p of filtered) {
      const year = p.publishedAt.slice(0, 4);
      const list = map.get(year) ?? [];
      list.push(p);
      map.set(year, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const labels = {
    readMore: t("common.actions.readMore"),
    readingTime: t.raw("publications.readingTime") as string,
  };

  return (
    <div>
      {/* Recherche + catégories */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
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
            className="h-11 w-full rounded-full border border-mist/20 bg-surface/60 pl-11 pr-10 text-[0.9rem] text-white placeholder:text-steel focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-rouge/40"
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

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label={t("publications.categories.label")}
        >
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={`rounded-full border px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
              category === "all"
                ? "border-rouge bg-rouge text-white"
                : "border-mist/20 text-silver hover:border-mist/50 hover:text-white"
            }`}
          >
            {t("publications.categories.all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full border px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                category === cat
                  ? "border-rouge bg-rouge text-white"
                  : "border-mist/20 text-silver hover:border-mist/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-mist/15 p-10 text-center text-steel">
          {t("publications.search.noResults")}
        </p>
      ) : (
        <div className="mt-12 space-y-16">
          {grouped.map(([year, items]) => (
            <section key={year} aria-label={`${t("publications.archives.title")} ${year}`}>
              <div className="flex items-center gap-5">
                <h3 className="font-serif text-[1.6rem] text-white">{year}</h3>
                <span className="h-px flex-1 bg-mist/10" aria-hidden="true" />
                <span className="meta">
                  {items.length}{" "}
                  {items.length > 1 ? "" : ""}
                </span>
              </div>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                {items.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.05}>
                    <PublicationCard publication={p} labels={labels} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Compteur discret d'années archivées (information) */}
      {years.length > 1 && query === "" && category === "all" ? null : null}
    </div>
  );
}
