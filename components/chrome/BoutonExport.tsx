"use client";

import { t } from "@/lib/i18n";

/*
 * Document 8, section 5.8 : un seul bouton d'export par ecran, PDF et image
 * uniquement, jamais de donnee cedee (CLAUDE.md, regle 2).
 *
 * L'impression du navigateur est branchee sur la feuille de style d'impression
 * de app/globals.css, qui retire la navigation et les controles, conserve le
 * bandeau de perimetre et ajoute le pied d'export. Le rendu PDF dedie du
 * document 8, section 10 (filigrane, reference unique, rendu vectoriel des
 * graphiques) reste a construire cote serveur ; les graphiques etant deja en
 * SVG, ils sortent vectoriels par cette voie.
 */
export function BoutonExport() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="transition-colors"
      style={{
        padding: "var(--space-2) var(--space-4)",
        borderRadius: "var(--rayon)",
        border: "1px solid var(--color-primary-700)",
        backgroundColor: "var(--color-primary-700)",
        color: "var(--color-on-primary)",
        fontFamily: "var(--font-texte)",
        fontSize: "var(--text-small)",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {t("controle.export")}
    </button>
  );
}
