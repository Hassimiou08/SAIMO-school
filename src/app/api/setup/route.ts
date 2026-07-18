import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const adminEmail = process.env.SAIMO_ADMIN_EMAIL || "admin@saimo-ecole.com";
  const password = "Password123!";
  const hash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.utilisateur.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    return NextResponse.json({ message: "Admin existe déjà.", email: adminEmail, password });
  }

  const etablissement = await prisma.etablissement.create({
    data: {
      nom: "Groupe SAIMO - Etablissement Pilote",
      code: "SAIMO-PILOTE",
      telephone: "+224 000 00 00 00",
      pays: "Guinée",
      formatMatricule: "ANNEE-SEQ",
    }
  });

  const annee = await prisma.anneeScolaire.create({
    data: {
      etablissementId: etablissement.id,
      libelle: "2025-2026",
      dateDebut: new Date("2025-09-01"),
      dateFin: new Date("2026-06-30"),
      active: true,
    }
  });

  const superAdmin = await prisma.utilisateur.create({
    data: {
      email: adminEmail,
      motDePasseHash: hash,
      prenom: "Mohamed Hassimiou",
      nom: "Soumah",
      emailVerifie: true,
      etablissements: {
        create: {
          etablissementId: etablissement.id,
          role: "SUPER_ADMIN_SAIMO",
          actif: true,
        }
      }
    }
  });

  return NextResponse.json({
    message: "Système initialisé avec succès !",
    email: superAdmin.email,
    password: password,
    etablissement: etablissement.nom,
    anneeScolaire: annee.libelle
  });
}
