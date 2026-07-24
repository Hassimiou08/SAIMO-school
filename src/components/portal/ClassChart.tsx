"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const classes = [
  { name: "6ᵉ A", value: 68 },
  { name: "6ᵉ B", value: 74 },
  { name: "5ᵉ A", value: 61 },
  { name: "5ᵉ B", value: 82 },
  { name: "4ᵉ A", value: 70 },
  { name: "4ᵉ B", value: 88 },
  { name: "3ᵉ A", value: 65 },
  { name: "3ᵉ B", value: 91 },
];

export function ClassChart() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".chart-bar", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.2,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-navy-900/5 bg-white p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold text-navy-900">
            Moyenne générale par classe
          </h3>
          <p className="mt-0.5 text-xs text-ink-500">
            2ᵉ trimestre — toutes matières confondues
          </p>
        </div>
        <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-600">
          Moyenne établissement : 74,9/100
        </span>
      </div>

      <div className="flex h-48 items-end gap-3">
        {classes.map((c) => (
          <div key={c.name} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end">
              <div
                className="chart-bar w-full rounded-t-md bg-gradient-to-t from-blue-600 to-teal-400"
                style={{ height: `${c.value}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-ink-500">
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
