"use client";

import { toast } from "sonner";

import { useMemo, useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Search, ChevronDown, ChevronUp, ArrowRight, MoreHorizontal, Pencil, Trash2, ShieldOff } from "lucide-react";
import type { EleveListDTO } from "@/server/dal/eleves";
import { actionArchiverEleve } from "@/server/actions/eleves";

const STATUTS = ["Tous les statuts", "Actif", "Inactif"] as const;

type SortColumn = "classe" | "statut" | "moyenne" | "solde" | null;
type SortDirection = "asc" | "desc";

export function StudentsTable({
  eleves,
  total,
}: {
  eleves: EleveListDTO[];
  total: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [classe, setClasse] = useState("Toutes les classes");
  const [statut, setStatut] = useState<(typeof STATUTS)[number]>("Tous les statuts");
  const [sortCol, setSortCol] = useState<SortColumn>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const classes = useMemo(
    () => ["Toutes les classes", ...Array.from(new Set(eleves.map((e) => e.classe))).sort()],
    [eleves],
  );

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = eleves.filter((s) => {
      const fullName = `${s.prenom} ${s.nom}`.toLowerCase();
      const matchesQuery =
        query.trim() === "" ||
        fullName.includes(query.toLowerCase()) ||
        s.matricule.toLowerCase().includes(query.toLowerCase());
      const matchesClasse = classe === "Toutes les classes" || s.classe === classe;
      const matchesStatut = statut === "Tous les statuts" || s.statut === statut;
      return matchesQuery && matchesClasse && matchesStatut;
    });

    if (sortCol) {
      result = [...result].sort((a, b) => {
        const pick = (s: EleveListDTO) => {
          if (sortCol === "moyenne") return s.moyenneGenerale ?? -1;
          if (sortCol === "solde") return s.soldeDu;
          return s[sortCol];
        };
        const aVal = pick(a);
        const bVal = pick(b);
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [eleves, query, classe, statut, sortCol, sortDir]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".student-row", { opacity: 0, y: 8, duration: 0.35, stagger: 0.04, ease: "power2.out" });
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

  const archiver = (id: string, nom: string) => {
    setOpenMenuId(null);
    if (!window.confirm(`Archiver ${nom} ? L'élève sera retiré des listes actives.`)) return;
    startTransition(async () => {
      const res = await actionArchiverEleve(id);
      if (!res.succes) toast.error(res.erreur);
      else router.refresh();
    });
  };

  const SortIcon = ({ col }: { col: SortColumn }) => {
    if (sortCol !== col) return <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-blue-600" /> : <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  return (
    <div ref={rootRef} className={`rounded-2xl border border-neutral-200 bg-white ${isPending ? "opacity-70" : ""}`}>
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
            <select value={statut} onChange={(e) => setStatut(e.target.value as (typeof STATUTS)[number])} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer">
              {STATUTS.map((s) => (<option key={s}>{s}</option>))}
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
                      {s.prenom[0]}{s.nom[0]}
                    </span>
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{s.prenom} {s.nom}</span>
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
                    {s.moyenneGenerale != null ? (
                      <>
                        {s.moyenneGenerale.toFixed(1).replace(".", ",")}
                        <span className="text-xs font-medium text-neutral-500"> / 20</span>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-neutral-400">Non noté</span>
                    )}
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
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); toast.info("Blocage de l'espace élève — à venir."); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <ShieldOff className="h-4 w-4" />
                          Bloquer son espace
                        </button>
                        <div className="my-1 border-t border-neutral-100" />
                        <button
                          onClick={(e) => { e.stopPropagation(); archiver(s.id, `${s.prenom} ${s.nom}`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          Archiver l&rsquo;élève
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
        <span className="font-medium">{filteredAndSorted.length} élève{filteredAndSorted.length > 1 ? "s" : ""} affiché{filteredAndSorted.length > 1 ? "s" : ""} sur {total}</span>
        <span className="font-medium">Page 1 sur 1</span>
      </div>
    </div>
  );
}
