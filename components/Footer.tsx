import { LogoLockup } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-navy-900/5 bg-paper-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <LogoLockup variant="dark" />
          <p className="max-w-xs text-xs leading-relaxed text-ink-500">
            L&rsquo;innovation au service du développement — Groupe SAIMO,
            Conakry.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-navy-900/5 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Groupe SAIMO. Tous droits réservés.</p>
          <p>Document de référence : cahier des charges v2.0</p>
        </div>
      </div>
    </footer>
  );
}
