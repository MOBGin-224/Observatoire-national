import { t } from "@/lib/i18n";

/*
 * Etat 4, donnees masquees (document 9, A.4 ; document 7, section 3.2).
 * Libelle invariable, au caractere pres. Ce n'est pas une erreur : traitement
 * neutre, jamais alarmant.
 */
export function EtatMasque() {
  return (
    <div
      className="flex flex-col gap-1 rounded border px-3 py-2"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}
      title={t("state.masque_aide")}
    >
      <span style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)", fontWeight: 600, color: "var(--color-text-muted)" }}>
        {t("state.masque_court")}
      </span>
      <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
        {t("state.masque")}
      </span>
    </div>
  );
}
