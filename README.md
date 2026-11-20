# Plateforme éditoriale professionnelle — Alexandre Morel

Site web personnel professionnel haut de gamme pour un journaliste international :
présentation du parcours, portfolio de productions documentaires, espace de
publications bilingue (FR/EN), communication & conseil, formation, contact
fonctionnel et **back-office propriétaire** de gestion de contenu.

> **Démonstration conceptuelle** — l'identité (Alexandre Morel), les
> coordonnées, les productions et les publications sont des contenus
> illustratifs destinés à présenter la plateforme. Ils seront remplacés par
> les informations réelles après validation.

## Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styles | Tailwind CSS 4 + design system éditorial dédié |
| Composants | shadcn/ui (New York) + Lucide Icons |
| Internationalisation | next-intl — `/fr/` et `/en/`, URLs localisées |
| Base de données | Prisma ORM (SQLite en dev, PostgreSQL en production) |
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
  content/demo.ts           # Contenu de démonstration (repli statique)
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

# 3. Base de données (SQLite) + contenu de démonstration
bun run db:push
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
2. (Optionnel mais recommandé) Ajoutez les variables d'environnement du
   `.env.example` dans les réglages du projet.

### Deux modes de fonctionnement

- **Sans base de données** : le site public s'affiche intégralement avec le
  contenu de démonstration intégré (mode repli statique). Le formulaire de
  contact et le back-office signalent que la base n'est pas configurée.
- **Avec base de données** (recommandé) : toutes les fonctions sont actives.
  Créez une base PostgreSQL serverless gratuite (Neon, Supabase…), puis :
  1. Dans `prisma/schema.prisma`, remplacez `provider = "sqlite"` par
     `provider = "postgresql"` ;
  2. Définissez `DATABASE_URL` dans Vercel ;
  3. Exécutez `bun run db:push && bun run db:seed` localement contre cette
     base (ou depuis un environnement de build) ;
  4. Redéployez.

## Guide du back-office

| Rubrique | Actions |
| --- | --- |
| Tableau de bord | Compteurs, derniers messages, dernières activités |
| Publications | Créer, modifier (FR/EN), publier/dépublier, à la une, supprimer |
| Productions | Créer, modifier (FR/EN), catégoriser, ordonner, lien vidéo, supprimer |
| Messages | Consulter, marquer lu/non lu, répondre, supprimer |
| Paramètres | Nom, ville, e-mail, téléphone, réseaux sociaux (affichés sur le site) |

Les modifications sont visibles immédiatement sur le site public (les pages
statiques sont revalidées à chaque enregistrement).

## Personnalisation après validation

- [ ] Remplacer l'identité de démonstration par les informations réelles
      (traductions `src/messages/fr.json` et `en.json`).
- [ ] Mettre à jour les coordonnées dans **Paramètres** du back-office.
- [ ] Remplacer les publications et productions de démonstration par les
      réalisations réelles (suppression ou dépublication des contenus démo).
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
