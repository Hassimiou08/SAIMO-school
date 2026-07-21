@echo off
REM Installation et démarrage rapide - SAIMO Landing (Windows)

echo.
echo 🚀 Installation du projet SAIMO...
echo.

REM 1. Installer les dépendances
echo 📦 Installation des dépendances...
call npm install

REM 2. Créer le fichier .env.local
echo.
echo ⚙️  Configuration de l'environnement...
if not exist .env.local (
    copy .env.example .env.local
    echo ✅ .env.local créé (à configurer avec vos credentials Auth0)
) else (
    echo ⏭️  .env.local existe déjà, passage...
)

REM 3. Lancer le serveur de développement
echo.
echo 🎯 Démarrage du serveur de développement...
echo 📍 http://localhost:3000
echo.
echo Routes disponibles:
echo   - http://localhost:3000/connexion ^(Modal^)
echo   - http://localhost:3000/connexion/administrations ^(Admin Login^)
echo   - http://localhost:3000/connexion/visiteurs ^(Visitors Registration^)
echo.

call npm run dev
pause
