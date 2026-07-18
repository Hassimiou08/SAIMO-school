import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial super admin...");

  const adminEmail = process.env.SAIMO_ADMIN_EMAIL || "admin@saimo-ecole.com";
  const password = "Password123!"; // Change this later
  const hash = await bcrypt.hash(password, 10);

  // Check if admin exists
  const existingAdmin = await prisma.utilisateur.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const etablissement = await prisma.etablissement.create({
      data: {
        nom: "Groupe SAIMO - Etablissement Pilote",
        code: "SAIMO-PILOTE",
        telephone: "+224 000 00 00 00",
        pays: "Guinée",
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

    console.log(`Created Super Admin: ${superAdmin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Etablissement pilote ID: ${etablissement.id}`);
  } else {
    console.log("Admin already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
