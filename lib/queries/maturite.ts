import { createClient } from "@/lib/supabase/server";

export type CleComposante =
  | "presenceLigne"
  | "canalReservation"
  | "tarifsPublies"
  | "coordonneesValides"
  | "paiementCarte"
  | "paiementMobile";

export type MaturiteNationale = {
  offEtabRecenses: number;
  matIndice: number | null;
  matTauxPaiementNumerique: number | null;
  offTauxNumerisation: number | null;
  offTauxReservabilite: number | null;
  decomposition: Record<CleComposante, number | null>;
  /* Poids lus dans la base, ceux-la memes qui ont servi au calcul du score. */
  ponderation: Record<CleComposante, number | null>;
  effectifCarteRenseigne: number;
  effectifMobileRenseigne: number;
  /* Au moins une des deux composantes de paiement renseignee. */
  effectifPaiementConnu: number;
  /*
   * Document 16, B.1 : l'indice est composite et prend le plus faible de ses
   * niveaux ; les taux d'inventaire et le taux de paiement ont chacun le leur.
   */
  niveauFiabilite: string | null;
  fiabiliteInventaire: string | null;
  fiabilitePaiement: string | null;
  calculeA: string;
};

export type LigneMaturiteRegion = {
  codeTerritoire: string;
  offEtabRecenses: number;
  matIndice: number | null;
  tauxPresence: number | null;
  tauxReservation: number | null;
  tauxPaiement: number | null;
  effectifPaiementConnu: number;
  niveauFiabilite: string | null;
};

export type LigneMaturiteCroisement = {
  dimension: "TYPOLOGIE" | "GAMME";
  code: string;
  effectif: number;
  matIndice: number | null;
  niveauFiabilite: string | null;
};

const CLES_PONDERATION: Record<CleComposante, string> = {
  presenceLigne: "presence_ligne",
  canalReservation: "canal_reservation",
  tarifsPublies: "tarifs_publies",
  coordonneesValides: "coordonnees_valides",
  paiementCarte: "paiement_carte",
  paiementMobile: "paiement_mobile",
};

function lirePonderation(brut: unknown): Record<CleComposante, number | null> {
  const source = (brut ?? {}) as Record<string, unknown>;
  const ponderation = {} as Record<CleComposante, number | null>;
  for (const [cle, colonne] of Object.entries(CLES_PONDERATION) as [CleComposante, string][]) {
    const valeur = source[colonne];
    ponderation[cle] = typeof valeur === "number" ? valeur : null;
  }
  return ponderation;
}

/*
 * Document 9 ter, partie I : ecran M6_MATURITE. Tout vient des vues d'acces,
 * qui filtrent par compte, module et perimetre ; l'indice n'est jamais
 * recalcule ici (critere I.11.1).
 */
export async function chargerMaturiteNationale(): Promise<MaturiteNationale | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_maturite_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    offEtabRecenses: data.off_etab_recenses,
    matIndice: data.mat_indice,
    matTauxPaiementNumerique: data.mat_taux_paiement_numerique,
    offTauxNumerisation: data.off_taux_numerisation,
    offTauxReservabilite: data.off_taux_reservabilite,
    decomposition: {
      presenceLigne: data.mat_comp_presence_ligne,
      canalReservation: data.mat_comp_canal_reservation,
      tarifsPublies: data.mat_comp_tarifs_publies,
      coordonneesValides: data.mat_comp_coordonnees_valides,
      paiementCarte: data.mat_comp_paiement_carte,
      paiementMobile: data.mat_comp_paiement_mobile,
    },
    ponderation: lirePonderation(data.mat_ponderation),
    effectifCarteRenseigne: data.mat_effectif_carte_renseigne,
    effectifMobileRenseigne: data.mat_effectif_mobile_renseigne,
    effectifPaiementConnu: data.mat_effectif_paiement_connu,
    niveauFiabilite: data.niveau_fiabilite ?? null,
    fiabiliteInventaire: data.fiabilite_inventaire ?? null,
    fiabilitePaiement: data.fiabilite_paiement ?? null,
    calculeA: data.calcule_a,
  };
}

/* Zones 2 et 6 : une ligne par region portant au moins un etablissement recense. */
export async function chargerMaturiteRegions(): Promise<LigneMaturiteRegion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_maturite_region").select("*");

  if (error || !data) return [];

  return data.map((ligne) => ({
    codeTerritoire: ligne.code_territoire,
    offEtabRecenses: ligne.off_etab_recenses,
    matIndice: ligne.mat_indice,
    tauxPresence: ligne.mat_comp_presence_ligne,
    tauxReservation: ligne.mat_comp_canal_reservation,
    tauxPaiement: ligne.mat_taux_paiement_numerique,
    effectifPaiementConnu: ligne.mat_effectif_paiement_connu,
    niveauFiabilite: ligne.niveau_fiabilite ?? null,
  }));
}

/* Zones 4 et 5 : indice moyen par typologie et par gamme tarifaire. */
export async function chargerMaturiteCroisements(): Promise<LigneMaturiteCroisement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_maturite_croisements").select("*");

  if (error || !data) return [];

  return data.map((ligne) => ({
    dimension: ligne.dimension,
    code: ligne.code,
    effectif: ligne.effectif_echantillon,
    matIndice: ligne.mat_indice,
    niveauFiabilite: ligne.niveau_fiabilite ?? null,
  }));
}
