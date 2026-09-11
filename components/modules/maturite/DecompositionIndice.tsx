import { EtatVide } from "@/components/states/EtatVide";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { CleComposante } from "@/lib/queries/maturite";

/*
 * Zone 3 de M6_MATURITE (document 9 ter, I.5, I.8, criteres I.11.3 et I.11.4).
 *
 * Les six composantes de MAT_INDICE, chacune avec son poids et la part des
 * etablissements qui la possedent. Parts et poids viennent de la vue : rien
 * n'est recalcule ici, et le poids affiche est celui qui a servi au score.
 *
 * Une echelle fixe de zero a cent pour les six barres. C'est ce qui rend
 * visible d'un coup d'oeil la situation guineenne typique (I.8) : une presence
 * en ligne elevee et une reservabilite nulle, une offre visible mais pas
 * reservable.
 *
 * Les deux composantes de paiement portent leur effectif renseigne. Tant que
 * les equipements ne sont pas collectes, une part faible veut dire "non
 * renseigne", pas "absent" (document 16, C.2) : le dire sous la barre evite
 * qu'elle se lise comme un constat.
 */
const COMPOSANTES: { cle: CleComposante; libelle: string; paiement: boolean }[] = [
  { cle: "presenceLigne", libelle: "m6.comp.presence", paiement: false },
  { cle: "canalReservation", libelle: "m6.comp.reservation", paiement: false },
  { cle: "tarifsPublies", libelle: "m6.comp.tarifs", paiement: false },
  { cle: "coordonneesValides", libelle: "m6.comp.contact", paiement: false },
  { cle: "paiementCarte", libelle: "m6.comp.carte", paiement: true },
  { cle: "paiementMobile", libelle: "m6.comp.mobile", paiement: true },
];

export function DecompositionIndice({
  decomposition,
  ponderation,
  effectif,
  effectifCarteRenseigne,
  effectifMobileRenseigne,
}: {
  decomposition: Record<CleComposante, number | null>;
  ponderation: Record<CleComposante, number | null>;
  effectif: number;
  effectifCarteRenseigne: number;
  effectifMobileRenseigne: number;
}) {
  if (effectif === 0) {
    return <EtatVide libelle={t("state.vide.evaluation")} />;
  }

  const renseigne: Partial<Record<CleComposante, number>> = {
    paiementCarte: effectifCarteRenseigne,
    paiementMobile: effectifMobileRenseigne,
  };

  return (
    <ul className="flex flex-col" style={{ gap: "var(--space-4)" }}>
      {COMPOSANTES.map(({ cle, libelle, paiement }) => {
        const taux = decomposition[cle];
        const poids = ponderation[cle];
        const largeur = Math.max(0, Math.min(100, taux ?? 0));
        return (
          <li key={cle} className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <div className="flex items-baseline justify-between" style={{ gap: "var(--space-3)" }}>
              <span style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text)" }}>
                {t(libelle)}
                {poids !== null && (
                  <span
                    className="chiffres-tabulaires"
                    style={{
                      marginLeft: "var(--space-2)",
                      fontWeight: 400,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {t("m6.comp.poids", { n: poids })}
                  </span>
                )}
              </span>
              <span
                className="chiffres-tabulaires shrink-0"
                style={{ fontSize: "var(--text-small)", fontWeight: 700, color: "var(--color-primary-700)" }}
              >
                {taux === null ? t("state.non_renseigne") : formatPourcentage(taux, 1)}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="h-3 w-full"
              style={{ backgroundColor: "var(--color-bg-panel)", borderRadius: "2px" }}
            >
              <div
                className="h-3"
                style={{
                  width: `${largeur}%`,
                  minWidth: largeur > 0 ? "2px" : 0,
                  borderRadius: "2px",
                  backgroundColor: "var(--color-primary-700)",
                }}
              />
            </div>
            {paiement && (
              <span
                className="chiffres-tabulaires"
                style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}
              >
                {t("m6.comp.renseigne", {
                  n: formatNombre(renseigne[cle] ?? 0),
                  total: formatNombre(effectif),
                })}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
