import { decouperEnSecteurs, secteurAnneau, type Part } from "./geometrie";

/*
 * Anneau de repartition : la structure d'un total, secteurs ordonnes du plus
 * gros au plus petit, du bleu le plus fonce au plus clair. Le total occupe le
 * centre, ce qui evite l'erreur classique de l'anneau : donner une part sans
 * jamais donner l'effectif sur lequel elle porte.
 *
 * La legende porte toujours l'effectif ET la part. Document 8, section 2.6 :
 * la couleur ne porte jamais seule une information.
 */
export function Anneau({
  parts,
  total,
  legendeCentre,
  taille = 188,
  epaisseur = 34,
}: {
  parts: Part[];
  total: string;
  legendeCentre: string;
  taille?: number;
  epaisseur?: number;
}) {
  const secteurs = decouperEnSecteurs(parts);
  const centre = taille / 2;
  const rayonExterieur = taille / 2;
  const rayonInterieur = rayonExterieur - epaisseur;

  return (
    <div className="flex items-center" style={{ gap: "var(--space-6)" }}>
      <svg
        width={taille}
        height={taille}
        viewBox={`0 0 ${taille} ${taille}`}
        role="img"
        aria-label={legendeCentre}
        className="shrink-0"
      >
        {secteurs.map((secteur) => (
          <path
            key={secteur.code}
            d={secteurAnneau(
              centre,
              centre,
              rayonExterieur,
              rayonInterieur,
              secteur.angleDebut,
              secteur.angleFin
            )}
            style={{ fill: secteur.couleur }}
          >
            <title>{`${secteur.libelle} : ${secteur.valeur} (${secteur.part.toFixed(1)} %)`}</title>
          </path>
        ))}
        <text
          x={centre}
          y={centre - 8}
          textAnchor="middle"
          dominantBaseline="central"
          className="chiffres-tabulaires"
          style={{
            fontFamily: "var(--font-titre)",
            fontSize: "var(--text-display)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-display)",
            fill: "var(--color-primary-700)",
          }}
        >
          {total}
        </text>
        <text
          x={centre}
          y={centre + 16}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "var(--font-texte)",
            fontSize: "var(--text-label)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            fill: "var(--color-text-muted)",
          }}
        >
          {legendeCentre}
        </text>
      </svg>

      <ul className="flex min-w-0 flex-1 flex-col" style={{ gap: "var(--space-2)" }}>
        {secteurs.map((secteur) => (
          <li key={secteur.code} className="flex items-baseline" style={{ gap: "var(--space-2)" }}>
            <span
              aria-hidden="true"
              className="shrink-0"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: secteur.couleur,
                transform: "translateY(1px)",
              }}
            />
            <span
              className="min-w-0 flex-1 truncate"
              style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
            >
              {secteur.libelle}
            </span>
            <span
              className="chiffres-tabulaires shrink-0 text-right"
              style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text)" }}
            >
              {secteur.valeur}
            </span>
            <span
              className="chiffres-tabulaires w-14 shrink-0 text-right"
              style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}
            >
              {secteur.part.toFixed(1).replace(".", ",")} %
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
