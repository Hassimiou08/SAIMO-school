"use client";

import { toast } from "sonner";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Star, CalendarRange, Loader2 } from "lucide-react";
import type { ClasseOption, MatiereOption } from "@/server/dal/pedagogie";
import { actionCreerAffectation, actionSupprimerAffectation } from "@/server/actions/pedagogie";

type Affectation = { id: string; matiere: string; classe: string; profPrincipal: boolean };

export function AffecterEnseignantView({
  enseignantId,
  enseignantNom,
  affectations,
  classes,
  matieres,
}: {
  enseignantId: string;
  enseignantNom: string;
  affectations: Affectation[];
  classes: ClasseOption[];
  matieres: MatiereOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [classeSel, setClasseSel] = useState("");
  const [matiereSel, setMatiereSel] = useState("");

  const classeParId = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);
  const matiereParId = useMemo(() => new Map(matieres.map((m) => [m.id, m])), [matieres]);

  const matieresFiltrees = useMemo(() => {
    const c = classeSel ? classeParId.get(classeSel) : null;
    if (!c) return matieres;
    return matieres.filter((m) => m.niveauIds.length === 0 || m.niveauIds.includes(c.niveauId));
  }, [matieres, classeSel, classeParId]);

  const classesFiltrees = useMemo(() => {
    const m = matiereSel ? matiereParId.get(matiereSel) : null;
    if (!m || m.niveauIds.length === 0) return classes;
    return classes.filter((c) => m.niveauIds.includes(c.niveauId));
  }, [classes, matiereSel, matiereParId]);

  const ajouter = (fd: FormData) => {
    fd.set("enseignantId", enseignantId);
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerAffectation(fd);
      if (!r.succes) setErreur(r.erreur);
      else {
        formRef.current?.reset();
        setClasseSel("");
        setMatiereSel("");
        router.refresh();
      }
    });
  };
  const retirer = (id: string) =>
    startTransition(async () => {
      const r = await actionSupprimerAffectation(id);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-navy-900">
          Affectations de {enseignantNom} <span className="text-sm font-normal text-neutral-400">({affectations.length})</span>
        </h2>

        {affectations.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucune affectation pour l&rsquo;instant. Ajoutez une classe + matière ci-dessous.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {affectations.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-800">{a.classe}</span>
                  <span className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{a.matiere}</span>
                  {a.profPrincipal && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 border border-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-600">
                      <Star className="h-3 w-3" /> Prof. principal
                    </span>
                  )}
                </div>
                <button onClick={() => retirer(a.id)} disabled={isPending} className="text-neutral-400 hover:text-red-600 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form ref={formRef} action={ajouter} className="mt-5 flex flex-wrap items-end gap-3 border-t border-neutral-100 pt-5">
          <div>
            <label className="text-[11px] font-medium text-neutral-500">Classe</label>
            <select
              name="classeId"
              required
              value={classeSel}
              onChange={(e) => setClasseSel(e.target.value)}
              className="mt-0.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="" disabled>Choisir…</option>
              {classesFiltrees.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-neutral-500">Matière</label>
            <select
              name="matiereId"
              required
              value={matiereSel}
              onChange={(e) => setMatiereSel(e.target.value)}
              className="mt-0.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="" disabled>Choisir…</option>
              {matieresFiltrees.map((m) => (<option key={m.id} value={m.id}>{m.nom}</option>))}
            </select>
          </div>
          <label className="flex items-center gap-1.5 pb-2 text-sm text-neutral-700">
            <input type="checkbox" name="profPrincipal" className="h-4 w-4" /> Prof. principal
          </label>
          <button type="submit" disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition disabled:opacity-60">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Ajouter
          </button>
        </form>
        {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">{erreur}</p>}
      </div>

      <div className="flex items-center justify-between">
        <Link href={`/portail/enseignants/${enseignantId}`} className="text-sm font-semibold text-neutral-500 hover:text-navy-900">
          Passer cette étape
        </Link>
        <Link
          href={`/portail/emploi-du-temps?enseignant=${enseignantId}`}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <CalendarRange className="h-4 w-4" /> Planifier l&rsquo;emploi du temps →
        </Link>
      </div>
    </div>
  );
}
