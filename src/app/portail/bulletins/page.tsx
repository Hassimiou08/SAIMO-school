import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { BulletinsManager } from "@/components/portal/BulletinsManager";
import { listerBulletins, etatPreparationBulletins } from "@/server/dal/bulletins";
import { listerPeriodes } from "@/server/dal/evaluations";
import { listerClassesOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Bulletins — Portail SAIMO" };

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string }>;
}) {
  const sp = await searchParams;
  const [bulletins, classes, periodes] = await Promise.all([
    listerBulletins({ classeId: sp.classe, periodeId: sp.periode }),
    listerClassesOptions(),
    listerPeriodes(),
  ]);
  const etat =
    sp.classe && sp.periode
      ? await etatPreparationBulletins(sp.classe, sp.periode)
      : null;

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Bulletins</h1>
            <p className="mt-1 text-sm text-ink-500">Génération, validation et publication des bulletins.</p>
          </div>
          <BulletinsManager
            bulletins={bulletins}
            classes={classes}
            periodes={periodes}
            filtreClasse={sp.classe}
            filtrePeriode={sp.periode}
            etat={etat}
          />
        </main>
      </div>
    </div>
  );
}
