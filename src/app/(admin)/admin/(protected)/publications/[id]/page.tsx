import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicationForm } from "@/components/admin/publication-form";

export const metadata = { title: "Modifier la publication" };
export const dynamic = "force-dynamic";

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publication = await db.publication
    .findUnique({ where: { id } })
    .catch(() => null);

  if (!publication) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[2rem] text-white">Modifier la publication</h1>
      <p className="mt-1 text-[0.9rem] text-steel">{publication.titleFr}</p>
      <div className="mt-10">
        <PublicationForm
          data={{
            id: publication.id,
            slug: publication.slug,
            titleFr: publication.titleFr,
            titleEn: publication.titleEn,
            excerptFr: publication.excerptFr,
            excerptEn: publication.excerptEn,
            contentFr: publication.contentFr,
            contentEn: publication.contentEn,
            category: publication.category,
            coverImage: publication.coverImage,
            status: publication.status,
            publishedAt: publication.publishedAt?.toISOString(),
          }}
        />
      </div>
    </div>
  );
}
