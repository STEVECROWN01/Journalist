import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { getSettings } from "@/lib/content";

/**
 * Mentions légales — page sobre et éditoriale : éditeur, hébergement,
 * publication, propriété intellectuelle, données personnelles (RGPD),
 * cookies et droit applicable. Les coordonnées proviennent des
 * paramètres du site (back-office).
 */

function LegalSection({
  id,
  eyebrow,
  title,
  children,
  alternate = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  alternate?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`border-t border-mist/10 ${alternate ? "bg-surface/40" : ""}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1fr_2.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <h2
              id={`${id}-title`}
              className="display-2 max-w-2xl text-balance text-white"
            >
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 max-w-2xl space-y-5 text-[0.98rem] leading-[1.85] text-silver/90">
              {children}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Ligne de définition (terme + valeur) alignée avec le style éditorial. */
function DefinitionRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1.5 py-3.5">
      <dt className="w-44 shrink-0 pt-0.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-steel">
        {term}
      </dt>
      <dd className="min-w-0 flex-1 text-[0.95rem] leading-relaxed text-white">
        {children}
      </dd>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.meta" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const settings = await getSettings();

  return (
    <>
      {/* En-tête sobre, sans image — page à caractère juridique */}
      <section className="border-b border-mist/10 bg-ink-deep">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-32 md:pb-20 md:pt-44">
          <Reveal>
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 className="display-1 mt-6 max-w-4xl text-balance text-white">
              {t("hero.title")}
            </h1>
            <p className="mt-8 max-w-2xl text-[1.05rem] leading-[1.8] text-mist/85">
              {t("hero.intro")}
            </p>
            <p className="mt-4 text-[0.85rem] text-silver/70">
              {t("hero.updated")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Éditeur du site */}
      <LegalSection
        id="editeur"
        eyebrow={t("publisher.eyebrow")}
        title={t("publisher.title")}
      >
        <p>{t("publisher.p1")}</p>
        <dl className="divide-y divide-mist/10 border-y border-mist/10">
          <DefinitionRow term={t("publisher.name")}>
            {settings.ownerName}
          </DefinitionRow>
          <DefinitionRow term={t("publisher.activity")}>
            {t("publisher.activityValue")}
          </DefinitionRow>
          <DefinitionRow term={t("publisher.email")}>
            <a
              href={`mailto:${settings.email}`}
              className="footer-link break-all text-mist"
            >
              {settings.email}
            </a>
          </DefinitionRow>
          <DefinitionRow term={t("publisher.phone")}>
            <a
              href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
              className="footer-link text-mist"
            >
              {settings.phone}
            </a>
          </DefinitionRow>
          <DefinitionRow term={t("publisher.city")}>
            {settings.baseCity}
          </DefinitionRow>
        </dl>
      </LegalSection>

      {/* Hébergement */}
      <LegalSection
        id="hebergement"
        eyebrow={t("host.eyebrow")}
        title={t("host.title")}
        alternate
      >
        <p>{t("host.p1")}</p>
        <dl className="divide-y divide-mist/10 border-y border-mist/10">
          <DefinitionRow term={t("host.hostName")}>
            {t("host.hostNameValue")}
          </DefinitionRow>
          <DefinitionRow term={t("host.hostSite")}>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-mist"
            >
              vercel.com
            </a>
          </DefinitionRow>
        </dl>
      </LegalSection>

      {/* Directeur de la publication */}
      <LegalSection
        id="publication"
        eyebrow={t("publication.eyebrow")}
        title={t("publication.title")}
      >
        <p>{t("publication.p1")}</p>
      </LegalSection>

      {/* Propriété intellectuelle */}
      <LegalSection
        id="propriete"
        eyebrow={t("ip.eyebrow")}
        title={t("ip.title")}
        alternate
      >
        <p>{t("ip.p1")}</p>
        <p>{t("ip.p2")}</p>
      </LegalSection>

      {/* Données personnelles */}
      <LegalSection
        id="donnees"
        eyebrow={t("privacy.eyebrow")}
        title={t("privacy.title")}
      >
        <p>{t("privacy.p1")}</p>
        <p>{t("privacy.p2")}</p>
        <p>{t("privacy.p3")}</p>
      </LegalSection>

      {/* Cookies */}
      <LegalSection
        id="cookies"
        eyebrow={t("cookies.eyebrow")}
        title={t("cookies.title")}
        alternate
      >
        <p>{t("cookies.p1")}</p>
        <p>{t("cookies.p2")}</p>
      </LegalSection>

      {/* Droit applicable */}
      <LegalSection
        id="droit"
        eyebrow={t("law.eyebrow")}
        title={t("law.title")}
      >
        <p>{t("law.p1")}</p>
      </LegalSection>
    </>
  );
}
