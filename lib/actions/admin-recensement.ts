"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { IMPORT } from "@/lib/config";
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
/* Taille de lot technique, pas un parametre metier : un fichier de 2 500 fiches
   peut porter jusqu'a 35 000 lignes d'equipement. */
const TAILLE_LOT_EQUIPEMENTS = 1000;

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

  // Document 13, section 4 : le plafond est un controle serveur, pas une regle
  // d'affichage. Un appel direct a l'action ne doit pas le contourner.
  if (rapport.plafondDepasse) {
    throw new Error(
      `Plafond d'import depasse : ${rapport.nbLignesTotal} lignes, ${IMPORT.plafondLignes} au maximum.`
    );
  }

  // Les doublons potentiels sont signales dans l'apercu (document 9bis H.4.1 :
  // "signalement, jamais fusion automatique") mais restent importables : le
  // choix d'ecarter une ligne signalee revient a l'operateur, pas au systeme.
  /* L'identifiant est attribue ici pour rattacher les equipements a leur fiche
     sans relire la table (document 16, section C.2). */
  const lignesAInserer = rapport.lignesValides.map((ligne) => ({ ligne, id: randomUUID() }));

  if (lignesAInserer.length > 0) {
    const { error: erreurEtablissements } = await supabase.from("etablissement").insert(
      lignesAInserer.map(({ ligne: l, id }) => ({
        id,
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
    if (erreurEtablissements) {
      throw new Error(`Import refuse par la base : ${erreurEtablissements.message}`);
    }

    /* Une ligne par equipement renseigne, aucune pour une cellule vide. */
    const equipements = lignesAInserer.flatMap(({ ligne: l, id }) =>
      l.equipements.map((e) => ({
        id_etablissement: id,
        code_equipement: e.codeEquipement,
        disponible: e.disponible,
        capacite: e.capacite,
        source: l.sourceRecensement,
      }))
    );
    for (let debut = 0; debut < equipements.length; debut += TAILLE_LOT_EQUIPEMENTS) {
      const { error } = await supabase
        .from("etablissement_equipement")
        .insert(equipements.slice(debut, debut + TAILLE_LOT_EQUIPEMENTS));
      if (error) {
        throw new Error(`Equipements refuses par la base : ${error.message}`);
      }
    }
  }

  await supabase.from("import_recensement").insert({
    id_compte: user?.id ?? null,
    nom_fichier: nomFichier,
    nb_lignes_total: rapport.nbLignesTotal,
    nb_lignes_valides: rapport.lignesValides.length,
    nb_lignes_erreur: rapport.lignesErreur.length,
    rapport: {
      lignesErreur: rapport.lignesErreur,
      lignesAvertissement: rapport.lignesValides
        .filter((l) => l.avertissements.length > 0)
        .map((l) => ({ numeroLigne: l.numeroLigne, motifs: l.avertissements })),
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
