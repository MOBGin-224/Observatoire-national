import { createClient } from "@/lib/supabase/server";

/*
 * Document 9 quater, partie L : ecran M5_CONFORMITE. Reserve au profil
 * TUTELLE (document 6, section 3) : l'acces effectif est garanti par les vues
 * d'acces (module_actif), pas par la page.
 *
 * Deux familles de valeurs, qui ne se melangent jamais :
 *   - recensement (zones 4 et 5, et le volume recense) : disponibles des le
 *     premier jour, statut RECENSE ;
 *   - transmission administrative (zones 1, 2, 3 et 6) : nulles tant
 *     qu'aucune donnee n'a ete transmise (L.7). Nulles, jamais a zero.
 */
export type ConformiteNationale = {
  offEtabRecenses: number;
  confEffectifTransmission: number;
  confTauxEnregistrement: number | null;
  confTauxClassification: number | null;
  confEcartEnregistrement: number | null;
  confEnregistres: number | null;
  confClasses: number | null;
  confFichesCompletes: number;
  confFichesVerifiees: number;
  confEtabPretsClassification: number;
  confEcartFermes: number;
  confEcartInexistants: number;
  confEcartReclasses: number;
  offEcartListeAdmin: number;
  confSources: string | null;
  confDateDonnees: string | null;
  /* Niveau des indicateurs administratifs, sur l'effectif transmis. */
  niveauFiabilite: string | null;
  /* Niveau des zones de recensement, sur l'effectif recense. */
  fiabiliteRecensement: string | null;
  calculeA: string;
};

export type LigneConformiteRegion = {
  codeTerritoire: string;
  offEtabRecenses: number;
  confFichesCompletes: number;
  confFichesVerifiees: number;
  confEtabPretsClassification: number;
  confEcartFermes: number;
  confEcartInexistants: number;
  confEcartReclasses: number;
  offEcartListeAdmin: number;
  confEnregistres: number | null;
  confClasses: number | null;
  confTauxEnregistrement: number | null;
  confEcartEnregistrement: number | null;
};

export type LigneConformiteCroisement = {
  dimension: "TYPOLOGIE" | "GAMME";
  code: string;
  offEtabRecenses: number;
  confEnregistres: number | null;
  confClasses: number | null;
};

export async function chargerConformiteNationale(): Promise<ConformiteNationale | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_conformite_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    offEtabRecenses: data.off_etab_recenses,
    confEffectifTransmission: data.conf_effectif_transmission,
    confTauxEnregistrement: data.conf_taux_enregistrement,
    confTauxClassification: data.conf_taux_classification,
    confEcartEnregistrement: data.conf_ecart_enregistrement,
    confEnregistres: data.conf_enregistres,
    confClasses: data.conf_classes,
    confFichesCompletes: data.conf_fiches_completes,
    confFichesVerifiees: data.conf_fiches_verifiees,
    confEtabPretsClassification: data.conf_etab_prets_classification,
    confEcartFermes: data.conf_ecart_fermes,
    confEcartInexistants: data.conf_ecart_inexistants,
    confEcartReclasses: data.conf_ecart_reclasses,
    offEcartListeAdmin: data.off_ecart_liste_admin,
    confSources: data.conf_sources,
    confDateDonnees: data.conf_date_donnees,
    niveauFiabilite: data.niveau_fiabilite ?? null,
    fiabiliteRecensement: data.fiabilite_recensement ?? null,
    calculeA: data.calcule_a,
  };
}

/* Zones 2, 4, 5 et 6 : toutes les regions du referentiel, y compris vides. */
export async function chargerConformiteRegions(): Promise<LigneConformiteRegion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_conformite_region").select("*");

  if (error || !data) return [];

  return data.map((ligne) => ({
    codeTerritoire: ligne.code_territoire,
    offEtabRecenses: ligne.off_etab_recenses,
    confFichesCompletes: ligne.conf_fiches_completes,
    confFichesVerifiees: ligne.conf_fiches_verifiees,
    confEtabPretsClassification: ligne.conf_etab_prets_classification,
    confEcartFermes: ligne.conf_ecart_fermes,
    confEcartInexistants: ligne.conf_ecart_inexistants,
    confEcartReclasses: ligne.conf_ecart_reclasses,
    offEcartListeAdmin: ligne.off_ecart_liste_admin,
    confEnregistres: ligne.conf_enregistres,
    confClasses: ligne.conf_classes,
    confTauxEnregistrement: ligne.conf_taux_enregistrement,
    confEcartEnregistrement: ligne.conf_ecart_enregistrement,
  }));
}

/* Zone 3 : enregistrement et classification par typologie et par gamme. */
export async function chargerConformiteCroisements(): Promise<LigneConformiteCroisement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_conformite_croisements").select("*");

  if (error || !data) return [];

  return data.map((ligne) => ({
    dimension: ligne.dimension,
    code: ligne.code,
    offEtabRecenses: ligne.off_etab_recenses,
    confEnregistres: ligne.conf_enregistres,
    confClasses: ligne.conf_classes,
  }));
}
