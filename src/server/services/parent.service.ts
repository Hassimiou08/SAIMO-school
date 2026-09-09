import type { Prisma, PrismaClient } from "@prisma/client";

type Tx = Prisma.TransactionClient | PrismaClient;

/**
 * Retrouve le tuteur existant (par téléphone, puis par e-mail) ou en crée un
 * nouveau. Évite de dupliquer une fiche Parent quand le même tuteur inscrit
 * plusieurs enfants séparément — condition pour qu'un seul compte parent
 * puisse ensuite voir tous ses enfants.
 */
export async function trouverOuCreerParent(
  tx: Tx,
  data: { prenom: string; nom: string; telephone: string; email?: string | null },
) {
  const email = data.email?.trim().toLowerCase() || undefined;

  const existant = await tx.parent.findFirst({
    where: {
      OR: [
        { telephone: data.telephone },
        ...(email ? [{ email }] : []),
      ],
    },
  });

  if (existant) {
    // Complète les champs manquants sans écraser des données déjà saisies.
    const maj: Prisma.ParentUpdateInput = {};
    if (!existant.email && email) maj.email = email;
    if (Object.keys(maj).length > 0) {
      return tx.parent.update({ where: { id: existant.id }, data: maj });
    }
    return existant;
  }

  return tx.parent.create({
    data: {
      prenom: data.prenom,
      nom: data.nom,
      telephone: data.telephone,
      email,
    },
  });
}

/** Relie un enfant à un tuteur, sans dupliquer si la relation existe déjà. */
export async function relierParentEleve(
  tx: Tx,
  params: { parentId: string; eleveId: string; lien: string; principal?: boolean },
) {
  const existante = await tx.relationParentEleve.findUnique({
    where: { parentId_eleveId: { parentId: params.parentId, eleveId: params.eleveId } },
  });
  if (existante) return existante;
  return tx.relationParentEleve.create({
    data: {
      parentId: params.parentId,
      eleveId: params.eleveId,
      lien: params.lien,
      principal: params.principal ?? true,
    },
  });
}
