"use client";

import { createContext, useContext } from "react";
import type { EnfantResume } from "@/server/dal/parent";

interface EnfantsCtx {
  enfants: EnfantResume[];
  estEleve: boolean;
}

const Ctx = createContext<EnfantsCtx>({ enfants: [], estEleve: false });

export function EnfantsProvider({
  value,
  children,
}: {
  value: EnfantsCtx;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEnfants() {
  return useContext(Ctx);
}
