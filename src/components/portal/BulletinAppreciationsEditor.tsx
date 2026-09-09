"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquareText, Loader2, ChevronDown } from "lucide-react";
import { actionMajAppreciationsBulletin } from "@/server/actions/bulletins";
import { MENTIONS } from "@/lib/bulletin";

interface MatiereAppr {
  matiereId: string;
  matiere: string;
  appreciation: string | null;
  coefficient: number;
  moyenne: number | null;
}

export function BulletinAppreciationsEditor({
  bulletinId,
  mentionAuto,
  mentionManuelle,
  mentionActuelle,
  appreciationGenerale,
  matieres,
}: {
  bulletinId: string;
  mentionAuto: string;
  mentionManuelle: boolean;
  mentionActuelle: string;
  appreciationGenerale: string | null;
  matieres: MatiereAppr[];
}) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [mention, setMention] = useState(mentionManuelle ? mentionActuelle : "");
  const [generale, setGenerale] = useState(appreciationGenerale ?? "");
  const [parMat, setParMat] = useState<Record<string, string>>(
    Object.fromEntries(matieres.map((m) => [m.matiereId, m.appreciation ?? ""])),
  );

  const enregistrer = () => {
    startTransition(async () => {
      const r = await actionMajAppreciationsBulletin(bulletinId, {
        appreciation: generale,
        mention: mention || null,
        parMatiere: matieres.map((m) => ({
          matiereId: m.matiereId,
          appreciation: parMat[m.matiereId] ?? "",
          coefficient: m.coefficient,
          moyenne: m.moyenne,
        })),
      });
      if (!r.succes) toast.error(r.erreur);
      else {
        toast.success("Appréciations enregistrées");
        router.refresh();
      }
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white print:hidden">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold text-navy-900">
          <MessageSquareText className="h-4 w-4" /> Appréciations & mention
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition ${ouvert ? "rotate-180" : ""}`} />
      </button>

      {ouvert && (
        <div className="space-y-5 border-t border-neutral-100 p-5">
          {/* Mention */}
          <div>
            <label className="text-sm font-medium text-neutral-700">Mention</label>
            <select
              value={mention}
              onChange={(e) => setMention(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="">Automatique ({mentionAuto})</option>
              {MENTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Appréciation générale */}
          <div>
            <label className="text-sm font-medium text-neutral-700">Appréciation générale</label>
            <textarea
              value={generale}
              onChange={(e) => setGenerale(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Commentaire du conseil de classe…"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Par matière */}
          {matieres.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-700">Appréciation par matière</p>
              {matieres.map((m) => (
                <div key={m.matiereId} className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <span className="truncate text-xs font-semibold text-neutral-600">{m.matiere}</span>
                  <input
                    value={parMat[m.matiereId] ?? ""}
                    onChange={(e) =>
                      setParMat((p) => ({ ...p, [m.matiereId]: e.target.value }))
                    }
                    maxLength={500}
                    placeholder="—"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={enregistrer}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer les appréciations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
