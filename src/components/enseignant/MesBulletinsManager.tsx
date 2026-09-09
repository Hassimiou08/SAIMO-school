"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, FileText, Loader2 } from "lucide-react";
import { actionGenererBulletins } from "@/server/actions/bulletins";
import type { MonBulletinLigne } from "@/server/dal/enseignant";

interface Opt {
  id: string;
  nom: string;
}

export function MesBulletinsManager({
  bulletins,
  classes,
  periodes,
  classeSel,
  periodeSel,
}: {
  bulletins: MonBulletinLigne[];
  classes: Opt[];
  periodes: Opt[];
  classeSel?: string;
  periodeSel?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const nav = (k: string, v: string) => {
    const sp = new URLSearchParams(window.location.search);
    if (v) sp.set(k, v);
    else sp.delete(k);
    router.push(`/enseignant/bulletins?${sp.toString()}`);
  };

  const generer = () => {
    if (!classeSel || !periodeSel) {
      toast.error("Choisissez une classe et une période.");
      return;
    }
    setMsg("");
    startTransition(async () => {
      const r = await actionGenererBulletins(classeSel, periodeSel);
      if (r.succes) {
        setMsg(`${r.data.nombre} bulletin(s) généré(s).`);
        toast.success(`${r.data.nombre} bulletin(s) généré(s).`);
        router.refresh();
      } else {
        setMsg(r.erreur);
        toast.error(r.erreur);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-5">
        <select
          value={classeSel ?? ""}
          onChange={(e) => nav("classe", e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400"
        >
          <option value="">Toutes mes classes P.P.</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
        <select
          value={periodeSel ?? ""}
          onChange={(e) => nav("periode", e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400"
        >
          <option value="">Toutes les périodes</option>
          {periodes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
        <button
          onClick={generer}
          disabled={isPending}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Générer (classe + période)
        </button>
      </div>

      {msg && (
        <p className="border-b border-neutral-100 bg-blue-50 px-5 py-2 text-xs font-medium text-blue-700">
          {msg}
        </p>
      )}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Élève</th>
            <th className="px-5 py-3">Classe</th>
            <th className="px-5 py-3">Période</th>
            <th className="px-5 py-3">Moyenne</th>
            <th className="px-5 py-3">Rang</th>
            <th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {bulletins.map((b) => (
            <tr key={b.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3 font-medium text-neutral-800">{b.eleve}</td>
              <td className="px-5 py-3 text-neutral-600">{b.classe}</td>
              <td className="px-5 py-3 text-neutral-500">{b.periode}</td>
              <td className="px-5 py-3 font-mono">
                {b.moyenne != null ? `${b.moyenne.toFixed(2)}/20` : "—"}
              </td>
              <td className="px-5 py-3">
                {b.rang != null ? `${b.rang}/${b.effectif ?? "?"}` : "—"}
              </td>
              <td className="px-5 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    b.statut === "publie"
                      ? "bg-green-100 text-green-600"
                      : b.statut === "valide"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {b.statut === "publie" ? "Publié" : b.statut === "valide" ? "Validé" : "Brouillon"}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => router.push(`/enseignant/bulletins/${b.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <FileText className="h-3.5 w-3.5" /> Ouvrir
                </button>
              </td>
            </tr>
          ))}
          {bulletins.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-neutral-500">
                Aucun bulletin. Sélectionnez une classe + une période et cliquez « Générer ».
                <br />
                La validation et la publication sont faites par l&rsquo;administration.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
