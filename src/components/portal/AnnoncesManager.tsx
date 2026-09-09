"use client";

import { toast } from "sonner";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Megaphone, Eye, EyeOff, Calendar } from "lucide-react";
import type { AnnonceDTO } from "@/server/dal/admin";
import { actionCreerAnnonce, actionBasculerAnnonce } from "@/server/actions/admin";
import { Modale, Champ, Err, ModalActions } from "@/components/portal/_ui";

const ROLES = [
  { v: "PARENT", l: "Parents" },
  { v: "ELEVE", l: "Élèves" },
  { v: "ENSEIGNANT", l: "Enseignants" },
];

export function AnnoncesManager({ annonces }: { annonces: AnnonceDTO[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerAnnonce(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(false); router.refresh(); }
    });
  };
  const basculer = (id: string) =>
    startTransition(async () => {
      const r = await actionBasculerAnnonce(id);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Nouvelle annonce
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {annonces.map((a) => (
          <div key={a.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-neutral-900 leading-tight">{a.titre}</h2>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${a.publie ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                {a.publie ? "Publiée" : "Brouillon"}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{a.contenu}</p>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
              <div className="flex flex-wrap gap-1">
                {a.rolesVises.length ? a.rolesVises.map((r) => (
                  <span key={r} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-neutral-500">{r}</span>
                )) : <span className="text-[11px] text-neutral-400">Tous</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                {a.datePublication && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.datePublication}</span>}
                <button onClick={() => basculer(a.id)} disabled={isPending} className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800">
                  {a.publie ? <><EyeOff className="h-3.5 w-3.5" /> Dépublier</> : <><Eye className="h-3.5 w-3.5" /> Publier</>}
                </button>
              </div>
            </div>
          </div>
        ))}
        {annonces.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">
            <Megaphone className="mx-auto mb-2 h-6 w-6 text-neutral-300" /> Aucune annonce.
          </p>
        )}
      </div>

      {modal && (
        <Modale titre="Nouvelle annonce" onClose={() => setModal(false)} large>
          <form action={creer} className="space-y-4">
            <Champ name="titre" label="Titre" required />
            <div>
              <label className="text-sm font-medium text-neutral-700">Contenu</label>
              <textarea name="contenu" required rows={5} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">Destinataires</label>
              <div className="mt-1 flex gap-4">
                {ROLES.map((r) => (
                  <label key={r.v} className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" name="rolesVises" value={r.v} className="h-4 w-4" /> {r.l}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" name="publier" defaultChecked className="h-4 w-4" /> Publier immédiatement
            </label>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Créer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
