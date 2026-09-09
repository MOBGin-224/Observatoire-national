import Link from "next/link";
import { EtatVide } from "@/components/states/EtatVide";
import { FormulaireInstitution } from "@/components/administration/FormulaireInstitution";
import { listerInstitutions } from "@/lib/queries/admin";
import { t } from "@/lib/i18n";

export default async function Institutions() {
  const institutions = await listerInstitutions();

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("admin.institutions.titre")}
      </h1>

      <div className="grid grid-cols-[2fr_1fr] gap-8">
        <div className="flex flex-col gap-2">
          {institutions.length === 0 ? (
            <EtatVide libelle={t("admin.institutions.vide")} />
          ) : (
            <table className="w-full" style={{ fontSize: "var(--text-small)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                  {[
                    t("admin.institutions.denomination"),
                    t("admin.institutions.type"),
                    t("admin.institutions.convention_reference"),
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
                {institutions.map((institution) => (
                  <tr key={institution.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td className="px-2 py-1.5">
                      <Link
                        href={`/administration/institutions/${institution.id}`}
                        style={{ color: "var(--color-primary)", fontWeight: 600 }}
                      >
                        {institution.denomination}
                      </Link>
                    </td>
                    <td className="px-2 py-1.5">{institution.type ?? t("state.non_renseigne")}</td>
                    <td className="px-2 py-1.5">{institution.conventionReference ?? t("state.non_renseigne")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <FormulaireInstitution />
      </div>
    </div>
  );
}
