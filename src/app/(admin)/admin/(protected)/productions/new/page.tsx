import { ProductionForm } from "@/components/admin/production-form";

export const metadata = { title: "Nouvelle production" };

export default function NewProductionPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[2rem] text-white">Nouvelle production</h1>
      <p className="mt-1 text-[0.9rem] text-steel">
        Renseignez la fiche en français puis en anglais (l'anglais reprend le
        français si laissé vide).
      </p>
      <div className="mt-10">
        <ProductionForm />
      </div>
    </div>
  );
}
