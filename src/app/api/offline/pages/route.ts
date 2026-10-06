import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeForRole } from "@/auth.config";
import { peutFaire } from "@/server/permissions/roles";
import { PERMISSION_PAGE_PORTAIL } from "@/lib/pages-portail";
import { mesEvaluations } from "@/server/dal/enseignant";

// Pages à télécharger sur l'appareil pour travailler hors connexion.
//  - essentielles : les écrans du menu (rafraîchies souvent)
//  - details : fiches et saisies (plus nombreuses, rafraîchies moins souvent)

const MAX_DETAILS = 400;

const PAGES_ENSEIGNANT = [
  "/enseignant",
  "/enseignant/notes",
  "/enseignant/notes/tableau",
  "/enseignant/absences",
  "/enseignant/emploi-du-temps",
  "/enseignant/bulletins",
  "/enseignant/annonces",
  "/enseignant/messagerie",
  "/enseignant/profil",
];

const PAGES_COMPTA = [
  "/compta",
  "/compta/recettes",
  "/compta/depenses",
  "/compta/salaires",
  "/compta/annonces",
  "/compta/messagerie",
  "/compta/rapports",
];

const PAGES_PARENT = [
  "/parent",
  "/parent/notes",
  "/parent/bulletins",
  "/parent/absences",
  "/parent/paiements",
  "/parent/notifications",
  "/parent/messagerie",
  "/parent/profil",
];

export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  const etablissementId = session?.user?.etablissementId;
  if (!session?.user?.id || !role || !etablissementId) {
    return NextResponse.json({ erreur: "Non connecté" }, { status: 401 });
  }

  const essentielles: string[] = [];
  const details: string[] = [];
  const home = homeForRole(role);

  if (home === "/portail") {
    for (const [page, perm] of Object.entries(PERMISSION_PAGE_PORTAIL)) {
      if (page === "/compta") continue; // ajouté avec les pages compta ci-dessous
      if (!perm || peutFaire(role, perm)) essentielles.push(page);
    }
    if (peutFaire(role, "eleve:create")) essentielles.push("/portail/eleves/nouveau");
    if (peutFaire(role, "rapport:financier")) essentielles.push(...PAGES_COMPTA);

    const annee = await prisma.anneeScolaire.findFirst({
      where: { etablissementId, active: true },
      orderBy: { dateDebut: "desc" },
      select: { id: true },
    });
    if (annee) {
      if (peutFaire(role, "note:saisir")) {
        const evals = await prisma.evaluation.findMany({
          where: { etablissementId, statut: { not: "verrouillee" }, classe: { anneeScolaireId: annee.id } },
          select: { id: true },
          orderBy: { createdAt: "desc" },
          take: MAX_DETAILS,
        });
        details.push(...evals.map((e) => `/portail/notes/${e.id}`));
      }
      if (peutFaire(role, "classe:view")) {
        const classes = await prisma.classe.findMany({
          where: { etablissementId, anneeScolaireId: annee.id },
          select: { id: true },
          take: MAX_DETAILS,
        });
        details.push(...classes.map((c) => `/portail/classes/${c.id}`));
      }
      if (peutFaire(role, "enseignant:view")) {
        const enseignants = await prisma.enseignant.findMany({
          where: { etablissementId },
          select: { id: true },
          take: MAX_DETAILS,
        });
        details.push(...enseignants.map((e) => `/portail/enseignants/${e.id}`));
      }
      if (peutFaire(role, "eleve:view")) {
        const inscriptions = await prisma.inscription.findMany({
          where: { etablissementId, anneeScolaireId: annee.id, statut: "active" },
          select: { eleveId: true },
          take: MAX_DETAILS,
        });
        details.push(...inscriptions.map((i) => `/portail/eleves/${i.eleveId}`));
      }
    }
  } else if (home === "/enseignant") {
    essentielles.push(...PAGES_ENSEIGNANT);
    const evals = await mesEvaluations();
    details.push(
      ...evals
        .filter((e) => e.statut !== "verrouillee")
        .slice(0, MAX_DETAILS)
        .map((e) => `/enseignant/notes/${e.id}`),
    );
  } else if (home === "/compta") {
    essentielles.push(...PAGES_COMPTA);
  } else if (home === "/parent") {
    essentielles.push(...PAGES_PARENT);
  }

  return NextResponse.json({ essentielles, details });
}
