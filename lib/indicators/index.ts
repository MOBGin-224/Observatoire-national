import { createClient } from "@/lib/supabase/server";

export type MetadonneesIndicateur = {
  code: string;
  libelleFr: string;
  libelleEn: string | null;
  unite: string | null;
  decimales: number;
  statutDonnee: string | null;
  regleMasquage: string | null;
};

/**
 * Document 11, section 6.4 : un bloc d'indicateur ne connait jamais son libelle
 * en dur. Il connait son code et interroge cette couche, qui lit la table
 * indicateur (le dictionnaire du document 4 vit en base, pas dans un fichier).
 */
export async function resoudreIndicateur(code: string): Promise<MetadonneesIndicateur | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("indicateur")
    .select("code, libelle_fr, libelle_en, unite, decimales, statut_donnee, regle_masquage")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) return null;

  return {
    code: data.code,
    libelleFr: data.libelle_fr,
    libelleEn: data.libelle_en,
    unite: data.unite,
    decimales: data.decimales ?? 0,
    statutDonnee: data.statut_donnee,
    regleMasquage: data.regle_masquage,
  };
}
