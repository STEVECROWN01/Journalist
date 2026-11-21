import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Linkedin, Twitter, Video, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { getSettings } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const settings = await getSettings();

  const socials = [
    { name: t("socials.linkedin"), href: settings.linkedin, Icon: Linkedin },
    { name: t("socials.twitter"), href: settings.twitter, Icon: Twitter },
    { name: t("socials.vimeo"), href: settings.vimeo, Icon: Video },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        paragraphs={[t("hero.p1"), t("hero.p2"), t("hero.p3")]}
        image="/assets/portrait-studio-professionnel.jpg"
        imageAlt={
          locale === "fr"
            ? "Alexandre Morel en studio, portrait professionnel"
            : "Alexandre Morel in his studio, professional portrait"
        }
        ctaLabel={t("hero.cta")}
        ctaHref="#sec-form"
      />

      {/* Formulaire + coordonnées */}
      <section
        id="sec-form"
        aria-labelledby="sec-form-title"
        className="scroll-mt-24 border-t border-mist/10 bg-surface/40"
      >
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:py-28 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow">{t("form.eyebrow")}</p>
              <h2 id="sec-form-title" className="display-2 mt-5 max-w-xl text-balance text-white">
                {t("form.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <ContactForm />
            </Reveal>
          </div>

          <aside className="space-y-10 lg:pt-24">
            <Reveal>
              <div className="rounded-lg border border-mist/10 bg-ink p-7">
                <h3 className="font-serif text-[1.3rem] text-white">
                  {t("details.title")}
                </h3>
                <ul className="mt-5 space-y-4 text-[0.92rem]">
                  <li className="flex items-start gap-3">
                    <Mail size={15} className="mt-1 shrink-0 text-or" aria-hidden="true" />
                    <a href={`mailto:${settings.email}`} className="link-editorial break-all">
                      {settings.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={15} className="mt-1 shrink-0 text-or" aria-hidden="true" />
                    <a
                      href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                      className="link-editorial"
                    >
                      {settings.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={15} className="mt-1 shrink-0 text-or" aria-hidden="true" />
                    <span className="text-silver">{settings.baseCity}</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-lg border border-mist/10 bg-ink p-7">
                <h3 className="font-serif text-[1.3rem] text-white">
                  {t("socials.title")}
                </h3>
                <ul className="mt-5 space-y-3">
                  {socials.map(({ name, href, Icon }) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-lg border border-mist/10 px-4 py-3 text-[0.9rem] text-silver transition-colors hover:border-mist/30 hover:text-white"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={15} className="text-or" aria-hidden="true" />
                          {name}
                        </span>
                        <ExternalLink
                          size={13}
                          className="text-graphite transition-colors group-hover:text-silver"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Clôture : e-mail direct */}
      <section className="border-t border-mist/10 bg-ink-deep">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-24">
          <Reveal>
            <p className="eyebrow justify-center">{t("direct.eyebrow")}</p>
            <h2 className="display-3 mx-auto mt-6 max-w-xl text-balance text-white">
              {t("direct.title")}
            </h2>
            <a
              href={`mailto:${settings.email}`}
              className="link-editorial mt-8 inline-flex font-serif text-[1.5rem] text-white md:text-[1.8rem]"
            >
              {settings.email}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
