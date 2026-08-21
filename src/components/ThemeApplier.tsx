"use client";

import { useEffect } from "react";
import { loadTheme, applyTheme } from "@/lib/theme";

export function ThemeApplier() {
  useEffect(() => {
    // Appliquer le thème sauvegardé au montage
    applyTheme(loadTheme());

    // Réappliquer si un autre composant émet l'événement
    const handler = () => applyTheme(loadTheme());
    window.addEventListener("saimo-theme-change", handler);
    return () => window.removeEventListener("saimo-theme-change", handler);
  }, []);

  return null;
}
