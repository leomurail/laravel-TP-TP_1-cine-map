# 🎨 Laravel Pint

Laravel Pint est un fixeur de style de code PHP pour les minimalistes. Il permet de s'assurer que ton code PHP reste propre, lisible et cohérent avec les standards de Laravel.

## 🚀 Pourquoi utiliser Pint ?

- **Cohérence :** Tout le code du projet suit les mêmes règles de formatage.
- **Automatisme :** Ne perds plus de temps à formater tes fichiers manuellement.
- **Simplicité :** Pas de configuration complexe, il fonctionne "out-of-the-box".

## ⚙️ Installation et Configuration

Voici comment Pint a été mis en place sur ce projet :

### 1. Installation
Pint a été installé comme dépendance de développement via Composer :
```bash
composer require laravel/pint --dev
```

### 2. Le fichier de règles (`pint.json`)
Un fichier `pint.json` a été créé à la racine pour définir le style à appliquer. Nous utilisons le standard officiel de Laravel :
```json
{
    "preset": "laravel"
}
```

### 3. Automatisation (`composer.json`)
Pour simplifier son utilisation, deux scripts ont été ajoutés dans le fichier `composer.json` :
- `"lint"` : Pour corriger automatiquement les fichiers.
- `"lint:check"` : Pour vérifier le style sans modifier les fichiers (idéal pour la CI).

## 🛠️ Utilisation au quotidien

### Corriger le style de code
```bash
composer run lint
```

### Vérifier sans modifier
```bash
composer run lint:check
```

### Utilisation ciblée
Tu peux aussi viser un dossier ou un fichier précis :
```bash
./vendor/bin/pint app/Models
```

## 💡 Astuce
Prends l'habitude de lancer `composer run lint` avant chaque commit pour garantir que ton code est toujours impeccable !
