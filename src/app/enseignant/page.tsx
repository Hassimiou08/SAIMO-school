import type { Metadata } from "next";
import Link from "next/link";
import {
  Users2,
  BookMarked,
  ClipboardCheck,
  CalendarX2,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { getTableauBordEnseignant } from "@/server/dal/enseignant";

export const metadata: Metadata = { title: "Tableau de bord — Enseignant SAIMO" };

export default async function EnseignantDashboard() {
  const d = await getTableauBordEnseignant();

  const kpis = [
    { label: "Mes classes", value: d.nbClasses, icon: Users2, href: "/enseignant/emploi-du-temps" },
    { label: "Mes matières", value: d.nbMatieres, icon: BookMarked, href: "/enseignant/notes" },
    { label: "Élèves", value: d.nbEleves, icon: Users2, href: "/enseignant/absences" },
    {
      label: "Évaluations ouvertes",
      value: d.evalsOuvertes,
      icon: ClipboardCheck,
      href: "/enseignant/notes",
    },
  ];

  return (
    <EnseignantShell
      large
      titre={`Bonjour, ${d.nom}`}
      sous={`${d.jourLabel} — voici votre journée.`}
    >
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <k.icon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-neutral-500">{k.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">{k.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cours du jour */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <h2 className="flex items-center gap-2 font-bold text-navy-900">
              <Clock className="h-4 w-4 text-blue-600" /> Cours du jour
            </h2>
            <Link
              href="/enseignant/emploi-du-temps"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Semaine complète
            </Link>
          </div>
          {d.coursDuJour.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-500">
              Aucun cours programmé aujourd&rsquo;hui.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-50">
              {d.coursDuJour.map((c) => (
                <li key={c.id} className="flex items-center gap-4 px-6 py-3.5">
                  <span className="font-mono text-xs font-semibold text-neutral-500">
                    {c.heureDebut}–{c.heureFin}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-neutral-800">
                      {c.matiere}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {c.classe}
                      {c.salle ? ` · Salle ${c.salle}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          <Link
            href="/enseignant/absences"
            className="block rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
              <CalendarX2 className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xs font-medium text-neutral-500">Absences non justifiées</p>
            <p className="mt-1 text-lg font-bold text-navy-900">
              {d.absencesNonJustifiees}
            </p>
          </Link>

          <Link
            href="/enseignant/notes"
            className="flex items-center justify-between rounded-2xl bg-blue-600 p-5 text-white transition hover:bg-blue-700"
          >
            <span className="text-sm font-bold">Saisir des notes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {d.estProfPrincipal && (
            <Link
              href="/enseignant/bulletins"
              className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-navy-900">
                <Star className="h-4 w-4 text-orange-500" /> Bulletins (prof. principal)
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </Link>
          )}
        </div>
      </div>

      {/* Mes classes */}
      <div className="mt-8">
        <h2 className="mb-4 font-bold text-navy-900">Mes classes & matières</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {d.classes.map((c, i) => (
            <div
              key={`${c.classeId}-${c.matiere}-${i}`}
              className="rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-neutral-800">{c.classe}</p>
                {c.estProfPrincipal && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                    <Star className="h-3 w-3" /> P.P.
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">{c.matiere}</p>
            </div>
          ))}
          {d.classes.length === 0 && (
            <p className="text-sm text-neutral-500">
              Aucune affectation. Contactez l&rsquo;administration.
            </p>
          )}
        </div>
      </div>
    </EnseignantShell>
  );
}
