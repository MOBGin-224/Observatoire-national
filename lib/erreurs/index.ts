/**
 * Appel d'une fonction serveur depuis un composant client.
 *
 * Sans enveloppe, une fonction serveur qui echoue produit un rejet non gere :
 * en developpement, un bandeau rouge illisible ("An unexpected response was
 * received from the server") ; en production, un bouton qui ne repond plus,
 * sans un mot pour l'utilisateur. Les deux sont inacceptables dans un outil
 * consulte en reunion.
 *
 * Deux causes possibles, indiscernables cote client car la plateforme renvoie
 * le meme message :
 *  - la session a expire et le proxy a repondu 401 (document 13, section 2) ;
 *  - l'action elle-meme a echoue.
 *
 * L'appelant affiche donc un message d'echec et rafraichit la route. Si la
 * session est reellement fermee, ce rafraichissement est une navigation, que
 * le proxy redirige vers l'ecran de connexion : l'utilisateur atterrit au bon
 * endroit sans qu'on ait eu a deviner la cause.
 */
export type Issue<T> = { ok: true; valeur: T } | { ok: false; cle: string };

export const CLE_ECHEC_ACTION = "state.erreur.action_echouee";

export async function executerAction<T>(action: () => Promise<T>): Promise<Issue<T>> {
  try {
    return { ok: true, valeur: await action() };
  } catch {
    return { ok: false, cle: CLE_ECHEC_ACTION };
  }
}
