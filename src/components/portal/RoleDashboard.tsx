"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, BarChart, ClipboardCheck, Users, Wallet2, Briefcase, MessageCircle, ShieldCheck, Coins } from "lucide-react";

type PortalRole =
  | "super_admin"
  | "directeur"
  | "secretaire"
  | "comptable"
  | "enseignant"
  | "parent"
  | "eleve";

const roleOptions: { id: PortalRole; label: string; description: string }[] = [
  { id: "super_admin", label: "Super Admin SAIMO", description: "Vue globale sur tous les établissements SAIMO." },
  { id: "directeur", label: "Directeur", description: "Pilotage stratégique d’un établissement." },
  { id: "secretaire", label: "Secrétaire", description: "Gestion des inscriptions et documents." },
  { id: "comptable", label: "Comptable", description: "Suivi des paiements, factures et reçus." },
  { id: "enseignant", label: "Enseignant", description: "Gestion des classes, notes et messages." },
  { id: "parent", label: "Parent", description: "Suivi de la progression d’un enfant." },
  { id: "eleve", label: "Élève", description: "Mon agenda, mes résultats et mes devoirs." },
];

const roleDashboardData: Record<PortalRole, {
  title: string;
  subtitle: string;
  stats: { label: string; value: string; icon: typeof Users; highlight?: boolean }[];
  cards: { title: string; content: string }[];
}> = {
  super_admin: {
    title: "Dashboard principal Super Admin",
    subtitle: "Suivez les établissements, l’activité globale et la santé du réseau SAIMO.",
    stats: [
      { label: "Établissements actifs", value: "28", icon: Users, highlight: true },
      { label: "Utilisateurs totaux", value: "12 400", icon: ShieldCheck },
      { label: "Acivité système", value: "99,8 %", icon: BarChart },
    ],
    cards: [
      { title: "Performance réseau", content: "Une vision consolidée des KPI, de la fréquentation et des usages par établissement." },
      { title: "Sécurité & conformité", content: "Un suivi des accès, des rôles et des permissions pour les administrateurs SAIMO." },
      { title: "Pilotage stratégique", content: "Analyse des tendances, décisions de déploiement et priorités d’expansion." },
    ],
  },
  directeur: {
    title: "Dashboard Directeur",
    subtitle: "Pilotez votre établissement avec des indicateurs de présence, performance et personnel.",
    stats: [
      { label: "Taux de présence", value: "96 %", icon: ClipboardCheck, highlight: true },
      { label: "Élèves actifs", value: "1 248", icon: Users },
      { label: "Bulletins prêts", value: "312", icon: BookOpen },
    ],
    cards: [
      { title: "Orientation pédagogique", content: "Suivez l’avancement des classes et identifiez les axes de progrès pour l’équipe éducative." },
      { title: "Gouvernance scolaire", content: "Coordonnez les plannings, réunions et ressources avec le secrétariat et les enseignants." },
      { title: "Engagement des familles", content: "Visualisez les communications, les retours et les demandes en temps réel." },
    ],
  },
  secretaire: {
    title: "Dashboard Secrétaire",
    subtitle: "Organisez les dossiers, inscriptions et flux administratifs de façon claire.",
    stats: [
      { label: "Dossiers traités", value: "124", icon: Briefcase, highlight: true },
      { label: "Inscriptions en attente", value: "18", icon: Users },
      { label: "Notifications envoyées", value: "76", icon: MessageCircle },
    ],
    cards: [
      { title: "Gestion des admissions", content: "Contrôlez les inscriptions, les documents requis et les validations rapidement." },
      { title: "Agenda administratif", content: "Anticipez les rendez-vous, les relances et les échéances scolaires." },
      { title: "Communication interne", content: "Centralisez les échanges avec les familles et les équipes pédagogiques." },
    ],
  },
  comptable: {
    title: "Dashboard Comptable",
    subtitle: "Suivez les paiements, factures, reçus et soldes en temps réel.",
    stats: [
      { label: "Paiements à jour", value: "94 %", icon: Wallet2, highlight: true },
      { label: "Reçus générés", value: "532", icon: Coins },
      { label: "Encours", value: "7 400 000 GNF", icon: BarChart },
    ],
    cards: [
      { title: "Suivi des factures", content: "Identifiez les paiements en retard et générez automatiquement les reçus." },
      { title: "Trésorerie", content: "Visualisez l’état des encaissements et les prévisions de trésorerie mensuelle." },
      { title: "Conformité financière", content: "Vérifiez les documents, les validations et l’historique des règlements." },
    ],
  },
  enseignant: {
    title: "Dashboard Enseignant",
    subtitle: "Accédez à vos classes, notes, absences et échanges en un seul écran.",
    stats: [
      { label: "Classes suivies", value: "4", icon: BookOpen, highlight: true },
      { label: "Devoirs à corriger", value: "22", icon: ClipboardCheck },
      { label: "Messages reçus", value: "9", icon: MessageCircle },
    ],
    cards: [
      { title: "Planification pédagogique", content: "Organisez vos séances, vos évaluations et vos ressources de classe." },
      { title: "Suivi élèves", content: "Repérez les besoins spécifiques et suivez les progrès individuellement." },
      { title: "Communication facile", content: "Envoyez des informations ciblées aux parents et à l’administration." },
    ],
  },
  parent: {
    title: "Dashboard Parent",
    subtitle: "Suivez les résultats, absences et activités de votre enfant simplement.",
    stats: [
      { label: "Notes moyennes", value: "14,8/20", icon: BarChart, highlight: true },
      { label: "Absences du mois", value: "2", icon: CalendarCheck },
      { label: "Messages reçus", value: "5", icon: MessageCircle },
    ],
    cards: [
      { title: "Progression scolaire", content: "Accédez aux notes, bulletins et compétences évaluées de votre enfant." },
      { title: "Présence et suivi", content: "Consultez les absences, retards et activités prévues pour la semaine." },
      { title: "Contact enseignant", content: "Restez en lien avec l’établissement via les messages et les rendez-vous." },
    ],
  },
  eleve: {
    title: "Dashboard Élève",
    subtitle: "Votre agenda, vos devoirs et vos résultats accessibles en un seul endroit.",
    stats: [
      { label: "Devoirs à rendre", value: "3", icon: ClipboardCheck, highlight: true },
      { label: "Moyenne générale", value: "15,2/20", icon: BarChart },
      { label: "Présences", value: "96 %", icon: Users },
    ],
    cards: [
      { title: "Mon emploi du temps", content: "Consultez les cours du jour, les devoirs à rendre et les examens à venir." },
      { title: "Mes résultats", content: "Visualisez vos bulletins, vos notes par matière et vos progrès." },
      { title: "Mes échanges", content: "Recevez les messages de l’école et suivez les demandes de vos professeurs." },
    ],
  },
};

