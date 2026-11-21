"use server";

import { db } from "@/lib/db";
import { CONTACT_SUBJECTS, type ContactSubject } from "@/lib/site";
import { headers } from "next/headers";

export type ContactState = {
  status: "idle" | "success" | "error";
  code?: string;
};

/* ---------------- Validation (serveur, sans compromis) ---------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Neutralise les caractères de contrôle et normalise les espaces. */
function clean(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

interface ValidatedContact {
  name: string;
  organization: string | null;
  email: string;
  subject: ContactSubject;
  message: string;
  locale: string;
}

function validate(data: Record<string, unknown>): { ok: true; value: ValidatedContact } | { ok: false; code: string } {
  const name = clean(String(data.name ?? ""));
  const organization = clean(String(data.organization ?? ""));
  const email = clean(String(data.email ?? "")).toLowerCase();
  const subject = String(data.subject ?? "");
  const message = clean(String(data.message ?? "")).replace(/\n{3,}/g, "\n\n");
  const locale = String(data.locale ?? "fr") === "en" ? "en" : "fr";
  const honeypot = String(data.website ?? "");

  if (honeypot.length > 0) return { ok: false, code: "generic" }; // robot
  if (name.length < 2 || name.length > 120) return { ok: false, code: "nameRequired" };
  if (email.length === 0) return { ok: false, code: "emailRequired" };
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, code: "emailInvalid" };
  if (!CONTACT_SUBJECTS.includes(subject as ContactSubject))
    return { ok: false, code: "subjectRequired" };
  if (message.length < 10) return { ok: false, code: "messageTooShort" };
  if (message.length > 5000) return { ok: false, code: "generic" };

  return {
    ok: true,
    value: {
      name,
      organization: organization.length > 0 ? organization.slice(0, 160) : null,
      email,
      subject: subject as ContactSubject,
      message,
      locale,
    },
  };
}

/* ---------------- Limitation de débit (5 messages / heure / IP) ---------------- */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const rateMap = new Map<string, { count: number; reset: number }>();

async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim();
  return ip || "unknown";
}

function checkRate(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || entry.reset < now) {
    rateMap.set(key, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

/* ---------------- Action principale ---------------- */

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const result = validate(raw);
  if (!result.ok) return { status: "error", code: result.code };

  const key = await clientKey();
  if (!checkRate(key)) return { status: "error", code: "tooMany" };

  try {
    await db.contactMessage.create({
      data: {
        name: result.value.name,
        organization: result.value.organization,
        email: result.value.email,
        subject: result.value.subject,
        message: result.value.message,
        locale: result.value.locale,
      },
    });
    return { status: "success" };
  } catch {
    return { status: "error", code: "dbUnavailable" };
  }
}
