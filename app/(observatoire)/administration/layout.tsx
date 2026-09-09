import { redirect } from "next/navigation";
import { chargerMonCompte } from "@/lib/queries/compte";

/*
 * Document 9bis H.6 + H.7.1 : un compte institutionnel, quel que soit son
 * profil, ne peut accéder à aucune adresse de M11_ADMIN, même en saisie
 * directe. Défense en profondeur : les policies RLS (migration 30) bloquent
 * déjà toute lecture/écriture côté base pour un compte non-ADMIN.
 */
export default async function LayoutAdministration({ children }: { children: React.ReactNode }) {
  const compte = await chargerMonCompte();

  if (!compte || compte.profil !== "ADMIN") {
    redirect("/synthese");
  }

  return <>{children}</>;
}
