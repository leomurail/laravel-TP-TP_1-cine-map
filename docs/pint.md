# 🎨 Laravel Pint

Laravel Pint est un fixeur de style de code PHP pour les minimalistes. Il est basé sur PHP-CS-Fixer et permet de s'assurer que ton code PHP reste propre, lisible et cohérent avec les standards de Laravel.

## 🚀 Pourquoi utiliser Pint ?

- **Cohérence :** Tout le code du projet suit les mêmes règles de formatage.
- **Automatisme :** Ne perds plus de temps à formater tes fichiers manuellement.
- **Simplicité :** Pas de configuration complexe, il fonctionne "out-of-the-box" avec le style Laravel.

## 🛠️ Utilisation

Le projet est configuré avec des scripts Composer pour faciliter l'utilisation de Pint.

### Corriger le style de code
Pour scanner et corriger automatiquement tous les fichiers PHP du projet :
```bash
composer run lint
```
*Cette commande exécute `pint --parallel`.*

### Vérifier sans modifier
Pour vérifier si des fichiers ne respectent pas le style sans les modifier (utile pour la CI) :
```bash
composer run lint:check
```
*Cette commande exécute `pint --parallel --test`.*

### Utilisation avancée
Tu peux aussi utiliser le binaire directement pour cibler des fichiers spécifiques :
```bash
./vendor/bin/pint app/Models/User.php
```

## ⚙️ Configuration

La configuration se trouve dans le fichier `pint.json` à la racine du projet. Par défaut, il utilise le preset `laravel` :

```json
{
    "preset": "laravel"
}
```

## 💡 Astuce
Prends l'habitude de lancer `composer run lint` avant chaque commit pour garantir que ton code est toujours impeccable !
