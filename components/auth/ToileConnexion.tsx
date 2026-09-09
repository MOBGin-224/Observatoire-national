/*
 * Composition d'accueil de l'écran de connexion.
 *
 * Entièrement tracée en SVG, aucune image, aucune dépendance, aucun appel
 * réseau. Une photographie posée là poserait trois problèmes : un poids qui
 * pénalise la connexion à faible débit visée par le document 8 section 9, une
 * question de droits sur un outil destiné à des institutions, et un rendu flou
 * à l'impression. Un tracé vectoriel de quelques kilo-octets n'en pose aucun,
 * reste net à toutes les tailles et se recolore par les jetons de la charte.
 *
 * Le sujet : le relief guinéen, quatre plans de crêtes qui s'éloignent du plus
 * sombre au plus clair, sous un ciel de courbes de niveau et d'une trame de
 * points de mesure.
 *
 * L'idée : la deuxième crête n'est pas un décor. C'est une série. Elle porte
 * ses points de mesure, et son sommet est marqué en vert de marque. On lit un
 * paysage, puis on reconnaît une courbe. C'est exactement ce que fait
 * l'Observatoire : regarder un territoire et en tirer une mesure.
 *
 * Aucune animation, conformément au document 9, A.0.
 */

/* Sommets de la crête qui porte la série. Le point le plus haut est marqué. */
const CRETE_SERIE = [
  [-40, 792],
  [72, 744],
  [168, 702],
  [262, 748],
  [352, 700],
  [448, 758],
  [540, 716],
  [648, 754],
  [742, 722],
  [840, 760],
] as const;

const INDEX_SOMMET = CRETE_SERIE.reduce(
  (haut, point, index, tous) => (point[1] < tous[haut][1] ? index : haut),
  0
);

/** Trace une crête fermée vers le bas du cadre. */
function silhouette(points: readonly (readonly [number, number])[]): string {
  const ligne = points.map(([x, y]) => `${x} ${y}`).join(" L ");
  return `M -40 1300 L ${ligne} L 840 1300 Z`;
}

const CRETE_LOINTAINE = [
  [-40, 700],
  [64, 638],
  [152, 672],
  [252, 594],
  [344, 650],
  [432, 608],
  [542, 668],
  [640, 622],
  [734, 660],
  [840, 632],
] as const;

const CRETE_MEDIANE = [
  [-40, 884],
  [88, 840],
  [200, 878],
  [300, 822],
  [402, 870],
  [500, 834],
  [612, 882],
  [702, 844],
  [840, 886],
] as const;

const CRETE_PROCHE = [
  [-40, 1006],
  [118, 958],
  [242, 1008],
  [360, 948],
  [482, 998],
  [604, 954],
  [722, 1004],
  [840, 966],
] as const;

/* Courbes de niveau du ciel : trois boucles ouvertes, imbriquées, qui citent
   le vocabulaire d'une carte sans en dessiner une. */
const COURBES_NIVEAU = [
  "M -60 300 C 120 236, 300 372, 470 300 S 760 176, 900 244",
  "M -60 360 C 130 300, 296 424, 470 356 S 764 240, 900 302",
  "M -60 424 C 140 368, 292 476, 470 414 S 768 306, 900 362",
  "M -60 178 C 110 128, 288 250, 466 182 S 752 72, 900 136",
] as const;

export function ToileConnexion() {
  return (
    <svg
      viewBox="0 0 800 1200"
      /* Ancrage en bas : un paysage garde son sol au sol, quelle que soit la
         hauteur de la fenetre. Un centrage recadrerait les cretes au hasard du
         format. */
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <defs>
        <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04182B" />
          <stop offset="55%" stopColor="#072A4A" />
          <stop offset="100%" stopColor="#0E3D66" />
        </linearGradient>

        {/* Lueur d'horizon, posée derrière les crêtes. */}
        <radialGradient id="horizon" cx="0.46" cy="0.57" r="0.5">
          <stop offset="0%" stopColor="#2C6291" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2C6291" stopOpacity="0" />
        </radialGradient>

        {/* Trame de points de mesure. */}
        <pattern id="trame-mesure" width="38" height="38" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="#9DB8D1" fillOpacity="0.16" />
        </pattern>

        {/* Le ciel s'estompe vers l'horizon : la trame ne doit pas concurrencer
            la ligne de crête. */}
        <linearGradient id="fondu-trame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <mask id="masque-trame">
          <rect x="0" y="0" width="800" height="760" fill="url(#fondu-trame)" />
        </mask>
      </defs>

      <rect x="0" y="0" width="800" height="1200" fill="url(#ciel)" />
      <rect x="0" y="0" width="800" height="760" fill="url(#trame-mesure)" mask="url(#masque-trame)" />
      <rect x="-100" y="200" width="1000" height="900" fill="url(#horizon)" />

      {COURBES_NIVEAU.map((trace, index) => (
        <path
          key={trace}
          d={trace}
          fill="none"
          stroke="#7599B5"
          strokeOpacity={0.16 + index * 0.03}
          strokeWidth={1}
        />
      ))}

      {/* Quatre plans de relief, du plus lointain au plus proche. */}
      <path d={silhouette(CRETE_LOINTAINE)} fill="#2C5A82" fillOpacity="0.5" />
      <path d={silhouette(CRETE_SERIE)} fill="#164A76" />
      <path d={silhouette(CRETE_MEDIANE)} fill="#0B3B66" />
      <path d={silhouette(CRETE_PROCHE)} fill="#04182B" />

      {/* La crête qui se lit comme une série : ligne claire, points de mesure,
          sommet marqué au vert de marque. */}
      <polyline
        points={CRETE_SERIE.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="#D8E4EE"
        strokeOpacity="0.85"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {CRETE_SERIE.map(([x, y], index) =>
        index === INDEX_SOMMET ? (
          <g key={x}>
            <circle cx={x} cy={y} r={9} fill="#228C22" fillOpacity="0.22" />
            <circle cx={x} cy={y} r={4.5} fill="#228C22" stroke="#D8E4EE" strokeWidth={1.25} />
          </g>
        ) : (
          <circle key={x} cx={x} cy={y} r={2.75} fill="#D8E4EE" fillOpacity="0.9" />
        )
      )}

      {/* Repère vertical du sommet, comme sur une courbe de l'outil. */}
      <line
        x1={CRETE_SERIE[INDEX_SOMMET][0]}
        x2={CRETE_SERIE[INDEX_SOMMET][0]}
        y1={CRETE_SERIE[INDEX_SOMMET][1] + 12}
        y2={CRETE_SERIE[INDEX_SOMMET][1] + 132}
        stroke="#228C22"
        strokeOpacity="0.4"
        strokeWidth={1}
        strokeDasharray="3 4"
      />
    </svg>
  );
}
