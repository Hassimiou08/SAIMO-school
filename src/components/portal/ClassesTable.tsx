"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Search, ChevronDown, ChevronUp, ArrowRight, MoreHorizontal, Pencil, Trash2, Users, Plus, X } from "lucide-react";
import { classes as mockClasses } from "@/lib/mock-classes";

const cycles = ["Tous les cycles", "Primaire", "Collège", "Lycée"];
const statuts = ["Tous les statuts", "Actif", "Inactif"];

type SortColumn = "nom" | "cycle" | "effectif" | "profPrincipal" | "statut" | null;
type SortDirection = "asc" | "desc";

export function ClassesTable() {
  const router = useRouter();
  const [data, setData] = useState(mockClasses);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClasse, setNewClasse] = useState({ nom: "", cycle: "Collège", effectifMax: 30, prof: "" });
  const [cycle, setCycle] = useState(cycles[0]);
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
    let result = data.filter((c) => {
      const matchesQuery =
        query.trim() === "" ||
        c.nom.toLowerCase().includes(query.toLowerCase()) ||
        c.profPrincipal.toLowerCase().includes(query.toLowerCase());
      const matchesCycle = cycle === cycles[0] || c.cycle === cycle;
      const matchesStatut = statut === statuts[0] || c.statut === statut;
      return matchesQuery && matchesCycle && matchesStatut;
    });

    if (sortCol) {
      result = [...result].sort((a, b) => {
        const aVal: any = a[sortCol];
        const bVal: any = b[sortCol];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [query, cycle, statut, sortCol, sortDir]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".class-row", { opacity: 0, y: 8, duration: 0.35, stagger: 0.04, ease: "power2.out" });
    }, rootRef);
    return () => ctx.revert();
  }, [filteredAndSorted.length, sortCol, sortDir]);

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
    <div ref={rootRef} className="rounded-2xl border border-neutral-200 bg-white">
      {/* Barre de filtres */}
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom de classe, professeur..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-blue-600 transition">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
          <div className="relative">
            <select value={cycle} onChange={(e) => setCycle(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer">
              {cycles.map((c) => (<option key={c}>{c}</option>))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          </div>
          <div className="relative">
            <select value={statut} onChange={(e) => setStatut(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer">
              {statuts.map((s) => (<option key={s}>{s}</option>))}
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
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("nom")}>
                <div className="flex items-center gap-1">Classe <SortIcon col="nom" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("cycle")}>
                <div className="flex items-center gap-1">Cycle <SortIcon col="cycle" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("effectif")}>
                <div className="flex items-center gap-1">Effectif <SortIcon col="effectif" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("profPrincipal")}>
                <div className="flex items-center gap-1">Professeur Principal <SortIcon col="profPrincipal" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold">Salle</th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("statut")}>
                <div className="flex items-center gap-1">Statut <SortIcon col="statut" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filteredAndSorted.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/portail/classes/${c.id}`)}
                className="class-row group transition-colors hover:bg-blue-50/80 cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 font-display text-xs font-bold text-blue-700 shadow-sm">
                      {c.nom.substring(0, 2)}
                    </span>
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{c.nom}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-lg bg-white border border-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 transition">{c.cycle}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <span className="font-mono text-sm font-semibold text-neutral-800">{c.effectif}</span>
                    <span className="text-xs text-neutral-400">/ {c.capacite}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-neutral-700">{c.profPrincipal}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-neutral-500">{c.salle}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.statut === "Actif" ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-500"}`}>{c.statut}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="relative flex items-center justify-end gap-2" ref={openMenuId === c.id ? menuRef : undefined}>
                    <button
                      className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === c.id ? null : c.id); }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === c.id && (
                      <div className="absolute right-0 top-10 z-50 w-56 rounded-xl bg-white border border-neutral-200 shadow-xl py-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); router.push(`/portail/classes/${c.id}/modifier`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Pencil className="h-4 w-4" />
                          Modifier la classe
                        </button>
                        <div className="my-1 border-t border-neutral-100" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); alert(`Classe ${c.nom} supprimée.`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    )}

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">Aucune classe ne correspond à ces critères.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4 text-xs text-neutral-500">
        <span className="font-medium">{filteredAndSorted.length} classe{filteredAndSorted.length > 1 ? "s" : ""} sur {data.length}</span>
        <span className="font-medium">Page 1 sur 1</span>
      </div>

      {/* MODALE D'AJOUT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Ajouter une classe</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nom de la classe</label>
                <input type="text" value={newClasse.nom} onChange={e => setNewClasse({...newClasse, nom: e.target.value})} placeholder="Ex: 6ème C" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Cycle</label>
                  <select value={newClasse.cycle} onChange={e => setNewClasse({...newClasse, cycle: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none">
                    <option>Primaire</option>
                    <option>Collège</option>
                    <option>Lycée</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Capacité (Max)</label>
                  <input type="number" value={newClasse.effectifMax} onChange={e => setNewClasse({...newClasse, effectifMax: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Professeur Principal</label>
                <input type="text" value={newClasse.prof} onChange={e => setNewClasse({...newClasse, prof: e.target.value})} placeholder="Ex: M. Diallo" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([{
                      id: Date.now().toString(),
                      nom: newClasse.nom,
                      cycle: newClasse.cycle,
                      effectif: 0,
                      capacite: newClasse.effectifMax,
                      profPrincipal: newClasse.prof || "Non assigné",
                      salle: "À définir",
                      statut: "Incomplet"
                    }, ...data]);
                    setIsModalOpen(false);
                    setNewClasse({ nom: "", cycle: "Collège", effectifMax: 30, prof: "" });
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
