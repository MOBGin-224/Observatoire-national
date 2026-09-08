import { createClient } from "@/lib/supabase/server";

export type LigneDemande = {
  demVolumeRecherches: number;
  demBookingWindow: number | null;
  demDureeSejourRecherchee: number | null;
  demBudgetRecherche: number | null;
  demBudgetEffectif: number;
  demBudgetPartPct: number | null;
  demOriginePays: Record<string, number>;
  demRepartitionAppareil: Record<string, number>;
  demRepartitionCanal: Record<string, number>;
  demDestinationsNonReconnues: Record<string, number>;
  effectifEchantillon: number;
  niveauFiabilite: string;
  calculeA: string;
};

/* Document 9, partie C : ecran M2_DEMANDE, niveau national uniquement pour l'instant
 * (meme limite que M1_OFFRE, document 2 point ouvert sur le referentiel territorial). */
export async function chargerDemandeNationale(): Promise<LigneDemande | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_demande_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    demVolumeRecherches: data.dem_volume_recherches,
    demBookingWindow: data.dem_booking_window,
    demDureeSejourRecherchee: data.dem_duree_sejour_recherchee,
    demBudgetRecherche: data.dem_budget_recherche,
    demBudgetEffectif: data.dem_budget_effectif,
    demBudgetPartPct: data.dem_budget_part_pct,
    demOriginePays: data.dem_origine_pays ?? {},
    demRepartitionAppareil: data.dem_repartition_appareil ?? {},
    demRepartitionCanal: data.dem_repartition_canal ?? {},
    demDestinationsNonReconnues: data.dem_destinations_non_reconnues ?? {},
    effectifEchantillon: data.effectif_echantillon,
    niveauFiabilite: data.niveau_fiabilite,
    calculeA: data.calcule_a,
  };
}
