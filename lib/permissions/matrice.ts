/**
 * Document 6, section 3. Matrice profils et modules.
 * Source de verite unique pour ce que chaque profil peut activer.
 * Toute modification passe par ce document, pas par un ajustement local.
 */
export const MATRICE_PROFIL_MODULE: Record<string, string[]> = {
  ATTRACTIVITE: [
    "M1_OFFRE",
    "M2_DEMANDE",
    "M3_ACTIVITE",
    "M4_TENSION",
    "M6_MATURITE",
    "M7_EVENEMENTIEL",
    "M8_RETOMBEES",
    "M9_SYNTHESE",
    "M10_METHODO",
  ],
  INVESTISSEMENT: [
    "M1_OFFRE",
    "M2_DEMANDE",
    "M4_TENSION",
    "M6_MATURITE",
    "M8_RETOMBEES",
    "M9_SYNTHESE",
    "M10_METHODO",
  ],
  TUTELLE: [
    "M1_OFFRE",
    "M2_DEMANDE",
    "M3_ACTIVITE",
    "M4_TENSION",
    "M5_CONFORMITE",
    "M6_MATURITE",
    "M8_RETOMBEES",
    "M9_SYNTHESE",
    "M10_METHODO",
  ],
  BAILLEUR: [
    "M1_OFFRE",
    "M2_DEMANDE",
    "M4_TENSION",
    "M6_MATURITE",
    "M8_RETOMBEES",
    "M9_SYNTHESE",
    "M10_METHODO",
  ],
  EVENEMENTIEL: ["M1_OFFRE", "M4_TENSION", "M7_EVENEMENTIEL", "M9_SYNTHESE", "M10_METHODO"],
  ADMIN: [
    "M1_OFFRE",
    "M2_DEMANDE",
    "M3_ACTIVITE",
    "M4_TENSION",
    "M5_CONFORMITE",
    "M6_MATURITE",
    "M7_EVENEMENTIEL",
    "M8_RETOMBEES",
    "M9_SYNTHESE",
    "M10_METHODO",
    "M11_ADMIN",
  ],
};

export function modulesAutorises(profil: string): string[] {
  return MATRICE_PROFIL_MODULE[profil] ?? [];
}

export function moduleAutorisePourProfil(profil: string, codeModule: string): boolean {
  return modulesAutorises(profil).includes(codeModule);
}
