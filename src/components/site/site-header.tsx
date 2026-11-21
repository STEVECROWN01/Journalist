"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Linkedin,
  Twitter,
  Video,
} from "lucide-react";
import { getLenis } from "@/lib/lenis-store";

/* Liens de la bande de navigation (desktop) — « Accueil » retiré :
   le wordmark assure le retour à l'accueil. */
const NAV_LINKS = [
  { key: "about", href: "/a-propos" },
  { key: "productions", href: "/productions" },
  { key: "publications", href: "/publications" },
] as const;

const EXPERTISE_LINKS = [
  { key: "journalism", href: "/journalisme" },
  { key: "comms", href: "/communication-conseil" },
  { key: "training", href: "/formation" },
] as const;

/* Colonne gauche du menu plein écran : expertises + œuvres */
const MENU_SERVICES = [
  ...EXPERTISE_LINKS,
  { key: "productions", href: "/productions" },
  { key: "publications", href: "/publications" },
] as const;

/* Colonne droite du menu plein écran */
const MENU_OTHERS = [
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
] as const;

export interface HeaderSocials {
  linkedin: string;
  twitter: string;
  vimeo: string;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * En-tête fixe — transparent en haut de page (aucun fond, jamais),
 * puis effet de verre sur la seule bande de navigation flottante et
 * les commandes de droite une fois la page défilée. Le wordmark reste
 * hors de la bande. Menu plein écran sur tous les écrans.
 */
export function SiteHeader({ socials }: { socials: HeaderSocials }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Effet de verre dès que l'on quitte le sommet de la page */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Verrouille le défilement (native + Lenis) quand le menu est ouvert */
  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    lenis?.start();
    document.body.style.overflow = "";
  }, [menuOpen]);

  /* Fermeture : touche Échap + changement de route */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setExpertiseOpen(false);
  }, [pathname]);

  const switchLocale = (next: string) => {
    setMenuOpen(false);
    router.replace(pathname, { locale: next });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const socialList = [
    { name: "LinkedIn", href: socials.linkedin, Icon: Linkedin },
    { name: "X (Twitter)", href: socials.twitter, Icon: Twitter },
    { name: "Vimeo", href: socials.vimeo, Icon: Video },
  ];

  /* Cadre commun des boutons carrés à coins arrondis (langue, menu) */
  const squareBase =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 hover:border-mist/40 hover:bg-mist/15 hover:text-white";

  const linkBase =
    "rounded-lg px-3 py-2 text-[0.76rem] font-medium uppercase tracking-[0.1em] transition-colors duration-300";

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex w-full max-w-[1400px] items-start justify-between px-5 sm:px-8 lg:px-10">
        {/* Wordmark — toujours hors de la bande de verre ; sa propre
            languette de verre n'apparaît qu'après défilement (lisibilité) */}
        <Link
          href="/"
          aria-label={t("brand")}
          className={`flex h-16 items-center px-5 font-serif text-[1.3rem] leading-none tracking-tight text-white transition-all duration-500 hover:opacity-80 ${
            scrolled
              ? "rounded-b-xl border-x border-b border-mist/10 bg-ink/55 backdrop-blur-xl"
              : "border-x border-b border-transparent"
          }`}
        >
          Alexandre&nbsp;Morel<span className="text-rouge">.</span>
        </Link>

        {/* Bande de navigation flottante — transparente en haut,
            effet de verre après défilement (desktop) */}
        <nav
          aria-label={t("nav.expertise")}
          className={`mt-2 hidden h-12 items-center gap-1 rounded-xl border px-2 transition-all duration-500 lg:flex ${
            scrolled
              ? "border-mist/10 bg-ink/55 shadow-[0_10px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              : "border-transparent"
          }`}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${linkBase} ${
                isActive(pathname, item.href)
                  ? "text-white"
                  : "text-silver hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {t(`nav.${item.key}`)}
              {isActive(pathname, item.href) && (
                <span
                  className="ml-1.5 inline-block size-[3px] rounded-full bg-rouge align-[2px]"
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}

          {/* Expertises — menu déroulant */}
          <div
            className="relative"
            onMouseEnter={() => setExpertiseOpen(true)}
            onMouseLeave={() => setExpertiseOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={expertiseOpen}
              onClick={() => setExpertiseOpen((v) => !v)}
              onFocus={() => setExpertiseOpen(true)}
              onKeyDown={(e) => e.key === "Escape" && setExpertiseOpen(false)}
              className={`${linkBase} flex items-center gap-1.5 ${
                EXPERTISE_LINKS.some((l) => isActive(pathname, l.href))
                  ? "text-white"
                  : "text-silver hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {t("nav.expertise")}
              <ChevronDown
                size={13}
                className={`transition-transform duration-300 ${expertiseOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
              {EXPERTISE_LINKS.some((l) => isActive(pathname, l.href)) && (
                <span
                  className="ml-0.5 inline-block size-[3px] rounded-full bg-rouge align-[2px]"
                  aria-hidden="true"
                />
              )}
            </button>

            <div
              className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition-all duration-300 ${
                expertiseOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-xl border border-mist/10 bg-ink/90 shadow-2xl shadow-black/50 backdrop-blur-xl">
                {EXPERTISE_LINKS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setExpertiseOpen(false)}
                    className="group flex items-start gap-3 border-b border-mist/5 px-5 py-3.5 transition-colors duration-300 last:border-0 hover:bg-white/[0.04]"
                  >
                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-rouge opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    <span
                      className={`text-[0.85rem] font-medium leading-snug ${
                        isActive(pathname, item.href)
                          ? "text-white"
                          : "text-silver group-hover:text-white"
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA — rétabli dans la bande */}
          <span className="mx-1 h-5 w-px bg-mist/10" aria-hidden="true" />
          <Link
            href="/contact"
            className="group ml-0.5 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-mist"
          >
            {t("cta.short")}
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </nav>

        {/* Commandes de droite : langue + menu (hors de la bande) */}
        <div className="mt-[0.625rem] flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchLocale(locale === "fr" ? "en" : "fr")}
            aria-label={t("language.switch")}
            title={t("language.switch")}
            className={`${squareBase} ${
              scrolled
                ? "border-mist/10 bg-ink/55 text-mist backdrop-blur-xl"
                : "border-mist/25 text-mist"
            }`}
          >
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em]">
              {locale}
            </span>
          </button>

          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("menu.open")}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            className={`${squareBase} ${
              scrolled
                ? "border-mist/10 bg-ink/55 text-mist backdrop-blur-xl"
                : "border-mist/25 text-mist"
            }`}
          >
            <Menu size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ============ MENU PLEIN ÉCRAN ============ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("menu.label")}
            className="fixed inset-0 z-[70] flex flex-col bg-ink-deep/[0.985] backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
          >
            {/* Ligne supérieure : wordmark + langue + fermer */}
            <div className="mx-auto flex h-16 w-full shrink-0 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4, ease }}
              >
                <Link
                  href="/"
                  onClick={closeMenu}
                  aria-label={t("brand")}
                  className="font-serif text-[1.3rem] leading-none tracking-tight text-white transition-opacity duration-300 hover:opacity-80"
                >
                  Alexandre&nbsp;Morel<span className="text-rouge">.</span>
                </Link>
              </motion.div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => switchLocale(locale === "fr" ? "en" : "fr")}
                  aria-label={t("language.switch")}
                  title={t("language.switch")}
                  className={`${squareBase} border-mist/25 text-mist`}
                >
                  <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em]">
                    {locale}
                  </span>
                </button>
                <motion.button
                  ref={closeRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label={t("menu.close")}
                  initial={reduce ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease }}
                  className={`${squareBase} border-mist/25 text-mist`}
                >
                  <X size={19} aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Colonnes : services (gauche) / autres liens + réseaux (droite) */}
            <div
              data-lenis-prevent
              className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 content-start gap-14 overflow-y-auto px-5 pb-16 pt-10 sm:px-8 md:content-center lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:px-10 lg:pb-10 lg:pt-0"
            >
              <nav aria-label={t("menu.services")}>
                <motion.p
                  className="eyebrow"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45, ease }}
                >
                  {t("menu.services")}
                </motion.p>
                <ul className="mt-8 space-y-1.5 md:space-y-2.5">
                  {MENU_SERVICES.map((item, i) => (
                    <motion.li
                      key={item.key}
                      initial={reduce ? false : { opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduce ? 0 : 0.14 + i * 0.06,
                        duration: 0.55,
                        ease,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="group flex items-baseline gap-4 py-1"
                      >
                        <span className="w-7 shrink-0 font-serif text-[0.95rem] italic text-graphite transition-colors duration-300 group-hover:text-rouge">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-serif text-[1.65rem] leading-tight transition-colors duration-300 md:text-[2.05rem] ${
                            isActive(pathname, item.href)
                              ? "text-white"
                              : "text-mist group-hover:text-white"
                          }`}
                        >
                          {t(`nav.${item.key}`)}
                        </span>
                        <ArrowUpRight
                          size={19}
                          className="ml-1 hidden shrink-0 -translate-x-1.5 self-center text-rouge opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <aside className="lg:border-l lg:border-mist/10 lg:pl-12">
                <motion.p
                  className="eyebrow"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45, ease }}
                >
                  {t("menu.otherLinks")}
                </motion.p>
                <ul className="mt-8 space-y-1">
                  {MENU_OTHERS.map((item, i) => (
                    <motion.li
                      key={item.key}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduce ? 0 : 0.28 + i * 0.06,
                        duration: 0.5,
                        ease,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="group inline-flex items-center gap-3 py-2 text-[1.02rem] font-medium transition-colors duration-300"
                      >
                        <span
                          className={
                            isActive(pathname, item.href)
                              ? "text-white"
                              : "text-mist group-hover:text-white"
                          }
                        >
                          {t(`nav.${item.key}`)}
                        </span>
                        <ArrowRight
                          size={14}
                          className="-translate-x-1 text-rouge opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.44, duration: 0.5, ease }}
                  className="mt-12"
                >
                  <p className="meta">{t("menu.socials")}</p>
                  <div className="mt-5 flex items-center gap-2.5">
                    {socialList.map(({ name, href, Icon }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        title={name}
                        className="inline-flex size-11 items-center justify-center rounded-xl border border-mist/15 text-steel transition-all duration-300 hover:border-mist/35 hover:bg-mist/10 hover:text-white"
                      >
                        <Icon size={18} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
