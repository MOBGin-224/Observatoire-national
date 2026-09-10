import { clientTache, journaliserTache, refusAcces, secretValide } from "@/lib/taches";

/**
 * Document 3, section 12 : les vues materialisees sont rafraichies par tache
 * planifiee, l'application ne recalcule jamais un agregat ni un seuil de
 * masquage. Cadence quotidienne, la nuit, voir vercel.json.
 */
export async function GET(requete: Request) {
  if (!secretValide(requete)) return refusAcces();

  const { data, error } = await clientTache().rpc("rafraichir_agregats");

  if (error) {
    await journaliserTache("tache_rafraichir_agregats", { echec: error.message });
    return Response.json({ succes: false, motif: error.message }, { status: 500 });
  }

  await journaliserTache("tache_rafraichir_agregats", { vuesRafraichies: data });
  return Response.json({ succes: true, vuesRafraichies: data });
}
