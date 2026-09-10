import Papa from "papaparse";
import { DOUBLON, IMPORT } from "@/lib/config";

/**
 * Document 9bis H.4.1 + document 5 section 3. Parsing et validation pures :
 * aucun acces reseau ici, les lookups (variantes territoriales, doublons
 * potentiels) sont resolus en amont par l'appelant et injectes en parametre.
 *
 * Decision (point ouvert 9bis resolu, voir document 10 section 12 bis) :
 * format CSV, delimiteur point-virgule.
 *
 * Les parametres chiffres (separateur, plafond de lignes, distance de doublon)
 * viennent de lib/config, jamais d'une valeur ecrite ici. Document 14, section 5.3.
 */

const CHAMPS_OBLIGATOIRES = [
  "nom",
  "typologie",
  "territoire",
  "latitude",
  "longitude",
  "telephone_1",
  "capacite_unites",
  "gamme_tarifaire",
  "reservation_en_ligne",
  "source_recensement",
  "statut_relation",
] as const;

// Bornes approximatives de la Guinee (document 9bis H.4.1 : "coordonnees dans les bornes de la Guinee").
const BORNES_GUINEE = { latMin: 7.0, latMax: 12.8, lonMin: -15.2, lonMax: -7.5 };

export type LigneRecensementBrute = Record<string, string>;

export type EnumerationsValides = {
  typologie: Set<string>;
  gammeTarifaire: Set<string>;
  statutRelation: Set<string>;
  sourceRecensement: Set<string>;
};

