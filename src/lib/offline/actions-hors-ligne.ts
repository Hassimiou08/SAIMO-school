// Server Actions utilisables hors connexion (étape 2) : liste blanche partagée
// entre le client (file d'attente) et le serveur (/api/sync).
//
// Seuls les TYPES des actions sont importés ici : le serveur fournit les
// fonctions elles-mêmes (src/server/sync/actions.ts), le compilateur vérifie
// que les deux listes correspondent.

import type * as admin from "@/server/actions/admin";
import type * as bulletins from "@/server/actions/bulletins";
import type * as compta from "@/server/actions/compta";
import type * as eleves from "@/server/actions/eleves";
import type * as evaluations from "@/server/actions/evaluations";
import type * as finance from "@/server/actions/finance";
import type * as parents from "@/server/actions/parents";
import type * as pedagogie from "@/server/actions/pedagogie";
import type * as preinscriptions from "@/server/actions/preinscriptions";
import type * as profil from "@/server/actions/profil";

export interface ActionsHorsLigne {
  // Administration
  "admin.creerAnnonce": typeof admin.actionCreerAnnonce;
  "admin.basculerAnnonce": typeof admin.actionBasculerAnnonce;
  "admin.creerUtilisateur": typeof admin.actionCreerUtilisateur;
  "admin.basculerUtilisateur": typeof admin.actionBasculerUtilisateur;
  "admin.majEtablissement": typeof admin.actionMajEtablissement;
  "admin.majApparence": typeof admin.actionMajApparence;
  "admin.creerPeriode": typeof admin.actionCreerPeriode;
  "admin.activerPeriode": typeof admin.actionActiverPeriode;
  "admin.creerConversation": typeof admin.actionCreerConversation;
  "admin.envoyerMessage": typeof admin.actionEnvoyerMessage;
  // Bulletins
  "bulletins.generer": typeof bulletins.actionGenererBulletins;
  "bulletins.majAppreciations": typeof bulletins.actionMajAppreciationsBulletin;
  "bulletins.valider": typeof bulletins.actionValiderBulletin;
  "bulletins.publier": typeof bulletins.actionPublierBulletin;
  "bulletins.publierClasse": typeof bulletins.actionPublierBulletinsClasse;
  // Comptabilité
  "compta.creerSalaire": typeof compta.actionCreerSalaire;
  "compta.modifierSalaire": typeof compta.actionModifierSalaire;
  "compta.payerSalaire": typeof compta.actionPayerSalaire;
  "compta.payerSalairesGroupe": typeof compta.actionPayerSalairesGroupe;
  "compta.genererPaieMois": typeof compta.actionGenererPaieMois;
  "compta.relancerImpayes": typeof compta.actionRelancerImpayes;
  // Élèves
  "eleves.archiver": typeof eleves.actionArchiverEleve;
  // Évaluations
  "evaluations.valider": typeof evaluations.actionValiderEvaluation;
  "evaluations.deverrouiller": typeof evaluations.actionDeverrouillerEvaluation;
  // Finance
  "finance.creerRemise": typeof finance.actionCreerRemise;
  "finance.creerTypeFrais": typeof finance.actionCreerTypeFrais;
  "finance.creerEcheance": typeof finance.actionCreerEcheance;
  "finance.genererFrais": typeof finance.actionGenererFrais;
  // Parents
  "parents.creerAcces": typeof parents.actionCreerAccesParent;
  // Pédagogie
  "pedagogie.creerCycle": typeof pedagogie.actionCreerCycle;
  "pedagogie.modifierCycle": typeof pedagogie.actionModifierCycle;
  "pedagogie.creerNiveau": typeof pedagogie.actionCreerNiveau;
  "pedagogie.modifierNiveau": typeof pedagogie.actionModifierNiveau;
  "pedagogie.creerMatiere": typeof pedagogie.actionCreerMatiere;
  "pedagogie.modifierMatiere": typeof pedagogie.actionModifierMatiere;
  "pedagogie.basculerMatiere": typeof pedagogie.actionBasculerMatiere;
  "pedagogie.creerClasse": typeof pedagogie.actionCreerClasse;
  "pedagogie.modifierClasse": typeof pedagogie.actionModifierClasse;
  "pedagogie.creerEnseignant": typeof pedagogie.actionCreerEnseignant;
  "pedagogie.creerAffectation": typeof pedagogie.actionCreerAffectation;
  "pedagogie.supprimerAffectation": typeof pedagogie.actionSupprimerAffectation;
  "pedagogie.creerCreneau": typeof pedagogie.actionCreerCreneau;
  "pedagogie.modifierCreneau": typeof pedagogie.actionModifierCreneau;
  "pedagogie.supprimerCreneau": typeof pedagogie.actionSupprimerCreneau;
  "pedagogie.creerTypeEvaluation": typeof pedagogie.actionCreerTypeEvaluation;
  "pedagogie.supprimerTypeEvaluation": typeof pedagogie.actionSupprimerTypeEvaluation;
  // Pré-inscriptions
  "preinscriptions.marquer": typeof preinscriptions.actionMarquerPreInscription;
  "preinscriptions.convertir": typeof preinscriptions.actionConvertirPreInscription;
  // Profil
  "profil.maj": typeof profil.actionMajProfil;
}

