"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Search, ChevronDown, ChevronUp, ArrowRight, MoreHorizontal, Pencil, Trash2, ShieldOff } from "lucide-react";
import { enseignants } from "@/lib/mock-enseignants";

const matieres = ["Toutes les matières", "Mathématiques", "Français", "Sciences", "Histoire-Géographie", "Anglais", "Éducation Physique"];
const statuts = ["Tous les statuts", "Actif", "Inactif"];

type SortColumn = "matiere" | "statut" | "heures" | "presence" | null;
type SortDirection = "asc" | "desc";

export function EnseignantsTable() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [matiere, setMatiere] = useState(matieres[0]);
  const [statut, setStatut] = useState(statuts[0]);
  const [sortCol, setSortCol] = useState<SortColumn>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = enseignants.filter((e) => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchesQuery =
        query.trim() === "" ||
        fullName.includes(query.toLowerCase()) ||
        e.matricule.toLowerCase().includes(query.toLowerCase());
      const matchesMatiere = matiere === matieres[0] || e.matiere === matiere;
      const matchesStatut = statut === statuts[0] || e.statut === statut;
      return matchesQuery && matchesMatiere && matchesStatut;
    });

    if (sortCol) {
      result = [...result].sort((a, b) => {
        const key = sortCol === "heures" ? "heuresHebdo" : sortCol === "presence" ? "tauxPresence" : sortCol;
        const aVal: any = a[key];
        const bVal: any = b[key];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [query, matiere, statut, sortCol, sortDir]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".teacher-row", {
        opacity: 0,
        y: 8,
        duration: 0.35,
        stagger: 0.04,
        ease: "power2.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, [filteredAndSorted.length, sortCol, sortDir]);

  // Fermeture du menu quand on clique en dehors (ref-based)
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId, handleClickOutside]);

  const SortIcon = ({ col }: { col: SortColumn }) => {
    if (sortCol !== col) return <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-blue-600" /> : <ChevronDown className="h-3 w-3 text-blue-600" />;
  };



  return (
    <>
      <div ref={rootRef} className="rounded-2xl border border-neutral-200 bg-white">
        {/* Barre de filtres */}
        <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom ou matricule..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <select
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
                className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
              >
                {matieres.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            </div>
            <div className="relative">
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
              >
                {statuts.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-5 py-3.5 font-semibold">Enseignant</th>
                <th className="px-5 py-3.5 font-semibold">Matricule</th>
                <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("matiere")}>
                  <div className="flex items-center gap-1">Matière <SortIcon col="matiere" /></div>
                </th>
                <th className="px-5 py-3.5 font-semibold">Classes</th>
                <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("statut")}>
                  <div className="flex items-center gap-1">Statut <SortIcon col="statut" /></div>
                </th>
                <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("heures")}>
                  <div className="flex items-center gap-1">H/Sem <SortIcon col="heures" /></div>
                </th>
                <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("presence")}>
                  <div className="flex items-center gap-1">Présence <SortIcon col="presence" /></div>
                </th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-200">
              {filteredAndSorted.map((e) => (
                <tr key={e.id} onClick={() => router.push(`/portail/enseignants/${e.id}`)} className="teacher-row group transition-colors hover:bg-blue-50/80 cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 font-display text-xs font-bold text-white shadow-sm">
                        {e.firstName[0]}{e.lastName[0]}
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{e.firstName} {e.lastName}</span>
                        <p className="text-[11px] text-neutral-400">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{e.matricule}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-600">{e.matiere}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {e.classes.map((c) => (
                        <span key={c} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${e.statut === "Actif" ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-500"}`}>
                      {e.statut}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="font-mono text-sm font-bold text-neutral-900">{e.heuresHebdo}<span className="text-xs font-medium text-neutral-400">h</span></span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${e.tauxPresence >= 95 ? "bg-green-500" : e.tauxPresence >= 85 ? "bg-orange-400" : "bg-red-500"}`}
                          style={{ width: `${e.tauxPresence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{e.tauxPresence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative flex items-center justify-end gap-2" ref={openMenuId === e.id ? menuRef : undefined}>
                      <button
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        onClick={(ev) => { ev.stopPropagation(); setOpenMenuId(openMenuId === e.id ? null : e.id); }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {openMenuId === e.id && (
                        <div className="absolute right-0 top-10 z-50 w-56 rounded-xl bg-white border border-neutral-200 shadow-xl py-2">
                          <button
                            onClick={(ev) => { ev.stopPropagation(); setOpenMenuId(null); router.push(`/portail/enseignants/${e.id}`); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            <Pencil className="h-4 w-4" />
                            Modifier les infos
                          </button>
                          <button
                            onClick={(ev) => { ev.stopPropagation(); setOpenMenuId(null); alert(`L'espace de ${e.firstName} ${e.lastName} a été bloqué.`); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition"
                          >
                            <ShieldOff className="h-4 w-4" />
                            Bloquer son espace
                          </button>
                          <div className="my-1 border-t border-neutral-100" />
                          <button
                            onClick={(ev) => { ev.stopPropagation(); setOpenMenuId(null); alert(`${e.firstName} ${e.lastName} a été déplacé vers le Backup.`); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer (Backup)
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-neutral-500">
                    Aucun enseignant ne correspond à ces critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4 text-xs text-neutral-500">
          <span className="font-medium">{filteredAndSorted.length} enseignant{filteredAndSorted.length > 1 ? "s" : ""} sur {enseignants.length}</span>
          <span className="font-medium">Page 1 sur 1</span>
        </div>
      </div>


    </>
  );
}
