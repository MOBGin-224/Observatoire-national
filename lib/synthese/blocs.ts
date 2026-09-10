/**
 * Document 9 bis, section F.4, complétée du profil `ADMIN` par le document 15,
 * section 1. Source de vérité unique des blocs clés de la synthèse.
 *
 * La sélection est déterminée par le profil du compte, jamais par un choix de
 * l'utilisateur : il n'existe aucune personnalisation d'écran. Un bloc dont le
 * module d'origine n'est pas autorisé pour le profil n'apparaît jamais.
 *
 * Huit blocs, sauf `EVENEMENTIEL` qui en compte six. **Ne jamais compléter
 * artificiellement jusqu'à huit** : c'est un critère de recette, F.10.4.
 */
export const BLOCS_SYNTHESE_PAR_PROFIL: Record<string, string[]> = {
  ATTRACTIVITE: [
    "OFF_ETAB_RECENSES",
    "OFF_CAPACITE_RECENSEE",
    "OFF_TAUX_COUVERTURE",
    "MAT_INDICE",
    "DEM_VOLUME_RECHERCHES",
    "DEM_BOOKING_WINDOW",
    "TEN_TAUX_INFRUCTUEUX",
    "TEN_CAPACITE_MANQUANTE",
  ],
  INVESTISSEMENT: [
    "OFF_ETAB_RECENSES",
    "OFF_CAPACITE_RECENSEE",
    "OFF_TAUX_RESERVABILITE",
    "MAT_INDICE",
    "DEM_VOLUME_RECHERCHES",
    "TEN_CAPACITE_MANQUANTE",
    "TEN_TAUX_INFRUCTUEUX",
    "INS_DEFICIT",
  ],
  TUTELLE: [
    "OFF_ETAB_RECENSES",
    "OFF_CAPACITE_RECENSEE",
    "OFF_TAUX_NUMERISATION",
    "OFF_TAUX_RESERVABILITE",
    "OFF_TAUX_VERIFICATION",
    "OFF_COMPLETUDE_FICHE",
    "CONF_TAUX_ENREGISTREMENT",
    "CONF_TAUX_CLASSIFICATION",
  ],
  BAILLEUR: [
    "OFF_ETAB_RECENSES",
    "OFF_CAPACITE_RECENSEE",
    "OFF_TAUX_NUMERISATION",
    "MAT_INDICE",
    "OFF_TAUX_VERIFICATION",
    "DEM_VOLUME_RECHERCHES",
    "TEN_TAUX_INFRUCTUEUX",
    "TEN_CAPACITE_MANQUANTE",
  ],
  /* Six blocs, et c'est voulu : c'est le profil le plus restreint. */
  EVENEMENTIEL: [
    "OFF_ETAB_RECENSES",
    "OFF_CAPACITE_RECENSEE",
    "EVE_CAPACITE_MOBILISABLE",
    "EVE_CAPACITE_SALLES",
    "TEN_TAUX_INFRUCTUEUX",
    "TEN_FENETRES_SATURATION",
  ],
  /*
   * Profil de pilotage interne, ni miroir de TUTELLE ni profil institutionnel.
   * Les cinq premiers mesurent l'avancement et la qualite du recensement, les
   * trois derniers disent si le signal de demande commence a monter.
   */
  ADMIN: [
    "OFF_ETAB_RECENSES",
    "OFF_CAPACITE_RECENSEE",
    "CTX_RECENSEMENT_PROGRESSION",
    "OFF_TAUX_VERIFICATION",
    "OFF_COMPLETUDE_FICHE",
    "OFF_TAUX_COUVERTURE",
    "DEM_VOLUME_RECHERCHES",
    "TEN_TAUX_INFRUCTUEUX",
  ],
};

export function blocsDuProfil(profil: string): string[] {
  return BLOCS_SYNTHESE_PAR_PROFIL[profil] ?? [];
}

/**
 * Les taux se lisent sur une echelle bornee de zero a cent, les volumes en
 * chiffre nu. Document 8 : la jauge represente une grandeur unique sur une
 * echelle fixe, elle ne compare pas des categories dans un disque.
 */
export function varianteDuBloc(code: string): "compact" | "jauge" {
  return code.includes("TAUX_") || code === "MAT_INDICE" || code === "OFF_COMPLETUDE_FICHE"
    ? "jauge"
    : "compact";
}
