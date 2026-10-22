import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { lienTel, type SiteEcole } from "@/lib/site-ecole";
import { EcoleLogo, IconeFacebook } from "./EcoleUi";

const lien = "hover:text-[var(--ec-primary)] transition-colors";

export function EcoleFooter({ site, base }: { site: SiteEcole; base: string }) {
  return (
    <footer className="relative border-t border-neutral-200 bg-slate-50 text-slate-600">
      <div className="absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--ec-from)] to-transparent opacity-40" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* Signature institutionnelle */}
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-neutral-200 shadow-sm">
              <EcoleLogo logo={site.logo} nom={site.nomCourt} taille={48} />
            </span>
            <p className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-navy-900">{site.nomComplet}</p>
          </div>
          {site.slogan && <p className="mt-4 italic">{site.slogan}</p>}
          {site.deviseEcole && (
            <p className="mt-2 text-sm">
              Notre devise :{" "}
              <strong className="bg-gradient-to-r from-[var(--ec-from)] to-[var(--ec-to)] bg-clip-text text-transparent">{site.deviseEcole}</strong>
            </p>
          )}
          {site.facebook && (
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166FE5]"
            >
              <IconeFacebook /> Page Facebook
            </a>
          )}
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-navy-900">Navigation</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li><Link href={base} className={lien}>Accueil</Link></li>
            <li><Link href={`${base}/decouvrir`} className={lien}>Découvrir l&apos;école</Link></li>
            <li><Link href={`${base}/cycles`} className={lien}>Nos cycles</Link></li>
            <li><Link href={`${base}/tarifs`} className={lien}>Tarifs</Link></li>
            <li><Link href={`${base}/services`} className={lien}>Services</Link></li>
            <li><Link href={`${base}/contact`} className={lien}>Contact</Link></li>
            <li><Link href={`${base}/preinscription`} className={lien}>Préinscription</Link></li>
            <li><Link href={`/connexion?ecole=${site.slug}`} className={lien}>Espace parents & personnel</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-navy-900">Nous joindre</p>
          <ul className="space-y-3 text-sm">
            {site.adresse && (
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ec-primary)]" /> {site.adresse}</li>
            )}
            {site.telephones.length > 0 && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ec-primary)]" />
                <span className="flex flex-wrap gap-x-3">
                  {site.telephones.map((t) => (
                    <a key={t} href={lienTel(t)} className={lien}>{t}</a>
                  ))}
                </span>
              </li>
            )}
            {site.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ec-primary)]" />
                <a href={`mailto:${site.email}`} className={`break-all ${lien}`}>{site.email}</a>
              </li>
            )}
            {site.horaires && (
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ec-primary)]" /> {site.horaires}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.nomComplet}. Tous droits réservés.</p>
          <p>
            Gestion scolaire propulsée par{" "}
            <Link href="/" className="font-semibold text-navy-900 hover:text-[var(--ec-primary)]">SAIMO</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
