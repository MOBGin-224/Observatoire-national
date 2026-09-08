import type { ReactNode } from "react";
import { EtatDonnee } from "@/components/states/EtatDonnee";
import { appliquerM0, appliquerM1 } from "@/lib/masking";
import { resoudreIndicateur } from "@/lib/indicators";
import { formatNombre, formatPourcentage } from "@/lib/format";

/*
 * Un bloc d'indicateur cle (document 9, B.5, zone Z1). Ne connait jamais son
 * libelle en dur : il connait son code et interroge lib/indicators
 * (document 11, section 6.4). `masque` applique la regle M1 quand le module le
 * demande (ex: DEM_BUDGET_RECHERCHE en dessous de 10 recherches filtrees).
 */
export async function BlocIndicateurCle({
  code,
  valeur,
  calculeA,
  masque = false,
  cleLibelleMasque,
  niveauFiabilite,
  pied,
}: {
  code: string;
  valeur: number | null;
  calculeA: string;
  masque?: boolean;
  cleLibelleMasque?: string;
  niveauFiabilite?: string;
  pied?: ReactNode;
}) {
  const meta = await resoudreIndicateur(code);
  const etat = masque ? appliquerM1(valeur, true) : appliquerM0(valeur);

  return (
    <div
      className="flex flex-col gap-1 rounded border p-4"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
    >
      <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
        {meta?.libelleFr ?? code}
      </span>

      <EtatDonnee
        etat={etat}
        statutDonnee={meta?.statutDonnee ?? undefined}
        niveauFiabilite={niveauFiabilite}
        calculeA={calculeA}
        cleLibelleMasque={cleLibelleMasque}
      >
        {(v) => (
          <>
            <span
              style={{
                fontFamily: "var(--font-titre)",
                fontSize: "var(--text-display)",
                fontWeight: 700,
                color: "var(--color-primary)",
              }}
            >
              {meta?.unite === "pourcentage"
                ? formatPourcentage(v, meta?.decimales ?? 1)
                : formatNombre(v, meta?.decimales ?? 0)}
              {meta?.unite && meta.unite !== "pourcentage" && meta.unite !== "entier" && (
                <span style={{ fontSize: "var(--text-small)", fontWeight: 400, marginLeft: "0.25rem" }}>
                  {meta.unite}
                </span>
              )}
            </span>
            {pied}
          </>
        )}
      </EtatDonnee>
    </div>
  );
}
