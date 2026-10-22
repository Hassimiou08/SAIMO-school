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
      : "border border-neutral-200 bg-white text-[#1877F2] shadow-sm hover:bg-blue-50";
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
    <div data-anim="reveal" className={`mb-10 ${centre ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
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

/** Halos de couleur flous en fond de section (style des pages SAIMO). */
export function Halos() {
  return (
    <>
      <div className="pointer-events-none absolute -left-24 -top-40 h-[28rem] w-[28rem] rounded-full bg-[var(--ec-from)] opacity-[0.08] blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[var(--ec-to)] opacity-[0.10] blur-[110px]" />
    </>
  );
}

/**
 * Lueurs décoratives d'un bloc de couleur unie : reflets clairs, sans mélange
 * bleu/orange (qui donne un gris terne sur une grande surface).
 * Le parent doit être `relative overflow-hidden`, son contenu `relative`.
 */
export function Lueurs() {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-sky-300 opacity-30 blur-[90px]" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white opacity-15 blur-[70px]" />
    </>
  );
}

/** Texte en dégradé bleu → orange (couleurs du site), pour des mots courts. */
export function Degrade({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[var(--ec-from)] to-[var(--ec-to)] bg-clip-text text-transparent">{children}</span>
  );
}

/** Bandeau de titre en haut des pages intérieures. */
export function EnTetePage({ surtitre, titre, intro }: { surtitre: string; titre: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-paper-100 px-6 pb-12 pt-16 md:pb-16 md:pt-20">
      <Halos />
      <div className="relative mx-auto max-w-6xl">
        <p data-anim="intro" className="mb-4 inline-block rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--ec-primary)] shadow-sm">
          {surtitre}
        </p>
        <h1 data-anim="intro" className="font-display text-4xl font-bold tracking-tight text-navy-900 md:text-5xl">{titre}</h1>
        {intro && <p data-anim="intro" className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{intro}</p>}
      </div>
    </section>
  );
}
