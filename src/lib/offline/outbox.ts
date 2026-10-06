"use client";

// File d'attente des opérations saisies sur cet appareil (IndexedDB).
// Une opération y reste tant que le serveur ne l'a pas appliquée.

import type { PayloadsOperation, TypeOperation } from "./operations";

export interface OperationLocale<K extends TypeOperation = TypeOperation> {
  id: string;
  type: K;
  payload: PayloadsOperation[K];
  /** Description lisible, affichée dans la liste des opérations en attente. */
  libelle: string;
  utilisateurId: string;
  saisieLe: string; // ISO
  /** en_attente : sera envoyée ; erreur : refusée par le serveur, à corriger. */
  statut: "en_attente" | "erreur";
  erreur?: string;
}

const NOM_BASE = "saimo-hors-ligne";
const STORE = "operations";

let ouverture: Promise<IDBDatabase> | null = null;

function ouvrir(): Promise<IDBDatabase> {
  if (!ouverture) {
    ouverture = new Promise((resolve, reject) => {
      const req = indexedDB.open(NOM_BASE, 1);
      req.onupgradeneeded = () => {
        const store = req.result.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("utilisateurId", "utilisateurId");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        ouverture = null;
        reject(req.error);
      };
    });
  }
  return ouverture;
}

function requete<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return ouvrir().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

export function ajouterOperation(op: OperationLocale): Promise<unknown> {
  return requete("readwrite", (s) => s.put(op));
}

export function supprimerOperation(id: string): Promise<unknown> {
  return requete("readwrite", (s) => s.delete(id));
}

export function marquerErreur(op: OperationLocale, erreur: string): Promise<unknown> {
  return requete("readwrite", (s) => s.put({ ...op, statut: "erreur", erreur }));
}

export function remettreEnAttente(op: OperationLocale): Promise<unknown> {
  return requete("readwrite", (s) => s.put({ ...op, statut: "en_attente", erreur: undefined }));
}

/** Opérations de l'utilisateur, dans l'ordre de saisie. */
export async function listerOperations(utilisateurId: string): Promise<OperationLocale[]> {
  const ops = await requete<OperationLocale[]>("readonly", (s) =>
    s.index("utilisateurId").getAll(utilisateurId),
  );
  return ops.sort((a, b) => a.saisieLe.localeCompare(b.saisieLe));
}
