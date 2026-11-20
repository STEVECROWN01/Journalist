import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Connexion" };

export default async function AdminLoginPage() {
  /* Déjà connecté ? Direction le tableau de bord. */
  const userId = await getSessionUserId();
  if (userId) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-[1.6rem] text-white">
          Alexandre&nbsp;Morel<span className="text-rouge">.</span>
        </p>
        <p className="mt-1 text-[0.8rem] uppercase tracking-[0.18em] text-steel">
          Espace propriétaire
        </p>
        <div className="mt-10 rounded-xl border border-mist/10 bg-surface/50 p-8">
          <h1 className="font-serif text-[1.4rem] text-white">Connexion</h1>
          <p className="mt-1 text-[0.85rem] text-steel">
            Accès réservé à la gestion du site.
          </p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-[0.75rem] text-graphite">
          Espace sécurisé — sessions chiffrées, tentatives limitées.
        </p>
      </div>
    </main>
  );
}
