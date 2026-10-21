"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MessageSquare, Send } from "lucide-react";

const CHAMP =
  "w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[var(--ec-primary,#1B6FD1)] outline-none transition-all text-sm";
const LIBELLE = "text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1";

const SUJETS = [
  "Demande d'admission",
  "Informations sur la scolarité",
  "Frais et paiements",
  "Rendez-vous avec l'administration",
  "Autre",
];

/**
 * Formulaire de contact : le message est transmis par e-mail à l'école
 * (`ecole` = adresse de son site) ou, sans école, à l'équipe SAIMO.
 */
export function FormulaireContact({ ecole }: { ecole?: string }) {
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye">("saisie");
  const [erreur, setErreur] = useState("");

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreur("");
    const fd = new FormData(e.currentTarget);
    const val = (k: string) => String(fd.get(k) ?? "").trim();
    setEtat("envoi");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ecole,
          prenom: val("prenom"),
          nom: val("nom"),
          email: val("email"),
          telephone: val("telephone") || undefined,
          sujet: val("sujet"),
          message: val("message"),
          siteWeb: val("siteWeb") || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErreur(data.erreur ?? "Votre message n'a pas pu être envoyé. Réessayez.");
        setEtat("saisie");
        return;
      }
      setEtat("envoye");
    } catch {
      setErreur("Erreur réseau : vérifiez votre connexion puis réessayez.");
      setEtat("saisie");
    }
  };

  if (etat === "envoye") {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center py-10 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="mb-3 font-display text-3xl font-bold text-navy-900">Message envoyé !</h2>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-slate-600">
          Merci de nous avoir écrit. Nous vous répondrons dans les meilleurs délais à l&apos;adresse indiquée.
        </p>
        <button
          type="button"
          onClick={() => setEtat("saisie")}
          className="rounded-xl border border-neutral-200 bg-paper-50 px-8 py-3 font-bold text-navy-900 transition-colors hover:bg-neutral-100"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} className="flex h-full flex-col justify-center">
      <div className="mb-8">
        <h2 className="mb-2 flex items-center gap-2 font-display text-2xl font-bold text-navy-900 md:text-3xl">
          Envoyez-nous un message <MessageSquare className="h-6 w-6 text-[var(--ec-primary,#1B6FD1)]" />
        </h2>
        <p className="text-sm text-slate-500">Remplissez le formulaire ci-dessous, nous vous recontacterons rapidement.</p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="ct-prenom" className={LIBELLE}>Prénom <span className="text-red-500">*</span></label>
            <input id="ct-prenom" name="prenom" required maxLength={80} placeholder="Votre prénom" className={CHAMP} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ct-nom" className={LIBELLE}>Nom <span className="text-red-500">*</span></label>
            <input id="ct-nom" name="nom" required maxLength={80} placeholder="Votre nom" className={CHAMP} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="ct-email" className={LIBELLE}>E-mail <span className="text-red-500">*</span></label>
            <input id="ct-email" name="email" type="email" required placeholder="adresse@email.com" className={CHAMP} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ct-tel" className={LIBELLE}>Téléphone</label>
            <input id="ct-tel" name="telephone" type="tel" maxLength={30} placeholder="6XX XX XX XX" className={CHAMP} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ct-sujet" className={LIBELLE}>Sujet <span className="text-red-500">*</span></label>
          <select id="ct-sujet" name="sujet" required defaultValue="" className={`${CHAMP} text-slate-700`}>
            <option value="" disabled>Sélectionnez un sujet</option>
            {SUJETS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ct-message" className={LIBELLE}>Votre message <span className="text-red-500">*</span></label>
          <textarea id="ct-message" name="message" required minLength={5} maxLength={5000} rows={5} placeholder="Comment pouvons-nous vous aider ?" className={`${CHAMP} resize-none`} />
        </div>

        {/* Champ piège anti-robots, invisible pour les visiteurs */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="ct-site">Ne pas remplir</label>
          <input id="ct-site" name="siteWeb" tabIndex={-1} autoComplete="off" />
        </div>

        {erreur && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={etat === "envoi"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ec-primary,#1B6FD1)] px-8 py-4 font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-60"
        >
          {etat === "envoi" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {etat === "envoi" ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </div>
    </form>
  );
}
