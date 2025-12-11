# 🔒 Guide de Sécurité - Légion de Marie

## ✨ Recommandations de Sécurité Essentielles

Votre application a un excellent point de départ. Voici les améliorations **prioritaires** et **recommandées** pour sécuriser votre système.

---

## 🎯 Priorité 1: CRITIQUE (À FAIRE MAINTENANT)

### 1.1 Authentification Supabase Auth
**Statut Actuel**: Authentification mock (test seulement)  
**Risque**: Comptes de demo publiquement accessible

**À Faire**:
```typescript
// Remplacer mock auth par Supabase Auth dans app/providers.tsx
import { createClient } from '@supabase/supabase-js';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  
  return <AuthContext.Provider value={{ session, ... }}>{children}</AuthContext.Provider>;
}
```

**Impact**: 🔴 CRITIQUE

---

### 1.2 Row Level Security (RLS) Avancé
**Statut Actuel**: RLS permissif (allow all)  
**Risque**: N'importe qui peut lire/modifier toutes les données

**À Faire**:
```sql
-- Remplacer les policies permissives par des règles strictes

-- Example: Seulement les users authentifiés peuvent lire
CREATE POLICY "Users can read own data"
  ON zones FOR SELECT
  USING (auth.uid() = created_by_user_id);

-- Seulement les admins peuvent créer
CREATE POLICY "Only admins can create zones"
  ON zones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

**Impact**: 🔴 CRITIQUE

---

### 1.3 Chiffrement des Données Sensibles
**Statut Actuel**: Données stockées en clair  
**Risque**: Exposition de données personnelles

**À Faire**:
```typescript
// Chiffrer les données sensibles avant stockage
import crypto from 'crypto';

function encryptData(data: string, key: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}
```

Champs à chiffrer:
- Numéros de téléphone
- Emails (si sensible pour votre contexte)
- Données financières
- Adresses

**Impact**: 🔴 CRITIQUE

---

## 🎯 Priorité 2: HAUTE (À FAIRE CETTE SEMAINE)

### 2.1 Variables d'Environnement
**Statut Actuel**: `.env.local` non chiffrée  
**Risque**: Clés API exposées si commit accidentel

**À Faire**:
```bash
# 1. Créer .env.local (JAMAIS commiter)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# 2. Ajouter à .gitignore
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore

# 3. En production, utiliser les secrets du plateforme de déploiement
# - Netlify: Settings → Environment
# - Vercel: Settings → Environment Variables
# - Docker: Secrets management
```

**Impact**: 🟠 HAUTE

---

### 2.2 Validation & Sanitization
**Statut Actuel**: Validation côté client seulement  
**Risque**: Attaques via API directe

**À Faire**: Créer des API routes avec validation serveur
```typescript
// app/api/zones/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';

const zoneSchema = z.object({
  nom_zone: z.string().min(3).max(255),
  paroisse: z.string().min(3).max(255),
  // ... autres champs validés
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = zoneSchema.parse(body); // Validation avec Zod
    
    const supabase = createRouteHandlerClient({ cookies });
    const { data: result, error } = await supabase
      .from('zones')
      .insert([data]);
    
    if (error) throw error;
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

**Impact**: 🟠 HAUTE

---

### 2.3 Rate Limiting
**Statut Actuel**: Aucun rate limiting  
**Risque**: Attaques brute-force, DDoS

**À Faire**:
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1h'), // 100 requêtes/heure
});

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

**Prérequis**: Service Upstash gratuit  
**Impact**: 🟠 HAUTE

---

### 2.4 Audit Logging
**Statut Actuel**: Aucun audit  
**Risque**: Pas de traçabilité des modifications

**À Faire**: Créer une table d'audit
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action VARCHAR(50), -- CREATE, UPDATE, DELETE
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger automatique
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER zones_audit AFTER INSERT OR UPDATE ON zones FOR EACH ROW
EXECUTE FUNCTION audit_trigger();
```

**Impact**: 🟠 HAUTE

---

## 🎯 Priorité 3: MOYENNE (À FAIRE LE MOIS PROCHAIN)

### 3.1 HTTPS/SSL
**Statut Actuel**: À vérifier en production  
**Risque**: Données en clair sur le réseau

**À Faire**:
- Netlify: ✅ Automatique (Let's Encrypt gratuit)
- Vercel: ✅ Automatique
- Serveur local: Utiliser Certbot pour Let's Encrypt

```bash
# Certbot (Linux)
sudo certbot certonly --standalone -d votre-domaine.com
```

**Impact**: 🟡 MOYENNE

---

### 3.2 CORS Configuration
**Statut Actuel**: CORS ouvert à tous  
**Risque**: Attaques cross-origin

**À Faire**:
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://votre-domaine.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};
```

