"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Trash2 } from "lucide-react";
import type { AffectationDTO, ClasseOption, MatiereOption, EnseignantOption } from "@/server/dal/pedagogie";
import { actionCreerAffectation, actionSupprimerAffectation } from "@/server/actions/pedagogie";
import { Modale, Selecteur, Err, ModalActions } from "@/components/portal/_ui";

export function AffectationsManager({
  affectations,
  classes,
  matieres,
  enseignants,
}: {
  affectations: AffectationDTO[];
  classes: ClasseOption[];
  matieres: MatiereOption[];
  enseignants: EnseignantOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filtreClasse, setFiltreClasse] = useState("Toutes");
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [suite, setSuite] = useState<{ id: string; nom: string } | null>(null);
  const [matiereSel, setMatiereSel] = useState("");
  const [classeSel, setClasseSel] = useState("");

  const classeParId = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);
  const matiereParId = useMemo(() => new Map(matieres.map((m) => [m.id, m])), [matieres]);

  // Matière sans MatiereNiveau configuré = visible partout (pas de filtre fiable).
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

  const listeClasses = useMemo(
    () => ["Toutes", ...Array.from(new Set(affectations.map((a) => a.classe)))],
    [affectations],
  );
  const filtered =
    filtreClasse === "Toutes" ? affectations : affectations.filter((a) => a.classe === filtreClasse);

  const creer = (fd: FormData) => {
    setErreur("");
    const eid = String(fd.get("enseignantId") ?? "");
    const nom = enseignants.find((e) => e.id === eid)?.nom ?? "";
    startTransition(async () => {
      const r = await actionCreerAffectation(fd);
      if (!r.succes) setErreur(r.erreur);
      else {
        setModal(false);
        if (eid) setSuite({ id: eid, nom });
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
    <div className="space-y-3">
    {suite && (
      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        <span>Affectation ajoutée.</span>
        <a href={`/portail/emploi-du-temps?enseignant=${suite.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-700">
          Planifier l&rsquo;emploi du temps{suite.nom ? ` de ${suite.nom.split(" ")[0]}` : ""} →
        </a>
      </div>
    )}
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 p-5">
        <select value={filtreClasse} onChange={(e) => setFiltreClasse(e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400">
          {listeClasses.map((c) => (<option key={c}>{c}</option>))}
        </select>
        <button onClick={() => { setMatiereSel(""); setClasseSel(""); setModal(true); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Nouvelle affectation
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Enseignant</th><th className="px-5 py-3">Matière</th>
            <th className="px-5 py-3">Classe</th><th className="px-5 py-3">Rôle</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3 font-medium text-neutral-800">{a.enseignant}</td>
              <td className="px-5 py-3"><span className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{a.matiere}</span></td>
              <td className="px-5 py-3 text-neutral-700">{a.classe}</td>
              <td className="px-5 py-3">
                {a.profPrincipal
                  ? <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 border border-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-600"><Star className="h-3 w-3" /> Prof. principal</span>
                  : <span className="text-xs text-neutral-400">Intervenant</span>}
              </td>
              <td className="px-5 py-3 text-right">
                <button onClick={() => retirer(a.id)} disabled={isPending} className="text-neutral-400 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">Aucune affectation.</td></tr>}
        </tbody>
      </table>

      {modal && (
        <Modale titre="Nouvelle affectation" onClose={() => setModal(false)}>
          <form action={creer} className="space-y-4">
            <Selecteur name="enseignantId" label="Enseignant" required defaultValue="">
              <option value="" disabled>Choisir…</option>
              {enseignants.map((e) => (<option key={e.id} value={e.id}>{e.nom}</option>))}
            </Selecteur>
            <Selecteur
              name="matiereId"
              label="Matière"
              required
              value={matiereSel}
              onChange={(e) => setMatiereSel(e.target.value)}
            >
              <option value="" disabled>Choisir…</option>
              {matieresFiltrees.map((m) => (<option key={m.id} value={m.id}>{m.nom}</option>))}
            </Selecteur>
            <Selecteur
              name="classeId"
              label="Classe"
              required
              value={classeSel}
              onChange={(e) => setClasseSel(e.target.value)}
            >
              <option value="" disabled>Choisir…</option>
              {classesFiltrees.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
            </Selecteur>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" name="profPrincipal" className="h-4 w-4" /> Professeur principal
            </label>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Affecter" />
          </form>
        </Modale>
      )}
    </div>
    </div>
  );
}
