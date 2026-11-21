# Plateforme éditoriale professionnelle — Alexandre Morel

Site web personnel professionnel haut de gamme pour un journaliste international :
présentation du parcours, portfolio de productions documentaires, espace de
publications bilingue (FR/EN), communication & conseil, formation, contact
fonctionnel et **back-office propriétaire** de gestion de contenu.

> **Contenus** — l'identité (Alexandre Morel) et les coordonnées seront
> remplacées par les informations réelles après validation. Les productions
> forment un catalogue initial ; la rubrique **Articles & Analyses**, elle,
> est gérée exclusivement depuis le back-office : aucun article n'est
> pré-rempli, seules les publications réellement rédigées apparaissent
> en ligne.

## Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styles | Tailwind CSS 4 + design system éditorial dédié |
| Composants | shadcn/ui (New York) + Lucide Icons |
| Internationalisation | next-intl — `/fr/` et `/en/`, URLs localisées |
| Base de données | Prisma ORM + PostgreSQL (Railway) |
| Animations | Framer Motion (respect de `prefers-reduced-motion`) |
| SEO | Métadonnées, sitemap.xml, robots.txt, hreflang, Open Graph, Twitter Cards, JSON-LD |

## Structure du projet

```
src/
  app/
    (site)/[locale]/        # Site public bilingue
      page.tsx              # Accueil
      a-propos/             # À propos
      journalisme/          # Journalisme international
      productions/          # Portfolio (+ [slug] pages détail)
      publications/         # Publications (+ [slug] pages article)
      communication-conseil/
      formation/
      contact/              # Formulaire + actions serveur
    (admin)/admin/          # Back-office propriétaire (non indexé)
      login/                # Connexion sécurisée (scrypt + session HMAC)
      (protected)/          # Dashboard, publications, productions,
                            # messages, paramètres
    api/                    # (réservé)
    sitemap.ts / robots.ts  # SEO dynamique
  components/
    site/                   # Composants publics (header, footer, hero…)
    admin/                  # Composants back-office
  content/demo.ts           # Catalogue initial des productions (repli statique)
  i18n/                     # Configuration next-intl
  lib/                      # Base, auth, contenu, médias, config
  messages/                 # Traductions fr.json / en.json (354 clés)
prisma/                     # Schéma + amorçage
public/assets/              # Banque d'images optimisée
```

## Démarrage local

```bash
# 1. Dépendances
bun install        # ou npm install

# 2. Variables d'environnement
cp .env.example .env

# 3. Base de données : migrations + compte admin et catalogue productions
bunx prisma migrate deploy
bun run db:seed

# 4. Serveur de développement
bun run dev        # http://localhost:3000 → /fr
```

### Accès back-office

Le compte administrateur est créé par l'amorçage à partir des variables
`ADMIN_EMAIL` / `ADMIN_PASSWORD` du fichier `.env`.

- URL : `/admin`
- Valeurs de démonstration : `admin@alexandre-morel.example` / `Demo-2026!`

**Changez impérativement ces identifiants et `ADMIN_SESSION_SECRET` avant
toute mise en production.**

## Déploiement Vercel

Le déploiement fonctionne immédiatement (détection Next.js automatique) :

1. Importez le dépôt dans Vercel.
2. Ajoutez les variables d'environnement du `.env.example` dans les réglages
   du projet (voir ci-dessous).

### Base de données PostgreSQL (Railway)

Le projet est configuré pour **PostgreSQL** (fournisseur Railway). La chaîne
de build (`scripts/vercel-build.sh`, exécutée automatiquement par Vercel via
la clé `vercel-build` du `package.json`) :

1. applique les migrations Prisma (`prisma migrate deploy`) ;
2. amorce la base de manière idempotente — compte administrateur,
   paramètres du site, catalogue des productions (`bun prisma/seed.ts`) ;
3. compile l'application (`next build`).

**Mise en place :**

1. Sur [Railway](https://railway.app), créez un projet puis une base
   **PostgreSQL** ; copiez la variable `DATABASE_URL` (URL publique
   `postgresql://…`, onglet *Variables* du service).
2. Dans Vercel > Settings > Environment Variables, définissez :

   | Variable | Rôle |
   | --- | --- |
   | `DATABASE_URL` | URL PostgreSQL publique Railway |
   | `ADMIN_EMAIL` | identifiant de connexion au back-office |
   | `ADMIN_PASSWORD` | mot de passe administrateur |
   | `ADMIN_SESSION_SECRET` | clé de signature des sessions (valeur longue et aléatoire) |
   | `NEXT_PUBLIC_SITE_URL` | URL publique du site (métadonnées, sitemap) |

3. Redéployez : les tables sont créées et amorcées automatiquement pendant
   le build. Aucune commande manuelle n'est nécessaire.

**Remarques :**

- Modifier `ADMIN_PASSWORD` dans Vercel puis redéployer resynchronise le mot
  de passe du compte administrateur (les variables restent la source de vérité).
- Sans `DATABASE_URL` (p. ex. déploiement de prévisualisation), le build
  continue en mode repli statique : le site public s'affiche (les productions
  reposent sur le catalogue statique ; la rubrique Articles & Analyses reste
  vide jusqu'à la première publication réelle), le formulaire de contact et le
  back-office signalent que la base n'est pas configurée.
- Le back-office est accessible exclusivement par son URL (`/admin`),
  volontairement non référencé (robots.txt + noindex) et sans lien public.

## Guide du back-office

| Rubrique | Actions |
| --- | --- |
| Tableau de bord | Compteurs, derniers messages, dernières activités |
| Publications | Créer, modifier (FR/EN), publier/dépublier, catégoriser (analyses, reportages, décryptages), couverture, date, supprimer |
| Productions | Créer, modifier (FR/EN), catégoriser, ordonner, lien vidéo, supprimer |
| Messages | Consulter, marquer lu/non lu, répondre, supprimer |
| Paramètres | Nom, ville, e-mail, téléphone, réseaux sociaux (affichés sur le site) |

Les modifications sont visibles immédiatement sur le site public (les pages
statiques sont revalidées à chaque enregistrement).

## Personnalisation après validation

- [ ] Remplacer l'identité de démonstration par les informations réelles
      (traductions `src/messages/fr.json` et `en.json`).
- [ ] Mettre à jour les coordonnées dans **Paramètres** du back-office.
- [ ] Rédiger les premiers articles depuis **Publications** du back-office
      (catégories : analyses, reportages, décryptages ; version anglaise
      facultative — sans elle, l'article n'apparaît que sur le site français).
- [ ] Remplacer ou ajuster les productions du catalogue initial.
- [ ] Intégrer les vraies photographies dans `public/assets/` (et le registre
      `src/lib/media.ts` si de nouveaux fichiers sont ajoutés).
- [ ] Régénérer l'image Open Graph (`public/assets/og-image.jpg`).
- [ ] Vérifier les mentions légales et la politique de confidentialité.

## Sécurité

- Mots de passe hachés (scrypt + sel unique), comparaison à temps constant.
- Sessions signées HMAC-SHA256, cookie `httpOnly` + `SameSite=Lax` (12 h).
- Limitation des tentatives de connexion (6 / 10 min / IP).
- Formulaire de contact : validation double (client + serveur), pot de miel
  anti-robot, limitation de débit (5 messages / h / IP), assainissement des
  entrées, stockage base (aucun e-mail envoyé sans configuration).
- Back-office exclu de l'indexation (`robots.txt` + `noindex`).

## Licence

Tous droits réservés — projet client.
