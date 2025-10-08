# Magellan

Carnet d’explorations intérieures construit avec **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, **Supabase Auth**, **React Hook Form + Zod**, **Framer Motion** et une interface multilingue (FR/EN/DE) motorisée par **react-i18next**.

## Démarrer

```bash
pnpm install
pnpm dev
```

L’application écoute sur `http://localhost:3000`.

## Configuration requise

1. **Variables d’environnement** (copie `./.env.local`) :

   ```env
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE=...   # réservé aux scripts locaux
   ```

2. **Supabase**

   - Crée un projet Supabase.
   - Active l’authentification **Email + mot de passe** et les **magic links**.
   - Dans l’éditeur SQL, exécute `supabase/schema.sql` pour créer le schéma, les RLS et le seed initial de tags.

3. **Police**

   - `Open Sans` est chargée via `next/font/google`. Aucune action supplémentaire.

## Scripts utiles

- `pnpm dev` : démarre le serveur de développement.
- `pnpm build` : build de production.
- `pnpm start` : sert le build.
- `pnpm lint` : lint avec `eslint`.
- `pnpm typecheck` : vérifie les types TypeScript.

## Structure

- `app/` : pages App Router, dont les vues `Harbor`, `Expéditions`, `Carte`, `Réglages`, formulaires d’auth et le journal conversationnel T+24.
- `components/` : UI partagée (TopBar, SideNav, ConversationalForm, etc.) et composants `shadcn/ui`.
- `config/forms.ts` : scripts T24/T72/T14 pour les formulaires guidés.
- `lib/` : clients Supabase (navigateur + serveur) et server actions (CRUD, partage).
- `locales/` : dictionnaires `common.json` pour français, anglais et allemand.
- `supabase/schema.sql` : définition de la base + politiques RLS.
- `types/domain.ts` : Typage du domaine (Trip, Entry, Tag, Share…).

## Flux principaux

- **Inscription / connexion** : email + mot de passe ou lien magique via Supabase Auth Helpers.
- **Création d’expédition** : formulaire riche, gestion des tags, redirection vers le journal T+24.
- **Journal conversationnel** : composant animé (framer-motion), autosave 500 ms, pilotable au clavier.
- **Partage (Crew)** : invitation par email avec rôle (lecture / écriture) et RLS Supabase.
- **Carte des motifs** : agrégation simple des tags pour visualiser les récurrences.
- **Exports** : bouton PDF (impression) disponible depuis la fiche d’expédition.
- **Langues** : détection automatique (FR/EN/DE) + sélecteur dédié dans la barre supérieure.

## Design & accessibilité

- Palette personnalisée `magellan` (smoky, delft, glaucous, vista).
- Surfaces en `glassmorphism` doux, accent `glaucous`, textes #EEE.
- Navigation clavier : `Enter` pour avancer, `←` pour revenir, focus visibles harmonisés.
- Animations légères (« encre magique ») sur les libellés du formulaire.

## Tests & vérifications

- Lancement recommandé : `pnpm typecheck && pnpm lint`.
- Vérifie Supabase avec les variables d’environnement valides avant de lancer `pnpm dev`.

Bon voyage avec Magellan. 🧭
