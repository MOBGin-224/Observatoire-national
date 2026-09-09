const COULEUR: Record<string, string> = {
  RECENSE: "var(--data-recense)",
  OBSERVE: "var(--data-observe)",
  EXPRIME: "var(--data-exprime)",
  DECLARE: "var(--data-declare)",
  ESTIME: "var(--data-estime)",
};

/*
 * Rendu du badge de statut de donnee, sans acces a la base.
 *
 * BadgeStatutDonnee resout le libelle cote serveur puis delegue ici. Les ecrans
 * qui doivent afficher un statut depuis un composant client (la fiche
 * d'indicateur de la methodologie, par exemple) recoivent le libelle en
 * propriete et utilisent directement cette pastille : le libelle continue de
 * venir de la table enumeration, jamais d'une chaine ecrite en dur.
 *
 * La pastille de couleur ne porte jamais l'information seule : le libelle est
 * toujours a cote (document 8, section 2.6).
 */
export function PastilleStatut({ code, libelle }: { code: string; libelle: string }) {
  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: "var(--space-2)",
        fontFamily: "var(--font-texte)",
        fontSize: "var(--text-label)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase",
        color: "var(--color-text-secondary)",
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block rounded-full"
        style={{
          width: "7px",
          height: "7px",
          backgroundColor: COULEUR[code] ?? "var(--color-text-muted)",
        }}
      />
      {libelle}
    </span>
  );
}
