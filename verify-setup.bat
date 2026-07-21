@echo off
REM Checklist de vérification post-mise à jour SAIMO Landing (Windows)

setlocal enabledelayedexpansion

echo.
echo 🔍 VERIFICATION POST-MISE A JOUR SAIMO LANDING
echo =============================================="
echo.

set check_count=0
set pass_count=0
set fail_count=0

REM Vérifier les fichiers de configuration
echo 📄 Fichiers de Configuration:
if exist "tailwind.config.ts" (
    echo ✓ tailwind.config.ts
    set /a pass_count+=1
) else (
    echo ✗ tailwind.config.ts MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "package.json" (
    echo ✓ package.json
    set /a pass_count+=1
) else (
    echo ✗ package.json MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist ".env.example" (
    echo ✓ .env.example
    set /a pass_count+=1
) else (
    echo ✗ .env.example MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo 🎨 Nouveaux Composants:
if exist "components\auth\ConnectionModal.tsx" (
    echo ✓ ConnectionModal.tsx
    set /a pass_count+=1
) else (
    echo ✗ ConnectionModal.tsx MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "components\auth\AdminLoginForm.tsx" (
    echo ✓ AdminLoginForm.tsx
    set /a pass_count+=1
) else (
    echo ✗ AdminLoginForm.tsx MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "components\auth\VisitorsRegistration.tsx" (
    echo ✓ VisitorsRegistration.tsx
    set /a pass_count+=1
) else (
    echo ✗ VisitorsRegistration.tsx MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo 📄 Nouvelles Pages:
if exist "app\connexion\administrations\page.tsx" (
    echo ✓ app\connexion\administrations\page.tsx
    set /a pass_count+=1
) else (
    echo ✗ app\connexion\administrations\page.tsx MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "app\connexion\visiteurs\page.tsx" (
    echo ✓ app\connexion\visiteurs\page.tsx
    set /a pass_count+=1
) else (
    echo ✗ app\connexion\visiteurs\page.tsx MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "app\connexion\visiteurs\confirmation\page.tsx" (
    echo ✓ app\connexion\visiteurs\confirmation\page.tsx
    set /a pass_count+=1
) else (
    echo ✗ app\connexion\visiteurs\confirmation\page.tsx MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo ⚙️  Fichiers de Configuration:
if exist "lib\auth.config.ts" (
    echo ✓ lib\auth.config.ts
    set /a pass_count+=1
) else (
    echo ✗ lib\auth.config.ts MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "lib\auth.types.ts" (
    echo ✓ lib\auth.types.ts
    set /a pass_count+=1
) else (
    echo ✗ lib\auth.types.ts MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo 📚 Documentation:
if exist "docs\AUTH_BIOMETRIC_SETUP.md" (
    echo ✓ docs\AUTH_BIOMETRIC_SETUP.md
    set /a pass_count+=1
) else (
    echo ✗ docs\AUTH_BIOMETRIC_SETUP.md MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "docs\TESTING_GUIDE.md" (
    echo ✓ docs\TESTING_GUIDE.md
    set /a pass_count+=1
) else (
    echo ✗ docs\TESTING_GUIDE.md MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "MIGRATION_SUMMARY.md" (
    echo ✓ MIGRATION_SUMMARY.md
    set /a pass_count+=1
) else (
    echo ✗ MIGRATION_SUMMARY.md MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "UPDATE_README.md" (
    echo ✓ UPDATE_README.md
    set /a pass_count+=1
) else (
    echo ✗ UPDATE_README.md MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo 🚀 Scripts de Démarrage:
if exist "start.bat" (
    echo ✓ start.bat
    set /a pass_count+=1
) else (
    echo ✗ start.bat MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "start.sh" (
    echo ✓ start.sh
    set /a pass_count+=1
) else (
    echo ✗ start.sh MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo 📂 Dossiers:
if exist "docs" (
    echo ✓ docs\
    set /a pass_count+=1
) else (
    echo ✗ docs\ MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "components\auth" (
    echo ✓ components\auth\
    set /a pass_count+=1
) else (
    echo ✗ components\auth\ MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

if exist "app\connexion" (
    echo ✓ app\connexion\
    set /a pass_count+=1
) else (
    echo ✗ app\connexion\ MANQUANT
    set /a fail_count+=1
)
set /a check_count+=1

echo.
echo =============================================="
echo 📊 RESULTAT:
echo ✓ Reussis: %pass_count%
echo ✗ Echoues: %fail_count%
echo 📋 Total: %check_count%
echo.

if %fail_count% equ 0 (
    echo 🎉 TOUS LES FICHIERS SONT EN PLACE!
    echo.
    echo Prochaines etapes:
    echo 1. npm install                    (installer les dependances)
    echo 2. copy .env.example .env.local   (configurer Auth0)
    echo 3. npm run dev                    (lancer le serveur)
    echo 4. Visiter http://localhost:3000/connexion
    echo.
    pause
    exit /b 0
) else (
    echo ⚠️  CERTAINS FICHIERS SONT MANQUANTS!
    echo Veuillez revérifier l'installation.
    echo.
    pause
    exit /b 1
)
