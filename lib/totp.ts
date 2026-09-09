import { createHmac } from "crypto";

/*
 * Implementation TOTP (RFC 6238) sans dependance externe, reservee a l'usage
 * de developpement (voir lib/actions/dev-mfa.ts). Le decodage base32 suit
 * RFC 4648 section 6.
 */
const ALPHABET_BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function decoderBase32(secret: string): Buffer {
  const nettoye = secret.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const caractere of nettoye) {
    const valeur = ALPHABET_BASE32.indexOf(caractere);
    if (valeur === -1) continue;
    bits += valeur.toString(2).padStart(5, "0");
  }
  const octets: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    octets.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(octets);
}

export function genererCodeTotp(secretBase32: string, dateReference = new Date()): string {
  const cle = decoderBase32(secretBase32);
  const compteur = Math.floor(dateReference.getTime() / 1000 / 30);

  const bufferCompteur = Buffer.alloc(8);
  bufferCompteur.writeBigUInt64BE(BigInt(compteur));

  const hmac = createHmac("sha1", cle).update(bufferCompteur).digest();
  const decalage = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[decalage] & 0x7f) << 24) |
    ((hmac[decalage + 1] & 0xff) << 16) |
    ((hmac[decalage + 2] & 0xff) << 8) |
    (hmac[decalage + 3] & 0xff);

  return String(code % 1_000_000).padStart(6, "0");
}
