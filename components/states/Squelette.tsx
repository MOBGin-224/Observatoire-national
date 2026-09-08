/*
 * Etat 1, chargement (document 9, A.4) : squelette aux dimensions finales,
 * jamais un saut de mise en page quand la donnee arrive.
 */
export function Squelette({ hauteur = "2.5rem" }: { hauteur?: string }) {
  return (
    <div
      aria-hidden
      className="animate-pulse rounded"
      style={{ height: hauteur, backgroundColor: "var(--color-bg-subtle)" }}
    />
  );
}
