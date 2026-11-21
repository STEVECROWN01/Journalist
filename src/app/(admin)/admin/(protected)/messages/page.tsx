import { MailOpen, Mail, Trash2, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { toggleMessageRead, deleteMessage } from "@/app/(admin)/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export const metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

const SUBJECT_LABELS: Record<string, string> = {
  "collaboration-journalistique": "Collaboration journalistique",
  "production-documentaire": "Production documentaire",
  "conseil-communication": "Conseil en communication",
  formation: "Formation",
  autre: "Autre demande",
};

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof db.contactMessage.findMany>> = [];
  try {
    messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // base indisponible
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[2rem] text-white">Messages</h1>
      <p className="mt-1 text-[0.9rem] text-steel">
        {messages.length} message{messages.length > 1 ? "s" : ""} reçu
        {messages.length > 1 ? "s" : ""} via le formulaire de contact —{" "}
        {unread} non lu{unread > 1 ? "s" : ""}.
      </p>

      {messages.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-mist/15 p-10 text-center text-steel">
          Aucun message pour l'instant. Les demandes envoyées depuis la page
          Contact apparaîtront ici en temps réel.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border p-6 transition-colors ${
                m.read
                  ? "border-mist/10 bg-surface/40 opacity-75"
                  : "border-rouge/25 bg-surface"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[1rem] font-medium text-white">
                    {m.name}
                    {m.organization ? (
                      <span className="font-normal text-steel"> — {m.organization}</span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[0.85rem]">
                    <a
                      href={`mailto:${m.email}`}
                      className="text-silver underline decoration-mist/30 underline-offset-4 hover:text-white"
                    >
                      {m.email}
                    </a>
                  </p>
                </div>
                <div className="text-right">
                  {!m.read ? (
                    <span className="rounded-full bg-rouge/15 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-rouge">
                      Non lu
                    </span>
                  ) : null}
                  <p className="mt-1 text-[0.75rem] text-graphite">
                    {m.createdAt.toLocaleDateString("fr-FR")} ·{" "}
                    {m.createdAt.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {m.locale.toUpperCase()}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[0.72rem] uppercase tracking-[0.14em] text-steel">
                {SUBJECT_LABELS[m.subject] ?? m.subject}
              </p>
              <p className="mt-3 whitespace-pre-line text-[0.92rem] leading-relaxed text-mist/90">
                {m.message}
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-mist/8 pt-4">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg border border-mist/15 px-3 py-1.5 text-[0.75rem] text-silver transition-colors hover:border-mist/40 hover:text-white"
                  >
                    {m.read ? (
                      <>
                        <Mail size={13} aria-hidden="true" /> Marquer non lu
                      </>
                    ) : (
                      <>
                        <MailOpen size={13} aria-hidden="true" /> Marquer comme lu
                      </>
                    )}
                  </button>
                </form>
                <a
                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(
                    SUBJECT_LABELS[m.subject] ?? "Votre demande"
                  )}`}
                  className="flex items-center gap-2 rounded-lg border border-mist/15 px-3 py-1.5 text-[0.75rem] text-silver transition-colors hover:border-mist/40 hover:text-white"
                >
                  <ExternalLink size={13} aria-hidden="true" /> Répondre
                </a>
                <form
                  action={deleteMessage}
                  className="ml-auto"
                >
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton
                    className="flex items-center gap-2 rounded-lg border border-rouge/30 px-3 py-1.5 text-[0.75rem] text-rouge transition-colors hover:bg-rouge/10"
                    confirmText="Supprimer ce message ?"
                  >
                    <Trash2 size={13} aria-hidden="true" /> Supprimer
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
