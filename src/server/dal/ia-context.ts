import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { formatGNF } from "@/lib/format";

/**
 * Instantané compact des données de l'établissement, injecté à l'assistant IA
 * pour qu'il réponde à partir de la réalité de l'application.
 */
export async function getContexteIA(): Promise<string> {
  const { etablissementId, anneeScolaireId } = await requireContext();

  const [etab, annee, nbEleves, nbEnseignants, classes, fraisAgg, evalEnAttente, absAgg, preInscNouvelles] =
    await Promise.all([
      prisma.etablissement.findUnique({ where: { id: etablissementId } }),
      prisma.anneeScolaire.findUnique({ where: { id: anneeScolaireId } }),
      prisma.inscription.count({ where: { etablissementId, anneeScolaireId, statut: "active" } }),
      prisma.enseignant.count({ where: { etablissementId, affectations: { some: { anneeScolaireId } } } }),
      prisma.classe.findMany({
        where: { etablissementId, anneeScolaireId },
        include: {
          niveau: { include: { cycle: true } },
          _count: { select: { inscriptions: { where: { statut: "active" } } } },
          bulletins: { where: { anneeScolaireId }, select: { moyenneGenerale: true } },
        },
        orderBy: [{ niveau: { cycle: { ordre: "asc" } } }, { niveau: { ordre: "asc" } }, { nom: "asc" }],
      }),
      prisma.fraisEleve.aggregate({
        where: { inscription: { etablissementId, anneeScolaireId } },
        _sum: { montantDu: true, montantPaye: true },
      }),
      prisma.evaluation.count({
        where: { etablissementId, statut: { not: "verrouillee" }, classe: { anneeScolaireId } },
      }),
      prisma.presence.groupBy({
        by: ["justifie"],
        where: { classe: { etablissementId, anneeScolaireId }, statut: { in: ["absent", "retard"] } },
        _count: { _all: true },
      }),
      prisma.preInscription.count({ where: { etablissementId, statut: "nouvelle" } }),
    ]);

  const du = Number(fraisAgg._sum.montantDu ?? 0);
  const paye = Number(fraisAgg._sum.montantPaye ?? 0);
  const absNonJust = absAgg.find((a) => !a.justifie)?._count._all ?? 0;

  const lignesClasses = classes.map((c) => {
    const notes = c.bulletins
      .map((b) => (b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null))
      .filter((n): n is number => n != null);
    const moy = notes.length
      ? (notes.reduce((s, n) => s + n, 0) / notes.length).toFixed(1)
      : "—";
    return `  - ${c.nom} (${c.niveau.cycle.nom} / ${c.niveau.nom}) : ${c._count.inscriptions} élèves, moyenne ${moy}/20`;
  });

  return [
    `Établissement : ${etab?.nom ?? "SAIMO"}${etab?.ville ? `, ${etab.ville}` : ""} (${etab?.pays ?? "Guinée"}). Devise : ${etab?.devise ?? "GNF"}.`,
    `Année scolaire active : ${annee?.libelle ?? "—"}.`,
    `Effectifs : ${nbEleves} élèves actifs, ${classes.length} classes, ${nbEnseignants} enseignants.`,
    `Pré-inscriptions en attente de traitement : ${preInscNouvelles}.`,
    `Évaluations non verrouillées : ${evalEnAttente}. Absences non justifiées : ${absNonJust}.`,
    `Finances : dû total ${formatGNF(du)}, encaissé ${formatGNF(paye)}, reste à recouvrer ${formatGNF(Math.max(0, du - paye))} (recouvrement ${du ? Math.round((paye / du) * 100) : 0} %).`,
    classes.length ? `Classes :\n${lignesClasses.join("\n")}` : "Aucune classe configurée.",
  ].join("\n");
}
