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
2. Récupérez le `SPREADSHEET_ID` dans l'URL de votre Google Sheet. C'est la partie entre `/d/` et `/edit`. Exemple : dans `https://docs.google.com/spreadsheets/d/abc123456789/edit`, le `SPREADSHEET_ID` est `abc123456789` [page:2].
3. Dans `apps-script.gs`, renseignez :
   - `SPREADSHEET_ID`
   - `SHEET_NAME`
   - `EXPECTED_TOKEN`
4. Déployez Apps Script en **Application Web** avec :
   - **Exécuter en tant que :** Moi
   - **Qui a accès :** Tout le monde
5. Dans `tampermonkey.user.js`, renseignez :
   - `WEBAPP_URL`
   - `API_TOKEN`
6. Ouvrez une carte sur Pokecardex et cliquez sur **Ajouter au Google Sheet**.

## Pourquoi utiliser un token

Le Web App Google Apps Script est exposé via une URL publique pour pouvoir recevoir la requête envoyée par Tampermonkey. Le **token** sert donc de clé simple de vérification : le userscript envoie le token, et Apps Script refuse la requête si le token ne correspond pas.

Sans token, une personne qui connaît l'URL du Web App pourrait essayer d'écrire dans votre Google Sheet. Il faut donc choisir un token privé, le garder identique dans `apps-script.gs` et `tampermonkey.user.js`, et ne pas publier votre vraie valeur sur GitHub.

## Workflow Whatnot

Whatnot fournit le modèle CSV de base, recommande de le **dupliquer dans Google Sheets**, puis de le **télécharger en CSV** avant import [page:1]. L'import peut servir à créer des **drafts** dans Seller Hub ou des **temporary listings** pour un show [page:1].

## Important

- Cet outil n'est pas affilié à Pokecardex ni à Whatnot.
- Il dépend de la structure du site Pokecardex.
- Certaines colonnes Whatnot doivent rester conformes aux valeurs autorisées du modèle officiel [page:1].
- Les URLs d'images doivent être publiques en `https://` [page:1].

## Licence

MIT
