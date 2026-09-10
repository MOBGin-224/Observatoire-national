"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";
import { Icone } from "./Icone";

/*
 * Déconnexion, posée en pied de navigation latérale et non dans l'en-tête.
 * Elle appartient à la colonne de session, avec le compte et l'attribution,
 * pas à la barre qui porte le titre du produit.
 *
 * Comme les entrées de module, elle rend son icône et son libellé, et c'est le
 * CSS qui décide lequel s'affiche selon l'état du rail.
 */
export function BoutonDeconnexion() {
  const router = useRouter();

  async function seDeconnecter() {
    /*
     * L'echec de signOut ne doit rien empecher : si le jeton est deja invalide
     * ou le reseau coupe, l'utilisateur doit tout de meme quitter l'ecran. Le
     * proxy refusera la session au prochain passage.
     */
    try {
      await createClient().auth.signOut();
    } catch {
      /* Session deja fermee cote serveur : le retour a l'accueil suffit. */
    }
    router.push("/");
    router.refresh();
  }

  const libelle = t("nav.deconnexion");

  return (
    <button
      onClick={seDeconnecter}
      data-impression="masquer"
      title={libelle}
      aria-label={libelle}
      className="entree-navigation"
      style={{ color: "var(--color-on-primary-muted)", fontSize: "var(--text-body)" }}
    >
      <Icone nom="deconnexion" />
      <span className="rail-deplie truncate">{libelle}</span>
    </button>
  );
}
