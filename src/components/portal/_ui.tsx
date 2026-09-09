"use client";

import { X, Loader2 } from "lucide-react";

export function Modale({
  titre,
  children,
  onClose,
  large,
}: {
  titre: string;
  children: React.ReactNode;
  onClose: () => void;
  large?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
      <div className={`w-full ${large ? "max-w-lg" : "max-w-sm"} rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">{titre}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Champ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400"
      />
    </div>
  );
}

export function Selecteur({
  label,
  children,
  ...props
}: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <select
        {...props}
        className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
      >
        {children}
      </select>
    </div>
  );
}

export function Err({ msg }: { msg: string }) {
  return (
    <p className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-600">{msg}</p>
  );
}

export function ModalActions({
  pending,
  onCancel,
  label = "Ajouter",
}: {
  pending: boolean;
  onCancel: () => void;
  label?: string;
}) {
  return (
    <div className="mt-4 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} {label}
      </button>
    </div>
  );
}
