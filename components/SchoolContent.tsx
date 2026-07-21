"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Camera,
  CirclePlay,
  GraduationCap,
  HandCoins,
  LayoutGrid,
  MapPin,
  MessagesSquare,
  PhoneCall,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const cycles = [
  {
    name: "Maternelle",
    age: "3 à 5 ans",
    description:
      "Un apprentissage par le jeu, la découverte du monde et l’épanouissement de l’enfant.",
    highlight: "Éveil, langage et socialisation",
  },
  {
    name: "Primaire",
    age: "6 à 11 ans",
    description:
      "Des bases solides en français, maths et sciences avec des projets concrets.",
    highlight: "Méthodes actives et suivi personnalisé",
  },
  {
    name: "Collège",
    age: "12 à 16 ans",
    description:
      "Un accompagnement académique sérieux, orienté succès et réussite scolaire.",
    highlight: "Orientation, discipline et excellence",
  },
];

const tarifs = [
  {
    title: "Frais de scolarité",
    value: "150 000 GNF",
    desc: "Par an, avec accès à l’espace parent et aux outils de suivi.",
  },
  {
    title: "Frais de cantine",
    value: "45 000 GNF",
    desc: "Mensuel, selon les options choisies par la famille.",
  },
  {
    title: "Frais de transport",
    value: "30 000 GNF",
    desc: "Mensuel, selon le secteur de résidence.",
  },
];

const games = [
  {
    title: "Quiz des sciences",
    text: "Des défis ludiques pour renforcer la curiosité scientifique des enfants.",
  },
  {
    title: "Jeu de logique",
    text: "Des exercices simples pour développer l’attention et la réflexion.",
  },
  {
    title: "Mission lecture",
    text: "Des aventures de lecture pour encourager la compréhension et l’expression.",
  },
];

const schoolVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

