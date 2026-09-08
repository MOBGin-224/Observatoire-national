import { createClient } from "@/lib/supabase/server";
import type { Langue } from "@/lib/i18n";

export type MonCompte = {
  nom: string;
  prenom: string;
  fonction: string | null;
  profil: string;
  langue: Langue;
  codeTerritoirePerimetre: string | null;
  granulariteMax: string | null;
  institutionDenomination: string | null;
  institutionLogoUrl: string | null;
};

/**
 * Document 6, section 1.3 : compte_institutionnel n'est jamais lu directement.
 * Passe par la fonction observatoire.mon_compte(), qui ne retourne que la ligne
 * de l'utilisateur connecte (auth.uid()).
 */
type LigneMonCompte = {
  nom: string;
  prenom: string;
  fonction: string | null;
  profil: string;
  langue: string | null;
  code_territoire_perimetre: string | null;
  granularite_max: string | null;
  institution_denomination: string | null;
  institution_logo_url: string | null;
};

export async function chargerMonCompte(): Promise<MonCompte | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("mon_compte").single();

  if (error || !data) return null;

  const ligne = data as LigneMonCompte;

  return {
    nom: ligne.nom,
    prenom: ligne.prenom,
    fonction: ligne.fonction,
    profil: ligne.profil,
    langue: (ligne.langue?.toLowerCase() as Langue) ?? "fr",
    codeTerritoirePerimetre: ligne.code_territoire_perimetre,
    granulariteMax: ligne.granularite_max,
    institutionDenomination: ligne.institution_denomination,
    institutionLogoUrl: ligne.institution_logo_url,
  };
}

export async function chargerMesModules(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("mes_modules");

  if (error || !data) return [];

  return data.map((ligne: { code_module: string }) => ligne.code_module);
}
