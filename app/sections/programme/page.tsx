import { SectionPage } from "@/components/SectionPage";

export default function ProgrammePage() {
  return (
    <SectionPage
      eyebrow="Programme"
      title="Un parcours scolaire clair, progressif et adapté à chaque niveau"
      description="SAIMO propose une progression pédagogique fluide, pensée pour accompagner les élèves du préscolaire au secondaire avec des outils de suivi, d’orientation et de communication efficaces. Chaque cycle bénéficie d’un cadre clair, d’objectifs maîtrisés et d’un accompagnement cohérent pour les enseignants, les familles et la direction."
      media={
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-primary-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt="Classe scolaire moderne avec élèves et enseignant"
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-[1.5rem] border border-primary-200 bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Illustration</p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Un environnement d’apprentissage structuré, vivant et adapté à chaque profil d’élève.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-navy-900">Valorisation des parcours</p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Les progrès sont suivis avec clarté pour aider chaque enfant à avancer à son rythme.
              </p>
            </div>
          </div>
        </div>
      }
      bullets={[
        "Organisation pédagogique alignée sur les besoins de chaque cycle",
        "Suivi des performances, des absences et des progrès individuels",
        "Tableaux de bord lisibles pour piloter l’année scolaire avec simplicité",
      ]}
      ctaLabel="Retour à l’accueil"
      ctaHref="/"
    >
      <div className="mt-10 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Un cadre pédagogique cohérent</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Les programmes sont structurés autour d’objectifs pédagogiques précis, d’un rythme d’apprentissage adapté et d’un repérage rapide des besoins de chaque élève.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-600">
              <li>• Progression harmonisée entre les classes et les niveaux.</li>
              <li>• Mise en place d’outils de suivi simple et fiable.</li>
              <li>• Meilleure visibilité sur l’avancement scolaire.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Un accompagnement pour toute l’équipe</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Les enseignants gagnent en clarté, la direction obtient une vision globale et les familles participent plus facilement au suivi de l’élève.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-3 text-sm text-ink-600">Pilotage pédagogique plus fluide</div>
              <div className="rounded-xl bg-white/80 p-3 text-sm text-ink-600">Communication institutionnelle renforcée</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-navy-900 p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">Des bénéfices concrets à chaque étape</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-4 text-sm text-slate-100">Meilleure organisation des parcours scolaires</div>
            <div className="rounded-xl bg-white/10 p-4 text-sm text-slate-100">Suivi plus rapide des difficultés et des progrès</div>
            <div className="rounded-xl bg-white/10 p-4 text-sm text-slate-100">Une vision claire pour mieux orienter l’élève</div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
