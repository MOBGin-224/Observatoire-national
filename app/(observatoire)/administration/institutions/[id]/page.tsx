import { notFound } from "next/navigation";
import { chargerInstitution, listerComptes } from "@/lib/queries/admin";
import { listerEnumeration } from "@/lib/enumerations";
import { FormulaireCompte } from "@/components/administration/FormulaireCompte";
import { TableauComptes } from "@/components/administration/TableauComptes";
import { t } from "@/lib/i18n";

export default async function InstitutionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [institution, comptes, profils, langues] = await Promise.all([
    chargerInstitution(id),
    listerComptes(id),
    listerEnumeration("PROFIL"),
    listerEnumeration("LANGUE"),
  ]);

  if (!institution) notFound();

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div>
        <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
          {institution.denomination}
        </h1>
        {institution.type && (
          <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
            {institution.type}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-8">
        <div className="flex flex-col gap-3">
          <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
            {t("admin.comptes.titre")}
          </h2>
          <TableauComptes comptes={comptes} idInstitution={id} />
        </div>

        <FormulaireCompte idInstitution={id} profils={profils} langues={langues} />
      </div>
    </div>
  );
}
