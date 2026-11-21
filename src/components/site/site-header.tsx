"use client";

import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FullscreenMenu } from "./fullscreen-menu";

export interface HeaderSocial {
  linkedin: string;
  twitter: string;
  vimeo: string;
}

const NAV_LINKS = [
  { key: "about", href: "/a-propos" },
  { key: "productions", href: "/productions" },
  { key: "publications", href: "/publications" },
  { key: "contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * En-tête en boîtes flottantes détachées (logo, navigation, menu) :
 * totalement transparent en haut de page, effet de verre dépoli
 * (backdrop-blur) dès que l'on fait défiler — à la manière du site
 * de référence.
 */
export function SiteHeader({ social }: { social: HeaderSocial }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const targetLocale = locale === "fr" ? "en" : "fr";

  const switchLocale = () => {
    router.replace(pathname, { locale: targetLocale });
  };

  /* Verre dépoli appliqué aux boîtes lors du défilement */
  const glass = scrolled
    ? "border-mist/10 bg-ink/70 shadow-[inset_0_1px_0_0_rgba(228,228,228,0.10),0_18px_44px_-20px_rgba(7,7,7,0.85)] backdrop-blur-xl backdrop-saturate-150"
    : "border-transparent bg-transparent";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          {t("skipToContent")}
        </a>

        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-4 px-6">
          {/* Boîte wordmark — collée au bord supérieur, coins arrondis bas */}
          <Link
            href="/"
            aria-label={t("brand")}
            className={`flex h-16 items-center rounded-b-2xl border border-t-0 px-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${glass}`}
          >
            <span className="font-serif text-[1.28rem] leading-none tracking-tight text-white transition-opacity hover:opacity-85">
              Alexandre&nbsp;Morel<span className="text-rouge">.</span>
            </span>
          </Link>

          {/* Boîte navigation — flottante, bureau uniquement */}
          <nav
            aria-label={t("nav.primary")}
            className={`mt-2 hidden items-center gap-7 rounded-2xl border px-8 py-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${glass}`}
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`relative py-1 text-[0.82rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
                  isActive(pathname, item.href)
                    ? "text-white"
                    : "text-silver hover:text-white"
                }`}
              >
                {t(`nav.${item.key}`)}
                {isActive(pathname, item.href) && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-px bg-rouge"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Droite : langue (bouton rond unique) + hamburger (boîte) */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={switchLocale}
              aria-label={t("language.switch")}
              title={t("language.switch")}
              className={`mt-2.5 flex size-11 items-center justify-center rounded-full border text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-mist transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white ${
                scrolled
                  ? "border-mist/15 bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
                  : "border-mist/25 hover:border-mist/60"
              }`}
            >
              {targetLocale}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu.open")}
              aria-expanded={menuOpen}
              aria-controls="menu-plein-ecran"
              className={`group flex h-16 w-16 items-center justify-center rounded-b-2xl border border-t-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-surface/50 ${glass}`}
            >
              <span
                className="flex w-6 flex-col gap-[5px]"
                aria-hidden="true"
              >
                <span className="block h-[2px] w-full bg-white transition-transform duration-300 group-hover:scale-x-75 group-hover:origin-left" />
                <span className="block h-[2px] w-4 bg-white transition-transform duration-300 group-hover:scale-x-150 group-hover:origin-left" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        social={social}
      />
    </>
  );
}
