import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { NouvelleInscriptionForm } from "@/components/portal/NouvelleInscriptionForm";
import { listerClassesDTO } from "@/server/dal/classes";

export const metadata: Metadata = {
  title: "Nouvelle inscription — Portail SAIMO",
};

export default async function NouvelleInscriptionPage() {
  const classes = await listerClassesDTO();

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <NouvelleInscriptionForm classes={classes} />
      </div>
    </div>
  );
}
