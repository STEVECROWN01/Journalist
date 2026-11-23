"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import {
  X,
  ArrowUpRight,
  Linkedin,
  Mail,
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
  email: string;
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
 * En-tête fixe — structure du site de référence, resserrée :
 * languettes nom / hamburger de 95 px collées au haut de page (aucun
 * espace au-dessus de leur fond), pilule des menus de 85 px démarrant
 * à 10 px sous le haut — son bas affleure EXACTEMENT au bas des
 * languettes. Coins inférieurs arrondis (14 px) sur les trois fonds.
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

  /* La bande sombre n'apparaît que lorsque le bas de l'en-tête
     atteint le bloc de texte du hero (accueil) — pas avant. Ailleurs,
     elle apparaît dès les premiers pixels de défilement. La mesure est
     refaite à chaque défilement : police, épinglage GSAP et hauteurs
     d'écran ne faussent jamais le seuil. */
  useEffect(() => {
    const threshold = () => {
      const heroText = document.querySelector(".dt-hero-content");
      const first = heroText?.firstElementChild;
      if (first instanceof HTMLElement) {
        const headerHeight = window.innerWidth >= 1024 ? 95 : 76;
        const textTop =
          first.getBoundingClientRect().top + window.scrollY;
        return Math.max(8, textTop - headerHeight);
      }
      return 8;
    };
    const onScroll = () => setScrolled(window.scrollY > threshold());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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

  /* Le wordmark joue le rôle de menu « Accueil » : depuis l'accueil, un
     clic ramène en haut de page (défilement fluide, sans rechargement) ;
     depuis une autre page, la navigation normale vers l'accueil suffit
     (défilement en haut garanti par l'App Router). */
  const goHome = (e: React.MouseEvent) => {
    if (pathname !== "/") return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.05 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* Réseaux — série complète du footer : Email, LinkedIn, X, Vimeo.
     Icônes seules (ronds blancs) : au survol, chaque réseau prend sa
     couleur officielle. */
  const socialList = [
    {
      name: "Email",
      href: `mailto:${socials.email}`,
      Icon: Mail,
      hover: "hover:border-ink hover:bg-ink hover:text-white",
      internal: true,
    },
    { name: "LinkedIn", href: socials.linkedin, Icon: Linkedin, hover: "hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white" },
    { name: "X (Twitter)", href: socials.twitter, Icon: Twitter, hover: "hover:border-black hover:bg-black hover:text-white" },
    { name: "Vimeo", href: socials.vimeo, Icon: Video, hover: "hover:border-[#1AB7EA] hover:bg-[#1AB7EA] hover:text-white" },
  ];

  /* Liens de la bande : 16 px comme le site de référence, soulignement
     fin qui s'étend depuis le centre — aucun fond au survol */
  const linkBase =
    "relative rounded-lg font-medium transition-colors duration-300 " +
    "lg:px-2 lg:py-2.5 lg:text-[0.95rem] xl:px-2.5 xl:py-3 xl:text-base " +
    "after:absolute after:bottom-1.5 xl:after:bottom-2 after:left-1/2 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 " +
    "hover:after:left-2 xl:hover:after:left-2.5 hover:after:w-[calc(100%-1rem)] xl:hover:after:w-[calc(100%-1.25rem)]";

  /* Commutateur bilingue — pilule avec drapeau de la langue cible :
     le survol annonce clairement la destination (drapeau + libellé).
     Mobile : drapeau seul (compact), libellé dès sm. */
  const switchBase =
    "group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-2.5 sm:px-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] transition-all duration-300";

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        {t("skipToContent")}
      </a>

      {/* Alignement du site de référence : items-start — le nom et le
          hamburger sont des languettes collées au haut de page (aucun
          espace au-dessus de leur fond), hautes de 95 px ; la pilule des
          menus démarre 10 px plus bas (85 px de haut) : son bas affleure
          exactement au bas des languettes. */}
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-start justify-between pl-5 pr-5 sm:pl-8 sm:pr-8 lg:h-[95px] lg:pl-10 lg:pr-10">
        {/* Wordmark — languette pleine hauteur aux coins bas arrondis,
            exactement comme le logo du site de référence. Au survol,
            l'inverse d'un effacement : le fond sombre se matérialise. */}
        <Link
          href="/"
          onClick={goHome}
          aria-label={t("brand")}
          className={`flex h-[76px] items-center rounded-b-[12px] border-x border-b px-3 font-serif text-[1.2rem] font-semibold leading-none tracking-[-0.01em] text-white transition-all duration-500 sm:px-6 sm:text-[1.3rem] lg:h-[95px] lg:rounded-b-[14px] ${
            scrolled
              ? "border-mist/10 bg-ink/80 backdrop-blur-xl hover:bg-ink/95"
              : "border-transparent hover:border-mist/10 hover:bg-ink/80 hover:backdrop-blur-xl"
          }`}
        >
          Alexandre&nbsp;Morel<span className="text-or">.</span>
        </Link>

        {/* Bande de navigation — pilule resserrée : 10 px sous le haut
            de page, 85 px de haut, bas aligné au bas des languettes nom /
            hamburger (95 px), coins arrondis 14 px. */}
        <nav
          aria-label={t("menu.label")}
          className={`hidden items-center rounded-[14px] transition-all duration-500 lg:mt-[10px] lg:flex lg:h-[85px] lg:px-3 xl:px-6 ${
            scrolled
              ? "border border-mist/10 bg-ink/95 shadow-[0_10px_36px_rgba(0,0,0,0.32)] backdrop-blur-xl"
              : "border border-transparent"
          }`}
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

          {/* CTA — design exact du site de référence : pilule blanche,
              libellé 15 px, pastille circulaire avec flèche qui s'inverse
              au survol, remplissage montant */}
          <Link
            href="/contact"
            className="btn-fill group/cta lg:ml-3 xl:ml-6"
          >
            <span className="text-[15px]">{t("cta.header")}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mist transition-colors duration-300 group-hover/cta:bg-ink">
              <ArrowUpRight
                size={14}
                className="text-ink transition-colors duration-300 group-hover/cta:text-white"
                aria-hidden="true"
              />
            </span>
          </Link>
        </nav>

        {/* Commandes de droite : langue + hamburger du référent */}
        <div className="flex h-full items-center gap-2.5 lg:gap-3">
          <Link
            href={pathname}
            locale={otherLocale}
            aria-label={t("language.switch")}
            title={t("language.switch")}
            className={`${switchBase} lg:hidden xl:inline-flex ${
              scrolled
                ? "border-mist/15 bg-ink/80 text-mist backdrop-blur-xl hover:border-white hover:bg-white hover:text-ink"
                : "border-mist/25 bg-ink/40 text-mist backdrop-blur-sm hover:border-white hover:bg-white hover:text-ink"
            }`}
          >
            <OtherFlag className="h-3.5 w-5 rounded-[3px] outline outline-1 outline-white/25" />
            <span className="hidden sm:inline">{otherLocale}</span>
          </Link>

          {/* Hamburger — languette du site de référence : collée au
              haut de page, 95 px de haut (bas aligné à la pilule des
              menus), coins bas arrondis 14 px, fond #1c1c1c → #232323
              au survol. */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("menu.open")}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            className="flex h-[76px] w-[50px] shrink-0 items-center justify-center rounded-b-[12px] bg-ink transition-colors duration-300 hover:bg-surface sm:w-[56px] lg:h-[95px] lg:w-[62px] lg:rounded-b-[14px]"
          >
            <span
              className="flex w-6 flex-col gap-[5px]"
              aria-hidden="true"
            >
              <span className="block h-[2px] w-full bg-white" />
              <span className="block h-[2px] w-4 bg-white" />
            </span>
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
            {/* Ligne supérieure : wordmark + langue + fermer — le bouton
                de fermeture respire à droite comme au-dessus de lui */}
            <div className="mx-auto flex h-[76px] w-full shrink-0 max-w-[1440px] items-center justify-between pl-5 pr-5 sm:pl-8 sm:pr-8 lg:h-[95px] lg:pl-10 lg:pr-10">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4, ease }}
              >
                <Link
                  href="/"
                  onClick={(e) => {
                    closeMenu();
                    goHome(e);
                  }}
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
                  className={`${switchBase} border-mist/25 bg-ink/40 text-mist hover:border-white hover:bg-white hover:text-ink`}
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
                  className="inline-flex size-[52px] shrink-0 items-center justify-center rounded-full border border-mist/25 text-mist transition-all duration-300 hover:border-white hover:bg-white hover:text-ink"
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

                {/* Réseaux — icônes seules (ronds blancs), sans titre :
                   au survol, chaque réseau prend sa couleur officielle */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.44, duration: 0.5, ease }}
                  className="mt-12 border-t border-mist/10 pt-7"
                >
                  <div className="flex items-center gap-2.5">
                    {socialList.map(({ name, href, Icon, hover, internal }) => (
                      <a
                        key={name}
                        href={href}
                        target={internal ? undefined : "_blank"}
                        rel={internal ? undefined : "noopener noreferrer"}
                        aria-label={name}
                        title={name}
                        className={`inline-flex size-11 items-center justify-center rounded-full bg-white text-ink transition-all duration-300 ${hover}`}
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
