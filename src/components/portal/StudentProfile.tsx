"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  FileText,
  Printer,
  Pencil,
  CheckCircle2,
  XCircle,
  KeyRound,
  Loader2,
} from "lucide-react";
import type { EleveDetailDTO as Student } from "@/server/dal/eleves";
import { formatGNF } from "@/lib/format";
import { actionCreerAccesParent } from "@/server/actions/parents";

const tabs = ["Informations", "Résultats", "Absences", "Paiements"] as const;
type Tab = (typeof tabs)[number];

export function StudentProfile({ student }: { student: Student }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Informations");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".profile-header", { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" });
      gsap.from(".profile-tabbar", { opacity: 0, y: 10, duration: 0.4, delay: 0.1, ease: "power2.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tab-panel", { opacity: 0, y: 10, duration: 0.35, ease: "power2.out" });
    }, rootRef);
    return () => ctx.revert();
  }, [tab]);

  const moyennePonderee =
    student.resultats.reduce((sum, r) => sum + r.note * r.coefficient, 0) /
    (student.resultats.reduce((sum, r) => sum + r.coefficient, 0) || 1);

  return (
    <div ref={rootRef}>
      {/* En-tête */}
      <div className="profile-header rounded-2xl border border-navy-900/5 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-navy-950 font-display text-lg font-semibold text-teal-300">
              {student.firstName[0]}
              {student.lastName[0]}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-navy-900">
                  {student.firstName} {student.lastName}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    student.statut === "Actif"
                      ? "bg-teal-500/10 text-teal-600"
                      : "bg-ink-500/10 text-ink-500"
                  }`}
                >
                  {student.statut}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-ink-500">
                {student.matricule} — {student.classe}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 px-4 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-paper-100"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimer la fiche
            </button>
            <button
              onClick={() => router.push(`/portail/eleves/${student.id}/modifier`)}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier les infos
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-navy-900/5 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-500">Moyenne</p>
            <p className="mt-1 font-mono text-lg font-medium text-navy-900">
              {moyennePonderee.toFixed(1)}/20
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-500">Absences</p>
            <p className="mt-1 font-mono text-lg font-medium text-navy-900">
              {student.absences.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-500">Solde dû</p>
            <p
              className={`mt-1 font-mono text-lg font-medium ${
                student.soldeDu > 0 ? "text-gold-500" : "text-navy-900"
              }`}
            >
              {student.soldeDu > 0 ? formatGNF(student.soldeDu) : "À jour"}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-500">Inscrit depuis</p>
            <p className="mt-1 text-sm font-medium text-navy-900">{student.dateInscription}</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="profile-tabbar mt-6 flex gap-1 rounded-full border border-navy-900/5 bg-white p-1 sm:w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-navy-950 text-white"
                : "text-ink-500 hover:text-navy-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="tab-panel mt-6">
        {tab === "Informations" && <InformationsPanel student={student} />}
        {tab === "Résultats" && <ResultatsPanel student={student} />}
        {tab === "Absences" && <AbsencesPanel student={student} />}
        {tab === "Paiements" && <PaiementsPanel student={student} />}
      </div>
    </div>
  );
}

function InformationsPanel({ student }: { student: Student }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const creerAccesParent = () => {
    if (!student.parentId) return;
    startTransition(async () => {
      const r = await actionCreerAccesParent(student.parentId!, student.id);
      if (!r.succes) toast.error(r.erreur);
      else {
        toast.success(`Accès parent créé pour ${r.data.email} — identifiants envoyés par e-mail.`);
        router.refresh();
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-navy-900/5 bg-white p-6">
        <h3 className="font-display text-sm font-semibold text-navy-900">
          Identité
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 flex-none text-ink-500" />
            <dt className="text-ink-500">Naissance</dt>
            <dd className="ml-auto font-medium text-navy-900">{student.dateNaissance}</dd>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 flex-none text-ink-500" />
            <dt className="text-ink-500">Adresse</dt>
            <dd className="ml-auto font-medium text-navy-900">{student.adresse ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-navy-900/5 bg-white p-6">
        <h3 className="font-display text-sm font-semibold text-navy-900">
          Parent / tuteur
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-ink-500">Nom</span>
            <dd className="ml-auto font-medium text-navy-900">{student.parent}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 flex-none text-ink-500" />
            <dt className="text-ink-500">Téléphone</dt>
            <dd className="ml-auto font-mono text-navy-900">{student.parentTelephone}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 flex-none text-ink-500" />
            <dt className="text-ink-500">E-mail</dt>
            <dd className="ml-auto font-medium text-navy-900">{student.parentEmail}</dd>
          </div>
        </dl>

        {student.parentId && (
          <div className="mt-4 border-t border-navy-900/5 pt-4">
            {student.parentAUnCompte ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> A déjà accès à l&rsquo;espace parent
              </p>
            ) : (
              <button
                onClick={creerAccesParent}
                disabled={isPending || student.parentEmail === "—"}
                title={
                  student.parentEmail === "—"
                    ? "Ajoutez un e-mail au tuteur avant de créer son accès"
                    : "Créer le compte de connexion du parent"
                }
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
                Créer l&rsquo;accès à l&rsquo;espace parent
              </button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-navy-900/5 bg-white p-6 lg:col-span-2">
        <h3 className="font-display text-sm font-semibold text-navy-900">
          Documents
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {student.documents.map((doc) => (
            <li
              key={doc}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/8 bg-paper-100 px-3 py-1.5 text-xs font-medium text-ink-700"
            >
              <FileText className="h-3.5 w-3.5 text-ink-500" />
              {doc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResultatsPanel({ student }: { student: Student }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-900/5 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-navy-900/5 text-xs uppercase tracking-wide text-ink-500">
            <th className="px-6 py-3 font-medium">Matière</th>
            <th className="px-6 py-3 font-medium">Coefficient</th>
            <th className="px-6 py-3 font-medium">Note</th>
            <th className="px-6 py-3 font-medium">Appréciation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-900/5">
          {student.resultats.map((r) => (
            <tr key={r.matiere}>
              <td className="px-6 py-3.5 text-sm font-medium text-navy-900">
                {r.matiere}
              </td>
              <td className="px-6 py-3.5 text-sm text-ink-700">{r.coefficient}</td>
              <td className="px-6 py-3.5 font-mono text-sm text-navy-900">
                {r.note}/{r.bareme}
              </td>
              <td className="px-6 py-3.5 text-sm text-ink-500">{r.appreciation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AbsencesPanel({ student }: { student: Student }) {
  if (student.absences.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-900/5 bg-white p-10 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-teal-500" />
        <p className="mt-3 text-sm text-ink-500">
          Aucune absence enregistrée ce trimestre.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-900/5 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-navy-900/5 text-xs uppercase tracking-wide text-ink-500">
            <th className="px-6 py-3 font-medium">Date</th>
            <th className="px-6 py-3 font-medium">Type</th>
            <th className="px-6 py-3 font-medium">Motif</th>
            <th className="px-6 py-3 font-medium">Justifié</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-900/5">
          {student.absences.map((a, i) => (
            <tr key={i}>
              <td className="px-6 py-3.5 text-sm text-navy-900">{a.date}</td>
              <td className="px-6 py-3.5 text-sm text-ink-700">{a.type}</td>
              <td className="px-6 py-3.5 text-sm text-ink-500">{a.motif}</td>
              <td className="px-6 py-3.5">
                {a.justifie ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Justifié
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
                    <XCircle className="h-3.5 w-3.5" /> Non justifié
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaiementsPanel({ student }: { student: Student }) {
  return (
    <div className="space-y-4">
      {student.soldeDu > 0 && (
        <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 px-5 py-4 text-sm text-gold-500">
          Solde restant dû : <strong>{formatGNF(student.soldeDu)}</strong>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-navy-900/5 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy-900/5 text-xs uppercase tracking-wide text-ink-500">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Montant</th>
              <th className="px-6 py-3 font-medium">Mode</th>
              <th className="px-6 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/5">
            {student.paiements.map((p) => (
              <tr key={p.recu}>
                <td className="px-6 py-3.5 text-sm text-navy-900">{p.date}</td>
                <td className="px-6 py-3.5 font-mono text-sm text-navy-900">
                  {formatGNF(p.montant)}
                </td>
                <td className="px-6 py-3.5 text-sm text-ink-700">{p.mode}</td>
                <td className="px-6 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      p.statut === "Payé"
                        ? "bg-teal-500/10 text-teal-600"
                        : "bg-gold-400/15 text-gold-500"
                    }`}
                  >
                    {p.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
