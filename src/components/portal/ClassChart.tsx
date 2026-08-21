"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const classes = [
  { name: "6ᵉ A", value: 68, color: "bg-blue-500" },
  { name: "6ᵉ B", value: 74, color: "bg-orange-500" },
  { name: "5ᵉ A", value: 61, color: "bg-blue-500" },
  { name: "5ᵉ B", value: 82, color: "bg-orange-500" },
  { name: "4ᵉ A", value: 70, color: "bg-blue-500" },
  { name: "4ᵉ B", value: 88, color: "bg-orange-500" },
  { name: "3ᵉ A", value: 65, color: "bg-blue-500" },
  { name: "3ᵉ B", value: 91, color: "bg-orange-500" },
];

export function ClassChart() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animer les barres manuellement depuis height 0
    barRefs.current.forEach((el, i) => {
      if (!el) return;
      const targetHeight = classes[i].value;
      gsap.fromTo(
        el,
        { height: "0%" },
        {
          height: `${targetHeight}%`,
          duration: 0.8,
          delay: 0.15 + i * 0.06,
          ease: "power2.out",
        }
      );
    });
  }, []);

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border-2 border-neutral-200 bg-white p-6 shadow-md"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold text-neutral-900">
            Moyenne générale par classe
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            2ᵉ trimestre — toutes matières confondues
          </p>
        </div>
        <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-semibold text-blue-600">
          Moyenne : 74,9 / 100
        </span>
      </div>

      {/* Graphe en barres */}
      <div className="flex items-end gap-3" style={{ height: "200px" }}>
        {classes.map((c, i) => (
          <div key={c.name} className="flex flex-1 flex-col items-center gap-2 h-full">
            {/* Conteneur de barre */}
            <div className="flex w-full items-end h-full">
              <div
                ref={(el) => { barRefs.current[i] = el; }}
                className={`w-full rounded-t-lg ${c.color} transition-all duration-300 hover:opacity-80`}
                style={{ height: "0%" }}
              >
                {/* Valeur au dessus de la barre */}
                <div className="flex justify-center -mt-5">
                  <span className="text-[10px] font-bold text-neutral-600">{c.value}</span>
                </div>
              </div>
            </div>
            {/* Nom de classe */}
            <span className="text-[11px] font-bold text-neutral-600">
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
