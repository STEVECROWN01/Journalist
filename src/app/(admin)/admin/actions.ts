"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  getSessionUserId,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import {
  isPublicationCategory,
  PRODUCTION_CATEGORIES,
} from "@/lib/site";
import { isValidMedia } from "@/lib/media";

/* ============================ Utilitaires ============================ */

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/** Exige une session administrateur, sinon interrompt l'action. */
async function requireAdmin(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/admin/login");
  return userId;
}

function clean(value: FormDataEntryValue | null, max = 5000): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(
  base: string,
  model: "publication" | "production",
  excludeId?: string
): Promise<string> {
  let slug = base || "sans-titre";
  let suffix = 2;
  while (true) {
    const existing =
      model === "publication"
        ? await db.publication.findUnique({ where: { slug } })
        : await db.production.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${suffix++}`;
  }
}

function refreshSite() {
  // Revalide l'ensemble des pages publiques (statiques) dans les deux langues
  revalidatePath("/", "layout");
}

/* ============================ Authentification ============================ */

const loginAttempts = new Map<string, { count: number; reset: number }>();

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = clean(formData.get("email"), 200).toLowerCase();
  const password = String(formData.get("password") ?? "");

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && entry.reset > now && entry.count >= 6) {
    return {
      status: "error",
      message: "Trop de tentatives. Réessayez dans quelques minutes.",
    };
  }

  if (!email || !password) {
    return { status: "error", message: "Identifiants incomplets." };
  }

  const user = await db.adminUser.findUnique({ where: { email } }).catch(() => null);
  const ok = user ? verifyPassword(password, user.passwordHash) : false;

  if (!user || !ok) {
    if (!entry || entry.reset < now)
      loginAttempts.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    else entry.count += 1;
    return {
      status: "error",
      message: user === null && email
        ? "Service momentanément indisponible. Réessayez ultérieurement."
        : "E-mail ou mot de passe incorrect.",
    };
  }

  loginAttempts.delete(ip);
  await setSessionCookie(user.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ============================ Publications ============================ */

export async function savePublication(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = clean(formData.get("id"), 40);
  const titleFr = clean(formData.get("titleFr"), 200);
  const titleEn = clean(formData.get("titleEn"), 200);
  const excerptFr = clean(formData.get("excerptFr"), 600);
  const excerptEn = clean(formData.get("excerptEn"), 600);
  const contentFr = clean(formData.get("contentFr"), 40000);
  const contentEn = clean(formData.get("contentEn"), 40000);
  const category = clean(formData.get("category"), 40);
  const cover = clean(formData.get("coverImage"), 300);
  const status = formData.get("status") === "published" ? "published" : "draft";
  const publishedAtRaw = clean(formData.get("publishedAt"), 30);
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();

  if (!titleFr || !contentFr) {
    return {
      status: "error",
      message: "Le titre et le contenu français sont obligatoires.",
    };
  }
  if (!isPublicationCategory(category)) {
    return {
      status: "error",
      message: `Catégorie invalide (analyses, reportages ou décryptages).`,
    };
  }

  /* La version anglaise n'est enregistrée que si elle est rédigée :
     sans elle, l'article reste visible uniquement sur le site français. */
  const enComplete = !!(titleEn && contentEn);

  const slugBase = clean(formData.get("slug"), 90) || slugify(titleFr);

  try {
    const slug = await uniqueSlug(slugBase, "publication", id || undefined);
    const data = {
      slug,
      titleFr,
      titleEn: enComplete ? titleEn : null,
      excerptFr,
      excerptEn: excerptEn || null,
      contentFr,
      contentEn: enComplete ? contentEn : null,
      category,
      coverImage: isValidMedia(cover) ? cover : null,
      status,
      publishedAt,
    };

    if (id) {
      await db.publication.update({ where: { id }, data });
    } else {
      await db.publication.create({ data });
    }
  } catch {
    return {
      status: "error",
      message:
        "Enregistrement impossible. Vérifiez la connexion à la base de données et l'unicité du slug.",
    };
  }

  refreshSite();
  redirect("/admin/publications?ok=1");
}

export async function deletePublication(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = clean(formData.get("id"), 40);
  if (id) {
    await db.publication.delete({ where: { id } }).catch(() => undefined);
  }
  refreshSite();
  redirect("/admin/publications?deleted=1");
}

export async function togglePublicationStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = clean(formData.get("id"), 40);
  if (!id) redirect("/admin/publications");
  try {
    const pub = await db.publication.findUnique({ where: { id } });
    if (pub) {
      await db.publication.update({
        where: { id },
        data: {
          status: pub.status === "published" ? "draft" : "published",
          publishedAt: pub.publishedAt ?? new Date(),
        },
      });
    }
  } catch {
    // base indisponible : aucune modification
  }
  refreshSite();
  redirect("/admin/publications");
}

/* ============================ Productions ============================ */

export async function saveProduction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = clean(formData.get("id"), 40);
  const titleFr = clean(formData.get("titleFr"), 200);
  const titleEn = clean(formData.get("titleEn"), 200);
  const category = clean(formData.get("category"), 40);
  const year = Math.min(
    2100,
    Math.max(1990, parseInt(clean(formData.get("year"), 6) || "2025", 10))
  );
  const territoryFr = clean(formData.get("territoryFr"), 120);
  const territoryEn = clean(formData.get("territoryEn"), 120);
  const roleFr = clean(formData.get("roleFr"), 160);
  const roleEn = clean(formData.get("roleEn"), 160);
  const contextFr = clean(formData.get("contextFr"), 1000);
  const contextEn = clean(formData.get("contextEn"), 1000);
  const descriptionFr = clean(formData.get("descriptionFr"), 6000);
  const descriptionEn = clean(formData.get("descriptionEn"), 6000);
  const cover = clean(formData.get("coverImage"), 300);
  const videoUrl = clean(formData.get("videoUrl"), 300);
  const order = parseInt(clean(formData.get("order"), 5) || "99", 10);
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (!titleFr || !descriptionFr) {
    return {
      status: "error",
      message: "Le titre et la présentation française sont obligatoires.",
    };
  }
  if (!PRODUCTION_CATEGORIES.includes(category as never)) {
    return { status: "error", message: "Catégorie invalide." };
  }

  const slugBase = clean(formData.get("slug"), 90) || slugify(titleFr);
  const slug = await uniqueSlug(slugBase, "production", id || undefined);

  const data = {
    slug,
    titleFr,
    titleEn: titleEn || titleFr,
    category,
    year,
    territoryFr: territoryFr || "—",
    territoryEn: territoryEn || "—",
    roleFr: roleFr || "—",
    roleEn: roleEn || "—",
    contextFr,
    contextEn,
    descriptionFr,
    descriptionEn: descriptionEn || descriptionFr,
    coverImage: isValidMedia(cover) ? cover : null,
    videoUrl: videoUrl.startsWith("http") ? videoUrl : null,
    order: Number.isFinite(order) ? order : 99,
    status,
  };

  try {
    if (id) {
      await db.production.update({ where: { id }, data });
    } else {
      await db.production.create({ data });
    }
  } catch {
    return { status: "error", message: "Enregistrement impossible (slug déjà utilisé ?)." };
  }

  refreshSite();
  redirect("/admin/productions?ok=1");
}

export async function deleteProduction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = clean(formData.get("id"), 40);
  if (id) {
    await db.production.delete({ where: { id } }).catch(() => undefined);
  }
  refreshSite();
  redirect("/admin/productions?deleted=1");
}

export async function toggleProductionStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = clean(formData.get("id"), 40);
  if (!id) redirect("/admin/productions");
  const prod = await db.production.findUnique({ where: { id } });
  if (prod) {
    await db.production.update({
      where: { id },
      data: { status: prod.status === "published" ? "draft" : "published" },
    });
  }
  refreshSite();
  redirect("/admin/productions");
}

/* ============================ Messages ============================ */

export async function toggleMessageRead(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = clean(formData.get("id"), 40);
  if (id) {
    const msg = await db.contactMessage.findUnique({ where: { id } });
    if (msg) {
      await db.contactMessage.update({
        where: { id },
        data: { read: !msg.read },
      });
    }
  }
  redirect("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = clean(formData.get("id"), 40);
  if (id) {
    await db.contactMessage.delete({ where: { id } }).catch(() => undefined);
  }
  redirect("/admin/messages");
}

/* ============================ Paramètres ============================ */

export async function saveSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const ownerName = clean(formData.get("ownerName"), 120) || "Alexandre Morel";
  const baseCity = clean(formData.get("baseCity"), 80) || "Paris";
  const email = clean(formData.get("email"), 200);
  const phone = clean(formData.get("phone"), 60);
  const linkedin = clean(formData.get("linkedin"), 300);
  const twitter = clean(formData.get("twitter"), 300);
  const vimeo = clean(formData.get("vimeo"), 300);

  if (!email.includes("@")) {
    return { status: "error", message: "Adresse e-mail invalide." };
  }

  await db.siteSettings.upsert({
    where: { id: "main" },
    update: { ownerName, baseCity, email, phone, linkedin, twitter, vimeo },
    create: { id: "main", ownerName, baseCity, email, phone, linkedin, twitter, vimeo },
  });

  refreshSite();
  return { status: "success", message: "Paramètres enregistrés." };
}
