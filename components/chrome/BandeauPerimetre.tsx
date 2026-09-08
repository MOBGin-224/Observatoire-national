import { t } from "@/lib/i18n";
import { formatNombre, formatPourcentage, formatDateHeure } from "@/lib/format";
import type { Perimetre } from "@/lib/queries/perimetre";

/*
 * Document 9, A.1 : non masquable, present sur tous les ecrans, reste visible
 * apres defilement. Document 4, regle M0 : les volumes bruts s'affichent
 * toujours, y compris a zero.
 */
export function BandeauPerimetre({ perimetre }: { perimetre: Perimetre | null }) {
  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-2 border-b px-6 py-2"
      style={{
        backgroundColor: "var(--color-bg-panel)",
        borderColor: "var(--color-border)",
        fontSize: "var(--text-small)",
        color: "var(--color-text-secondary)",
      }}
    >
      {perimetre ? (
        <>
          <span>{t("perimetre.etablissements", { n: formatNombre(perimetre.etablissementsRecenses) })}</span>
          <span>&middot;</span>
          <span>{t("perimetre.partenaires", { n: formatNombre(perimetre.partenaires) })}</span>
          {perimetre.tauxCouverture !== null && (
            <>
              <span>&middot;</span>
              <span>
                {t("perimetre.couverture", { p: formatPourcentage(perimetre.tauxCouverture) })}
              </span>
            </>
          )}
          <span>&middot;</span>
          <span style={{ color: "var(--color-text-muted)" }}>
            {t("perimetre.date", { date: formatDateHeure(perimetre.calculeA) })}
          </span>
        </>
      ) : (
        <span style={{ color: "var(--color-text-muted)" }}>{t("perimetre.titre")}</span>
      )}
    </div>
  );
}
