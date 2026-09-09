import { createClient } from "@/lib/supabase/server";

/**
 * Document 9bis, partie H. Lectures reservees au profil ADMIN : la policy RLS
 * "admin lecture" (migration 30) fait deja barrage a tout autre profil, ces
 * fonctions ne font qu'exposer le resultat au format attendu par l'UI.
 */

export type Institution = {
  id: string;
  denomination: string;
  type: string | null;
  logoUrl: string | null;
  conventionReference: string | null;
  conventionDebut: string | null;
  conventionFin: string | null;
  actif: boolean;
};

export async function listerInstitutions(): Promise<Institution[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("institution")
    .select(
      "id, denomination, type, logo_url, convention_reference, convention_debut, convention_fin, actif"
    )
    .order("denomination", { ascending: true });

  if (error || !data) return [];

  return data.map((ligne) => ({
    id: ligne.id,
    denomination: ligne.denomination,
    type: ligne.type,
    logoUrl: ligne.logo_url,
    conventionReference: ligne.convention_reference,
    conventionDebut: ligne.convention_debut,
    conventionFin: ligne.convention_fin,
    actif: ligne.actif,
  }));
}

export async function chargerInstitution(id: string): Promise<Institution | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("institution")
    .select(
      "id, denomination, type, logo_url, convention_reference, convention_debut, convention_fin, actif"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    denomination: data.denomination,
    type: data.type,
    logoUrl: data.logo_url,
    conventionReference: data.convention_reference,
    conventionDebut: data.convention_debut,
    conventionFin: data.convention_fin,
    actif: data.actif,
  };
}

export type CompteInstitutionnel = {
  id: string;
  nom: string;
  prenom: string;
  fonction: string | null;
  email: string | null;
  profil: string;
  codeTerritoirePerimetre: string | null;
  granulariteMax: string | null;
  langue: string | null;
  dateExpiration: string | null;
  statut: string;
  modules: string[];
};

export async function listerComptes(idInstitution: string): Promise<CompteInstitutionnel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("compte_institutionnel")
    .select(
      "id, nom, prenom, fonction, email, profil, code_territoire_perimetre, granularite_max, langue, date_expiration, statut, compte_module(code_module, actif)"
    )
    .eq("id_institution", idInstitution)
    .order("nom", { ascending: true });

  if (error || !data) return [];

  return data.map((ligne) => ({
    id: ligne.id,
    nom: ligne.nom,
    prenom: ligne.prenom,
    fonction: ligne.fonction,
    email: ligne.email,
    profil: ligne.profil,
    codeTerritoirePerimetre: ligne.code_territoire_perimetre,
    granulariteMax: ligne.granularite_max,
    langue: ligne.langue,
    dateExpiration: ligne.date_expiration,
    statut: ligne.statut,
    modules: (ligne.compte_module ?? [])
      .filter((m: { code_module: string; actif: boolean }) => m.actif)
      .map((m: { code_module: string; actif: boolean }) => m.code_module),
  }));
}

export type LigneImport = {
  id: string;
  horodatage: string;
  nomFichier: string;
  nbLignesTotal: number;
  nbLignesValides: number;
  nbLignesErreur: number;
};

export async function listerImports(): Promise<LigneImport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("import_recensement")
    .select("id, horodatage, nom_fichier, nb_lignes_total, nb_lignes_valides, nb_lignes_erreur")
    .order("horodatage", { ascending: false });

  if (error || !data) return [];

  return data.map((ligne) => ({
    id: ligne.id,
    horodatage: ligne.horodatage,
    nomFichier: ligne.nom_fichier,
    nbLignesTotal: ligne.nb_lignes_total,
    nbLignesValides: ligne.nb_lignes_valides,
    nbLignesErreur: ligne.nb_lignes_erreur,
  }));
}
