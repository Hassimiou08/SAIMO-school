"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Check, X, UserPlus, CheckCircle2, AlertTriangle } from "lucide-react";
import type { PreInscriptionDTO, StatsPreInscriptions } from "@/server/dal/preinscriptions";
import type { ClasseOption } from "@/server/dal/pedagogie";
import {
  actionMarquerPreInscription,
  actionConvertirPreInscription,
} from "@/server/actions/preinscriptions";
import { Modale, Selecteur, Err, ModalActions } from "@/components/portal/_ui";

const FILTRES = [
  { v: "", l: "Toutes" },
  { v: "nouvelle", l: "Nouvelles" },
  { v: "contactee", l: "Contactées" },
  { v: "acceptee", l: "Acceptées" },
  { v: "convertie", l: "Converties" },
  { v: "refusee", l: "Refusées" },
];

const BADGE: Record<string, string> = {
  nouvelle: "bg-blue-100 text-blue-700",
  contactee: "bg-amber-100 text-amber-700",
  acceptee: "bg-green-100 text-green-700",
  convertie: "bg-navy-950 text-white",
  refusee: "bg-red-100 text-red-600",
};

export function PreInscriptionsManager({
  demandes,
  stats,
  classes,
  classesSansFrais = [],
  filtre,
}: {
  demandes: PreInscriptionDTO[];
  stats: StatsPreInscriptions;
  classes: ClasseOption[];
  classesSansFrais?: string[];
  filtre?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [convertir, setConvertir] = useState<PreInscriptionDTO | null>(null);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState("");
  const [classeChoisieId, setClasseChoisieId] = useState("");

  const marquer = (id: string, statut: "contactee" | "acceptee" | "refusee") =>
    startTransition(async () => {
      const r = await actionMarquerPreInscription(id, statut);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });

  const faireConversion = (fd: FormData) => {
    if (!convertir) return;
    setErreur("");
    startTransition(async () => {
      const r = await actionConvertirPreInscription(convertir.id, String(fd.get("classeId")));
      if (!r.succes) setErreur(r.erreur);
      else {
        setConvertir(null);
        router.push(`/portail/eleves/${r.data.eleveId}/finaliser`);
      }
    });
  };

  const cartes = [
    { l: "Nouvelles", v: stats.nouvelle },
    { l: "Contactées", v: stats.contactee },
    { l: "Acceptées", v: stats.acceptee },
    { l: "Converties", v: stats.convertie },
  ];

  return (
    <div className="space-y-5">
      {ok && <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CheckCircle2 className="mr-1.5 inline h-4 w-4" />{ok}</p>}

      <div className="grid gap-4 sm:grid-cols-4">
        {cartes.map((c) => (
          <div key={c.l} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="font-display text-2xl font-black text-neutral-900">{c.v}</p>
            <p className="mt-0.5 text-sm text-neutral-500">{c.l}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex gap-1 border-b border-neutral-100 p-4">
          {FILTRES.map((f) => (
            <button
              key={f.v}
              onClick={() => router.push(f.v ? `/portail/preinscriptions?statut=${f.v}` : "/portail/preinscriptions")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${(filtre ?? "") === f.v ? "bg-navy-950 text-white" : "text-neutral-500 hover:bg-neutral-100"}`}
            >
              {f.l}
            </button>
          ))}
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
              <th className="px-5 py-3">Réf.</th><th className="px-5 py-3">Élève</th>
              <th className="px-5 py-3">Niveau</th><th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Reçu le</th><th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {demandes.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-50/60 align-top">
                <td className="px-5 py-3 font-mono text-xs text-neutral-500">{d.reference}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-neutral-800">{d.eleve}</p>
                  <p className="text-xs text-neutral-500">{d.sexe ?? "—"}{d.dateNaissance ? ` · ${d.dateNaissance}` : ""}</p>
                  {d.tuteur && <p className="text-xs text-neutral-400">Tuteur : {d.tuteur}</p>}
                  {d.message && <p className="mt-1 text-xs italic text-neutral-400">« {d.message} »</p>}
                </td>
                <td className="px-5 py-3 text-neutral-600">{d.niveau ?? "—"}</td>
                <td className="px-5 py-3 text-xs">
                  <p className="flex items-center gap-1 text-neutral-600"><Phone className="h-3 w-3" /> {d.telephone}</p>
                  {d.email && <p className="flex items-center gap-1 text-neutral-500"><Mail className="h-3 w-3" /> {d.email}</p>}
                </td>
                <td className="px-5 py-3 text-xs text-neutral-500">{d.date}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE[d.statut] ?? "bg-neutral-100"}`}>{d.statut}</span></td>
                <td className="px-5 py-3 text-right">
                  {d.statut === "convertie" ? (
                    <button onClick={() => d.eleveId && router.push(`/portail/eleves/${d.eleveId}`)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Voir l&rsquo;élève</button>
                  ) : d.statut === "refusee" ? (
                    <span className="text-xs text-neutral-400">—</span>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      {d.statut === "nouvelle" && (
                        <button onClick={() => marquer(d.id, "contactee")} disabled={isPending} className="text-xs font-semibold text-amber-600 hover:text-amber-800">Marquer contactée</button>
                      )}
                      {d.statut !== "acceptee" && (
                        <button onClick={() => marquer(d.id, "acceptee")} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-800"><Check className="h-3 w-3" /> Accepter</button>
                      )}
                      <button onClick={() => { setOk(""); setErreur(""); setClasseChoisieId(""); setConvertir(d); }} disabled={isPending} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"><UserPlus className="h-3 w-3" /> Traiter →</button>
                      <button onClick={() => marquer(d.id, "refusee")} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"><X className="h-3 w-3" /> Refuser</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {demandes.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-neutral-500">Aucune demande de pré-inscription.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {convertir && (
        <Modale titre={`Traiter la demande — ${convertir.eleve}`} onClose={() => setConvertir(null)}>
          <form action={faireConversion} className="space-y-4">
            <p className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800">
              Crée l&rsquo;élève (matricule généré), l&rsquo;inscription, le tuteur et les frais du niveau.
            </p>
            <Selecteur
              name="classeId"
              label="Classe d'affectation"
              required
              value={classeChoisieId}
              onChange={(e) => setClasseChoisieId(e.target.value)}
            >
              <option value="" disabled>Choisir…</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                  {classesSansFrais.includes(c.id) ? " (aucun frais configuré)" : ""}
                </option>
              ))}
            </Selecteur>
            {classeChoisieId && classesSansFrais.includes(classeChoisieId) && (
              <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <AlertTriangle className="h-4 w-4 flex-none mt-0.5" />
                Aucune échéance n&rsquo;est configurée pour le niveau de cette classe. L&rsquo;élève
                sera créé sans frais à payer. Configurez-les dans « Échéances &amp; Frais » puis
                utilisez « Générer » pour les rattraper.
              </p>
            )}
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setConvertir(null)} label="Créer l'élève →" />
          </form>
        </Modale>
      )}
    </div>
  );
}
