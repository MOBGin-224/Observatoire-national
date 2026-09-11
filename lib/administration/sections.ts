/*
 * Sections de M11_ADMIN reellement ouvertes dans l'outil (document 9 bis, H.4,
 * qui en prevoit neuf). Source unique : l'ecran d'atterrissage les affiche, la
 * carte d'acces de la synthese les compte (document 16, section B.3).
 *
 * Une section s'ajoute ici le jour ou son ecran existe, jamais avant : le
 * compteur annoncerait sinon un ecran absent.
 */
export const SECTIONS_ADMINISTRATION = [
  {
    href: "/administration/institutions",
    titre: "admin.carte_institutions.titre",
    description: "admin.carte_institutions.description",
  },
  {
    href: "/administration/recensement",
    titre: "admin.carte_import.titre",
    description: "admin.carte_import.description",
  },
] as const;
