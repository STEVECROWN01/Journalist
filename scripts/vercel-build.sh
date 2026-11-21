#!/bin/sh
# Build Vercel — exécuté automatiquement à la place de "next build"
# (voir la clé "vercel-build" dans package.json).
#
# 1. Génère le client Prisma (compatible avec le postinstall).
# 2. Si DATABASE_URL est présente : applique les migrations à la base
#    PostgreSQL (Railway) puis amorce le compte administrateur, les
#    paramètres du site et les productions (opération idempotente).
# 3. Compile l'application Next.js.
#
# Sans DATABASE_URL (ex. déploiement de prévisualisation), le site est
# déployé en mode repli statique : la compilation continue normalement.

set -e

# Robustesse : garantit l'accès aux binaires locaux (node_modules/.bin)
# quel que soit l'appelant (bun run, npm run, sh direct).
export PATH="$(pwd)/node_modules/.bin:$PATH"

echo "→ Génération du client Prisma…"
prisma generate

if [ -n "$DATABASE_URL" ]; then
  echo "→ DATABASE_URL détectée : migration de la base PostgreSQL…"
  prisma migrate deploy
  echo "→ Amorçage (administrateur, paramètres, productions)…"
  bun prisma/seed.ts
else
  echo "⚠ DATABASE_URL absente : déploiement en mode repli statique (sans base)."
fi

echo "→ Compilation Next.js…"
next build
