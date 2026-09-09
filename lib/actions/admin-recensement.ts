"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { chargerMonCompte } from "@/lib/queries/compte";
import {
  parserRecensement,
  type RapportImport,
  type EtablissementExistant,
} from "@/lib/csv/parseRecensement";

/**
 * Document 9bis H.4.1 : previsualisation obligatoire avant tout import, rapport
 * de controle ligne par ligne, rattachement territorial via territoire_variante,
 * doublon signale jamais fusionne, historique de l'import conserve.
 *
 * Les deux actions verifient estAppelantAdmin() en defense en profondeur :
 * elles utilisent createClient() (RLS active, deja restrictif), mais un
 * controle applicatif explicite produit une erreur claire plutot que de
 * compter sur RLS pour renvoyer silencieusement des ensembles vides.
 */
async function exigerAdmin(): Promise<void> {
  const compte = await chargerMonCompte();
  if (compte?.profil !== "ADMIN") {
    throw new Error("Action reservee au profil ADMIN.");
  }
}

async function chargerContexteValidation() {
  const supabase = await createClient();

  const [{ data: enums }, { data: variantes }, { data: territoiresLibelles }, { data: etabs }] =
    await Promise.all([
      supabase
        .from("enumeration")
        .select("domaine, code")
        .in("domaine", ["TYPOLOGIE", "GAMME", "STATUT_RELATION", "SOURCE_RECENSEMENT"])
        .eq("actif", true),
      supabase.from("territoire_variante").select("code_territoire, variante"),
      supabase.from("territoire").select("code, libelle").eq("niveau", "COMMUNE"),
      supabase.from("etablissement").select("nom, code_commune, latitude, longitude"),
    ]);

  const parDomaine = (domaine: string) =>
    new Set((enums ?? []).filter((e) => e.domaine === domaine).map((e) => e.code));

  const normaliser = (t: string) =>
    t
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim()
      .toLowerCase();

  const territoireParVariante = new Map<string, string>();
  for (const t of territoiresLibelles ?? []) {
    territoireParVariante.set(normaliser(t.libelle), t.code);
  }
  for (const v of variantes ?? []) {
    territoireParVariante.set(normaliser(v.variante), v.code_territoire);
  }

  const etablissementsExistants: EtablissementExistant[] = (etabs ?? []).map((e) => ({
    nom: e.nom,
    codeCommune: e.code_commune,
    latitude: e.latitude,
    longitude: e.longitude,
  }));

  return {
    enumerations: {
      typologie: parDomaine("TYPOLOGIE"),
      gammeTarifaire: parDomaine("GAMME"),
      statutRelation: parDomaine("STATUT_RELATION"),
      sourceRecensement: parDomaine("SOURCE_RECENSEMENT"),
    },
    territoireParVariante,
    etablissementsExistants,
  };
}

export async function previsualiserImport(contenuCsv: string): Promise<RapportImport> {
  await exigerAdmin();
  const contexte = await chargerContexteValidation();
  return parserRecensement(
    contenuCsv,
    contexte.enumerations,
    contexte.territoireParVariante,
    contexte.etablissementsExistants
  );
}

export async function validerImport(
  contenuCsv: string,
  nomFichier: string
): Promise<{ succes: boolean; nbInseres: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rapport = await previsualiserImport(contenuCsv);

  // Les doublons potentiels sont signales dans l'apercu (document 9bis H.4.1 :
  // "signalement, jamais fusion automatique") mais restent importables : le
  // choix d'ecarter une ligne signalee revient a l'operateur, pas au systeme.
  const lignesAInserer = rapport.lignesValides;

  if (lignesAInserer.length > 0) {
    await supabase.from("etablissement").insert(
      lignesAInserer.map((l) => ({
        nom: l.nom,
        typologie: l.typologie,
        code_commune: l.codeCommune,
        quartier: l.quartier,
        adresse_texte: l.adresseTexte,
        latitude: l.latitude,
        longitude: l.longitude,
        precision_geo: "RELEVE",
        capacite_unites: l.capaciteUnites,
        capacite_source: "DECLAREE",
        gamme_tarifaire: l.gammeTarifaire,
        telephone_1: l.telephone1,
        telephone_2: l.telephone2,
        whatsapp: l.whatsapp,
        email: l.email,
        site_web: l.siteWeb,
        reservation_en_ligne: l.reservationEnLigne,
        source_recensement: l.sourceRecensement,
        statut_relation: l.statutRelation,
        statut_verification: "NON_VERIFIE",
        notes: l.notes,
        actif: true,
      }))
    );
  }

  await supabase.from("import_recensement").insert({
    id_compte: user?.id ?? null,
    nom_fichier: nomFichier,
    nb_lignes_total: rapport.nbLignesTotal,
    nb_lignes_valides: rapport.lignesValides.length,
    nb_lignes_erreur: rapport.lignesErreur.length,
    rapport: {
      lignesErreur: rapport.lignesErreur,
      doublonsSignales: rapport.lignesValides.filter((l) => l.doublonPotentiel).length,
    },
  });

  if (user) {
    await supabase.from("journal_acces").insert({
      id_compte: user.id,
      module: "M11_ADMIN",
      action: "import_recensement",
      filtres: { nomFichier, nbInseres: lignesAInserer.length },
    });
  }

  revalidatePath("/administration/recensement");
  return { succes: true, nbInseres: lignesAInserer.length };
}
