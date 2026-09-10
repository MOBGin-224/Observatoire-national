import { createClient } from "@/lib/supabase/server";

export type Perimetre = {
  etablissementsRecenses: number;
  partenaires: number;
  reservablesEnLigne: number;
  tauxCouverture: number | null;
  tauxVerification: number | null;
  territoiresCouverts: number;
  territoiresTotal: number;
  calculeA: string;
};

/**
 * Bandeau de perimetre (document 9, A.1 ; document 15, section 6) : non
 * masquable, present sur tous les ecrans, en deux variantes selon le profil.
 *
 * Lit la vue securisee acces_perimetre_national, jamais la vue materialisee
 * brute ni une table de faits (document 11, section 6.1). Cette vue ne depend
 * d'aucun module actif : le bandeau s'affiche pour tout compte valide, quel
 * que soit son perimetre de modules.
 *
 * Les champs des deux variantes sont charges ensemble et le cloisonnement se
 * fait a l'affichage. Aucune de ces valeurs n'est sensible au sens du document
 * 7 : le nombre de partenaires et la capacite couverte sont simplement hors
 * sujet pour une institution, pas confidentiels.
 */
export async function chargerPerimetre(): Promise<Perimetre | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_perimetre_national")
    .select(
      "off_etab_recenses, off_etab_partenaires, off_etab_reservables, off_taux_couverture, off_taux_verification, territoires_couverts, territoires_total, calcule_a"
    )
    .maybeSingle();

  if (error || !data) return null;

  return {
    etablissementsRecenses: data.off_etab_recenses,
    partenaires: data.off_etab_partenaires,
    reservablesEnLigne: data.off_etab_reservables,
    tauxCouverture: data.off_taux_couverture,
    tauxVerification: data.off_taux_verification,
    territoiresCouverts: data.territoires_couverts,
    territoiresTotal: data.territoires_total,
    calculeA: data.calcule_a,
  };
}
