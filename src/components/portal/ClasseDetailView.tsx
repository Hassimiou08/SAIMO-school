"use client";

import { toast } from "sonner";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, User, CalendarRange, Trash2, Plus, X, Loader2, Pencil } from "lucide-react";
import type { ClasseDetailDTO, NiveauOption } from "@/server/dal/pedagogie";
import type { MatiereOption, EnseignantOption } from "@/server/dal/pedagogie";
import { actionCreerAffectation, actionSupprimerAffectation, actionModifierClasse } from "@/server/actions/pedagogie";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";

const JOURS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const TABS = [
  { id: "eleves", label: "Élèves", icon: Users },
  { id: "equipe", label: "Équipe pédagogique", icon: User },
  { id: "emploi", label: "Emploi du temps", icon: CalendarRange },
] as const;

export function ClasseDetailView({
  classe,
  matieres,
  enseignants,
  niveaux,
}: {
  classe: ClasseDetailDTO;
  matieres: MatiereOption[];
  enseignants: EnseignantOption[];
  niveaux: NiveauOption[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("eleves");
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [isPending, startTransition] = useTransition();

  const modifier = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionModifierClasse(classe.id, fd);
      if (!r.succes) setErreur(r.erreur);
      else { setEditModal(false); router.refresh(); }
    });
  };

  const ajouterAffectation = (fd: FormData) => {
    fd.set("classeId", classe.id);
    setErreur("");
    startTransition(async () => {
      const res = await actionCreerAffectation(fd);
      if (!res.succes) setErreur(res.erreur);
      else { setModal(false); router.refresh(); }
    });
  };

  const retirer = (id: string) => {
    startTransition(async () => {
      const res = await actionSupprimerAffectation(id);
      if (!res.succes) toast.error(res.erreur);
      else router.refresh();
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-neutral-200 bg-white p-1 w-fit">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-navy-950 text-white" : "text-ink-500 hover:text-navy-900"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => { setErreur(""); setEditModal(true); }} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition">
          <Pencil className="h-4 w-4" /> Modifier la classe
        </button>
      </div>

      {tab === "eleves" && (
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          {classe.eleves.length === 0 ? (
            <p className="p-10 text-center text-sm text-neutral-500">Aucun élève inscrit dans cette classe.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-neutral-100 text-xs uppercase text-neutral-500"><th className="px-5 py-3">Élève</th><th className="px-5 py-3">Matricule</th><th className="px-5 py-3">Sexe</th></tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {classe.eleves.map((e) => (
                  <tr key={e.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={() => router.push(`/portail/eleves/${e.id}`)}>
                    <td className="px-5 py-3 font-medium text-neutral-800">{e.prenom} {e.nom}</td>
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">{e.matricule}</td>
                    <td className="px-5 py-3">{e.sexe ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "equipe" && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 p-4">
            <p className="text-sm font-semibold text-neutral-700">{classe.equipe.length} affectation{classe.equipe.length > 1 ? "s" : ""}</p>
            <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition">
              <Plus className="h-4 w-4" /> Affecter un enseignant
            </button>
          </div>
          {classe.equipe.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-500">Aucun enseignant affecté.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {classe.equipe.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <div>
                    <span className="font-medium text-neutral-800">{a.enseignant}</span>
                    <span className="ml-2 rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{a.matiere}</span>
                    {a.profPrincipal && <span className="ml-2 rounded-lg bg-green-50 border border-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-600">Prof. principal</span>}
                  </div>
                  <button onClick={() => retirer(a.id)} disabled={isPending} className="text-neutral-400 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "emploi" && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          {classe.emploi.length === 0 ? (
            <p className="p-10 text-center text-sm text-neutral-500">
              Aucun créneau. Configurez l&rsquo;emploi du temps depuis <Link href="/portail/emploi-du-temps" className="text-blue-600 hover:underline">Emploi du Temps</Link>.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {classe.emploi.map((c) => (
                <li key={c.id} className="flex items-center gap-4 px-5 py-3.5 text-sm">
                  <span className="w-20 font-semibold text-neutral-700">{JOURS[c.jour]}</span>
                  <span className="w-24 font-mono text-xs text-neutral-500">{c.heureDebut}–{c.heureFin}</span>
                  <span className="flex-1 font-medium text-neutral-800">{c.matiere}</span>
                  <span className="text-neutral-500">{c.enseignant ?? "—"}</span>
                  <span className="w-16 text-right font-mono text-xs text-neutral-400">{c.salle ?? ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-neutral-900">Affecter un enseignant</h3>
              <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-neutral-700"><X className="h-5 w-5" /></button>
            </div>
            <form action={ajouterAffectation} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Enseignant</label>
                <select name="enseignantId" required defaultValue="" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none">
                  <option value="" disabled>Choisir…</option>
                  {enseignants.map((e) => (<option key={e.id} value={e.id}>{e.nom}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Matière</label>
                <select name="matiereId" required defaultValue="" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none">
                  <option value="" disabled>Choisir…</option>
                  {matieres.map((m) => (<option key={m.id} value={m.id}>{m.nom}</option>))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" name="profPrincipal" className="h-4 w-4" /> Professeur principal de la classe
              </label>
              {erreur && <p className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-600">{erreur}</p>}
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Affecter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <Modale titre="Modifier la classe" onClose={() => setEditModal(false)}>
          <form action={modifier} className="space-y-4">
            <Champ name="nom" label="Nom de la classe" defaultValue={classe.nom} required />
            <Selecteur name="niveauId" label="Niveau" defaultValue={niveaux.find((n) => n.nom === classe.niveau)?.id ?? ""}>
              <option value="">— inchangé —</option>
              {niveaux.map((n) => (<option key={n.id} value={n.id}>{n.nom} ({n.cycle})</option>))}
            </Selecteur>
            <div className="grid grid-cols-2 gap-3">
              <Champ name="salle" label="Salle" defaultValue={classe.salle ?? ""} />
              <Champ name="capacite" label="Capacité" type="number" min={1} defaultValue={classe.capacite ?? ""} />
            </div>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setEditModal(false)} label="Enregistrer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
