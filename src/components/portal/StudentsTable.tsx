"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Search, ChevronDown, ChevronUp, ArrowRight, MoreHorizontal, Pencil, Trash2, ShieldOff } from "lucide-react";
import { students } from "@/lib/mock-students";

const classes = ["Toutes les classes", "6ᵉ A", "6ᵉ B", "5ᵉ A", "5ᵉ B", "4ᵉ B", "3ᵉ A"];
const statuts = ["Tous les statuts", "Actif", "Inactif"];

type SortColumn = "classe" | "statut" | "moyenne" | "solde" | null;
type SortDirection = "asc" | "desc";

export function StudentsTable() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [classe, setClasse] = useState(classes[0]);
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
    let result = students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesQuery =
        query.trim() === "" ||
        fullName.includes(query.toLowerCase()) ||
        s.matricule.toLowerCase().includes(query.toLowerCase());
      const matchesClasse = classe === classes[0] || s.classe === classe;
      const matchesStatut = statut === statuts[0] || s.statut === statut;
      return matchesQuery && matchesClasse && matchesStatut;
    });

    if (sortCol) {
      result = [...result].sort((a, b) => {
        const aVal: any = a[sortCol === "moyenne" ? "moyenneGenerale" : sortCol === "solde" ? "soldeDu" : sortCol];
        const bVal: any = b[sortCol === "moyenne" ? "moyenneGenerale" : sortCol === "solde" ? "soldeDu" : sortCol];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [query, classe, statut, sortCol, sortDir]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".student-row", { opacity: 0, y: 8, duration: 0.35, stagger: 0.04, ease: "power2.out" });
    }, rootRef);
    return () => ctx.revert();
  }, [filteredAndSorted.length, sortCol, sortDir]);

  // Fermer le menu quand on clique en dehors
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
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom ou matricule..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select value={classe} onChange={(e) => setClasse(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer">
              {classes.map((c) => (<option key={c}>{c}</option>))}
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
              <th className="px-5 py-3.5 font-semibold">Élève</th>
              <th className="px-5 py-3.5 font-semibold">Matricule</th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("classe")}>
                <div className="flex items-center gap-1">Classe <SortIcon col="classe" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("statut")}>
                <div className="flex items-center gap-1">Statut <SortIcon col="statut" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("moyenne")}>
                <div className="flex items-center gap-1">Moyenne <SortIcon col="moyenne" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold cursor-pointer group hover:text-neutral-700 transition" onClick={() => handleSort("solde")}>
                <div className="flex items-center gap-1">Solde dû <SortIcon col="solde" /></div>
              </th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filteredAndSorted.map((s) => (
              <tr
                key={s.id}
                onClick={() => router.push(`/portail/eleves/${s.id}`)}
                className="student-row group transition-colors hover:bg-blue-50/80 cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 font-display text-xs font-bold text-white shadow-sm">
                      {s.firstName[0]}{s.lastName[0]}
                    </span>
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{s.firstName} {s.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{s.matricule}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-lg bg-white border border-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 group-hover:border-blue-200 group-hover:text-blue-600 transition">{s.classe}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.statut === "Actif" ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-500"}`}>{s.statut}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md">
                    {(s.moyenneGenerale / 5).toFixed(1).replace(".", ",")}
                    <span className="text-xs font-medium text-neutral-500"> / 20</span>
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm">
                  {s.soldeDu > 0 ? (
                    <span className="font-semibold text-orange-500">{new Intl.NumberFormat("fr-FR").format(s.soldeDu)} <span className="text-[10px] text-orange-400">GNF</span></span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-600">À jour</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="relative flex items-center justify-end gap-2" ref={openMenuId === s.id ? menuRef : undefined}>
                    <button
                      className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === s.id ? null : s.id); }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === s.id && (
                      <div className="absolute right-0 top-10 z-50 w-56 rounded-xl bg-white border border-neutral-200 shadow-xl py-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); router.push(`/portail/eleves/${s.id}/modifier`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Pencil className="h-4 w-4" />
                          Modifier les infos
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); alert(`L'espace de ${s.firstName} ${s.lastName} a été bloqué.`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <ShieldOff className="h-4 w-4" />
                          Bloquer son espace
                        </button>
                        <div className="my-1 border-t border-neutral-100" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); alert(`${s.firstName} ${s.lastName} a été déplacé vers le Backup. Vous pouvez le restaurer depuis les archives.`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer (Backup)
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
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">Aucun élève ne correspond à ces critères.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4 text-xs text-neutral-500">
        <span className="font-medium">{filteredAndSorted.length} élève{filteredAndSorted.length > 1 ? "s" : ""} sur {students.length}</span>
        <span className="font-medium">Page 1 sur 1</span>
      </div>
    </div>
  );
}
