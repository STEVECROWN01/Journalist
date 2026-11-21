import { db } from "@/lib/db";
import { demoProductions } from "@/content/demo";
import { hashPassword } from "@/lib/auth";

/**
 * Amorçage de la base : compte administrateur, paramètres du site et
 * catalogue des productions. Les publications sont créées depuis le
 * back-office — aucun article fictif n'est amorcé.
 * Identifiants administrateur définis par ADMIN_EMAIL / ADMIN_PASSWORD.
 */
async function main() {
  console.log("→ Amorçage de la base…");

  /* Compte administrateur */
  const email = process.env.ADMIN_EMAIL ?? "admin@alexandre-morel.example";
  const password = process.env.ADMIN_PASSWORD ?? "Demo-2026!";
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
        baseCity: "Paris",
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
