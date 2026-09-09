"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, cleServiceRolePresente } from "@/lib/supabase/admin";
import { chargerMonCompte } from "@/lib/queries/compte";
import { moduleAutorisePourProfil } from "@/lib/permissions/matrice";

/**
 * Document 9bis H.4.7 + H.5 : toute action ecrit une ligne au journal, aucune
 * suppression definitive nulle part, un compte est toujours nominatif et expire.
 *
 * Chaque action verifie explicitement estAppelantAdmin() avant d'agir. Ce n'est
 * pas redondant avec RLS : les actions qui passent par createAdminClient()
 * (creerCompte, renvoyerInvitation) utilisent la cle service role, qui
 * contourne RLS entierement. Sans ce controle applicatif, n'importe quel
 * compte authentifie pourrait inviter des comptes ou renvoyer des invitations
 * en appelant directement la server action.
 */

type ResultatAction = { succes: true } | { succes: false; erreurCle: string };

class ActionNonAutorisee extends Error {}

async function exigerAdmin(): Promise<void> {
  const compte = await chargerMonCompte();
  if (compte?.profil !== "ADMIN") {
    throw new ActionNonAutorisee("Action reservee au profil ADMIN.");
  }
}

async function journaliser(action: string, filtres: Record<string, unknown>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("journal_acces")
    .insert({ id_compte: user.id, module: "M11_ADMIN", action, filtres });
}

export async function creerInstitution(formData: FormData): Promise<ResultatAction> {
  await exigerAdmin();

  const denomination = String(formData.get("denomination") ?? "").trim();
  if (!denomination) return { succes: false, erreurCle: "admin.erreur.expiration_obligatoire" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("institution")
    .insert({
      denomination,
      type: String(formData.get("type") ?? "").trim() || null,
      convention_reference: String(formData.get("conventionReference") ?? "").trim() || null,
      convention_debut: String(formData.get("conventionDebut") ?? "").trim() || null,
      convention_fin: String(formData.get("conventionFin") ?? "").trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) return { succes: false, erreurCle: "admin.erreur.email_deja_utilise" };

  await journaliser("creer_institution", { idInstitution: data.id, denomination });
  revalidatePath("/administration/institutions");
  return { succes: true };
}

export async function creerCompte(
  idInstitution: string,
  formData: FormData
): Promise<ResultatAction> {
  await exigerAdmin();

  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const profil = String(formData.get("profil") ?? "").trim();
  const dateExpiration = String(formData.get("dateExpiration") ?? "").trim();
  const modulesDemandes = formData.getAll("modules").map(String);

  // Document 6, section 1.4 : compte nominatif obligatoire, jamais generique.
  if (!nom || !prenom || !email) {
    return { succes: false, erreurCle: "admin.erreur.nom_generique" };
  }
  // Document 6, section 1.5 : date_expiration obligatoire.
  if (!dateExpiration) {
    return { succes: false, erreurCle: "admin.erreur.expiration_obligatoire" };
  }
  // Document 6, section 3 : un module hors matrice ne peut jamais etre attribue.
  const modulesInvalides = modulesDemandes.filter((m) => !moduleAutorisePourProfil(profil, m));
  if (modulesInvalides.length > 0) {
    return { succes: false, erreurCle: "admin.erreur.module_non_autorise" };
  }

  // L'invitation passe par la cle service role. Si elle manque, le formulaire
  // affiche une erreur de configuration au lieu de casser l'ecran.
  if (!cleServiceRolePresente()) {
    return { succes: false, erreurCle: "admin.erreur.cle_service_role" };
  }

  const admin = createAdminClient();
  const { data: invitation, error: erreurInvitation } = await admin.auth.admin.inviteUserByEmail(
    email,
    { data: { nom, prenom } }
  );

  if (erreurInvitation || !invitation.user) {
    return { succes: false, erreurCle: "admin.erreur.email_deja_utilise" };
  }

  const supabase = await createClient();
  const { error: erreurCompte } = await supabase.from("compte_institutionnel").insert({
    id: invitation.user.id,
    id_institution: idInstitution,
    nom,
    prenom,
    fonction: String(formData.get("fonction") ?? "").trim() || null,
    email,
    profil,
    code_territoire_perimetre: String(formData.get("perimetre") ?? "").trim() || null,
    granularite_max: String(formData.get("granulariteMax") ?? "COMMUNE").trim(),
    langue: String(formData.get("langue") ?? "FR").trim(),
    date_expiration: dateExpiration,
    statut: "ACTIF",
  });

  if (erreurCompte) {
    // Compte auth cree mais ligne applicative refusee (RLS ou contrainte) :
    // on ne laisse pas un utilisateur invite sans fiche compte associee.
    await admin.auth.admin.deleteUser(invitation.user.id);
    return { succes: false, erreurCle: "admin.erreur.email_deja_utilise" };
  }

  if (modulesDemandes.length > 0) {
    const { error: erreurModules } = await supabase.from("compte_module").insert(
      modulesDemandes.map((codeModule) => ({
        id_compte: invitation.user!.id,
        code_module: codeModule,
        actif: true,
      }))
    );
    if (erreurModules) {
      return { succes: false, erreurCle: "admin.erreur.module_non_autorise" };
    }
  }

  await journaliser("inviter_compte", { idInstitution, email, profil });
  revalidatePath(`/administration/institutions/${idInstitution}`);
  return { succes: true };
}

export async function suspendreCompte(idCompte: string, idInstitution: string) {
  await exigerAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("compte_institutionnel")
    .update({ statut: "SUSPENDU" })
    .eq("id", idCompte);
  if (error) throw error;

  await journaliser("suspendre_compte", { idCompte });
  revalidatePath(`/administration/institutions/${idInstitution}`);
}

export async function reactiverCompte(idCompte: string, idInstitution: string) {
  await exigerAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("compte_institutionnel")
    .update({ statut: "ACTIF" })
    .eq("id", idCompte);
  if (error) throw error;

  await journaliser("reactiver_compte", { idCompte });
  revalidatePath(`/administration/institutions/${idInstitution}`);
}

export async function prolongerExpiration(
  idCompte: string,
  idInstitution: string,
  nouvelleDate: string
) {
  await exigerAdmin();
  if (!nouvelleDate) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("compte_institutionnel")
    .update({ date_expiration: nouvelleDate })
    .eq("id", idCompte);
  if (error) throw error;

  await journaliser("prolonger_expiration", { idCompte, nouvelleDate });
  revalidatePath(`/administration/institutions/${idInstitution}`);
}

export async function renvoyerInvitation(email: string) {
  await exigerAdmin();

  // L'email doit correspondre a un compte deja existant : cette action ne
  // doit jamais servir a envoyer une invitation a une adresse arbitraire.
  const supabase = await createClient();
  const { data: compte } = await supabase
    .from("compte_institutionnel")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!compte) {
    throw new Error("Aucun compte associe a cette adresse.");
  }

  // Cette action ne rend pas de resultat a l'appelant (bouton en transition) :
  // faute de surface d'affichage, une cle absente reste une exception, mais
  // avec un message qui nomme la cause.
  if (!cleServiceRolePresente()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY absente de l'environnement. Voir .env.local.");
  }

  const admin = createAdminClient();
  await admin.auth.admin.inviteUserByEmail(email);
  await journaliser("renvoyer_invitation", { email });
}

// Verifie qui appelle, pour les pages/route handlers qui ont besoin d'un
// controle explicite au-dela de la garde du layout (defense en profondeur).
export async function estAppelantAdmin(): Promise<boolean> {
  const compte = await chargerMonCompte();
  return compte?.profil === "ADMIN";
}
