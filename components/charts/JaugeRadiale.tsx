/*
 * Jauge radiale : une valeur unique en pourcentage, lue en un coup d'oeil.
 * Document 8, section 6, "indicateur simple" : une valeur unique en evidence.
 *
 * Ce n'est pas un camembert. L'interdiction du document 8 vise la comparaison
 * de categories dans un disque, illisible d'un ecran a l'autre. Ici une seule
 * grandeur est representee, sur une echelle fixe de zero a cent, donc comparable
 * d'un ecran a l'autre et d'une periode a l'autre.
 *
 * `valeur` a null produit l'etat 3 du document 9, A.4 : l'anneau garde sa piste
 * et ses dimensions, et le centre porte la mention d'absence. La zone ne change
 * ni de taille ni de forme selon qu'il y a une donnee ou non, ce qui evite le
 * saut de mise en page a l'arrivee des donnees et donne un ecran vide qui reste
 * un ecran compose.
 */
export function JaugeRadiale({
  valeur,
  texte,
  texteVide,
  taille = 116,
  epaisseur = 11,
  teinte = "var(--color-primary-700)",
  fondPiste = "var(--color-primary-100)",
}: {
  valeur: number | null;
  texte?: string;
  texteVide?: string;
  taille?: number;
  epaisseur?: number;
  teinte?: string;
  fondPiste?: string;
}) {
  const centre = taille / 2;
  const rayon = (taille - epaisseur) / 2;
  const circonference = 2 * Math.PI * rayon;
  const absente = valeur === null;
  const borne = absente ? 0 : Math.max(0, Math.min(100, valeur));
  const remplissage = (borne / 100) * circonference;

  return (
    <svg
      width={taille}
      height={taille}
      viewBox={`0 0 ${taille} ${taille}`}
      role="img"
      aria-label={absente ? texteVide : texte}
      className="shrink-0"
    >
      <circle
        cx={centre}
        cy={centre}
        r={rayon}
        fill="none"
        strokeWidth={epaisseur}
        style={{ stroke: absente ? "var(--color-border-faint)" : fondPiste }}
      />
      {!absente && borne > 0 && (
        <circle
          cx={centre}
          cy={centre}
          r={rayon}
          fill="none"
          strokeWidth={epaisseur}
          strokeLinecap="round"
          strokeDasharray={`${remplissage.toFixed(2)} ${(circonference - remplissage).toFixed(2)}`}
          transform={`rotate(-90 ${centre} ${centre})`}
          style={{ stroke: teinte }}
        />
      )}
      <text
        x={centre}
        y={centre}
        textAnchor="middle"
        dominantBaseline="central"
        className={absente ? undefined : "chiffres-tabulaires"}
        style={
          absente
            ? {
                fontFamily: "var(--font-texte)",
                fontSize: "var(--text-meta)",
                fontWeight: 500,
                fill: "var(--color-text-muted)",
              }
            : {
                fontFamily: "var(--font-titre)",
                fontSize: "var(--text-h2)",
                fontWeight: 700,
                letterSpacing: "var(--tracking-display)",
                fill: "var(--color-primary-700)",
              }
        }
      >
        {absente ? texteVide : texte}
      </text>
    </svg>
  );
}
