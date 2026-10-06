import "server-only";

import * as admin from "@/server/actions/admin";
import * as bulletins from "@/server/actions/bulletins";
import * as compta from "@/server/actions/compta";
import * as eleves from "@/server/actions/eleves";
import * as evaluations from "@/server/actions/evaluations";
import * as finance from "@/server/actions/finance";
import * as parents from "@/server/actions/parents";
import * as pedagogie from "@/server/actions/pedagogie";
import * as preinscriptions from "@/server/actions/preinscriptions";
import * as profil from "@/server/actions/profil";
import type { ActionResult } from "@/server/actions/eleves";
import type {
  ActionsHorsLigne,
  ArgSerialise,
  NomActionHorsLigne,
} from "@/lib/offline/actions-hors-ligne";
import { versFormData } from "@/lib/offline/operations";

// Les actions rejouées sont exactement celles des écrans : mêmes validations,
// mêmes contrôles de droits, même journal d'audit.
const ACTIONS: ActionsHorsLigne = {
  "admin.creerAnnonce": admin.actionCreerAnnonce,
  "admin.basculerAnnonce": admin.actionBasculerAnnonce,
  "admin.creerUtilisateur": admin.actionCreerUtilisateur,
  "admin.basculerUtilisateur": admin.actionBasculerUtilisateur,
  "admin.majEtablissement": admin.actionMajEtablissement,
  "admin.majApparence": admin.actionMajApparence,
  "admin.creerPeriode": admin.actionCreerPeriode,
  "admin.activerPeriode": admin.actionActiverPeriode,
  "admin.creerConversation": admin.actionCreerConversation,
  "admin.envoyerMessage": admin.actionEnvoyerMessage,
  "bulletins.generer": bulletins.actionGenererBulletins,
  "bulletins.majAppreciations": bulletins.actionMajAppreciationsBulletin,
  "bulletins.valider": bulletins.actionValiderBulletin,
  "bulletins.publier": bulletins.actionPublierBulletin,
  "bulletins.publierClasse": bulletins.actionPublierBulletinsClasse,
  "compta.creerSalaire": compta.actionCreerSalaire,
  "compta.modifierSalaire": compta.actionModifierSalaire,
  "compta.payerSalaire": compta.actionPayerSalaire,
  "compta.payerSalairesGroupe": compta.actionPayerSalairesGroupe,
  "compta.genererPaieMois": compta.actionGenererPaieMois,
  "compta.relancerImpayes": compta.actionRelancerImpayes,
  "eleves.archiver": eleves.actionArchiverEleve,
  "evaluations.valider": evaluations.actionValiderEvaluation,
  "evaluations.deverrouiller": evaluations.actionDeverrouillerEvaluation,
  "finance.creerRemise": finance.actionCreerRemise,
  "finance.creerTypeFrais": finance.actionCreerTypeFrais,
  "finance.creerEcheance": finance.actionCreerEcheance,
  "finance.genererFrais": finance.actionGenererFrais,
  "parents.creerAcces": parents.actionCreerAccesParent,
  "pedagogie.creerCycle": pedagogie.actionCreerCycle,
  "pedagogie.modifierCycle": pedagogie.actionModifierCycle,
  "pedagogie.creerNiveau": pedagogie.actionCreerNiveau,
  "pedagogie.modifierNiveau": pedagogie.actionModifierNiveau,
  "pedagogie.creerMatiere": pedagogie.actionCreerMatiere,
  "pedagogie.modifierMatiere": pedagogie.actionModifierMatiere,
  "pedagogie.basculerMatiere": pedagogie.actionBasculerMatiere,
  "pedagogie.creerClasse": pedagogie.actionCreerClasse,
  "pedagogie.modifierClasse": pedagogie.actionModifierClasse,
  "pedagogie.creerEnseignant": pedagogie.actionCreerEnseignant,
  "pedagogie.creerAffectation": pedagogie.actionCreerAffectation,
  "pedagogie.supprimerAffectation": pedagogie.actionSupprimerAffectation,
  "pedagogie.creerCreneau": pedagogie.actionCreerCreneau,
  "pedagogie.modifierCreneau": pedagogie.actionModifierCreneau,
  "pedagogie.supprimerCreneau": pedagogie.actionSupprimerCreneau,
  "pedagogie.creerTypeEvaluation": pedagogie.actionCreerTypeEvaluation,
  "pedagogie.supprimerTypeEvaluation": pedagogie.actionSupprimerTypeEvaluation,
  "preinscriptions.marquer": preinscriptions.actionMarquerPreInscription,
  "preinscriptions.convertir": preinscriptions.actionConvertirPreInscription,
  "profil.maj": profil.actionMajProfil,
};

// Vérification à la compilation : chaque action renvoie bien un ActionResult
// (la synchronisation s'appuie sur `succes`).
type RenvoieActionResult = {
  [K in NomActionHorsLigne]: Awaited<ReturnType<ActionsHorsLigne[K]>> extends ActionResult<unknown>
    ? true
    : K;
};
const _verification: { [K in NomActionHorsLigne]: true } = {} as RenvoieActionResult;
void _verification;

export function estActionHorsLigne(nom: string): nom is NomActionHorsLigne {
  return Object.prototype.hasOwnProperty.call(ACTIONS, nom);
}

function deserialiser(a: ArgSerialise): unknown {
  if (a.t === "fd") return versFormData(a.v);
  if (a.t === "undef") return undefined;
  return a.v;
}

export async function executerActionHorsLigne(
  nom: NomActionHorsLigne,
  args: ArgSerialise[],
): Promise<ActionResult<unknown>> {
  const action = ACTIONS[nom] as (...a: unknown[]) => Promise<ActionResult<unknown>>;
  // Les actions valident elles-mêmes leurs arguments (ce sont déjà des points
  // d'entrée publics) ; un argument mal formé finit en erreur, pas en crash.
  return action(...args.map(deserialiser));
}
