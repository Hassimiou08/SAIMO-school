"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Clock, CalendarRange, Pencil, CheckCircle2 } from "lucide-react";
import type { CreneauDTO, ClasseOption, MatiereOption, EnseignantOption } from "@/server/dal/pedagogie";
import {
  actionCreerCreneau,
  actionModifierCreneau,
  actionSupprimerCreneau,
} from "@/server/actions/pedagogie";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { FilParcours, ETAPES_RECRUTEMENT } from "@/components/portal/FilParcours";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const HEURES = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const PALETTE = [
  "bg-blue-50 border-blue-200 text-blue-900",
  "bg-orange-50 border-orange-200 text-orange-900",
  "bg-emerald-50 border-emerald-200 text-emerald-900",
  "bg-violet-50 border-violet-200 text-violet-900",
  "bg-rose-50 border-rose-200 text-rose-900",
  "bg-amber-50 border-amber-200 text-amber-900",
  "bg-teal-50 border-teal-200 text-teal-900",
  "bg-indigo-50 border-indigo-200 text-indigo-900",
];

const toMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + (b || 0);
};
const rowStart = (h: string) => {
  const m = toMin(h);
  let idx = 0;
  for (let i = 0; i < HEURES.length; i++) if (toMin(HEURES[i]) <= m) idx = i;
  return idx;
};

type ModalState = null | "new" | CreneauDTO;

