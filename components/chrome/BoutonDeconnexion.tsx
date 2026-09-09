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
    const supabase = createClient();
    await supabase.auth.signOut();
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
