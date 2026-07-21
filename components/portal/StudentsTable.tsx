"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { students } from "@/lib/mock-students";

const classes = ["Toutes les classes", "6ᵉ A", "6ᵉ B", "5ᵉ A", "5ᵉ B", "4ᵉ B", "3ᵉ A"];
const statuts = ["Tous les statuts", "Actif", "Inactif"];

export function StudentsTable() {
  const [query, setQuery] = useState("");
  const [classe, setClasse] = useState(classes[0]);
  const [statut, setStatut] = useState(statuts[0]);
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesQuery =
        query.trim() === "" ||
        fullName.includes(query.toLowerCase()) ||
        s.matricule.toLowerCase().includes(query.toLowerCase());
      const matchesClasse = classe === classes[0] || s.classe === classe;
      const matchesStatut = statut === statuts[0] || s.statut === statut;
      return matchesQuery && matchesClasse && matchesStatut;
    });
  }, [query, classe, statut]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".student-row", {
        opacity: 0,
        y: 8,
        duration: 0.35,
        stagger: 0.04,
        ease: "power2.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, [filtered.length]);

  return (
    <div ref={rootRef} className="rounded-2xl border border-navy-900/5 bg-white">
      <div className="flex flex-col gap-3 border-b border-navy-900/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom ou matricule..."
            className="w-full rounded-full border border-navy-900/8 bg-paper-100 py-2 pl-9 pr-3.5 text-xs text-ink-900 placeholder:text-ink-500/50 outline-none focus:border-teal-400/60"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="appearance-none rounded-full border border-navy-900/8 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-ink-700 outline-none focus:border-teal-400/60"
            >
              {classes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
          </div>

          <div className="relative">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="appearance-none rounded-full border border-navy-900/8 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-ink-700 outline-none focus:border-teal-400/60"
            >
              {statuts.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy-900/5 text-xs uppercase tracking-wide text-ink-500">
              <th className="px-5 py-3 font-medium">Élève</th>
              <th className="px-5 py-3 font-medium">Matricule</th>
              <th className="px-5 py-3 font-medium">Classe</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium">Moyenne</th>
              <th className="px-5 py-3 font-medium">Solde dû</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/5">
            {filtered.map((s) => (
              <tr key={s.id} className="student-row transition-colors hover:bg-paper-100/60">
                <td className="px-5 py-3.5">
                  <Link href={`/portail/eleves/${s.id}`} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy-950 font-display text-xs font-semibold text-teal-300">
                      {s.firstName[0]}
                      {s.lastName[0]}
                    </span>
                    <span className="text-sm font-medium text-navy-900">
                      {s.firstName} {s.lastName}
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-ink-500">
                  {s.matricule}
                </td>
                <td className="px-5 py-3.5 text-sm text-ink-700">{s.classe}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      s.statut === "Actif"
                        ? "bg-teal-500/10 text-teal-600"
                        : "bg-ink-500/10 text-ink-500"
                    }`}
                  >
                    {s.statut}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sm text-navy-900">
                  {s.moyenneGenerale.toFixed(1)}
                </td>
                <td className="px-5 py-3.5 text-sm">
                  {s.soldeDu > 0 ? (
                    <span className="font-medium text-gold-500">
                      {new Intl.NumberFormat("fr-FR").format(s.soldeDu)} GNF
                    </span>
                  ) : (
                    <span className="text-ink-500">À jour</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/portail/eleves/${s.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Voir la fiche
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-500">
                  Aucun élève ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-navy-900/5 px-5 py-4 text-xs text-ink-500">
        <span>
          {filtered.length} élève{filtered.length > 1 ? "s" : ""} sur {students.length}
        </span>
        <span>Page 1 sur 1</span>
      </div>
    </div>
  );
}
