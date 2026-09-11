import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

export type ColonneTableau = { libelle: string; forme: "volume" | "taux" };
export type LigneTableau = {
  code: string;
  libelle: string;
  valeurs: (number | null)[];
  /* Ligne sous le seuil de la regle M1 : ses valeurs ne sont pas publiees. */
  masque?: boolean;
};

/*
 * Tableau simple a une colonne de libelles, partage par M5 (zones 3 a 6) et M7
 * (zone 6). Meme vocabulaire visuel que le tableau de l'offre : en-tete bleu,
 * micro-barre sous chaque volume, ligne de total fournie par l'appelant depuis
 * la vue nationale, pour qu'elle egale au chiffre pres le bloc cle.
 *
 * Sans tri : l'ordre du referentiel se retrouve d'une consultation a l'autre.
 *
 * Une valeur absente s'ecrit "Non renseigne", jamais zero ni tiret : sur les
 * colonnes administratives de M5, elle dit qu'aucune transmission n'a eu lieu.
 */
export function TableauRegional({
  enTetePremiereColonne,
  colonnes,
  lignes,
  total,
}: {
  enTetePremiereColonne: string;
  colonnes: ColonneTableau[];
  lignes: LigneTableau[];
  total?: (number | null)[];
}) {
  const maxima = colonnes.map((colonne, index) =>
    colonne.forme === "volume" ? Math.max(0, ...lignes.map((ligne) => ligne.valeurs[index] ?? 0)) : 0
  );

  const styleEnTete = {
    padding: "var(--space-3)",
    fontFamily: "var(--font-texte)",
    fontSize: "var(--text-label)",
    fontWeight: 600,
    letterSpacing: "var(--tracking-label)",
    textTransform: "uppercase" as const,
    color: "var(--color-on-primary)",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ fontSize: "var(--text-small)", lineHeight: 1.4 }}>
        <thead>
          <tr style={{ backgroundColor: "var(--color-primary-700)" }}>
            <th scope="col" style={{ ...styleEnTete, textAlign: "left" }}>
              {enTetePremiereColonne}
            </th>
            {colonnes.map((colonne) => (
              <th key={colonne.libelle} scope="col" style={{ ...styleEnTete, textAlign: "right" }}>
                {colonne.libelle}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {lignes.map((ligne, rang) => {
            const vide = ligne.valeurs.every((valeur) => valeur === null || valeur === 0);
            return (
              <tr
                key={ligne.code}
                style={{
                  backgroundColor: rang % 2 === 1 ? "var(--color-bg-subtle)" : "var(--color-bg)",
                  borderBottom: "1px solid var(--color-border-faint)",
                }}
              >
                <th
                  scope="row"
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "left",
                    fontWeight: 600,
                    color: vide ? "var(--color-text-muted)" : "var(--color-text)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ligne.libelle}
                </th>
                {ligne.valeurs.map((valeur, index) =>
                  ligne.masque ? (
                    <CelluleTexte key={index} texte={t("state.masque_court")} />
                  ) : colonnes[index].forme === "taux" ? (
                    <CelluleTaux key={index} valeur={valeur} />
                  ) : (
                    <CelluleVolume key={index} valeur={valeur} maximum={maxima[index]} />
                  )
                )}
              </tr>
            );
          })}
        </tbody>

        {total && (
          <tfoot>
            <tr
              style={{
                borderTop: "2px solid var(--color-border-strong)",
                backgroundColor: "var(--color-bg-panel)",
              }}
            >
              <th
                scope="row"
                className="etiquette"
                style={{ padding: "var(--space-3)", textAlign: "left", color: "var(--color-text-secondary)" }}
              >
                {t("tableau.total")}
              </th>
              {total.map((valeur, index) => (
                <td
                  key={index}
                  className="chiffres-tabulaires"
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "right",
                    fontWeight: 700,
                    color: valeur === null ? "var(--color-text-muted)" : "var(--color-primary-700)",
                    fontSize: valeur === null ? "var(--text-meta)" : undefined,
                    whiteSpace: "nowrap",
                  }}
                >
                  {valeur === null
                    ? t("state.non_renseigne")
                    : colonnes[index].forme === "taux"
                      ? formatPourcentage(valeur)
                      : formatNombre(valeur)}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/* Cellule sans chiffre : non renseignee, ou non publiee sous le seuil M1. */
function CelluleTexte({ texte }: { texte: string }) {
  return (
    <td
      style={{
        padding: "var(--space-3)",
        textAlign: "right",
        fontSize: "var(--text-meta)",
        color: "var(--color-text-muted)",
        whiteSpace: "nowrap",
      }}
    >
      {texte}
    </td>
  );
}

function CelluleVolume({ valeur, maximum }: { valeur: number | null; maximum: number }) {
  if (valeur === null) return <CelluleTexte texte={t("state.non_renseigne")} />;
  const part = maximum > 0 ? (valeur / maximum) * 100 : 0;
  return (
    <td style={{ padding: "var(--space-3)", textAlign: "right", verticalAlign: "middle" }}>
      <span className="flex flex-col items-end" style={{ gap: "var(--space-1)" }}>
        <span
          className="chiffres-tabulaires"
          style={{ fontWeight: 600, color: valeur > 0 ? "var(--color-text)" : "var(--color-text-muted)" }}
        >
          {formatNombre(valeur)}
        </span>
        <span
          aria-hidden="true"
          className="block w-full"
          style={{ height: "3px", backgroundColor: "var(--color-border-faint)", borderRadius: "2px" }}
        >
          <span
            className="block h-full"
            style={{ width: `${part}%`, backgroundColor: "var(--color-primary-500)", borderRadius: "2px" }}
          />
        </span>
      </span>
    </td>
  );
}

function CelluleTaux({ valeur }: { valeur: number | null }) {
  if (valeur === null) return <CelluleTexte texte={t("state.non_renseigne")} />;
  return (
    <td style={{ padding: "var(--space-3)", textAlign: "right", verticalAlign: "middle" }}>
      <span className="flex flex-col items-end" style={{ gap: "var(--space-1)" }}>
        <span className="chiffres-tabulaires" style={{ fontWeight: 600 }}>
          {formatPourcentage(valeur)}
        </span>
        <span
          aria-hidden="true"
          className="block w-full"
          style={{ height: "3px", backgroundColor: "var(--color-border-faint)", borderRadius: "2px" }}
        >
          <span
            className="block h-full"
            style={{
              width: `${Math.max(0, Math.min(100, valeur))}%`,
              backgroundColor: "var(--color-primary-700)",
              borderRadius: "2px",
            }}
          />
        </span>
      </span>
    </td>
  );
}
