"use client";

import { Printer } from "lucide-react";

export function BoutonImprimer({
  label = "Imprimer",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 print:hidden"
      }
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
