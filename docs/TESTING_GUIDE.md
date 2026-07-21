# 🧪 Guide de Test Local

## Démarrage Rapide

### Sur Windows
```bash
start.bat
```

### Sur macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

### Manuel
```bash
npm install
npm run dev
# Ouvrez http://localhost:3000
```

---

## 🧪 Scénarios de Test

### Test 1: Modal de Connexion
1. Accédez à `http://localhost:3000/connexion`
2. ✅ Vérifiez que le modal s'affiche
3. ✅ Vérifiez les deux boutons: "Administrations" et "Visiteurs"
4. ✅ Vérifiez les animations GSAP (fade, scale)

### Test 2: Admin Login - Onglet Identifiants
1. Cliquez sur "Administrations"
2. ✅ Vous êtes redirigé vers `/connexion/administrations`
3. ✅ L'onglet "Identifiants" est actif par défaut
4. Remplissez le formulaire:
   - Établissement: "École ABC"
   - Email: "admin@test.com"
   - Mot de passe: "password123"
5. ✅ Le bouton "Se connecter" est actif
6. ✅ Cliquez → animation loading puis redirection

### Test 3: Admin Login - Onglet Biométrie
1. Sur `/connexion/administrations`, cliquez sur "Biométrie"
2. ✅ Deux options apparaissent:
   - Empreinte Digitale
   - Reconnaissance Vocale
3. Cliquez sur "Empreinte Digitale":
   - ✅ Animation d'écoute (pulsation)
   - ✅ Animation de traitement (loader)
   - ✅ Succès aléatoire (70%) ou erreur
4. Si erreur: bouton "Réessayer" s'affiche

### Test 4: Visitors Registration
1. Retournez à `/connexion`
2. Cliquez sur "Visiteurs"
3. ✅ Vous êtes sur `/connexion/visiteurs`
4. Sélectionnez un profil: "Enseignant", "Élève" ou "Parent/Tuteur"
5. ✅ Le profil est mis en surbrillance
6. ✅ Les champs de formulaire apparaissent:
   - Nom complet
   - Adresse e-mail
7. Remplissez les champs
8. Cliquez "Créer mon compte"
9. ✅ Animation de succès
10. ✅ Redirection vers `/connexion/visiteurs/confirmation`

### Test 5: Confirmation Page
1. Sur la page de confirmation
2. ✅ Icône de succès (✓ vert)
3. ✅ Message "Inscription réussie!"
4. ✅ Checklist des actions (3 items)
5. ✅ Bouton "Retour à la connexion"

### Test 6: Navigation Back
1. À tout moment, cliquez sur le lien "Retour"
2. ✅ Vous êtes redirigé à la page précédente
3. ✅ Les animations se rejouent correctement

---

## 🎨 Verification des Couleurs

### Couleurs Principales
- [ ] **Bleu doux**: Utilisé sur les bordures et textes primaires
- [ ] **Orange Jaune**: Utilisé sur les dégradés et accents
- [ ] **Dégradé**: Bleu → Orange sur les boutons principaux
- [ ] **Gris Blanc**: Arrière-plans (dark mode)

### Couleurs Fonctionnelles
- [ ] **Vert Succès**: Icônes et messages de succès
- [ ] **Rouge Erreur**: Messages d'erreur et bordures d'alerte
- [ ] **Neutral**: Textes et séparateurs

---

## 🎬 Vérification des Animations

### GSAP Timeline
- [ ] Logo fade in (0.4s)
- [ ] Carte fade in (0.55s)
- [ ] Champs fade in en cascade (0.4s each)

### États Biométrie
- [ ] Pulsation d'écoute
- [ ] Loader de traitement
- [ ] Animation de succès (checkmark)
- [ ] Animation d'erreur

### Transitions Boutton
- [ ] Hover shadow (bleu/orange)
- [ ] State disabled (opacité réduite)
- [ ] Focus outline

---

## 📱 Responsive Design

Testez sur différentes tailles:

### Desktop (1920px)
- [ ] Modal centré
- [ ] Formulaires larges
- [ ] Tous les éléments visibles

### Tablet (768px)
- [ ] Modal responsive
- [ ] Grid 3 colonnes → 2 colonnes
- [ ] Padding ajusté

### Mobile (375px)
- [ ] Modal full-width (-6px padding)
- [ ] Grid 3 colonnes → 1 colonne
- [ ] Boutons full-width
- [ ] Texte lisible

---

## 🔗 Vérification des Liens

- [ ] `/connexion` → Affiche le modal
- [ ] Bouton "Administrations" → `/connexion/administrations`
- [ ] Bouton "Visiteurs" → `/connexion/visiteurs`
- [ ] Lien "Retour" → Revient à `/connexion`
- [ ] Lien home → Revient à `/`

---

## 🌙 Dark/Light Mode

Actuellement: **Dark Mode Uniquement** (approprié pour le contexte scolaire)

Arrière-plans:
- [ ] `neutral-950` (#111827) - Très sombre
- [ ] `primary-950` (#0a1f3e) - Bleu très sombre
- [ ] Texte blanc et neutral-300

---

## ✅ Checklist Finale

- [ ] Toutes les pages s'affichent sans erreur
- [ ] Animations GSAP fonctionnent
- [ ] Transitions fluides
- [ ] Couleurs correctes
- [ ] Responsive sur mobile/tablet/desktop
- [ ] Liens de navigation fonctionnent
- [ ] Console sans erreurs
- [ ] Forms soumettent sans erreurs

---

## 🐛 Dépannage

### La page ne charge pas
```bash
npm run dev
# Vérifiez que le serveur démarre sur le port 3000
```

### Animations saccadées
- Vérifiez que GSAP est installé: `npm list gsap`
- Vérifiez les performances GPU du navigateur

### Couleurs incorrectes
- Clear Tailwind cache: `rm -rf .next`
- Rebuild: `npm run build`

### Erreurs de composants
- Vérifiez que tous les imports sont corrects
- Vérifiez la structure des dossiers

---

## 📊 Métriques de Performance

Actuellement (estimé):
- **Lighthouse Performance**: 85+
- **Lighthouse Accessibility**: 95+
- **Lighthouse Best Practices**: 90+
- **Lighthouse SEO**: 90+

---

## 📝 Notes

- Les tests d'authentification sont simulés (70% succès aléatoire)
- Auth0 réel doit être configuré pour fonctionner en production
- WebAuthn fonctionne seulement sur HTTPS (en production)

---

**Bon testing! 🚀**
