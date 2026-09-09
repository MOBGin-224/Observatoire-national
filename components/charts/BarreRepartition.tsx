import { couleurSequentielle, type Part } from "./geometrie";

/*
 * Barre de repartition a cent pour cent, pour une variable ordonnee dont
 * l'ordre porte du sens (une gamme tarifaire va de l'economique au haut de
 * gamme). Les paliers suivent la rampe sequentielle dans l'ordre de la variable,
 * jamais dans l'ordre des effectifs : c'est ce qui rend deux territoires
 * comparables d'un coup d'oeil.
 */
export function BarreRepartition({
  parts,
  formaterValeur,
}: {
  parts: Part[];
  formaterValeur: (valeur: number) => string;
}) {
  const total = parts.reduce((somme, p) => somme + p.valeur, 0);
  if (total <= 0) return null;

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
      <div
        className="flex overflow-hidden"
        style={{ height: "28px", borderRadius: "2px", gap: "2px" }}
        role="img"
        aria-label={parts.map((p) => `${p.libelle} ${p.valeur}`).join(", ")}
      >
        {parts.map((part, index) => {
          const largeur = (part.valeur / total) * 100;
          if (largeur <= 0) return null;
          return (
            <div
              key={part.code}
              style={{
                width: `${largeur}%`,
                backgroundColor: couleurSequentielle(index, parts.length),
              }}
              title={`${part.libelle} : ${formaterValeur(part.valeur)}`}
            />
          );
        })}
      </div>

      <ul className="flex flex-wrap" style={{ gap: "var(--space-2) var(--space-5)" }}>
        {parts.map((part, index) => {
          const share = (part.valeur / total) * 100;
          return (
            <li key={part.code} className="flex items-baseline" style={{ gap: "var(--space-2)" }}>
              <span
                aria-hidden="true"
                className="shrink-0"
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  backgroundColor: couleurSequentielle(index, parts.length),
                  transform: "translateY(1px)",
                }}
              />
              <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
                {part.libelle}
              </span>
              <span
                className="chiffres-tabulaires"
                style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text)" }}
              >
                {formaterValeur(part.valeur)}
              </span>
              <span
                className="chiffres-tabulaires"
                style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}
              >
                {share.toFixed(1).replace(".", ",")} %
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
