/**
 * Document 8, section 3 : separateur de milliers = espace insecable,
 * separateur decimal = virgule. Fuseau Africa/Conakry (document 4, section 1).
 */
export function formatNombre(valeur: number, decimales = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valeur);
}

export function formatPourcentage(valeur: number, decimales = 1): string {
  return `${formatNombre(valeur, decimales)} %`;
}

/* Coefficient multiplicateur : jusqu'a trois decimales, sans zeros de remplissage. */
export function formatCoefficient(valeur: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(valeur);
}

/* Document 10, section 2 : date courte, 07/09/2026, fuseau Africa/Conakry. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Conakry",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateHeure(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Conakry",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * Libelle court d'un mois a partir d'une cle "AAAA-MM", pour les axes de courbe.
 * Forme abregee : sur douze pas d'abscisse, un mois ecrit en toutes lettres se
 * chevauche avec son voisin.
 */
export function formatMois(cle: string, langue = "fr-FR"): string {
  const [annee, mois] = cle.split("-").map(Number);
  if (!annee || !mois) return cle;
  const libelle = new Intl.DateTimeFormat(langue, { month: "short" }).format(
    new Date(Date.UTC(annee, mois - 1, 1))
  );
  return `${libelle.replace(/\.$/, "")} ${String(annee).slice(-2)}`;
}

/**
 * Montant en francs guineens. Au-dela du million, l'echelle courte rend un axe
 * lisible la ou huit chiffres alignes ne le sont pas.
 */
export function formatMontantCourt(valeur: number): string {
  if (Math.abs(valeur) >= 1_000_000) return `${formatNombre(valeur / 1_000_000, 1)} M`;
  if (Math.abs(valeur) >= 1_000) return `${formatNombre(valeur / 1_000, 0)} k`;
  return formatNombre(valeur);
}

/**
 * Nom d'un pays a partir de son code ISO 3166-1 alpha-2.
 *
 * Les codes pays ne sont pas une enumeration du document 2 : ce sont des codes
 * normalises internationaux. On passe donc par les donnees de localisation
 * d'Intl, comme pour les nombres et les dates, plutot que de recopier une liste
 * de deux cents libelles dans le catalogue. Le code brut reste le repli.
 */
export function nomPays(code: string, langue = "fr-FR"): string {
  try {
    return new Intl.DisplayNames([langue], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
