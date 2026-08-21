"use client";

import { useState } from "react";
import { Plus, UserPlus, ShieldAlert, X } from "lucide-react";
import { utilisateurs as mockUtilisateurs } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function UtilisateursPage() {
  const [data, setData] = useState(mockUtilisateurs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nom: "", email: "", role: "Enseignant" });
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Utilisateurs & Rôles</h1>
              <p className="mt-1 text-sm text-ink-500">Gérez les accès du personnel à la plateforme SAIMO.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <UserPlus className="h-4 w-4" /> Inviter un utilisateur
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3.5 font-semibold">Nom & Email</th>
                  <th className="px-5 py-3.5 font-semibold">Rôle</th>
                  <th className="px-5 py-3.5 font-semibold">Dernier accès</th>
                  <th className="px-5 py-3.5 font-semibold">Statut</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200">
                {data.map(u => (
                  <tr key={u.id} className="hover:bg-blue-50/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 font-bold text-neutral-500 text-xs">
                          {u.nom.split(" ").map(p => p[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{u.nom}</p>
                          <p className="text-xs text-neutral-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700">
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-neutral-500">{new Date(u.dernierAcces).toLocaleDateString("fr-FR")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${u.statut === "Actif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-xs font-semibold text-red-600 hover:underline">Suspendre</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Inviter un utilisateur</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nom complet</label>
                <input type="text" value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})} placeholder="Ex: Fatoumata Bah" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Adresse email</label>
                <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="Ex: f.bah@saimo.com" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Rôle d'accès</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400">
                  <option>Admin_Super</option>
                  <option>Admin_Scolarite</option>
                  <option>Comptable</option>
                  <option>Enseignant</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([{
                      id: Date.now().toString(),
                      nom: newUser.nom,
                      email: newUser.email,
                      role: newUser.role as any,
                      statut: "Actif",
                      dernierAcces: new Date().toISOString()
                    }, ...data]);
                    setIsModalOpen(false);
                    setNewUser({ nom: "", email: "", role: "Enseignant" });
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Envoyer l'invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
