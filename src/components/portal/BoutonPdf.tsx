"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Génère un PDF A4 (une page par élément `[data-bulletin]` présent dans le DOM),
 * en conservant le rendu visuel exact. Aucune boîte de dialogue : téléchargement direct.
 */
export function BoutonPdf({
  fichier,
  label = "Télécharger le PDF",
}: {
  fichier: string;
  label?: string;
}) {
  const [enCours, setEnCours] = useState(false);

  const generer = async () => {
    const cibles = Array.from(
      document.querySelectorAll<HTMLElement>("[data-bulletin]"),
    );
    if (cibles.length === 0) {
      toast.error("Aucun bulletin à exporter.");
      return;
    }

    setEnCours(true);
    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < cibles.length; i++) {
        const canvas = await html2canvas(cibles[i], {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });
        const img = canvas.toDataURL("image/jpeg", 0.96);
        const imgH = (canvas.height * pageW) / canvas.width;

        if (i > 0) pdf.addPage();

        if (imgH <= pageH) {
          pdf.addImage(img, "JPEG", 0, 0, pageW, imgH);
        } else {
          // Bulletin plus haut qu'une page : on le découpe verticalement.
          let reste = imgH;
          let y = 0;
          while (reste > 0) {
            pdf.addImage(img, "JPEG", 0, y, pageW, imgH);
            reste -= pageH;
            if (reste > 0) {
              pdf.addPage();
              y -= pageH;
            }
          }
        }
      }

      pdf.save(`${fichier}.pdf`);
    } catch (e) {
      console.error(e);
      toast.error("Échec de la génération du PDF.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generer}
      disabled={enCours}
      className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 disabled:opacity-60 print:hidden"
    >
      {enCours ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      {enCours ? "Génération…" : label}
    </button>
  );
}
