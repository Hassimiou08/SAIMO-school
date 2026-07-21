import { SectionPage } from "@/components/SectionPage";

export default function ContactPage() {
  return (
    <SectionPage
      eyebrow="Contact"
      title="Nous sommes à votre écoute pour accompagner votre projet"
      description="Que vous soyez directeur d’établissement, enseignant, famille ou partenaire, notre équipe reste disponible pour répondre à vos questions, vous présenter SAIMO et vous accompagner dans votre démarche."
      media={
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-primary-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Équipe de soutien en discussion avec un client"
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-primary-200 bg-white shadow-sm">
            <iframe
              src="https://www.youtube.com/embed/ScMzIvxBSi4?rel=0"
              title="Présentation de SAIMO"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-72 w-full"
            />
          </div>
        </div>
      }
      bullets={[
        "Réponse rapide à vos demandes et à vos questions",
        "Prise de rendez-vous facilitée pour une présentation personnalisée",
        "Accompagnement sur mesure selon vos besoins spécifiques",
      ]}
      ctaLabel="Retour à l’accueil"
      ctaHref="/"
    >
      <div className="mt-10 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Une équipe disponible</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Nous vous aidons à mieux comprendre les solutions SAIMO et à choisir la meilleure approche pour votre école.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Un échange personnalisé</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Chaque demande est étudiée avec attention pour fournir une réponse adaptée à votre contexte.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Prêt à démarrer ?</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Contactez-nous pour organiser un échange rapide et découvrir comment SAIMO peut soutenir votre établissement.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Pourquoi nous contacter ?</h2>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            Parce que chaque établissement a ses propres besoins, et que notre objectif est de vous proposer une réponse claire, concrète et évolutive.
          </p>
        </div>
      </div>
    </SectionPage>
  );
}
