# 🚀 Implémentation de l'API (Étape 8 du Brief)

Ce document détaille comment la route API protégée par abonnement a été mise en œuvre pour répondre aux exigences du projet.

## 📋 Exigences du Brief
1. **Route :** `GET /api/films/{film}/locations`
2. **Format :** Réponse JSON contenant le film, ses lieux et les votes.
3. **Sécurité :** Authentification par Token **JWT**.
4. **Accès :** Réservé exclusivement aux utilisateurs ayant un **abonnement Stripe actif**.

---

## 🛠️ Architecture Technique

### 1. Authentification JWT
Nous avons choisi **JWT (JSON Web Token)** pour permettre une authentification sans session (stateless).
- **Package :** `php-open-source-saver/jwt-auth`.
- **Fonctionnement :** L'utilisateur envoie ses identifiants à `/api/login` et reçoit un token. Ce token doit être envoyé dans chaque requête suivante via l'en-tête `Authorization: Bearer <token>`.

### 2. Gestion des Abonnements (Stripe)
L'intégration repose sur **Laravel Cashier**.
- **Mode :** Stripe Test (permet d'utiliser la carte `4242...`).
- **Validation :** Le statut de l'abonnement est stocké en base de données et synchronisé via des Webhooks Stripe.

### 3. Le Double Verrou (Middleware)
Pour protéger la route, nous utilisons un groupe de middlewares dans `routes/api.php` :
```php
Route::middleware(['auth:api', 'subscribed'])->group(function () {
    Route::get('/films/{film}/locations', [FilmLocationController::class, 'index']);
});
```
- **`auth:api` :** Vérifie l'identité via le token JWT.
- **`subscribed` :** Vérifie le droit d'accès via l'abonnement Stripe.

---

## 📊 Structure de la réponse JSON
La réponse est formatée pour être immédiatement exploitable par un service tiers :

```json
{
    "film": {
        "title": "Inception",
        "release_year": 2010,
        "synopsis": "..."
    },
    "locations": [
        {
            "name": "Pont de Bir-Hakeim",
            "city": "Paris",
            "upvotes_count": 15
        }
    ]
}
```

---

## 🧪 Comment tester ?
Le processus complet de test est le suivant :
1. **S'inscrire** sur l'application Web.
2. **Souscrire** à l'offre Premium via la page `/subscription`.
3. **S'authentifier** via Postman sur `/api/login` pour obtenir le token.
4. **Appeler** la route `/api/films/1/locations` en passant le token.

## 💡 Note sur la Sécurité
Si l'une des deux conditions (Token valide OU Abonnement actif) n'est pas remplie, l'API renvoie une erreur explicite (401 Unauthorized ou 403 Forbidden), garantissant ainsi l'étanchéité du contenu Premium.
