# Pokecardex Whatnot Helper

Un outil gratuit pour les vendeurs de cartes Pokémon qui utilisent Pokecardex pour préparer plus vite leurs imports Whatnot.

Cet outil ajoute un bouton sur `https://www.pokecardex.com/collection` pour récupérer automatiquement :
- un titre propre pour Whatnot en **colonne C**
- l'URL du scan de la carte en **colonne N / Image URL 1**

Le fonctionnement repose sur :
- un **userscript Tampermonkey** sur Pokecardex
- un **Google Apps Script Web App** relié à votre Google Sheet

## Fonctionnalités

- Récupère le nom de la carte depuis la fenêtre d'aperçu Pokecardex
- Récupère la rareté quand elle existe
- Ignore `Sans rareté` dans le titre final
- Extrait le code de série depuis l'URL de l'image du symbole de série
- Extrait l'URL du scan principal de la carte
- Envoie automatiquement les données vers Google Sheets
- Remplit uniquement :
  - **C = Titre**
  - **N = Image URL 1**

## Exemple

Pour une carte comme :
- Nom : `Zekrom ex`
- Rareté : `BWR`
- Code série : `SV11B`
- URL du scan : `https://pokecardex-scans.b-cdn.net/sets_jp/SV11B/174.jpg?class=hd`

L'outil envoie :
- **Titre** : `Zekrom ex BWR SV11B`
- **Image URL 1** : l'URL du scan ci-dessus

Si la rareté est `Sans rareté`, elle n'est pas ajoutée au titre.

---

## Structure du projet

- `tampermonkey.user.js` — script navigateur à utiliser sur Pokecardex
- `apps-script.gs` — backend Google Apps Script pour Google Sheets

---

## Installation

### 1) Dupliquer le modèle Whatnot

Whatnot fournit un **modèle CSV officiel** qu'il faut d'abord ouvrir puis **dupliquer** dans Google Sheets via **Fichier > Créer une copie** [page:1]. Il ne faut pas créer un sheet vide à la main si vous voulez conserver exactement la structure attendue par Whatnot [page:1].

Une fois la copie créée, utilisez l'onglet du modèle Whatnot que vous voulez alimenter avec l'automatisation. Dans l'exemple de ce projet, le nom d'onglet utilisé par défaut est :

```text
Template
```

Le format attendu dans le modèle Whatnot est le suivant :

- A : Catégorie
- B : Sous-catégorie
- C : Titre
- D : Description
- E : Quantité
- F : Type
- G : Prix
- H : Profil de livraison
- I : Offres Acceptées
- J : Matières dangereuses
- K : État
- L : Coût par article
- M : SKU
- N : Image URL 1

Cet outil remplit uniquement **C** et **N**.

### 2) Configurer Google Apps Script

Ouvrez :
- `Extensions` → `Apps Script`

Copiez le contenu de `apps-script.gs`.

Ensuite, modifiez ces valeurs :

```javascript
const SPREADSHEET_ID = 'VOTRE_SPREADSHEET_ID';
const SHEET_NAME = 'Template';
const EXPECTED_TOKEN = 'VOTRE_TOKEN_SECRET';
```

Déployez ensuite en :
- **Application Web**
- **Exécuter en tant que :** Moi
- **Qui a accès :** Tout le monde

Copiez ensuite l'URL `/exec` du déploiement.

### 3) Configurer Tampermonkey

Installez Tampermonkey sur votre navigateur.

Créez un nouveau script et collez le contenu de `tampermonkey.user.js`.

Modifiez ensuite :

```javascript
const WEBAPP_URL = 'VOTRE_URL_WEBAPP';
const API_TOKEN = 'VOTRE_TOKEN_SECRET';
```

Ouvrez ensuite :

```text
https://www.pokecardex.com/collection
```

Ouvrez l'aperçu d'une carte puis cliquez sur :

```text
Ajouter au Google Sheet
```

---

## Utilisation avec le modèle Whatnot

Whatnot permet d'importer des produits en masse via un **fichier CSV**, soit pour créer des **brouillons dans l'inventaire**, soit pour créer des **listings temporaires pour un show** [page:1]. Whatnot fournit des **modèles CSV** à copier et recommande de les remplir dans **Google Sheets** plutôt que dans Excel avant de télécharger le fichier en CSV pour l'import [page:1].

### Étapes conseillées

1. Ouvrez le modèle CSV officiel Whatnot adapté à votre compte puis faites **Fichier > Créer une copie** dans Google Sheets [page:1].
2. Gardez la structure du modèle Whatnot avec les colonnes : `Category`, `Sub Category`, `Title`, `Description`, `Quantity`, `Type`, `Price`, `Shipping Profile`, `Offerable`, `Hazardous Materials`, `Condition`, `Cost per item`, `SKU`, `Image URL 1` [page:1].
3. Reliez ensuite ce Google Sheet à `apps-script.gs` en mettant le bon `SPREADSHEET_ID` et le bon nom d'onglet [page:1].
4. Utilisez cet outil pour remplir uniquement :
   - **C / Title**
   - **N / Image URL 1**
5. Complétez ensuite manuellement les autres colonnes fixes de votre workflow dans Google Sheets, puis faites glisser vos formules ou valeurs vers le bas.
6. Quand tout est prêt, faites **Fichier > Télécharger > CSV** dans Google Sheets, puis importez ce CSV dans Whatnot [page:1].

### Points importants Whatnot

- Certaines colonnes comme **Category**, **Sub Category**, **Type**, **Condition** et **Shipping Profile** doivent correspondre exactement aux valeurs autorisées par Whatnot dans le modèle ou dans l'onglet **Values** [page:1].
- Whatnot accepte jusqu'à **8 URLs d'image** par produit, et les liens doivent être **publics**, en `https://`, sans connexion requise [page:1].
- Pour un import dans **Seller Hub**, les produits arrivent comme **drafts** ; il faut au moins **une image** par produit avant publication [page:1].
- Vous pouvez aussi utiliser l'import CSV pour ajouter rapidement des **temporary listings** à un show spécifique [page:1].

## Notes importantes

- Cet outil n'est **pas affilié** à Pokecardex ni à Whatnot.
- Il dépend de la structure HTML de Pokecardex et peut cesser de fonctionner si le site est modifié.
- Utilisation à vos risques.
- Gardez votre token Apps Script privé.

---

## Licence

Licence MIT.
