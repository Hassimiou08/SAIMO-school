"use client";

import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Mail, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function SchoolPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const schoolImages = [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  ];

  const schoolInfo = {
    name: "SAIMO",
    slogan: "L'éducation qui inspire chaque enfant",
    description:
      "SAIMO est un établissement moderne qui allie pédagogie active, innovation technologique et accompagnement personnel de chaque élève. Fondée sur les principes de bienveillance et d'excellence, notre école accueille les enfants de la maternelle au collège.",
    cycles: [
      {
        name: "Maternelle",
        age: "3 à 5 ans",
        description: "Un apprentissage par le jeu, la découverte du monde et l'épanouissement de l'enfant.",
      },
      {
        name: "Primaire",
        age: "6 à 11 ans",
        description: "Des bases solides en français, maths et sciences avec des projets concrets.",
      },
      {
        name: "Collège",
        age: "12 à 16 ans",
        description: "Un accompagnement académique sérieux, orienté succès et réussite scolaire.",
      },
    ],
    highlights: [
      { label: "Classes lumineuses", desc: "Équipées de technologie éducative moderne" },
      { label: "Équipe pédagogique", desc: "Enseignants expérimentés et bienveillants" },
      { label: "Suivi personnalisé", desc: "Accompagnement adapté à chaque enfant" },
      { label: "Activités parascolaires", desc: "Sports, arts, sciences et bien plus" },
    ],
    services: [
      { title: "Transport scolaire", desc: "Navettes organisées selon le secteur" },
      { title: "Cantine", desc: "Repas équilibrés et options adaptées" },
      { title: "Garderie", desc: "Avant et après l&apos;école jusqu&apos;à 18h" },
      { title: "Espace parent", desc: "Suivi des notes, absences et activités" },
    ],
    pricing: [
      { title: "Frais de scolarité", value: "150 000 GNF", desc: "Par an, accès à l&apos;espace parent inclus" },
      { title: "Frais de cantine", value: "45 000 GNF", desc: "Mensuel, selon les options" },
      { title: "Frais de transport", value: "30 000 GNF", desc: "Mensuel, selon le secteur" },
    ],
    contact: {
      email: "contact@saimo.gn",
      phone: "+224 XXX XXX XXX",
      address: "Conakry, quartier Ratoma — près du centre municipal",
      city: "Conakry, Guinée",
    },
  };

  const nextImage = () => {
    setActiveImageIndex((value) => (value + 1) % schoolImages.length);
  };

  const previousImage = () => {
    setActiveImageIndex((value) => (value - 1 + schoolImages.length) % schoolImages.length);
  };

  return (
    <>
      <Navbar />
      <main className="bg-paper-50">
        {/* Hero Section */}
        <section className="overflow-hidden border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-navy-900">{schoolInfo.name}</h1>
            <p className="mt-4 font-display text-2xl font-semibold text-secondary-600">{schoolInfo.slogan}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600">{schoolInfo.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/#preinscription"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Préinscrire mon enfant
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                Nous contacter
              </a>
            </div>

            {/* Image Carousel */}
            <div className="mt-8">
              <div className="overflow-hidden rounded-[2rem] border-4 border-neutral-200 shadow-lg">
                <img
                  src={schoolImages[activeImageIndex]}
                  alt="Vue de l'établissement SAIMO"
                  className="h-96 w-full object-cover"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={previousImage}
                  className="rounded-full border border-neutral-300 bg-white p-2 text-navy-900 transition hover:bg-neutral-100"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {schoolImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-3 w-3 rounded-full transition ${
                        activeImageIndex === index ? "bg-primary-600" : "bg-neutral-300"
                      }`}
                      aria-label={`Voir l'image ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextImage}
                  className="rounded-full border border-neutral-300 bg-white p-2 text-navy-900 transition hover:bg-neutral-100"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cycles Section */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Notre programme</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy-900">
                Des cycles pensés pour chaque âge
              </h2>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {schoolInfo.cycles.map((cycle) => (
                <div
                  key={cycle.name}
                  className="rounded-[2rem] border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-8 shadow-lg transition hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-semibold text-navy-900">{cycle.name}</h3>
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                      {cycle.age}
                    </span>
                  </div>
                  <p className="mt-4 leading-relaxed text-ink-600">{cycle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="border-y border-neutral-200 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Nos atouts</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy-900">
              Une école qui se distingue
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {schoolInfo.highlights.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-neutral-200 bg-paper-50 p-6">
                  <h3 className="font-display text-lg font-semibold text-navy-900">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Services offerts</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy-900">
              Pour accompagner votre famille
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {schoolInfo.services.map((service) => (
                <div key={service.title} className="rounded-[1.5rem] border-2 border-secondary-200 bg-secondary-50 p-6">
                  <h3 className="font-display text-lg font-semibold text-navy-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="border-y border-neutral-200 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Tarification</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy-900">
              Frais scolaires et services
            </h2>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {schoolInfo.pricing.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border-2 border-primary-300 bg-gradient-to-br from-primary-50 to-white p-8"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">{item.title}</p>
                  <p className="mt-4 font-display text-4xl font-bold text-navy-900">{item.value}</p>
                  <p className="mt-3 text-sm text-ink-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Location Section */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Localisation</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy-900 mb-12">
              Nous trouver et nous contacter
            </h2>

            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-500">E-mail</p>
                      <a href={`mailto:${schoolInfo.contact.email}`} className="font-semibold text-navy-900 hover:text-primary-600">
                        {schoolInfo.contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-200 bg-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-700">
                      <PhoneCall className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-500">Téléphone</p>
                      <a href={`tel:${schoolInfo.contact.phone.replace(/\s/g, "")}`} className="font-semibold text-navy-900 hover:text-primary-600">
                        {schoolInfo.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-200 bg-white p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-100 text-success-700 flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-500">Adresse</p>
                      <p className="mt-2 font-semibold text-navy-900">{schoolInfo.contact.address}</p>
                      <p className="text-sm text-ink-600">{schoolInfo.contact.city}</p>
                    </div>
                  </div>
                </div>

                <a
                  href="/#preinscription"
                  className="mt-8 block rounded-full bg-primary-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-primary-700"
                >
                  Préinscrire mon enfant
                </a>
              </div>

              {/* Google Maps */}
              <div className="overflow-hidden rounded-[2rem] border-4 border-neutral-200 shadow-lg">
                <iframe
                  title="Localisation de l'école SAIMO"
                  src="https://www.google.com/maps?q=Conakry,%20Guin%C3%A9e%20Ratoma%20SAIMO&output=embed"
                  className="h-full w-full min-h-96"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
