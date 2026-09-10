import { NOTIFICATION_EXPIRATION } from "@/lib/config";
import { clientTache, journaliserTache, refusAcces, secretValide } from "@/lib/taches";
import { envoyerNotificationExpiration, transportCourrielConfigure } from "@/lib/taches/courriel";

/**
 * Document 13, section 3 : notification d'approche d'expiration a 30 et 7 jours,
 * au titulaire et a l'administration interne. Cadence quotidienne.
 *
 * La notification ne prolonge rien : seule l'administration peut deplacer une
 * date d'expiration. Le releve est idempotent, l'unicite en base garantit
 * qu'une echeance deja notifiee ne l'est pas deux fois, meme si la tache est
 * rejouee dans la journee.
 */
export async function GET(requete: Request) {
  if (!secretValide(requete)) return refusAcces();

  const client = clientTache();

  const { data: aNotifier, error } = await client.rpc("relever_expirations_a_notifier", {
    p_echeances: NOTIFICATION_EXPIRATION.echeancesJours,
  });

  if (error) {
    await journaliserTache("tache_notification_expiration", { echec: error.message });
    return Response.json({ succes: false, motif: error.message }, { status: 500 });
  }

  const echeances = aNotifier ?? [];

  /*
   * Sans transport de courriel configure, les echeances restent en EN_ATTENTE :
   * elles sont relevees et visibles dans le tableau de suivi de M11_ADMIN, mais
   * rien n'est envoye. Marquer ENVOYE sans envoi rendrait le suivi mensonger.
   */
  if (!transportCourrielConfigure()) {
    await journaliserTache("tache_notification_expiration", {
      relevees: echeances.length,
      envoyees: 0,
      motif: "transport de courriel non configure",
    });
    return Response.json({
      succes: true,
      relevees: echeances.length,
      envoyees: 0,
      enAttente: echeances.length,
    });
  }

  let envoyees = 0;
  let echecs = 0;

  for (const echeance of echeances) {
    const envoye = await envoyerNotificationExpiration(echeance);
    if (envoye) envoyees += 1;
    else echecs += 1;

    await client
      .from("notification_expiration")
      .update({ statut: envoye ? "ENVOYE" : "ECHEC" })
      .eq("id", echeance.id_notification);
  }

  await journaliserTache("tache_notification_expiration", {
    relevees: echeances.length,
    envoyees,
    echecs,
  });

  return Response.json({ succes: true, relevees: echeances.length, envoyees, echecs });
}
