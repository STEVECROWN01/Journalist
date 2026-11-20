"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Clapperboard,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/(admin)/admin/actions";

const NAV = [
  { href: "/admin", label: "Tableau de bord", Icon: LayoutDashboard, exact: true },
  { href: "/admin/publications", label: "Publications", Icon: FileText },
  { href: "/admin/productions", label: "Productions", Icon: Clapperboard },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
  { href: "/admin/settings", label: "Paramètres", Icon: Settings },
] as const;

/** Barre latérale du back-office (responsive). */
export function AdminShell({
  userName,
  unreadCount,
  children,
}: {
  userName: string;
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const navList = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Back-office">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[0.9rem] transition-colors ${
            isActive(item)
              ? "bg-rouge/10 text-white"
              : "text-silver hover:bg-surface-2 hover:text-white"
          }`}
          aria-current={isActive(item) ? "page" : undefined}
        >
          <item.Icon size={17} className={isActive(item) ? "text-rouge" : ""} aria-hidden="true" />
          {item.label}
          {item.href === "/admin/messages" && unreadCount > 0 ? (
            <span className="ml-auto rounded-full bg-rouge px-2 py-0.5 text-[0.68rem] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Barre latérale bureau */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-mist/10 bg-ink-deep p-5 lg:flex">
        <Link href="/admin" className="block px-2 pb-6 pt-2">
          <p className="font-serif text-[1.3rem] text-white">
            Alexandre&nbsp;Morel<span className="text-rouge">.</span>
          </p>
          <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.16em] text-steel">
            Back-office
          </p>
        </Link>
        {navList}
        <div className="space-y-1 border-t border-mist/10 pt-4">
          <a
            href="/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-[0.9rem] text-silver transition-colors hover:bg-surface-2 hover:text-white"
          >
            <ExternalLink size={17} aria-hidden="true" />
            Voir le site
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[0.9rem] text-silver transition-colors hover:bg-surface-2 hover:text-white"
            >
              <LogOut size={17} aria-hidden="true" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Barre mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-mist/10 bg-ink/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="font-serif text-[1.15rem] text-white">
          A.&nbsp;Morel<span className="text-rouge">.</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-11 items-center justify-center rounded-full text-mist"
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-deep/80"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-mist/10 bg-ink-deep p-5">
            <div className="flex items-center justify-between pb-6 pt-2">
              <p className="font-serif text-[1.2rem] text-white">
                A.&nbsp;Morel<span className="text-rouge">.</span>
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center rounded-full text-mist"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>
            {navList}
            <div className="space-y-1 border-t border-mist/10 pt-4">
              <a
                href="/fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[0.9rem] text-silver"
              >
                <ExternalLink size={17} aria-hidden="true" />
                Voir le site
              </a>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[0.9rem] text-silver"
                >
                  <LogOut size={17} aria-hidden="true" />
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* Contenu */}
      <div className="min-w-0 flex-1 px-5 pb-16 pt-24 lg:px-10 lg:pt-10">
        <p className="mb-6 hidden text-[0.75rem] text-graphite lg:block">
          Connecté en tant que <span className="text-silver">{userName}</span>
        </p>
        {children}
      </div>
    </div>
  );
}
