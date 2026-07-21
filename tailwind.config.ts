import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bleu doux - couleur principale
        primary: {
          950: "#0a1f3e",
          900: "#0f2f52",
          800: "#1a4d7a",
          700: "#2563a8",
          600: "#3b7ec8",
          500: "#4a8dd9",
          400: "#6fa3e8",
          300: "#a0c4f7",
          200: "#d0dff9",
          100: "#e8f0ff",
        },
        // Orange Jaune - couleur secondaire
        secondary: {
          900: "#7a4200",
          800: "#a05500",
          700: "#c86800",
          600: "#e87500",
          500: "#ff8c00",
          400: "#ffa500",
          300: "#ffb83d",
          200: "#ffd699",
          100: "#ffe8cc",
        },
        // Succès - Vert
        success: {
          700: "#059669",
          600: "#10b981",
          500: "#34d399",
          400: "#6ee7b7",
          300: "#a7f3d0",
        },
        // Erreur - Rouge
        error: {
          700: "#b91c1c",
          600: "#dc2626",
          500: "#ef4444",
          400: "#f87171",
          300: "#fca5a5",
        },
        // Gris Blanc - Fond
        neutral: {
          50: "#fafafa",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        // Couleurs legacy
        navy: {
          950: "#081221",
          900: "#0A1930",
          800: "#0F2A4A",
          700: "#153B63",
        },
        blue: {
          600: "#1B6FD1",
          500: "#2C86EA",
          400: "#5CA3F0",
        },
        teal: {
          500: "#1FA8AE",
          400: "#2FBFC4",
          300: "#6FD6D9",
        },
        gold: {
          500: "#E8A22E",
          400: "#F2B138",
          300: "#F6C769",
        },
        ink: {
          900: "#0D1B2A",
          700: "#334255",
          500: "#5A6B80",
        },
        paper: {
          50: "#F6F8FB",
          100: "#EEF2F7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        "gradient-primary-secondary": "linear-gradient(135deg, #4a8dd9 0%, #ff8c00 100%)",
        "gradient-primary-secondary-vertical": "linear-gradient(180deg, #4a8dd9 0%, #ff8c00 100%)",
      },
      boxShadow: {
        panel: "0 20px 60px -20px rgba(8, 18, 33, 0.35)",
        "panel-light": "0 20px 50px -25px rgba(15, 42, 74, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
