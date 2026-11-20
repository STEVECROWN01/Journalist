import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { db } from "@/lib/db";
import {
  deleteProduction,
  toggleProductionStatus,
} from "@/app/(admin)/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export const metadata = { title: "Productions" };
export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  reportage: "Reportage",
  documentaire: "Documentaire",
  interview: "Entretien",
  communication: "Communication",
};

export default async function AdminProductionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  let productions: Awaited<ReturnType<typeof db.production.findMany>> = [];
  try {
    productions = await db.production.findMany({
      orderBy: [{ order: "asc" }, { year: "desc" }],
    });
  } catch {
    // base indisponible
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] text-white">Productions</h1>
          <p className="mt-1 text-[0.9rem] text-steel">
            {productions.length} production{productions.length > 1 ? "s" : ""} —
            portfolio audiovisuel et documentaire.
          </p>
        </div>
        <Link href="/admin/productions/new" className="btn-accent !min-h-10 !px-4 !text-[0.72rem]">
          <Plus size={14} aria-hidden="true" />
          Nouvelle production
        </Link>
      </div>

      {sp.ok ? (
        <p className="mt-6 rounded-lg border border-vert/30 bg-vert/10 px-4 py-3 text-[0.88rem] text-mist">
          Production enregistrée avec succès.
        </p>
      ) : null}
      {sp.deleted ? (
        <p className="mt-6 rounded-lg border border-rouge/30 bg-rouge/10 px-4 py-3 text-[0.88rem] text-mist">
          Production supprimée.
        </p>
      ) : null}

      {productions.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-mist/15 p-10 text-center text-steel">
          Aucune production pour le moment.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-mist/10">
          <table className="w-full min-w-[760px] text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-mist/10 bg-surface text-[0.72rem] uppercase tracking-[0.12em] text-steel">
                <th className="px-5 py-4 font-medium">Titre</th>
                <th className="px-5 py-4 font-medium">Catégorie</th>
                <th className="px-5 py-4 font-medium">Année</th>
                <th className="px-5 py-4 font-medium">Territoire</th>
                <th className="px-5 py-4 font-medium">Statut</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/8">
              {productions.map((p) => (
                <tr key={p.id} className="bg-ink/40 hover:bg-surface/60">
                  <td className="max-w-[240px] px-5 py-4">
                    <Link
                      href={`/admin/productions/${p.id}`}
                      className="block truncate text-white hover:text-mist"
                    >
                      {p.titleFr}
                    </Link>
                    <span className="mt-0.5 block truncate text-[0.75rem] text-graphite">
                      /{p.slug} · ordre {p.order}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-silver">
                    {CATEGORY_LABELS[p.category] ?? p.category}
                  </td>
                  <td className="px-5 py-4 text-steel">{p.year}</td>
                  <td className="px-5 py-4 text-steel">{p.territoryFr}</td>
                  <td className="px-5 py-4">
                    <button
                      form={`toggle-prod-${p.id}`}
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
                        href={`/fr/productions/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-mist/15 px-2.5 py-1.5 text-[0.72rem] text-silver hover:border-mist/40 hover:text-white"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/admin/productions/${p.id}`}
                        className="flex size-9 items-center justify-center rounded-lg border border-mist/15 text-silver hover:border-mist/40 hover:text-white"
                        aria-label={`Modifier ${p.titleFr}`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Link>
                      <form id={`toggle-prod-${p.id}`} action={toggleProductionStatus} className="hidden">
                        <input type="hidden" name="id" value={p.id} />
                      </form>
                      <form action={deleteProduction}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton
                          className="flex size-9 items-center justify-center rounded-lg border border-rouge/30 text-rouge hover:bg-rouge/10"
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
