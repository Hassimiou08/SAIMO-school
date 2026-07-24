"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Bus, ChefHat, Clock, GraduationCap, Heart, Mail, MapPin, PhoneCall, Shield, Star, Users, Zap, Book } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const CYCLES = [
  {
    level: "01",
    name: "Maternelle",
    ages: "3 – 5 ans",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: Heart,
    desc: "Un apprentissage par le jeu, la découverte sensorielle et l'épanouissement de l'enfant dans un environnement bienveillant.",
    matières: ["Éveil artistique", "Motricité fine", "Langage oral", "Vie collective"],
  },
  {
    level: "02",
    name: "Primaire",
    ages: "6 – 11 ans",
    color: "from-navy-700 to-navy-900",
    bg: "bg-navy-50/50",
    border: "border-navy-200",
    badge: "bg-navy-100 text-navy-700",
    icon: BookOpen,
    desc: "Des bases solides en français, mathématiques et sciences, consolidées par des projets concrets et interactifs.",
    matières: ["Français", "Mathématiques", "Sciences", "Histoire-Géo", "Anglais"],
  },
  {
    level: "03",
    name: "Collège",
    ages: "12 – 15 ans",
    color: "from-orange-400 to-orange-500",
    bg: "bg-orange-50/50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    icon: Book,
    desc: "Un accompagnement académique sérieux et structuré, orienté vers l'acquisition de méthodes de travail et le Brevet.",
    matières: ["Maths", "SVT", "Physique-Chimie", "Littérature", "Anglais", "Informatique"],
  },
  {
    level: "04",
    name: "Lycée",
    ages: "15 – 18 ans",
    color: "from-blue-600 to-orange-500",
    bg: "bg-[#FDF8F0]",
    border: "border-orange-300",
    badge: "bg-orange-100 text-blue-700",
    icon: GraduationCap,
    desc: "L'excellence académique pour préparer le Baccalauréat et l'orientation vers les études supérieures.",
    matières: ["Spécialités", "Philosophie", "Sciences avancées", "Langues", "Méthodologie", "Orientation"],
  },
];

const STATS = [
  { value: "500+", label: "Élèves inscrits", icon: Users },
  { value: "40+", label: "Enseignants qualifiés", icon: Star },
  { value: "15+", label: "Années d'expérience", icon: Shield },
  { value: "98%", label: "Taux de réussite", icon: Zap },
];

