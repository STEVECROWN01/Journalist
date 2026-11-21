"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettings, type ActionState } from "@/app/(admin)/admin/actions";

const initial: ActionState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-mist/20 bg-ink/60 px-4 py-2.5 text-[0.92rem] text-white placeholder:text-graphite focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-rouge/30";

interface SettingsData {
  ownerName: string;
  baseCity: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  vimeo: string;
}

export function SettingsForm({ data }: { data: SettingsData }) {
  const [state, action, pending] = useActionState(saveSettings, initial);

  const fields: Array<{ name: keyof SettingsData; label: string; placeholder?: string }> = [
    { name: "ownerName", label: "Nom affiché" },
    { name: "baseCity", label: "Ville de rattachement" },
    { name: "email", label: "Adresse e-mail professionnelle" },
    { name: "phone", label: "Téléphone professionnel" },
    { name: "linkedin", label: "LinkedIn (URL)" },
    { name: "twitter", label: "X / Twitter (URL)" },
    { name: "vimeo", label: "Vimeo (URL)" },
  ];

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 rounded-xl border border-mist/10 bg-surface p-6 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="mb-2 block text-[0.85rem] font-medium text-mist">
              {f.label}
            </label>
            <input
              name={f.name}
              defaultValue={data[f.name]}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <p className="text-[0.8rem] leading-relaxed text-steel">
        Ces informations alimentent le pied de page et la page Contact du site.
        Pensez à remplacer les coordonnées de démonstration par les vraies
        informations lors de la personnalisation.
      </p>

      {state.status === "error" && state.message ? (
        <p className="rounded-lg border border-rouge/40 bg-rouge/10 px-4 py-3 text-[0.88rem] text-mist" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="rounded-lg border border-vert/30 bg-vert/10 px-4 py-3 text-[0.88rem] text-mist" role="status">
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-accent">
        {pending ? (
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Save size={15} aria-hidden="true" />
        )}
        {pending ? "Enregistrement…" : "Enregistrer les paramètres"}
      </button>
    </form>
  );
}
