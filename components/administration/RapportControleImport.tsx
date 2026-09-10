import { t } from "@/lib/i18n";
import { IMPORT } from "@/lib/config";
import type { RapportImport } from "@/lib/csv/parseRecensement";

/* Document 9bis H.4.1 : rapport de controle avant validation, motif ligne par ligne. */
export function RapportControleImport({ rapport }: { rapport: RapportImport }) {
  const nbDoublons = rapport.lignesValides.filter((l) => l.doublonPotentiel).length;

  /*
   * Document 13, section 4 : au-dela du plafond, aucun rapport ligne a ligne
   * n'est produit. Un rapport de dix mille lignes se valide en aveugle, ce qui
   * revient a supprimer le controle.
   */
  if (rapport.plafondDepasse) {
    return (
      <div className="flex flex-col gap-3">
        <h3
          style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)", fontWeight: 600 }}
        >
          {t("admin.import.rapport.titre")}
        </h3>
        <p style={{ color: "var(--color-alert)", fontSize: "var(--text-body)", fontWeight: 600 }}>
          {t("admin.import.erreur.plafond_depasse", {
            lignes: rapport.nbLignesTotal,
            plafond: IMPORT.plafondLignes,
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)", fontWeight: 600 }}>
        {t("admin.import.rapport.titre")}
      </h3>

      <div className="flex gap-4" style={{ fontSize: "var(--text-body)" }}>
        <span style={{ color: "var(--color-success)", fontWeight: 600 }}>
          {t("admin.import.rapport.lignes_valides", { n: rapport.lignesValides.length })}
        </span>
        {rapport.lignesErreur.length > 0 && (
          <span style={{ color: "var(--color-alert)", fontWeight: 600 }}>
            {t("admin.import.rapport.lignes_erreur", { n: rapport.lignesErreur.length })}
          </span>
        )}
        {nbDoublons > 0 && (
          <span style={{ color: "var(--color-text-secondary)" }}>
            {nbDoublons} {t("admin.import.erreur.doublon_potentiel")}
          </span>
        )}
      </div>

      {rapport.lignesErreur.length > 0 && (
        <table className="w-full" style={{ fontSize: "var(--text-small)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
              <th className="px-2 py-1.5 text-left" style={{ color: "var(--color-text-secondary)" }}>
                {t("admin.import.rapport.ligne")}
              </th>
              <th className="px-2 py-1.5 text-left" style={{ color: "var(--color-text-secondary)" }}>
                {t("admin.import.rapport.motif")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rapport.lignesErreur.map((ligne) => (
              <tr key={ligne.numeroLigne} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="px-2 py-1.5" style={{ color: "var(--color-alert)", fontWeight: 600 }}>
                  {t("admin.import.rapport.ligne", { n: ligne.numeroLigne })}
                </td>
                <td className="px-2 py-1.5">
                  {ligne.motifs.map((m, i) => (
                    <div key={i}>{t(m.cle, m.variables)}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
