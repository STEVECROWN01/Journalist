import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

/** URLs localisées — françaises par défaut, équivalentes en anglais */
export const pathnames = {
  "/": "/",
  "/a-propos": { fr: "/a-propos", en: "/about" },
  "/journalisme": { fr: "/journalisme", en: "/journalism" },
  "/productions": { fr: "/productions", en: "/productions" },
  "/publications": { fr: "/publications", en: "/publications" },
  "/communication-conseil": {
    fr: "/communication-conseil",
    en: "/communications-consulting",
  },
  "/formation": { fr: "/formation", en: "/training" },
  "/contact": { fr: "/contact", en: "/contact" },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always",
  pathnames,
});

export type Pathnames = keyof typeof pathnames;
