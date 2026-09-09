"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Save, Loader2, ChevronRight, ChevronLeft, Info, AlertTriangle } from "lucide-react";
import type { ClasseOptionDTO } from "@/server/dal/classes";
import { actionInscrireEleveComplet, type ActionResult } from "@/server/actions/eleves";
import { FilParcours, ETAPES_INSCRIPTION } from "@/components/portal/FilParcours";

const champ =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

type Resultat = {
  eleveId: string;
  matricule: string;
  frais: { id: string; libelle: string; montantDu: number }[];
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Créer et passer au paiement
    </button>
  );
}

export function NouvelleInscriptionForm({ classes }: { classes: ClasseOptionDTO[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [classeId, setClasseId] = useState("");
  const classeChoisie = classes.find((c) => c.id === classeId);

  const [state, formAction] = useActionState<ActionResult<Resultat> | null, FormData>(
    async (_p, fd) => actionInscrireEleveComplet(fd),
    null,
  );

  useEffect(() => {
    if (state?.succes) {
      router.push(`/portail/eleves/${state.data.eleveId}/finaliser`);
    }
  }, [state, router]);

  const suivant = () => {
    if (!formRef.current?.reportValidity()) return;
    setStep(2);
  };

  if (classes.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Aucune classe pour l&rsquo;année en cours. Créez d&rsquo;abord des classes.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
      <div className="mb-6">
        <Link href="/portail/eleves" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Retour à la liste des élèves
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-500/20">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          Nouvelle inscription
        </h1>
      </div>

      <FilParcours etapes={ETAPES_INSCRIPTION} courant={0} />

      <form ref={formRef} action={formAction} className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        {/* ÉTAPE 1 — Élève */}
        <div className={step === 1 ? "space-y-6" : "hidden"}>
          <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3">Informations de l&rsquo;élève</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Nom de famille</label><input name="nom" required className={champ} /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Prénom(s)</label><input name="prenom" required className={champ} /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Date de naissance</label><input type="date" name="dateNaissance" className={champ} /></div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Sexe</label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sexe" value="M" className="h-4 w-4 text-blue-600" /><span className="text-sm text-neutral-700">Masculin</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sexe" value="F" className="h-4 w-4 text-blue-600" /><span className="text-sm text-neutral-700">Féminin</span></label>
              </div>
            </div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Lieu de naissance</label><input name="lieuNaissance" className={champ} /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Nationalité</label><input name="nationalite" defaultValue="Guinéenne" className={champ} /></div>
            <div className="space-y-2 sm:col-span-2"><label className="text-sm font-semibold text-neutral-700">Adresse</label><input name="adresse" placeholder="Quartier, commune…" className={champ} /></div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-700">Classe d&rsquo;affectation</label>
              <select
                name="classeId"
                required
                value={classeId}
                onChange={(e) => setClasseId(e.target.value)}
                className={champ}
              >
                <option value="" disabled>Choisir une classe…</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} — {c.niveau}
                    {!c.aFrais ? " (aucun frais configuré)" : ""}
                  </option>
                ))}
              </select>
              {classeChoisie && !classeChoisie.aFrais && (
                <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertTriangle className="h-4 w-4 flex-none mt-0.5" />
                  Aucune échéance (frais de scolarité/inscription) n&rsquo;est configurée pour le niveau{" "}
                  <strong>{classeChoisie.niveau}</strong>. L&rsquo;élève sera inscrit sans frais à
                  payer. Configurez-les dans{" "}
                  <Link href="/portail/echeances" className="underline hover:text-amber-900" target="_blank">
                    Échéances &amp; Frais
                  </Link>{" "}
                  puis générez-les rétroactivement si besoin.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end border-t border-neutral-100 pt-5">
            <button type="button" onClick={suivant} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition">
              Suivant : Tuteur <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ÉTAPE 2 — Tuteur */}
        <div className={step === 2 ? "space-y-6" : "hidden"}>
          <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3">Responsable légal / Tuteur</h2>
          <p className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
            <Info className="h-4 w-4 flex-none mt-0.5" /> Renseigné = le tuteur est enregistré et lié à l&rsquo;élève. Laisser vide pour compléter plus tard.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Prénom du tuteur</label><input name="tuteurPrenom" className={champ} /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Nom du tuteur</label><input name="tuteurNom" className={champ} /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Téléphone</label><input name="tuteurTelephone" type="tel" placeholder="+224 …" className={champ} /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-neutral-700">Email (optionnel)</label><input name="tuteurEmail" type="email" className={champ} /></div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Lien de parenté</label>
              <select name="tuteurLien" defaultValue="pere" className={champ}>
                <option value="pere">Père</option>
                <option value="mere">Mère</option>
                <option value="tuteur">Tuteur / tutrice</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          {state && !state.succes && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{state.erreur}</p>
          )}

          <div className="flex items-center justify-between border-t border-neutral-100 pt-5">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100">
              <ChevronLeft className="h-4 w-4" /> Retour
            </button>
            <SubmitBtn />
          </div>
        </div>
      </form>
    </main>
  );
}
