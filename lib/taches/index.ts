import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Document 14, section 5.1. Socle commun des tâches planifiées.
 *
 * Ces routes ne sont jamais atteignables depuis une session utilisateur : elles
 * s'authentifient par un secret partage avec le planificateur, et n'utilisent
 * que le client service role. C'est la seule voie d'appel prevue.
 */

/**
 * Vercel Cron presente le secret dans l'en-tete Authorization. Comparaison en
 * temps constant pour ne pas fuiter le secret caractere par caractere.
 */
export function secretValide(requete: Request): boolean {
  const attendu = process.env.CRON_SECRET;
  if (!attendu) return false;

  const recu = requete.headers.get("authorization");
  if (!recu) return false;

  const complet = `Bearer ${attendu}`;
  if (recu.length !== complet.length) return false;

  let ecart = 0;
  for (let i = 0; i < complet.length; i += 1) {
    ecart |= recu.charCodeAt(i) ^ complet.charCodeAt(i);
  }
  return ecart === 0;
}

export function refusAcces(): Response {
  // Pas de detail : une reponse qui explique pourquoi elle refuse aide l'appelant.
  return new Response("Non autorise", { status: 401 });
}

/**
 * Client service role. Les fonctions de tache ne sont executables que par ce
 * role, les droits ont ete retires a authenticated et anon.
 */
export function clientTache() {
  return createAdminClient().schema("observatoire");
}

/**
 * Chaque execution laisse une trace. `id_compte` est nul : la tache n'agit pour
 * le compte de personne, ce qui la distingue d'une action d'operateur.
 */
export async function journaliserTache(
  action: string,
  details: Record<string, unknown>
): Promise<void> {
  await clientTache()
    .from("journal_acces")
    .insert({ id_compte: null, module: "M11_ADMIN", action, filtres: details });
}
