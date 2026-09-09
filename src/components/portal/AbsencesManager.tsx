"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import type { AbsenceDTO, StatsAbsences } from "@/server/dal/absences";
import type { ClasseOption, EleveClasseOption } from "@/server/dal/pedagogie";
import { actionEnregistrerAbsence, actionJustifierAbsence } from "@/server/actions/absences";
import { Modale, Selecteur, Champ, Err, ModalActions } from "@/components/portal/_ui";

export function AbsencesManager({
  absences,
  stats,
  classes,
  eleves,
  peutJustifier = true,
}: {
  absences: AbsenceDTO[];
  stats: StatsAbsences;
  classes: ClasseOption[];
  eleves: EleveClasseOption[];
  peutJustifier?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [classeModal, setClasseModal] = useState("");

  const filtered = useMemo(
    () => absences.filter((a) => a.eleve.toLowerCase().includes(query.toLowerCase()) || a.classe.toLowerCase().includes(query.toLowerCase())),
    [absences, query],
  );
  const elevesClasse = eleves.filter((e) => e.classeId === classeModal);

  const enregistrer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionEnregistrerAbsence(fd);
      if (!r.succes) { setErreur(r.erreur); toast.error(r.erreur); }
      else { setModal(false); toast.success("Absence enregistrée."); router.refresh(); }
    });
  };
  const justifier = (id: string) => {
    const motif = prompt("Motif de la justification :") ?? "";
    if (!motif) return;
    startTransition(async () => {
      const r = await actionJustifierAbsence(id, motif);
      if (!r.succes) toast.error(r.erreur);
      else { toast.success("Absence justifiée."); router.refresh(); }
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: stats.total, cls: "text-neutral-900" },
          { label: "Justifiées", value: stats.justifiees, cls: "text-green-600" },
          { label: "Non justifiées", value: stats.nonJustifiees, cls: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className={`font-display text-2xl font-black ${s.cls}`}>{s.value}</p>
            <p className="mt-0.5 text-sm text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Élève ou classe..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 transition" />
          </div>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition">
            <Plus className="h-4 w-4" /> Signaler une absence
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
              <th className="px-5 py-3">Élève</th><th className="px-5 py-3">Classe</th>
              <th className="px-5 py-3">Date</th><th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Motif</th><th className="px-5 py-3 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-neutral-50/60">
                <td className="px-5 py-3 font-medium text-neutral-800">{a.eleve}</td>
                <td className="px-5 py-3 text-neutral-600">{a.classe}</td>
                <td className="px-5 py-3 text-neutral-500">{a.date}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${a.statut === "Retard" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{a.statut}</span>
                </td>
                <td className="px-5 py-3 text-neutral-500">{a.motif || "—"}</td>
                <td className="px-5 py-3 text-right">
                  {a.justifie ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Justifiée</span>
                  ) : peutJustifier ? (
                    <button onClick={() => justifier(a.id)} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-800">
                      <AlertCircle className="h-3.5 w-3.5" /> Justifier
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-400">Non justifiée</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">Aucune absence enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modale titre="Signaler une absence" onClose={() => setModal(false)}>
          <form action={enregistrer} className="space-y-4">
            <Selecteur name="classeId" label="Classe" required value={classeModal} onChange={(e) => setClasseModal(e.target.value)}>
              <option value="" disabled>Choisir…</option>
              {classes.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
            </Selecteur>
            <Selecteur name="eleveId" label="Élève" required defaultValue="" disabled={!classeModal}>
              <option value="" disabled>{classeModal ? "Choisir…" : "Sélectionnez d'abord une classe"}</option>
              {elevesClasse.map((e) => (<option key={e.id} value={e.id}>{e.nom}</option>))}
            </Selecteur>
            <div className="grid grid-cols-2 gap-3">
              <Champ name="date" label="Date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
              <Selecteur name="statut" label="Type" required defaultValue="absent">
                <option value="absent">Absence</option>
                <option value="retard">Retard</option>
              </Selecteur>
            </div>
            <Champ name="motif" label="Motif (optionnel)" placeholder="Ex : maladie" />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Enregistrer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