export function SchoolContent() {
  const [submitted, setSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <>
      <section id="services" className="bg-paper-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
              Nos services
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Une école moderne, connectée et rassurante
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              De la vie de l’école à l’espace parent, chaque service est pensé pour simplifier la communication, le suivi et la réussite.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-primary-200/70 bg-white p-8 shadow-[0_25px_60px_-25px_rgba(15,42,74,0.25)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy-900">
                    Notre école en image
                  </h3>
                  <p className="text-sm text-ink-500">
                    Des espaces modernes, des activités vivantes et des moments de vie scolaire.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 p-6">
                  <p className="text-sm font-semibold text-navy-900">Classes lumineuses</p>
                  <p className="mt-2 text-sm text-ink-600">Des salles pensées pour l’apprentissage, le confort et la concentration.</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-secondary-100 to-primary-100 p-6">
                  <p className="text-sm font-semibold text-navy-900">Espaces de vie</p>
                  <p className="mt-2 text-sm text-ink-600">Des espaces de détente, d’échange et d’expression pour les élèves.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-secondary-200/70 bg-gradient-to-br from-navy-950 to-primary-950 p-8 text-white shadow-[0_25px_60px_-20px_rgba(10,31,62,0.45)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-secondary-300">
                  <CirclePlay className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Notre école en vidéos</h3>
                  <p className="text-sm text-white/70">Des témoignages, des moments clés et des activités en direct.</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-6">
                <p className="text-sm leading-relaxed text-white/75">
                  Découvrez les coulisses de la vie scolaire, les projets du trimestre et la dynamique de l’établissement à travers une présentation vidéo immersive.
                </p>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <video
                    className="aspect-video w-full"
                    controls
                    preload="metadata"
                    poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  >
                    <source src={schoolVideoUrl} type="video/mp4" />
                    Votre navigateur ne prend pas en charge la lecture vidéo.
                  </video>
                </div>

                <a href="#contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-secondary-300">
                  Demander la visite virtuelle
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <HandCoins className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                Tarifs et frais scolaires
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Des frais accessibles et un accompagnement clair pour la famille.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-700">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                Accéder à votre espace
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Suivez les absences, les notes et les activités depuis un seul endroit.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-100 text-success-700">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                Une école bienveillante
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Une pédagogie attentive, des enseignants engagés et des valeurs fortes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="programme" className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-[2rem] border border-primary-200/70 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-8 shadow-[0_25px_60px_-25px_rgba(15,42,74,0.2)] lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
                Notre programme
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Un parcours clair pour chaque âge et chaque besoin
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500">
                De la maternelle au collège, les cycles sont organisés pour favoriser l’épanouissement, le progrès et la réussite scolaire.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#preinscription" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
                  Voir nos cycles
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                  Nous contacter
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-700">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy-900">Cycles scolaires</h3>
                  <p className="text-sm text-ink-500">Sélectionnez un niveau pour découvrir son accompagnement.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {cycles.map((cycle) => (
                  <div key={cycle.name} className="rounded-2xl border border-primary-200 bg-primary-50/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-navy-900">{cycle.name}</p>
                        <p className="text-sm text-ink-500">{cycle.age}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-700">
                        {cycle.highlight}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">{cycle.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Tarifications</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Des formules claires pour permettre aux familles de planifier l’année scolaire sereinement.
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Outils et méthodes</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Supports pédagogiques, suivi numérique et évaluation continue pour chaque élève.
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Slogan de fin</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              “Chaque enfant mérite un espace d’apprentissage stimulant, sécurisé et inspirant.”
            </p>
          </div>
        </div>
      </section>

      <section id="temoignages" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 rounded-[2rem] border border-primary-200/70 bg-gradient-to-br from-white via-primary-50/70 to-secondary-50 p-8 shadow-[0_25px_60px_-25px_rgba(15,42,74,0.2)] lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Témoignage</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              « Un écosystème scolaire plus fluide, plus rassurant et plus performant »
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              “Depuis l’adoption de SAIMO, nous avons gagné en visibilité sur les présences, les résultats et la communication avec les familles. Tout est centralisé et plus simple à suivre au quotidien.”
            </p>
            <div className="mt-6 rounded-2xl border border-primary-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-navy-900">Madame Kaba, directrice d’établissement</p>
              <p className="mt-1 text-sm text-ink-500">« Les équipes administratives et pédagogiques travaillent enfin sur la même base de données. »</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-navy-950 p-3 shadow-[0_20px_60px_-20px_rgba(10,31,62,0.45)]">
            <div className="overflow-hidden rounded-[1.1rem] bg-black/20">
              <video
                className="aspect-video w-full rounded-[1.1rem] object-cover"
                controls
                preload="metadata"
                poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            </div>
          </div>
        </div>
      </section>

      <section id="preinscription" className="bg-primary-950 py-24 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Préinscription en ligne</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Préinscrivez votre enfant en quelques minutes
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              Remplissez le formulaire, choisissez le niveau souhaité et notre équipe vous contactera rapidement.
            </p>
            <div className="mt-8 space-y-4">
              {tarifs.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                    <span className="text-sm font-semibold text-secondary-300">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
            {submitted ? (
              <div className="rounded-2xl bg-success-500/15 p-6 text-center">
                <p className="text-xl font-semibold">Préinscription reçue</p>
                <p className="mt-2 text-sm text-white/80">Merci. Notre équipe vous contactera très prochainement pour la suite de la procédure.</p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">Nom du parent</label>
                    <input className="w-full rounded-2xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Nom complet" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-white/70">Téléphone</label>
                    <input className="w-full rounded-2xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="+224" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">Nom de l’enfant</label>
                    <input className="w-full rounded-2xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Prénom" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-white/70">Niveau souhaité</label>
                    <select className="w-full rounded-2xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm outline-none focus:border-primary-400">
                      <option>Maternelle</option>
                      <option>Primaire</option>
                      <option>Collège</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Message</label>
                  <textarea className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Précisez vos besoins ou la classe recherchée." />
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-secondary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary-400">
                  Préinscrire maintenant
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section id="jeux" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Jeux éducatifs</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Des activités ludiques pour apprendre autrement
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Les jeux enrichissent la pédagogie, favorisent la motivation et développent les compétences au quotidien.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {games.map((game) => (
            <div key={game.title} className="rounded-3xl border border-primary-200 bg-primary-50/70 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">{game.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{game.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-paper-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Contact</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Nous sommes à votre écoute
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                Pour toute question, visite, ou demande d’information, contactez-nous directement.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <PhoneCall className="mt-1 h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-semibold text-navy-900">Téléphone</p>
                    <p className="text-sm text-ink-500">+224 620 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <MessagesSquare className="mt-1 h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-semibold text-navy-900">Email</p>
                    <p className="text-sm text-ink-500">contact@saimo.gn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <MapPin className="mt-1 h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-semibold text-navy-900">Adresse</p>
                    <p className="text-sm text-ink-500">Conakry, quartier XXX — près du centre municipal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <CalendarDays className="mt-1 h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-semibold text-navy-900">Horaires</p>
                    <p className="text-sm text-ink-500">Lundi à Vendredi — 7h30 à 17h30</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary-200 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(15,42,74,0.2)]">
              {contactSubmitted ? (
                <div className="rounded-2xl bg-success-500/15 p-6 text-center">
                  <p className="text-xl font-semibold text-navy-900">Message envoyé</p>
                  <p className="mt-2 text-sm text-ink-600">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-ink-600">Nom</label>
                      <input className="w-full rounded-2xl border border-neutral-200 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-ink-600">Email</label>
                      <input className="w-full rounded-2xl border border-neutral-200 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Votre email" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-ink-600">Objet</label>
                    <input className="w-full rounded-2xl border border-neutral-200 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Sujet du message" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-ink-600">Message</label>
                    <textarea className="min-h-[140px] w-full rounded-2xl border border-neutral-200 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-primary-400" placeholder="Écrivez-nous ici..." />
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
                    Envoyer le message
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
