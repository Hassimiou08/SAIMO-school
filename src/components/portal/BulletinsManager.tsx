"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FileText, Sparkles, CheckCircle, Send, Loader2, Lock, AlertTriangle, ArrowRight, Printer } from "lucide-react";
import type { BulletinRowDTO, EtatPreparationBulletins } from "@/server/dal/bulletins";
import type { ClasseOption } from "@/server/dal/pedagogie";
import type { PeriodeOption } from "@/server/dal/evaluations";
import {
  actionGenererBulletins,
  actionValiderBulletin,
  actionPublierBulletin,
  actionPublierBulletinsClasse,
} from "@/server/actions/bulletins";

export function BulletinsManager({
  bulletins,
  classes,
  periodes,
  filtreClasse,
  filtrePeriode,
  etat,
}: {
  bulletins: BulletinRowDTO[];
  classes: ClasseOption[];
  periodes: PeriodeOption[];
  filtreClasse?: string;
  filtrePeriode?: string;
  etat?: EtatPreparationBulletins | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const filtresPrets = Boolean(filtreClasse && filtrePeriode);
  const pretAGenerer = Boolean(etat && etat.evaluationsVerrouillees > 0);
  const lienNotes = `/portail/notes?classe=${filtreClasse ?? ""}&periode=${filtrePeriode ?? ""}`;

  const nav = (k: string, v: string) => {
    const sp = new URLSearchParams(window.location.search);
    if (v) sp.set(k, v); else sp.delete(k);
    router.push(`/portail/bulletins?${sp.toString()}`);
  };

  const generer = () => {
    if (!filtreClasse || !filtrePeriode) {
      setMsg("Choisissez une classe et une période.");
      toast.error("Choisissez une classe et une période.");
      return;
    }
    setMsg("");
    startTransition(async () => {
      const r = await actionGenererBulletins(filtreClasse, filtrePeriode);
      if (r.succes) {
        setMsg(`${r.data.nombre} bulletin(s) généré(s).`);
        toast.success(`${r.data.nombre} bulletin(s) généré(s).`);
        router.refresh();
      } else {
        setMsg(r.erreur);
        toast.error(r.erreur);
      }
    });
  };
  const publierTout = () => {
    startTransition(async () => {
      const r = await actionPublierBulletinsClasse(filtreClasse, filtrePeriode);
      if (r.succes) {
        setMsg(`${r.data.nombre} bulletin(s) publié(s).`);
        toast.success(`${r.data.nombre} bulletin(s) publié(s).`);
        router.refresh();
      } else {
        setMsg(r.erreur);
        toast.error(r.erreur);
      }
    });
  };
  const valider = (id: string) =>
    startTransition(async () => {
      const r = await actionValiderBulletin(id);
      if (!r.succes) { setMsg(r.erreur); toast.error(r.erreur); }
      else { toast.success("Bulletin validé."); router.refresh(); }
    });
  const publier = (id: string) =>
    startTransition(async () => {
      const r = await actionPublierBulletin(id);
      if (!r.succes) { setMsg(r.erreur); toast.error(r.erreur); }
      else { toast.success("Bulletin publié."); router.refresh(); }
    });

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-5">
        <select value={filtreClasse ?? ""} onChange={(e) => nav("classe", e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400">
          <option value="">Toutes les classes</option>
          {classes.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
        </select>
        <select value={filtrePeriode ?? ""} onChange={(e) => nav("periode", e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400">
          <option value="">Toutes les périodes</option>
          {periodes.map((p) => (<option key={p.id} value={p.id}>{p.nom}</option>))}
        </select>
        <div className="ml-auto flex gap-2">
          <button
            onClick={generer}
            disabled={isPending || (filtresPrets && etat != null && !pretAGenerer)}
            title={
              !filtresPrets
                ? "Choisissez une classe et une période"
                : !pretAGenerer
                  ? "Verrouillez au moins une évaluation pour cette classe et cette période"
                  : "Générer les bulletins"
            }
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Générer les bulletins
          </button>
          <button onClick={publierTout} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-60">
            <Send className="h-4 w-4" /> Publier les validés
          </button>
          {filtresPrets && bulletins.length > 0 && (
            <Link
              href={`/portail/bulletins/imprimer?classe=${filtreClasse}&periode=${filtrePeriode}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            >
              <Printer className="h-4 w-4" /> Imprimer la classe
            </Link>
          )}
        </div>
      </div>

      {!filtresPrets && (
        <p className="border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-600">
          Sélectionnez <strong>une classe</strong> et <strong>une période</strong> ci-dessus pour préparer les bulletins.
        </p>
      )}

      {filtresPrets && etat && (
        <div className="border-b border-neutral-100 px-5 py-3 text-xs">
          {etat.evaluationsTotal === 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Aucune évaluation pour cette classe à cette période. Créez et notez des évaluations d&rsquo;abord.
              </span>
              <Link href={lienNotes} className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-1 font-semibold text-white hover:bg-amber-700">
                Aller aux notes <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : etat.evaluationsVerrouillees === 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-amber-700">
              <Lock className="h-4 w-4" />
              <span>
                {etat.evaluationsNoteesNonVerrouillees > 0
                  ? `${etat.evaluationsNoteesNonVerrouillees} évaluation(s) notée(s) mais aucune verrouillée. `
                  : `${etat.evaluationsTotal} évaluation(s) créée(s) mais aucune notée/verrouillée. `}
                Le bulletin s&rsquo;appuie uniquement sur les évaluations <strong>verrouillées</strong>.
              </span>
              <Link href={lienNotes} className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-1 font-semibold text-white hover:bg-amber-700">
                Verrouiller les évaluations <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-600">
              <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
                <CheckCircle className="h-4 w-4" /> Prêt à générer
              </span>
              <span>{etat.evaluationsVerrouillees} évaluation(s) verrouillée(s)</span>
              <span>{etat.elevesAvecNote}/{etat.elevesClasse} élève(s) avec note</span>
              {etat.evaluationsNoteesNonVerrouillees > 0 && (
                <span className="text-amber-600">
                  {etat.evaluationsNoteesNonVerrouillees} autre(s) non verrouillée(s) — non prise(s) en compte
                </span>
              )}
              {etat.bulletinsExistants > 0 && (
                <span className="text-neutral-400">{etat.bulletinsExistants} bulletin(s) déjà généré(s)</span>
              )}
            </div>
          )}
        </div>
      )}

      {msg && <p className="border-b border-neutral-100 bg-blue-50 px-5 py-2 text-xs font-medium text-blue-700">{msg}</p>}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Élève</th><th className="px-5 py-3">Classe</th>
            <th className="px-5 py-3">Période</th><th className="px-5 py-3">Moyenne</th>
            <th className="px-5 py-3">Rang</th><th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {bulletins.map((b) => (
            <tr key={b.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3 font-medium text-neutral-800">{b.eleve}</td>
              <td className="px-5 py-3 text-neutral-600">{b.classe}</td>
              <td className="px-5 py-3 text-neutral-500">{b.periode}</td>
              <td className="px-5 py-3 font-mono">{b.moyenne != null ? `${b.moyenne.toFixed(2)}/20` : "—"}</td>
              <td className="px-5 py-3">{b.rang != null ? `${b.rang}/${b.effectif ?? "?"}` : "—"}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  b.statut === "publie" ? "bg-green-100 text-green-600"
                  : b.statut === "valide" ? "bg-blue-100 text-blue-600"
                  : "bg-neutral-100 text-neutral-500"}`}>
                  {b.statut === "publie" ? "Publié" : b.statut === "valide" ? "Validé" : "Brouillon"}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button onClick={() => router.push(`/portail/bulletins/${b.id}`)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                    <FileText className="h-3.5 w-3.5" /> Voir
                  </button>
                  {b.statut === "brouillon" && (
                    <button onClick={() => valider(b.id)} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-800">
                      <CheckCircle className="h-3.5 w-3.5" /> Valider
                    </button>
                  )}
                  {b.statut === "valide" && (
                    <button onClick={() => publier(b.id)} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                      <Send className="h-3.5 w-3.5" /> Publier
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {bulletins.length === 0 && (
            <tr><td colSpan={7} className="px-5 py-10 text-center text-neutral-500">
              Aucun bulletin. Sélectionnez une classe + une période et cliquez « Générer ».
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
