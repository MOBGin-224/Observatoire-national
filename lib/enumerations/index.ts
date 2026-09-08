import { createClient } from "@/lib/supabase/server";

/**
 * Document 11, section 8 : les libelles d'enumeration viennent de la table
 * enumeration, jamais des fichiers de traduction.
 */
export async function resoudreLibelleEnumeration(
  domaine: string,
  code: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enumeration")
    .select("libelle_fr")
    .eq("domaine", domaine)
    .eq("code", code)
    .maybeSingle();

  if (error || !data) return null;
  return data.libelle_fr;
}
