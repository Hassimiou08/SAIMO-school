"use client";

import { toast } from "sonner";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, CalendarClock, Users, Loader2 } from "lucide-react";
import type { EcheanceRowDTO } from "@/server/dal/finance";
import type { NiveauOption } from "@/server/dal/pedagogie";
import {
  actionCreerTypeFrais,
  actionCreerEcheance,
  actionGenererFrais,
} from "@/server/actions/finance";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { formatGNF } from "@/lib/format";

export function EcheancesManager({
  echeances,
  typesFrais,
  niveaux,
}: {
  echeances: EcheanceRowDTO[];
  typesFrais: { id: string; nom: string }[];
  niveaux: NiveauOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<"type" | "echeance" | null>(null);
  const [erreur, setErreur] = useState("");

  const run = (fn: () => Promise<{ succes: boolean; erreur?: string }>) => {
    setErreur("");
    startTransition(async () => {
      const r = await fn();
      if (!r.succes) setErreur(r.erreur ?? "Erreur");
      else { setModal(null); router.refresh(); }
    });
  };
  const generer = (id: string) =>
    startTransition(async () => {
      const r = await actionGenererFrais(id);
      if (r.succes) {
        toast.success(`${r.data.crees} frais générés.`);
        router.refresh();
      } else {
        toast.error(r.erreur);
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setModal("type")} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
          <Tag className="h-4 w-4" /> Nouveau type de frais
        </button>
        <button onClick={() => setModal("echeance")} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Nouvelle échéance
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
              <th className="px-5 py-3">Frais</th><th className="px-5 py-3">Niveau</th>
              <th className="px-5 py-3">Montant</th><th className="px-5 py-3">Échéance</th>
              <th className="px-5 py-3">Frais générés</th><th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {echeances.map((e) => (
              <tr key={e.id} className="hover:bg-neutral-50/60">
                <td className="px-5 py-3 font-medium text-neutral-800">{e.libelle ?? e.typeFrais}</td>
                <td className="px-5 py-3 text-neutral-600">{e.niveau ?? "Tous"}</td>
                <td className="px-5 py-3 font-mono">{formatGNF(e.montant)}</td>
                <td className="px-5 py-3 text-neutral-500">{e.dateEcheance ?? "—"}</td>
                <td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-xs text-neutral-600"><Users className="h-3.5 w-3.5" />{e.nbFraisGeneres}</span></td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => generer(e.id)} disabled={isPending} className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                    <CalendarClock className="h-3.5 w-3.5" /> Générer les frais
                  </button>
                </td>
              </tr>
            ))}
            {echeances.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">Aucune échéance. Créez un type de frais puis une échéance.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal === "type" && (
        <Modale titre="Nouveau type de frais" onClose={() => setModal(null)}>
          <form action={(fd) => run(() => actionCreerTypeFrais(fd))} className="space-y-4">
            <Champ name="nom" label="Nom" placeholder="Ex : Cantine" required />
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" name="obligatoire" defaultChecked className="h-4 w-4" /> Obligatoire
            </label>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(null)} />
          </form>
        </Modale>
      )}

      {modal === "echeance" && (
        <Modale titre="Nouvelle échéance" onClose={() => setModal(null)}>
          <form action={(fd) => run(() => actionCreerEcheance(fd))} className="space-y-4">
            <Selecteur name="typeFraisId" label="Type de frais" required defaultValue="">
              <option value="" disabled>Choisir…</option>
              {typesFrais.map((t) => (<option key={t.id} value={t.id}>{t.nom}</option>))}
            </Selecteur>
            <Selecteur name="niveauId" label="Niveau (vide = tous)" defaultValue="">
              <option value="">Tous les niveaux</option>
              {niveaux.map((n) => (<option key={n.id} value={n.id}>{n.nom} ({n.cycle})</option>))}
            </Selecteur>
            <Champ name="montant" label="Montant (GNF)" type="number" min="1" required />
            <Champ name="libelle" label="Libellé (optionnel)" placeholder="Ex : Scolarité T1" />
            <Champ name="dateEcheance" label="Date limite (optionnel)" type="date" />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(null)} />
          </form>
        </Modale>
      )}
    </div>
  );
}
