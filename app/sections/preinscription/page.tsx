import { SectionPage } from "@/components/SectionPage";

export default function PreinscriptionPage() {
  return (
    <SectionPage
      eyebrow="Préinscription"
      title="Une préinscription simple, rapide et rassurante"
      description="Le parcours de préinscription a été pensé pour être accessible, clair et efficace. Il permet aux familles de déposer leurs informations en toute confiance, tandis que l’équipe scolaire peut suivre chaque demande avec sérénité et réactivité."
      media={
        <div className="overflow-hidden rounded-[1.5rem] border border-primary-200 bg-white shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80"
            alt="Famille et enfant préparant un dossier scolaire"
            className="h-72 w-full object-cover"
            loading="lazy"
          />
        </div>
      }
      bullets={[
        "Formulaire simple et guidé, sans étapes inutiles",
        "Réception des demandes centralisée pour un traitement plus fluide",
        "Suivi clair des prochaines étapes avec l’équipe pédagogique",
      ]}
      ctaLabel="Retour à l’accueil"
      ctaHref="/"
    >
      <div className="mt-10 space-y-4">
        <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Pourquoi ce parcours est apprécié</h2>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            Grâce à une démarche intuitive, les familles gagnent du temps et l’établissement bénéficie d’un traitement plus organisé et plus transparent des demandes.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-primary-50/70 p-4 text-sm text-ink-600">Demande structurée et complète dès le départ</div>
            <div className="rounded-xl bg-primary-50/70 p-4 text-sm text-ink-600">Suivi plus rapide et plus rassurant pour les familles</div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Les points forts de la démarche</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white/80 p-4 text-sm text-ink-600">1. Une procédure simple à comprendre</div>
            <div className="rounded-xl bg-white/80 p-4 text-sm text-ink-600">2. Un suivi clair à chaque étape</div>
            <div className="rounded-xl bg-white/80 p-4 text-sm text-ink-600">3. Un accompagnement plus rassurant pour les familles</div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
