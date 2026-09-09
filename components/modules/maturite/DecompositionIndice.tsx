import { EtatVide } from "@/components/states/EtatVide";
import { formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Document 9 ter, I.5 et I.6, zone 3 : les six composantes de MAT_INDICE ne
 * sont pas des indicateurs enregistres au document 4 (seul MAT_INDICE, agrege,
 * l'est) : ce sont des taux de presence bruts, rappeles ici a titre de
 * decomposition methodologique du score, jamais recalcules independamment.
 * Barres horizontales, jamais de camembert ni d'anneau (document 8, 2.5).
 */
const COMPOSANTES = [
  { cle: "presenceLigne", libelle: "Présence en ligne", poids: 20 },
  { cle: "canalReservation", libelle: "Canal de réservation en ligne", poids: 30 },
  { cle: "tarifsPublies", libelle: "Tarifs publiés", poids: 20 },
  { cle: "coordonneesValides", libelle: "Coordonnées jointes valides", poids: 10 },
  { cle: "paiementCarte", libelle: "Paiement par carte", poids: 10 },
  { cle: "paiementMobile", libelle: "Paiement mobile money", poids: 10 },
] as const;

export function DecompositionIndice({
  decomposition,
  effectif,
}: {
  decomposition: Record<(typeof COMPOSANTES)[number]["cle"], number | null>;
  effectif: number;
}) {
  if (effectif === 0) {
    return <EtatVide libelle={t("state.vide.evaluation")} />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {COMPOSANTES.map(({ cle, libelle, poids }) => {
        const taux = decomposition[cle] ?? 0;
        return (
          <div key={cle} className="flex items-center gap-2">
            <span
              className="w-56 shrink-0 truncate"
              style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
            >
              {libelle}
              <span style={{ color: "var(--color-text-muted)" }}> · poids {poids}</span>
            </span>
            <div
              className="h-3 flex-1 rounded"
              style={{ backgroundColor: "var(--color-bg-subtle)" }}
            >
              <div
                className="h-3 rounded"
                style={{ width: `${taux}%`, backgroundColor: "var(--color-primary)" }}
              />
            </div>
            <span
              className="w-14 shrink-0 text-right"
              style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
            >
              {formatPourcentage(taux, 1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
