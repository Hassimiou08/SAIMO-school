"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Save, Loader2, CheckCircle2 } from "lucide-react";
import { actionCreerEnseignant } from "@/server/actions/pedagogie";
import type { ActionResult } from "@/server/actions/eleves";

const champ =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Créer l&rsquo;enseignant
    </button>
  );
}

export function NouvelEnseignantForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<
    ActionResult<{ id: string; motDePasse: string }> | null,
    FormData
  >(async (_p, fd) => actionCreerEnseignant(fd), null);
  const [done, setDone] = useState<{ id: string; mdp: string } | null>(null);

  useEffect(() => {
    if (state?.succes) setDone({ id: state.data.id, mdp: state.data.motDePasse });
  }, [state]);

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
        <p className="mt-3 font-bold text-green-800">Enseignant créé.</p>
        <p className="mt-1 text-sm text-green-700">
          Mot de passe provisoire : <code className="rounded bg-white px-2 py-0.5 font-mono">{done.mdp}</code> — à communiquer à l&rsquo;enseignant.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button onClick={() => router.push(`/portail/enseignants/${done.id}/affecter`)} className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            Affecter des cours →
          </button>
          <button onClick={() => router.push(`/portail/enseignants/${done.id}`)} className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">Voir la fiche</button>
          <button onClick={() => { setDone(null); router.refresh(); }} className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">En ajouter un autre</button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Prénom</label>
          <input name="prenom" required className={champ} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Nom</label>
          <input name="nom" required className={champ} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Email professionnel</label>
          <input type="email" name="email" required placeholder="prenom.nom@saimo.gn" className={champ} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Téléphone</label>
          <input name="telephone" className={champ} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-semibold text-neutral-700">Spécialité</label>
          <input name="specialite" placeholder="Ex : Mathématiques" className={champ} />
        </div>
      </div>

      <p className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
        Un compte est créé avec le rôle <strong>Enseignant</strong> et un mot de passe provisoire.
        Les matières et classes s&rsquo;attribuent ensuite via les <strong>Affectations</strong>.
      </p>

      {state && !state.succes && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{state.erreur}</p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-100 pt-6">
        <Link href="/portail/enseignants" className="px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition">Annuler</Link>
        <SubmitButton />
      </div>
    </form>
  );
}