export function EmploiDuTempsManager({
  creneaux,
  classes,
  matieres,
  enseignants,
  enseignantContexte,
}: {
  creneaux: CreneauDTO[];
  classes: ClasseOption[];
  matieres: MatiereOption[];
  enseignants: EnseignantOption[];
  enseignantContexte?: { id: string; nom: string } | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filtreClasse, setFiltreClasse] = useState("Toutes");
  const [modal, setModal] = useState<ModalState>(null);
  const [erreur, setErreur] = useState("");
  const [classeSel, setClasseSel] = useState("");
  const [matiereSel, setMatiereSel] = useState("");

  const edition = modal && modal !== "new" ? modal : null;

  const filtered = filtreClasse === "Toutes" ? creneaux : creneaux.filter((c) => c.classe === filtreClasse);

  const classeParId = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);
  const matiereParId = useMemo(() => new Map(matieres.map((m) => [m.id, m])), [matieres]);

  // Matière sans MatiereNiveau configuré = visible partout (pas de filtre fiable).
  const matieresFiltrees = useMemo(() => {
    const c = classeSel ? classeParId.get(classeSel) : null;
    if (!c) return matieres;
    return matieres.filter((m) => m.niveauIds.length === 0 || m.niveauIds.includes(c.niveauId));
  }, [matieres, classeSel, classeParId]);

  const classesFiltrees = useMemo(() => {
    const m = matiereSel ? matiereParId.get(matiereSel) : null;
    if (!m || m.niveauIds.length === 0) return classes;
    return classes.filter((c) => m.niveauIds.includes(c.niveauId));
  }, [classes, matiereSel, matiereParId]);

  const ouvrirNouveau = () => {
    setErreur("");
    setClasseSel("");
    setMatiereSel("");
    setModal("new");
  };
  const ouvrirEdition = (c: CreneauDTO) => {
    setErreur("");
    setClasseSel(c.classeId);
    setMatiereSel(c.matiereId);
    setModal(c);
  };

  const couleurClasse = useMemo(() => {
    const noms = [...new Set(creneaux.map((c) => c.classe))].sort();
    const map = new Map<string, string>();
    noms.forEach((n, i) => map.set(n, PALETTE[i % PALETTE.length]));
    return map;
  }, [creneaux]);

  const soumettre = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = edition
        ? await actionModifierCreneau(edition.id, fd)
        : await actionCreerCreneau(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(null); router.refresh(); }
    });
  };
  const retirer = (id: string) =>
    startTransition(async () => {
      const r = await actionSupprimerCreneau(id);
      if (!r.succes) toast.error(r.erreur);
      else { setModal(null); router.refresh(); }
    });

  return (
    <div className={isPending ? "opacity-70" : ""}>
      {enseignantContexte && (
        <>
          <FilParcours etapes={ETAPES_RECRUTEMENT} courant={2} />
          <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
            <span>Placez les cours de <strong>{enseignantContexte.nom}</strong> dans la grille.</span>
            <Link
              href={`/portail/enseignants/${enseignantContexte.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Terminer →
            </Link>
          </div>
        </>
      )}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <select value={filtreClasse} onChange={(e) => setFiltreClasse(e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2 px-3 text-sm font-medium text-neutral-700 outline-none focus:border-blue-400">
          <option>Toutes</option>
          {classes.map((c) => (<option key={c.id}>{c.nom}</option>))}
        </select>
        <button onClick={ouvrirNouveau} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Ajouter un créneau
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          <CalendarRange className="mx-auto mb-2 h-7 w-7 text-neutral-300" />
          Aucun cours programmé. Ajoutez les créneaux de la semaine.
        </p>
      ) : (
        <>
          <p className="mb-2 text-xs text-neutral-400">Cliquez sur un cours pour le modifier.</p>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <div
              className="grid min-w-[820px]"
              style={{
                gridTemplateColumns: `64px repeat(${JOURS.length}, minmax(0,1fr))`,
                gridTemplateRows: `40px repeat(${HEURES.length}, 56px)`,
              }}
            >
              <div className="border-b border-r border-neutral-100 bg-neutral-50" />
              {JOURS.map((j) => (
                <div key={j} className="flex items-center justify-center border-b border-r border-neutral-100 bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {j}
                </div>
              ))}
              {HEURES.map((h, ri) => (
                <FragmentRow key={h} h={h} ri={ri} />
              ))}
              {filtered.map((c) => {
                const r = rowStart(c.heureDebut);
                const durMin = Math.max(60, toMin(c.heureFin) - toMin(c.heureDebut));
                const span = Math.max(1, Math.round(durMin / 60));
                const couleur = couleurClasse.get(c.classe) ?? PALETTE[0];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => ouvrirEdition(c)}
                    style={{ gridColumn: c.jour + 1, gridRow: `${r + 2} / span ${span}` }}
                    className={`group relative m-1 flex flex-col justify-between rounded-lg border p-2 text-left text-[11px] leading-tight transition hover:brightness-95 ${couleur}`}
                  >
                    <div>
                      <p className="font-bold">{c.matiere}</p>
                      {filtreClasse === "Toutes" && <p className="opacity-70">{c.classe}</p>}
                      {c.enseignant && <p className="opacity-70">{c.enseignant}</p>}
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 font-mono opacity-60">
                      <Clock className="h-2.5 w-2.5" />{c.heureDebut}–{c.heureFin}{c.salle ? ` · ${c.salle}` : ""}
                    </p>
                    <span className="absolute right-1 top-1 hidden rounded bg-white/70 p-0.5 text-neutral-500 group-hover:block">
                      <Pencil className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {modal && (
        <Modale titre={edition ? "Modifier le créneau" : "Ajouter un créneau"} onClose={() => setModal(null)}>
          <form action={soumettre} className="space-y-4">
            <Selecteur
              name="classeId"
              label="Classe"
              required
              value={classeSel}
              onChange={(e) => setClasseSel(e.target.value)}
            >
              <option value="" disabled>Choisir…</option>
              {classesFiltrees.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
            </Selecteur>
            <Selecteur
              name="matiereId"
              label="Matière"
              required
              value={matiereSel}
              onChange={(e) => setMatiereSel(e.target.value)}
            >
              <option value="" disabled>Choisir…</option>
              {matieresFiltrees.map((m) => (<option key={m.id} value={m.id}>{m.nom}</option>))}
            </Selecteur>
            <Selecteur name="enseignantId" label="Enseignant (optionnel)" defaultValue={edition?.enseignantId ?? enseignantContexte?.id ?? ""}>
              <option value="">—</option>
              {enseignants.map((e) => (<option key={e.id} value={e.id}>{e.nom}</option>))}
            </Selecteur>
            <Selecteur name="jour" label="Jour" required defaultValue={String(edition?.jour ?? 1)}>
              {JOURS.map((j, i) => (<option key={j} value={i + 1}>{j}</option>))}
            </Selecteur>
            <div className="grid grid-cols-3 gap-3">
              <Champ name="heureDebut" label="Début" type="time" defaultValue={edition?.heureDebut ?? "08:00"} required />
              <Champ name="heureFin" label="Fin" type="time" defaultValue={edition?.heureFin ?? "09:00"} required />
              <Champ name="salle" label="Salle" defaultValue={edition?.salle ?? ""} placeholder="B12" />
            </div>
            {erreur && <Err msg={erreur} />}
            <div className="flex items-center justify-between pt-1">
              {edition ? (
                <button type="button" onClick={() => retirer(edition.id)} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              ) : <span />}
              <ModalActions pending={isPending} onCancel={() => setModal(null)} label={edition ? "Enregistrer" : "Ajouter"} />
            </div>
          </form>
        </Modale>
      )}
    </div>
  );
}

function FragmentRow({ h, ri }: { h: string; ri: number }) {
  return (
    <>
      <div
        style={{ gridColumn: 1, gridRow: ri + 2 }}
        className="flex items-start justify-end border-r border-neutral-100 pr-2 pt-1 text-[10px] font-mono text-neutral-400"
      >
        {h}
      </div>
      {JOURS.map((_, ci) => (
        <div key={ci} style={{ gridColumn: ci + 2, gridRow: ri + 2 }} className="border-b border-r border-neutral-100" />
      ))}
    </>
  );
}
