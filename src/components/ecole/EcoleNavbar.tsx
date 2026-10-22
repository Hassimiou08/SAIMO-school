"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { EcoleLogo } from "./EcoleUi";

const LIENS = [
  { label: "Accueil", chemin: "" },
  { label: "Découvrir l'école", chemin: "/decouvrir" },
  { label: "Nos cycles", chemin: "/cycles" },
  { label: "Tarifs", chemin: "/tarifs" },
  { label: "Services", chemin: "/services" },
  { label: "Contact", chemin: "/contact" },
];

export function EcoleNavbar({
  base,
  nomCourt,
  logo,
  deviseEcole,
}: {
  base: string;
  nomCourt: string;
  logo: string;
  deviseEcole: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();
  // Connexion aux couleurs de l'école (base = /ecoles/[slug]).
  const connexion = `/connexion?ecole=${base.slice("/ecoles/".length)}`;
  const actif = (chemin: string) => (chemin === "" ? pathname === base : pathname.startsWith(base + chemin));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[var(--ec-from)] to-[var(--ec-to)] text-white shadow-md">
      <nav className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={base} className="flex min-w-0 items-center gap-3" aria-label={`Accueil ${nomCourt}`}>
          <EcoleLogo logo={logo} nom={nomCourt} taille={42} />
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold tracking-tight sm:text-lg">{nomCourt}</span>
            {deviseEcole && <span className="hidden truncate text-[11px] text-white/80 sm:block">{deviseEcole}</span>}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LIENS.map((l) => (
            <li key={l.chemin}>
              <Link
                href={base + l.chemin}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  actif(l.chemin) ? "bg-white/20 text-white shadow-sm" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href={connexion} className="whitespace-nowrap rounded-full border border-white/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-white hover:bg-white/10">
            Espace parents & personnel
          </Link>
          <Link href={`${base}/preinscription`} className="whitespace-nowrap rounded-full bg-white px-5 py-2 text-sm font-bold text-[var(--ec-primary)] transition-colors hover:bg-[var(--ec-light)]">
            Préinscription
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-1.5 lg:hidden"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={ouvert}
          onClick={() => setOuvert((v) => !v)}
        >
          {ouvert ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {ouvert && (
        <div className="border-t border-navy-900/5 bg-paper-50 px-4 pb-5 pt-3 text-navy-900 lg:hidden">
          <ul className="flex flex-col gap-1">
            {LIENS.map((l) => (
              <li key={l.chemin}>
                <Link
                  href={base + l.chemin}
                  onClick={() => setOuvert(false)}
                  className={`block rounded-xl border px-3 py-3 text-sm font-semibold ${
                    actif(l.chemin) ? "border-navy-900/10 bg-[var(--ec-light)] text-[var(--ec-primary)]" : "border-transparent text-ink-700"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid gap-2">
            <Link href={`${base}/preinscription`} onClick={() => setOuvert(false)} className="rounded-full bg-gradient-to-r from-[var(--ec-from)] to-[var(--ec-to)] px-5 py-3 text-center text-sm font-bold text-white">
              Préinscription
            </Link>
            <Link href={connexion} onClick={() => setOuvert(false)} className="rounded-full border border-navy-900/10 px-5 py-3 text-center text-sm font-semibold">
              Espace parents & personnel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
