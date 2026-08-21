"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Save, UploadCloud } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

const MATIERES = ["Mathématiques", "Français", "Sciences", "Histoire-Géographie", "Anglais", "Éducation Physique", "Arabe", "Informatique"];

const CLASSES = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B"];

export default function NouvelEnseignantPage() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const toggleClass = (c: string) => {
    setSelectedClasses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8">
            <Link 
              href="/portail/enseignants" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste des enseignants
            </Link>
            
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-500/20">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              Nouvel Enseignant
            </h1>
            <p className="mt-2 text-sm text-ink-500 max-w-xl">
              Remplissez ce formulaire pour ajouter un enseignant au corps professoral.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

              {/* Photo */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                  Photo (Facultatif)
                </h2>
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
                    <GraduationCap className="h-8 w-8 opacity-50" />
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition">
                    <UploadCloud className="h-4 w-4 text-blue-500" />
                    Choisir une photo
                    <input type="file" accept="image/png, image/jpeg" className="hidden" />
                  </label>
                  <span className="text-xs text-neutral-400 max-w-[200px]">Format JPG, PNG. Taille maximale : 2 Mo.</span>
                </div>
              </section>

              {/* Infos personnelles */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                  1. Informations personnelles
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Nom de famille</label>
                    <input type="text" placeholder="Ex: Diallo" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Prénoms</label>
                    <input type="text" placeholder="Ex: Ibrahima" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Téléphone</label>
                    <input type="tel" placeholder="+224 XX XX XX XX" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Email</label>
                    <input type="email" placeholder="enseignant@saimo.gn" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Genre</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="genre" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <span className="text-sm text-neutral-700">Masculin</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="genre" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <span className="text-sm text-neutral-700">Féminin</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Affectation */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                  2. Affectation pédagogique
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Matière enseignée</label>
                    <select className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                      <option value="">Sélectionnez une matière...</option>
                      {MATIERES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Heures / Semaine</label>
                    <input type="number" placeholder="18" min={1} max={40} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Matricule (généré auto)</label>
                    <input type="text" disabled value="ENS-2025-007" className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-500 font-mono font-bold cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Date d'embauche</label>
                    <input type="date" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                </div>

                {/* Sélection des classes */}
                <div className="mt-6 space-y-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Classes assignées 
                    <span className="ml-2 text-xs text-neutral-400">({selectedClasses.length} sélectionnée{selectedClasses.length > 1 ? "s" : ""})</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleClass(c)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold border-2 transition ${
                          selectedClasses.includes(c) 
                            ? "border-blue-500 bg-blue-50 text-blue-600" 
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 border-t border-neutral-100 pt-6 mt-8">
                <Link 
                  href="/portail/enseignants"
                  className="px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition"
                >
                  Annuler
                </Link>
                <button 
                  type="button"
                  onClick={() => alert("Enseignant enregistré avec succès ! (Simulation)")}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer l'enseignant
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
