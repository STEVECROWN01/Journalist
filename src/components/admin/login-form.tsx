"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { loginAction, type ActionState } from "@/app/(admin)/admin/actions";

const initial: ActionState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-[0.85rem] font-medium text-mist">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full rounded-lg border border-mist/20 bg-surface/60 px-4 text-[0.95rem] text-white placeholder:text-graphite focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-rouge/30"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-[0.85rem] font-medium text-mist">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 w-full rounded-lg border border-mist/20 bg-surface/60 px-4 text-[0.95rem] text-white placeholder:text-graphite focus:border-mist/50 focus:outline-none focus:ring-2 focus:ring-rouge/30"
        />
      </div>

      {state.status === "error" && state.message ? (
        <p className="rounded-lg border border-rouge/40 bg-rouge/10 px-4 py-3 text-[0.88rem] text-mist" role="alert">
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-accent w-full">
        {pending ? (
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Lock size={14} aria-hidden="true" />
        )}
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
