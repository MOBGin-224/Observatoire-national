import { createClient } from "@/lib/supabase/server";

export type LigneTension = {
  tenTauxInfructueux: number | null;
  tenCapaciteManquante: number | null;
  tenCapaciteManquanteEffectif: number;
  tenIndiceTension: number | null;
  tenRepartitionEchec: Record<string, number>;
  effectifEchantillon: number;
  calculeA: string;
};

/* Document 9, partie D : ecran M4_TENSION, niveau national uniquement pour
 * l'instant (meme limite que les modules precedents). */
export async function chargerTensionNationale(): Promise<LigneTension | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_tension_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    tenTauxInfructueux: data.ten_taux_infructueux,
    tenCapaciteManquante: data.ten_capacite_manquante,
    tenCapaciteManquanteEffectif: data.ten_capacite_manquante_effectif,
    tenIndiceTension: data.ten_indice_tension,
    tenRepartitionEchec: data.ten_repartition_echec ?? {},
    effectifEchantillon: data.effectif_echantillon,
    calculeA: data.calcule_a,
  };
}
