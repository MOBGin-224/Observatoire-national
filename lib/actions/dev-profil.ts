"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MATRICE_PROFIL_MODULE, modulesAutorises } from "@/lib/permissions/matrice";
import { listerEnumeration, type ValeurEnumeration } from "@/lib/enumerations";

/*
 * Aide de developpement uniquement : bascule le profil du compte de test, pour
 * visiter l'outil du point de vue de chacun des six profils du document 6 sans
 * creer six comptes ni enroler six seconds facteurs.
 *
 * Trois verrous, tous obligatoires :
 *  - NODE_ENV vaut "development", donc rien de tout ceci n'existe dans une
 *    build de production ;
 *  - une session valide est requise ;
 *  - l'adresse de cette session doit etre exactement DEV_COMPTE_TEST_EMAIL
 *    (.env.local, jamais commite). Aucun autre compte n'est modifiable, meme
 *    en developpement.
 *
 * Ne contourne aucun controle d'acces. La bascule ecrit reellement le profil et
 * les modules actifs en base, puis la securite de la base filtre comme pour
 * n'importe quel compte : c'est bien le vrai chemin d'acces qui est observe,
 * pas une simulation cote interface.
 */

export type ResultatBascule = { succes: boolean; motif?: string };

const PROFILS_CONNUS = Object.keys(MATRICE_PROFIL_MODULE);

function developpement(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function basculerProfilDev(profil: string): Promise<ResultatBascule> {
  if (!developpement()) return { succes: false, motif: "hors_developpement" };

  const emailAutorise = process.env.DEV_COMPTE_TEST_EMAIL;
  if (!emailAutorise) return { succes: false, motif: "compte_de_test_non_configure" };

  if (!PROFILS_CONNUS.includes(profil)) return { succes: false, motif: "profil_inconnu" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== emailAutorise.toLowerCase()) {
    return { succes: false, motif: "compte_non_autorise" };
  }

  // createAdminClient leve si la cle service role manque de l'environnement.
  // Une aide de developpement ne doit jamais casser l'ecran qui la porte : on
  // renvoie un echec lisible plutot que de laisser l'exception remonter.
  let admin;
  try {
    admin = createAdminClient().schema("observatoire");
  } catch {
    return { succes: false, motif: "cle_service_role_absente" };
  }

  const { error: erreurProfil } = await admin
    .from("compte_institutionnel")
    .update({ profil })
    .eq("id", user.id);

  if (erreurProfil) return { succes: false, motif: erreurProfil.message };

  // La matrice du document 6 dit ce que le profil autorise ; compte_module dit
  // ce qui est reellement actif. Document 6, section 6 : un module est visible
  // si et seulement si les deux concordent. On reecrit donc la seconde a partir
  // de la premiere a chaque bascule.
  const { error: erreurPurge } = await admin
    .from("compte_module")
    .delete()
    .eq("id_compte", user.id);

  if (erreurPurge) return { succes: false, motif: erreurPurge.message };

  const lignes = modulesAutorises(profil).map((codeModule) => ({
    id_compte: user.id,
    code_module: codeModule,
    // Document 9 quater, section M.3 : M8_RETOMBEES reste eteint tant que le
    // coefficient multiplicateur n'est pas arrete, source et publie. Une bascule
    // de profil ne doit pas servir de porte derobee pour l'allumer.
    actif: codeModule !== "M8_RETOMBEES",
  }));

  const { error: erreurModules } = await admin.from("compte_module").insert(lignes);
  if (erreurModules) return { succes: false, motif: erreurModules.message };

  revalidatePath("/", "layout");
  return { succes: true };
}

/**
 * Liste des profils proposes par le selecteur. Les libelles viennent de la table
 * enumeration (document 11, section 8), mais le selecteur retombe sur les codes
 * de la matrice si cette lecture echoue : sans ce repli, un profil sans droit de
 * lecture sur enumeration afficherait une liste vide, et il deviendrait
 * impossible de revenir a ADMIN sans passer par la base.
 */
export async function listerProfilsDev(): Promise<ValeurEnumeration[]> {
  if (!developpement() || !process.env.DEV_COMPTE_TEST_EMAIL) return [];

  const valeurs = await listerEnumeration("PROFIL");
  const connus = valeurs.filter((valeur) => PROFILS_CONNUS.includes(valeur.code));

  if (connus.length === PROFILS_CONNUS.length) return connus;

  return PROFILS_CONNUS.map((code) => {
    const trouve = connus.find((valeur) => valeur.code === code);
    return trouve ?? { code, libelleFr: code, libelleEn: code };
  });
}
