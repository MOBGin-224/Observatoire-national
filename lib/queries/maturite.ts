import { createClient } from "@/lib/supabase/server";

export type MaturiteNationale = {
  offEtabRecenses: number;
  matIndice: number | null;
  matTauxPaiementNumerique: number | null;
  decomposition: {
    presenceLigne: number | null;
    canalReservation: number | null;
    tarifsPublies: number | null;
    coordonneesValides: number | null;
    paiementCarte: number | null;
    paiementMobile: number | null;
  };
  calculeA: string;
};

/* Document 9 ter, I : ecran M6_MATURITE, niveau national uniquement. Zone 2
 * (carte) et zones 4/5 (croisements typologie/gamme) et 6 (classement
 * territorial) absentes : pas de bibliotheque cartographique retenue, pas de
 * referentiel territorial complet (memes limites que M1/M2/M4). Aucun
 * indicateur de ce module n'est soumis a la regle M1 (I.9). */
export async function chargerMaturiteNationale(): Promise<MaturiteNationale | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_maturite_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    offEtabRecenses: data.off_etab_recenses,
    matIndice: data.mat_indice,
    matTauxPaiementNumerique: data.mat_taux_paiement_numerique,
    decomposition: {
      presenceLigne: data.mat_comp_presence_ligne,
      canalReservation: data.mat_comp_canal_reservation,
      tarifsPublies: data.mat_comp_tarifs_publies,
      coordonneesValides: data.mat_comp_coordonnees_valides,
      paiementCarte: data.mat_comp_paiement_carte,
      paiementMobile: data.mat_comp_paiement_mobile,
    },
    calculeA: data.calcule_a,
  };
}
