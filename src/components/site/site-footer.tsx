import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Linkedin, Twitter, Video, MapPin } from "lucide-react";
import { getSettings } from "@/lib/content";

/** Pied de page éditorial, noir profond : identité, navigation, contact. */
export async function SiteFooter() {
  const t = await getTranslations("common");
  const settings = await getSettings();
  const year = new Date().getFullYear();

  /* Navigation : Journalisme · Documentaire · Publication · Production ·
     À propos · Contact */
  const navLinks = [
    { key: "journalismShort", href: "/journalisme" },
    { key: "documentary", href: "/documentaire" },
    { key: "publications", href: "/publications" },
    { key: "productions", href: "/productions" },
    { key: "about", href: "/a-propos" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <footer className="border-t border-mist/10 bg-ink-deep">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr]">
          {/* Identité */}
          <div>
            <p className="font-serif text-[1.5rem] text-white">
              Alexandre&nbsp;Morel<span className="text-rouge">.</span>
            </p>
            <p className="mt-4 max-w-sm font-serif text-[1.02rem] leading-snug text-mist">
              {t("footer.baseline")}
            </p>
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-steel">
              {t("footer.tagline")}
            </p>
            <Link href="/contact" className="btn-accent mt-7">
              {t("cta.header")}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Navigation */}
          <nav aria-label={t("footer.navigate")}>
            <p className="meta">{t("footer.navigate")}</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    className="link-editorial text-[0.92rem]"
                  >
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="meta">{t("footer.contactTitle")}</p>
            <ul className="mt-5 space-y-3 text-[0.92rem] text-steel">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="link-editorial break-all"
                >
                  {settings.email}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="link-editorial">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-steel" aria-hidden="true" />
                {settings.baseCity}
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-10 items-center justify-center rounded-full border border-mist/15 text-silver transition-colors hover:border-mist/40 hover:text-white"
              >
                <Linkedin size={16} aria-hidden="true" />
              </a>
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex size-10 items-center justify-center rounded-full border border-mist/15 text-silver transition-colors hover:border-mist/40 hover:text-white"
              >
                <Twitter size={16} aria-hidden="true" />
              </a>
              <a
                href={settings.vimeo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vimeo"
                className="flex size-10 items-center justify-center rounded-full border border-mist/15 text-silver transition-colors hover:border-mist/40 hover:text-white"
              >
                <Video size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="mt-14 flex flex-col gap-3 border-t border-mist/8 pt-7 text-[0.78rem] text-graphite md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.ownerName} — {t("footer.rights")}
          </p>
          <a
            href="/admin"
            className="uppercase tracking-[0.12em] text-steel transition-colors hover:text-silver"
          >
            {t("footer.ownerSpace")}
          </a>
        </div>
      </div>
    </footer>
  );
}
