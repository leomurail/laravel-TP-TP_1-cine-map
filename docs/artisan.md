# 💻 Le système de commandes Artisan

Artisan est l'interface en ligne de commande (CLI) incluse avec Laravel. C'est ton assistant personnel pour automatiser des tâches répétitives.

### ⚙️ Le principe (Analogie)
Si ton application était un **vaisseau spatial**, Artisan serait le **panneau de contrôle** :
- Tu ne touches pas aux composants internes (le code) directement.
- Tu tapes des commandes pour effectuer des actions précises : "Lancer les moteurs", "Vérifier le carburant", "Nettoyer les ponts".

### 🛠️ Les commandes standard
Laravel vient avec des dizaines de commandes prêtes à l'emploi :
- `php artisan make:controller` : Pour créer un nouveau contrôleur.
- `php artisan migrate` : Pour mettre à jour ta base de données.
- `php artisan route:list` : Pour voir toutes les adresses de ton site.

### 👤 Les commandes personnalisées
Sur ce projet, nous avons créé des commandes spécifiques pour nos besoins métier. Tu peux les trouver dans `app/Console/Commands/`.

#### 1. Nettoyage automatique (`app:cleanup-locations`)
Cette commande fait le ménage dans la base de données.
- **Principe :** Elle cherche les lieux qui ont plus de 14 jours et moins de 2 votes pour les supprimer.
- **Lancement :** `php artisan app:cleanup-locations`

#### 2. Création d'Admin (`app:create-admin-user`)
Permet de créer rapidement un administrateur sans passer par l'interface web.
- **Lancement :** `php artisan app:create-admin-user` (elle te demandera ensuite le nom, l'email et le mot de passe).

### ⏰ Automatisation (Le Scheduler)
Le vrai pouvoir d'Artisan, c'est de pouvoir **planifier** ces commandes. 
Par exemple, la commande de nettoyage est configurée pour s'exécuter **tous les jours à minuit** automatiquement, sans que tu n'aies rien à faire. Cela se passe dans `routes/console.php`.

### 💡 Pourquoi l'utiliser ?
- **Vitesse :** C'est beaucoup plus rapide que de faire les choses à la main en base de données.
- **Fiabilité :** Le code de la commande est testé et réutilisable.
- **Maintenance :** Les tâches lourdes sont déportées en dehors de l'interface web.
