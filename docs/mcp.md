# 🤖 Le système MCP (Intelligence Artificielle)

Ce document explique comment le Chatbot de CineMap utilise le protocole MCP pour interagir avec tes données.

## 🚀 Le principe

Le **Model Context Protocol (MCP)** est une interface qui permet à une IA (ici **Zen de OpenCode**) de ne pas seulement "discuter", mais de "faire des choses" dans ton application.

### Comment ça marche ?
1. **L'IA reçoit une question :** "Quels sont les films enregistrés ?"
2. **L'IA choisit un outil :** Elle voit qu'elle a un outil `list_films_tool`.
3. **L'application exécute l'outil :** Laravel interroge la base de données et renvoie le résultat à l'IA.
4. **L'IA répond :** Elle utilise les données reçues pour formuler une réponse exacte.

---

## 🛠️ Les Outils disponibles

Nous avons exposé deux outils métier à l'IA :

1. **`list_films_tool`** : Liste tous les films présents dans la base de données CineMap.
2. **`get_locations_for_film_tool`** : Récupère tous les lieux de tournage associés à un ID de film spécifique.

---

## 💻 Configuration Technique

### Fournisseur d'IA
Le projet utilise désormais **Zen (OpenCode)**. Zen est compatible avec l'API OpenAI, ce qui nous permet d'utiliser les fonctionnalités avancées de "Function Calling" pour nos outils MCP.

- **Endpoint :** `https://opencode.ai/zen/v1`
- **Modèle par défaut :** `big-pickle`

### Le Serveur MCP
Le serveur est défini dans `app/Mcp/Servers/CineMapServer.php`. Il centralise les outils et peut être testé via la commande Artisan :

```bash
php artisan mcp:start cinemap
```

## 💡 Pourquoi c'est puissant ?
Grâce au MCP, ton chatbot n'invente rien. S'il ne connaît pas un film, il va utiliser l'outil pour le chercher dans ta base. Cela garantit une fiabilité totale des informations données aux utilisateurs tout en utilisant la puissance de l'IA Zen.
