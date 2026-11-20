import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Back-office — Alexandre Morel",
    template: "%s — Back-office",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
