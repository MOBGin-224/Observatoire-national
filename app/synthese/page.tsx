import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/*
 * Ecran d'atterrissage M9_SYNTHESE apres connexion (document 11, section 1).
 * Provisoire : le chrome, la navigation et le bandeau de perimetre (rang 4 de
 * l'ordre de developpement, document 11 section 15) restent a construire.
 */
export default async function Synthese() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <p style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)" }}>
        M9_SYNTHESE — module en construction.
      </p>
    </main>
  );
}
