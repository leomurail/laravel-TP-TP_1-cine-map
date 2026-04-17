# CineMap - Documentation Technique & Choix d'Implémentation

Ce document documente les changements et les choix techniques effectués pour CineMap par rapport au `brief.md`.

## 1. Stack Technique
Le brief laissait libre le choix de l'interface. J'ai opté pour une stack moderne et performante :
- **Laravel 11** comme framework principal.
- **Inertia.js avec React 19** pour une expérience utilisateur fluide sans sacrifier la puissance de Laravel.
- **Tailwind CSS v4** pour un design industriel et épuré.

## 2. Écarts et Améliorations par rapport au Brief

### Authentification (Étape 1)
- **Implémentation** : Utilisation d'un Starter Kit basé sur **Fortify** pour une gestion robuste de l'auth.
- **Ajout** : Gestion complète du profil utilisateur (changement de mot de passe, suppression de compte).

### Les CRUDs Métier (Étape 2)
- **Fidélité** : Les modèles `Film` et `Location` respectent exactement les champs conseillés.
- **UX** : Les formulaires ont été stylisés avec une approche "brutaliste/industrielle" pour une identité visuelle forte.

### Middleware Administrateur (Étape 3)
- **Implémentation** : Un middleware `AdminMiddleware` protège les routes sensibles.
- **Policies** : Utilisation des `Policies` Laravel pour une gestion fine des droits (ex: un utilisateur ne peut éditer que ses propres lieux).

### Système d'Upvotes & Queues (Étape 4)
- **Flux** : Enregistrement immédiat du vote dans la table `location_votes` (index unique user/location).
- **Asynchronisme** : Le job `UpdateLocationUpvotes` est dispatché sur la queue `database`. Il effectue un `COUNT` précis pour mettre à jour le champ `upvotes_count` du modèle `Location`.

### Automatisation (Étape 5)
- **Commande** : `php artisan app:cleanup-locations`.
- **Logique** : Suppression stricte des lieux > 14 jours ET < 2 upvotes.
- **Planification** : Intégrée dans `routes/console.php`.

### Qualité (Étape 6)
- **Laravel Pint** : Utilisé pour harmoniser le style de code.

### Connexion Sociale (Étape 7)
- **Fournisseur** : GitHub via **Laravel Socialite**.
- **Gestion des conflits** : Si un utilisateur GitHub possède le même e-mail qu'un utilisateur classique, les comptes sont liés de manière sécurisée.

### Stripe & API Premium (Étape 8)
- **Stripe** : Intégration de **Laravel Cashier** pour gérer les abonnements.
- **Middleware API** : Un middleware personnalisé vérifie à la fois la validité du token JWT et l'état de l'abonnement Stripe de l'utilisateur.
- **JWT** : Utilisation d'une implémentation JWT sur mesure pour l'API.

### Serveur MCP (Étape 9)
- **Choix Technique** : Implémentation via un serveur **Node.js** séparé (dans `/mcp-server`).
- **Pourquoi ?** : Utilisation du SDK officiel d'Anthropic pour garantir une compatibilité parfaite avec les clients IA (Claude, Gemini CLI).
- **Fonctionnement** : Le serveur lit directement la base SQLite partagée avec Laravel pour exposer les outils `list_films` et `get_locations_for_film`.

## 3. Dépendances Clés ajoutées
- `laravel/socialite` : Pour l'auth GitHub.
- `laravel/cashier` : Pour l'intégration Stripe.
- `concurrently` : Pour lancer plusieurs services simultanément via `make dev`.
- `@modelcontextprotocol/sdk` : Pour le serveur MCP.

## 4. Instructions de Maintenance
Toutes les commandes de maintenance (migration, linting, tests) sont regroupées dans le `Makefile`.
L'application a été formatée et testée pour garantir une stabilité maximale.
