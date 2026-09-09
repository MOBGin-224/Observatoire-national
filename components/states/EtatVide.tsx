import { t } from "@/lib/i18n";

/*
 * Etat 3, donnees vides (document 9, A.4). Phrase explicative,
 * jamais zero, jamais un tiret, jamais du blanc.
 *
 * Le filet gauche est ce qui distingue une absence assumee d'un trou dans la
 * page. Au lancement, la majorite des zones seront dans cet etat : il doit se
 * lire comme une composition, pas comme un defaut de chargement.
 */
export function EtatVide({ libelle }: { libelle?: string }) {
  return (
    <p
      style={{
        paddingLeft: "var(--space-3)",
        borderLeft: "2px solid var(--color-border)",
        fontSize: "var(--text-small)",
        lineHeight: 1.5,
        color: "var(--color-text-muted)",
      }}
    >
      {libelle ?? t("state.vide.defaut")}
    </p>
  );
}
