import { t } from "@/lib/i18n";

/*
 * Etat 4, donnees masquees (document 9, A.4). Libelle invariable, au caractere
 * pres. Ce n'est pas une erreur : traitement neutre, jamais alarmant.
 * Le libelle par defaut est celui de la regle M1 (document 7, section 3.2,
 * confidentialite des etablissements) ; `cleLibelle` permet de pointer vers un
 * autre libelle fige du document 10 quand le motif de masquage differe
 * (ex: state.masque_budget pour un echantillon de recherches trop faible).
 *
 * Traitement volontairement plus sobre que celui d'une donnee presente : fond
 * atone, aucune couleur semantique, aucun filet d'accent. Un cadre doit voir au
 * premier coup d'oeil que la regle deontologique s'applique, et ne jamais
 * confondre ce bloc avec une panne.
 */
export function EtatMasque({ cleLibelle = "state.masque" }: { cleLibelle?: string }) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: "var(--space-1)",
        padding: "var(--space-3)",
        borderRadius: "var(--rayon)",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-subtle)",
      }}
    >
      <span className="etiquette" style={{ color: "var(--color-text-secondary)" }}>
        {t("state.masque_court")}
      </span>
      <span
        style={{ fontSize: "var(--text-small)", lineHeight: 1.45, color: "var(--color-text-muted)" }}
      >
        {t(cleLibelle)}
      </span>
    </div>
  );
}
