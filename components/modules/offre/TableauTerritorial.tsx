import { createClient } from "@/lib/supabase/server";
import { EtatVide } from "@/components/states/EtatVide";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { LigneOffre } from "@/lib/queries/offre";

/*
 * Z4, tableau des territoires enfants (document 9, B.5/B.7). Tri sur toute
 * colonne et clic pour descendre d'un niveau : a construire une fois qu'un
 * vrai referentiel territorial existe (document 2, section 20, point ouvert).
 * En l'etat, la table observatoire.territoire est vide, donc cette zone est
 * volontairement en etat 3 (vide) et non une erreur.
 */
export async function TableauTerritorial({ lignes }: { lignes: LigneOffre[] }) {
  if (lignes.length === 0) {
    return <EtatVide libelle={t("state.vide.subdivision")} />;
  }

  const supabase = await createClient();
  const codes = lignes.map((l) => l.codeTerritoire).filter((c): c is string => !!c);
  const { data: territoires } = await supabase
    .from("territoire")
    .select("code, libelle")
    .in("code", codes);
  const libelleParCode = new Map((territoires ?? []).map((tr) => [tr.code, tr.libelle]));

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ fontSize: "var(--text-small)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
            {[
              "Territoire",
              "Établ.",
              "Capacité",
              "Partenaires",
              "Couverture",
              "Numérisation",
              "Réservabilité",
              "Vérification",
            ].map((colonne) => (
              <th
                key={colonne}
                className="px-2 py-1.5 text-left"
                style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}
              >
                {colonne}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne.codeTerritoire} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td className="px-2 py-1.5">
                {ligne.codeTerritoire ? libelleParCode.get(ligne.codeTerritoire) ?? ligne.codeTerritoire : "—"}
              </td>
              <td className="px-2 py-1.5">{formatNombre(ligne.offEtabRecenses)}</td>
              <td className="px-2 py-1.5">{formatNombre(ligne.offCapaciteRecensee)}</td>
              <td className="px-2 py-1.5">{formatNombre(ligne.offEtabPartenaires)}</td>
              <td className="px-2 py-1.5">
                {ligne.offTauxCouverture !== null ? formatPourcentage(ligne.offTauxCouverture) : "—"}
              </td>
              <td className="px-2 py-1.5">
                {ligne.offTauxNumerisation !== null ? formatPourcentage(ligne.offTauxNumerisation) : "—"}
              </td>
              <td className="px-2 py-1.5">
                {ligne.offTauxReservabilite !== null ? formatPourcentage(ligne.offTauxReservabilite) : "—"}
              </td>
              <td className="px-2 py-1.5">
                {ligne.offTauxVerification !== null ? formatPourcentage(ligne.offTauxVerification) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
