# 🛣️ Organisation des Routes

Ce document explique pourquoi le projet CineMap utilise plusieurs fichiers de routes et quel est le rôle de chacun.

## 📂 Pourquoi plusieurs fichiers ?

Plutôt que d'avoir un seul fichier `web.php` géant et illisible, nous avons divisé les routes par **responsabilité**. Cela facilite la maintenance et permet d'appliquer des réglages différents (sécurité, sessions) selon le type de route.

---

## 📍 Détail des fichiers

### 1. `web.php` (Interface Utilisateur)
C'est le fichier principal pour le navigateur.
- **Rôle :** Gérer l'affichage des pages (Dashboard, Films, Lieux).
- **Caractéristiques :** Utilise les sessions, les cookies et la protection CSRF.

### 2. `api.php` (Services Externes)
Destiné aux appels programmatiques (Mobile, Services tiers).
- **Rôle :** Fournir des données brutes (JSON).
- **Caractéristiques :** Sans session (stateless), sécurité renforcée par défaut (ex: `subscribed`).

### 3. `console.php` (Tâches Automatisées)
Ce n'est pas pour le Web, mais pour le système.
- **Rôle :** Définir des commandes rapides et **planifier** les tâches automatiques (Scheduler).
- **Exemple :** C'est ici qu'on dit à Laravel de lancer le nettoyage des lieux chaque nuit.

### 4. `settings.php` (Gestion du Compte)
Un fichier spécialisé pour garder `web.php` propre.
- **Rôle :** Regrouper tout ce qui touche au profil utilisateur (Sécurité, Mot de passe, Apparence).

### 5. `ai.php` (Intelligence Artificielle)
Isolé pour plus de clarté sur cette fonctionnalité complexe.
- **Rôle :** Gère les routes liées au Chatbot et aux interactions avec Gemini/Claude.

---

## 🛠️ Comment ils sont reliés ?

Dans Laravel 11, ces fichiers sont chargés automatiquement via `bootstrap/app.php`. 

Pour les fichiers personnalisés comme `settings.php` et `ai.php`, ils sont importés directement à la fin du fichier `web.php` avec une commande `require` :

```php
// Dans web.php
require __DIR__.'/settings.php';
require __DIR__.'/ai.php';
```

## 💡 Avantages
- **Clarté :** On sait exactement où chercher une route.
- **Sécurité :** On peut appliquer des middlewares à tout un fichier d'un coup.
- **Évolutivité :** On peut ajouter de nouvelles fonctionnalités sans polluer le reste du code.