export type NomActionHorsLigne = keyof ActionsHorsLigne;

/** Libellé affiché dans la liste des opérations en attente. */
export const LIBELLES_ACTIONS: Record<NomActionHorsLigne, string> = {
  "admin.creerAnnonce": "Nouvelle annonce",
  "admin.basculerAnnonce": "Publication d'une annonce",
  "admin.creerUtilisateur": "Nouveau compte utilisateur",
  "admin.basculerUtilisateur": "Activation / désactivation d'un compte",
  "admin.majEtablissement": "Informations de l'établissement",
  "admin.majApparence": "Apparence de l'établissement",
  "admin.creerPeriode": "Nouvelle période",
  "admin.activerPeriode": "Activation d'une période",
  "admin.creerConversation": "Nouvelle conversation",
  "admin.envoyerMessage": "Message",
  "bulletins.generer": "Génération des bulletins",
  "bulletins.majAppreciations": "Appréciations du bulletin",
  "bulletins.valider": "Validation d'un bulletin",
  "bulletins.publier": "Publication d'un bulletin",
  "bulletins.publierClasse": "Publication des bulletins de la classe",
  "compta.creerSalaire": "Nouvelle ligne de paie",
  "compta.modifierSalaire": "Modification d'une ligne de paie",
  "compta.payerSalaire": "Paiement d'un salaire",
  "compta.payerSalairesGroupe": "Paiement groupé des salaires",
  "compta.genererPaieMois": "Génération de la paie du mois",
  "compta.relancerImpayes": "Relance des impayés",
  "eleves.archiver": "Archivage d'un élève",
  "evaluations.valider": "Verrouillage d'une évaluation",
  "evaluations.deverrouiller": "Déverrouillage d'une évaluation",
  "finance.creerRemise": "Nouvelle remise",
  "finance.creerTypeFrais": "Nouveau type de frais",
  "finance.creerEcheance": "Nouvelle échéance",
  "finance.genererFrais": "Génération des frais",
  "parents.creerAcces": "Accès parent",
  "pedagogie.creerCycle": "Nouveau cycle",
  "pedagogie.modifierCycle": "Modification d'un cycle",
  "pedagogie.creerNiveau": "Nouveau niveau",
  "pedagogie.modifierNiveau": "Modification d'un niveau",
  "pedagogie.creerMatiere": "Nouvelle matière",
  "pedagogie.modifierMatiere": "Modification d'une matière",
  "pedagogie.basculerMatiere": "Activation / désactivation d'une matière",
  "pedagogie.creerClasse": "Nouvelle classe",
  "pedagogie.modifierClasse": "Modification d'une classe",
  "pedagogie.creerEnseignant": "Nouvel enseignant",
  "pedagogie.creerAffectation": "Nouvelle affectation",
  "pedagogie.supprimerAffectation": "Suppression d'une affectation",
  "pedagogie.creerCreneau": "Nouveau créneau d'emploi du temps",
  "pedagogie.modifierCreneau": "Modification d'un créneau",
  "pedagogie.supprimerCreneau": "Suppression d'un créneau",
  "pedagogie.creerTypeEvaluation": "Nouveau type d'évaluation",
  "pedagogie.supprimerTypeEvaluation": "Suppression d'un type d'évaluation",
  "preinscriptions.marquer": "Statut d'une pré-inscription",
  "preinscriptions.convertir": "Conversion d'une pré-inscription",
  "profil.maj": "Mon profil",
};

/** Argument sérialisé pour la file d'attente (FormData ou valeur JSON). */
export type ArgSerialise =
  | { t: "fd"; v: [string, string][] }
  | { t: "json"; v: unknown }
  | { t: "undef" };
