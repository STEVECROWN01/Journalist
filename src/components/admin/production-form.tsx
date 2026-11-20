"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveProduction, type ActionState } from "@/app/(admin)/admin/actions";
import { mediaAssets } from "@/lib/media";
import { PRODUCTION_CATEGORIES } from "@/lib/site";

const initial: ActionState = { status: "idle" };

interface ProductionFormData {
  id?: string;
  slug?: string;
  titleFr?: string;
  titleEn?: string;
  category?: string;
  year?: number;
  territoryFr?: string;
  territoryEn?: string;
  roleFr?: string;
  roleEn?: string;
  contextFr?: string;
  contextEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  coverImage?: string | null;
  videoUrl?: string | null;
  order?: number;
  status?: string;
}

const inputClass =
  "w-full rounded-lg border border-mist/20 bg-ink/60 px-4 py-2.5 text-[0.92rem] text-white placeholder:text-graphite focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-rouge/30";

const CATEGORY_LABELS: Record<string, string> = {
  reportage: "Reportage",
  documentaire: "Documentaire",
  interview: "Entretien",
  communication: "Communication",
};

export function ProductionForm({ data }: { data?: ProductionFormData }) {
  const [state, action, pending] = useActionState(saveProduction, initial);

  return (
    <form action={action} className="space-y-8" noValidate>
      {data?.id ? <input type="hidden" name="id" value={data.id} /> : null}

      {/* Informations communes */}
      <div className="grid gap-5 rounded-xl border border-mist/10 bg-surface p-6 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Catégorie <span className="text-rouge">*</span>
          </label>
          <select name="category" defaultValue={data?.category ?? "documentaire"} className={inputClass}>
            {PRODUCTION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Année
          </label>
          <input
            name="year"
            type="number"
            min={1990}
            max={2100}
            defaultValue={data?.year ?? new Date().getFullYear()}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Ordre d'affichage
          </label>
          <input
            name="order"
            type="number"
            min={0}
            max={99}
            defaultValue={data?.order ?? 10}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-3">
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Image de couverture
          </label>
          <select name="coverImage" defaultValue={data?.coverImage ?? ""} className={inputClass}>
            <option value="">— Aucune image —</option>
            {mediaAssets.map((m) => (
              <option key={m.file} value={m.file}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className="mb-2 block text-[0.85rem] font-medium text-mist">
            Lien vidéo externe (facultatif — https://…)
          </label>
          <input
            name="videoUrl"
            type="url"
            defaultValue={data?.videoUrl ?? ""}
            placeholder="https://vimeo.com/…"
            className={inputClass}
          />
        </div>
      </div>

      {/* Onglets FR / EN */}
      <Tabs defaultValue="fr">
        <TabsList className="bg-surface-2">
          <TabsTrigger value="fr" className="data-[state=active]:bg-rouge data-[state=active]:text-white">
            Français
          </TabsTrigger>
          <TabsTrigger value="en" className="data-[state=active]:bg-rouge data-[state=active]:text-white">
            English
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fr" className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.85rem] font-medium text-mist">
                Titre (français) <span className="text-rouge">*</span>
              </label>
              <input name="titleFr" defaultValue={data?.titleFr} required className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[0.85rem] font-medium text-mist">
                Territoire (français)
              </label>
              <input name="territoryFr" defaultValue={data?.territoryFr} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Rôle exercé (français)
            </label>
            <input name="roleFr" defaultValue={data?.roleFr} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Contexte (français)
            </label>
            <textarea name="contextFr" rows={3} defaultValue={data?.contextFr} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Présentation (français) <span className="text-rouge">*</span>
            </label>
            <textarea
              name="descriptionFr"
              rows={8}
              required
              defaultValue={data?.descriptionFr}
              className={inputClass}
            />
          </div>
        </TabsContent>

        <TabsContent value="en" className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.85rem] font-medium text-mist">
                Title (English) — vide = français repris
              </label>
              <input name="titleEn" defaultValue={data?.titleEn} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[0.85rem] font-medium text-mist">
                Territory (English)
              </label>
              <input name="territoryEn" defaultValue={data?.territoryEn} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Role (English)
            </label>
            <input name="roleEn" defaultValue={data?.roleEn} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Context (English)
            </label>
            <textarea name="contextEn" rows={3} defaultValue={data?.contextEn} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              Overview (English) — vide = français repris
            </label>
            <textarea
              name="descriptionEn"
              rows={8}
              defaultValue={data?.descriptionEn}
              className={inputClass}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Slug */}
      <div className="rounded-xl border border-mist/10 bg-surface p-6">
        <label className="mb-2 block text-[0.85rem] font-medium text-mist">
          Slug (URL) — vide = généré depuis le titre
        </label>
        <input name="slug" defaultValue={data?.slug} className={inputClass} placeholder="ma-production" />
      </div>

      {state.status === "error" && state.message ? (
        <p className="rounded-lg border border-rouge/40 bg-rouge/10 px-4 py-3 text-[0.88rem] text-mist" role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Actions */}
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
        <Link href="/admin/productions" className="text-[0.85rem] text-steel hover:text-silver">
          Annuler
        </Link>
      </div>
    </form>
  );
}
