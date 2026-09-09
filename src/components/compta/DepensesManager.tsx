"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, CheckCircle, Clock } from "lucide-react";
import type { DepenseRow } from "@/server/dal/compta";
import {
  actionCreerDepense,
  actionMarquerDepensePayee,
} from "@/server/actions/compta";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { formatGNF } from "@/lib/format";

const CATEGORIES = [
  "Fournitures",
  "Factures",
  "Maintenance",
  "Transport",
  "Alimentation",
  "Loyer",
  "Autre",
];
const MODES = [
  { v: "especes", l: "Espèces" },
  { v: "virement", l: "Virement" },
  { v: "cheque", l: "Chèque" },
  { v: "mobile", l: "Mobile Money" },
];

export function DepensesManager({ depenses }: { depenses: DepenseRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [dejaPaye, setDejaPaye] = useState(false);
  const [payer, setPayer] = useState<DepenseRow | null>(null);
  const [mode, setMode] = useState("especes");

  const filtered = useMemo(
    () =>
      depenses.filter((d) =>
        `${d.beneficiaire} ${d.categorie} ${d.description}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [depenses, q],
  );

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerDepense(fd);
      if (!r.succes) setErreur(r.erreur);
      else {
        toast.success("Dépense enregistrée");
        setModal(false);
        router.refresh();
      }
    });
  };

  const confirmerPaiement = () => {
    if (!payer) return;
    startTransition(async () => {
      const r = await actionMarquerDepensePayee(payer.id, mode);
      if (!r.succes) toast.error(r.erreur);
      else {
        toast.success("Dépense réglée");
        setPayer(null);
        router.refresh();
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Dépenses &amp; achats
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Charges, factures et décaissements de l&rsquo;établissement.
          </p>
        </div>
        <button
          onClick={() => {
            setErreur("");
            setDejaPaye(false);
            setModal(true);
          }}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Nouvelle dépense
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Chercher un bénéficiaire, une catégorie…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="overflow-hidden overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Bénéficiaire</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Montant</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((d) => (
              <tr key={d.id} className="transition hover:bg-neutral-50">
                <td className="px-6 py-4 text-sm text-neutral-500">{d.date}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-neutral-900">
                    {d.beneficiaire}
                  </p>
                  <span className="mt-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600">
                    {d.categorie}
                  </span>
                </td>
                <td className="max-w-xs truncate px-6 py-4 text-sm text-neutral-700">
                  {d.description}
                </td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-neutral-900">
                  {formatGNF(d.montant)}
                </td>
                <td className="px-6 py-4">
                  {d.statut === "paye" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle className="h-3 w-3" /> Payé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                      <Clock className="h-3 w-3" /> Planifié
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {d.statut === "planifie" && (
                    <button
                      onClick={() => {
                        setPayer(d);
                        setMode("especes");
                      }}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Marquer payé
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">
                  Aucune dépense.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modale titre="Nouvelle dépense" onClose={() => setModal(false)} large>
          <form action={creer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Champ label="Bénéficiaire" name="beneficiaire" required />
              <Selecteur label="Catégorie" name="categorie" defaultValue="Fournitures">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Selecteur>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Champ label="Montant (GNF)" name="montant" type="number" min="0" required />
              <Champ
                label="Date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={dejaPaye}
                onChange={(e) => setDejaPaye(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600"
              />
              Déjà réglée
            </label>
            <input type="hidden" name="statut" value={dejaPaye ? "paye" : "planifie"} />
            {dejaPaye && (
              <Selecteur label="Mode de paiement" name="modePaiement" defaultValue="especes">
                {MODES.map((m) => (
                  <option key={m.v} value={m.v}>
                    {m.l}
                  </option>
                ))}
              </Selecteur>
            )}

            {erreur && <Err msg={erreur} />}
            <ModalActions
              onCancel={() => setModal(false)}
              label="Enregistrer la dépense"
              pending={isPending}
            />
          </form>
        </Modale>
      )}

      {payer && (
        <Modale titre="Marquer la dépense payée" onClose={() => setPayer(null)}>
          <form action={confirmerPaiement} className="space-y-4">
            <div className="rounded-xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Bénéficiaire</span>
                <span className="font-semibold">{payer.beneficiaire}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-neutral-500">Montant</span>
                <span className="font-mono font-bold">{formatGNF(payer.montant)}</span>
              </div>
            </div>
            <Selecteur
              label="Mode de paiement"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {MODES.map((m) => (
                <option key={m.v} value={m.v}>
                  {m.l}
                </option>
              ))}
            </Selecteur>
            <ModalActions
              onCancel={() => setPayer(null)}
              label="Confirmer le règlement"
              pending={isPending}
            />
          </form>
        </Modale>
      )}
    </div>
  );
}
