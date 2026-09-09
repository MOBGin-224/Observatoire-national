/*
 * Cartouche de tete d'un ecran de module : code du module, titre, et la question
 * metier a laquelle l'ecran repond.
 *
 * La question n'est pas un ornement. Le document 1 pose que toute fonctionnalite
 * sert l'une des trois questions de l'Observatoire ; l'ecrire en tete d'ecran est
 * ce qui permet a un cadre qui decouvre l'outil en reunion de savoir en deux
 * secondes ce qu'il regarde.
 */
export function EnTeteModule({
  code,
  titre,
  question,
}: {
  code: string;
  titre: string;
  question: string;
}) {
  return (
    <header
      className="flex flex-col"
      style={{ gap: "var(--space-2)", paddingBottom: "var(--space-5)" }}
    >
      <span
        className="etiquette"
        style={{ color: "var(--color-primary-500)" }}
      >
        {code}
      </span>
      <h1
        style={{
          fontFamily: "var(--font-titre)",
          fontSize: "var(--text-h1)",
          fontWeight: 700,
          letterSpacing: "var(--tracking-titre)",
          color: "var(--color-text)",
        }}
      >
        {titre}
      </h1>
      <p
        className="max-w-[68ch]"
        style={{
          fontSize: "var(--text-body)",
          lineHeight: 1.5,
          color: "var(--color-text-secondary)",
        }}
      >
        {question}
      </p>
    </header>
  );
}
