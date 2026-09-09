"use server";

import { genererCodeTotp } from "@/lib/totp";

/*
 * Aide de developpement uniquement : calcule le code TOTP courant du compte
 * de test a partir de sa cle secrete, pour eviter de ressaisir un code a la
 * main a chaque cycle de test. N'existe dans aucune build de production :
 * garde explicitement par NODE_ENV, et la cle ne vit que dans .env.local
 * (jamais commite, voir .gitignore). Ne contourne jamais la verification
 * reelle : le code retourne doit encore passer par
 * supabase.auth.mfa.challengeAndVerify comme n'importe quel code saisi a la
 * main.
 */
export async function obtenirCodeTotpDev(): Promise<string | null> {
  if (process.env.NODE_ENV !== "development") return null;

  const secret = process.env.DEV_TOTP_SECRET_TEST;
  if (!secret) return null;

  return genererCodeTotp(secret);
}
