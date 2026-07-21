#!/bin/bash
# Installation et démarrage rapide - SAIMO Landing

echo "🚀 Installation du projet SAIMO..."

# 1. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 2. Créer le fichier .env.local
echo "⚙️  Configuration de l'environnement..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ .env.local créé (à configurer avec vos credentials Auth0)"
else
    echo "⏭️  .env.local existe déjà, passage..."
fi

# 3. Lancer le serveur de développement
echo ""
echo "🎯 Démarrage du serveur de développement..."
echo "📍 http://localhost:3000"
echo ""
echo "Routes disponibles:"
echo "  - http://localhost:3000/connexion (Modal)"
echo "  - http://localhost:3000/connexion/administrations (Admin Login)"
echo "  - http://localhost:3000/connexion/visiteurs (Visitors Registration)"
echo ""

npm run dev
