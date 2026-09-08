import { resoudreLibelleEnumeration } from "@/lib/enumerations";

const COULEUR: Record<string, string> = {
  RECENSE: "var(--data-recense)",
  OBSERVE: "var(--data-observe)",
  EXPRIME: "var(--data-exprime)",
  DECLARE: "var(--data-declare)",
  ESTIME: "var(--data-estime)",
};

/* Document 3, section 5.1 : un meme graphique ne melange jamais deux statuts de donnee. */
export async function BadgeStatutDonnee({ code }: { code: string }) {
  const libelle = (await resoudreLibelleEnumeration("STATUT_DONNEE", code)) ?? code;
  const couleur = COULEUR[code] ?? "var(--color-text-muted)";

  return (
    <span
      className="rounded px-1.5 py-0.5"
      style={{
        fontFamily: "var(--font-texte)",
        fontSize: "var(--text-label)",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: couleur,
        border: `1px solid ${couleur}`,
      }}
    >
      {libelle}
    </span>
  );
}
