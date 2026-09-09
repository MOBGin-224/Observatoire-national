import { formatNombre } from "@/lib/format";

export type PointTemporel = { cle: string; libelle: string; valeur: number | null };
export type Repere = { cle: string; libelle: string; position: string };

/*
 * Courbe d'évolution, avec remplissage d'aire optionnel.
 *
 * Une seule série par graphique. Le document 8 interdit le double axe, et deux
 * grandeurs d'unités différentes sur un même axe sont soit trompeuses, soit
 * illisibles. Quand plusieurs mesures doivent être suivies ensemble, on les pose
 * côte à côte en petits multiples, chacune avec sa propre échelle et son unité :
 * l'œil compare les formes, ce qui est précisément la lecture recherchée.
 *
 * Les repères verticaux portent le calendrier événementiel (document 9, C.7 :
 * une courbe de demande sans contexte n'explique rien).
 *
 * Le tracé est en coordonnées fixes et rendu à 100 % de la largeur : pas de
 * mesure côté client, donc pas de saut de mise en page, et un rendu identique
 * au serveur, à l'écran et à l'impression.
 */
const MARGE = { haut: 22, droite: 20, bas: 34, gauche: 56 };

/*
 * Le tracé remplit la largeur de son panneau, et le cadre de coordonnées est
 * choisi proche de cette largeur réelle. C'est ce qui garde le texte à sa taille
 * nominale : un cadre de 760 unités étiré sur 1 300 pixels grossirait toutes les
 * étiquettes de 70 %, un cadre de 1 100 unités posé dans un panneau de 400 pixels
 * les réduirait à l'illisible. D'où deux formats : `large` pour un panneau pleine
 * largeur, `colonne` pour un petit multiple.
 */
export const CADRE_LARGE = { largeur: 1100, hauteur: 300 } as const;
export const CADRE_COLONNE = { largeur: 420, hauteur: 300 } as const;

