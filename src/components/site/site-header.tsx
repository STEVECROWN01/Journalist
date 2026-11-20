"use client";

import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, ChevronDown, ArrowRight, Globe } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MAIN_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/a-propos" },
  { key: "productions", href: "/productions" },
  { key: "publications", href: "/publications" },
  { key: "contact", href: "/contact" },
] as const;

const EXPERTISE_LINKS = [
  { key: "journalism", href: "/journalisme" },
  { key: "comms", href: "/communication-conseil" },
  { key: "training", href: "/formation" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** En-tête fixe : transparent sur le hero, opaque au défilement. */
export function SiteHeader() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
    setSheetOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-mist/10 bg-ink/92 backdrop-blur-md"
          : "bg-gradient-to-b from-ink-deep/80 to-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-6 px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-[1.35rem] leading-none tracking-tight text-white transition-opacity hover:opacity-80"
          aria-label={t("brand")}
        >
          Alexandre&nbsp;Morel<span className="text-rouge">.</span>
        </Link>

        {/* Navigation bureau */}
        <nav aria-label={t("nav.expertise")} className="hidden items-center gap-7 lg:flex">
          {MAIN_LINKS.slice(0, 2).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`text-[0.82rem] font-medium uppercase tracking-[0.12em] transition-colors ${
                isActive(pathname, item.href)
                  ? "text-white"
                  : "text-silver hover:text-white"
              }`}
            >
              {t(`nav.${item.key}`)}
              {isActive(pathname, item.href) && (
                <span className="mx-auto mt-1 block h-px w-full bg-rouge" />
              )}
            </Link>
          ))}

          {/* Expertises — menu déroulant */}
          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              onFocus={() => setMenuOpen(true)}
              onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
              className={`flex items-center gap-1.5 text-[0.82rem] font-medium uppercase tracking-[0.12em] transition-colors ${
                EXPERTISE_LINKS.some((l) => isActive(pathname, l.href))
                  ? "text-white"
                  : "text-silver hover:text-white"
              }`}
            >
              {t("nav.expertise")}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
              {EXPERTISE_LINKS.some((l) => isActive(pathname, l.href)) && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-rouge" />
              )}
            </button>

            <div
              className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-5 transition-all duration-300 ${
                menuOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-lg border border-mist/10 bg-surface shadow-2xl shadow-black/50">
                {EXPERTISE_LINKS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-start gap-3 border-b border-mist/5 px-5 py-4 transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-rouge opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    <span
                      className={`text-[0.85rem] font-medium leading-snug ${
                        isActive(pathname, item.href) ? "text-white" : "text-silver group-hover:text-white"
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {MAIN_LINKS.slice(2).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`text-[0.82rem] font-medium uppercase tracking-[0.12em] transition-colors ${
                isActive(pathname, item.href)
                  ? "text-white"
                  : "text-silver hover:text-white"
              }`}
            >
              {t(`nav.${item.key}`)}
              {isActive(pathname, item.href) && (
                <span className="mx-auto mt-1 block h-px w-full bg-rouge" />
              )}
            </Link>
          ))}
        </nav>

        {/* Droite : langues + CTA */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1 text-[0.72rem] font-semibold tracking-[0.1em]"
            role="group"
            aria-label={t("language.label")}
          >
            <Globe size={13} className="mr-1 text-steel" aria-hidden="true" />
            {(["fr", "en"] as const).map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="mx-0.5 text-graphite" aria-hidden="true">/</span>}
                <button
                  type="button"
                  onClick={() => switchLocale(l)}
                  aria-current={locale === l ? "true" : undefined}
                  className={`rounded px-1.5 py-1 uppercase transition-colors ${
                    locale === l
                      ? "text-white underline decoration-rouge decoration-2 underline-offset-4"
                      : "text-steel hover:text-silver"
                  }`}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>

          <Link
            href="/contact"
            className="hidden rounded-full border border-mist/25 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-mist transition-all hover:border-mist/60 hover:bg-mist/5 hover:text-white lg:inline-flex"
          >
            {t("cta.short")}
          </Link>

          {/* Mobile */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className="inline-flex size-11 items-center justify-center rounded-full text-mist lg:hidden"
              aria-label={t("nav.expertise")}
            >
              <Menu size={22} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[19rem] border-mist/10 bg-ink p-0"
            >
              <SheetTitle className="sr-only">{t("brand")}</SheetTitle>
              <nav className="flex h-full flex-col px-7 pb-10 pt-20" aria-label="Mobile">
                {[...MAIN_LINKS.slice(0, 2), ...EXPERTISE_LINKS, ...MAIN_LINKS.slice(2)].map(
                  (item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className={`border-b border-mist/8 py-4 font-serif text-[1.3rem] transition-colors ${
                        isActive(pathname, item.href)
                          ? "text-white"
                          : "text-silver hover:text-white"
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  )
                )}
                <div className="mt-auto pt-8">
                  <div className="flex items-center gap-2" role="group" aria-label={t("language.label")}>
                    {(["fr", "en"] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => switchLocale(l)}
                        className={`rounded-full border px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                          locale === l
                            ? "border-rouge bg-rouge/10 text-white"
                            : "border-mist/20 text-steel hover:text-silver"
                        }`}
                      >
                        {t(`language.${l}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
