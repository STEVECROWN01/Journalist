#!/bin/sh
# ---------------------------------------------------------------------------
# Build Vercel — exécuté automatiquement à la place de « next build »
# (clé « vercel-build » du package.json).
#
#   Étape 1/4 : génération du client Prisma.
#   Étape 2/4 : migrations PostgreSQL (Railway) si DATABASE_URL est définie.
#   Étape 3/4 : amorçage idempotent (administrateur, paramètres, productions).
#   Étape 4/4 : compilation Next.js.
#
# Ce script est volontairement bavard : en cas d'échec, le journal Vercel
# indique en français l'étape fautive et la marche à suivre exacte.
# Il ne journalise jamais le mot de passe contenu dans DATABASE_URL.
# ---------------------------------------------------------------------------

set -e

# Accès aux binaires locaux (node_modules/.bin) quel que soit l'appelant.
export PATH="$(pwd)/node_modules/.bin:$PATH"

LOG_MIGRATE="${TMPDIR:-/tmp}/prisma-migrate.log"
LOG_SEED="${TMPDIR:-/tmp}/prisma-seed.log"

say()  { printf '\n► %s\n' "$1"; }
fail() { printf '\n✖ ÉCHEC DU DÉPLOIEMENT — %s\n' "$1"; exit 1; }

