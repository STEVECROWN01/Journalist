import { getSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Paramètres" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-[2rem] text-white">Paramètres</h1>
      <p className="mt-1 text-[0.9rem] text-steel">
        Informations professionnelles affichées sur le site public.
      </p>
      <div className="mt-10">
        <SettingsForm data={settings} />
      </div>
    </div>
  );
}
