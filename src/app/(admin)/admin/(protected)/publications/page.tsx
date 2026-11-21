import Link from "next/link";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { db } from "@/lib/db";
import {
  deletePublication,
  togglePublicationStatus,
} from "@/app/(admin)/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export const metadata = { title: "Publications" };
export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  let publications: Awaited<ReturnType<typeof db.publication.findMany>> = [];
  try {
    publications = await db.publication.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
  } catch {
    // base indisponible
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] text-white">Publications</h1>
          <p className="mt-1 text-[0.9rem] text-steel">
            {publications.length} publication{publications.length > 1 ? "s" : ""} —
            articles et analyses bilingues.
          </p>
        </div>
        <Link href="/admin/publications/new" className="btn-accent !min-h-10 !px-4 !text-[0.72rem]">
          <Plus size={14} aria-hidden="true" />
          Nouvelle publication
        </Link>
      </div>

      {sp.ok ? (
        <p className="mt-6 rounded-lg border border-vert/30 bg-vert/10 px-4 py-3 text-[0.88rem] text-mist">
          Publication enregistrée avec succès.
        </p>
      ) : null}
      {sp.deleted ? (
        <p className="mt-6 rounded-lg border border-or/30 bg-or/10 px-4 py-3 text-[0.88rem] text-mist">
          Publication supprimée.
        </p>
      ) : null}

      {publications.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-mist/15 p-10 text-center text-steel">
          Aucune publication pour le moment.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-mist/10">
          <table className="w-full min-w-[760px] text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-mist/10 bg-surface text-[0.72rem] uppercase tracking-[0.12em] text-steel">
                <th className="px-5 py-4 font-medium">Titre</th>
                <th className="px-5 py-4 font-medium">Catégorie</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Statut</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/8">
              {publications.map((p) => (
                <tr key={p.id} className="bg-ink/40 hover:bg-surface/60">
                  <td className="max-w-[280px] px-5 py-4">
                    <Link
                      href={`/admin/publications/${p.id}`}
                      className="flex items-center gap-2 truncate text-white hover:text-mist"
                    >
                      {p.featured ? (
                        <Star size={13} className="shrink-0 fill-sand text-sand" aria-label="À la une" />
                      ) : null}
                      <span className="truncate">{p.titleFr}</span>
                    </Link>
                    <span className="mt-0.5 block truncate text-[0.75rem] text-graphite">
                      /{p.slug}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-silver">{p.categoryFr}</td>
                  <td className="px-5 py-4 text-steel">
                    {new Date(p.publishedAt).toLocaleDateString("fr-FR")}
                    <span className="block text-[0.72rem] text-graphite">
                      {p.readingMinutes} min
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      form={`toggle-${p.id}`}
                      className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide transition-colors ${
                        p.status === "published"
                          ? "bg-vert/15 text-vert hover:bg-vert/25"
                          : "bg-sand/15 text-sand hover:bg-sand/25"
                      }`}
                      title={p.status === "published" ? "Dépublier" : "Publier"}
                    >
                      {p.status === "published" ? "En ligne" : "Brouillon"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/fr/publications/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-mist/15 px-2.5 py-1.5 text-[0.72rem] text-silver hover:border-mist/40 hover:text-white"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/admin/publications/${p.id}`}
                        className="flex size-9 items-center justify-center rounded-lg border border-mist/15 text-silver hover:border-mist/40 hover:text-white"
                        aria-label={`Modifier ${p.titleFr}`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Link>
                      <form
                        id={`toggle-${p.id}`}
                        action={togglePublicationStatus}
                        className="hidden"
                      >
                        <input type="hidden" name="id" value={p.id} />
                      </form>
                      <form action={deletePublication}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton
                          className="flex size-9 items-center justify-center rounded-lg border border-or/30 text-or hover:bg-or/10"
                          ariaLabel={`Supprimer ${p.titleFr}`}
                          confirmText={`Supprimer définitivement « ${p.titleFr} » ?`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
