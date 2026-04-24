# Plan d'implémentation - CineMap

## Étape 4 - Queues et Jobs (Système d'Upvotes)
- [x] Créer la migration pour la table `location_votes`
- [x] Créer le modèle `LocationVote`
- [x] Définir les relations dans les modèles
- [x] Créer le Job `UpdateLocationUpvotes`
- [x] Ajouter la route `POST /locations/{location}/upvote`
- [x] Implémenter la logique de vote dans `LocationController`
- [x] Mettre à jour l'interface avec le bouton d'Upvote

## Étape 5 - Commande Artisan + Tâche planifiée
- [x] Créer la commande `app:cleanup-locations`
- [x] Implémenter la logique de suppression (14 jours + moins de 2 upvotes)
- [x] Enregistrer la commande dans le scheduler

## Étape 6 - Laravel Pint
- [x] Lancer `./vendor/bin/pint` pour formater le code

## Étape 7 - OAuth (GitHub)
- [x] Installer Socialite
- [x] Migration pour `github_id` et `github_token`
- [x] Créer `SocialController`
- [x] Ajouter le bouton "Login with GitHub" sur la page de connexion
**(Socialize package)**

## Étape 8 - Stripe Subscriptions & JWT API
- [x] Installer Cashier et JWT Auth
- [x] Configurer Cashier (migrations + trait Billable)
- [x] Configurer JWT (secret + interface JWTSubject)
- [x] Créer `SubscriptionController` et page d'abonnement
- [x] Créer la route API `/api/films/{film}/locations` protégée par JWT et abonnement

## Étape 9 - MCP Server
- [x] Initialiser le serveur Node.js dans `/mcp-server`
- [x] Implémenter les outils `list_films` et `get_locations_for_film`
- [x] Documenter l'utilisation dans le `README.md`
