"use client";

import { LogOut } from "lucide-react";
import { actionDeconnexion } from "@/server/actions/auth";

export function LogoutButton({
  className,
  label = "Déconnexion",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form action={actionDeconnexion} className="w-full">
      <button type="submit" className={className}>
        <LogOut className="h-[18px] w-[18px]" />
        {label}
      </button>
    </form>
  );
}
