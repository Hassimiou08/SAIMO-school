import "server-only";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";

/**
 * Données de la page Réinscriptions : classes des années précédentes (source),
 * élèves de la classe choisie avec leur situation dans l'année active,
 * et classes de l'année active (destination).
 */
export async function getDonneesReinscription(sourceClasseId?: string) {
  const ctx = await requireContext();
  requirePermission(ctx.role, "inscription:view");

  const anneeActive = await prisma.anneeScolaire.findUniqueOrThrow({
    where: { id: ctx.anneeScolaireId },
    select: { libelle: true, dateDebut: true },
  });
  const [classesSource, classesCible] = await Promise.all([
    // Origine : classes des années antérieures à l'année active (pas d'une année future déjà préparée).
    prisma.classe.findMany({
      where: {
        etablissementId: ctx.etablissementId,
        anneeScolaire: { dateDebut: { lt: anneeActive.dateDebut } },
      },
      include: {
        anneeScolaire: { select: { libelle: true, dateDebut: true } },
        niveau: { select: { nom: true, ordre: true, cycle: { select: { ordre: true } } } },
        _count: { select: { inscriptions: { where: { statut: "active" } } } },
      },
    }),
    prisma.classe.findMany({
      where: { etablissementId: ctx.etablissementId, anneeScolaireId: ctx.anneeScolaireId },
      include: { niveau: { select: { nom: true, ordre: true, cycle: { select: { ordre: true } } } } },
    }),
  ]);

  const ordreClasse = (c: { nom: string; niveau: { ordre: number; cycle: { ordre: number } } }) =>
    c.niveau.cycle.ordre * 1000 + c.niveau.ordre;

  const sources = classesSource
    .sort(
      (a, b) =>
        b.anneeScolaire.dateDebut.getTime() - a.anneeScolaire.dateDebut.getTime() ||
        ordreClasse(a) - ordreClasse(b) ||
        a.nom.localeCompare(b.nom, "fr"),
    )
    .map((c) => ({ id: c.id, nom: c.nom, niveau: c.niveau.nom, annee: c.anneeScolaire.libelle, effectif: c._count.inscriptions }));

  const cibles = classesCible
    .sort((a, b) => ordreClasse(a) - ordreClasse(b) || a.nom.localeCompare(b.nom, "fr"))
    .map((c) => ({ id: c.id, nom: c.nom, niveau: c.niveau.nom }));

  let eleves: {
    id: string;
    matricule: string;
    nom: string;
    dejaInscrit: string | null;
  }[] = [];
  const source = sources.find((s) => s.id === sourceClasseId) ?? null;
  if (source) {
    const inscriptions = await prisma.inscription.findMany({
      where: { classeId: source.id, etablissementId: ctx.etablissementId, statut: "active", eleve: { statut: "actif" } },
      include: { eleve: { select: { id: true, matricule: true, prenom: true, nom: true } } },
      orderBy: [{ eleve: { nom: "asc" } }, { eleve: { prenom: "asc" } }],
    });
    const actuelles = await prisma.inscription.findMany({
      where: {
        anneeScolaireId: ctx.anneeScolaireId,
        etablissementId: ctx.etablissementId,
        eleveId: { in: inscriptions.map((i) => i.eleveId) },
      },
      include: { classe: { select: { nom: true } } },
    });
    const classeActuelle = new Map(actuelles.map((a) => [a.eleveId, a.classe.nom]));
    eleves = inscriptions.map((i) => ({
      id: i.eleve.id,
      matricule: i.eleve.matricule,
      nom: `${i.eleve.prenom} ${i.eleve.nom}`,
      dejaInscrit: classeActuelle.get(i.eleve.id) ?? null,
    }));
  }

  return { anneeActive: anneeActive.libelle, sources, cibles, source, eleves };
}
