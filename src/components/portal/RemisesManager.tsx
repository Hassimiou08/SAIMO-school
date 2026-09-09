"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, Search } from "lucide-react";
import type { RemiseRowDTO, FraisRowDTO } from "@/server/dal/finance";
import { actionCreerRemise } from "@/server/actions/finance";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { formatGNF } from "@/lib/format";

export function RemisesManager({
  remises,
  frais,
}: {
  remises: RemiseRowDTO[];
  frais: FraisRowDTO[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [q, setQ] = useState("");

  const fraisFiltres = useMemo(
    () => frais.filter((f) => `${f.eleve} ${f.classe} ${f.echeance}`.toLowerCase().includes(q.toLowerCase())).slice(0, 50),
    [frais, q],
  );

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerRemise(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(false); router.refresh(); }
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 p-5">
        <p className="text-sm font-semibold text-neutral-700">{remises.length} remise{remises.length > 1 ? "s" : ""}</p>
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition">
          <Plus className="h-4 w-4" /> Nouvelle remise
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Élève</th><th className="px-5 py-3">Frais</th>
            <th className="px-5 py-3">Montant</th><th className="px-5 py-3">Motif</th><th className="px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {remises.map((r) => (
            <tr key={r.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3">
                <p className="font-medium text-neutral-800">{r.eleve}</p>
                <p className="text-xs text-neutral-500">{r.classe}</p>
              </td>
              <td className="px-5 py-3 text-neutral-600">{r.echeance}</td>
              <td className="px-5 py-3 font-mono font-bold text-green-700">-{formatGNF(r.montant)}</td>
              <td className="px-5 py-3 text-neutral-600">{r.motif}</td>
              <td className="px-5 py-3 text-xs text-neutral-500">{r.date}</td>
            </tr>
          ))}
          {remises.length === 0 && (
            <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">
              <Tag className="mx-auto mb-2 h-6 w-6 text-neutral-300" /> Aucune remise accordée.
            </td></tr>
          )}
        </tbody>
      </table>

      {modal && (
        <Modale titre="Nouvelle remise / bourse" onClose={() => setModal(false)} large>
          <form action={creer} className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer les frais (élève, classe)…" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400" />
            </div>
            <Selecteur name="fraisEleveId" label="Frais concerné" required defaultValue="">
              <option value="" disabled>Choisir…</option>
              {fraisFiltres.map((f) => (
                <option key={f.id} value={f.id}>{f.eleve} — {f.echeance} ({f.classe}) · solde {formatGNF(f.solde)}</option>
              ))}
            </Selecteur>
            <Champ name="montant" label="Montant de la remise (GNF)" type="number" min="1" required />
            <Champ name="motif" label="Motif" placeholder="Ex : Bourse d'excellence, fratrie…" required />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Accorder" />
          </form>
        </Modale>
      )}
    </div>
  );
}
