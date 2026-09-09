import { Check } from "lucide-react";

export const ETAPES_INSCRIPTION = ["Dossier", "Classe", "Paiement", "Terminé"];
export const ETAPES_RECRUTEMENT = ["Compte", "Affectations", "Emploi du temps", "Terminé"];

export function FilParcours({
  etapes,
  courant,
}: {
  etapes: string[];
  courant: number;
}) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-2 text-xs">
      {etapes.map((label, i) => {
        const fait = i < courant;
        const actif = i === courant;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold ${
                fait
                  ? "border-blue-600 bg-blue-600 text-white"
                  : actif
                    ? "border-blue-600 text-blue-700"
                    : "border-neutral-300 text-neutral-400"
              }`}
            >
              {fait ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={`font-semibold ${actif ? "text-navy-900" : fait ? "text-blue-700" : "text-neutral-400"}`}>
              {label}
            </span>
            {i < etapes.length - 1 && (
              <span className={`mx-1 h-px w-6 ${i < courant ? "bg-blue-600" : "bg-neutral-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