# ---------------------------------------------------------------------------
# Assainissement de DATABASE_URL : les guillemets appartiennent à la syntaxe
# des fichiers .env, PAS à la valeur. Un collage depuis .env.example vers le
# tableau de bord Vercel introduit parfois « "postgresql://…" » (ou des
# espaces, un préfixe « DATABASE_URL= », un « ; » final).
# ---------------------------------------------------------------------------
sanitize_url() {
  v=$(printf '%s' "$1" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/;[[:space:]]*$//')
  case "$v" in
    DATABASE_URL=*)
      v=$(printf '%s' "$v" | sed -e 's/^DATABASE_URL=//' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
      ;;
  esac
  first=$(printf '%s' "$v" | cut -c1)
  last=$(printf '%s' "$v" | tail -c 1)
  if [ "$first" = '"' ] && [ "$last" = '"' ]; then
    v=$(printf '%s' "$v" | sed -e 's/^"//' -e 's/"$//')
  elif [ "$first" = "'" ] && [ "$last" = "'" ]; then
    v=$(printf '%s' "$v" | sed -e "s/^'//" -e "s/'\$//")
  fi
  printf '%s' "$v"
}

# ---------------------------------------------------------------------------
# Diagnostics ciblés (en français) selon le code d'erreur Prisma.
# ---------------------------------------------------------------------------
diagnose_migrate() {
  if grep -q 'P1001' "$LOG_MIGRATE" 2>/dev/null; then
    printf '%s\n' \
      "CAUSE : la base PostgreSQL est injoignable depuis Vercel (erreur P1001)." \
      "Vérifications dans l'ordre :" \
      "  1. Railway > votre service PostgreSQL : il doit être actif (pastille" \
      "     verte), pas en pause. Si l'essai gratuit est épuisé, la base est" \
      "     déprovisionnée — rechargez le compte ou recréez le projet." \
      "  2. Aucun domaine public ? Railway > PostgreSQL > onglet Settings >" \
      "     section Networking > « Public Access » : appuyez sur" \
      "     « Generate Domain » si aucun hôte containers-xxxx.rlwy.net" \
      "     n'apparaît. L'URL interne « postgres.railway.internal » ne" \
      "     fonctionne QUE depuis l'intérieur de Railway, jamais depuis" \
      "     Vercel. (L'option « railway connect » / --tunnel-only ne sert" \
      "     qu'à vos outils locaux : TablePlus, DBeaver….)" \
      "  3. Railway > PostgreSQL > onglet Variables : copiez la variable" \
      "     DATABASE_PUBLIC_URL (hôte du type containers-xxxx.rlwy.net)." \
      "  4. Vercel > Settings > Environment Variables > DATABASE_URL : collez" \
      "     la valeur brute, SANS guillemets, pour Production (et Preview)." \
      "  5. Deployments > menu du dernier déploiement > Redeploy."
  elif grep -q 'P1000' "$LOG_MIGRATE" 2>/dev/null; then
    printf '%s\n' \
      "CAUSE : authentification PostgreSQL refusée (erreur P1000)." \
      "Le mot de passe intégré à l'URL est incorrect. Recopiez l'intégralité" \
      "de DATABASE_URL depuis Railway (PostgreSQL > onglet Variables) sans la" \
      "modifier, puis mettez-la à jour dans Vercel et redéployez."
  elif grep -q 'P3005\|P3006' "$LOG_MIGRATE" 2>/dev/null; then
    printf '%s\n' \
      "CAUSE : la base contient déjà des tables non gérées par les migrations" \
      "(erreur P3005/P3006 — p. ex. issue d'un « db push » antérieur)." \
      "Réinitialisez-la : Railway > PostgreSQL > onglet Data > console SQL :" \
      "    DROP SCHEMA public CASCADE; CREATE SCHEMA public;" \
      "puis relancez le déploiement (migrations et amorçage repartiront alors" \
      "d'une base propre)."
  else
    printf '%s\n' \
      "Erreur Prisma inattendue — journal complet ci-dessus." \
      "Copiez les 40 dernières lignes de ce journal pour obtenir de l'aide."
  fi
}

# ---------------------------------------------------------------------------
# Étape 2 : migrations (une nouvelle tentative automatique si la base est
# momentanément injoignable).
# ---------------------------------------------------------------------------
run_migrations() {
  if prisma migrate deploy > "$LOG_MIGRATE" 2>&1; then
    sed -n '1,40p' "$LOG_MIGRATE"
    return 0
  fi
  if grep -q 'P1001' "$LOG_MIGRATE" 2>/dev/null; then
    say "Première tentative de connexion échouée — nouvelle tentative dans 8 s…"
    sleep 8
    if prisma migrate deploy > "$LOG_MIGRATE" 2>&1; then
      sed -n '1,40p' "$LOG_MIGRATE"
      return 0
    fi
  fi
  printf '\n——————— JOURNAL PRISMA ———————\n'
  sed -n '1,60p' "$LOG_MIGRATE"
  printf '————————————————————————————————\n'
  diagnose_migrate
  return 1
}

# ---------------------------------------------------------------------------
# Étape 3 : amorçage idempotent.
# ---------------------------------------------------------------------------
run_seed() {
  if ! command -v bun > /dev/null 2>&1; then
    printf '%s\n' \
      "CAUSE : bun est introuvable dans l'environnement de build Vercel." \
      "(bun est normalement préinstallé — vérifiez que le dépôt contient bien" \
      "le fichier bun.lock pour que Vercel l'utilise comme gestionnaire.)"
    return 1
  fi
  if bun prisma/seed.ts > "$LOG_SEED" 2>&1; then
    sed -n '1,40p' "$LOG_SEED"
    return 0
  fi
  printf '\n——————— JOURNAL D AMORÇAGE ———————\n'
  sed -n '1,60p' "$LOG_SEED"
  printf '——————————————————————————————————————\n'
  return 1
}

# ---------------------------------------------------------------------------
# Mode repli : la base est indisponible — le site se déploie quand même.
# Le site public fonctionne sans base (catalogue et articles de démonstration,
# formulaire et back-office inactifs) ; dès que l'URL est corrigée, le
# prochain déploiement rebranche tout automatiquement.
# ---------------------------------------------------------------------------
fallback_notice() {
  printf '\n⚠⚠⚠ BASE DE DONNÉES INDISPONIBLE — DÉPLOIEMENT EN MODE REPLI ⚠⚠⚠\n'
  printf '%s\n' \
    "Le site sera publié en version de démonstration (contenus statiques)." \
    "Le formulaire de contact et le back-office resteront inactifs." \
    "Aucune donnée n'est perdue : dès que DATABASE_URL sera joignable, le" \
    "prochain déploiement réappliquera migrations et amorçage automatiquement." \
    "" \
    "Pour rebrancher la base : voir le diagnostic ci-dessus, corriger la" \
    "variable dans Vercel > Settings > Environment Variables, puis Redeploy."
  printf '⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠\n\n'
}

# ---------------------------------------------------------------------------
# Déroulé du build
# ---------------------------------------------------------------------------

say "Étape 1/4 — Génération du client Prisma"
prisma generate > /dev/null 2>&1 || fail "« prisma generate » a échoué (dépendances incomplètes ? relancez le déploiement)."

if [ -z "${DATABASE_URL:-}" ]; then
  say "DATABASE_URL absente : déploiement en mode repli statique (site public de"
  say "démonstration, back-office et formulaire inactifs, rubrique Articles vide)."
  say "Pour connecter la base Railway : Vercel > Settings > Environment Variables"
  say "> DATABASE_URL = URL publique Railway (sans guillemets), puis Redeploy."
else
  CLEANED=$(sanitize_url "$DATABASE_URL")
  if [ "$CLEANED" != "$DATABASE_URL" ]; then
    say "DATABASE_URL contenait des guillemets ou espaces parasites : valeur nettoyée automatiquement."
    export DATABASE_URL="$CLEANED"
  fi

  DB_SKIPPED=0
  case "$DATABASE_URL" in
    postgres://*|postgresql://*) ;;
    *)
      printf '\n✖ DATABASE_URL invalide : elle ne commence pas par postgres:// ou postgresql:// (valeur reçue : « %s… », tronquée par sécurité). Collez l URL complète fournie par Railway, SANS guillemets ni préfixe « DATABASE_URL= ».\n' "$(printf '%s' "$DATABASE_URL" | cut -c1-13)"
      fallback_notice
      DB_SKIPPED=1
      ;;
  esac

  case "$DATABASE_URL" in
    *railway.internal*|*@postgres:*|*@postgresql:*)
      printf '\n%s\n' \
      "✖ DATABASE_URL est l URL INTERNE de Railway (postgres.railway.internal)," \
      "inaccessible depuis Vercel. Comment obtenir l URL publique :" \
      "  1. Railway > service PostgreSQL > onglet Settings > section Networking." \
      "  2. Sous « Public Access » (l encadré qui avertit que quiconque détient" \
      "     la chaîne de connexion peut se connecter), appuyez sur" \
      "     « Generate Domain » : Railway crée un domaine public du type" \
      "     containers-xxxx.rlwy.net, avec son port." \
      "  3. Onglet Variables : la variable DATABASE_PUBLIC_URL apparaît alors —" \
      "     copiez sa valeur complète." \
      "  4. Vercel > Settings > Environment Variables > DATABASE_URL : collez" \
      "     cette valeur brute (SANS guillemets), puis Redeploy." \
      "NB : « railway connect » et l option --tunnel-only servent uniquement à" \
      "vos outils locaux (TablePlus, DBeaver…) — Vercel exige l URL publique."
      fallback_notice
      DB_SKIPPED=1
      ;;
  esac

  if [ "$DB_SKIPPED" -eq 0 ]; then
    say "Base détectée : $(printf '%s' "$DATABASE_URL" | sed -e 's|.*@||' -e 's|/.*||')"

    say "Étape 2/4 — Migrations PostgreSQL (prisma migrate deploy)"
    if ! run_migrations; then
      fallback_notice
    else
      say "Étape 3/4 — Amorçage (administrateur, paramètres du site, productions)"
      if ! run_seed; then
        printf '\n✖ Échec de l amorçage de la base — journal ci-dessus.\n'
        fallback_notice
      fi
    fi
  fi
fi

say "Étape 4/4 — Compilation Next.js"
exec next build
