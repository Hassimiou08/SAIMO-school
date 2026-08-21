"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Calculator, Camera, CheckCircle2, GraduationCap, User, Briefcase, ShieldCheck, Download } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Données des tarifs par cycle
const tarifData: Record<string, { 
  inscription: string; 
  reinscription: string; 
  mois: string; 
  annee: string; 
  tenue: string;
  programme: { title: string; description: string; points: string[] }
}> = {
  Maternelle: {
    inscription: "500 000 GNF",
    reinscription: "300 000 GNF",
    mois: "150 000 GNF",
    annee: "1 350 000 GNF",
    tenue: "120 000 GNF",
    programme: {
      title: "Éveil et Socialisation",
      description: "Un apprentissage par le jeu et la découverte pour stimuler le développement.",
      points: ["Motricité fine et globale", "Éveil linguistique", "Vivre ensemble"],
    }
  },
  Primaire: {
    inscription: "600 000 GNF",
    reinscription: "350 000 GNF",
    mois: "180 000 GNF",
    annee: "1 620 000 GNF",
    tenue: "150 000 GNF",
    programme: {
      title: "Fondamentaux et Méthodes",
      description: "Acquisition des savoirs de base et développement de l'autonomie.",
      points: ["Lecture et écriture", "Mathématiques", "Découverte du monde"],
    }
  },
  Collège: {
    inscription: "800 000 GNF",
    reinscription: "450 000 GNF",
    mois: "220 000 GNF",
    annee: "1 980 000 GNF",
    tenue: "180 000 GNF",
    programme: {
      title: "Approfondissement et Orientation",
      description: "Renforcement des connaissances disciplinaires et accompagnement.",
      points: ["Sciences et technologies", "Langues vivantes", "Culture générale"],
    }
  },
  Lycée: {
    inscription: "1 000 000 GNF",
    reinscription: "550 000 GNF",
    mois: "280 000 GNF",
    annee: "2 520 000 GNF",
    tenue: "200 000 GNF",
    programme: {
      title: "Spécialisation et Excellence",
      description: "Préparation intensive aux examens et à l'enseignement supérieur.",
      points: ["Préparation au Baccalauréat", "Méthodologie avancée", "Projet d'orientation"],
    }
  },
};

