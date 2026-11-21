"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X, ArrowUpRight, Linkedin, Twitter, Video } from "lucide-react";
import {
  stopSmoothScroll,
  startSmoothScroll,
} from "./smooth-scroll";
import { DemoBadge } from "./demo-badge";
import type { HeaderSocial } from "./site-header";

const SERVICES = [
  { key: "journalism", href: "/journalisme" },
  { key: "productions", href: "/productions" },
  { key: "publications", href: "/publications" },
  { key: "comms", href: "/communication-conseil" },
  { key: "training", href: "/formation" },
] as const;

const OTHER_LINKS = [
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

interface FullscreenMenuProps {
  open: boolean;
  onClose: () => void;
  social: HeaderSocial;
}

/** Menu de navigation plein écran : Services à gauche, autres liens à droite. */
export function FullscreenMenu({ open, onClose, social }: FullscreenMenuProps) {
  const t = useTranslations("common");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Fige le défilement pendant l'ouverture + focus */
  useEffect(() => {
    if (open) {
      stopSmoothScroll();
      document.body.style.overflow = "hidden";
      const focusTimer = window.setTimeout(
        () => closeRef.current?.focus(),
        80
      );
      return () => {
        window.clearTimeout(focusTimer);
        startSmoothScroll();
        document.body.style.overflow = "";
      };
    }
    startSmoothScroll();
    document.body.style.overflow = "";
  }, [open]);

  /* Échap pour fermer + piège de focus clavier */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Rend le focus au bouton hamburger à la fermeture */
  const handleClose = () => {
    onClose();
    document
      .querySelector<HTMLButtonElement>('[aria-controls="menu-plein-ecran"]')
      ?.focus();
  };

  const socials = [
    { href: social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: social.twitter, label: "X (Twitter)", Icon: Twitter },
    { href: social.vimeo, label: "Vimeo", Icon: Video },
  ];

  const year = new Date().getFullYear();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="menu-plein-ecran"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu.dialog")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink-deep"
          data-lenis-prevent
        >
          {/* Halo discret en haut du panneau */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(234,56,76,0.07),transparent_70%)]"
            aria-hidden="true"
          />

          {/* Barre haute : wordmark + fermer */}
          <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7">
            <Link
              href="/"
              onClick={handleClose}
              className="font-serif text-[1.3rem] leading-none tracking-tight text-white transition-opacity hover:opacity-80"
            >
              Alexandre&nbsp;Morel<span className="text-rouge">.</span>
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              aria-label={t("menu.close")}
              className="flex size-14 items-center justify-center rounded-full border border-mist/15 bg-surface text-mist transition-all duration-300 hover:rotate-90 hover:border-mist/40 hover:text-white"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Colonnes */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-center gap-x-24 gap-y-14 px-6 py-16 lg:grid-cols-[1.5fr_1fr] lg:py-10"
          >
            {/* Services */}
            <nav aria-label={t("menu.services")}>
              <motion.p variants={item} className="eyebrow">
                {t("menu.services")}
              </motion.p>
              <ul className="mt-7">
                {SERVICES.map((s, i) => (
                  <motion.li key={s.key} variants={item}>
                    <Link
                      href={s.href}
                      onClick={handleClose}
                      className="group inline-flex items-baseline gap-4 py-2 font-serif text-[clamp(1.7rem,4.2vh,2.6rem)] leading-[1.12] text-white transition-colors duration-300 hover:text-sand"
                    >
                      <span
                        className="font-sans text-[0.8rem] font-medium italic tracking-wider text-steel transition-colors duration-300 group-hover:text-rouge"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t(`nav.${s.key}`)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Autres liens */}
            <div>
              <motion.p variants={item} className="eyebrow">
                {t("menu.otherLinks")}
              </motion.p>
              <ul className="mt-7 space-y-5">
                {OTHER_LINKS.map((l) => (
                  <motion.li key={l.key} variants={item}>
                    <Link
                      href={l.href}
                      onClick={handleClose}
                      className="group inline-flex items-center gap-2.5 text-[1.08rem] text-silver transition-colors duration-300 hover:text-white"
                    >
                      {t(`nav.${l.key}`)}
                      <ArrowUpRight
                        size={15}
                        className="text-graphite transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rouge"
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Réseaux sociaux */}
              <motion.div
                variants={item}
                className="mt-12 flex items-center gap-3"
              >
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full bg-mist text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-sand"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Bas de panneau */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="relative mt-auto border-t border-mist/10"
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
              <p className="meta">
                © {year} Alexandre Morel — Paris
              </p>
              <DemoBadge />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
