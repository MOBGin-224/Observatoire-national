import { CONSERVATION } from "@/lib/config";
import { clientTache, journaliserTache, refusAcces, secretValide } from "@/lib/taches";

/**
 * Document 13, section 8 : purge des enregistrements de recherche a 24 mois et
 * du journal d'acces a 36 mois. Les deux purges partagent une seule route
 * mensuelle, le planificateur limitant le nombre de taches par projet.
 *
 * La purge est irreversible et tracee. Elle ne touche que ce que le document
 * nomme : une reservation est une transaction, pas un enregistrement de
 * recherche, elle est conservee et voit seulement son lien coupe.
 */
export async function GET(requete: Request) {
  if (!secretValide(requete)) return refusAcces();

  const client = clientTache();

  const { data: recherchesPurgees, error: erreurRecherches } = await client.rpc(
    "purger_recherches",
    { p_mois: CONSERVATION.rechercheMois }
  );
  if (erreurRecherches) {
    await journaliserTache("tache_purge_mensuelle", { echec: erreurRecherches.message });
    return Response.json({ succes: false, motif: erreurRecherches.message }, { status: 500 });
  }

  const { data: journalPurge, error: erreurJournal } = await client.rpc("purger_journal_acces", {
    p_mois: CONSERVATION.journalAccesMois,
  });
  if (erreurJournal) {
    await journaliserTache("tache_purge_mensuelle", {
      recherchesPurgees,
      echec: erreurJournal.message,
    });
    return Response.json({ succes: false, motif: erreurJournal.message }, { status: 500 });
  }

  /*
   * La trace est ecrite apres la purge du journal, sinon elle serait elle-meme
   * susceptible d'etre effacee par l'execution qu'elle documente.
   */
  await journaliserTache("tache_purge_mensuelle", {
    recherchesPurgees,
    journalPurge,
    retentionRechercheMois: CONSERVATION.rechercheMois,
    retentionJournalMois: CONSERVATION.journalAccesMois,
  });

  return Response.json({ succes: true, recherchesPurgees, journalPurge });
}
