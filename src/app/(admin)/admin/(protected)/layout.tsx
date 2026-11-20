import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

/** Protection de toutes les pages d'administration. */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/admin/login");

  let userName = "Administrateur";
  let unread = 0;
  try {
    const user = await db.adminUser.findUnique({ where: { id: userId } });
    if (!user) redirect("/admin/login");
    userName = user.name;
    unread = await db.contactMessage.count({ where: { read: false } });
  } catch {
    // Base indisponible : on laisse l'accès aux pages de gestion
  }

  return (
    <AdminShell userName={userName} unreadCount={unread}>
      {children}
    </AdminShell>
  );
}
