import { EtatVide } from "@/components/states/EtatVide";
import { ZoneImportCSV } from "@/components/administration/ZoneImportCSV";
import { listerImports } from "@/lib/queries/admin";
import { formatDateHeure, formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

export default async function Recensement() {
  const imports = await listerImports();

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("admin.import.titre")}
      </h1>

      <ZoneImportCSV />

      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          {t("admin.import.historique.titre")}
        </h2>

        {imports.length === 0 ? (
          <EtatVide libelle={t("admin.import.historique.vide")} />
        ) : (
          <table className="w-full" style={{ fontSize: "var(--text-small)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                {[
                  t("admin.import.historique.date"),
                  t("admin.import.historique.fichier"),
                  t("admin.import.historique.lignes"),
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
              {imports.map((imp) => (
                <tr key={imp.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="px-2 py-1.5">{formatDateHeure(imp.horodatage)}</td>
                  <td className="px-2 py-1.5">{imp.nomFichier}</td>
                  <td className="px-2 py-1.5">
                    {formatNombre(imp.nbLignesValides)} / {formatNombre(imp.nbLignesTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
