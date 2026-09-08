import { t } from "@/lib/i18n";

/*
 * Etat 4, donnees masquees (document 9, A.4). Libelle invariable, au caractere
 * pres. Ce n'est pas une erreur : traitement neutre, jamais alarmant.
 * Le libelle par defaut est celui de la regle M1 (document 7, section 3.2,
 * confidentialite des etablissements) ; `cleLibelle` permet de pointer vers un
 * autre libelle fige du document 10 quand le motif de masquage differe
 * (ex: state.masque_budget pour un echantillon de recherches trop faible).
 */
export function EtatMasque({ cleLibelle = "state.masque" }: { cleLibelle?: string }) {
  return (
    <div
      className="flex flex-col gap-1 rounded border px-3 py-2"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}
    >
      <span style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)", fontWeight: 600, color: "var(--color-text-muted)" }}>
        {t("state.masque_court")}
      </span>
      <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
        {t(cleLibelle)}
      </span>
    </div>
  );
}
