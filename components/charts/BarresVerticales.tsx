import { formatNombre } from "@/lib/format";

export type BarreVerticale = { cle: string; libelle: string; valeur: number };

/*
 * Colonnes verticales : la comparaison de catégories distinctes, pas d'une
 * tendance. Sur une série de mois, la colonne dit « combien en janvier » là où
 * la courbe dit « comment cela évolue ». Les deux formes coexistent dans l'outil,
 * chacune sur la question qu'elle sait traiter.
 *
 * Axe des ordonnées démarrant à zéro, sans exception (document 8, section 6).
 * Une colonne dont la base est tronquée multiplie visuellement les écarts.
 */
/* Cadre proche de la largeur reelle d'un panneau pleine largeur : voir la note
   sur les cadres dans CourbeTemporelle. */
const LARGEUR = 1100;
const HAUTEUR = 280;
const MARGE = { haut: 24, droite: 12, bas: 32, gauche: 56 };

export function BarresVerticales({
  barres,
  teinte = "var(--color-primary-700)",
  decimales = 0,
}: {
  barres: BarreVerticale[];
  teinte?: string;
  decimales?: number;
}) {
  if (barres.length === 0) return null;

  const maximum = Math.max(...barres.map((b) => b.valeur), 0);
  const plafond = maximum === 0 ? 1 : maximum;
  const largeurTracé = LARGEUR - MARGE.gauche - MARGE.droite;
  const hauteurTracé = HAUTEUR - MARGE.haut - MARGE.bas;

  const pas = largeurTracé / barres.length;
  const largeurBarre = Math.min(pas * 0.62, 44);
  const graduations = [0, 0.5, 1].map((part) => plafond * part);
  const etiquetter = barres.length < 15;

  return (
    <svg
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={barres.map((b) => `${b.libelle} : ${formatNombre(b.valeur, decimales)}`).join(", ")}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {graduations.map((valeur) => {
        const y = MARGE.haut + hauteurTracé - (valeur / plafond) * hauteurTracé;
        return (
          <g key={valeur}>
            <line
              x1={MARGE.gauche}
              x2={LARGEUR - MARGE.droite}
              y1={y}
              y2={y}
              style={{ stroke: "var(--color-border-faint)" }}
              strokeWidth={1}
            />
            <text
              x={MARGE.gauche - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              className="chiffres-tabulaires"
              style={{ fontFamily: "var(--font-texte)", fontSize: "11px", fill: "var(--color-text-muted)" }}
            >
              {formatNombre(valeur, decimales)}
            </text>
          </g>
        );
      })}

      {barres.map((barre, index) => {
        const hauteurBarre = (barre.valeur / plafond) * hauteurTracé;
        const x = MARGE.gauche + index * pas + (pas - largeurBarre) / 2;
        const y = MARGE.haut + hauteurTracé - hauteurBarre;
        return (
          <g key={barre.cle}>
            <rect
              x={x}
              y={y}
              width={largeurBarre}
              height={Math.max(0, hauteurBarre)}
              rx={2}
              style={{ fill: teinte }}
            >
              <title>{`${barre.libelle} : ${formatNombre(barre.valeur, decimales)}`}</title>
            </rect>
            {etiquetter && (
              <text
                x={x + largeurBarre / 2}
                y={y - 7}
                textAnchor="middle"
                className="chiffres-tabulaires"
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "11px",
                  fontWeight: 600,
                  fill: "var(--color-text)",
                }}
              >
                {formatNombre(barre.valeur, decimales)}
              </text>
            )}
            <text
              x={x + largeurBarre / 2}
              y={HAUTEUR - MARGE.bas + 16}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-texte)", fontSize: "11px", fill: "var(--color-text-muted)" }}
            >
              {barre.libelle}
            </text>
          </g>
        );
      })}

      <line
        x1={MARGE.gauche}
        x2={LARGEUR - MARGE.droite}
        y1={MARGE.haut + hauteurTracé}
        y2={MARGE.haut + hauteurTracé}
        style={{ stroke: "var(--color-border-strong)" }}
        strokeWidth={1}
      />
    </svg>
  );
}
