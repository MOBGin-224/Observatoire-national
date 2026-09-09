/*
 * Titre de section d'ecran. Un numero d'ordre, un intitule en petites
 * capitales, un filet qui court jusqu'au bord droit.
 *
 * Document 8, point 12.1 : la hierarchie ne passe ni par une icone ni par une
 * couleur decorative. Elle passe ici par le contraste entre le numero en
 * Montserrat et l'intitule en petites capitales, et par le filet horizontal,
 * qui est le vocabulaire d'une publication institutionnelle.
 */
export function TitreSection({
  numero,
  titre,
  complement,
}: {
  numero: string;
  titre: string;
  complement?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline" style={{ gap: "var(--space-3)" }}>
      <span
        className="chiffres-tabulaires shrink-0"
        style={{
          fontFamily: "var(--font-titre)",
          fontSize: "var(--text-h3)",
          fontWeight: 700,
          color: "var(--color-primary-200)",
          letterSpacing: "var(--tracking-titre)",
        }}
      >
        {numero}
      </span>
      <h2
        className="shrink-0"
        style={{
          fontFamily: "var(--font-texte)",
          fontSize: "var(--text-label)",
          fontWeight: 700,
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          color: "var(--color-primary-700)",
        }}
      >
        {titre}
      </h2>
      <span
        aria-hidden="true"
        className="min-w-0 flex-1"
        style={{ height: "1px", backgroundColor: "var(--color-border)", transform: "translateY(-3px)" }}
      />
      {complement}
    </div>
  );
}
