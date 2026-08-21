export type ThemeConfig = {
  couleur: string;
  police: string;
  taille: string;
};

export const COLOR_MAP: Record<string, { primary: string; light: string; sidebarFrom: string; sidebarTo: string }> = {
  blue:    { primary: "#2563EB", light: "#EFF6FF", sidebarFrom: "#2563EB", sidebarTo: "#3B82F6" },
  emerald: { primary: "#059669", light: "#ECFDF5", sidebarFrom: "#059669", sidebarTo: "#10B981" },
  violet:  { primary: "#7C3AED", light: "#F5F3FF", sidebarFrom: "#7C3AED", sidebarTo: "#8B5CF6" },
  orange:  { primary: "#EA580C", light: "#FFF7ED", sidebarFrom: "#EA580C", sidebarTo: "#F97316" },
  slate:   { primary: "#475569", light: "#F8FAFC", sidebarFrom: "#334155", sidebarTo: "#475569" },
};

export function applyTheme(config: ThemeConfig) {
  const root = document.documentElement;
  const colors = COLOR_MAP[config.couleur] ?? COLOR_MAP.blue;

  root.style.setProperty("--saimo-primary",       colors.primary);
  root.style.setProperty("--saimo-primary-light",  colors.light);
  root.style.setProperty("--saimo-sidebar-from",   colors.sidebarFrom);
  root.style.setProperty("--saimo-sidebar-to",     colors.sidebarTo);
  root.style.setProperty("--saimo-font",            config.police + ", sans-serif");
  root.style.setProperty("--saimo-text-size",
    config.taille === "sm" ? "14px" : config.taille === "lg" ? "18px" : "16px"
  );

  // Apply font-family to body
  document.body.style.fontFamily = `var(--saimo-font)`;
  document.body.style.fontSize   = `var(--saimo-text-size)`;
}

export function saveTheme(config: ThemeConfig) {
  localStorage.setItem("saimo-theme", JSON.stringify(config));
  applyTheme(config);
  // Broadcast to all components (e.g. Sidebar)
  window.dispatchEvent(new Event("saimo-theme-change"));
}

export function loadTheme(): ThemeConfig {
  if (typeof window === "undefined") return { couleur: "blue", police: "Inter", taille: "base" };
  try {
    const stored = localStorage.getItem("saimo-theme");
    if (stored) return JSON.parse(stored) as ThemeConfig;
  } catch {}
  return { couleur: "blue", police: "Inter", taille: "base" };
}