export function SchoolContent() {
  const [activeTarifCycle, setActiveTarifCycle] = useState<string>("Maternelle");
  const [isNewStudent, setIsNewStudent] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation Galerie Images
      gsap.fromTo(
        ".gallery-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#galerie",
            start: "top 75%",
          },
        }
      );

      // Animation Widget Tarifs
      gsap.fromTo(
        ".tarifs-widget",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tarifs-widget",
            start: "top 80%",
          },
        }
      );

      // Animation Vidéo Immersive
      gsap.fromTo(
        ".video-block",
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".video-block",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* SECTION 1 : Notre École en Images */}
      <section id="galerie" className="bg-paper-50 py-16 border-t border-neutral-200 overflow-hidden">
        <div className="mx-auto max-w-[1700px] px-6 lg:px-16">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-100 shadow-sm">
              ✨ Galerie
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
              Notre école en images
            </h2>
            <p className="mt-4 text-lg text-ink-500 max-w-2xl mx-auto">
              Découvrez nos différents espaces adaptés à chaque âge, pensés pour l'épanouissement, le confort et la réussite de vos enfants.
            </p>
          </div>
        </div>

        {/* Carrousel Infini (Marquee) */}
        <div className="relative w-full overflow-hidden flex pb-10">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-6 px-6">
            
            {/* --- PREMIER GROUPE D'IMAGES --- */}
            {[1, 2].map((group) => (
              <div key={group} className="flex gap-6">
                {/* Maternelle */}
                <div className="gallery-card group relative overflow-hidden rounded-[2rem] shadow-lg w-[300px] md:w-[350px] aspect-[4/5] cursor-pointer shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url('/Maternelle.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="inline-block px-3 py-1 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3 shadow-sm">3 À 5 ANS</span>
                    <h3 className="font-display text-2xl font-bold text-white">Maternelles</h3>
                    <p className="mt-2 text-sm text-white/80 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Éveil, sécurité et premiers apprentissages.
                    </p>
                  </div>
                </div>

                {/* Primaire */}
                <div className="gallery-card group relative overflow-hidden rounded-[2rem] shadow-lg w-[300px] md:w-[350px] aspect-[4/5] cursor-pointer shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url('/Primaire.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="inline-block px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3 shadow-sm">6 À 11 ANS</span>
                    <h3 className="font-display text-2xl font-bold text-white">Primaires</h3>
                    <p className="mt-2 text-sm text-white/80 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Salles lumineuses propices à l'apprentissage.
                    </p>
                  </div>
                </div>

                {/* Collège */}
                <div className="gallery-card group relative overflow-hidden rounded-[2rem] shadow-lg w-[300px] md:w-[350px] aspect-[4/5] cursor-pointer shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url('/College.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="inline-block px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3 shadow-sm">12 À 15 ANS</span>
                    <h3 className="font-display text-2xl font-bold text-white">Collèges</h3>
                    <p className="mt-2 text-sm text-white/80 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Développement de l'autonomie et de la méthode.
                    </p>
                  </div>
                </div>

                {/* Lycée */}
                <div className="gallery-card group relative overflow-hidden rounded-[2rem] shadow-lg w-[300px] md:w-[350px] aspect-[4/5] cursor-pointer shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url('/Lycée.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="inline-block px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3 shadow-sm">16 À 18 ANS</span>
                    <h3 className="font-display text-2xl font-bold text-white">Lycées</h3>
                    <p className="mt-2 text-sm text-white/80 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Préparation intensive au baccalauréat.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : Tarifs Interactifs */}
      <section id="tarifs" className="bg-paper-50 py-16 border-t border-neutral-200">
        <div className="mx-auto max-w-[1700px] px-6 lg:px-16">
          <div className="tarifs-header text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-100 shadow-sm">
              ✨ Transparence totale
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
              Tarifs et programmes scolaires
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              Chez SAIMO, nous croyons en une éducation de qualité à un prix transparent. Sélectionnez le cycle de votre enfant pour découvrir le programme et les frais associés.
            </p>
          </div>

          {/* Le Grand Widget Unifié */}
          <div className="tarifs-widget mx-auto max-w-7xl rounded-[2.5rem] bg-white p-4 lg:p-6 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-neutral-100">
            
            {/* Toggle Nouvelle inscription / Réinscription */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="flex items-center bg-slate-50 rounded-full p-1.5 border border-neutral-200/60 shadow-inner">
                <button
                  onClick={() => setIsNewStudent(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    isNewStudent ? "bg-green-600 text-white shadow-md" : "text-ink-500 hover:text-navy-900"
                  }`}
                >
                  {isNewStudent && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">New</span>}
                  Nouvelle inscription
                </button>
                <button
                  onClick={() => setIsNewStudent(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    !isNewStudent ? "bg-slate-100 text-navy-900 shadow-sm border border-neutral-200" : "text-ink-500 hover:text-navy-900"
                  }`}
                >
                  {!isNewStudent && <span className="text-[14px]">🔄</span>}
                  Réinscription
                </button>
              </div>
            </div>

            {/* Cycle Selector (Tabs) intégré en haut */}
            <div className="flex justify-center pt-6 pb-8 border-b border-neutral-100">
              <div className="inline-flex overflow-hidden">
                {Object.keys(tarifData).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setActiveTarifCycle(cycle)}
                    className={`relative rounded-full py-3 px-8 text-sm font-bold transition-all duration-300 ${
                      activeTarifCycle === cycle
                        ? "text-white bg-gradient-to-r from-blue-600 to-orange-400 shadow-md"
                        : "text-ink-500 hover:text-navy-900 hover:bg-neutral-100/50"
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            {/* Content : 2 Columns avec Wrapper d'Animation (On anime l'intérieur, pas la boîte) */}
            <div key={`content-${activeTarifCycle}`} className="grid gap-6 lg:grid-cols-[1.2fr_1fr] p-4 lg:p-8">
              
              {/* Left: Programme Card (Maintenant sans fond, intégré au widget) */}
              <div className="animate-fade-in-up flex flex-col justify-between p-4 lg:p-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-5">
                    Programme
                  </span>
                  <h3 className="font-display text-3xl font-bold text-navy-900 mb-4 leading-tight">
                    {tarifData[activeTarifCycle].programme.title}
                  </h3>
                  <p className="text-ink-500 leading-relaxed mb-8 text-base">
                    {tarifData[activeTarifCycle].programme.description}
                  </p>

                  <div className="space-y-4">
                    {tarifData[activeTarifCycle].programme.points.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-neutral-100">
                        <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-navy-900 font-semibold text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-6">
                  <a href="#preinscription" className="group inline-flex items-center gap-3 text-blue-600 font-bold hover:text-orange-500 transition-colors">
                    Démarrer la préinscription 
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 group-hover:bg-orange-100 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </a>
                </div>
              </div>

              {/* Right: SaaS Pricing Card (Gris très doux) */}
              <div className="animate-fade-in-up-delayed rounded-[2rem] bg-slate-50 p-8 shadow-sm border border-neutral-200 text-navy-900 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-200 to-orange-200 blur-3xl pointer-events-none opacity-30"></div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-2">Mensualité (9 mois)</p>
                    <div className="flex items-end justify-center gap-1">
                      <span className="font-display text-5xl font-extrabold text-navy-900 tracking-tight">{tarifData[activeTarifCycle].mois}</span>
                    </div>
                    <span className="inline-block mt-3 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-ink-600">Total : {tarifData[activeTarifCycle].annee}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className={`p-6 rounded-2xl border transition-colors ${isNewStudent ? 'bg-green-50/50 border-green-100' : 'bg-slate-50 border-neutral-100'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isNewStudent ? 'text-green-700' : 'text-neutral-500'}`}>
                        {isNewStudent ? "Frais d'inscription" : "Frais de réinscription"}
                      </span>
                      <div className="text-3xl font-bold text-navy-900 mb-1">
                        {isNewStudent ? tarifData[activeTarifCycle].inscription : tarifData[activeTarifCycle].reinscription}
                      </div>
                      <p className="text-sm text-neutral-500">Payable au premier versement</p>
                    </div>

                    <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/50">
                      <span className="text-xs font-bold uppercase tracking-wider mb-2 block text-amber-700">Scolarité annuelle</span>
                      <div className="text-3xl font-bold text-navy-900 mb-1">{tarifData[activeTarifCycle].annee}</div>
                      <p className="text-sm text-neutral-500">Ou {tarifData[activeTarifCycle].mois} / mois</p>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-neutral-100">
                      <span className="text-sm text-ink-600 font-medium">Tenue scolaire (Pack complet)</span>
                      <span className="font-bold text-navy-900">{tarifData[activeTarifCycle].tenue}</span>
                    </div>
                  </div>

                  <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-orange-400 py-4 text-center font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:scale-[1.02]">
                    Consulter les détails
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 : Vidéo Immersive */}
      <section className="bg-navy-950 py-16 relative overflow-hidden border-t border-navy-900">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        
        <div className="mx-auto max-w-[1700px] px-6 lg:px-16 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20">
              🎬 Vidéos
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Notre école en vidéo
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-4xl mx-auto">
              Découvrez les coulisses de la vie scolaire, les projets du trimestre et la dynamique de l’établissement à travers une présentation vidéo immersive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vidéo 1 */}
            <div className="video-block relative rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)] border border-white/10 bg-black">
              <video
                className="w-full aspect-video object-cover"
                controls
                poster="/College.jpg"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            </div>
            
            {/* Vidéo 2 */}
            <div className="video-block relative rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.2)] border border-white/10 bg-black">
              <video
                className="w-full aspect-video object-cover"
                controls
                poster="/Lycée.jpg"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-600/20 hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              VOIR TOUTES NOS VIDÉOS SUR FACEBOOK
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 4 : Accédez à votre espace (Style SAIMO Premium) */}
      <section className="bg-paper-100 py-24 border-t border-neutral-200 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl mb-4">
              Accédez à votre espace
            </h2>
            <p className="text-lg text-ink-500 max-w-2xl mx-auto">
              Connectez-vous à votre portail pour accéder à vos informations scolaires, notes, plannings et outils administratifs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Espace Élève */}
            <a href="/login?role=eleve" className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-orange-400">
                <GraduationCap className="h-10 w-10 text-blue-600 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900">Espace Élève</h3>
              <p className="mt-2 text-sm text-ink-500">Notes & Cours</p>
            </a>

            {/* Espace Parent */}
            <a href="/login?role=parent" className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/30 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-orange-400">
                <User className="h-10 w-10 text-orange-500 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900">Espace Parent</h3>
              <p className="mt-2 text-sm text-ink-500">Suivi scolaire</p>
            </a>

            {/* Employé */}
            <a href="/login?role=professeur" className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-orange-400">
                <Briefcase className="h-10 w-10 text-blue-600 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900">Employé</h3>
              <p className="mt-2 text-sm text-ink-500">Espace RH</p>
            </a>

            {/* Admin */}
            <a href="/login?role=admin" className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-orange-400">
                <ShieldCheck className="h-10 w-10 text-blue-600 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900">Admin</h3>
              <p className="mt-2 text-sm text-ink-500">Gestion globale</p>
            </a>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#preinscription" className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-orange-400 px-8 py-4 font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-blue-600/25">
              <GraduationCap className="h-5 w-5" />
              Pré-inscrire mon enfant
            </a>
            <button className="inline-flex items-center gap-3 rounded-2xl border-2 border-navy-900 bg-transparent px-8 py-4 font-bold text-navy-900 transition-all hover:bg-navy-900 hover:text-white">
              <Download className="h-5 w-5" />
              Installer l'Appli
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
