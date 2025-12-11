# ✅ Checklist de Test - Légion de Marie

## 🎯 Avant de Déployer: Vérifier Chaque Page

Utilisez ce guide pour tester **TOUTES** les pages et fonctionnalités.

---

## 📋 Test Local (npm run dev)

### Étape 1: Démarrer l'App
```bash
cd code
npm run dev
```

Vérifiez: 
- ✅ L'app démarre sans erreur
- ✅ Pas d'erreurs en rouge dans la console
- ✅ Page d'accueil charge à http://localhost:3000

---

## 🔐 Test d'Authentification

### Page de Connexion (`/login`)
- [ ] Page charge correctement
- [ ] Formulaire visible
- [ ] Messages d'erreur fonctionnent (test avec email invalide)
- [ ] Boutons démo remplissent les champs
- [ ] Connexion réussit avec: `president@legiondemarie.org` / `demo123`
- [ ] Redirection vers `/` après login réussi

### Page d'Accueil (`/`)
- [ ] Page charge après login
- [ ] Sidebar affiche l'utilisateur connecté
- [ ] Tous les liens de navigation sont visibles
- [ ] Boutons "Actions Rapides" sont cliquables
- [ ] Cartes de statistiques s'affichent

---

## 📍 Test des Pages Principales

### 1. Zones (`/zones`)
**Test de Création**:
- [ ] Bouton "Nouvelle Zone" ouvre dialog
- [ ] Tous les champs sont remplissables
- [ ] Submit crée la zone
- [ ] Zone apparaît dans la liste
- [ ] Message de succès s'affiche

**Test de Modification**:
- [ ] Bouton Edit ouvre dialog pré-rempli
- [ ] Modification est sauvegardée
- [ ] Les données sont à jour dans la liste

**Test de Suppression**:
- [ ] Bouton Delete demande confirmation
- [ ] Zone est supprimée après confirmation
- [ ] Zone disparaît de la liste

### 2. Praesidia (`/praesidia`)
- [ ] Création fonctionne
- [ ] Sélection zone dans dropdown
- [ ] Types (Adulte/Junior) se sauvegardent
- [ ] Édition fonctionne
- [ ] Suppression fonctionne
- [ ] Cartes affichent les infos correctement

### 3. Membres (`/members`)
- [ ] Création avec tous les champs optionnels
- [ ] Sélection praesidium obligatoire
- [ ] Statuts (Actif/Probationnaire/Auxiliaire) fonctionnent
- [ ] Date d'adhésion se sauvegarde
- [ ] Email/téléphone optionnels
- [ ] Édition et suppression fonctionnent
- [ ] Formatage des dates français (JJ/MM/AAAA)

### 4. Officiers (`/officers`)
- [ ] Création d'officier conseil (sans praesidium)
- [ ] Création d'officier praesidium (avec sélection)
- [ ] Dates mandat fonctionnent
- [ ] Édition fonctionne (au moins la fin de mandat)
- [ ] Suppression fonctionne
- [ ] Type de rôle s'affiche correctement

### 5. Finances (`/finances`)
- [ ] Création d'entrée pour un praesidium
- [ ] Mois au format YYYY-MM
- [ ] Calcul automatique du solde final
- [ ] Modifications mises à jour correctement
- [ ] Suppression fonctionne
- [ ] Affichage en euros (€)
- [ ] Solde final = solde_initial + contributions - dépenses

### 6. Présences (`/attendance`)
- [ ] Sélection praesidium filtre les officiers
- [ ] Enregistrement avec statut (Présent/Absent/Excusé)
- [ ] Date et heure de réunion
- [ ] Notes optionnelles
- [ ] Couleurs par statut (vert/rouge/jaune)
- [ ] Édition et suppression fonctionnent

### 7. Réunions (`/meetings`)
- [ ] Création avec titre et type
- [ ] Tous les types disponibles
- [ ] Description optionnelle
- [ ] Date et heures début/fin
- [ ] Lieu obligatoire
- [ ] Nombre de participants
- [ ] Statut (planifiée/en cours/terminée/annulée)
- [ ] Affichage avec icone calendrier

---

## 🔄 Test du Temps Réel (Realtime)

**Comment vérifier le temps réel**:

1. Ouvrez l'app dans 2 onglets/navigateurs
2. Login dans les 2
3. Dans l'onglet 1: Créez une zone
4. **Vérification**: La zone apparaît automatiquement dans l'onglet 2 (sans rafraîchir)

✅ Si oui: Realtime fonctionne !  
❌ Si non: Vérifier la connection Supabase

---

## 🎨 Test de l'Interface

### Responsive Design
- [ ] App fonctionne sur desktop (1920px)
- [ ] App fonctionne sur tablet (768px)
- [ ] App fonctionne sur mobile (375px)
- [ ] Menus sont accessible
- [ ] Dialogs sont lisibles

