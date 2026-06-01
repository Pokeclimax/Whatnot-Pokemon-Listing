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

1. Ouvrez le modèle CSV officiel Whatnot et faites **Fichier > Créer une copie** dans Google Sheets [page:1].
2. Dans `apps-script.gs`, renseignez :
   - `SPREADSHEET_ID`
   - `SHEET_NAME`
   - `EXPECTED_TOKEN`
3. Déployez Apps Script en **Application Web** avec :
   - **Exécuter en tant que :** Moi
   - **Qui a accès :** Tout le monde
4. Dans `tampermonkey.user.js`, renseignez :
   - `WEBAPP_URL`
   - `API_TOKEN`
5. Ouvrez une carte sur Pokecardex et cliquez sur **Ajouter au Google Sheet**.

## Workflow Whatnot

Whatnot fournit le modèle CSV de base, recommande de le **dupliquer dans Google Sheets**, puis de le **télécharger en CSV** avant import [page:1]. L'import peut servir à créer des **drafts** dans Seller Hub ou des **temporary listings** pour un show [page:1].

## Important

- Cet outil n'est pas affilié à Pokecardex ni à Whatnot.
- Il dépend de la structure du site Pokecardex.
- Certaines colonnes Whatnot doivent rester conformes aux valeurs autorisées du modèle officiel [page:1].
- Les URLs d'images doivent être publiques en `https://` [page:1].

## Licence

MIT
