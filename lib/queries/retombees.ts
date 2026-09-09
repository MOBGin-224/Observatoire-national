import { createClient } from "@/lib/supabase/server";

export type RetombeesNationales = {
  retMasque: boolean;
  retEffectifPartenaires: number;
  actNuitees: number;
  retDepenseHebergement: number;
  calculeA: string;
};

/* Document 9 quater, M : ecran M8_RETOMBEES. Module construit mais desactive
 * pour tous les comptes via compte_module (M.3 : trois conditions imperatives
 * avant activation, aucune reunie : coefficient multiplicateur non arrete,
 * methodologie non publiee dans M10_METHODO, validation direction absente).
 * RET_DEPENSE_TOTALE_ESTIMEE n'est donc jamais calculee ici : sans coefficient
 * publie, l'application ne produit aucune estimation (document 4, section 10). */
export async function chargerRetombeesNationales(): Promise<RetombeesNationales | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acces_retombees_national").select("*").maybeSingle();

  if (error || !data) return null;

  return {
    retMasque: data.ret_masque,
    retEffectifPartenaires: data.ret_effectif_partenaires,
    actNuitees: data.act_nuitees,
    retDepenseHebergement: data.ret_depense_hebergement,
    calculeA: data.calcule_a,
  };
}
