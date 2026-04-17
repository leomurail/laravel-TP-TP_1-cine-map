# CineMap - Gestion d'emplacements de tournage

CineMap est une application Laravel (Inertia/React) permettant de répertorier et de gérer des lieux de tournage de films. Ce projet a été réalisé dans le cadre d'un TP Laravel.

## Architecture du Projet

L'application repose sur une stack moderne :
- **Backend** : Laravel 11.
- **Frontend** : React 19 avec Inertia.js.
- **Base de données** : SQLite.
- **Style** : Tailwind CSS (v4).
- **Services tiers** : GitHub (OAuth), Stripe (Abonnements).
- **MCP** : Un serveur Model Context Protocol (Node.js) pour l'intégration IA.

## Installation Rapide (Makefile)

Le projet inclut un `Makefile` pour simplifier les commandes courantes.

1. **Configuration initiale** :
   ```bash
   make setup
   ```
   *Cette commande installe les dépendances (PHP, JS, MCP), crée le fichier `.env`, génère la clé d'application et initialise la base de données SQLite avec des données de test.*

2. **Lancer les services de développement** :
   ```bash
   make dev
   ```
   *Lance simultanément le serveur Laravel, Vite et le worker de queue via `concurrently`.*

3. **Lancer le serveur MCP (pour les IA)** :
   ```bash
   make mcp
   ```

## Commandes du Makefile

| Commande | Description |
| :--- | :--- |
| `make help` | Affiche la liste des commandes disponibles. |
| `make install` | Installe toutes les dépendances (Backend, Frontend, MCP). |
| `make setup` | Installe tout et initialise la base de données. |
| `make dev` | Lance Laravel + Vite + Queue Worker. |
| `make server` | Lance uniquement `php artisan serve`. |
| `make queue` | Lance le worker de queue. |
| `make mcp` | Lance le serveur MCP Node.js. |
| `make lint` | Formate le code avec Laravel Pint. |
| `make test` | Lance les tests PHPUnit/Pest. |
| `make db-reset` | Réinitialise la base de données et les données de test. |

## Fonctionnalités Principales

### 1. Authentification & Social Login
- Authentification classique par e-mail/mot de passe.
- Connexion via GitHub (OAuth). Configurez `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` dans votre `.env`.

### 2. Gestion Métier
- **Films** : Catalogue géré par les administrateurs.
- **Emplacements** : Lieux de tournage ajoutés par les utilisateurs connectés.
- **Upvotes** : Système de vote asynchrone utilisant les Queues Laravel.

### 3. API Premium & Stripe
- Accès API JSON sécurisé par JWT (`/api/...`).
- Nécessite un abonnement actif géré via Stripe.
- Configurez `STRIPE_KEY` et `STRIPE_SECRET` dans votre `.env`.

### 4. Automatisation
- Une commande Artisan (`app:cleanup-locations`) nettoie automatiquement les emplacements obsolètes. Elle est planifiée quotidiennement.

### 5. Intégration IA (MCP)
- Le serveur MCP permet à un client compatible (comme Claude Desktop ou Gemini CLI) d'interroger la base de données des films et lieux.

## Documentation technique
Pour plus de détails sur l'implémentation, consultez [EXPLAINATION.md](EXPLAINATION.md).
