import { couleurSequentielle, type Part } from "./geometrie";
import { formatNombre } from "@/lib/format";

type Rectangle = { x: number; y: number; largeur: number; hauteur: number };
type Tuile = Part & { part: number } & Rectangle;

/*
 * Treemap, algorithme squarifié (Bruls, Huizing, van Wijk).
 *
 * Forme retenue quand les catégories sont nombreuses et sans ordre : une liste
 * de barres devient illisible passé une douzaine d'entrées, et un anneau plafonne
 * à six secteurs. Le treemap encode la part par la surface, ce qui reste lisible
 * jusqu'à une trentaine d'entrées.
 *
 * Le squarifié cherche à garder chaque rectangle proche du carré. Un découpage
 * naïf produit des bandes très allongées dont on ne compare plus les surfaces,
 * ce qui annule l'intérêt de la forme.
 *
 * Chaque tuile porte son libellé et son effectif dès qu'elle a la place de les
 * écrire : la surface donne l'ordre de grandeur, le texte donne la valeur exacte.
 */
function pireRapport(rangee: number[], cote: number, echelle: number): number {
  const somme = rangee.reduce((s, v) => s + v, 0) * echelle;
  if (somme === 0) return Infinity;
  const max = Math.max(...rangee) * echelle;
  const min = Math.min(...rangee) * echelle;
  return Math.max((cote * cote * max) / (somme * somme), (somme * somme) / (cote * cote * min));
}

function squarifier(valeurs: number[], zone: Rectangle, echelle: number): Rectangle[] {
  const sortie: Rectangle[] = [];
  const reste = [...valeurs];
  let libre = { ...zone };

  while (reste.length > 0) {
    const cote = Math.min(libre.largeur, libre.hauteur);
    const rangee: number[] = [];

    while (reste.length > 0) {
      const candidate = [...rangee, reste[0]];
      if (rangee.length > 0 && pireRapport(candidate, cote, echelle) > pireRapport(rangee, cote, echelle)) {
        break;
      }
      rangee.push(reste.shift() as number);
    }

    const sommeRangee = rangee.reduce((s, v) => s + v, 0) * echelle;
    const epaisseur = cote === 0 ? 0 : sommeRangee / cote;

    let curseur = 0;
    for (const valeur of rangee) {
      const longueur = sommeRangee === 0 ? 0 : ((valeur * echelle) / sommeRangee) * cote;
      if (libre.largeur >= libre.hauteur) {
        sortie.push({ x: libre.x, y: libre.y + curseur, largeur: epaisseur, hauteur: longueur });
      } else {
        sortie.push({ x: libre.x + curseur, y: libre.y, largeur: longueur, hauteur: epaisseur });
      }
      curseur += longueur;
    }

    if (libre.largeur >= libre.hauteur) {
      libre = {
        x: libre.x + epaisseur,
        y: libre.y,
        largeur: libre.largeur - epaisseur,
        hauteur: libre.hauteur,
      };
    } else {
      libre = {
        x: libre.x,
        y: libre.y + epaisseur,
        largeur: libre.largeur,
        hauteur: libre.hauteur - epaisseur,
      };
    }
  }

  return sortie;
}

/* Cadre proche de la largeur reelle d'un panneau pleine largeur : voir la note
   sur les cadres dans CourbeTemporelle. */
const LARGEUR = 1100;
const HAUTEUR = 360;
const JEU = 3;

export function Treemap({
  parts,
  maximumTuiles = 24,
}: {
  parts: Part[];
  maximumTuiles?: number;
}) {
  const triees = [...parts].filter((p) => p.valeur > 0).sort((a, b) => b.valeur - a.valeur);
  if (triees.length === 0) return null;

  /* Au-delà du plafond, la queue devient une tuile unique plutôt qu'une poussière
     de rectangles d'un pixel, illisibles et trompeurs. */
  const retenues = triees.slice(0, maximumTuiles);
  const total = triees.reduce((s, p) => s + p.valeur, 0);

  const aire = LARGEUR * HAUTEUR;
  const sommeRetenues = retenues.reduce((s, p) => s + p.valeur, 0);
  const echelle = aire / sommeRetenues;

  const rectangles = squarifier(
    retenues.map((p) => p.valeur),
    { x: 0, y: 0, largeur: LARGEUR, hauteur: HAUTEUR },
    echelle
  );

  const tuiles: Tuile[] = retenues.map((part, index) => ({
    ...part,
    part: (part.valeur / total) * 100,
    ...rectangles[index],
  }));

  return (
    <svg
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={tuiles.map((t) => `${t.libelle} : ${formatNombre(t.valeur)}`).join(", ")}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {tuiles.map((tuile, index) => {
        const largeur = Math.max(0, tuile.largeur - JEU);
        const hauteurTuile = Math.max(0, tuile.hauteur - JEU);
        const couleur = couleurSequentielle(index, tuiles.length);
        /* Le texte blanc n'est lisible que sur les deux paliers les plus foncés. */
        const surFonce = index < Math.ceil(tuiles.length / 3);
        const placeLibelle = largeur > 74 && hauteurTuile > 34;
        const placeValeur = largeur > 74 && hauteurTuile > 52;

        return (
          <g key={tuile.code}>
            <rect
              x={tuile.x + JEU / 2}
              y={tuile.y + JEU / 2}
              width={largeur}
              height={hauteurTuile}
              rx={2}
              style={{ fill: couleur }}
            >
              <title>{`${tuile.libelle} : ${formatNombre(tuile.valeur)} (${tuile.part.toFixed(1).replace(".", ",")} %)`}</title>
            </rect>
            {placeLibelle && (
              <text
                x={tuile.x + JEU / 2 + 10}
                y={tuile.y + JEU / 2 + 20}
                style={{
                  fontFamily: "var(--font-texte)",
                  fontSize: "12px",
                  fontWeight: 600,
                  fill: surFonce ? "var(--color-on-primary)" : "var(--color-text)",
                }}
              >
                {tuile.libelle.length > Math.floor(largeur / 7)
                  ? `${tuile.libelle.slice(0, Math.max(3, Math.floor(largeur / 7) - 1))}…`
                  : tuile.libelle}
              </text>
            )}
            {placeValeur && (
              <text
                x={tuile.x + JEU / 2 + 10}
                y={tuile.y + JEU / 2 + 40}
                className="chiffres-tabulaires"
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  fill: surFonce ? "var(--color-on-primary)" : "var(--color-text)",
                  opacity: surFonce ? 0.92 : 0.75,
                }}
              >
                {formatNombre(tuile.valeur)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
