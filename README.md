# Pokecardex Whatnot Helper

Outil gratuit pour envoyer rapidement le **titre** et l'**image** d'une carte Pokecardex vers le modèle Google Sheets utilisé pour l'import CSV Whatnot.

## Ce que fait l'outil

Depuis `pokecardex.com/collection`, le bouton ajoute automatiquement :
- **C / Title**
- **N / Image URL 1**

Le titre est construit à partir du :
- nom de la carte ;
- rareté ;
- code de série.

`Sans rareté` est ignoré dans le titre final.

## Fichiers

- `tampermonkey.user.js` : script à installer dans Tampermonkey
- `apps-script.gs` : script Google Apps Script relié à votre Google Sheet

## Installation rapide

### 1) Ouvrir le modèle Whatnot

Whatnot fournit le modèle CSV officiel ici : [Bulk import products from a CSV file](https://help.whatnot.com/hc/en-us/articles/7440530071821-Bulk-import-products-from-a-CSV-file) [page:1].

Ouvrez le bon modèle, puis faites **File > Make a copy** dans Google Sheets. Whatnot recommande de remplir le fichier dans **Google Sheets** plutôt que dans Excel [page:1].

### 2) Installer Apps Script

1. Ouvrez votre copie du modèle Whatnot dans Google Sheets.
2. Allez dans **Extensions > Apps Script**.
3. Créez un nouveau projet ou un nouveau fichier script.
4. Copiez-collez le contenu de `apps-script.gs`.
5. Modifiez :
   - `SPREADSHEET_ID`
   - `SHEET_NAME`
   - `EXPECTED_TOKEN`

Le `SPREADSHEET_ID` se trouve dans l'URL de votre Google Sheet, entre `/d/` et `/edit`.

Exemple :
```text
https://docs.google.com/spreadsheets/d/abc123456789/edit
```

Ici, le `SPREADSHEET_ID` est :
```text
abc123456789
```

`SHEET_NAME` doit correspondre exactement au nom de l'onglet utilisé dans votre copie du modèle Whatnot.

`EXPECTED_TOKEN` est une clé simple de sécurité. Vous pouvez mettre la valeur que vous voulez, mais elle devra être exactement la même dans `apps-script.gs` et dans `tampermonkey.user.js`.

### 3) Déployer le Web App

Dans Apps Script :

1. Cliquez sur **Déployer > Nouveau déploiement** [page:2].
2. Choisissez **Application Web** [page:2].
3. Réglez :
   - **Exécuter en tant que :** Moi [page:2]
   - **Qui a accès :** Tout le monde
4. Déployez et autorisez l'accès si Google le demande.
5. Copiez l'URL `/exec` donnée par Google Apps Script [page:2].

### 4) Installer Tampermonkey

1. Installez l'extension **Tampermonkey** sur votre navigateur.
2. Créez un nouveau script.
3. Copiez-collez le contenu de `tampermonkey.user.js`.
4. Modifiez :
   - `WEBAPP_URL` avec l'URL `/exec` obtenue au déploiement
   - `API_TOKEN` avec le même token que dans `EXPECTED_TOKEN`
5. Enregistrez le script.

### 5) Utilisation

1. Ouvrez `https://www.pokecardex.com/collection`.
2. Ouvrez l'aperçu d'une carte.
3. Cliquez sur **Ajouter au Google Sheet**.
4. Le script remplit automatiquement **C / Title** et **N / Image URL 1** dans votre copie du modèle Whatnot.

Quand votre fichier est prêt, faites **File > Download > CSV** dans Google Sheets, puis importez le CSV dans Whatnot [page:1]. Whatnot permet d'utiliser ce CSV soit pour créer des **drafts** dans Seller Hub, soit pour créer des **temporary listings** pour un show [page:1].

## Pourquoi utiliser un token

Le Web App est accessible via une URL publique pour pouvoir recevoir la requête envoyée par Tampermonkey. Le token sert donc à vérifier que la requête vient bien de votre script.

Sans token, quelqu'un qui connaît l'URL de votre Web App pourrait essayer d'écrire dans votre Google Sheet. Ne publiez donc jamais votre vraie URL Web App, votre vrai token ou votre vrai `SPREADSHEET_ID` dans un tutoriel public.

## Important

- Cet outil n'est pas affilié à Pokecardex ni à Whatnot.
- Il dépend de la structure du site Pokecardex.
- Certaines colonnes Whatnot doivent respecter exactement les valeurs autorisées du modèle ou de l'onglet **Values** [page:1].
- Les images doivent être accessibles publiquement en `https://` pour l'import Whatnot [page:1].
- Chaque utilisateur doit utiliser **son propre** Google Sheet, **son propre** Apps Script, **sa propre** URL Web App et **son propre** token.

## Tutoriel vidéo

[Voir le tutoriel vidéo sur YouTube](https://youtu.be/f2418JTvVgk)

## Licence

MIT
