import { createClient } from "@/lib/supabase/server";

export type Territoire = {
  code: string;
  libelle: string;
  niveau: string;
  codeParent: string | null;
};

/**
 * Subdivisions d'un territoire, lues dans le referentiel et non dans une vue
 * d'agregat.
 *
 * La distinction est ce qui permet de tenir le critere B.10.1 du document 9 :
 * un territoire sans aucun etablissement doit afficher zero, pas disparaitre.
 * Les vues materialisees agregent des etablissements, donc ne produisent aucune
 * ligne pour un territoire vide ; seul le referentiel connait la liste complete.
 *
 * `codeParent` a null retourne le premier echelon, celui des regions.
 */
export async function chargerTerritoiresEnfants(
  codeParent: string | null,
  niveau: string
): Promise<Territoire[]> {
  const supabase = await createClient();
  let requete = supabase
    .from("territoire")
    .select("code, libelle, niveau, code_parent")
    .eq("niveau", niveau)
    .eq("actif", true);

  requete = codeParent === null ? requete.is("code_parent", null) : requete.eq("code_parent", codeParent);

  const { data, error } = await requete.order("libelle", { ascending: true });

  if (error || !data) return [];

  return data.map((ligne) => ({
    code: ligne.code,
    libelle: ligne.libelle,
    niveau: ligne.niveau,
    codeParent: ligne.code_parent,
  }));
}
