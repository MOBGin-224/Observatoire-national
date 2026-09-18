import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const catalogues = { fr, en };

export type Langue = keyof typeof catalogues;

/**
 * Document 17, D.4 : regle de pluriel.
 *
 * Le francais met au singulier zero et un : « 0 nuit ». L'anglais ne met au
 * singulier que un, et dit « 0 nights ». Une regle unique produirait une faute
 * dans l'une des deux langues.
 */
function formeAttendue(n: number, langue: Langue): "un" | "autre" {
  return langue === "fr" ? (n === 0 || n === 1 ? "un" : "autre") : n === 1 ? "un" : "autre";
}

/* Un libelle a decompte porte ses deux formes, et nomme la variable qui decide
   quand ce n'est pas {n} : { compte: "nuits", un: "...", autre: "..." }. */
function estLibelleADecompte(noeud: Record<string, unknown>): boolean {
  return typeof noeud.un === "string" && typeof noeud.autre === "string";
}

function resoudre(
  catalogue: Record<string, unknown>,
  cle: string,
  langue: Langue,
  variables?: Record<string, string | number>
): string {
  const noeud = cle
    .split(".")
    .reduce<unknown>((acc, segment) => (acc as Record<string, unknown>)?.[segment], catalogue);

  let valeur: unknown = noeud;

  if (noeud !== null && typeof noeud === "object") {
    const objet = noeud as Record<string, unknown>;
    if (estLibelleADecompte(objet)) {
      const nomCompteur = typeof objet.compte === "string" ? objet.compte : "n";
      const compte = variables?.[nomCompteur];
      if (typeof compte !== "number") {
        throw new Error(
          `Libelle a decompte appele sans sa variable {${nomCompteur}} : ${cle}`
        );
      }
      valeur = objet[formeAttendue(compte, langue)];
    } else {
      /* Document 10, section 19 : un noeud qui porte a la fois un texte et des
         sous-cles (module.m7.z3.partenaires et .aide) range son texte sous "_".
         La cle appelee reste celle du document. */
      valeur = objet._;
    }
  }

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
  const brut = resoudre(catalogues[langue], cle, langue, variables);
  if (!variables) return brut;
  return Object.entries(variables).reduce(
    (texte, [nom, valeur]) => texte.replaceAll(`{${nom}}`, String(valeur)),
    brut
  );
}
