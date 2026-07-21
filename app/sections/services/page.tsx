import { SectionPage } from "@/components/SectionPage";

export default function ServicesPage() {
  return (
    <SectionPage
      eyebrow="Services"
      title="Des services complets pour une école plus performante"
      description="SAIMO centralise la gestion quotidienne de l’établissement grâce à des services conçus pour simplifier l’administration, renforcer la communication et améliorer le suivi des élèves. L’objectif est de libérer du temps aux équipes tout en offrant un niveau de service plus élevé aux familles et aux enseignants."
      media={
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-primary-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
              alt="Équipe de direction et enseignants autour d’un tableau de bord"
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="rounded-[1.5rem] border border-primary-200 bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Services intégrés</p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Une vue globale de l’établissement, des données plus fiables et une meilleure réactivité au quotidien.
            </p>
            <div className="mt-4 rounded-2xl bg-primary-50/70 p-4 text-sm text-ink-600">
              Les services sont pensés pour gagner du temps, sécuriser les informations et simplifier les routines administratives.
            </div>
          </div>
        </div>
      }
      bullets={[
        "Gestion centralisée des inscriptions, documents et dossiers élèves",
        "Communication fluide entre direction, enseignants et familles",
        "Outils d’organisation adaptés à chaque niveau scolaire et à chaque besoin",
      ]}
      ctaLabel="Retour à l’accueil"
      ctaHref="/"
    >
      <div className="mt-10 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Pilotage administratif</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Organisez les dossiers, les inscriptions et les procédures de manière claire et sécurisée.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Communication parentale</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Facilitez les échanges, les rappels et les informations importantes avec les familles.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Suivi et visibilité</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Obtenez une vue d’ensemble sur les absences, les performances et l’activité de l’école.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Pourquoi centraliser vos services ?</h2>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            Une solution unique permet d’uniformiser les pratiques, d’améliorer la réactivité et de réduire le temps perdu dans la gestion manuelle des informations.
          </p>
          <ul className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-ink-600">
            <li>• Gain de temps pour les équipes administratives.</li>
            <li>• Meilleure traçabilité des dossiers et des décisions.</li>
            <li>• Communication plus fluide avec les familles.</li>
            <li>• Une vision globale plus simple à piloter.</li>
          </ul>
        </div>
      </div>
    </SectionPage>
  );
}
