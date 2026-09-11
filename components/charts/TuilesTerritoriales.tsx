import {
  ECHELLE_DENSITE,
  TRAME_SANS_DONNEE,
  classeDensite,
  paliersDensite,
  texteSurDensite,
} from "./geometrie";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

export type CelluleTerritoire = {
  code: string;
  libelle: string;
  valeur: number;
  mention?: string;
  /*
   * Absence de donnee declaree explicitement. Sans elle, une valeur nulle vaut
   * absence : juste pour un effectif, faux pour un indice, ou zero est une
   * mesure (un territoire dont aucun etablissement n'est numerise).
   */
  sansDonnee?: boolean;
  /* Valeur deja formatee, pour une grandeur qui n'est pas un effectif (un taux). */
  valeurAffichee?: string;
  /* Texte d'une tuile sans donnee, "Aucune donnee" par defaut. */
  texteSansDonnee?: string;
};

function classeCellule(cellule: CelluleTerritoire, seuils: number[]): number | null {
  if (cellule.sansDonnee === true) return null;
  if (cellule.sansDonnee === false && cellule.valeur <= 0) return 0;
  return classeDensite(cellule.valeur, seuils);
}

function estSansDonnee(cellule: CelluleTerritoire): boolean {
  return cellule.sansDonnee ?? cellule.valeur <= 0;
}

/*
 * Grille de tuiles territoriales, substitut de la carte de densité tant
 * qu'aucun contour du découpage refondu le 20 août 2026 n'existe dans un
 * fichier réutilisable (document 8, section 5.7).
 *
 * Un territoire, une tuile, un aplat de l'échelle séquentielle en cinq paliers :
 * exactement la lecture d'une carte de densité, moins la géométrie.
 *
 * Les deux règles cartographiques du document 8 sont tenues telles quelles :
 * un territoire sans donnée est hachuré et jamais coloré en clair, et la légende
 * reste visible en permanence. Chaque tuile porte son effectif en clair, donc la
 * couleur ne porte jamais l'information seule (document 8, section 2.6).
 */
export function TuilesTerritoriales({ cellules }: { cellules: CelluleTerritoire[] }) {
  const seuils = paliersDensite(cellules.map((c) => c.valeur));

  return (
    <ul
      className="grid"
      style={{ gap: "var(--space-2)", gridTemplateColumns: "repeat(auto-fill, minmax(9.5rem, 1fr))" }}
    >
      {cellules.map((cellule) => {
        const classe = classeCellule(cellule, seuils);
        const sansDonnee = classe === null;
        return (
          <li
            key={cellule.code}
            className="flex flex-col justify-between"
            style={{
              gap: "var(--space-2)",
              padding: "var(--space-3)",
              minHeight: "5.5rem",
              borderRadius: "var(--rayon)",
              border: `1px solid ${sansDonnee ? "var(--color-border)" : "transparent"}`,
              backgroundColor: classe === null ? "var(--hachure-fond)" : ECHELLE_DENSITE[classe],
              backgroundImage: sansDonnee ? TRAME_SANS_DONNEE : undefined,
              color: texteSurDensite(classe),
            }}
          >
            <span
              className="truncate"
              style={{
                fontFamily: "var(--font-titre)",
                fontSize: "var(--text-small)",
                fontWeight: 600,
                color: sansDonnee ? "var(--color-text-muted)" : "inherit",
              }}
              title={cellule.libelle}
            >
              {cellule.libelle}
            </span>

            {sansDonnee ? (
              <span
                style={{ fontSize: "var(--text-meta)", lineHeight: 1.3, color: "var(--color-text-muted)" }}
              >
                {cellule.texteSansDonnee ?? t("carte.aucune_donnee")}
              </span>
            ) : (
              <span className="flex flex-col">
                <span
                  className="chiffres-tabulaires"
                  style={{
                    fontFamily: "var(--font-titre)",
                    fontSize: "var(--text-h1)",
                    fontWeight: 700,
                    letterSpacing: "var(--tracking-display)",
                    lineHeight: 1.1,
                  }}
                >
                  {cellule.valeurAffichee ?? formatNombre(cellule.valeur)}
                </span>
                {cellule.mention && (
                  <span
                    className="chiffres-tabulaires"
                    style={{ fontSize: "var(--text-meta)", opacity: 0.85 }}
                  >
                    {cellule.mention}
                  </span>
                )}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* Document 8, section 5.7 : la légende est toujours visible. */
export function LegendeDensite({
  cellules,
  note,
  etiquette,
  libelleSansDonnee,
}: {
  cellules: CelluleTerritoire[];
  note?: string;
  /* Grandeur portee par l'echelle, "Densite" par defaut. Un indice n'est pas une densite. */
  etiquette?: string;
  /* Legende de la trame, quand la fiche du module en prescrit une (document 9 quater, L.8). */
  libelleSansDonnee?: string;
}) {
  const seuils = paliersDensite(cellules.map((c) => c.valeur));
  const sansDonnee = cellules.filter(estSansDonnee).length;

  return (
    <div className="flex flex-wrap items-center justify-between" style={{ gap: "var(--space-4)" }}>
      <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
        <span className="etiquette">{etiquette ?? t("carte.legende_densite")}</span>
        <div className="flex items-center" style={{ gap: "var(--space-1)" }}>
          {ECHELLE_DENSITE.map((aplat, index) => (
            <span
              key={aplat}
              aria-hidden="true"
              style={{
                width: "26px",
                height: "10px",
                backgroundColor: aplat,
                borderRadius: index === 0 ? "2px 0 0 2px" : index === 4 ? "0 2px 2px 0" : 0,
              }}
            />
          ))}
        </div>
        <span
          className="chiffres-tabulaires"
          style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}
        >
          {seuils.length > 0
            ? t("carte.legende_bornes_generique", {
                min: formatNombre(Math.round(seuils[0])),
                max: formatNombre(Math.round(seuils[seuils.length - 1])),
              })
            : t("carte.legende_sans_echelle")}
        </span>
      </div>

      <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
        <span
          aria-hidden="true"
          style={{
            width: "26px",
            height: "10px",
            borderRadius: "2px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--hachure-fond)",
            backgroundImage: TRAME_SANS_DONNEE,
          }}
        />
        <span style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
          {libelleSansDonnee
            ? `${libelleSansDonnee} (${sansDonnee})`
            : t("carte.legende_hachure", { n: String(sansDonnee) })}
        </span>
      </div>

      <p
        className="basis-full"
        style={{ fontSize: "var(--text-meta)", lineHeight: 1.4, color: "var(--color-text-muted)" }}
      >
        {note ?? t("carte.sans_contour")}
      </p>
    </div>
  );
}
