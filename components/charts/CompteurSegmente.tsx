/*
 * Compteur segmente : une grandeur bornee, lue comme une reglette graduee.
 *
 * Forme retenue pour les mesures de qualite plutot qu'une barre pleine : les
 * segments donnent une granularite de lecture (chaque segment vaut cinq points)
 * sans exiger de lire une graduation chiffree, ce qui tient en projection a trois
 * metres. L'echelle est fixe de zero a cent, donc deux ecrans sont comparables.
 */
export function CompteurSegmente({
  valeur,
  segments = 20,
  teinte = "var(--color-primary-700)",
  libelle,
}: {
  valeur: number;
  segments?: number;
  teinte?: string;
  libelle: string;
}) {
  const borne = Math.max(0, Math.min(100, valeur));
  const remplis = Math.round((borne / 100) * segments);

  return (
    <div
      className="flex w-full"
      style={{ gap: "2px", height: "18px" }}
      role="img"
      aria-label={libelle}
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className="flex-1"
          style={{
            backgroundColor: index < remplis ? teinte : "var(--color-border-faint)",
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
}
