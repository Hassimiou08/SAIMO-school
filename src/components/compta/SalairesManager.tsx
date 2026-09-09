"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, CheckCircle, Clock, Sparkles } from "lucide-react";
import type { ListeSalaires, SalaireRow } from "@/server/dal/compta";
import {
  actionCreerSalaire,
  actionPayerSalaire,
  actionPayerSalairesGroupe,
  actionGenererPaieMois,
} from "@/server/actions/compta";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { formatGNF } from "@/lib/format";

const MODES = [
  { v: "virement", l: "Virement bancaire" },
  { v: "especes", l: "Espèces" },
  { v: "mobile", l: "Mobile Money" },
  { v: "cheque", l: "Chèque" },
];
const ROLES = ["Enseignant", "Administration", "Entretien", "Direction", "Autre"];

function libelleMois(m: string): string {
  const [y, mo] = m.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
    new Date(y, mo - 1, 1),
  );
}

function moisCourant(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function SalairesManager({ data }: { data: ListeSalaires }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [selection, setSelection] = useState<string[]>([]);
  const [modalNouveau, setModalNouveau] = useState(false);
  const [typeContrat, setTypeContrat] = useState<"fixe" | "horaire">("fixe");
  const [erreur, setErreur] = useState("");

  // Modale de paiement (individuel ou groupé)
  const [paiement, setPaiement] = useState<{ ids: string[]; total: number } | null>(
    null,
  );
  const [mode, setMode] = useState("virement");

  const moisOptions = useMemo(() => {
    const set = new Set([moisCourant(), ...data.moisDisponibles, data.mois]);
    return [...set].sort().reverse();
  }, [data.moisDisponibles, data.mois]);

  const lignes = useMemo(
    () =>
      data.lignes.filter((l) =>
        `${l.employeNom} ${l.role}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [data.lignes, q],
  );
  const payables = lignes.filter((l) => l.statut === "attente");
  const totalSelection = data.lignes
    .filter((l) => selection.includes(l.id))
    .reduce((s, l) => s + l.netAPayer, 0);

  const changerMois = (m: string) => {
    setSelection([]);
    router.push(`/compta/salaires?mois=${m}`);
  };

  const toggle = (id: string) =>
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleTout = () =>
    setSelection((prev) =>
      prev.length === payables.length ? [] : payables.map((l) => l.id),
    );

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerSalaire(fd);
      if (!r.succes) setErreur(r.erreur);
      else {
        toast.success("Ligne de paie ajoutée");
        setModalNouveau(false);
        router.refresh();
      }
    });
  };

  const genererPaie = () =>
    startTransition(async () => {
      const r = await actionGenererPaieMois(data.mois);
      if (!r.succes) toast.error(r.erreur);
      else {
        toast.success(`${r.data.crees} ligne(s) de paie générée(s)`);
        router.refresh();
      }
    });

  const confirmerPaiement = () =>
    startTransition(async () => {
      if (!paiement) return;
      if (paiement.ids.length === 1) {
        const r = await actionPayerSalaire(paiement.ids[0], mode);
        if (!r.succes) {
          toast.error(r.erreur);
          return;
        }
        toast.success("Salaire réglé");
      } else {
        const r = await actionPayerSalairesGroupe(paiement.ids, mode);
        if (!r.succes) {
          toast.error(r.erreur);
          return;
        }
        toast.success(`${r.data.payes} salaire(s) réglé(s)`);
      }
      setPaiement(null);
      setSelection([]);
      router.refresh();
    });

  return (
    <div className="pb-24">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Salaires &amp; paie
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Rémunération du personnel — {libelleMois(data.mois)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={data.mois}
            onChange={(e) => changerMois(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-blue-400"
          >
            {moisOptions.map((m) => (
              <option key={m} value={m}>
                {libelleMois(m)}
              </option>
            ))}
          </select>
          <button
            onClick={genererPaie}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4 text-violet-500" /> Générer la paie
          </button>
          <button
            onClick={() => {
              setErreur("");
              setTypeContrat("fixe");
              setModalNouveau(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Nouvelle ligne
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-neutral-100 px-3 py-1.5 font-semibold text-neutral-600">
          Total : {formatGNF(data.totalNet)}
        </span>
        <span
          className={`rounded-full px-3 py-1.5 font-semibold ${
            data.nbEnAttente > 0
              ? "bg-orange-100 text-orange-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {data.nbEnAttente} en attente ({formatGNF(data.totalEnAttente)})
        </span>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Chercher un employé, un rôle…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="overflow-hidden overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-blue-600"
                  checked={payables.length > 0 && selection.length === payables.length}
                  onChange={toggleTout}
                  disabled={payables.length === 0}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Employé</th>
              <th className="px-6 py-4 font-semibold">Contrat</th>
              <th className="px-6 py-4 font-semibold">Base / heures</th>
              <th className="px-6 py-4 font-semibold">Primes / retenues</th>
              <th className="px-6 py-4 font-semibold">Net à payer</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {lignes.map((s: SalaireRow) => (
              <tr
                key={s.id}
                className={`transition hover:bg-neutral-50 ${
                  selection.includes(s.id) ? "bg-blue-50/50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  {s.statut === "attente" ? (
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-blue-600"
                      checked={selection.includes(s.id)}
                      onChange={() => toggle(s.id)}
                    />
                  ) : null}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-neutral-900">{s.employeNom}</p>
                  <p className="text-xs text-neutral-500">{s.role}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      s.typeContrat === "fixe"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {s.typeContrat}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {s.typeContrat === "horaire" ? (
                    <>
                      {s.heures ?? 0} h
                      <span className="block text-xs text-neutral-500">
                        × {formatGNF(s.tauxHoraire ?? 0)}
                      </span>
                    </>
                  ) : (
                    formatGNF(s.salaireBase ?? 0)
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {s.primes > 0 && (
                    <p className="text-emerald-600">+{formatGNF(s.primes)}</p>
                  )}
                  {s.retenues > 0 && (
                    <p className="text-red-500">−{formatGNF(s.retenues)}</p>
                  )}
                  {s.primes === 0 && s.retenues === 0 && (
                    <p className="text-neutral-400">—</p>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-neutral-900">
                  {formatGNF(s.netAPayer)}
                </td>
                <td className="px-6 py-4">
                  {s.statut === "paye" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle className="h-3 w-3" /> Réglé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                      <Clock className="h-3 w-3" /> En attente
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {s.statut === "attente" && (
                    <button
                      onClick={() => {
                        setPaiement({ ids: [s.id], total: s.netAPayer });
                        setMode("virement");
                      }}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
                    >
                      Payer
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {lignes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-neutral-500">
                  Aucune ligne de paie pour ce mois. Utilisez «&nbsp;Générer la
                  paie&nbsp;» ou «&nbsp;Nouvelle ligne&nbsp;».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Barre flottante paiement groupé */}
      {selection.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-6 rounded-full border border-neutral-800 bg-neutral-900 px-6 py-4 shadow-2xl lg:ml-32">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-400">
              {selection.length} employé(s) sélectionné(s)
            </span>
            <span className="font-mono text-lg font-bold text-white">
              {formatGNF(totalSelection)}
            </span>
          </div>
          <button
            onClick={() => {
              setPaiement({ ids: selection, total: totalSelection });
              setMode("virement");
            }}
            className="rounded-full bg-blue-600 px-6 py-2.5 font-bold text-white transition hover:bg-blue-500"
          >
            Payer la sélection
          </button>
        </div>
      )}

      {/* Modale nouvelle ligne */}
      {modalNouveau && (
        <Modale titre="Nouvelle ligne de paie" onClose={() => setModalNouveau(false)} large>
          <form action={creer} className="space-y-4">
            <input type="hidden" name="mois" value={data.mois} />
            <div className="grid grid-cols-2 gap-4">
              <Champ label="Nom de l'employé" name="employeNom" required />
              <Selecteur label="Rôle" name="role" defaultValue="Enseignant">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Selecteur>
            </div>
            <Selecteur
              label="Type de contrat"
              name="typeContrat"
              value={typeContrat}
              onChange={(e) => setTypeContrat(e.target.value as "fixe" | "horaire")}
            >
              <option value="fixe">Fixe</option>
              <option value="horaire">Horaire</option>
            </Selecteur>
            {typeContrat === "fixe" ? (
              <Champ label="Salaire de base (GNF)" name="salaireBase" type="number" min="0" required />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Champ label="Heures" name="heures" type="number" min="0" step="0.5" required />
                <Champ label="Taux horaire (GNF)" name="tauxHoraire" type="number" min="0" required />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Champ label="Primes (GNF)" name="primes" type="number" min="0" defaultValue="0" />
              <Champ label="Retenues (GNF)" name="retenues" type="number" min="0" defaultValue="0" />
            </div>
            {erreur && <Err msg={erreur} />}
            <ModalActions
              onCancel={() => setModalNouveau(false)}
              label="Ajouter la ligne"
              pending={isPending}
            />
          </form>
        </Modale>
      )}

      {/* Modale paiement */}
      {paiement && (
        <Modale
          titre={
            paiement.ids.length > 1 ? "Paiement groupé" : "Paiement de salaire"
          }
          onClose={() => setPaiement(null)}
        >
          <form action={confirmerPaiement} className="space-y-4">
            <div className="rounded-xl bg-blue-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">
                  {paiement.ids.length} salaire(s)
                </span>
                <span className="font-mono text-lg font-bold text-blue-700">
                  {formatGNF(paiement.total)}
                </span>
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
              onCancel={() => setPaiement(null)}
              label="Confirmer le paiement"
              pending={isPending}
            />
          </form>
        </Modale>
      )}
    </div>
  );
}
