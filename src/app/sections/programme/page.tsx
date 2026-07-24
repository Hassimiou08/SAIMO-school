"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Globe2,
  Trophy,
  Brain,
  Medal,
  Zap,
  GraduationCap
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const allCycles = [
  {
    id: "maternelle",
    shortTitle: "Maternelle",
    subtitle: "CRÈCHE - PS - MS - GS",
    icon: <Heart className="h-6 w-6" />,
    title: "Cycle Maternelle",
    category: "ÉVEIL & SOCIALISATION (3-5 ANS)",
    description: "Un environnement stimulant où les tout-petits développent leur motricité, leur langage et leur sociabilité à travers le jeu et l'art.",
    effectif: "20 / classe",
    langues: "FR + EN",
    niveauxRange: "Crèche → GS",
    classes: ["Crèche", "PS", "MS", "GS"],
    features: ["Pédagogie par le jeu", "Ateliers artistiques", "Initiation à l'anglais", "Espaces sécurisés"],
    priceNew: "4 500 000 GNF",
    priceRe: "4 300 000 GNF",
    image: "https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&w=1200&q=80",
    color: "pink-500",
    bgColor: "bg-pink-100",
    activeColor: "bg-pink-600",
  },
  {
    id: "primaire",
    shortTitle: "Primaire",
    subtitle: "CP1 — CM1",
    icon: <Globe2 className="h-6 w-6" />,
    title: "Cycle Primaire",
    category: "FONDAMENTAUX & BILINGUISME (6-11 ANS)",
    description: "Acquisition des savoirs fondamentaux (lecture, écriture, calcul) avec une immersion linguistique quotidienne pour un bilinguisme naturel.",
    effectif: "24 / classe",
    langues: "FR + EN",
    niveauxRange: "CP1 → CM1",
    classes: ["CP1", "CP2", "CE1", "CE2", "CM1"],
    features: ["Programme bilingue", "Méthodes actives", "Informatique dès le CP", "Sorties éducatives"],
    priceNew: "6 300 000 GNF",
    priceRe: "6 100 000 GNF",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    color: "blue-600",
    bgColor: "bg-blue-100",
    activeColor: "bg-blue-600",
  },
  {
    id: "examen-primaire",
    shortTitle: "Examen Primaire (CM2)",
    subtitle: "6ÈME ANNÉE (CEE)",
    icon: <Trophy className="h-6 w-6" />,
    title: "Préparation au CEE",
    category: "EXAMEN NATIONAL (11-12 ANS)",
    description: "Une année décisive préparée avec rigueur. Renforcement des acquis et méthodologie pour aborder sereinement le Certificat d'Études Primaires.",
    effectif: "24 / classe",
    langues: "FR + EN",
    niveauxRange: "CM2",
    classes: ["CM2 A", "CM2 B"],
    features: ["Examens blancs réguliers", "Soutien intensif", "Méthodologie d'examen", "Coaching motivationnel"],
    priceNew: "6 800 000 GNF",
    priceRe: "6 500 000 GNF",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
    color: "sky-500",
    bgColor: "bg-sky-100",
    activeColor: "bg-sky-500",
  },
  {
    id: "college",
    shortTitle: "Collège",
    subtitle: "7ÈME — 9ÈME",
    icon: <Brain className="h-6 w-6" />,
    title: "Cycle Collège",
    category: "CONSOLIDATION (12-15 ANS)",
    description: "Développement de l'esprit critique, approfondissement des matières scientifiques et littéraires avec un encadrement de proximité.",
    effectif: "28 / classe",
    langues: "FR + EN",
    niveauxRange: "7ème → 9ème",
    classes: ["7ème", "8ème", "9ème"],
    features: ["Labo de sciences", "Projets interdisciplinaires", "Clubs de lecture", "Sports & Arts"],
    priceNew: "7 500 000 GNF",
    priceRe: "7 200 000 GNF",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    color: "orange-500",
    bgColor: "bg-orange-100",
    activeColor: "bg-orange-500",
  },
  {
    id: "examen-college",
    shortTitle: "Examen Collège (10ème)",
    subtitle: "10ÈME ANNÉE (BEPC)",
    icon: <Medal className="h-6 w-6" />,
    title: "Préparation au BEPC",
    category: "EXAMEN NATIONAL (15-16 ANS)",
    description: "Une année axée sur la réussite au BEPC avec des cours de renforcement, des évaluations continues et un accompagnement psychologique.",
    effectif: "28 / classe",
    langues: "FR + EN",
    niveauxRange: "10ème",
    classes: ["10ème A", "10ème B"],
    features: ["Soutien hebdomadaire", "Travaux dirigés", "Examens blancs mensuels", "Orientation pré-lycée"],
    priceNew: "8 000 000 GNF",
    priceRe: "7 800 000 GNF",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    color: "yellow-500",
    bgColor: "bg-yellow-100",
    activeColor: "bg-yellow-500",
  },
  {
    id: "lycee",
    shortTitle: "Lycée",
    subtitle: "11ÈME — 12ÈME",
    icon: <Zap className="h-6 w-6" />,
    title: "Cycle Lycée",
    category: "SPÉCIALISATION (16-18 ANS)",
    description: "Affinement du projet professionnel, choix des séries (Sciences Expérimentales, Mathématiques, Sciences Sociales) et excellence académique.",
    effectif: "30 / classe",
    langues: "FR + EN",
    niveauxRange: "11ème → 12ème",
    classes: ["11ème", "12ème"],
    features: ["Orientation Supérieure", "Laboratoires équipés", "Conférences métiers", "Prépa Universitaire"],
    priceNew: "8 500 000 GNF",
    priceRe: "8 200 000 GNF",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    color: "green-600",
    bgColor: "bg-green-100",
    activeColor: "bg-green-600",
  },
  {
    id: "examen-lycee",
    shortTitle: "Examen Lycée (Terminale)",
    subtitle: "TERMINALE (BAC)",
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Préparation au Baccalauréat",
    category: "EXAMEN NATIONAL & UNIVERSITÉ",
    description: "L'année de la consécration. Un programme intensif pour garantir un taux de réussite élevé au Bac et ouvrir les portes des meilleures universités.",
    effectif: "30 / classe",
    langues: "FR + EN",
    niveauxRange: "Terminale",
    classes: ["Term. SM", "Term. SE", "Term. SS"],
    features: ["Cours intensifs", "Soutien le week-end", "Jury d'oraux", "Assistance bourses d'études"],
    priceNew: "9 500 000 GNF",
    priceRe: "9 000 000 GNF",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    color: "teal-600",
    bgColor: "bg-teal-100",
    activeColor: "bg-teal-600",
  }
];

