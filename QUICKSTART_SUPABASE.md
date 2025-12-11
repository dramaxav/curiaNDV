# 🚀 Démarrage Rapide Supabase (5 Minutes)

## ✨ C'est parti !

Suivez ces étapes **dans l'ordre** pour avoir l'app complètement fonctionnelle avec base de données temps réel.

---

## Étape 1️⃣ : Créer le Projet Supabase (2 min)

### A. Créer un compte

- Allez sur https://supabase.com
- Cliquez "Sign Up"
- Utilisez votre email ou GitHub

### B. Créer le projet

1. Dashboard → **New Project**
2. Remplissez :

   - **Name**: `legion-de-marie`
   - **Password**: (Un mot de passe fort)
   - **Region**: Sélectionnez la région la plus proche

3. Attendez 2-3 minutes que le projet soit créé

---

## Étape 2️⃣ : Créer la Base de Données (2 min)

### A. Exécuter le schéma SQL

1. Ouvrez votre projet Supabase
2. Allez à **SQL Editor** (menu gauche)
3. Cliquez **New Query**
4. Copiez **TOUT** le contenu de ce fichier :
   ```
   code/supabase/migrations/001_create_tables.sql
   ```
5. Collez dans l'éditeur
6. Cliquez le bouton **Run** (ou ▶️)

✅ **C'est fait !** Vos tables sont créées.

### B. Vérifier les tables

- Allez à **Table Editor**
- Vous devez voir : `zones`, `praesidia`, `membres`, `officiers`, `finances`, `presences`, `manifestations`

---

## Étape 3️⃣ : Récupérer les Credentials (1 min)

### A. Copier l'URL

1. Allez à **Settings** (engrenage, bas du menu)
2. Sélectionnez l'onglet **API**
3. Copiez **Project URL** (commence par `https://`)
4. Gardez-le de côté

### B. Copier la clé

1. Sur la même page **API**, trouvez **"anon public"**
2. Copiez la **KEY** (long texte)
3. Gardez-le de côté

---

## Étape 4️⃣ : Ajouter les Variables (1 min)

### A. Créer le fichier .env.local

À la racine du dossier `code/`, créez un fichier nommé `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-super-longue
```

**Important**: Remplacez:

- `votre-projet` par le nom de votre projet
- `votre-clé-super-longue` par la clé copiée plus haut

### B. Installez les dépendances

```bash
cd code
npm install
```

---

## Étape 5️⃣ : Tester (1 min)

### Lancer l'app

```bash
npm run dev
```

### Ouvrir dans le navigateur

- Allez à http://localhost:3000
- Vous devez voir l'app

### Tester une page

1. Connectez-vous avec un compte démo :

   - Email: `president@legiondemarie.org`
   - Password: `demo123`

2. Allez à **Zones** (/zones)
3. Cliquez **Nouvelle Zone**
4. Remplissez et créez
5. Vous devez voir votre zone s'ajouter **en temps réel** ! ✅

---

## 🎉 Succès !

Votre app est maintenant **complètement fonctionnelle** avec :

- ✅ Base de données Supabase
- ✅ Synchronisation temps réel
- ✅ Formulaires CRUD complets
- ✅ 6 pages entièrement fonctionnelles

---

## 📋 Voici ce qui est Prêt à Utiliser

| Page             | URL                           | Statut         |
| ---------------- | ----------------------------- | -------------- |
| Zones            | `/zones`                      | ✅ Complète    |
| Praesidia        | `/praesidia`                  | ✅ Complète    |
| Membres          | `/members`                    | ✅ Complète    |
| Officiers        | `/officers`                   | ✅ Complète    |
| Finances         | `/finances`                   | ✅ Complète    |
| Présences        | `/attendance`                 | ✅ Complète    |
| Réunions         | `/meetings`                   | ✅ Complète    |
| Dashboard        | `/dashboard`                  | 🚧 Basique     |
| Et 10+ autres... | Voir IMPLEMENTATION_STATUS.md | 🚧 À compléter |

---

## ❓ Ça ne Marche Pas ?

### Erreur: "Cannot find module @supabase/supabase-js"

```bash
npm install
```

### Erreur: "Invalid API key"

- Vérifiez que vous avez copié la **clé "anon public"** et non une autre
- Pas d'espaces aux extrémités
- Vérifiez l'URL (doit commencer par `https://`)

### Aucune donnée n'apparaît

- Allez dans Supabase **Settings** → **API** → Vérifiez Realtime est ON pour vos tables
- Ou attendez 5 secondes et rafraîchissez la page

### Problèmes de Realtime

- Allez à **Database** → **Replication**
- Assurez-vous "Realtime" est activé (toggle à ON)

---

## 🎯 Prochaines Étapes

### Court Terme (Optionnel)

- Ajouter des données via les formulaires
- Tester les modifications / suppressions
- Vérifier le sync temps réel en ouvrant l'app sur 2 onglets

### Moyen Terme

- Complétez les autres pages (voir IMPLEMENTATION_STATUS.md)
- Intégrez Supabase Auth (remplacer auth mock)
- Ajoutez plus de fonctionnalités

### Déploiement

- Quand prêt, déployez sur Netlify/Vercel/votre serveur
- Voir DEPLOYMENT.md pour instructions complètes

---

## 📞 Support Rapide

| Problème            | Solution                                  |
| ------------------- | ----------------------------------------- |
| "Connexion refusée" | Vérifiez l'URL Supabase (https://)        |
| "Not authenticated" | Les credentials ne sont pas correctes     |
| "Empty list"        | Aucun problème, créez des données !       |
| "Network timeout"   | Votre connexion internet ou Supabase down |

---

## ✨ Félicitations !

Vous avez une application complète avec une vraie base de données ! 🎉

**Temps total**: ~15-20 minutes  
**Difficile?** Non, c'est très simple  
**Fonctionnel**: Oui, 100% !

Commencez à créer vos zones, praesidia, et membres maintenant ! 🚀
