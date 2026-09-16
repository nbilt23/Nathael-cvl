# Mettre le site en ligne sur nathael-cvl.fr

## 1. Le site

`index.html` est un fichier unique, sans dépendance à installer. Il suffit de le déposer chez un hébergeur statique :

- **Netlify** ou **Cloudflare Pages** : glisser le dossier, puis brancher le domaine `nathael-cvl.fr` dans les réglages (ils fournissent le HTTPS).
- **GitHub Pages** : pousser le fichier dans un dépôt, activer Pages, ajouter un fichier `CNAME` contenant `nathael-cvl.fr`.

Chez le registrar du domaine, il faudra pointer les enregistrements DNS vers l'hébergeur choisi (il donne les valeurs exactes).

## 2. La boîte à idées

Par défaut le site tourne en **mode démo** : les idées restent dans le navigateur de la personne, elles ne t'arrivent pas. C'est pratique pour tester, inutilisable pour de vrai.

Pour que les idées arrivent vraiment quelque part :

1. Créer un tableur sur Google Sheets (n'importe quel nom).
2. Menu **Extensions → Apps Script**, effacer le contenu, coller `backend-apps-script.gs`.
3. En haut du script, remplacer `change-moi-vraiment` par ton code d'accès à la modération.
4. **Déployer → Nouveau déploiement → Application web**
   - Exécuter en tant que : **moi**
   - Accès : **tout le monde**
5. Copier l'URL du déploiement (`https://script.google.com/macros/s/.../exec`).
6. Dans `index.html`, en haut du `<script>`, modifier le bloc `CONFIG` :

```js
const CONFIG = {
  mode: "script",
  endpoint: "https://script.google.com/macros/s/.../exec",
  demoCode: ""
};
```

À partir de là, les idées atterrissent dans le tableur avec le statut `pending`, et seules celles que tu passes en `published` apparaissent sur le mur.

## 3. La modération

L'interface est à l'adresse **`nathael-cvl.fr/#admin`** (le point discret en bas de page y mène aussi). Code d'accès demandé, puis deux onglets : *En attente* et *Publiées*. Chaque idée peut être publiée, retirée du mur ou supprimée.

À savoir : en mode démo, le code est écrit dans le fichier, donc lisible par n'importe qui. En mode `script`, il est vérifié côté Google et n'apparaît jamais dans le code source du site — c'est le mode à utiliser une fois en ligne.

## 4. Choses à personnaliser avant publication

- La citation de la salle 03 : je l'ai écrite à partir de ce que tu m'as dit, réécris-la avec tes mots.
- Les chiffres du hall (4 / 4 / 3 000 € / 5) : ce sont eux qui portent le site, vérifie-les.
- La salle 05 (« ce que le CVL peut faire ») : à confirmer avec la vie scolaire ou le proviseur adjoint avant mise en ligne.
- Les photos : dès que tu en as (téléthon, bal, cross), on les intègre — c'est ce qui manque le plus.
