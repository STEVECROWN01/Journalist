import { PublicationForm } from "@/components/admin/publication-form";

export const metadata = { title: "Nouvelle publication" };

export default function NewPublicationPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[2rem] text-white">Nouvelle publication</h1>
      <p className="mt-1 text-[0.9rem] text-steel">
        Rédigez l'article en français puis en anglais (l'anglais reprend le
        français si laissé vide).
      </p>
      <div className="mt-10">
        <PublicationForm />
      </div>
    </div>
  );
}
