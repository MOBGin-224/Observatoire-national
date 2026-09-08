import { createClient } from "@/lib/supabase/server";

export type Perimetre = {
  etablissementsRecenses: number;
  partenaires: number;
  tauxCouverture: number | null;
  calculeA: string;
};

/**
 * Bandeau de perimetre (document 9, A.1) : non masquable, present sur tous les
 * ecrans. Lit la vue securisee acces_offre_national, jamais la vue materialisee
 * brute ni une table de faits (document 11, section 6.1).
 */
export async function chargerPerimetre(): Promise<Perimetre | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_offre_national")
    .select("off_etab_recenses, off_etab_partenaires, off_taux_couverture, calcule_a")
    .maybeSingle();

  if (error || !data) return null;

  return {
    etablissementsRecenses: data.off_etab_recenses,
    partenaires: data.off_etab_partenaires,
    tauxCouverture: data.off_taux_couverture,
    calculeA: data.calcule_a,
  };
}