export function CourbeTemporelle({
  points,
  reperes = [],
  aire = false,
  teinte = "var(--color-primary-700)",
  suffixeValeur = "",
  decimales = 0,
  demarrerAZero = true,
  cadre = CADRE_LARGE,
}: {
  points: PointTemporel[];
  reperes?: Repere[];
  aire?: boolean;
  teinte?: string;
  suffixeValeur?: string;
  decimales?: number;
  demarrerAZero?: boolean;
  cadre?: { largeur: number; hauteur: number };
}) {
  const LARGEUR = cadre.largeur;
  const HAUTEUR = cadre.hauteur;
  const renseignes = points.filter((p) => p.valeur !== null) as { cle: string; libelle: string; valeur: number }[];
  if (renseignes.length === 0) return null;

  const valeurs = renseignes.map((p) => p.valeur);
  const brut = { min: Math.min(...valeurs), max: Math.max(...valeurs) };
  const bas = demarrerAZero ? 0 : brut.min - (brut.max - brut.min) * 0.15;
  /* Une série plate garde une amplitude minimale, sinon la courbe se colle à un bord. */
  const haut = brut.max === bas ? bas + Math.max(1, Math.abs(bas) * 0.1) : brut.max;

  const largeurTracé = LARGEUR - MARGE.gauche - MARGE.droite;
  const hauteurTracé = HAUTEUR - MARGE.haut - MARGE.bas;

  const x = (index: number) =>
    MARGE.gauche + (points.length <= 1 ? largeurTracé / 2 : (index / (points.length - 1)) * largeurTracé);
  const y = (valeur: number) =>
    MARGE.haut + hauteurTracé - ((valeur - bas) / (haut - bas)) * hauteurTracé;

  const graduations = [0, 0.25, 0.5, 0.75, 1].map((part) => bas + (haut - bas) * part);

  /* Une valeur absente coupe la ligne : on ne relie jamais deux points de part
     et d'autre d'un trou, ce serait inventer la donnée manquante. */
  const segments: { index: number; valeur: number }[][] = [];
  let courant: { index: number; valeur: number }[] = [];
  points.forEach((point, index) => {
    if (point.valeur === null) {
      if (courant.length > 0) segments.push(courant);
      courant = [];
    } else {
      courant.push({ index, valeur: point.valeur });
    }
  });
  if (courant.length > 0) segments.push(courant);

  const etiquetterPoints = renseignes.length < 15;
  /* Au-delà d'une douzaine de pas, une étiquette sur deux suffit en abscisse. */
  const pasEtiquette = points.length > 12 ? 2 : 1;

  return (
    <svg
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={renseignes
        .map((p) => `${p.libelle} : ${formatNombre(p.valeur, decimales)}${suffixeValeur}`)
        .join(", ")}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {/* Grille horizontale et graduations */}
      {graduations.map((valeur) => (
        <g key={valeur}>
          <line
            x1={MARGE.gauche}
            x2={LARGEUR - MARGE.droite}
            y1={y(valeur)}
            y2={y(valeur)}
            style={{ stroke: "var(--color-border-faint)" }}
            strokeWidth={1}
          />
          <text
            x={MARGE.gauche - 8}
            y={y(valeur)}
            textAnchor="end"
            dominantBaseline="central"
            className="chiffres-tabulaires"
            style={{
              fontFamily: "var(--font-texte)",
              fontSize: "11px",
              fill: "var(--color-text-muted)",
            }}
          >
            {formatNombre(valeur, decimales)}
          </text>
        </g>
      ))}

      {/* Repères d'événements, sous la courbe pour ne jamais la masquer */}
      {reperes.map((repere) => {
        const index = points.findIndex((p) => p.cle === repere.position);
        if (index < 0) return null;
        return (
          <g key={repere.cle}>
            <line
              x1={x(index)}
              x2={x(index)}
              y1={MARGE.haut}
              y2={MARGE.haut + hauteurTracé}
              style={{ stroke: "var(--color-border-strong)" }}
              strokeWidth={1}
              strokeDasharray="3 3"
            >
              <title>{repere.libelle}</title>
            </line>
            <circle cx={x(index)} cy={MARGE.haut} r={3} style={{ fill: "var(--color-border-strong)" }}>
              <title>{repere.libelle}</title>
            </circle>
          </g>
        );
      })}

      {segments.map((segment, indexSegment) => {
        const trace = segment.map((p) => `${x(p.index)},${y(p.valeur)}`).join(" ");
        return (
          <g key={indexSegment}>
            {aire && segment.length > 1 && (
              <polygon
                points={`${x(segment[0].index)},${y(bas)} ${trace} ${x(segment[segment.length - 1].index)},${y(bas)}`}
                style={{ fill: teinte, opacity: 0.1 }}
              />
            )}
            <polyline
              points={trace}
              fill="none"
              style={{ stroke: teinte }}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}

      {/* Points et étiquettes de données */}
      {renseignes.map((point) => {
        const index = points.findIndex((p) => p.cle === point.cle);
        return (
          <g key={point.cle}>
            <circle cx={x(index)} cy={y(point.valeur)} r={3.5} style={{ fill: teinte }}>
              <title>{`${point.libelle} : ${formatNombre(point.valeur, decimales)}${suffixeValeur}`}</title>
            </circle>
            {etiquetterPoints && (
              <text
                x={x(index)}
                y={y(point.valeur) - 10}
                /* Aux deux extrémités, l'étiquette se replie vers l'intérieur du
                   cadre : centrée, la première chevauche la graduation de l'axe
                   et la dernière déborde du tracé. */
                textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                className="chiffres-tabulaires"
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "11px",
                  fontWeight: 600,
                  fill: "var(--color-text)",
                }}
              >
                {formatNombre(point.valeur, decimales)}
              </text>
            )}
          </g>
        );
      })}

      {/* Axe des abscisses */}
      <line
        x1={MARGE.gauche}
        x2={LARGEUR - MARGE.droite}
        y1={MARGE.haut + hauteurTracé}
        y2={MARGE.haut + hauteurTracé}
        style={{ stroke: "var(--color-border-strong)" }}
        strokeWidth={1}
      />
      {points.map((point, index) =>
        index % pasEtiquette === 0 ? (
          <text
            key={point.cle}
            x={x(index)}
            y={HAUTEUR - MARGE.bas + 18}
            textAnchor="middle"
            style={{
              fontFamily: "var(--font-texte)",
              fontSize: "11px",
              fill: "var(--color-text-muted)",
            }}
          >
            {point.libelle}
          </text>
        ) : null
      )}
    </svg>
  );
}

/*
 * Sparkline : la même courbe, sans axe, sans graduation, sans étiquette.
 * Posée à côté d'un chiffre, elle donne la tendance sans demander de lecture.
 * Elle ne remplace jamais la courbe complète : elle dit le sens, pas la valeur.
 */
export function Sparkline({
  valeurs,
  teinte = "var(--color-primary-500)",
  largeur = 96,
  hauteur = 28,
  aire = true,
  libelle,
}: {
  valeurs: number[];
  teinte?: string;
  largeur?: number;
  hauteur?: number;
  aire?: boolean;
  libelle: string;
}) {
  if (valeurs.length < 2) return null;

  const min = Math.min(...valeurs, 0);
  const max = Math.max(...valeurs);
  const amplitude = max - min || 1;
  const marge = 3;

  const x = (i: number) => (i / (valeurs.length - 1)) * (largeur - marge * 2) + marge;
  const y = (v: number) => hauteur - marge - ((v - min) / amplitude) * (hauteur - marge * 2);
  const trace = valeurs.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <svg
      width={largeur}
      height={hauteur}
      viewBox={`0 0 ${largeur} ${hauteur}`}
      role="img"
      aria-label={libelle}
      style={{ display: "block", flexShrink: 0 }}
    >
      {aire && (
        <polygon
          points={`${x(0)},${hauteur - marge} ${trace} ${x(valeurs.length - 1)},${hauteur - marge}`}
          style={{ fill: teinte, opacity: 0.14 }}
        />
      )}
      <polyline
        points={trace}
        fill="none"
        style={{ stroke: teinte }}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={x(valeurs.length - 1)}
        cy={y(valeurs[valeurs.length - 1])}
        r={2.5}
        style={{ fill: teinte }}
      />
    </svg>
  );
}
