import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { lienTel, type SiteEcole } from "@/lib/site-ecole";
import { EcoleLogo, IconeFacebook } from "./EcoleUi";

export function EcoleFooter({ site, base }: { site: SiteEcole; base: string }) {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* Signature institutionnelle */}
        <div>
          <div className="flex items-center gap-3">
            <EcoleLogo logo={site.logo} nom={site.nomCourt} taille={48} />
            <p className="font-display text-lg font-bold uppercase leading-tight tracking-wide">{site.nomComplet}</p>
          </div>
          {site.slogan && <p className="mt-4 italic text-white/75">{site.slogan}</p>}
          {site.deviseEcole && (
            <p className="mt-2 text-sm text-white/75">
              Notre devise : <strong className="text-white">{site.deviseEcole}</strong>
            </p>
          )}
          {site.facebook && (
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-[#1877F2]"
            >
              <IconeFacebook /> Page Facebook
            </a>
          )}
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60">Navigation</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-white/80">
            <li><Link href={base} className="hover:text-white">Accueil</Link></li>
            <li><Link href={`${base}/decouvrir`} className="hover:text-white">Découvrir l&apos;école</Link></li>
            <li><Link href={`${base}/cycles`} className="hover:text-white">Nos cycles</Link></li>
            <li><Link href={`${base}/tarifs`} className="hover:text-white">Tarifs</Link></li>
            <li><Link href={`${base}/services`} className="hover:text-white">Services</Link></li>
            <li><Link href={`${base}/contact`} className="hover:text-white">Contact</Link></li>
            <li><Link href={`${base}/preinscription`} className="hover:text-white">Préinscription</Link></li>
            <li><Link href="/connexion" className="hover:text-white">Espace parents & personnel</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60">Nous joindre</p>
          <ul className="space-y-3 text-sm text-white/80">
            {site.adresse && (
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/60" /> {site.adresse}</li>
            )}
            {site.telephones.length > 0 && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <span className="flex flex-wrap gap-x-3">
                  {site.telephones.map((t) => (
                    <a key={t} href={lienTel(t)} className="hover:text-white">{t}</a>
                  ))}
                </span>
              </li>
            )}
            {site.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-white">{site.email}</a>
              </li>
            )}
            {site.horaires && (
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/60" /> {site.horaires}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.nomComplet}. Tous droits réservés.</p>
          <p>
            Gestion scolaire propulsée par{" "}
            <Link href="/" className="font-semibold text-white/70 hover:text-white">SAIMO</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
