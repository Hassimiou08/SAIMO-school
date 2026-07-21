#!/bin/bash
# Checklist de vérification post-mise à jour SAIMO Landing

echo "🔍 VÉRIFICATION POST-MISE À JOUR SAIMO LANDING"
echo "=============================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_count=0
pass_count=0
fail_count=0

# Fonction pour vérifier un fichier
check_file() {
    ((check_count++))
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file - $description"
        ((pass_count++))
    else
        echo -e "${RED}❌${NC} $file - $description"
        ((fail_count++))
    fi
}

# Fonction pour vérifier un dossier
check_dir() {
    ((check_count++))
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅${NC} $dir/ - $description"
        ((pass_count++))
    else
        echo -e "${RED}❌${NC} $dir/ - $description"
        ((fail_count++))
    fi
}

# Vérifier les fichiers de configuration
echo "📄 Fichiers de Configuration:"
check_file "tailwind.config.ts" "Nouvelle charte graphique"
check_file "package.json" "Dépendances Auth0 + WebAuthn"
check_file ".env.example" "Variables d'environnement"
echo ""

# Vérifier les composants créés
echo "🎨 Nouveaux Composants:"
check_file "components/auth/ConnectionModal.tsx" "Modal de connexion"
check_file "components/auth/AdminLoginForm.tsx" "Formulaire Admin"
check_file "components/auth/VisitorsRegistration.tsx" "Inscription Visiteurs"
echo ""

# Vérifier les pages créées
echo "📄 Nouvelles Pages:"
check_file "app/connexion/page.tsx" "Page connexion (mise à jour)"
check_file "app/connexion/administrations/page.tsx" "Page Admin Login"
check_file "app/connexion/visiteurs/page.tsx" "Page Visitor Registration"
check_file "app/connexion/visiteurs/confirmation/page.tsx" "Page Confirmation"
echo ""

# Vérifier les fichiers de configuration
echo "⚙️  Fichiers de Configuration:"
check_file "lib/auth.config.ts" "Configuration Auth0 + WebAuthn"
check_file "lib/auth.types.ts" "Types TypeScript"
echo ""

# Vérifier la documentation
echo "📚 Documentation:"
check_file "docs/AUTH_BIOMETRIC_SETUP.md" "Guide de configuration Auth0"
check_file "docs/TESTING_GUIDE.md" "Guide de test"
check_file "MIGRATION_SUMMARY.md" "Résumé des changements"
check_file "UPDATE_README.md" "README de mise à jour"
echo ""

# Vérifier les scripts
echo "🚀 Scripts de Démarrage:"
check_file "start.sh" "Script de démarrage Linux/macOS"
check_file "start.bat" "Script de démarrage Windows"
echo ""

# Vérifier les dossiers de documentation
echo "📂 Dossiers:"
check_dir "docs" "Documentation"
check_dir "components/auth" "Composants Auth"
check_dir "app/connexion" "Pages Connexion"
echo ""

# Vérifier les dépendances
echo "📦 Dépendances dans package.json:"
if grep -q "@auth0/nextjs-auth0" "package.json"; then
    echo -e "${GREEN}✅${NC} @auth0/nextjs-auth0 trouvé"
    ((pass_count++))
else
    echo -e "${RED}❌${NC} @auth0/nextjs-auth0 manquant"
    ((fail_count++))
fi
((check_count++))

if grep -q "webauthn-json" "package.json"; then
    echo -e "${GREEN}✅${NC} webauthn-json trouvé"
    ((pass_count++))
else
    echo -e "${RED}❌${NC} webauthn-json manquant"
    ((fail_count++))
fi
((check_count++))

echo ""
echo "=============================================="
echo "📊 RÉSULTAT:"
echo -e "${GREEN}✅ Réussis: $pass_count${NC}"
echo -e "${RED}❌ Échoués: $fail_count${NC}"
echo "📋 Total: $check_count"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUS LES FICHIERS SONT EN PLACE!${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. npm install        (pour installer les dépendances)"
    echo "2. cp .env.example .env.local  (configurer Auth0)"
    echo "3. npm run dev        (lancer le serveur)"
    echo "4. Visiter http://localhost:3000/connexion"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  CERTAINS FICHIERS SONT MANQUANTS!${NC}"
    echo "Veuillez revérifier l'installation."
    echo ""
    exit 1
fi
