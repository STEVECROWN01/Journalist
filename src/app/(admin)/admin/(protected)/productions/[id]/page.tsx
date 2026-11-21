import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductionForm } from "@/components/admin/production-form";

export const metadata = { title: "Modifier la production" };
export const dynamic = "force-dynamic";

export default async function EditProductionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const production = await db.production
    .findUnique({ where: { id } })
    .catch(() => null);

  if (!production) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[2rem] text-white">Modifier la production</h1>
      <p className="mt-1 text-[0.9rem] text-steel">{production.titleFr}</p>
      <div className="mt-10">
        <ProductionForm
          data={{
            id: production.id,
            slug: production.slug,
            titleFr: production.titleFr,
            titleEn: production.titleEn,
            category: production.category,
            year: production.year,
            territoryFr: production.territoryFr,
            territoryEn: production.territoryEn,
            roleFr: production.roleFr,
            roleEn: production.roleEn,
            contextFr: production.contextFr,
            contextEn: production.contextEn,
            descriptionFr: production.descriptionFr,
            descriptionEn: production.descriptionEn,
            coverImage: production.coverImage,
            videoUrl: production.videoUrl,
            order: production.order,
            status: production.status,
          }}
        />
      </div>
    </div>
  );
}
