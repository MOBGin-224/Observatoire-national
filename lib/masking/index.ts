/**
 * Document 11, section 6.3 : applique le verdict de masquage deja rendu par la
 * vue materialisee (colonnes masque, effectif_echantillon). Ne recalcule jamais
 * un seuil — document 4, section 1 et document 3, section 12.
 */
export type ValeurAffichable<T> =
  | { type: "donnee"; valeur: T }
  | { type: "vide"; libelle?: string }
  | { type: "masque" };

/** Regle M0 : un volume brut s'affiche toujours, y compris a zero. */
export function appliquerM0<T>(
  valeur: T | null | undefined,
  libelleVide?: string
): ValeurAffichable<T> {
  if (valeur === null || valeur === undefined) return { type: "vide", libelle: libelleVide };
  return { type: "donnee", valeur };
}

/**
 * Regle M1 : un agregat de performance n'est affiche que si la vue ne l'a pas
 * marque comme masque (echantillon insuffisant ou etablissement preponderant).
 */
export function appliquerM1<T>(
  valeur: T | null | undefined,
  masque: boolean,
  libelleVide?: string
): ValeurAffichable<T> {
  if (masque) return { type: "masque" };
  if (valeur === null || valeur === undefined) return { type: "vide", libelle: libelleVide };
  return { type: "donnee", valeur };
}

export type RatioAffichable =
  | { etat: "vide" }
  | { etat: "effectifs"; numerateur: number; denominateur: number }
  | { etat: "pourcentage"; valeur: number };

/**
 * Regle M2 : en dessous de 10 observations, un ratio s'affiche en effectifs
 * ("2 sur 3"), jamais en pourcentage.
 */
export function appliquerM2(
  numerateur: number | null | undefined,
  denominateur: number | null | undefined
): RatioAffichable {
  if (numerateur === null || numerateur === undefined || !denominateur) {
    return { etat: "vide" };
  }
  if (denominateur < 10) {
    return { etat: "effectifs", numerateur, denominateur };
  }
  return { etat: "pourcentage", valeur: (numerateur / denominateur) * 100 };
}
