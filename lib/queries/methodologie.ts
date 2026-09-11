import { createClient } from "@/lib/supabase/server";

export type FicheIndicateur = {
  code: string;
  libelleFr: string;
  libelleEn: string | null;
  definitionFr: string | null;
  definitionEn: string | null;
  formule: string | null;
  unite: string | null;
  decimales: number;
  statutDonnee: string | null;
  regleMasquage: string | null;
  seuilConsolide: number | null;
  seuilIndicatif: number | null;
  frequenceRafraichissement: string | null;
  pieges: string | null;
};

export type VersionIndicateur = {
  version: string;
  formule: string | null;
  dateDebut: string | null;
  dateFin: string | null;
};

/* Document 9 bis, G.5 : le module M10_METHODO ne restitue jamais de donnee
 * chiffree du secteur, uniquement le contenu de la table indicateur, source
 * unique du document 4. */
export async function chargerTousLesIndicateurs(): Promise<FicheIndicateur[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("indicateur")
    .select(
      "code, libelle_fr, libelle_en, definition_fr, definition_en, formule, unite, decimales, statut_donnee, regle_masquage, seuil_consolide, seuil_indicatif, frequence_rafraichissement, pieges"
    )
    .order("code");

  if (error || !data) return [];

  return data.map((d) => ({
    code: d.code,
    libelleFr: d.libelle_fr,
    libelleEn: d.libelle_en,
    definitionFr: d.definition_fr,
    definitionEn: d.definition_en,
    formule: d.formule,
    unite: d.unite,
    decimales: d.decimales ?? 0,
    statutDonnee: d.statut_donnee,
    regleMasquage: d.regle_masquage,
    seuilConsolide: d.seuil_consolide,
    seuilIndicatif: d.seuil_indicatif,
    frequenceRafraichissement: d.frequence_rafraichissement,
    pieges: d.pieges,
  }));
}

export async function chargerVersionsIndicateur(code: string): Promise<VersionIndicateur[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("version_indicateur")
    .select("version, formule, date_debut, date_fin")
    .eq("code_indicateur", code)
    .order("date_debut");

  if (error || !data) return [];

  return data.map((d) => ({
    version: d.version,
    formule: d.formule,
    dateDebut: d.date_debut,
    dateFin: d.date_fin,
  }));
}

/**
 * Nombre d'indicateurs rattaches a chaque module, pour les cartes d'acces de la
 * synthese (document 9 bis, F.7).
 *
 * Lit la table d'association `indicateur_module` (document 15, section 5) et
 * non un prefixe de code : un indicateur appartient a plusieurs modules, et
 * `OFF_ETAB_RECENSES` compte dans cinq d'entre eux.
 */
/**
 * Document 16, section B.3 : M10_METHODO ne porte aucun indicateur en propre.
 * Sa carte d'acces affiche le nombre d'indicateurs documentes, tous modules
 * confondus.
 */
export async function compterIndicateursDocumentes(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("indicateur")
    .select("code", { count: "exact", head: true });

  if (error || count === null) return 0;
  return count;
}

export async function compterIndicateursParModule(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("indicateur_module").select("code_module");

  if (error || !data) return {};

  return data.reduce<Record<string, number>>((total, ligne) => {
    total[ligne.code_module] = (total[ligne.code_module] ?? 0) + 1;
    return total;
  }, {});
}
