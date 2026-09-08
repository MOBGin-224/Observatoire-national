import { t } from "@/lib/i18n";

/*
 * Etat 3, donnees vides (document 9, A.4). Phrase explicative,
 * jamais zero, jamais un tiret, jamais du blanc.
 */
export function EtatVide({ libelle }: { libelle?: string }) {
  return (
    <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
      {libelle ?? t("state.vide.defaut")}
    </p>
  );
}
