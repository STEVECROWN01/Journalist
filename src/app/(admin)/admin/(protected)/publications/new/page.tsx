import { PublicationForm } from "@/components/admin/publication-form";

export const metadata = { title: "Nouvelle publication" };

export default function NewPublicationPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[2rem] text-white">Nouvelle publication</h1>
      <p className="mt-1 text-[0.9rem] text-steel">
        Rédigez l&apos;article en français, puis en anglais si une version
        validée existe. Sans version anglaise, l&apos;article n&apos;apparaît
        que sur le site français.
      </p>
      <div className="mt-10">
        <PublicationForm />
      </div>
    </div>
  );
}
