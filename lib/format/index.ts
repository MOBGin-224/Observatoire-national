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
