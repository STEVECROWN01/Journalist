import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Toutes les routes sauf back-office, API et fichiers statiques
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
};
