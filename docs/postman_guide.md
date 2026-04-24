# 🚀 Guide de Test API avec Postman

Ce document regroupe toutes les requêtes nécessaires pour tester l'API CineMap, de l'authentification à l'accès aux données premium.

## 🔑 1. Authentification (JWT)

Avant toute chose, vous devez vous connecter pour obtenir un jeton **Bearer**.

### Login
- **URL** : `http://localhost:8000/api/login`
- **Méthode** : `POST`
- **Headers** : 
    - `Accept`: `application/json`
- **Body (JSON)** :
```json
{
    "email": "admin@gmail.com",
    "password": "test1234"
}
```
- **Réponse attendue** :
```json
{
    "access_token": "eyJ0eXAiOiJKV1R...",
    "token_type": "bearer",
    "expires_in": 3600
}
```

---

## 📍 2. Gestion des Lieux (Premium)

Toutes ces routes nécessitent un **Token Bearer** et un **Abonnement Actif**.

### Liste des lieux par film
- **URL** : `http://localhost:8000/api/films/1/locations`
- **Méthode** : `GET`
- **Auth** : `Bearer Token` (Collez le jeton reçu au login)

### Détails d'un lieu
- **URL** : `http://localhost:8000/api/locations/{id}` (ex: `/api/locations/1`)
- **Méthode** : `GET`
- **Auth** : `Bearer Token`

### Voter pour un lieu (Upvote)
- **URL** : `http://localhost:8000/api/locations/{id}/upvote`
- **Méthode** : `POST`
- **Auth** : `Bearer Token`

---

## 🤖 3. Chatbot (Agent IA)

### Envoyer un message au Chat
- **URL** : `http://localhost:8000/chat`
- **Méthode** : `POST`
- **Body (JSON)** :
```json
{
    "message": "Quels sont les lieux pour le film Test ?",
    "model": "big-pickle"
}
```
*(Note : Cette route utilise l'authentification session classique du web, mais peut être adaptée pour l'API si nécessaire).*

---

## 🛠️ Erreurs Communes

| Code | Signification | Solution |
| :--- | :--- | :--- |
| **401 Unauthorized** | Token manquant ou expiré | Refaire un Login et mettre à jour le Bearer Token dans Postman. |
| **403 Forbidden** | Pas d'abonnement actif | Vérifier que l'utilisateur a un abonnement Stripe valide (ou forcer `true` en base de données pour les tests). |
| **422 Unprocessable Content** | Données manquantes (ex: email) | Vérifier le JSON envoyé dans le Body. |

---

## 💡 Astuce Postman
Pour ne pas copier-coller le token à chaque fois, vous pouvez utiliser un script dans l'onglet **Tests** de la requête Login :
```javascript
var jsonData = pm.response.json();
pm.environment.set("jwt_token", jsonData.access_token);
```
Ensuite, dans les autres requêtes, mettez `{{jwt_token}}` dans le champ Bearer Token.
