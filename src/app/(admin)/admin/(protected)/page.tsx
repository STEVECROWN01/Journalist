import Link from "next/link";
import {
  FileText,
  FileEdit,
  Clapperboard,
  Mail,
  Eye,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

const SUBJECT_LABELS: Record<string, string> = {
  "collaboration-journalistique": "Collaboration journalistique",
  "production-documentaire": "Production documentaire",
  "conseil-communication": "Conseil en communication",
  formation: "Formation",
  autre: "Autre demande",
};

export default async function AdminDashboard() {
  let stats = {
    publications: 0,
    drafts: 0,
    productions: 0,
    messages: 0,
    unread: 0,
  };
  let recentMessages: Awaited<ReturnType<typeof db.contactMessage.findMany>> = [];
  let recentPublications: Awaited<ReturnType<typeof db.publication.findMany>> = [];

  try {
    const [publications, drafts, productions, messages, unread] = await Promise.all([
      db.publication.count({ where: { status: "published" } }),
      db.publication.count({ where: { status: "draft" } }),
      db.production.count({ where: { status: "published" } }),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),
    ]);
    stats = { publications, drafts, productions, messages, unread };
    recentMessages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    recentPublications = await db.publication.findMany({
      orderBy: { updatedAt: "desc" },
      take: 4,
    });
  } catch {
    // Base indisponible : affichage des compteurs à zéro
  }

  const cards = [
    {
      label: "Publications en ligne",
      value: stats.publications,
      hint: `${stats.drafts} brouillon${stats.drafts > 1 ? "s" : ""}`,
      href: "/admin/publications",
      Icon: FileText,
    },
    {
      label: "Productions en ligne",
      value: stats.productions,
      hint: "Portfolio public",
      href: "/admin/productions",
      Icon: Clapperboard,
    },
    {
      label: "Messages reçus",
      value: stats.messages,
      hint: `${stats.unread} non lu${stats.unread > 1 ? "s" : ""}`,
      href: "/admin/messages",
      Icon: Mail,
    },
    {
      label: "Brouillons",
      value: stats.drafts,
      hint: "Publications non publiées",
      href: "/admin/publications",
      Icon: FileEdit,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] text-white">Tableau de bord</h1>
          <p className="mt-1 text-[0.9rem] text-steel">
            Vue d'ensemble de la plateforme.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/publications/new" className="btn-outline !min-h-10 !px-4 !text-[0.72rem]">
            Nouvelle publication
          </Link>
          <Link href="/admin/productions/new" className="btn-accent !min-h-10 !px-4 !text-[0.72rem]">
            Nouvelle production
          </Link>
        </div>
      </div>

      {/* Compteurs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-mist/10 bg-surface p-6 transition-colors hover:border-mist/30"
          >
            <div className="flex items-center justify-between">
              <card.Icon size={18} className="text-or" aria-hidden="true" />
              <ArrowRight
                size={14}
                className="text-graphite opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 font-serif text-[2.4rem] leading-none text-white">
              {card.value}
            </p>
            <p className="mt-2 text-[0.85rem] text-silver">{card.label}</p>
            <p className="mt-0.5 text-[0.75rem] text-graphite">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Derniers messages */}
        <section className="rounded-xl border border-mist/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[1.3rem] text-white">
              Derniers messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-[0.78rem] uppercase tracking-[0.12em] text-steel hover:text-silver"
            >
              Tout voir
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-mist/15 p-6 text-center text-[0.88rem] text-steel">
              Aucun message pour l'instant. Les demandes envoyées via le formulaire
              de contact apparaîtront ici.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-mist/8">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[0.92rem] text-white">
                      {m.name}
                      {m.organization ? (
                        <span className="text-steel"> — {m.organization}</span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 truncate text-[0.8rem] text-steel">
                      {SUBJECT_LABELS[m.subject] ?? m.subject}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {!m.read ? (
                      <span className="rounded-full bg-or/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-or">
                        Nouveau
                      </span>
                    ) : null}
                    <p className="mt-1 text-[0.72rem] text-graphite">
                      {m.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Dernières modifications */}
        <section className="rounded-xl border border-mist/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[1.3rem] text-white">
              Dernières activités
            </h2>
            <Link
              href="/admin/publications"
              className="text-[0.78rem] uppercase tracking-[0.12em] text-steel hover:text-silver"
            >
              Gérer
            </Link>
          </div>
          {recentPublications.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-mist/15 p-6 text-center text-[0.88rem] text-steel">
              Aucune publication. Créez la première depuis le bouton ci-dessus.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-mist/8">
              {recentPublications.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3.5">
                  <Link
                    href={`/admin/publications/${p.id}`}
                    className="min-w-0 flex-1 truncate text-[0.92rem] text-white hover:text-mist"
                  >
                    {p.titleFr}
                  </Link>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                        p.status === "published"
                          ? "bg-vert/15 text-vert"
                          : "bg-sand/15 text-sand"
                      }`}
                    >
                      {p.status === "published" ? "En ligne" : "Brouillon"}
                    </span>
                    <span className="flex items-center gap-1 text-[0.72rem] text-graphite">
                      <Eye size={11} aria-hidden="true" />
                      {new Date(p.updatedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