export function RoleDashboard() {
  const [selectedRole, setSelectedRole] = useState<PortalRole>("directeur");

  useEffect(() => {
    const storedRole = window.localStorage.getItem("saimo-portal-role") as PortalRole | null;
    if (storedRole && roleOptions.some((option) => option.id === storedRole)) {
      setSelectedRole(storedRole);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("saimo-portal-role", selectedRole);
  }, [selectedRole]);

  const roleData = roleDashboardData[selectedRole];

  return (
    <section className="rounded-[2rem] border border-navy-900/5 bg-white p-6 shadow-[0_25px_60px_-25px_rgba(15,42,74,0.2)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
            Dashboard par rôle
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {roleData.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-500">
            {roleData.subtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {roleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedRole(option.id)}
              className={`rounded-2xl border px-4 py-4 text-left transition hover:border-primary-300 ${
                option.id === selectedRole
                  ? "border-primary-400 bg-primary-50 shadow-sm"
                  : "border-navy-900/5 bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-navy-900">{option.label}</p>
              <p className="mt-1 text-xs text-ink-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roleData.stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl border p-5 ${
              stat.highlight ? "border-primary-200 bg-primary-50/80" : "border-navy-900/5 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-navy-900" />
              <span className="text-sm text-ink-500">{stat.label}</span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-navy-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {roleData.cards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-navy-900">
              <BarChart className="h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">{card.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-navy-900/5 bg-navy-950 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Vue rapide</p>
            <p className="mt-2 text-lg font-semibold">Personnalisez selon votre rôle</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
            <ShieldCheck className="h-4 w-4 text-teal-300" />
            Rôle actif : {roleOptions.find((option) => option.id === selectedRole)?.label}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">Accès rapide</p>
            <p className="mt-2 text-sm text-white/70">Utilisez la sélection ci-dessus pour tester l’interface de chaque profil.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">Note</p>
            <p className="mt-2 text-sm text-white/70">Les contenus sont des exemples de dashboards spécifiques par rôle.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
