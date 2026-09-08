import type { ValeurAffichable } from "@/lib/masking";

/**
 * Document 9, A.4 : les cinq etats, rappel operationnel. "donnee", "vide" et
 * "masque" viennent de lib/masking (couche de donnees) ; "chargement" et
 * "erreur" sont propres a la couche d'affichage.
 */
export type EtatBloc<T> = ValeurAffichable<T> | { type: "chargement" } | { type: "erreur" };
