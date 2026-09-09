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

export type ValeurEnumeration = {
  code: string;
  libelleFr: string;
  libelleEn: string | null;
};

/**
 * Liste les valeurs actives d'un domaine, pour peupler un <select>.
 * Document 2 : liste fermee obligatoire, jamais de saisie libre.
 */
export async function listerEnumeration(domaine: string): Promise<ValeurEnumeration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enumeration")
    .select("code, libelle_fr, libelle_en")
    .eq("domaine", domaine)
    .eq("actif", true)
    .order("ordre", { ascending: true, nullsFirst: false });

  if (error || !data) return [];

  return data.map((ligne) => ({
    code: ligne.code,
    libelleFr: ligne.libelle_fr,
    libelleEn: ligne.libelle_en,
  }));
}
