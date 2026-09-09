import { createClient } from "@/lib/supabase/server";

export type ConformiteNationale = {
  offEtabRecenses: number;
  confEffectifTransmission: number;
  confTauxEnregistrement: number | null;
  confTauxClassification: number | null;
  confEcartEnregistrement: number | null;
  confEtabPretsClassification: number;
  confEtabRecensesPrep: number;
  offEcartListeAdmin: number;
  calculeA: string;
};

/* Document 9 quater, L : ecran M5_CONFORMITE. Zones 4 (preparation) et 5
 * (ecart terrain) fonctionnent des le premier jour ; zones 1/2/3/6 (donnees
 * administratives transmises) restent vides tant qu'aucune transmission
 * n'a eu lieu (L.7). Reserve au profil TUTELLE (document 6), impose par
 * lib/permissions/matrice.ts. */
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
    confEtabPretsClassification: data.conf_etab_prets_classification,
    confEtabRecensesPrep: data.conf_etab_recenses_prep,
    offEcartListeAdmin: data.off_ecart_liste_admin,
    calculeA: data.calcule_a,
  };
}
