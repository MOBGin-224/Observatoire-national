import { createClient } from "@/lib/supabase/server";

/*
 * Document 9 quater, partie M : ecran M8_RETOMBEES.
 *
 * Le module reste desactive pour tous les comptes : la base le ferme tant
 * qu'aucun coefficient courant, source, perimetre et date de validation
 * renseignes, n'est enregistre (document 16, B.4). Les vues d'acces ne
 * renvoient donc aucune ligne aujourd'hui, et l'ecran s'arrete au bandeau de
 * methode, qui dit pourquoi.
 *
 * L'estimation n'est jamais calculee ici : la vue la produit a la lecture, a
 * partir du seul coefficient courant et valide.
 */

export type RetombeesNationales = {
  retMasque: boolean;
  retEffectifPartenaires: number;
  retReservations: number;
  actNuitees: number;
  retDepenseHebergement: number | null;
  retDepenseTotaleEstimee: number | null;
  niveauFiabilite: string | null;
  calculeA: string;
};

export type PointRetombees = { mois: string; depense: number | null; masque: boolean };

export type LigneRetombeesRepartition = {
  dimension: "TYPOLOGIE" | "GAMME" | "ORIGINE";
  code: string;
  depense: number | null;
  nuitees: number | null;
  masque: boolean;
};

export type LigneRetombeesRegion = {
  codeTerritoire: string;
  nuitees: number | null;
  depense: number | null;
  estimee: number | null;
  masque: boolean;
};

export type CoefficientRetombees = {
  valeur: number;
  source: string;
  perimetre: string;
  dateValidation: string;
};

export async function chargerRetombeesNationales(): Promise<RetombeesNationales | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_retombees_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    retMasque: data.ret_masque,
    retEffectifPartenaires: data.ret_effectif_partenaires,
    retReservations: data.ret_reservations,
    actNuitees: data.act_nuitees,
    retDepenseHebergement: data.ret_depense_hebergement,
    retDepenseTotaleEstimee: data.ret_depense_totale_estimee,
    niveauFiabilite: data.niveau_fiabilite ?? null,
    calculeA: data.calcule_a,
  };
}

/* Zone 3 : depense observee par mois d'arrivee. Un mois masque arrive sans valeur. */
export async function chargerRetombeesEvolution(): Promise<PointRetombees[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acces_retombees_evolution")
    .select("mois, ret_depense_hebergement, masque")
    .order("mois", { ascending: true });

  if (error || !data) return [];

  return data.map((ligne) => ({
    mois: ligne.mois,
    depense: ligne.ret_depense_hebergement,
    masque: ligne.masque,
  }));
}

/* Zone 4 : depense observee par typologie, par gamme et par origine declaree. */
export async function chargerRetombeesRepartitions(): Promise<LigneRetombeesRepartition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_retombees_repartitions").select("*");

  if (error || !data) return [];

  return data.map((ligne) => ({
    dimension: ligne.dimension,
    code: ligne.code,
    depense: ligne.ret_depense_hebergement,
    nuitees: ligne.act_nuitees,
    masque: ligne.masque,
  }));
}

/* Zone 5 : detail par region. */
export async function chargerRetombeesRegions(): Promise<LigneRetombeesRegion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_retombees_region").select("*");

  if (error || !data) return [];

  return data.map((ligne) => ({
    codeTerritoire: ligne.code_territoire,
    nuitees: ligne.act_nuitees,
    depense: ligne.ret_depense_hebergement,
    estimee: ligne.ret_depense_totale_estimee,
    masque: ligne.masque,
  }));
}

/*
 * Zone 1, bandeau de methode (document 9 quater, M.6). Le coefficient ne
 * s'affiche que complet : sans source, perimetre ou date de validation, le
 * bandeau dit que le module est desactive (document 16, B.4).
 */
export async function chargerCoefficientCourant(): Promise<CoefficientRetombees | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coefficient_retombees")
    .select("valeur, source_libelle, perimetre_source, date_validation")
    .eq("courante", true)
    .maybeSingle();

  if (error || !data) return null;
  if (!data.source_libelle || !data.perimetre_source || !data.date_validation) return null;

  return {
    valeur: Number(data.valeur),
    source: data.source_libelle,
    perimetre: data.perimetre_source,
    dateValidation: data.date_validation,
  };
}
