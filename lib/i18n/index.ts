import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const catalogues = { fr, en };

export type Langue = keyof typeof catalogues;

function resoudre(catalogue: Record<string, unknown>, cle: string): string {
  const noeud = cle
    .split(".")
    .reduce<unknown>((acc, segment) => (acc as Record<string, unknown>)?.[segment], catalogue);
  /* Document 10, section 19 : un noeud qui porte a la fois un texte et des
     sous-cles (m7.z3.partenaires et m7.z3.partenaires.aide) range son texte
     sous "_". La cle appelee reste celle du document. */
  const valeur =
    noeud !== null && typeof noeud === "object" ? (noeud as Record<string, unknown>)._ : noeud;
  if (typeof valeur !== "string") {
    throw new Error(`Cle de traduction absente : ${cle}`);
  }
  return valeur;
}

/**
 * Document 11, section 8 : les libelles viennent exclusivement de ces fichiers,
 * jamais d'une chaine ecrite en dur dans un composant.
 * `variables` remplace les marqueurs {cle} du libelle (ex: perimetre.etablissements).
 */
export function t(
  cle: string,
  variables?: Record<string, string | number>,
  langue: Langue = "fr"
): string {
  const brut = resoudre(catalogues[langue], cle);
  if (!variables) return brut;
  return Object.entries(variables).reduce(
    (texte, [nom, valeur]) => texte.replaceAll(`{${nom}}`, String(valeur)),
    brut
  );
}
