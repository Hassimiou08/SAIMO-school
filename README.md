# SAIMO — Landing page

Landing page de la plateforme de gestion scolaire multiétablissement du
Groupe SAIMO. Basée sur la stack officielle du cahier des charges v2.0 :
Next.js (App Router) + TypeScript, React, Tailwind CSS, GSAP.

## Démarrage

Prérequis : Node.js 18.18 ou supérieur.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Ouvrez ensuite http://localhost:3000 dans votre navigateur.

## Scripts disponibles

- `npm run dev` — serveur de développement avec rechargement à chaud
- `npm run build` — build de production
- `npm run start` — démarre le build de production
- `npm run lint` — vérifie le code avec ESLint

## Structure du projet

```
app/
  layout.tsx          Layout racine, polices (Space Grotesk, IBM Plex Sans/Mono)
  page.tsx             Assemblage de la page d'accueil
  globals.css           Styles globaux + Tailwind
  connexion/page.tsx     Page de connexion (/connexion)
  portail/page.tsx        Portail établissement — tableau de bord interne (/portail)
  portail/eleves/page.tsx  Liste des élèves, recherche et filtres (/portail/eleves)
  portail/eleves/[id]/page.tsx  Fiche élève : informations, résultats, absences, paiements
components/
  Navbar.tsx            Navigation sticky
  Hero.tsx               Section d'ouverture + animation GSAP
  DashboardMock.tsx       Maquette de tableau de bord animée (élément signature)
  ProblemSection.tsx      Contraste "avant / après SAIMO"
  FeaturesGrid.tsx        Les 6 modules de la plateforme
  WorkflowSection.tsx     Parcours inscription → notes → bulletin → paiement
  SecuritySection.tsx     Isolation multiétablissement, audit, sauvegardes
  CTASection.tsx          Appel à l'action établissement pilote
  Footer.tsx              Pied de page
  Logo.tsx                Logo SAIMO en SVG (badge + wordmark)
  portal/StudentsTable.tsx      Liste des élèves avec recherche et filtres
  portal/StudentProfile.tsx     Fiche élève à onglets (infos, résultats, absences, paiements)
  auth/LoginCard.tsx        Formulaire de connexion (établissement, e-mail, mot de passe)
  portal/Sidebar.tsx         Navigation latérale du portail (Élèves, Notes, Absences...)
  portal/Topbar.tsx           Barre supérieure (année scolaire, recherche, profil)
  portal/StatCards.tsx         Indicateurs animés (élèves, bulletins, présence, paiements)
  portal/ClassChart.tsx        Graphique des moyennes par classe
  portal/ActivityTable.tsx     Journal d'activité récente
```

## Pages disponibles

- `/` — Landing page publique
- `/connexion` — Écran de connexion (établissement, e-mail, mot de passe)
- `/portail` — Portail établissement : sidebar, indicateurs, graphique de
  classes et activité récente.
- `/portail/eleves` — Liste des élèves avec recherche par nom/matricule et
  filtres par classe et statut.
- `/portail/eleves/[id]` — Fiche élève complète : identité, parent/tuteur,
  documents, résultats par matière, absences et historique des paiements.

Toutes les pages du portail utilisent des données statiques
(`lib/mock-students.ts`) pour l'instant, à brancher sur les Server
Actions / API une fois le backend (Prisma/PostgreSQL) disponible.

## Système de design

- **Couleurs** : bleu marine (`navy`), bleu (`blue`), sarcelle (`teal`),
  or (`gold`) — dérivées du logo SAIMO. Voir `tailwind.config.ts`.
- **Typographies** : Space Grotesk (titres), IBM Plex Sans (texte courant,
  bon support du français), IBM Plex Mono (chiffres, données).
- **Animations** : GSAP pour les entrées de section et les compteurs
  animés du tableau de bord. `prefers-reduced-motion` est respecté
  globalement (voir `globals.css`).

## Prochaines étapes suggérées

- Remplacer `mailto:contact@saimo.gn` par un vrai formulaire de contact
  ou un lien de prise de rendez-vous.
- Brancher les futures pages (connexion, portail établissement) sur la
  même base Tailwind/GSAP pour rester cohérent avec cette landing page.
- Ajouter Shadcn UI au moment où des composants de formulaire ou de
  tableau plus riches seront nécessaires (non requis pour cette page).
"# SAIMO-school" 