export type EtablissementExistant = {
  nom: string;
  codeCommune: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type LigneValidee = {
  numeroLigne: number;
  nom: string;
  typologie: string;
  codeCommune: string;
  quartier: string | null;
  adresseTexte: string | null;
  latitude: number;
  longitude: number;
  capaciteUnites: number;
  gammeTarifaire: string;
  telephone1: string;
  telephone2: string | null;
  whatsapp: string | null;
  email: string | null;
  siteWeb: string | null;
  reservationEnLigne: boolean;
  sourceRecensement: string;
  statutRelation: string;
  notes: string | null;
  doublonPotentiel: boolean;
};

export type LigneEnErreur = {
  numeroLigne: number;
  motifs: { cle: string; variables?: Record<string, string> }[];
};

export type RapportImport = {
  nbLignesTotal: number;
  lignesValides: LigneValidee[];
  lignesErreur: LigneEnErreur[];
  /**
   * Document 13, section 4 : au-dela du plafond, le fichier n'est pas traite du
   * tout. Le rapport ligne a ligne deviendrait illisible, donc invalide en
   * aveugle. L'operateur scinde son fichier.
   */
  plafondDepasse: boolean;
};

function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

function distanceMetres(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Decision (point ouvert 9bis resolu) : doublon potentiel = nom normalise
 * identique sur la meme commune, ou coordonnees rapprochees.
 */
function estDoublonPotentiel(
  ligne: { nom: string; codeCommune: string; latitude: number; longitude: number },
  existants: EtablissementExistant[]
): boolean {
  const nomNormalise = normaliser(ligne.nom);
  return existants.some((e) => {
    const memeNom = normaliser(e.nom) === nomNormalise && e.codeCommune === ligne.codeCommune;
    const memeLieu =
      e.latitude !== null &&
      e.longitude !== null &&
      distanceMetres(ligne.latitude, ligne.longitude, e.latitude, e.longitude) <
        DOUBLON.distanceMetres;
    return memeNom || memeLieu;
  });
}

export function parserRecensement(
  contenuCsv: string,
  enumerations: EnumerationsValides,
  territoireParVariante: Map<string, string>,
  etablissementsExistants: EtablissementExistant[]
): RapportImport {
  const resultat = Papa.parse<LigneRecensementBrute>(contenuCsv, {
    header: true,
    delimiter: IMPORT.separateur,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  // Document 13, section 4 : controle avant traitement, jamais apres.
  if (resultat.data.length > IMPORT.plafondLignes) {
    return {
      nbLignesTotal: resultat.data.length,
      lignesValides: [],
      lignesErreur: [],
      plafondDepasse: true,
    };
  }

  const lignesValides: LigneValidee[] = [];
  const lignesErreur: LigneEnErreur[] = [];

  resultat.data.forEach((brute, index) => {
    const numeroLigne = index + 2; // +1 pour l'en-tete, +1 pour l'indexation a 1
    const motifs: LigneEnErreur["motifs"] = [];

    for (const champ of CHAMPS_OBLIGATOIRES) {
      if (!brute[champ] || brute[champ].trim() === "") {
        motifs.push({
          cle: "admin.import.erreur.champ_obligatoire_absent",
          variables: { champ },
        });
      }
    }

    if (motifs.length > 0) {
      lignesErreur.push({ numeroLigne, motifs });
      return;
    }

    const typologie = brute.typologie.trim().toUpperCase();
    if (!enumerations.typologie.has(typologie)) {
      motifs.push({
        cle: "admin.import.erreur.valeur_enumeration_invalide",
        variables: { champ: "typologie", valeur: brute.typologie },
      });
    }

    const gammeTarifaire = brute.gamme_tarifaire.trim().toUpperCase();
    if (!enumerations.gammeTarifaire.has(gammeTarifaire)) {
      motifs.push({
        cle: "admin.import.erreur.valeur_enumeration_invalide",
        variables: { champ: "gamme_tarifaire", valeur: brute.gamme_tarifaire },
      });
    }

    const statutRelation = brute.statut_relation.trim().toUpperCase();
    if (!enumerations.statutRelation.has(statutRelation)) {
      motifs.push({
        cle: "admin.import.erreur.valeur_enumeration_invalide",
        variables: { champ: "statut_relation", valeur: brute.statut_relation },
      });
    }

    const sourceRecensement = brute.source_recensement.trim().toUpperCase();
    if (!enumerations.sourceRecensement.has(sourceRecensement)) {
      motifs.push({
        cle: "admin.import.erreur.valeur_enumeration_invalide",
        variables: { champ: "source_recensement", valeur: brute.source_recensement },
      });
    }

    const codeCommune = territoireParVariante.get(normaliser(brute.territoire));
    if (!codeCommune) {
      motifs.push({
        cle: "admin.import.erreur.territoire_non_resolu",
        variables: { valeur: brute.territoire },
      });
    }

    const latitude = Number(brute.latitude.replace(",", "."));
    const longitude = Number(brute.longitude.replace(",", "."));
    const coordonneesValides =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= BORNES_GUINEE.latMin &&
      latitude <= BORNES_GUINEE.latMax &&
      longitude >= BORNES_GUINEE.lonMin &&
      longitude <= BORNES_GUINEE.lonMax;
    if (!coordonneesValides) {
      motifs.push({ cle: "admin.import.erreur.coordonnees_hors_bornes" });
    }

    const capaciteUnites = Number(brute.capacite_unites);
    if (!Number.isFinite(capaciteUnites) || capaciteUnites < 0) {
      motifs.push({
        cle: "admin.import.erreur.valeur_enumeration_invalide",
        variables: { champ: "capacite_unites", valeur: brute.capacite_unites },
      });
    }

    const reservationTexte = normaliser(brute.reservation_en_ligne);
    const reservationEnLigne = reservationTexte === "oui" || reservationTexte === "true";
    if (!["oui", "non", "true", "false"].includes(reservationTexte)) {
      motifs.push({
        cle: "admin.import.erreur.valeur_enumeration_invalide",
        variables: { champ: "reservation_en_ligne", valeur: brute.reservation_en_ligne },
      });
    }

    if (motifs.length > 0) {
      lignesErreur.push({ numeroLigne, motifs });
      return;
    }

    lignesValides.push({
      numeroLigne,
      nom: brute.nom.trim(),
      typologie,
      codeCommune: codeCommune!,
      quartier: brute.quartier?.trim() || null,
      adresseTexte: brute.adresse_texte?.trim() || null,
      latitude,
      longitude,
      capaciteUnites,
      gammeTarifaire,
      telephone1: brute.telephone_1.trim(),
      telephone2: brute.telephone_2?.trim() || null,
      whatsapp: brute.whatsapp?.trim() || null,
      email: brute.email?.trim() || null,
      siteWeb: brute.site_web?.trim() || null,
      reservationEnLigne,
      sourceRecensement,
      statutRelation,
      notes: brute.notes?.trim() || null,
      doublonPotentiel: estDoublonPotentiel(
        { nom: brute.nom.trim(), codeCommune: codeCommune!, latitude, longitude },
        etablissementsExistants
      ),
    });
  });

  return {
    nbLignesTotal: resultat.data.length,
    lignesValides,
    lignesErreur,
    plafondDepasse: false,
  };
}
