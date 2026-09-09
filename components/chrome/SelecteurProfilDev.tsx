"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { basculerProfilDev } from "@/lib/actions/dev-profil";
import type { ValeurEnumeration } from "@/lib/enumerations";
import { t } from "@/lib/i18n";

/*
 * Selecteur de profil, developpement uniquement (voir lib/actions/dev-profil.ts).
 * Le composant n'est rendu que si le layout lui passe une liste non vide, et
 * l'action serveur refuse de toute facon toute bascule hors developpement : le
 * verrou reel est cote serveur, celui-ci n'est que l'affichage.
 *
 * Bordure pointillee, comme le bouton d'aide TOTP de l'ecran de connexion : la
 * meme convention visuelle signale partout un element qui n'appartient pas au
 * produit livre.
 */
export function SelecteurProfilDev({
  profilCourant,
  profils,
}: {
  profilCourant: string;
  profils: ValeurEnumeration[];
}) {
  const router = useRouter();
  const identifiant = useId();
  const [enCours, demarrer] = useTransition();
  const [motifEchec, setMotifEchec] = useState<string | null>(null);

  function changer(profil: string) {
    if (profil === profilCourant) return;
    setMotifEchec(null);
    demarrer(async () => {
      const resultat = await basculerProfilDev(profil);
      if (!resultat.succes) {
        // Le motif technique reste visible en survol : sans lui, un refus de
        // bascule oblige a fouiller les journaux du serveur pour rien.
        setMotifEchec(resultat.motif ?? "inconnu");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center rounded border border-dashed"
      style={{
        gap: "var(--space-2)",
        padding: "var(--space-1) var(--space-2)",
        borderColor: "var(--color-border-strong)",
      }}
      title={motifEchec ? `${t("dev.profil.echec")} : ${motifEchec}` : t("dev.profil.infobulle")}
    >
      <label
        htmlFor={identifiant}
        className="etiquette"
        style={{ color: "var(--color-text-muted)" }}
      >
        {motifEchec ? t("dev.profil.echec") : t("dev.profil.etiquette")}
      </label>
      <select
        id={identifiant}
        value={profilCourant}
        disabled={enCours}
        onChange={(evenement) => changer(evenement.target.value)}
        style={{
          fontSize: "var(--text-meta)",
          fontWeight: 500,
          color: "var(--color-text)",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        {profils.map((profil) => (
          <option key={profil.code} value={profil.code}>
            {profil.libelleFr}
          </option>
        ))}
      </select>
    </div>
  );
}
