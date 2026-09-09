"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Layers, Pencil } from "lucide-react";
import type { CycleDTO, NiveauDTO } from "@/server/dal/pedagogie";
import {
  actionCreerCycle,
  actionModifierCycle,
  actionCreerNiveau,
  actionModifierNiveau,
} from "@/server/actions/pedagogie";
import { Modale, Champ, Err, ModalActions } from "@/components/portal/_ui";

type CycleModal = null | "new" | CycleDTO;
type NiveauModal = null | { cycleId: string } | (NiveauDTO & { cycleId: string });

export function CyclesManager({ cycles }: { cycles: CycleDTO[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cycleModal, setCycleModal] = useState<CycleModal>(null);
  const [niveauModal, setNiveauModal] = useState<NiveauModal>(null);
  const [erreur, setErreur] = useState("");

  const cycleEdit = cycleModal && cycleModal !== "new" ? cycleModal : null;
  const niveauEdit = niveauModal && "id" in niveauModal ? niveauModal : null;

  const run = (fn: () => Promise<{ succes: boolean; erreur?: string }>, close: () => void) => {
    setErreur("");
    startTransition(async () => {
      const r = await fn();
      if (!r.succes) setErreur(r.erreur ?? "Erreur");
      else { close(); router.refresh(); }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => { setErreur(""); setCycleModal("new"); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Ajouter un cycle
        </button>
      </div>

      {cycles.length === 0 && (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">
          Aucun cycle. Créez « Primaire », « Collège »… puis leurs niveaux.
        </p>
      )}

      {cycles.map((c) => (
        <div key={c.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
              <Layers className="h-4 w-4 text-blue-500" /> {c.nom}
              <span className="text-xs font-normal text-neutral-400">ordre {c.ordre}</span>
              <button onClick={() => { setErreur(""); setCycleModal(c); }} className="text-neutral-300 hover:text-blue-600 transition"><Pencil className="h-3.5 w-3.5" /></button>
            </h2>
            <button onClick={() => { setErreur(""); setNiveauModal({ cycleId: c.id }); }} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50">
              <Plus className="h-3.5 w-3.5" /> Niveau
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.niveaux.length ? c.niveaux.map((n) => (
              <button
                key={n.id}
                onClick={() => { setErreur(""); setNiveauModal({ ...n, cycleId: c.id }); }}
                className="group flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 transition"
              >
                {n.nom} <span className="text-neutral-400">· {n.nbClasses} cl.</span>
                <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100" />
              </button>
            )) : <span className="text-xs text-neutral-400">Aucun niveau</span>}
          </div>
        </div>
      ))}

      {cycleModal && (
        <Modale titre={cycleEdit ? `Modifier — ${cycleEdit.nom}` : "Ajouter un cycle"} onClose={() => setCycleModal(null)}>
          <form
            action={(fd) => run(
              () => (cycleEdit ? actionModifierCycle(cycleEdit.id, fd) : actionCreerCycle(fd)),
              () => setCycleModal(null),
            )}
            className="space-y-4"
          >
            <Champ name="nom" label="Nom du cycle" defaultValue={cycleEdit?.nom ?? ""} placeholder="Ex : Lycée" required />
            <Champ name="ordre" label="Ordre d'affichage" type="number" defaultValue={String(cycleEdit?.ordre ?? 4)} />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setCycleModal(null)} label={cycleEdit ? "Enregistrer" : "Ajouter"} />
          </form>
        </Modale>
      )}

      {niveauModal && (
        <Modale titre={niveauEdit ? `Modifier — ${niveauEdit.nom}` : "Ajouter un niveau"} onClose={() => setNiveauModal(null)}>
          <form
            action={(fd) => {
              if (!niveauEdit) fd.set("cycleId", niveauModal.cycleId);
              run(
                () => (niveauEdit ? actionModifierNiveau(niveauEdit.id, fd) : actionCreerNiveau(fd)),
                () => setNiveauModal(null),
              );
            }}
            className="space-y-4"
          >
            <Champ name="nom" label="Nom du niveau" defaultValue={niveauEdit?.nom ?? ""} placeholder="Ex : 6ème" required />
            <Champ name="ordre" label="Ordre" type="number" defaultValue={String(niveauEdit?.ordre ?? 1)} />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setNiveauModal(null)} label={niveauEdit ? "Enregistrer" : "Ajouter"} />
          </form>
        </Modale>
      )}
    </div>
  );
}
