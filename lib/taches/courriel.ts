/**
 * Document 14, section 5.2 : le courriel passe par le SMTP deja configure dans
 * Supabase, sans prestataire supplementaire.
 *
 * POINT OUVERT. Le SMTP de Supabase n'est joignable que par les gabarits de
 * Supabase Auth (invitation, reinitialisation de mot de passe). Il n'expose
 * aucune interface d'envoi libre. La notification d'expiration n'est pas un
 * courriel d'authentification : elle ne peut donc pas emprunter cette voie
 * telle quelle.
 *
 * Deux issues, toutes deux conformes a l'intention du document 14, qui est de
 * n'ajouter ni prestataire ni secret supplementaire :
 *
 *   1. Reutiliser les memes identifiants SMTP depuis une bibliotheque d'envoi.
 *      Meme serveur, memes secrets, une dependance de plus.
 *   2. Passer par une fonction edge Supabase qui porte l'envoi.
 *
 * Tant que l'arbitrage n'est pas rendu, transportCourrielConfigure() renvoie
 * faux : les echeances sont relevees et conservees en EN_ATTENTE, visibles dans
 * le tableau de suivi de M11_ADMIN. Rien n'est perdu, rien n'est faussement
 * marque comme envoye.
 *
 * Le corps du message reste a ecrire au document 10 avant tout envoi : aucun
 * libelle ne s'invente ici.
 */

export type EcheanceANotifier = {
  id_notification: string;
  id_compte: string;
  email: string;
  nom: string;
  prenom: string;
  langue: string;
  date_expiration: string;
  echeance_jours: number;
};

export function transportCourrielConfigure(): boolean {
  return false;
}

export async function envoyerNotificationExpiration(
  _echeance: EcheanceANotifier
): Promise<boolean> {
  throw new Error(
    "Transport de courriel non arbitre. Voir lib/taches/courriel.ts et document 14, section 5.2."
  );
}
