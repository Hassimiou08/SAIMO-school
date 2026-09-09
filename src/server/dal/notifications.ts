import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { formatGNF } from "@/lib/format";

export type NotifTon = "info" | "attention" | "urgent";

export interface NotifItem {
  id: string;
  ton: NotifTon;
  titre: string;
  detail: string;
  href: string;
  compteur: number;
}

export interface NotificationsPortail {
  items: NotifItem[];
  total: number;
}

/**
 * Flux de notifications « à traiter » calculé en direct à partir de l'état réel
 * de l'établissement (pas de table de lecture : un item disparaît dès que la
 * situation sous-jacente est réglée).
 */
export const getNotificationsPortail = cache(async (): Promise<NotificationsPortail> => {
  const { etablissementId, anneeScolaireId } = await requireContext();

  const [preInscriptions, absencesNonJustifiees, bulletinsAValider, fraisImpayes] =
    await Promise.all([
      prisma.preInscription.count({
        where: { etablissementId, statut: "nouvelle" },
      }),
      prisma.presence.count({
        where: {
          classe: { etablissementId },
          statut: { in: ["absent", "retard"] },
          justifie: false,
        },
      }),
      prisma.bulletin.count({
        where: { anneeScolaireId, statut: "valide", classe: { etablissementId } },
      }),
      prisma.fraisEleve.findMany({
        where: {
          statut: { in: ["impaye", "partiel"] },
          echeance: { anneeScolaireId, dateEcheance: { lt: new Date() } },
          inscription: { etablissementId, anneeScolaireId, statut: "active" },
        },
        select: { montantDu: true, montantPaye: true },
      }),
    ]);

  const soldeImpaye = fraisImpayes.reduce(
    (t, f) => t + (Number(f.montantDu) - Number(f.montantPaye)),
    0,
  );

  const items: NotifItem[] = [];

  if (preInscriptions > 0) {
    items.push({
      id: "preinscriptions",
      ton: "attention",
      titre: `${preInscriptions} demande${preInscriptions > 1 ? "s" : ""} de pré-inscription`,
      detail: "En attente de traitement",
      href: "/portail/preinscriptions",
      compteur: preInscriptions,
    });
  }

  if (absencesNonJustifiees > 0) {
    items.push({
      id: "absences",
      ton: "attention",
      titre: `${absencesNonJustifiees} absence${absencesNonJustifiees > 1 ? "s" : ""} non justifiée${absencesNonJustifiees > 1 ? "s" : ""}`,
      detail: "À justifier ou à contacter les familles",
      href: "/portail/absences",
      compteur: absencesNonJustifiees,
    });
  }

  if (bulletinsAValider > 0) {
    items.push({
      id: "bulletins",
      ton: "info",
      titre: `${bulletinsAValider} bulletin${bulletinsAValider > 1 ? "s" : ""} validé${bulletinsAValider > 1 ? "s" : ""} à publier`,
      detail: "Prêts pour publication aux familles",
      href: "/portail/bulletins",
      compteur: bulletinsAValider,
    });
  }

  if (soldeImpaye > 0) {
    items.push({
      id: "impayes",
      ton: "urgent",
      titre: `${formatGNF(soldeImpaye)} d'impayés échus`,
      detail: `${fraisImpayes.length} ligne${fraisImpayes.length > 1 ? "s" : ""} de frais en retard`,
      href: "/portail/paiements",
      compteur: fraisImpayes.length,
    });
  }

  return {
    items,
    total: items.reduce((t, i) => t + i.compteur, 0),
  };
});
