"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoLockup } from "./Logo";

const links = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Services",
    href: "/sections/services",
  },
  {
    label: "Programmes",
    href: "/sections/programme",
  },
  {
    label: "Préinscription",
    href: "/sections/preinscription",
  },
  {
    label: "Contact",
    href: "/sections/contact",
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/5 bg-paper-50/85 backdrop-blur">
      <nav className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" aria-label="Accueil SAIMO">
          <LogoLockup variant="dark" />
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`flex min-w-[9.5rem] items-center justify-center rounded-xl px-3 py-2.5 text-center transition-all ${
                  isActive(link.href)
                    ? "bg-navy-900/5 text-navy-900 shadow-sm"
                    : "text-ink-700 hover:bg-navy-900/5 hover:text-navy-900"
                }`}
              >
                <span className="text-sm font-semibold">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/connexion"
            className="rounded-full border border-navy-900/10 px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-900/5"
          >
            Connexion
          </a>
          <a
            href="/school"
            className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Découvrir l&apos;école
          </a>
        </div>

        <button
          className="md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6 text-navy-900" /> : <Menu className="h-6 w-6 text-navy-900" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-900/5 bg-paper-50 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl border px-3 py-3 ${
                    isActive(link.href)
                      ? "border-navy-900/10 bg-navy-900/5 text-navy-900"
                      : "border-transparent bg-white/70 text-ink-700"
                  }`}
                >
                  <span className="block text-sm font-semibold">{link.label}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="/connexion"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl border border-navy-900/10 px-3 py-3 text-center text-sm font-semibold text-ink-800"
              >
                Connexion
              </a>
            </li>
            <li>
              <a
                href="/school"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-full bg-navy-900 px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Découvrir l&apos;école
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
