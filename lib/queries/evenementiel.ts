import { createClient } from "@/lib/supabase/server";

export type EvenementielNational = {
  eveCapacitePartenaires: number;
  eveCapaciteRecenseeNonPartenaire: number;
  eveCapaciteMobilisable: number;
  eveNbEtabSalles: number;
  eveCapaciteSalles: number;
  eveEffectifDemandes: number;
  insVolumeDemande: number;
  insTauxCouverture: number | null;
  eveTauxTensionEvenement: number | null;
  eveEffectifEvenements: number;
  calculeA: string;
};

/* Document 9 ter, J : ecran M7_EVENEMENTIEL, tres fortement reduit par rapport
 * a la fiche complete. Le selecteur de fenetre (mode evenement / dates
 * libres, document 9 ter J.5) n'est pas implemente : aucune bibliotheque de
 * calendrier retenue, et la base ne contient aucun evenement ni aucune
 * demande institutionnelle a ce jour. L'ecran affiche donc une photo
 * "a partir d'aujourd'hui", pas une fenetre choisie. A revoir des qu'un
 * premier evenement ou une premiere demande institutionnelle existera. */
export async function chargerEvenementielNational(): Promise<EvenementielNational | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_evenementiel_national")
    .select("*")
    .maybeSingle();

  if (error || !data) return null;

  return {
    eveCapacitePartenaires: data.eve_capacite_partenaires,
    eveCapaciteRecenseeNonPartenaire: data.eve_capacite_recensee_non_partenaire,
    eveCapaciteMobilisable: data.eve_capacite_mobilisable,
    eveNbEtabSalles: data.eve_nb_etab_salles,
    eveCapaciteSalles: data.eve_capacite_salles,
    eveEffectifDemandes: data.eve_effectif_demandes,
    insVolumeDemande: data.ins_volume_demande,
    insTauxCouverture: data.ins_taux_couverture,
    eveTauxTensionEvenement: data.eve_taux_tension_evenement,
    eveEffectifEvenements: data.eve_effectif_evenements,
    calculeA: data.calcule_a,
  };
}
