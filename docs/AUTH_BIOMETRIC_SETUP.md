# Guide de Configuration - Authentification et Biométrie

## Vue d'ensemble

Ce guide vous aide à configurer:
- **Auth0** pour l'authentification administrative
- **WebAuthn** pour l'authentification biométrique (empreinte digitale, reconnaissance faciale)
- **Inscription des visiteurs** (Parents, Élèves, Enseignants)

---

## 1. Configuration Auth0

### Étape 1: Créer un compte Auth0
1. Allez sur [auth0.com](https://auth0.com)
2. Créez un compte gratuit ou utilisez votre compte existant
3. Créez une nouvelle application

### Étape 2: Configurer l'application Auth0

1. **Nom**: `SAIMO Admin Portal`
2. **Type**: `Regular Web Application`
3. **Framework**: `Next.js`

### Étape 3: Configurer les URLs

Dans les paramètres de votre application Auth0:

```
Allowed Callback URLs:
http://localhost:3000/api/auth/callback
https://yourdomain.com/api/auth/callback

Allowed Logout URLs:
http://localhost:3000
https://yourdomain.com

Allowed Web Origins:
http://localhost:3000
https://yourdomain.com
```

### Étape 4: Récupérer les credentials

1. Allez dans les paramètres de l'application
2. Notez:
   - `Domain`
   - `Client ID`
   - `Client Secret`

### Étape 5: Configurer les variables d'environnement

Créez un fichier `.env.local`:

```env
AUTH0_SECRET=use [open ssl rand -hex 32] to generate a 32 bytes value
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Étape 6: Installer les dépendances

```bash
npm install @auth0/nextjs-auth0
```

---

## 2. Configuration WebAuthn (Biométrie)

### Qu'est-ce que WebAuthn?

WebAuthn est un standard W3C pour l'authentification biométrique et par clé de sécurité:
- ✅ Empreinte digitale
- ✅ Reconnaissance faciale
- ✅ PIN
- ✅ Clés de sécurité USB

### Navigateurs supportés

| Navigateur | Support |
|-----------|---------|
| Chrome 67+ | ✅ Complet |
| Firefox 60+ | ✅ Complet |
| Safari 13+ | ✅ Complet |
| Edge 18+ | ✅ Complet |

### Mise en place

**Les navigateurs modernes supportent WebAuthn nativement. Aucune configuration supplémentaire n'est nécessaire!**

Pour l'enregistrement biométrique:

```javascript
// L'API WebAuthn est disponible via navigator.credentials
// Exemple simplifié:

async function registerBiometric() {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array(32),
      rp: { name: "SAIMO" },
      user: {
        id: new Uint8Array(16),
        name: "user@saimo.local",
        displayName: "John Doe"
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform" // Empreinte/Facial
      }
    }
  });
}
```

---

## 3. Routes de connexion

### Structure des routes

```
/connexion                          ← Modal de sélection
├─ /administrations                 ← Connexion Admin (Auth0 + Biométrie)
└─ /visiteurs                       ← Inscription Visiteurs
   └─ /confirmation                 ← Confirmation d'inscription
```

### Flux Administrations

1. Utilisateur accède à `/connexion`
2. Clique sur "Administrations"
3. Choisit entre:
   - **Identifiants**: Email + Mot de passe via Auth0
   - **Biométrie**: Empreinte ou reconnaissance faciale via WebAuthn
4. Redirection vers `/portail`

### Flux Visiteurs

1. Utilisateur accède à `/connexion`
2. Clique sur "Visiteurs"
3. Sélectionne son type: Enseignant / Élève / Parent
4. Remplit le formulaire d'inscription
5. Confirmation de création de compte
6. Redirection vers page de connexion

---

## 4. Charte graphique implémentée

### Couleurs

```css
/* Principale - Bleu doux */
primary-600: #3b7ec8
primary-500: #4a8dd9
primary-400: #6fa3e8

/* Secondaire - Orange Jaune */
secondary-600: #e87500
secondary-500: #ff8c00
secondary-400: #ffa500

/* États */
success-500: #34d399
error-500: #ef4444

/* Fond */
neutral-950: #111827
neutral-900: #1f2937
```

### Dégradés

```css
bg-gradient-primary-secondary: 135deg, Bleu → Orange
bg-gradient-primary-secondary-vertical: 180deg, Bleu → Orange
```

---

## 5. Déploiement

### Pour Vercel

1. Connectez votre repo GitHub
2. Configurez les variables d'environnement dans Vercel
3. Configurez Auth0 avec votre URL Vercel

### Pour production

1. Remplacez `AUTH0_BASE_URL` par votre domaine
2. Mettez à jour les URLs de callback Auth0
3. Générez un nouveau `AUTH0_SECRET` plus long pour la production

---

## 6. Prochaines étapes

- [ ] Implémenter les endpoints API pour les formulaires
- [ ] Connecter une base de données pour les visiteurs
- [ ] Configurer les emails de confirmation
- [ ] Implémenter la protection des routes avec middleware
- [ ] Ajouter les multiples établissements pour les administrateurs

---

## Support et ressources

- **Auth0 Docs**: https://auth0.com/docs
- **WebAuthn Guide**: https://webauthn.io
- **Next.js Auth0**: https://github.com/auth0/nextjs-auth0
