import { createClient } from "@/lib/supabase/server";

export type ActiviteNationale = {
  actReservations: number;
  actNuitees: number;
  actTauxOccupation: number | null;
  actTauxOccupationContractualise: number | null;
  actAdr: number | null;
  actRevpar: number | null;
  actAlos: number | null;
  actLeadTime: number | null;
  actTauxAnnulation: number | null;
  actTauxNonPresentation: number | null;
  actTauxConversion: number | null;
  actMasque: boolean;
  actEffectifPartenaires: number;
  actEffectifRecherches: number;
  calculeA: string;
};

/* Document 9 quater, K : ecran M3_ACTIVITE, niveau national uniquement (memes
 * raisons que M1/M2/M4 : pas de referentiel territorial complet, pas de
 * bibliotheque de graphiques retenue pour la zone 2, evolution). */
export async function chargerActiviteNationale(): Promise<ActiviteNationale | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_activite_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    actReservations: data.act_reservations,
    actNuitees: data.act_nuitees,
    actTauxOccupation: data.act_taux_occupation,
    actTauxOccupationContractualise: data.act_taux_occupation_contractualise,
    actAdr: data.act_adr,
    actRevpar: data.act_revpar,
    actAlos: data.act_alos,
    actLeadTime: data.act_lead_time,
    actTauxAnnulation: data.act_taux_annulation,
    actTauxNonPresentation: data.act_taux_non_presentation,
    actTauxConversion: data.act_taux_conversion,
    actMasque: data.act_masque,
    actEffectifPartenaires: data.act_effectif_partenaires,
    actEffectifRecherches: data.act_effectif_recherches,
    calculeA: data.calcule_a,
  };
}

export type PointActivite = {
  mois: string;
  actReservations: number;
  actNuitees: number;
  actAdr: number | null;
  actRevpar: number | null;
  actTauxOccupationContractualise: number | null;
  masque: boolean;
};

/*
 * Z2, evolution dans le temps (document 9 quater, K.5). Les formules de la vue
 * reprennent a l'identique celles de mv_activite_national : la courbe et le
 * bloc cle ne peuvent pas diverger.
 */
export async function chargerActiviteEvolution(): Promise<PointActivite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_activite_evolution")
    .select(
      "mois, act_reservations, act_nuitees, act_adr, act_revpar, act_taux_occupation_contractualise, masque"
    )
    .order("mois", { ascending: true });

  if (error || !data) return [];

  return data.map((ligne) => ({
    mois: ligne.mois,
    actReservations: ligne.act_reservations,
    actNuitees: ligne.act_nuitees,
    actAdr: ligne.act_adr,
    actRevpar: ligne.act_revpar,
    actTauxOccupationContractualise: ligne.act_taux_occupation_contractualise,
    masque: ligne.masque,
  }));
}
