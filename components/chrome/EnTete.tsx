import { t } from "@/lib/i18n";
import type { MonCompte } from "@/lib/queries/compte";
import { BoutonDeconnexion } from "./BoutonDeconnexion";

export function EnTete({ compte }: { compte: MonCompte }) {
  return (
    <header
      className="flex h-14 items-center justify-between border-b px-6"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
    >
      <span
        style={{
          fontFamily: "var(--font-titre)",
          fontSize: "var(--text-h3)",
          fontWeight: 600,
          color: "var(--color-primary)",
        }}
      >
        {t("app.titre_court")}
      </span>

      <div className="flex items-center gap-4" style={{ fontSize: "var(--text-small)" }}>
        {compte.institutionDenomination && (
          <span style={{ color: "var(--color-text-secondary)" }}>
            {compte.institutionDenomination}
          </span>
        )}
        <span style={{ color: "var(--color-text)" }}>
          {compte.prenom} {compte.nom}
        </span>
        <BoutonDeconnexion />
      </div>
    </header>
  );
}
