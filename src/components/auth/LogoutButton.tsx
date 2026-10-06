"use client";

import { useRef } from "react";
import { LogOut } from "lucide-react";
import { actionDeconnexion } from "@/server/actions/auth";
import { viderPagesHorsLigne } from "@/lib/offline/cache";

export function LogoutButton({
  className,
  label = "Déconnexion",
}: {
  className?: string;
  label?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const pret = useRef(false);

  // Les pages enregistrées pour le hors-ligne sont effacées avant de se
  // déconnecter : sinon elles resteraient lisibles hors connexion sur l'appareil.
  const avantEnvoi = (e: React.FormEvent<HTMLFormElement>) => {
    if (pret.current) return;
    e.preventDefault();
    void viderPagesHorsLigne().finally(() => {
      pret.current = true;
      formRef.current?.requestSubmit();
    });
  };

  return (
    <form ref={formRef} action={actionDeconnexion} onSubmit={avantEnvoi} className="w-full">
      <button type="submit" className={className}>
        <LogOut className="h-[18px] w-[18px]" />
        {label}
      </button>
    </form>
  );
}
