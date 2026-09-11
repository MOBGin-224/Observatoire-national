import { EtatVide } from "@/components/states/EtatVide";
import { listerEnumeration } from "@/lib/enumerations";
import { formatDate, formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { DemandeFenetre } from "@/lib/queries/evenementiel";

/* Les deux statuts qui documentent un deficit de capacite nationale (document 2, 13.2). */
const STATUTS_SIGNALES = new Set(["NON_SATISFAITE", "PARTIELLEMENT_SATISFAITE"]);

/*
 * Zone 7 de M7_EVENEMENTIEL (document 9 ter, J.6 et J.8) : les demandes
 * institutionnelles dont les dates chevauchent la fenetre.
 *
 * L'ecart entre unites demandees et couvertes est mis en evidence, et une
 * demande non ou partiellement satisfaite est signalee, par la graisse et non
 * par la couleur : --color-alert est reserve au seul depassement de capacite
 * (J.10). Aucun etablissement n'y figure, seulement des besoins declares.
 */
export async function TableauDemandes({ lignes }: { lignes: DemandeFenetre[] }) {
  if (lignes.length === 0) {
    return <EtatVide libelle={t("state.vide.demande_institutionnelle")} />;
  }

  const [types, statuts] = await Promise.all([
    listerEnumeration("TYPE_DEMANDE_INST"),
    listerEnumeration("STATUT_DEMANDE_INST"),
  ]);
  const libelleType = new Map(types.map((valeur) => [valeur.code, valeur.libelleFr]));
  const libelleStatut = new Map(statuts.map((valeur) => [valeur.code, valeur.libelleFr]));

  const colonnes = [
    { cle: "libelle", libelle: t("m7.z7.col.libelle"), droite: false },
    { cle: "type", libelle: t("m7.z7.col.type"), droite: false },
    { cle: "dates", libelle: t("m7.z7.col.dates"), droite: false },
    { cle: "demandees", libelle: t("m7.z7.col.demandees"), droite: true },
    { cle: "couvertes", libelle: t("m7.z7.col.couvertes"), droite: true },
    { cle: "statut", libelle: t("m7.z7.col.statut"), droite: false },
  ];

  const nonRenseigne = t("state.non_renseigne");

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ fontSize: "var(--text-small)", lineHeight: 1.4 }}>
        <thead>
          <tr style={{ backgroundColor: "var(--color-primary-700)" }}>
            {colonnes.map((colonne) => (
              <th
                key={colonne.cle}
                scope="col"
                style={{
                  padding: "var(--space-3)",
                  textAlign: colonne.droite ? "right" : "left",
                  fontFamily: "var(--font-texte)",
                  fontSize: "var(--text-label)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--color-on-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {colonne.libelle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((demande, rang) => {
            const ecart =
              demande.demandees !== null && demande.couvertes !== null
                ? demande.demandees - demande.couvertes
                : null;
            const signalee = demande.statut !== null && STATUTS_SIGNALES.has(demande.statut);
            const dates = demande.dateDebut
              ? demande.dateFin && demande.dateFin !== demande.dateDebut
                ? t("m7.z7.periode", { debut: formatDate(demande.dateDebut), fin: formatDate(demande.dateFin) })
                : formatDate(demande.dateDebut)
              : nonRenseigne;
            return (
              <tr
                key={demande.id}
                style={{
                  backgroundColor: rang % 2 === 1 ? "var(--color-bg-subtle)" : "var(--color-bg)",
                  borderBottom: "1px solid var(--color-border-faint)",
                }}
              >
                <th scope="row" style={{ padding: "var(--space-3)", textAlign: "left", fontWeight: 600 }}>
                  {demande.libelle ?? nonRenseigne}
                </th>
                <td style={{ padding: "var(--space-3)", color: "var(--color-text-secondary)" }}>
                  {demande.type ? (libelleType.get(demande.type) ?? demande.type) : nonRenseigne}
                </td>
                <td className="chiffres-tabulaires" style={{ padding: "var(--space-3)", whiteSpace: "nowrap" }}>
                  {dates}
                </td>
                <td className="chiffres-tabulaires" style={{ padding: "var(--space-3)", textAlign: "right" }}>
                  {demande.demandees === null ? nonRenseigne : formatNombre(demande.demandees)}
                </td>
                <td
                  className="chiffres-tabulaires"
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "right",
                    fontWeight: ecart !== null && ecart > 0 ? 700 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {demande.couvertes === null ? nonRenseigne : formatNombre(demande.couvertes)}
                  {ecart !== null && ecart > 0 && (
                    <span
                      style={{
                        marginLeft: "var(--space-2)",
                        fontWeight: 500,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {`−${formatNombre(ecart)}`}
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: "var(--space-3)",
                    fontWeight: signalee ? 700 : 400,
                    color: signalee ? "var(--color-text)" : "var(--color-text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {demande.statut ? (libelleStatut.get(demande.statut) ?? demande.statut) : nonRenseigne}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
