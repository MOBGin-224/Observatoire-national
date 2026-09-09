import { couleurSequentielle, type Part } from "./geometrie";

/*
 * Classement en barres horizontales (document 8, section 6). Axe demarrant a
 * zero, etiquette de donnee affichee, effectif toujours visible a cote de la
 * part. Une seule idee par graphique : le rang.
 */
export function BarresClassees({
  parts,
  formaterValeur,
  largeurLibelle = "9rem",
  monochrome = false,
}: {
  parts: Part[];
  formaterValeur: (valeur: number) => string;
  largeurLibelle?: string;
  monochrome?: boolean;
}) {
  const triees = [...parts].sort((a, b) => b.valeur - a.valeur);
  const maximum = Math.max(...triees.map((p) => p.valeur), 0);
  const total = triees.reduce((somme, p) => somme + p.valeur, 0);

  return (
    <ul className="flex flex-col" style={{ gap: "var(--space-3)" }}>
      {triees.map((part, index) => {
        const largeur = maximum > 0 ? (part.valeur / maximum) * 100 : 0;
        const share = total > 0 ? (part.valeur / total) * 100 : 0;
        return (
          <li key={part.code} className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <span
              className="shrink-0 truncate text-right"
              style={{
                width: largeurLibelle,
                fontSize: "var(--text-small)",
                color: "var(--color-text-secondary)",
              }}
            >
              {part.libelle}
            </span>
            <div
              className="relative h-5 flex-1"
              style={{ backgroundColor: "var(--color-bg-panel)", borderRadius: "2px" }}
            >
              <div
                className="h-5"
                style={{
                  width: `${largeur}%`,
                  minWidth: part.valeur > 0 ? "2px" : 0,
                  borderRadius: "2px",
                  backgroundColor: monochrome
                    ? "var(--color-primary-700)"
                    : couleurSequentielle(index, triees.length),
                }}
              />
            </div>
            <span
              className="chiffres-tabulaires w-16 shrink-0 text-right"
              style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text)" }}
            >
              {formaterValeur(part.valeur)}
            </span>
            <span
              className="chiffres-tabulaires w-14 shrink-0 text-right"
              style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}
            >
              {share.toFixed(1).replace(".", ",")} %
            </span>
          </li>
        );
      })}
    </ul>
  );
}
