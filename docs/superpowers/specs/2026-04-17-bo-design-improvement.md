# Spécifications Design : Amélioration du Back-Office (BO)

**Date :** 17 Avril 2026
**Sujet :** Refonte visuelle des pages Index des Films et des Lieux.
**Style :** Brutaliste / Catalogue Industriel.

## 1. Objectifs
- Renforcer l'identité visuelle "brutaliste" (fort contraste, typos géantes, style "imprimé").
- Améliorer l'expérience utilisateur en cas de liste vide (Empty States).
- Structurer les données sous forme d'inventaire industriel plutôt que de simples listes.

## 2. Page Catalogue de Films (`/films`)

### Architecture de la Carte (Grid Item)
- **Conteneur :** Bordure noire de 2px (`border-2 border-black`), angles droits (`rounded-none`).
- **Header de Carte :** Bandeau supérieur avec `REF: #ID` et `DATE: YEAR` en police mono (taille XS).
- **Placeholder Visuel :** Lettre géante (initiale du titre) avec un fond texturé (grain ou motif subtil).
- **Typographie :** Titre en majuscules, gras, interlignage serré. Synopsis limité à 2 lignes avec `line-clamp-2`.
- **Actions :** Boutons "Éditer" et "Supprimer" en bas, séparés par une bordure, style "onglets".

### État Vide
- Cadre central en pointillés (`border-dashed border-2`).
- Message : "ARCHIVE VIDE / AUCUN TITRE RÉPERTORIÉ" en majuscules.
- Bouton d'action principal "+ AJOUTER UN FILM" centré.

## 3. Page Exploration des Lieux (`/locations`)

### Architecture de la Liste (Row Item)
- **Conteneur :** Fiche horizontale avec une bordure gauche épaisse et colorée (Rouge Rose-600).
- **Structure Triple Colonne :**
    1. **Gauche (Métadonnées) :** Nom du film en rouge (typo mono, gras).
    2. **Centre (Informations) :** Nom du lieu (grande typo) + Ville, Pays avec icône `MapPin`.
    3. **Droite (Stats & Actions) :** Compteur de votes dans un badge noir (`bg-black text-white`).
- **Séparateurs :** Lignes horizontales marquées entre chaque élément.

### État Vide
- Cadre central en pointillés.
- Message : "ZÉRO EMPLACEMENT / EN ATTENTE DE PARTAGE".
- Bouton central : "+ PARTAGER UN LIEU".

## 4. Éléments Communs
- **Palette :** Noir, Blanc, Gris (neutral-100/900), et Rouge (rose-600) pour les accents.
- **Polices :** Sans-serif pour les titres, Mono pour les étiquettes et données techniques.
- **Header de page :** Typos 7xl, majuscules, tracking serré.

## 5. Succès Criteria
- Les pages sont lisibles et esthétiques même avec 0 ou 1 seul élément.
- L'aspect "Back-Office professionnel" est renforcé par le côté "inventaire".
- Pas d'utilisation de composants arrondis ou de dégradés doux.
