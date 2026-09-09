import { resoudreLibelleEnumeration } from "@/lib/enumerations";
import { PastilleStatut } from "./PastilleStatut";

/* Document 3, section 5.1 : un meme graphique ne melange jamais deux statuts de donnee. */
export async function BadgeStatutDonnee({ code }: { code: string }) {
  const libelle = (await resoudreLibelleEnumeration("STATUT_DONNEE", code)) ?? code;
  return <PastilleStatut code={code} libelle={libelle} />;
}
