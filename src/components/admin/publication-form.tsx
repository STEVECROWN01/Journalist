"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { savePublication, type ActionState } from "@/app/(admin)/admin/actions";
import { mediaAssets } from "@/lib/media";

const initial: ActionState = { status: "idle" };

interface PublicationFormData {
  id?: string;
  slug?: string;
  titleFr?: string;
  titleEn?: string;
  excerptFr?: string;
  excerptEn?: string;
  contentFr?: string;
  contentEn?: string;
  categoryFr?: string;
  categoryEn?: string;
  coverImage?: string | null;
  readingMinutes?: number;
  featured?: boolean;
  status?: string;
  publishedAt?: string;
}

const inputClass =
  "w-full rounded-lg border border-mist/20 bg-ink/60 px-4 py-2.5 text-[0.92rem] text-white placeholder:text-graphite focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-or/30";

export function PublicationForm({ data }: { data?: PublicationFormData }) {
  const [state, action, pending] = useActionState(savePublication, initial);

  return (
    <form action={action} className="space-y-8" noValidate>
      {data?.id ? <input type="hidden" name="id" value={data.id} /> : null}

      {/* Onglets FR / EN */}
      <Tabs defaultValue="fr">
        <TabsList className="bg-surface-2">
          <TabsTrigger value="fr" className="data-[state=active]:bg-or data-[state=active]:text-white">
            Français
          </TabsTrigger>
          <TabsTrigger value="en" className="data-[state=active]:bg-or data-[state=active]:text-white">
            English
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fr" className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Titre (français) <span className="text-or">*</span>
            </label>
            <input name="titleFr" defaultValue={data?.titleFr} required className={inputClass} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.85rem] font-medium text-mist">
                Catégorie (français)
              </label>
              <input name="categoryFr" defaultValue={data?.categoryFr ?? "Analyse"} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[0.85rem] font-medium text-mist">
                Temps de lecture (minutes)
              </label>
              <input
                name="readingMinutes"
                type="number"
                min={1}
                max={90}
                defaultValue={data?.readingMinutes ?? 5}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Résumé (français)
            </label>
            <textarea name="excerptFr" rows={3} defaultValue={data?.excerptFr} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Contenu (français, markdown simple) <span className="text-or">*</span>
            </label>
            <textarea
              name="contentFr"
              rows={16}
              required
              defaultValue={data?.contentFr}
              className={`${inputClass} font-mono text-[0.82rem] leading-relaxed`}
            />
            <p className="mt-2 text-[0.75rem] text-graphite">
              Markdown : ## sous-titre, **gras**, *italique*, &gt; citation, --- séparateur.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="en" className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Title (English) — vide = français repris
            </label>
            <input name="titleEn" defaultValue={data?.titleEn} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Category (English)
            </label>
            <input name="categoryEn" defaultValue={data?.categoryEn ?? "Analysis"} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Excerpt (English)
            </label>
            <textarea name="excerptEn" rows={3} defaultValue={data?.excerptEn} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Content (English, markdown) — vide = français repris
            </label>
            <textarea
              name="contentEn"
              rows={16}
              defaultValue={data?.contentEn}
              className={`${inputClass} font-mono text-[0.82rem] leading-relaxed`}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Réglages communs */}
      <div className="grid gap-5 rounded-xl border border-mist/10 bg-surface p-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Slug (URL) — vide = généré depuis le titre
          </label>
          <input name="slug" defaultValue={data?.slug} className={inputClass} placeholder="mon-article" />
        </div>
        <div>
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Date de publication
          </label>
          <input
            name="publishedAt"
            type="date"
            defaultValue={
              data?.publishedAt
                ? new Date(data.publishedAt).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10)
            }
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Image de couverture (facultatif)
          </label>
          <select
            name="coverImage"
            defaultValue={data?.coverImage ?? ""}
            className={inputClass}
          >
            <option value="">— Aucune image —</option>
            {mediaAssets.map((m) => (
              <option key={m.file} value={m.file}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[0.75rem] text-graphite">
            Les images sont fournies par la banque visuelle du site.
          </p>
        </div>
        <label className="flex items-center gap-3 text-[0.9rem] text-mist">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={data?.featured}
            className="size-4 accent-or"
          />
          Publication à la une (une seule à la fois)
        </label>
      </div>

      {state.status === "error" && state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-[0.88rem] text-mist" role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Actions : le bouton cliqué transmet le statut souhaité */}
      <div className="flex flex-wrap items-center gap-4">
        {data?.status === "published" ? (
          <span className="rounded-full bg-vert/15 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-wide text-vert">
            Actuellement en ligne
          </span>
        ) : data ? (
          <span className="rounded-full bg-sand/15 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-wide text-sand">
            Brouillon actuel
          </span>
        ) : null}
        <button type="submit" name="status" value="published" disabled={pending} className="btn-accent">
          {pending ? (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={15} aria-hidden="true" />
          )}
          {pending ? "Enregistrement…" : "Enregistrer et publier"}
        </button>
        <button type="submit" name="status" value="draft" disabled={pending} className="btn-outline">
          <Save size={15} aria-hidden="true" />
          Enregistrer en brouillon
        </button>
        <Link
          href="/admin/publications"
          className="text-[0.85rem] text-steel hover:text-silver"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
