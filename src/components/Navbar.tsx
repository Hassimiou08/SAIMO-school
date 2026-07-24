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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-orange-400 shadow-md backdrop-blur border-b border-white/10">
      <nav className="flex min-h-[4.5rem] w-full items-center justify-between px-8 py-3">
        <a href="#top" aria-label="Accueil SAIMO" className="text-white">
          <LogoLockup variant="light" />
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`flex items-center justify-center rounded-xl px-4 py-2.5 transition-all ${isActive(link.href)
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-teal-50 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="text-base font-semibold">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/connexion"
            className="whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Connexion
          </a>
          <a
            href="/school"
            className="whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-base font-bold text-teal-600 transition-colors hover:bg-teal-50"
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
          {open ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
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
                  className={`block rounded-xl border px-3 py-3 ${isActive(link.href)
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
