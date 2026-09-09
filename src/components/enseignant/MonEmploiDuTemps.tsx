import type { MonCreneau } from "@/server/dal/enseignant";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const HEURES = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

const toMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + (b || 0);
};
const rowFromHeure = (h: string) => {
  const m = toMin(h);
  let idx = 0;
  for (let i = 0; i < HEURES.length; i++) if (toMin(HEURES[i]) <= m) idx = i;
  return idx;
};

const PALETTE = [
  "bg-blue-50 border-blue-200 text-blue-900",
  "bg-orange-50 border-orange-200 text-orange-900",
  "bg-emerald-50 border-emerald-200 text-emerald-900",
  "bg-violet-50 border-violet-200 text-violet-900",
  "bg-rose-50 border-rose-200 text-rose-900",
  "bg-amber-50 border-amber-200 text-amber-900",
];

export function MonEmploiDuTemps({ creneaux }: { creneaux: MonCreneau[] }) {
  if (creneaux.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
        Aucun cours n&rsquo;est programmé pour vous. L&rsquo;emploi du temps est géré par l&rsquo;administration.
      </p>
    );
  }

  const couleurClasse = new Map<string, string>();
  [...new Set(creneaux.map((c) => c.classe))].sort().forEach((n, i) => {
    couleurClasse.set(n, PALETTE[i % PALETTE.length]);
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
      <div
        className="grid min-w-[760px]"
        style={{
          gridTemplateColumns: `56px repeat(${JOURS.length}, minmax(0,1fr))`,
          gridTemplateRows: `36px repeat(${HEURES.length}, 52px)`,
        }}
      >
        <div className="border-b border-r border-neutral-100 bg-neutral-50" />
        {JOURS.map((j) => (
          <div
            key={j}
            className="flex items-center justify-center border-b border-r border-neutral-100 bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500"
          >
            {j}
          </div>
        ))}
        {HEURES.map((h, ri) => (
          <FragmentRow key={h} h={h} ri={ri} />
        ))}
        {creneaux.map((c) => {
          const r = rowFromHeure(c.heureDebut);
          const dur = Math.max(60, toMin(c.heureFin) - toMin(c.heureDebut));
          const span = Math.max(1, Math.round(dur / 60));
          const couleur = couleurClasse.get(c.classe) ?? PALETTE[0];
          return (
            <div
              key={c.id}
              style={{ gridColumn: c.jour + 1, gridRow: `${r + 2} / span ${span}` }}
              className={`m-1 flex flex-col justify-between rounded-lg border p-2 text-[11px] leading-tight ${couleur}`}
            >
              <div>
                <p className="font-bold">{c.matiere}</p>
                <p className="opacity-70">{c.classe}</p>
              </div>
              <p className="mt-0.5 font-mono opacity-60">
                {c.heureDebut}–{c.heureFin}
                {c.salle ? ` · ${c.salle}` : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FragmentRow({ h, ri }: { h: string; ri: number }) {
  return (
    <>
      <div
        style={{ gridColumn: 1, gridRow: ri + 2 }}
        className="flex items-start justify-end border-r border-neutral-100 pr-2 pt-1 font-mono text-[10px] text-neutral-400"
      >
        {h}
      </div>
      {JOURS.map((_, ci) => (
        <div
          key={ci}
          style={{ gridColumn: ci + 2, gridRow: ri + 2 }}
          className="border-b border-r border-neutral-100"
        />
      ))}
    </>
  );
}
