/**
 * Document 13, section 13, et document 14, section 5.3. Fichier de
 * configuration unique.
 *
 * Les douze parametres arbitres sont ici et nulle part ailleurs. Aucun d'eux
 * n'est ecrit en dur dans un composant, une requete ou une route. Changer une
 * valeur se fait dans ce fichier, apres amendement du document 13.
 *
 * Les durees sont exprimees en millisecondes, unite attendue par Date.now().
 */

import { MATRICE_PROFIL_MODULE } from "@/lib/permissions/matrice";

const MINUTE = 60 * 1000;
const HEURE = 60 * MINUTE;

/** Document 13, section 2. Deux compteurs paralleles : le premier qui expire ferme la session. */
export const SESSION = {
  /** Inactivite avant deconnexion, profils institutionnels. */
  inactiviteInstitutionnelMs: 45 * MINUTE,
  /** Inactivite avant deconnexion, profil ADMIN : seul profil a acceder aux donnees brutes. */
  inactiviteAdminMs: 20 * MINUTE,
  /** Plafond absolu commun, quelle que soit l'activite. Passe ce delai, reconnexion avec second facteur. */
  dureeMaximaleMs: 5 * HEURE,
} as const;

/** Document 13, section 3. Notification d'approche d'expiration de compte. */
export const NOTIFICATION_EXPIRATION = {
  /** Echeances en jours avant la date d'expiration du compte. */
  echeancesJours: [30, 7],
} as const;

/** Document 13, section 4. Le plafond protege la lisibilite du rapport de controle, pas la machine. */
export const IMPORT = {
  plafondLignes: 2500,
  /** Document 10, section 12 bis : CSV, separateur point-virgule. */
  separateur: ";",
} as const;

/** Document 13, section 1, et document 14, section 4. Compartiment prive, adresses signees. */
export const LOGO = {
  compartiment: "logos-institutions",
  tailleMaximaleOctets: 2 * 1024 * 1024,
  typesMime: ["image/png", "image/svg+xml"],
  extensions: [".png", ".svg"],
  /** Duree de validite d'une adresse signee. Assez courte pour ne pas circuler, assez longue pour un rendu PDF. */
  dureeAdresseSigneeSecondes: 5 * 60,
} as const;

/** Document 13, section 8. Durees provisoires, a reviser apres verification juridique. */
export const CONSERVATION = {
  rechercheMois: 24,
  journalAccesMois: 36,
} as const;

/** Document 9 bis, partie H.4.1. Detection de doublon potentiel a l'import. */
export const DOUBLON = {
  distanceMetres: 300,
  /** Nom normalise identique sur la meme commune. */
  nomIdentiqueSurMemeCommune: true,
} as const;

/**
 * Vue unique des douze parametres, pour l'ecran de methodologie et pour la
 * verification de recette. Ne pas lire une valeur ici dans du code metier :
 * passer par la constante du domaine concerne.
 */
export const CONFIGURATION = {
  SESSION,
  NOTIFICATION_EXPIRATION,
  IMPORT,
  LOGO,
  CONSERVATION,
  DOUBLON,
} as const;

/**
 * Document 13, section 2. Le profil ADMIN a un seuil d'inactivite plus court.
 *
 * Fail-closed, comme le controle de second facteur du proxy : un profil
 * inconnu ou indeterminable recoit le seuil le plus court, jamais le plus
 * long. Une session fermee trop tot se rouvre, une session laissee ouverte
 * sur un poste sans surveillance ne se rattrape pas.
 */
export function seuilInactiviteMs(profil: string): number {
  const profilInstitutionnelConnu =
    profil !== "ADMIN" && Object.prototype.hasOwnProperty.call(MATRICE_PROFIL_MODULE, profil);
  return profilInstitutionnelConnu
    ? SESSION.inactiviteInstitutionnelMs
    : SESSION.inactiviteAdminMs;
}
