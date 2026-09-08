import { resoudreLibelleEnumeration } from "@/lib/enumerations";

const COULEUR: Record<string, string> = {
  CONSOLIDE: "var(--fiab-consolide)",
  INDICATIF: "var(--fiab-indicatif)",
  SIGNAL: "var(--fiab-signal)",
};

/* Document 3, section 5 : "un outil qui qualifie lui-meme la robustesse de ses chiffres inspire plus confiance". */
export async function BadgeFiabilite({ code }: { code: string }) {
  const libelle = (await resoudreLibelleEnumeration("FIABILITE", code)) ?? code;
  const couleur = COULEUR[code] ?? "var(--color-text-muted)";

  return (
    <span style={{ fontSize: "var(--text-meta)", fontWeight: 500, color: couleur }}>
      {libelle}
    </span>
  );
}
