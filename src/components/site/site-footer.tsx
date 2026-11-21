import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Video,
} from "lucide-react";
import { getSettings } from "@/lib/content";
import { Reveal } from "./reveal";

/**
 * Pied de page — présentation calquée sur le site de référence :
 * identité + réseaux à gauche, deux colonnes de navigation à droite,
 * filet dégradé centré, barre inférieure © + lien. Noir profond.
 */
export async function SiteFooter() {
  const t = await getTranslations("common");
  const settings = await getSettings();
  const year = new Date().getFullYear();

  /* Colonne « Expertises » : les quatre domaines d'intervention */
  const expertiseLinks = [
    { key: "journalism", href: "/journalisme" },
    { key: "documentary", href: "/documentaire" },
    { key: "comms", href: "/communication-conseil" },
    { key: "training", href: "/formation" },
  ] as const;

  /* Colonne « Professionnel » : rubrique éditoriale, productions, à propos, contact */
  const professionalLinks = [
    { key: "articlesAnalyses", href: "/publications" },
    { key: "productions", href: "/productions" },
    { key: "about", href: "/a-propos" },
    { key: "contact", href: "/contact" },
  ] as const;

  /* Réseaux — cercles blancs, couleur propre à chaque réseau au survol */
  const socials = [
    {
      key: "email",
      href: `mailto:${settings.email}`,
      label: "Email",
      Icon: Mail,
      hover: "hover:bg-ink hover:text-white",
    },
    {
      key: "linkedin",
      href: settings.linkedin,
      label: "LinkedIn",
      Icon: Linkedin,
      hover: "hover:bg-[#0A66C2] hover:text-white",
    },
    {
      key: "twitter",
      href: settings.twitter,
      label: "X (Twitter)",
      Icon: Twitter,
      hover: "hover:bg-black hover:text-white",
    },
    {
      key: "vimeo",
      href: settings.vimeo,
      label: "Vimeo",
      Icon: Video,
      hover: "hover:bg-[#1ab7ea] hover:text-white",
    },
  ];

  const iconClass =
    "flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 sm:h-9 sm:w-9";

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink-deep text-white">
      {/* Liseré lumineux supérieur, comme sur le site de référence */}
      <div
        aria-hidden="true"
        className="footer-glow pointer-events-none absolute inset-x-0 top-0 h-12 sm:h-14"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-2.5 pt-12 sm:pt-[50px]">
        <Reveal>
          <div className="grid gap-12 pb-10 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-4">
            {/* Identité : nom, réseaux, signature, contact */}
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <p className="font-serif text-[1.55rem] leading-none text-white">
                  Alexandre&nbsp;Morel<span className="text-or">.</span>
                </p>
                <div className="flex items-center gap-2.5 pb-2.5">
                  {socials.map(({ key, href, label, Icon, hover }) => (
                    <a
                      key={key}
                      href={href}
                      target={key === "email" ? undefined : "_blank"}
                      rel={key === "email" ? undefined : "noopener noreferrer"}
                      aria-label={label}
                      className={`${iconClass} ${hover}`}
                    >
                      <Icon
                        size={14}
                        aria-hidden="true"
                        className="sm:hidden"
                      />
                      <Icon
                        size={15}
                        aria-hidden="true"
                        className="hidden sm:block"
                      />
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-5 max-w-[294px] text-sm leading-relaxed text-silver">
                {t("footer.baseline")}
              </p>
              <p className="mt-3 max-w-[330px] text-[0.82rem] leading-relaxed text-steel">
                {t("footer.tagline")}
              </p>

              <ul className="mt-6 space-y-2 text-[0.85rem] text-steel">
                <li>
                  <a href={`mailto:${settings.email}`} className="footer-link break-all text-mist">
                    {settings.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                    className="footer-link text-mist"
                  >
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={13} className="shrink-0" aria-hidden="true" />
                  {settings.baseCity}
                </li>
              </ul>
            </div>

            {/* Deux colonnes de navigation, comme sur le site de référence */}
            <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:gap-20">
              <nav aria-label={t("footer.colExpertises")}>
                <p className="font-serif text-[1.3rem] font-semibold text-white sm:text-[1.75rem]">
                  {t("footer.colExpertises")}
                </p>
                <ul className="mt-6">
                  {expertiseLinks.map((l) => (
                    <li key={l.key} className="mb-1.5">
                      <Link
                        href={l.href}
                        className="footer-link text-[0.94rem] leading-6 text-white sm:text-[1.05rem]"
                      >
                        {t(`nav.${l.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label={t("footer.colProfessional")}>
                <p className="font-serif text-[1.3rem] font-semibold text-white sm:text-[1.75rem]">
                  {t("footer.colProfessional")}
                </p>
                <ul className="mt-6">
                  {professionalLinks.map((l) => (
                    <li key={l.key} className="mb-1.5">
                      <Link
                        href={l.href}
                        className="footer-link text-[0.94rem] leading-6 text-white sm:text-[1.05rem]"
                      >
                        {t(`nav.${l.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </Reveal>

        {/* Complément éditorial : publications + collaboration */}
        <Reveal>
          <div className="grid gap-10 border-t border-mist/10 py-10 sm:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-serif text-[1.3rem] font-semibold text-white sm:text-[1.75rem]">
                {t("footer.exploreTitle")}
              </p>
              <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-silver">
                {t("footer.exploreText")}
              </p>
              <Link
                href="/publications"
                className="footer-link mt-5 inline-flex items-center gap-2 text-[0.94rem] font-medium text-white sm:text-[1.05rem]"
              >
                <span className="text-or" aria-hidden="true">→</span>
                {t("nav.articlesAnalyses")}
              </Link>
            </div>
            <div>
              <p className="font-serif text-[1.3rem] font-semibold text-white sm:text-[1.75rem]">
                {t("footer.collabTitle")}
              </p>
              <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-silver">
                {t("footer.collabText")}
              </p>
              <Link
                href="/contact"
                className="btn-accent mt-5 !min-h-10 !px-5 !text-[0.72rem]"
              >
                {t("cta.header")}
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Filet dégradé qui s'estompe aux extrémités */}
        <div aria-hidden="true" className="footer-separator footer-separator-half" />

        {/* Barre inférieure : © + espace propriétaire */}
        <div className="flex items-center justify-between gap-3 py-4 text-[0.8rem] sm:text-[0.92rem]">
          <p className="whitespace-nowrap text-mist">
            © {year} {settings.ownerName} — {t("footer.rights")}
          </p>
          <a
            href="/admin"
            className="footer-link whitespace-nowrap uppercase tracking-[0.12em] text-white"
          >
            {t("footer.ownerSpace")}
          </a>
        </div>
      </div>
    </footer>
  );
}
