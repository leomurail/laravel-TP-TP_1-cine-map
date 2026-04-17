# CineMap - Démarche Technique

Ce document détaille les choix techniques et la démarche suivis pour le TP CineMap.

## Étape 1 : Authentification
L'authentification a été mise en place en utilisant le **Starter Kit Laravel React** (Inertia + Fortify).

## Étape 2 : Les 2 CRUDs Métier (Film & Location)
- **Film** : Relation `hasMany` vers `Location`.
- **Location** : Lié à un `Film` et à un `User`. Validé via FormRequests.

## Étape 3 : Middleware Administrateur et Sécurité
- **Middleware `admin`** : Protège les routes de création/édition de films.
- **Policies** : `LocationPolicy` restreint l'édition des lieux à leurs auteurs ou aux admins.

## Étape 4 : Système d'Upvotes (Queues & Jobs)
- **Logique** : Un utilisateur peut voter pour un lieu (table `location_votes` avec index unique).
- **Asynchronisme** : Le vote déclenche le Job `UpdateLocationUpvotes`. Le calcul du total est fait en arrière-plan pour ne pas bloquer l'utilisateur.
- **Queue** : Utilisation du driver `database` (configuré par défaut dans le starter).

## Étape 5 : Nettoyage Automatique (Artisan & Scheduler)
- **Commande** : `app:cleanup-locations` supprime les lieux de plus de 14 jours ayant moins de 2 upvotes.
- **Planification** : Enregistrée dans `routes/console.php` pour s'exécuter quotidiennement.

## Étape 6 : Formatage (Laravel Pint)
- Utilisation de **Pint** pour garantir un code propre et conforme aux standards PSR-12.

## Étape 7 : Connexion Sociale (OAuth)
- **Socialite** : Intégration de GitHub.
- **Flux** : Les utilisateurs peuvent se connecter sans mot de passe. Si le compte n'existe pas, il est créé à la volée à partir des données GitHub.

## Étape 8 : Abonnement Stripe & API Premium
- **Cashier** : Gestion des abonnements Stripe.
- **JWT Auth** : Sécurisation de l'API sans sessions. Le token est requis pour chaque requête.
- **Middleware `subscribed`** : Vérifie en temps réel si l'utilisateur possède un abonnement actif avant de livrer les données JSON.

## Étape 9 : MCP Server (AI Integration)
- **Node.js** : Un serveur minimal utilisant le protocole MCP permet à une IA d'interroger la base SQLite.
- **Outils** : `list_films` et `get_locations_for_film` exposent les données essentielles en lecture seule.

## Conclusion
L'application CineMap est désormais complète, couvrant tous les aspects demandés : de l'authentification robuste au système de paiement, en passant par l'intégration moderne pour les IA.
