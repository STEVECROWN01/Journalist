"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import {
  X,
  ArrowUpRight,
  Linkedin,
  Twitter,
  Video,
} from "lucide-react";
import { getLenis } from "@/lib/lenis-store";

/* Bande de navigation (desktop) — exactement quatre menus :
   Journalisme · Documentaires · Publications · Productions. */
const NAV_LINKS = [
  { key: "journalismShort", href: "/journalisme" },
  { key: "documentary", href: "/documentaire" },
  { key: "publications", href: "/publications" },
  { key: "productions", href: "/productions" },
] as const;

/* Colonne gauche du menu plein écran — domaines d'intervention,
   sans titre de colonne */
const MENU_PRIMARY = [
  { key: "journalism", href: "/journalisme" },
  { key: "productions", href: "/productions" },
  { key: "publications", href: "/publications" },
  { key: "comms", href: "/communication-conseil" },
  { key: "training", href: "/formation" },
] as const;

/* Colonne droite du menu plein écran — autres liens + rubrique éditoriale */
const MENU_OTHERS = [
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
  { key: "articlesAnalyses", href: "/publications" },
] as const;

export interface HeaderSocials {
  linkedin: string;
  twitter: string;
  vimeo: string;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

/* ---------- Drapeaux (SVG inline, aucune dépendance) ---------- */

function FlagFR({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="8" height="16" fill="#0055A4" />
      <rect x="8" width="8" height="16" fill="#ffffff" />
      <rect x="16" width="8" height="16" fill="#EF4135" />
    </svg>
  );
}

function FlagGB({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="24" height="16" fill="#012169" />
      <path
        d="M0 0L24 16M24 0L0 16"
        stroke="#ffffff"
        strokeWidth="3.4"
      />
      <path
        d="M0 0L24 16M24 0L0 16"
        stroke="#C8102E"
        strokeWidth="1.7"
      />
      <path d="M12 0V16M0 8H24" stroke="#ffffff" strokeWidth="5.6" />
      <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3.4" />
    </svg>
  );
}

/**
 * En-tête fixe — reprise exacte de la structure du site de référence :
 * bande pleine hauteur (104 px), wordmark à gauche, navigation dans une
 * pilule sombre, commutateur de langue avec drapeau et bouton hamburger
 * en languette pleine hauteur aux coins inférieurs arrondis.
 */
export function SiteHeader({ socials }: { socials: HeaderSocials }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Effet discret dès que l'on quitte le sommet de la page */
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
  }, [pathname]);

  /* Changement de langue : lien natif vers la MÊME page dans l'autre
     langue (next-intl Link + prop locale). Véritable ancre <a> : la
     navigation fonctionne avant même l'hydratation React. */
  const otherLocale = locale === "fr" ? "en" : "fr";
  const OtherFlag = otherLocale === "fr" ? FlagFR : FlagGB;

  const closeMenu = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const socialList = [
    { name: "LinkedIn", href: socials.linkedin, Icon: Linkedin },
    { name: "X (Twitter)", href: socials.twitter, Icon: Twitter },
    { name: "Vimeo", href: socials.vimeo, Icon: Video },
  ];

  /* Liens de la bande : soulignement fin qui s'étend depuis le centre
     (style du site de référence) — aucun fond au survol */
  const linkBase =
    "relative rounded-lg px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-300 " +
    "after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 " +
    "hover:after:left-3.5 hover:after:w-[calc(100%-1.75rem)]";

  /* Commutateur bilingue — pilule avec drapeau de la langue cible :
     le survol annonce clairement la destination (drapeau + libellé). */
  const switchBase =
    "group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] transition-all duration-300";

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between pl-5 sm:pl-8 lg:pl-10">
        {/* Wordmark — Sora 600 comme le logo du site de référence */}
        <Link
          href="/"
          aria-label={t("brand")}
          className={`flex h-[76px] items-center pr-6 font-serif text-[1.2rem] font-semibold leading-none tracking-[-0.01em] text-white transition-all duration-500 hover:opacity-80 sm:text-[1.3rem] lg:h-[104px] ${
            scrolled
              ? "rounded-b-xl border-x border-b border-mist/10 bg-ink/80 backdrop-blur-xl"
              : "border-x border-b border-transparent"
          }`}
        >
          Alexandre&nbsp;Morel<span className="text-or">.</span>
        </Link>

        {/* Bande de navigation — pilule sombre permanente (référence) */}
        <nav
          aria-label={t("menu.label")}
          className="hidden h-[52px] items-center gap-0.5 rounded-full border border-mist/10 bg-ink/90 px-2 shadow-[0_10px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:flex"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${linkBase} ${
                isActive(pathname, item.href)
                  ? "text-white"
                  : "text-silver hover:text-white"
              }`}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}

          {/* CTA — mène à la page Contact */}
          <span className="mx-1.5 h-5 w-px bg-mist/10" aria-hidden="true" />
          <Link
            href="/contact"
            className="group ml-0.5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.9rem] font-semibold tracking-[0.01em] text-ink transition-all duration-300 hover:bg-mist"
          >
            {t("cta.header")}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </nav>

        {/* Commandes de droite : langue + hamburger du référent */}
        <div className="flex h-full items-center gap-2.5 lg:gap-3">
          <Link
            href={pathname}
            locale={otherLocale}
            aria-label={t("language.switch")}
            title={t("language.switch")}
            className={`${switchBase} ${
              scrolled
                ? "border-mist/15 bg-ink/80 text-mist backdrop-blur-xl hover:border-mist/40 hover:text-white"
                : "border-mist/25 bg-ink/40 text-mist backdrop-blur-sm hover:border-mist/50 hover:text-white"
            }`}
          >
            <OtherFlag className="h-3.5 w-5 rounded-[3px] outline outline-1 outline-white/25" />
            {otherLocale}
          </Link>

          {/* Hamburger — languette pleine hauteur, coins bas arrondis,
              deux barres (la seconde plus courte), exactement comme le
              site de référence */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("menu.open")}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            className="group flex h-[76px] w-[88px] shrink-0 flex-col items-center justify-center gap-[5px] rounded-b-lg bg-ink transition-colors duration-300 hover:bg-surface-2 lg:h-[104px] lg:w-[100px]"
          >
            <span
              className="block h-[2px] w-6 bg-white transition-all duration-300 group-hover:w-4"
              aria-hidden="true"
            />
            <span
              className="block h-[2px] w-4 bg-white transition-all duration-300 group-hover:w-6"
              aria-hidden="true"
            />
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
            className="fixed inset-0 z-[70] flex flex-col bg-ink/[0.985] backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
          >
            {/* Ligne supérieure : wordmark + langue + fermer */}
            <div className="mx-auto flex h-[76px] w-full shrink-0 max-w-[1440px] items-center justify-between pl-5 sm:pl-8 lg:h-[104px] lg:pl-10">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4, ease }}
              >
                <Link
                  href="/"
                  onClick={closeMenu}
                  aria-label={t("brand")}
                  className="font-serif text-[1.2rem] font-semibold leading-none tracking-[-0.01em] text-white transition-opacity duration-300 hover:opacity-80 sm:text-[1.3rem]"
                >
                  Alexandre&nbsp;Morel<span className="text-or">.</span>
                </Link>
              </motion.div>

              <div className="flex items-center gap-2.5 lg:gap-3">
                <Link
                  href={pathname}
                  locale={otherLocale}
                  onClick={() => setMenuOpen(false)}
                  aria-label={t("language.switch")}
                  title={t("language.switch")}
                  className={`${switchBase} border-mist/25 bg-ink/40 text-mist hover:border-mist/50 hover:text-white`}
                >
                  <OtherFlag className="h-3.5 w-5 rounded-[3px] outline outline-1 outline-white/25" />
                  {otherLocale}
                </Link>
                <motion.button
                  ref={closeRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label={t("menu.close")}
                  initial={reduce ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease }}
                  className="inline-flex size-[52px] shrink-0 items-center justify-center rounded-full border border-mist/25 text-mist transition-all duration-300 hover:border-mist/60 hover:bg-mist/10 hover:text-white"
                >
                  <X size={20} aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Colonnes : domaines (gauche, sans titre) /
                autres liens + réseaux (droite) */}
            <div
              data-lenis-prevent
              className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 content-start gap-14 overflow-y-auto px-5 pb-16 pt-10 sm:px-8 md:content-center lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:px-10 lg:pb-10 lg:pt-0"
            >
              <nav aria-label={t("menu.primary")}>
                <ul className="space-y-2.5 md:space-y-4">
                  {MENU_PRIMARY.map((item, i) => (
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
                        className="group flex items-baseline gap-5 py-1"
                      >
                        <span className="w-8 shrink-0 font-sans text-[0.95rem] font-semibold text-graphite transition-colors duration-300 group-hover:text-mist">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`relative font-serif text-[1.9rem] font-medium leading-tight tracking-[-0.015em] transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:left-0 group-hover:after:w-full md:text-[2.5rem] ${
                            isActive(pathname, item.href)
                              ? "text-white"
                              : "text-mist group-hover:text-white"
                          }`}
                        >
                          {t(`nav.${item.key}`)}
                        </span>
                        <ArrowUpRight
                          size={20}
                          className="ml-1 hidden shrink-0 -translate-x-1.5 self-center text-mist opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <aside className="lg:pl-12">
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
                        className="group py-2"
                      >
                        <span
                          className={`relative font-serif text-[1.05rem] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:left-0 group-hover:after:w-full ${
                            isActive(pathname, item.href)
                              ? "text-white"
                              : "text-mist group-hover:text-white"
                          }`}
                        >
                          {t(`nav.${item.key}`)}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Réseaux — icônes seules (ronds blancs), sans titre */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.44, duration: 0.5, ease }}
                  className="mt-12 border-t border-mist/10 pt-7"
                >
                  <div className="flex items-center gap-2.5">
                    {socialList.map(({ name, href, Icon }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        title={name}
                        className="inline-flex size-11 items-center justify-center rounded-full bg-white text-ink transition-all duration-300 hover:bg-mist"
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
