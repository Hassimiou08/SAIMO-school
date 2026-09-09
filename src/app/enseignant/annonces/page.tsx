import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { listerAnnonces } from "@/server/dal/admin";

export const metadata: Metadata = { title: "Annonces — Enseignant SAIMO" };

export default async function AnnoncesEnseignantPage() {
  const annonces = (await listerAnnonces()).filter((a) => a.publie);

  return (
    <EnseignantShell titre="Annonces" sous="Communications de l'administration.">
      {annonces.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          <Megaphone className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
          Aucune annonce pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {annonces.map((a) => (
            <li key={a.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-navy-900">{a.titre}</h2>
                {a.datePublication && (
                  <span className="text-xs text-neutral-400">{a.datePublication}</span>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{a.contenu}</p>
              {a.auteur && (
                <p className="mt-3 text-xs text-neutral-400">— {a.auteur}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </EnseignantShell>
  );
}
