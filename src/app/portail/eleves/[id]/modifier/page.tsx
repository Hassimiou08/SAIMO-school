"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, UserPlus } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { getStudent } from "@/lib/mock-students";

const CLASSES_BY_CYCLE: Record<string, string[]> = {
  "Maternelle": ["Petite Section", "Moyenne Section", "Grande Section"],
  "Primaire": ["CP", "CE1", "CE2", "CM1", "CM2"],
  "Collège": ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B"],
  "Lycée": ["2nde", "1ère", "Terminale"],
};

export default function ModifierElevePage() {
  const params = useParams();
  const router = useRouter();
  const student = getStudent(params.id as string);

  const [cycle, setCycle] = useState("Collège");

  if (!student) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <p className="text-neutral-500">Élève introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8">
            <Link href={`/portail/eleves/${student.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour à la fiche de {student.firstName}
            </Link>

            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Modifier — {student.firstName} {student.lastName}
            </h1>
            <p className="mt-2 text-sm text-ink-500">Matricule : <span className="font-mono font-bold">{student.matricule}</span></p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

              {/* Photo */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">Photo</h2>
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-display text-2xl font-bold shadow-lg">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition">
                    <UploadCloud className="h-4 w-4 text-blue-500" />
                    Changer la photo
                    <input type="file" accept="image/png, image/jpeg" className="hidden" />
                  </label>
                </div>
              </section>

              {/* Infos Élève */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">1. Informations de l'élève</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Nom de famille</label>
                    <input type="text" defaultValue={student.lastName} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Prénoms</label>
                    <input type="text" defaultValue={student.firstName} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Date de naissance</label>
                    <input type="text" defaultValue={student.dateNaissance} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Genre</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="genre" defaultChecked={student.genre === "M"} className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-neutral-700">Masculin</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="genre" defaultChecked={student.genre === "F"} className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-neutral-700">Féminin</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Scolarité */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">2. Scolarité</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Cycle</label>
                    <select value={cycle} onChange={(e) => setCycle(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                      {Object.keys(CLASSES_BY_CYCLE).map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Classe</label>
                    <select defaultValue={student.classe} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                      {CLASSES_BY_CYCLE[cycle]?.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Statut</label>
                    <select defaultValue={student.statut} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Tuteur */}
              <section>
                <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">3. Responsable légal / Tuteur</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Nom du tuteur</label>
                    <input type="text" defaultValue={student.parent} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Téléphone</label>
                    <input type="tel" defaultValue={student.parentTelephone} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-neutral-700">Adresse</label>
                    <input type="text" defaultValue={student.adresse} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 border-t border-neutral-100 pt-6 mt-8">
                <Link href={`/portail/eleves/${student.id}`} className="px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition">Annuler</Link>
                <button
                  type="button"
                  onClick={() => { alert("Modifications enregistrées avec succès !"); router.push(`/portail/eleves/${student.id}`); }}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
