import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Standalone pour l'hébergement sandbox ; Vercel gère son propre rendu
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  allowedDevOrigins: ["*.space-z.ai", "localhost"],
  // Pas d'indicateur dev flottant (démos commerciales propres)
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 : la qualité se définit par composant (quality={85} sur les
    // <Image> éditoriales) — le 75 par défaut moussait les photographies.
    qualities: [75, 85],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