**Impact**: 🟡 MOYENNE

---

### 3.3 Content Security Policy (CSP)
**Statut Actuel**: Aucune CSP  
**Risque**: XSS attacks

**À Faire**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  
  return response;
}
```

**Impact**: 🟡 MOYENNE

---

### 3.4 Backup & Disaster Recovery
**Statut Actuel**: Pas de backup automatique  
**Risque**: Perte totale de données

**À Faire**:
```bash
# Supabase: Activer automated backups (gratuit)
# Dashboard → Settings → Backups → Enable

# Ou utiliser pg_dump (backup manuel)
pg_dump postgresql://user:password@db.supabase.co/postgres > backup.sql

# Restaurer
psql postgresql://user:password@db.supabase.co/postgres < backup.sql
```

**Impact**: 🟡 MOYENNE

---

## 🎯 Priorité 4: BASSE (OPTIONNEL/AMÉLIORATION)

### 4.1 2FA (Two-Factor Authentication)
Activer dans Supabase Auth (options: email, authenticator app, SMS)

### 4.2 Brute Force Protection
Supabase Auth inclus automatiquement

### 4.3 API Key Rotation
Rotation automatique toutes les 90 jours

### 4.4 Monitoring & Alertes
- Sentry pour erreurs
- Supabase Analytics pour usage
- Alerts pour comportements suspects

---

## 📋 Checklist de Déploiement Sécurisé

### Avant le Déploiement
- [ ] Remplacer auth mock par Supabase Auth
- [ ] Configurer RLS strict (pas de `allow all`)
- [ ] Ajouter validation serveur (Zod + API routes)
- [ ] Chiffrer les données sensibles
- [ ] Vérifier .gitignore (pas de `.env.local`)
- [ ] Configurer les variables en production
- [ ] Activer HTTPS/SSL
- [ ] Configurer CORS
- [ ] Ajouter CSP headers
- [ ] Activer audit logging
- [ ] Configurer rate limiting
- [ ] Tester les RLS policies
- [ ] Faire un pentest basique
- [ ] Vérifier les dépendances (`npm audit`)

### Après le Déploiement
- [ ] Monitorer les logs d'erreur
- [ ] Surveiller l'usage de l'API
- [ ] Vérifier les alertes de sécurité
- [ ] Faire les backups réguliers
- [ ] Mettre à jour les dépendances

---

## 🔐 Checklist des Bonnes Pratiques

### Code
- [ ] Jamais hard-coder les secrets
- [ ] Valider TOUTES les entrées côté serveur
- [ ] Utiliser les prepared statements (Supabase le fait)
- [ ] Escaper les outputs (React le fait auto)
- [ ] Logger les actions sensibles
- [ ] Tester les cas de sécurité

### Infrastructure
- [ ] Backup automatique actif
- [ ] HTTPS/SSL obligatoire
- [ ] Firewall configuré
- [ ] IPs limitées si possible
- [ ] Monitoring actif

### Organisation
- [ ] Partager les secrets via service sécurisé (pas d'email)
- [ ] Rotation des passwords tous les 90 jours
- [ ] Audit logs archivés
- [ ] Politique de gestion des accès
- [ ] Formation sécurité de l'équipe

---

## 🚨 Incident Response Plan

Si vous découvrez une fuite:

1. **Immédiatement**
   - Désactiver les clés compromises
   - Vérifier les logs (audit_logs)
   - Identifier ce qui a été accédé

2. **Rapidement** (dans l'heure)
   - Informer les utilisateurs affectés
   - Changer tous les secrets
   - Vérifier les backups

3. **Après** (24h)
   - Rapport d'incident
   - Analyse post-mortem
   - Plan de correction

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Next.js Security](https://nextjs.org/docs/going-to-production/security)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

---

## ✅ Résumé par Étape

| Étape | Quoi | Quand | Temps |
|-------|------|-------|-------|
| 1 | Setup Supabase Auth | Avant déploiement | 1h |
| 2 | RLS strict | Avant déploiement | 2h |
| 3 | Validation serveur | Avant déploiement | 3h |
| 4 | Audit logging | Avant déploiement | 1h |
| 5 | Rate limiting | Avant déploiement | 1h |
| 6 | Encryption | Pendant déploiement | 2h |
| 7 | Monitoring | Après déploiement | 1h |
| 8 | Backup strategy | Après déploiement | 30min |

**Temps total**: ~11 heures (peut être étalé)

---

## 🎯 Pour Commencer

1. **Aujourd'hui**: Lire ce document
2. **Demain**: Mettre en place Supabase Auth
3. **Cette semaine**: RLS + Validation serveur
4. **Avant déploiement**: Tout le reste

Vous êtes prêt pour la sécurité ! 🔒
