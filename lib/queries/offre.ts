import { createClient } from "@/lib/supabase/server";

export type LigneOffre = {
  codeTerritoire: string | null;
  offEtabRecenses: number;
  offCapaciteRecensee: number;
  offEtabPartenaires: number;
  offTauxCouverture: number | null;
  offTauxNumerisation: number | null;
  offTauxReservabilite: number | null;
  offTauxVerification: number | null;
  offCompletudeFiche: number | null;
  offRepartitionTypologie: Record<string, number>;
  offRepartitionGamme: Record<string, number>;
  offEcartListeAdmin: number;
  effectifEchantillon: number;
  niveauFiabilite: string | null;
  masque: boolean;
  calculeA: string;
};

function versLigneOffre(d: Record<string, unknown>): LigneOffre {
  return {
    codeTerritoire: (d.code_territoire as string) ?? null,
    offEtabRecenses: d.off_etab_recenses as number,
    offCapaciteRecensee: d.off_capacite_recensee as number,
    offEtabPartenaires: d.off_etab_partenaires as number,
    offTauxCouverture: d.off_taux_couverture as number | null,
    offTauxNumerisation: d.off_taux_numerisation as number | null,
    offTauxReservabilite: d.off_taux_reservabilite as number | null,
    offTauxVerification: d.off_taux_verification as number | null,
    offCompletudeFiche: d.off_completude_fiche as number | null,
    offRepartitionTypologie: (d.off_repartition_typologie as Record<string, number>) ?? {},
    offRepartitionGamme: (d.off_repartition_gamme as Record<string, number>) ?? {},
    offEcartListeAdmin: d.off_ecart_liste_admin as number,
    effectifEchantillon: d.effectif_echantillon as number,
    niveauFiabilite: (d.niveau_fiabilite as string) ?? null,
    masque: (d.masque as boolean) ?? false,
    calculeA: d.calcule_a as string,
  };
}

/* Document 9, B : ecran M1_OFFRE, niveau national (le seul niveau exploitable tant
 * que le referentiel territorial reel n'est pas charge, document 2 section 20). */
export async function chargerOffreNationale(): Promise<LigneOffre | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_offre_national").select("*").maybeSingle();

  if (error || !data) return null;
  return versLigneOffre(data);
}

/* Z4, tableau des territoires enfants. Vide tant que le referentiel n'est pas charge. */
export async function chargerOffreRegions(): Promise<LigneOffre[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_offre_region").select("*");

  if (error || !data) return [];
  return data.map(versLigneOffre);
}