### Navigation
- [ ] Tous les liens sidebar fonctionnent
- [ ] Retour possible (pas d'impasse)
- [ ] Breadcrumbs corrects (si présents)
- [ ] Logout fonctionne et redirige vers login

### Notifications
- [ ] Messages de succès s'affichent
- [ ] Messages d'erreur s'affichent
- [ ] Les toasts disparaissent après 3-4s

---

## 🚨 Test de Gestion d'Erreurs

### Erreurs de Validation
- [ ] Soumettre form vide: erreur visible
- [ ] Email invalide: erreur visible
- [ ] Nombre négatif: erreur visible
- [ ] Champs requis manquants: erreur visible

### Erreurs Réseau (optionnel)
- [ ] Couper internet: message d'erreur approprié
- [ ] Supabase down: message "Erreur de connexion"
- [ ] Credentials invalides: message "Invalid API key"

---

## 🔧 Test Technique (npm run build)

```bash
cd code
npm run build
```

✅ Vérifier:
- [ ] Build complète sans erreur
- [ ] Aucun warning (ou warnings acceptables)
- [ ] Taille du bundle raisonnable
- [ ] Pas d'imports non utilisés

---

## 📊 Test des Données

### Cohérence des Données
- [ ] Zones peuvent avoir plusieurs praesidia
- [ ] Praesidia peuvent avoir plusieurs membres
- [ ] Officiers sont liés correctement
- [ ] Finances sont liées aux praesidia
- [ ] Présences sont liées aux officiers

### Suppression en Cascade
- [ ] Supprimer zone: praesidia associés restent (ou comment ?) 
  - **À définir**: Cascade ou error ?
  - **Recommandé**: Error + modal warning
- [ ] Supprimer praesidium: membres restent ou supprimés ?
  - **À définir**
  - **Recommandé**: Cascade avec warning

### Calculs
- [ ] Finances: solde_final = solde_initial + contributions - dépenses
- [ ] Taux de présence: nombre présents / nombre attendus

---

## 🌐 Test d'Accès

### Permissions
- [ ] Admin peut voir toutes les pages
- [ ] Officer conseil peut voir zones, conseil pages
- [ ] Officer praesidium ne voit que son praesidium
  - **À implémenter**
  - Actuellement: Tous voient tout

### Pages Protégées
- [ ] Redirection vers login si pas connecté
- [ ] Pas de accès direct aux données via URL
- [ ] Logout fonctionne et invalide la session

---

## 🐛 Test des Bugs Courants

- [ ] Doublon: créer 2 zones avec même nom: Autorisé ou non ? Définir politique
- [ ] Édition immédiate: Créer → Éditer sans rafraîchir: Fonctionne ?
- [ ] Suppression rapide: Supprimer → Créer immédiatement: Pas de conflit ?
- [ ] Longue liste: 1000+ items: Performance acceptable ?
- [ ] Grands textes: Description longue: UI rompt pas ?

---

## 📱 Test Mobile Spécifique

- [ ] Sidebar se ferme automatiquement
- [ ] Dialogs s'ouvrent fullscreen
- [ ] Keyboard ne cache pas les inputs
- [ ] Boutons assez grands pour toucher
- [ ] Scrolling fonctionne partout
- [ ] Formulaires utilisables en portrait et paysage

---

## 🔐 Test de Sécurité Basique

**IMPORTANT**: À améliorer avant production

- [ ] Pas d'URL avec credentials visibles
- [ ] Console network: pas de données sensibles exposées
- [ ] LocalStorage: vérifier contenu sensible ?
- [ ] Cookies: sécure + httpOnly ?
- [ ] CORS: bien configuré ?

Voir **SECURITY_IMPROVEMENTS.md** pour détails

---

## 🚀 Test de Performance

### Temps de Chargement
- [ ] Page d'accueil: < 2 secondes
- [ ] Pages principales: < 1 seconde
- [ ] Création entité: feedback immédiat

### Utilisation Mémoire
- [ ] App reste réactive après 10 opérations
- [ ] Pas de memory leak visible
- [ ] Pas de lag après 1h d'utilisation

### Réseau
- [ ] Pas de requête bloquée
- [ ] Payload raisonnable
- [ ] Realtime: réactivité < 500ms

---

## 📋 Test Complet (Exemple Scénario)

**Scénario réaliste**:

1. Login avec account démo
2. Aller à Zones → Créer zone "Zone Test"
3. Aller à Praesidia → Créer praesidium "Praes Test" dans "Zone Test"
4. Aller à Membres → Ajouter 3 membres au praesidium
5. Aller à Officiers → Ajouter président et trésorier
6. Aller à Finances → Créer entrée financière
7. Aller à Présences → Enregistrer présences
8. Vérifier dans 2 onglets que tout se sync en temps réel
9. Éditer une zone depuis l'onglet 2
10. Voir la modification dans l'onglet 1 (sans rafraîchir)
11. Logout puis login avec autre compte démo
12. Vérifier que les données sont visibles

✅ Tout fonctionne = Prêt à déployer !

---

## 🎯 Checklist Finale

Avant de cliquer "Deploy":

- [ ] ✅ Toutes les 7 pages principales testées
- [ ] ✅ CRUD complet fonctionnel
- [ ] ✅ Temps réel fonctionne
- [ ] ✅ Erreurs gérées correctement
- [ ] ✅ Mobile fonctionne
- [ ] ✅ Build sans erreur
- [ ] ✅ Security basics OK
- [ ] ✅ Performance acceptable
- [ ] ✅ Scénario réaliste fonctionne
- [ ] ✅ Documentation à jour

---

## 🚨 Si Quelque Chose Ne Fonctionne Pas

| Problème | Solution |
|----------|----------|
| "Cannot find module" | npm install |
| "Invalid API key" | Vérifier .env.local |
| Aucune donnée n'apparaît | Vérifier connection Supabase |
| Temps réel ne marche pas | Vérifier Realtime activé dans Supabase |
| Erreur 500 | Vérifier les logs Supabase |
| Page blanche | Vérifier console browser (F12) |

---

## ✨ Vous Êtes Prêt !

Une fois cette checklist complètement cochée ✅, votre app est **prête pour production** ! 🎉