const SERVICES = [
  { icon: Bus, title: "Transport scolaire", desc: "Navettes sécurisées organisées par secteur géographique, matin et soir.", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { icon: ChefHat, title: "Cantine équilibrée", desc: "Repas préparés sur place, équilibrés et adaptés aux besoins nutritionnels des enfants.", color: "text-orange-600 bg-orange-50 border-orange-100" },
  { icon: Clock, title: "Garderie étendue", desc: "Service de garderie avant et après l'école, jusqu'à 18h30, en toute sécurité.", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { icon: Shield, title: "Espace parent", desc: "Portail numérique dédié pour consulter les notes, absences et activités en temps réel.", color: "text-navy-600 bg-navy-50 border-navy-100" },
];

const PRICING = [
  {
    title: "Maternelle",
    price: "150 000",
    period: "/ an",
    currency: "GNF",
    color: "border-blue-200 from-blue-50/50",
    badge: "bg-blue-100 text-blue-700",
    features: ["Fournitures incluses", "Activités d'éveil", "Accès portail parent", "Suivi personnalisé"],
  },
  {
    title: "Primaire",
    price: "200 000",
    period: "/ an",
    currency: "GNF",
    featured: false,
    color: "border-navy-200 from-navy-50/50",
    badge: "bg-navy-100 text-navy-700",
    features: ["Manuels inclus", "Ateliers ludiques", "Accès portail parent", "Soutien scolaire"],
  },
  {
    title: "Collège",
    price: "250 000",
    period: "/ an",
    currency: "GNF",
    featured: true,
    color: "border-orange-300 from-orange-50/50",
    badge: "bg-orange-100 text-orange-700",
    features: ["Soutien intensif", "Préparation Brevet", "Orientation", "Laboratoire"],
  },
  {
    title: "Lycée",
    price: "300 000",
    period: "/ an",
    currency: "GNF",
    featured: false,
    color: "border-blue-300 from-blue-50/50",
    badge: "bg-blue-100 text-blue-700",
    features: ["Préparation Bac", "Stages de révision", "Conseil Supérieur", "Bibliothèque"],
  },
];

export default function SchoolPage() {
  const [activeCycle, setActiveCycle] = useState(0);

  return (
    <>
      <Navbar />
      <main className="bg-[#FDF8F0] overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center opacity-10" />
          
          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Vidéo de présentation à gauche */}
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-navy-800">
                <iframe 
                  src="https://player.vimeo.com/video/313364964?background=1&autoplay=1&loop=1&byline=0&title=0" 
                  className="absolute inset-0 h-full w-full object-cover" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen" 
                  allowFullScreen
                ></iframe>
                {/* Voile sombre pour intégrer parfaitement la vidéo au thème */}
                <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply pointer-events-none" />
              </div>

              {/* Texte à droite */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-orange-100 backdrop-blur-sm mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Conakry, Guinée — Ouvert aux inscriptions 2025–2026
                </div>
                <h1 className="font-display text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                  Découvrir<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">l'École SAIMO</span>
                </h1>
                <p className="text-lg text-white/80 leading-relaxed mb-10">
                  Un établissement moderne qui allie pédagogie active, excellence académique et accompagnement personnalisé — de la Maternelle au Lycée.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/sections/preinscription" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 shadow-lg">
                    Préinscrire mon enfant <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/sections/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 backdrop-blur-sm">
                    Nous contacter
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Stats bar */}
          <div className="relative border-t border-white/10 bg-navy-800">
            <div className="mx-auto max-w-6xl px-6 py-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-display text-2xl font-black text-white">{s.value}</p>
                        <p className="text-xs text-white/60">{s.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRESENTATION ─────────────────────────────────── */}
        <section className="py-24 bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">Notre mission</p>
                <h2 className="font-display text-4xl font-black text-navy-900 leading-tight mb-6">
                  Une éducation pensée pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">chaque enfant</span>
                </h2>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  SAIMO est fondée sur la conviction que chaque enfant est unique. Notre approche pédagogique valorise la curiosité, l'autonomie et la créativité, tout en garantissant des bases académiques solides.
                </p>
                <p className="text-base text-slate-600 leading-relaxed mb-8">
                  Nos enseignants travaillent en petit effectif pour garantir un suivi individualisé de qualité, du premier jour de Maternelle jusqu'à l'obtention du Baccalauréat au Lycée.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Pédagogie active", "Classes connectées", "Suivi numérique", "Environnement bienveillant"].map((tag) => (
                    <span key={tag} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl shadow-xl h-72">
                  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" alt="Salle de classe SAIMO" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-2xl shadow-md h-40">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80" alt="Élèves en cours" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-md h-40">
                    <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80" alt="Activités scolaires" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CYCLES SCOLAIRES ─────────────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">Programmes scolaires</p>
              <h2 className="font-display text-4xl font-black text-navy-900">Nos quatre cycles d'enseignement</h2>
              <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">Un programme complet de la Maternelle au Lycée pour accompagner l'enfant tout au long de sa scolarité.</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-3 mb-10 flex-wrap">
              {CYCLES.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => setActiveCycle(idx)}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${activeCycle === idx ? `bg-gradient-to-r ${c.color} text-white shadow-lg` : "border border-neutral-200 bg-white text-navy-900 hover:border-neutral-300"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Active Cycle Card */}
            {CYCLES.map((c, idx) => {
              const Icon = c.icon;
              if (idx !== activeCycle) return null;
              return (
                <div key={c.name} className={`rounded-3xl border-2 ${c.border} ${c.bg} p-8 lg:p-12`}>
                  <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cycle {c.level}</p>
                          <h3 className="font-display text-3xl font-black text-navy-900">{c.name}</h3>
                        </div>
                        <span className={`ml-auto rounded-full px-4 py-1.5 text-xs font-bold ${c.badge}`}>{c.ages}</span>
                      </div>
                      <p className="text-base text-slate-700 leading-relaxed mb-8">{c.desc}</p>
                      <Link href="/sections/preinscription" className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${c.color} px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition`}>
                        Inscrire en {c.name} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Matières clés</p>
                      <div className="grid grid-cols-2 gap-3">
                        {c.matières.map((m) => (
                          <div key={m} className="flex items-center gap-2.5 rounded-xl border border-white bg-white/70 px-4 py-3 shadow-sm">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${c.color} flex-shrink-0`} />
                            <span className="text-sm font-medium text-navy-900">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────── */}
        <section className="py-24 bg-white border-y border-neutral-200">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-4">Nos services</p>
              <h2 className="font-display text-4xl font-black text-navy-900">Pour accompagner toute la famille</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className={`rounded-2xl border p-6 ${s.color.split(" ").slice(1).join(" ")}`}>
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${s.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-navy-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TARIFS ───────────────────────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">Frais scolaires</p>
              <h2 className="font-display text-4xl font-black text-navy-900">Une tarification transparente</h2>
              <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">Des frais clairs, sans surprise, avec tout le nécessaire pour une scolarité épanouie.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRICING.map((p) => (
                <div key={p.title} className={`relative rounded-3xl border-2 bg-gradient-to-br ${p.color} to-white p-6 ${p.featured ? "shadow-2xl scale-[1.02]" : "shadow-md bg-white"}`}>
                  {p.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow">
                      Populaire
                    </div>
                  )}
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${p.badge}`}>{p.title}</span>
                  <div className="mt-5 mb-1">
                    <span className="font-display text-3xl font-black text-navy-900">{p.price}</span>
                    <span className="text-xs font-semibold text-slate-500 block mt-1">{p.currency} {p.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700 leading-tight">
                        <span className="w-4 h-4 mt-0.5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0 text-blue-600 text-[10px] font-black">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sections/preinscription" className={`mt-8 block rounded-xl py-2.5 text-center text-sm font-bold transition ${p.featured ? "bg-navy-900 text-white hover:bg-navy-800 shadow-lg" : "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"}`}>
                    S'inscrire
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCALISATION & CONTACT ───────────────────────── */}
        <section className="py-24 bg-white border-t border-neutral-200">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-4">Localisation</p>
              <h2 className="font-display text-4xl font-black text-navy-900">Nous trouver</h2>
            </div>
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-start">
              <div className="space-y-5">
                {[
                  { icon: Mail, label: "E-mail", value: "contact@saimo.gn", href: "mailto:contact@saimo.gn", color: "bg-blue-50 text-blue-600 border-blue-100" },
                  { icon: PhoneCall, label: "Téléphone", value: "+224 XXX XXX XXX", href: "tel:+224000000000", color: "bg-orange-50 text-orange-600 border-orange-100" },
                  { icon: MapPin, label: "Adresse", value: "Conakry, Ratoma — près du centre municipal", href: "#", color: "bg-navy-50 text-navy-700 border-navy-100" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.label} href={item.href} className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-md transition group">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                        <p className="mt-0.5 font-bold text-navy-900 group-hover:text-blue-600 transition">{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
              <div className="overflow-hidden rounded-3xl border-4 border-neutral-200 shadow-xl h-[340px]">
                <iframe
                  title="Localisation SAIMO"
                  src="https://www.google.com/maps?q=Ratoma,+Conakry,+Guinée&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────── */}
        <section className="py-24 bg-navy-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-800" />

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-4xl font-black text-white mb-6">Prêt à rejoindre la famille SAIMO ?</h2>
            <p className="text-base text-white/70 mb-10 max-w-xl mx-auto">
              Les inscriptions pour l'année 2025–2026 sont ouvertes. Faites le premier pas vers l'excellence académique.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sections/preinscription" className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-8 py-4 text-sm font-bold text-white hover:bg-navy-800 transition shadow-xl">
                Commencer la préinscription <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sections/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-navy-900 hover:bg-neutral-100 transition shadow-lg">
                Poser une question
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
