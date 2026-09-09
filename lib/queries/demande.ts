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

export type PointSaisonnalite = {
  mois: string;
  demVolumeRecherches: number;
  demDureeSejourRecherchee: number | null;
  niveauFiabilite: string;
};

/*
 * Z4, saisonnalite de l'intention (document 9, C.5). Serie continue par mois
 * d'arrivee souhaitee : la vue produit un mois a zero plutot qu'un trou, sinon
 * la courbe relierait deux points de part et d'autre d'une absence.
 */
export async function chargerDemandeSaisonnalite(): Promise<PointSaisonnalite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_demande_saisonnalite")
    .select("mois, dem_volume_recherches, dem_duree_sejour_recherchee, niveau_fiabilite")
    .order("mois", { ascending: true });

  if (error || !data) return [];

  return data.map((ligne) => ({
    mois: ligne.mois,
    demVolumeRecherches: ligne.dem_volume_recherches,
    demDureeSejourRecherchee: ligne.dem_duree_sejour_recherchee,
    niveauFiabilite: ligne.niveau_fiabilite,
  }));
}

export type LigneDemandeTerritoire = {
  codeTerritoire: string;
  demVolumeRecherches: number;
  demSessions: number;
};

/*
 * Z2, destinations recherchees par territoire (document 9, C.5 et C.7).
 * Construite sur la destination saisie puis normalisee, jamais sur le pays de
 * la connexion : c'est le point de methode central du module.
 */
export async function chargerDemandeRegions(): Promise<LigneDemandeTerritoire[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_demande_region")
    .select("code_territoire, dem_volume_recherches, dem_sessions");

  if (error || !data) return [];

  return data.map((ligne) => ({
    codeTerritoire: ligne.code_territoire,
    demVolumeRecherches: ligne.dem_volume_recherches,
    demSessions: ligne.dem_sessions,
  }));
}
