import { monogramme, paragraphes } from "@/lib/site-ecole";

// Briques d'affichage partagées par les pages du site d'une école.
// Les couleurs viennent des variables CSS posées par le layout (--ec-primary, --ec-from, --ec-to).

export function EcoleLogo({ logo, nom, taille = 44 }: { logo: string; nom: string; taille?: number }) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={`Logo ${nom}`}
        width={taille}
        height={taille}
        className="shrink-0 rounded-xl bg-white object-contain p-0.5"
        style={{ width: taille, height: taille }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-xl bg-white font-display font-bold text-[var(--ec-primary)]"
      style={{ width: taille, height: taille, fontSize: taille * 0.38 }}
    >
      {monogramme(nom)}
    </span>
  );
}

export function IconeFacebook({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  );
}

export function BoutonFacebook({ lien, variante = "plein" }: { lien: string; variante?: "plein" | "clair" }) {
  if (!lien) return null;
  const style =
    variante === "plein"
      ? "bg-[#1877F2] text-white hover:bg-[#166FE5]"
      : "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20";
  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-colors ${style}`}
    >
      <IconeFacebook className="h-5 w-5" /> Suivez-nous sur Facebook
    </a>
  );
}

export function Titre({
  surtitre,
  titre,
  intro,
  centre = false,
}: {
  surtitre?: string;
  titre: string;
  intro?: string;
  centre?: boolean;
}) {
  return (
    <div className={`mb-10 ${centre ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {surtitre && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ec-primary)]">{surtitre}</p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">{titre}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-500">{intro}</p>}
    </div>
  );
}

export function Paragraphes({ texte, className = "" }: { texte: string; className?: string }) {
  return (
    <div className={`space-y-4 text-[1.0625rem] leading-relaxed text-ink-700 ${className}`}>
      {paragraphes(texte).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** Bandeau de titre en haut des pages intérieures. */
export function EnTetePage({ surtitre, titre, intro }: { surtitre: string; titre: string; intro?: string }) {
  return (
    <section
      className="relative overflow-hidden px-6 py-16 text-white md:py-20"
      style={{ background: "linear-gradient(135deg, var(--ec-from), #0A1930 70%)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">{surtitre}</p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{titre}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{intro}</p>}
      </div>
    </section>
  );
}
