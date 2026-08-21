import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { bulletins } from "@/lib/mock-bulletins";

export const metadata: Metadata = {
  title: "Détail du Bulletin — Portail SAIMO",
  description: "Vue détaillée et impression du bulletin de l'élève.",
};

export default async function BulletinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bulletin = bulletins.find(b => b.id === resolvedParams.id) || bulletins[0];

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/portail/bulletins" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-blue-600 transition">
              <ArrowLeft className="h-4 w-4" /> Retour aux bulletins
            </Link>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50">
                <Download className="h-4 w-4" /> Télécharger PDF
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm shadow-blue-600/20">
                <Printer className="h-4 w-4" /> Imprimer
              </button>
            </div>
          </div>

          {/* Bulletin Paper - Printable Area */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-10 print:shadow-none print:border-none print:p-0">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-neutral-800 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">SAIMO Ecole</h1>
                <p className="text-sm text-neutral-500 mt-1">Excellence & Réussite</p>
                <div className="mt-4 space-y-1 text-sm text-neutral-700">
                  <p><strong>Élève :</strong> {bulletin.eleve}</p>
                  <p><strong>Classe :</strong> {bulletin.classe}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-blue-900 uppercase">Bulletin Trimestriel</h2>
                <p className="text-sm font-medium text-neutral-500 mt-1">{bulletin.periode} - Année 2026/2027</p>
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100 inline-block text-left min-w-[200px]">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Moyenne Générale</p>
                  <p className="text-3xl font-black text-neutral-900 mt-1">{bulletin.moyenne.toFixed(2).replace(".", ",")} <span className="text-lg text-neutral-400 font-medium">/ 20</span></p>
                  <p className="text-sm font-medium text-neutral-600 mt-1 border-t border-neutral-200 pt-1">Rang : {bulletin.rang} / {bulletin.effectif}</p>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-xs uppercase tracking-wide text-neutral-700">
                  <th className="p-3 border border-neutral-200 font-bold">Matière</th>
                  <th className="p-3 border border-neutral-200 font-bold text-center w-24">Coef.</th>
                  <th className="p-3 border border-neutral-200 font-bold text-center w-24">Moyenne</th>
                  <th className="p-3 border border-neutral-200 font-bold">Appréciation du professeur</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-800">
                <tr>
                  <td className="p-3 border border-neutral-200 font-medium">Mathématiques</td>
                  <td className="p-3 border border-neutral-200 text-center text-neutral-500">4</td>
                  <td className="p-3 border border-neutral-200 text-center font-bold">16,50</td>
                  <td className="p-3 border border-neutral-200 text-neutral-600 italic">Excellent trimestre. Continuez ainsi.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-neutral-200 font-medium">Français</td>
                  <td className="p-3 border border-neutral-200 text-center text-neutral-500">3</td>
                  <td className="p-3 border border-neutral-200 text-center font-bold">14,00</td>
                  <td className="p-3 border border-neutral-200 text-neutral-600 italic">Bon travail, participe activement en classe.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-neutral-200 font-medium">Histoire-Géographie</td>
                  <td className="p-3 border border-neutral-200 text-center text-neutral-500">2</td>
                  <td className="p-3 border border-neutral-200 text-center font-bold">15,00</td>
                  <td className="p-3 border border-neutral-200 text-neutral-600 italic">Résultats très satisfaisants.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-neutral-200 font-medium">Sciences Physiques</td>
                  <td className="p-3 border border-neutral-200 text-center text-neutral-500">3</td>
                  <td className="p-3 border border-neutral-200 text-center font-bold">12,50</td>
                  <td className="p-3 border border-neutral-200 text-neutral-600 italic">Ensemble correct mais peut mieux faire avec plus de rigueur.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-neutral-200 font-medium">Anglais</td>
                  <td className="p-3 border border-neutral-200 text-center text-neutral-500">2</td>
                  <td className="p-3 border border-neutral-200 text-center font-bold">17,00</td>
                  <td className="p-3 border border-neutral-200 text-neutral-600 italic">Très bon niveau à l'écrit comme à l'oral.</td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-sm">
              <div className="text-center">
                <p className="font-bold text-neutral-700 uppercase mb-12">Le Professeur Principal</p>
                <div className="border-b border-neutral-300 w-32 mx-auto"></div>
              </div>
              <div className="text-center">
                <p className="font-bold text-neutral-700 uppercase mb-12">Le Directeur</p>
                <div className="border-b border-neutral-300 w-32 mx-auto"></div>
              </div>
              <div className="text-center">
                <p className="font-bold text-neutral-700 uppercase mb-12">Signature des Parents</p>
                <div className="border-b border-neutral-300 w-32 mx-auto"></div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
