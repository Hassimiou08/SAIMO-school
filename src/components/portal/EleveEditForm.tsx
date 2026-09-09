"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2 } from "lucide-react";
import type { EleveDetailDTO } from "@/server/dal/eleves";
import { actionModifierEleve, type ActionResult } from "@/server/actions/eleves";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Enregistrer les modifications
    </button>
  );
}

const champ =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

export function EleveEditForm({ eleve }: { eleve: EleveDetailDTO }) {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => actionModifierEleve(eleve.id, formData),
    null,
  );

  useEffect(() => {
    if (state?.succes) router.push(`/portail/eleves/${eleve.id}`);
  }, [state, eleve.id, router]);

  return (
    <form action={formAction} className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
          Informations de l&rsquo;élève
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Nom de famille</label>
            <input name="nom" required defaultValue={eleve.lastName} className={champ} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Prénom(s)</label>
            <input name="prenom" required defaultValue={eleve.firstName} className={champ} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Date de naissance</label>
            <input
              type="date"
              name="dateNaissance"
              defaultValue={eleve.dateNaissanceISO ?? ""}
              className={champ}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Lieu de naissance</label>
            <input name="lieuNaissance" defaultValue={eleve.lieuNaissance ?? ""} className={champ} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Sexe</label>
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sexe" value="M" defaultChecked={eleve.sexe === "M"} className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-neutral-700">Masculin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sexe" value="F" defaultChecked={eleve.sexe === "F"} className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-neutral-700">Féminin</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Nationalité</label>
            <input name="nationalite" defaultValue={eleve.nationalite ?? ""} className={champ} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-neutral-700">Adresse</label>
            <input name="adresse" defaultValue={eleve.adresse ?? ""} className={champ} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
          Scolarité
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-neutral-500">Matricule</p>
            <p className="font-mono font-bold text-navy-900">{eleve.matricule}</p>
          </div>
          <div>
            <p className="text-neutral-500">Classe</p>
            <p className="font-semibold text-navy-900">{eleve.classe}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          Le changement de classe se fait via une réinscription, pas ici.
        </p>
      </section>

      {state && !state.succes && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {state.erreur}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-100 pt-6">
        <Link
          href={`/portail/eleves/${eleve.id}`}
          className="px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition"
        >
          Annuler
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
