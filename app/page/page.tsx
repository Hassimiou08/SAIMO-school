import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirection",
};

export default function PageRedirect() {
  // Redirige côté serveur vers la racine
  redirect("/");
}
