"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Loader2, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/(site)/[locale]/contact/actions";
import { CONTACT_SUBJECTS } from "@/lib/site";

const initial: ContactState = { status: "idle" };

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/** Formulaire de contact : validation client + action serveur sécurisée. */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const tReasons = useTranslations("contact.reasons");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitContact, initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef(false);

  /* Effacer les erreurs locales quand l'état serveur change */
  useEffect(() => {
    if (state.status === "success") {
      sentRef.current = true;
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  const clientValidate = (form: HTMLFormElement): boolean => {
    const fd = new FormData(form);
    const next: FieldErrors = {};
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const subject = String(fd.get("subject") ?? "");
    const message = String(fd.get("message") ?? "").trim();

    if (name.length < 2) next.name = t("errors.nameRequired");
    if (email.length === 0) next.email = t("errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = t("errors.emailInvalid");
    if (!subject) next.subject = t("errors.subjectRequired");
    if (message.length === 0) next.message = t("errors.messageRequired");
    else if (message.length < 10) next.message = t("errors.messageTooShort");

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* Succès */
  if (state.status === "success") {
    return (
      <div
        className="rounded-lg border border-vert/30 bg-vert/5 p-10 text-center"
        role="status"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-vert/15">
          <Check size={24} className="text-vert" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-serif text-[1.5rem] text-white">
          {t("successTitle")}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-silver">
          {t("successText")}
        </p>
        <p className="mt-3 text-[0.8rem] text-steel">{t("successDemo")}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-outline mt-8"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!clientValidate(e.currentTarget)) e.preventDefault();
      }}
      className="space-y-6"
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />
      {/* Pot de miel anti-robot — invisible pour les humains */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-[0.85rem] font-medium text-mist">
            {t("name")} <span className="text-rouge" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={`h-12 w-full rounded-lg border bg-surface/60 px-4 text-[0.95rem] text-white placeholder:text-graphite focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-rouge focus:ring-rouge/40"
                : "border-mist/20 focus:border-mist/50 focus:ring-rouge/30"
            }`}
          />
          {errors.name ? (
            <p id="err-name" className="mt-2 text-[0.8rem] text-rouge">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-org" className="mb-2 block text-[0.85rem] font-medium text-mist">
            {t("organization")}
          </label>
          <input
            id="contact-org"
            name="organization"
            type="text"
            autoComplete="organization"
            placeholder={t("organizationPlaceholder")}
            className="h-12 w-full rounded-lg border border-mist/20 bg-surface/60 px-4 text-[0.95rem] text-white placeholder:text-graphite focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-rouge/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block text-[0.85rem] font-medium text-mist">
          {t("email")} <span className="text-rouge" aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          className={`h-12 w-full rounded-lg border bg-surface/60 px-4 text-[0.95rem] text-white placeholder:text-graphite focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-rouge focus:ring-rouge/40"
              : "border-mist/20 focus:border-mist/50 focus:ring-rouge/30"
          }`}
        />
        {errors.email ? (
          <p id="err-email" className="mt-2 text-[0.8rem] text-rouge">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-[0.85rem] font-medium text-mist">
          {t("subject")} <span className="text-rouge" aria-hidden="true">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue=""
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "err-subject" : undefined}
          className={`h-12 w-full appearance-none rounded-lg border bg-surface/60 px-4 text-[0.95rem] text-white focus:outline-none focus:ring-2 ${
            errors.subject
              ? "border-rouge focus:ring-rouge/40"
              : "border-mist/20 focus:border-mist/50 focus:ring-rouge/30"
          }`}
        >
          <option value="" disabled>
            {t("subjectPlaceholder")}
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s} className="bg-surface">
              {tReasons(`items.${s}.title`)}
            </option>
          ))}
        </select>
        {errors.subject ? (
          <p id="err-subject" className="mt-2 text-[0.8rem] text-rouge">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-[0.85rem] font-medium text-mist">
          {t("message")} <span className="text-rouge" aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder={t("messagePlaceholder")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className={`w-full resize-y rounded-lg border bg-surface/60 px-4 py-3 text-[0.95rem] leading-relaxed text-white placeholder:text-graphite focus:outline-none focus:ring-2 ${
            errors.message
              ? "border-rouge focus:ring-rouge/40"
              : "border-mist/20 focus:border-mist/50 focus:ring-rouge/30"
          }`}
        />
        {errors.message ? (
          <p id="err-message" className="mt-2 text-[0.8rem] text-rouge">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Erreur serveur */}
      {state.status === "error" ? (
        <p className="rounded-lg border border-rouge/40 bg-rouge/10 px-4 py-3 text-[0.88rem] text-mist" role="alert">
          {t(`errors.${state.code ?? "generic"}`)}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.75rem] leading-relaxed text-graphite">
          <span className="text-rouge" aria-hidden="true">*</span>{" "}
          {locale === "fr" ? "Champs obligatoires" : "Required fields"}
        </p>
        <button type="submit" disabled={pending} className="btn-accent">
          {pending ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              {t("sending")}
            </>
          ) : (
            <>
              <Send size={14} aria-hidden="true" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
