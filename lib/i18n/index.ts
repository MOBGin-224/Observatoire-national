import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const catalogues = { fr, en };

export type Langue = keyof typeof catalogues;

function resoudre(catalogue: Record<string, unknown>, cle: string): string {
  const valeur = cle
    .split(".")
    .reduce<unknown>((acc, segment) => (acc as Record<string, unknown>)?.[segment], catalogue);
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
