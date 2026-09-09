import Link from "next/link";
import { t } from "@/lib/i18n";
import { BoutonExport } from "./BoutonExport";

export type EchelonTerritorial = { code: string; libelle: string; href?: string };

/*
 * Barre de controle collante en haut de la zone de contenu (document 8, section 4).
 *
 * Elle porte le fil d'Ariane territorial, qui est le mecanisme unique de
 * navigation geographique de l'outil (document 8, section 5.5 : ne jamais
 * multiplier les filtres geographiques, ils produisent des captures d'ecran
 * contradictoires), et le bouton d'export unique de l'ecran.
 *
 * Elle disparait a l'impression : un export n'est pas une capture d'ecran.
 */
export function BarreControle({
  echelons,
  intitule,
  actions,
}: {
  /* Absent sur un ecran sans dimension territoriale, la methodologie par exemple. */
  echelons?: EchelonTerritorial[];
  intitule?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      data-impression="masquer"
      className="sticky z-10 flex flex-wrap items-center justify-between"
      style={{
        top: "0",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-8)",
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {echelons === undefined ? (
        <span className="etiquette">{intitule}</span>
      ) : (
      <nav
        aria-label={t("controle.niveau")}
        className="flex flex-wrap items-center"
        style={{ gap: "var(--space-2)" }}
      >
        <span className="etiquette">{t("controle.niveau")}</span>
        {echelons.map((echelon, index) => {
          const dernier = index === echelons.length - 1;
          return (
            <span key={echelon.code} className="flex items-center" style={{ gap: "var(--space-2)" }}>
              {index > 0 && (
                <span aria-hidden="true" style={{ color: "var(--color-border-strong)" }}>
                  /
                </span>
              )}
              {echelon.href && !dernier ? (
                <Link
                  href={echelon.href}
                  className="lien-sobre"
                  style={{ fontSize: "var(--text-small)", fontWeight: 500 }}
                >
                  {echelon.libelle}
                </Link>
              ) : (
                <span
                  aria-current={dernier ? "page" : undefined}
                  style={{
                    fontSize: "var(--text-small)",
                    fontWeight: 600,
                    color: "var(--color-text)",
                  }}
                >
                  {echelon.libelle}
                </span>
              )}
            </span>
          );
        })}
      </nav>
      )}

      <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
        {actions}
        <BoutonExport />
      </div>
    </div>
  );
}
