# Configuration Supabase - Légion de Marie

## 🚀 Étapes de Configuration

### 1. Créer un Projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur "New project"
4. Remplissez les informations :
   - **Name**: "Legion-de-Marie" (ou votre choix)
   - **Database Password**: Choisissez un mot de passe fort
   - **Region**: Sélectionnez la région la plus proche
5. Attendez que le projet soit créé (quelques minutes)

### 2. Exécuter le Schéma SQL

Une fois votre projet créé :

1. Allez à **SQL Editor** dans le menu de gauche
2. Cliquez sur **New query**
3. Copiez tout le contenu du fichier `supabase/migrations/001_create_tables.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run**

Cela créera toutes les tables nécessaires pour votre application.

### 3. Récupérer Vos Credentials

1. Allez à **Settings** → **API**
2. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Pour la clé de service (optionnel pour maintenant) :
   - Copiez **service_role** (secret key) → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Ajouter les Variables d'Environnement

1. Créez un fichier `.env.local` à la racine du projet
2. Remplissez-le avec vos credentials :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key-ici
```

### 5. Installer les Dépendances

```bash
cd code
npm install
```

Cela installera automatiquement `@supabase/supabase-js` et les autres packages nécessaires.

### 6. Tester la Connexion

```bash
npm run dev
```

Si la connexion fonctionne, vous verrez les logs dans la console du navigateur.

## 🔒 Authentification Supabase (Optionnel)

Pour utiliser l'authentification Supabase à la place de l'authentification mock :

1. Allez à **Authentication** dans votre projet Supabase
2. Cliquez sur **Providers**
3. Activez les fournisseurs que vous voulez (Email, Google, etc.)
4. Nous intégrerons cela dans le code ensuite

## 🎯 Données de Test (Optionnel)

Pour ajouter des données de test, vous pouvez utiliser le **Table Editor** dans Supabase :

1. Allez à **Table Editor**
2. Sélectionnez une table (ex: `zones`)
3. Cliquez sur **Insert row** pour ajouter manuellement des données

Ou exécutez ce SQL pour ajouter des données de test :

```sql
-- Insérer une zone de test
INSERT INTO zones (nom_zone, paroisse, directeur_spirituel, contact_directeur)
VALUES ('Zone Test', 'Paroisse Test', 'Père Jean', 'pere.jean@example.com');

-- Insérer un praesidium
INSERT INTO praesidia (zone_id, nom_praesidium, directeur_spirituel, type_praesidium)
SELECT id, 'Praesidium Test', 'Père Pierre', 'adulte' FROM zones LIMIT 1;

-- Insérer des membres
INSERT INTO membres (praesidium_id, nom_prenom, statut, date_adhesion)
SELECT id, 'Marie Dupont', 'actif', NOW() FROM praesidia LIMIT 1;

-- Insérer des officiers
INSERT INTO officiers (praesidium_id, nom_prenom, poste, type, date_debut_mandat, date_fin_mandat)
SELECT id, 'Jean Dupont', 'Président', 'praesidium', NOW(), NOW() + INTERVAL '1 year' FROM praesidia LIMIT 1;

-- Insérer des finances
INSERT INTO finances (praesidium_id, mois, solde_initial, contributions, depenses)
SELECT id, DATE_TRUNC('month', NOW())::VARCHAR(7), 0, 500, 100 FROM praesidia LIMIT 1;
```

## 🔄 Activation du Temps Réel

Les subscriptions en temps réel sont déjà implémentées dans les hooks. Assurez-vous que Realtime est activé :

1. Allez à **Database** → **Replication**
2. Assurez-vous que "Realtime" est activé pour vos tables

## 🚨 Dépannage

### Erreur : "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Erreur : "Invalid API key"
- Vérifiez que vos clés sont correctement copiées sans espaces
- Assurez-vous d'utiliser la clé `anon public` et non la clé de service

### Erreur : "Network error"
- Vérifiez votre URL Supabase (doit commencer par `https://`)
- Assurez-vous que votre projet Supabase est actif

### Aucune donnée n'apparaît
- Vérifiez que les RLS policies sont correctement configurées
- Essayez d'abord avec "Enable read access for all" comme c'est configuré

## 📚 Ressources Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

## ✨ Prochaines Étapes

1. ✅ Créer le projet Supabase
2. ✅ Exécuter le schéma SQL
3. ✅ Ajouter les variables d'environnement
4. ✅ Tester la connexion
5. Intégrer Supabase Auth (optionnel)
6. Configurer les RLS policies avancées
7. Ajouter des données réelles

Une fois ces étapes complétées, toutes les pages fonctionneront avec Supabase ! 🎉
