"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, UserCheck, UserX, CheckCircle2 } from "lucide-react";
import type { UtilisateurDTO } from "@/server/dal/admin";
import { actionCreerUtilisateur, actionBasculerUtilisateur } from "@/server/actions/admin";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";

const ROLES = [
  { v: "DIRECTEUR", l: "Direction" },
  { v: "SECRETAIRE", l: "Secrétariat" },
  { v: "COMPTABLE", l: "Comptabilité" },
  { v: "ENSEIGNANT", l: "Enseignant" },
  { v: "PROF_PRINCIPAL", l: "Professeur principal" },
  { v: "ADMIN_ETABLISSEMENT", l: "Administrateur" },
];

export function UtilisateursManager({ utilisateurs }: { utilisateurs: UtilisateurDTO[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState("");

  const filtered = useMemo(
    () => utilisateurs.filter((u) => `${u.nom} ${u.email} ${u.roleLibelle}`.toLowerCase().includes(query.toLowerCase())),
    [utilisateurs, query],
  );

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerUtilisateur(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(false); setOk(`Compte créé — mot de passe provisoire : ${r.data.motDePasse}`); router.refresh(); }
    });
  };
  const basculer = (id: string) =>
    startTransition(async () => {
      const r = await actionBasculerUtilisateur(id);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });

  return (
    <div className="space-y-4">
      {ok && <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CheckCircle2 className="mr-1.5 inline h-4 w-4" />{ok}</p>}
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, email, rôle..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 transition" />
          </div>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition">
            <Plus className="h-4 w-4" /> Nouvel utilisateur
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
              <th className="px-5 py-3">Nom</th><th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rôle</th><th className="px-5 py-3">Dernière connexion</th>
              <th className="px-5 py-3">Statut</th><th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50/60">
                <td className="px-5 py-3 font-medium text-neutral-800">{u.nom}</td>
                <td className="px-5 py-3 text-neutral-600">{u.email}</td>
                <td className="px-5 py-3"><span className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{u.roleLibelle}</span></td>
                <td className="px-5 py-3 text-xs text-neutral-500">{u.derniereConnexion ?? "jamais"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${u.actif ? "bg-green-100 text-green-600" : "bg-neutral-200 text-neutral-500"}`}>{u.actif ? "Actif" : "Désactivé"}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => basculer(u.id)} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                    {u.actif ? <><UserX className="h-3.5 w-3.5" /> Désactiver</> : <><UserCheck className="h-3.5 w-3.5" /> Activer</>}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">Aucun utilisateur.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modale titre="Nouvel utilisateur" onClose={() => setModal(false)}>
          <form action={creer} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Champ name="prenom" label="Prénom" required />
              <Champ name="nom" label="Nom" required />
            </div>
            <Champ name="email" label="Email" type="email" required />
            <Champ name="telephone" label="Téléphone" />
            <Selecteur name="role" label="Rôle" required defaultValue="SECRETAIRE">
              {ROLES.map((r) => (<option key={r.v} value={r.v}>{r.l}</option>))}
            </Selecteur>
            <p className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-xs text-blue-800">Mot de passe provisoire : <code>Bienvenue123!</code></p>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Créer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
