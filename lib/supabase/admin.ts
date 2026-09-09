import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client service role, serveur uniquement. Jamais importe depuis un composant
 * "use client" ni depuis un fichier sans "use server" : la cle service role
 * contourne RLS entierement.
 *
 * Seul usage prevu : auth.admin.inviteUserByEmail (creation de compte par
 * invitation, document 9bis H.4.7), qui n'a pas d'equivalent cote client Supabase.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cleServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !cleServiceRole) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY absente de l'environnement. Voir .env.local."
    );
  }

  return createSupabaseClient(url, cleServiceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
