import { db } from "@/lib/db";
import { demoProductions } from "@/content/demo";
import { hashPassword, verifyPassword } from "@/lib/auth";

/**
 * Amorçage de la base : compte administrateur, paramètres du site et
 * catalogue des productions. Les publications sont créées depuis le
 * back-office — aucun article fictif n'est amorcé.
 * Identifiants administrateur définis par ADMIN_EMAIL / ADMIN_PASSWORD.
 */

/**
 * Retire les guillemets et espaces parasites autour d'une variable collée
 * depuis un fichier .env : les guillemets font partie de la syntaxe .env,
 * pas de la valeur. Collés tels quels dans le tableau de bord Vercel, ils
 * seraient pris littéralement pour des caractères du mot de passe.
 */
function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return value;
  const v = value.trim();
  if (
    v.length >= 2 &&
    ((v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'")))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

async function main() {
  console.log("→ Amorçage de la base…");

  /* Compte administrateur */
  const email = cleanEnv(process.env.ADMIN_EMAIL) ?? "admin@alexandre-morel.example";
  const password = cleanEnv(process.env.ADMIN_PASSWORD) ?? "Demo-2026!";
  if (process.env.VERCEL && !process.env.ADMIN_PASSWORD) {
    console.warn(
      "  ⚠ ADMIN_PASSWORD absente des variables d'environnement Vercel — " +
        "le mot de passe de démonstration est utilisé. Définissez-la dans les réglages du projet."
    );
  }
  const existingAdmin = await db.adminUser.findUnique({ where: { email } });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email,
        name: "Alexandre Morel",
        passwordHash: hashPassword(password),
      },
    });
    console.log(`  ✓ Administrateur créé : ${email}`);
  } else if (!verifyPassword(password, existingAdmin.passwordHash)) {
    // Le mot de passe défini dans l'environnement a changé : on resynchronise
    // le compte (les variables d'environnement restent la source de vérité).
    await db.adminUser.update({
      where: { email },
      data: { passwordHash: hashPassword(password) },
    });
    console.log(`  ✓ Mot de passe administrateur resynchronisé : ${email}`);
  } else {
    console.log("  • Administrateur déjà présent");
  }

  /* Paramètres du site */
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  if (!settings) {
    await db.siteSettings.create({
      data: {
        id: "main",
        ownerName: "Alexandre Morel",
        baseCity: "Paris, France",
        email: "contact@alexandre-morel.example",
        phone: "+33 (0)1 00 00 00 00",
        linkedin: "https://www.linkedin.com/in/alexandre-morel",
        twitter: "https://x.com/alexandre_morel",
        vimeo: "https://vimeo.com/alexandremorel",
      },
    });
    console.log("  ✓ Paramètres du site créés");
  } else {
    console.log("  • Paramètres déjà présents");
  }

  /* Productions de démonstration */
  for (const p of demoProductions) {
    const existing = await db.production.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await db.production.create({
        data: {
          slug: p.slug,
          titleFr: p.titleFr,
          titleEn: p.titleEn,
          category: p.category,
          year: p.year,
          territoryFr: p.territoryFr,
          territoryEn: p.territoryEn,
          roleFr: p.roleFr,
          roleEn: p.roleEn,
          contextFr: p.contextFr,
          contextEn: p.contextEn,
          descriptionFr: p.descriptionFr,
          descriptionEn: p.descriptionEn,
          coverImage: p.coverImage,
          videoUrl: p.videoUrl,
          order: p.order,
          status: "published",
        },
      });
      console.log(`  ✓ Production : ${p.slug}`);
    }
  }

  console.log("→ Amorçage terminé.");
}

main()
  .catch((e) => {
    console.error("Erreur d'amorçage :", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
