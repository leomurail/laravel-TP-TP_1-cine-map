# CineMap - Démarche Technique (Étapes 1 à 3)

Ce document détaille les choix techniques et la démarche suivis pour les trois premières étapes du TP.

## Étape 1 : Authentification

L'authentification a été mise en place en utilisant le **Starter Kit Laravel React** (Inertia + Fortify).
- **Validation** : Les routes de connexion, d'inscription et le tableau de bord étaient déjà présents dans le scaffold.
- **Configuration** : La base de données SQLite a été migrée pour supporter les tables d'utilisateurs par défaut.

## Étape 2 : Les 2 CRUDs Métier (Film & Location)

### Modèle de données
- **Film** : Gère les titres, années de sortie et synopsis. Relation `hasMany` vers `Location`.
- **Location** : Gère les lieux de tournage. Lié à un `Film` (foreign key) et à un `User` (créateur). Initialisé avec un `upvotes_count` à 0.

### Contrôleurs et Validation
- Utilisation de **FormRequests** (`StoreFilmRequest`, `UpdateFilmRequest`, etc.) pour centraliser la validation des données (champs requis, formats, existence des IDs).
- **Inertia.js** : Les contrôleurs retournent des composants React via `Inertia::render`, permettant une expérience SPA fluide sans rechargement de page.

### Interface React
- Création de 8 pages (4 par CRUD) : `Index`, `Create`, `Edit`, `Show`.
- Utilisation des composants UI du projet (Button, Input, Label, Sidebar).
- Intégration dans la navigation latérale via `app-sidebar.tsx`.

## Étape 3 : Middleware Administrateur et Sécurité

### Droits d'accès
- **is_admin** : Ajout d'une colonne booléenne à la table `users`. Seuls les admins peuvent gérer les films.
- **Middleware `admin`** : Un middleware personnalisé vérifie la propriété `is_admin`. S'il est absent ou faux, l'accès est bloqué (403).
- **Policies** : Mise en place d'une `LocationPolicy`.
  - Un utilisateur peut créer un emplacement.
  - Seul l'auteur de l'emplacement ou un administrateur peut le modifier ou le supprimer.

### Intégration UI
- Les boutons d'action (Ajouter, Modifier, Supprimer) sont masqués dynamiquement côté client en fonction des droits de l'utilisateur connecté (`auth.user.is_admin` et `user_id`).

## Conclusion
Le socle de l'application est désormais fonctionnel : un utilisateur peut s'inscrire, se connecter, consulter les films, et proposer des lieux de tournage, tandis qu'un administrateur garde le contrôle total sur les données du catalogue.