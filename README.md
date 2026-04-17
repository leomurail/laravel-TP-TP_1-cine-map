# CineMap - Gestion d'emplacements de tournage

CineMap est une application Laravel permettant de répertorier et de gérer des lieux de tournage de films.

## Installation

1. **Clonage et dépendances** :
   ```bash
   composer install
   npm install
   ```

2. **Configuration de l'environnement** :
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Base de données** :
   Assurez-vous que `DB_CONNECTION=sqlite` est présent dans votre `.env` (et créez le fichier `database/database.sqlite` s'il n'existe pas), puis lancez :
   ```bash
   php artisan migrate
   ```

## Lancement de l'application

1. **Serveur Backend (Laravel)** :
   ```bash
   php artisan serve
   ```

2. **Serveur Frontend (Vite/React)** :
   ```bash
   npm run dev
   ```

Accédez ensuite à l'application via `http://localhost:8000`.

## Utilisation

### 1. Authentification
- Vous pouvez vous inscrire via le bouton **Register** sur la page d'accueil.
- Une fois connecté, vous accédez au tableau de bord.

### 2. Gestion des Films (Admin uniquement)
- Pour devenir administrateur, vous pouvez modifier votre utilisateur dans la base de données (`is_admin = 1`) ou utiliser `php artisan tinker`.
- Les administrateurs peuvent ajouter, modifier et supprimer des films via le menu **Films** dans la barre latérale.

### 3. Gestion des Emplacements (Utilisateurs connectés)
- Tous les utilisateurs connectés peuvent voir les emplacements et en ajouter via le menu **Emplacements**.
- Un utilisateur ne peut modifier ou supprimer que les emplacements qu'il a lui-même créés (sauf s'il est administrateur).
- Les utilisateurs connectés peuvent **upvoter** un emplacement (une seule fois par lieu).

## Fonctionnalités Avancées

### 1. Système d'Upvotes (Queues & Jobs)
- Lorsque vous upvotez un lieu, un job est mis en file d'attente pour recalculer la popularité.
- Pour tester cela localement, lancez le worker de queue :
  ```bash
  php artisan queue:work
  ```

### 2. Nettoyage Automatique (Commande Artisan)
- Une commande personnalisée supprime les emplacements de plus de 14 jours avec moins de 2 upvotes.
- Pour tester manuellement la commande :
  ```bash
  php artisan app:cleanup-locations
  ```
- Elle est planifiée pour s'exécuter quotidiennement.

### 3. Qualité du Code (Laravel Pint)
- Le code suit les standards PSR-12 grâce à Laravel Pint.
- Commande de formatage :
  ```bash
  ./vendor/bin/pint
  ```

## Documentation technique
Pour plus de détails sur l'implémentation et les choix techniques, consultez le fichier [EXPLAINATION.md](EXPLAINATION.md).

## Configuration Avancée

### 1. OAuth (GitHub)
- Créez une application OAuth sur GitHub.
- Définissez l'URL de rappel sur `http://localhost:8000/auth/github/callback`.
- Ajoutez les clés dans votre `.env` :
  ```env
  GITHUB_CLIENT_ID=votre_client_id
  GITHUB_CLIENT_SECRET=votre_client_secret
  ```

### 2. Stripe & API Premium (JSON + JWT)
- Configurez vos clés Stripe dans le `.env` :
  ```env
  STRIPE_KEY=votre_cle_publique
  STRIPE_SECRET=votre_cle_secrete
  ```
- Créez un produit "Premium API" dans Stripe et récupérez l'ID du prix.
- Mettez à jour l'ID du prix dans `SubscriptionController.php`.
- **Utilisation de l'API** :
  - Identifiez-vous via `POST /api/login` pour recevoir un token.
  - Utilisez ce token dans le header `Authorization: Bearer {token}`.
  - Seuls les abonnés peuvent accéder à `GET /api/films/{film}/locations`.

### 3. MCP Server (AI Integration)
- Un serveur MCP (Model Context Protocol) est disponible dans le dossier `/mcp-server`.
- Pour l'utiliser :
  1. `cd mcp-server`
  2. `npm install`
  3. `npm start`
- Outils disponibles : `list_films`, `get_locations_for_film`.