export default function ProgrammePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCycleId, setActiveCycleId] = useState(allCycles[1].id); // Default on Primaire

  const activeCycle = allCycles.find(c => c.id === activeCycleId) || allCycles[1];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(
        ".hero-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      // Parcours Complet Animation
      gsap.fromTo(
        ".parcours-header-el",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".parcours-section",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".parcours-tab-btn",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".parcours-section",
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".parcours-pane",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".parcours-section",
            start: "top 60%",
          },
        }
      );

      // Steps Animation (La Méthode)
      gsap.fromTo(
        ".step-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".method-section",
            start: "top 75%",
          },
        }
      );

      // Wiggle animation for numbers (1, 2, 3)
      gsap.fromTo(
        ".step-number",
        { scale: 0, rotation: -45 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          delay: 0.2,
          ease: "elastic.out(1.2, 0.4)",
          scrollTrigger: {
            trigger: ".method-section",
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-navy-950 pt-24 pb-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] rounded-full bg-orange-500/20 blur-[120px]" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="hero-el inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-md">
              Projet Pédagogique
            </span>
            <h1 className="hero-el font-display text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 leading-tight">
              Un parcours d'excellence pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">forger l'avenir</span>
            </h1>
            <p className="hero-el text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Nous déployons une méthode d'enseignement innovante et rigoureuse, pensée pour cultiver le plein potentiel de chaque élève tout au long de sa scolarité.
            </p>
          </div>
        </section>

        {/* PARCOURS COMPLET SECTION (INTERACTIVE TABS) */}
        <section className="parcours-section relative z-20 py-24 bg-paper-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <span className="parcours-header-el inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                Parcours Complet
              </span>
              <h2 className="parcours-header-el font-display text-4xl font-bold text-navy-900 mb-4">5 cycles, <span className="text-orange-400">18 années</span> d'accompagnement</h2>
              <p className="parcours-header-el text-slate-600 text-lg">Sélectionnez un cycle pour voir le détail des classes, des effectifs et des frais associés.</p>
            </div>

            {/* TAB BUTTONS */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
              {allCycles.map(cycle => (
                <button 
                  key={cycle.id}
                  onClick={() => setActiveCycleId(cycle.id)}
                  className={`parcours-tab-btn text-left rounded-2xl p-5 transition-all duration-300 border shadow-sm ${
                    activeCycleId === cycle.id 
                    ? `${cycle.activeColor} border-transparent text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] scale-105 z-10` 
                    : 'bg-white border-neutral-200 text-navy-900 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className={`mb-4 inline-flex rounded-xl p-2.5 ${activeCycleId === cycle.id ? 'bg-white/20' : cycle.bgColor} ${activeCycleId === cycle.id ? 'text-white' : 'text-' + cycle.color}`}>
                    {cycle.icon}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${activeCycleId === cycle.id ? 'text-white/80' : 'text-slate-400'}`}>
                    {cycle.subtitle}
                  </p>
                  <h3 className="font-bold text-lg leading-tight">{cycle.shortTitle}</h3>
                </button>
              ))}
            </div>

            {/* ACTIVE CONTENT PANE */}
            <div className="parcours-pane mt-6 rounded-[2rem] bg-white shadow-[0_20px_50px_-20px_rgba(15,42,74,0.1)] overflow-hidden flex flex-col lg:flex-row border border-neutral-100">
              {/* Left Image */}
              <div className="lg:w-5/12 relative min-h-[400px] lg:min-h-auto overflow-hidden">
                <img 
                  src={activeCycle.image} 
                  key={activeCycle.image} // key forces re-render/animation
                  alt={activeCycle.title} 
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent" />
                <div className="absolute top-6 right-6">
                  <span className="bg-white/90 backdrop-blur-sm text-navy-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                    ANNÉE 2026-2027
                  </span>
                </div>
                
                <div className="absolute top-6 left-6">
                  <div className={`inline-flex rounded-xl p-3 bg-white/20 backdrop-blur-md text-white border border-white/20`}>
                    {activeCycle.icon}
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-sm font-bold text-orange-400 mb-2 tracking-wider">{activeCycle.subtitle}</p>
                  <h2 className="font-display text-4xl font-bold">{activeCycle.title}</h2>
                </div>
              </div>

              {/* Right Details */}
              <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">{activeCycle.category}</p>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">{activeCycle.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-4 text-center border border-neutral-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Effectif Max</p>
                    <p className="font-bold text-navy-900 text-lg">{activeCycle.effectif}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center border border-neutral-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Langues</p>
                    <p className="font-bold text-navy-900 text-lg">{activeCycle.langues}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center border border-neutral-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Niveaux</p>
                    <p className="font-bold text-navy-900 text-lg">{activeCycle.niveauxRange}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-wider">Classes Concernées</p>
                  <div className="flex flex-wrap gap-2">
                    {activeCycle.classes.map(cls => (
                      <span key={cls} className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-100">{cls}</span>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {activeCycle.features.map(feat => (
                    <div key={feat} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-5">
                    <p className="text-[10px] uppercase font-bold text-blue-600 mb-1 tracking-wider">Nouvelle Inscription</p>
                    <p className="font-display text-2xl font-bold text-navy-900">{activeCycle.priceNew}</p>
                  </div>
                  <div className="border border-orange-200 bg-orange-50/50 rounded-2xl p-5">
                    <p className="text-[10px] uppercase font-bold text-orange-600 mb-1 tracking-wider">Réinscription</p>
                    <p className="font-display text-2xl font-bold text-navy-900">{activeCycle.priceRe}</p>
                  </div>
                </div>

                <Link 
                  href="/sections/preinscription" 
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-600/30"
                >
                  INSCRIRE MON ENFANT
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* METHODE SAIMO - EN ETAPES */}
        <section className="method-section bg-white py-32 border-y border-neutral-200">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                Pédagogie
              </span>
              <h2 className="font-display text-4xl font-bold text-navy-900 mb-6">La Méthode SAIMO</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Un processus d'apprentissage éprouvé, structuré en 3 étapes fondamentales pour maximiser la réussite et l'épanouissement de chaque enfant.
              </p>
            </div>

            <div className="relative">
              {/* Vertical Line for timeline effect */}
              <div className="absolute left-[40px] md:left-[50px] top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-blue-500 via-orange-400 to-teal-500 hidden md:block opacity-30" />

              <div className="space-y-16">
                {/* Step 1 */}
                <div className="step-card relative flex flex-col md:flex-row gap-8 items-start">
                  <div className="step-number flex-shrink-0 relative z-10 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-blue-500 text-white font-display text-3xl font-bold shadow-lg shadow-blue-500/40 border-4 border-white">
                    01
                  </div>
                  <div className="bg-paper-50 rounded-3xl p-8 md:p-10 border border-neutral-100 flex-1 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold text-navy-900 mb-4">Intégration Numérique & Modernité</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Dès le primaire, nos élèves sont formés aux outils digitaux. L'utilisation de plateformes d'e-learning et de tableaux interactifs dynamise les cours et familiarise les enfants avec les compétences incontournables du 21ème siècle.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="step-card relative flex flex-col md:flex-row gap-8 items-start">
                  <div className="step-number flex-shrink-0 relative z-10 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-orange-500 text-white font-display text-3xl font-bold shadow-lg shadow-orange-500/40 border-4 border-white">
                    02
                  </div>
                  <div className="bg-paper-50 rounded-3xl p-8 md:p-10 border border-neutral-100 flex-1 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold text-navy-900 mb-4">Immersion Bilingue & Ouverture au Monde</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      L'apprentissage renforcé de l'anglais est au cœur de notre méthode. Des programmes bilingues et des projets culturels immersifs ouvrent l'esprit des élèves à l'international, brisant ainsi les barrières linguistiques dès le plus jeune âge.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="step-card relative flex flex-col md:flex-row gap-8 items-start">
                  <div className="step-number flex-shrink-0 relative z-10 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-teal-500 text-white font-display text-3xl font-bold shadow-lg shadow-teal-500/40 border-4 border-white">
                    03
                  </div>
                  <div className="bg-paper-50 rounded-3xl p-8 md:p-10 border border-neutral-100 flex-1 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold text-navy-900 mb-4">Suivi Ultra-Personnalisé & Transparence</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Aucun élève n'est laissé pour compte. Des évaluations régulières nous permettent d'identifier les lacunes et de proposer un soutien ciblé. Parallèlement, les parents disposent d'un accès en temps réel au portail pour suivre les progrès au quotidien.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 bg-paper-100 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-6">Prêt à nous confier l'avenir de votre enfant ?</h2>
            <p className="text-lg text-slate-600 mb-10">
              Les préinscriptions pour l'année scolaire 2026-2027 sont ouvertes. Réservez votre place dès aujourd'hui et rejoignez la famille SAIMO.
            </p>
            <Link 
              href="/sections/preinscription" 
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-orange-400 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.6)]"
            >
              Démarrer la préinscription
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
