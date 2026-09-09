"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { MoyenneClasse } from "@/server/dal/dashboard";

export function ClassChart({
  classes,
  moyenneGenerale,
}: {
  classes: MoyenneClasse[];
  moyenneGenerale: number | null;
}) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const data = classes.filter((c) => c.value != null) as (MoyenneClasse & {
    value: number;
  })[];

  useEffect(() => {
    barRefs.current.forEach((el, i) => {
      if (!el || !data[i]) return;
      gsap.fromTo(
        el,
        { height: "0%" },
        {
          height: `${(data[i].value / 20) * 100}%`,
          duration: 0.8,
          delay: 0.15 + i * 0.06,
          ease: "power2.out",
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  return (
    <div className="rounded-2xl border-2 border-neutral-200 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold text-neutral-900">
            Moyenne générale par classe
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            D&rsquo;après les bulletins validés
          </p>
        </div>
        <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-semibold text-blue-600">
          {moyenneGenerale != null
            ? `Moyenne : ${moyenneGenerale.toFixed(1).replace(".", ",")} / 20`
            : "Aucun bulletin"}
        </span>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-neutral-400">
          Aucune moyenne disponible. Générez et validez des bulletins pour voir les
          statistiques.
        </p>
      ) : (
        <div className="flex items-end gap-3" style={{ height: "200px" }}>
          {data.map((c, i) => (
            <div key={c.nom} className="flex flex-1 flex-col items-center gap-2 h-full">
              <div className="flex w-full items-end h-full">
                <div
                  ref={(el) => { barRefs.current[i] = el; }}
                  className={`w-full rounded-t-lg ${i % 2 ? "bg-orange-500" : "bg-blue-500"} transition-all duration-300 hover:opacity-80`}
                  style={{ height: "0%" }}
                >
                  <div className="flex justify-center -mt-5">
                    <span className="text-[10px] font-bold text-neutral-600">
                      {c.value.toFixed(1).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-600">{c.nom}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
