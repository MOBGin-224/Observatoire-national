import { createClient } from "@/lib/supabase/server";

/*
 * Document 9 ter, partie J : ecran M7_EVENEMENTIEL.
 *
 * Ce module raisonne en fenetre et non en periode (J.3). La fenetre etant
 * choisie a l'ecran, ses agregats ne peuvent pas etre pre-calcules : ils
 * viennent de deux fonctions en base qui appliquent elles-memes les controles
 * des vues d'acces (compte valide, module actif, territoire visible) et ne
 * renvoient que des agregats, jamais une ligne d'etablissement.
 */

export type EvenementFutur = {
  /* Source et identifiant, "DEMANDE:<uuid>" ou "CALENDRIER:<uuid>" : les deux
     tables ont chacune leurs identifiants. */
  cle: string;
  source: "DEMANDE" | "CALENDRIER";
  libelle: string | null;
  codeTerritoire: string | null;
  dateDebut: string;
  dateFin: string | null;
};

export type TerritoireFenetre = {
  code: string;
  libelle: string;
  etablissements: number;
  masque: boolean;
  mobilisable: number | null;
};

export type DemandeFenetre = {
  id: string;
  libelle: string | null;
  type: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  demandees: number | null;
  couvertes: number | null;
  statut: string | null;
};

export type FenetreEvenementielle = {
  etablissements: number;
  capaciteRecensee: number;
  /* Regle M1 sur la part partenaires : vendu et disponible non publies. */
  masquePartenaires: boolean;
  partenairesDisponibles: number | null;
  recensesNonReservables: number;
  dejaVendu: number | null;
  capaciteMobilisable: number | null;
  etablissementsSalles: number;
  placesSalles: number;
  demandes: number;
  unitesDemandees: number;
  unitesCouvertes: number;
  tauxTension: number | null;
  deficit: number | null;
  tauxCouverture: number | null;
  fiabiliteCapacite: string | null;
  fiabiliteSalles: string | null;
  fiabiliteTension: string | null;
  gammes: { code: string; capacite: number; etablissements: number }[];
  paliers: { palier: string; etablissements: number; places: number }[];
  territoires: TerritoireFenetre[];
  listeDemandes: DemandeFenetre[];
  calculeA: string;
};

function nombre(valeur: unknown): number | null {
  if (valeur === null || valeur === undefined) return null;
  return typeof valeur === "number" ? valeur : Number(valeur);
}

function texte(valeur: unknown): string | null {
  return typeof valeur === "string" ? valeur : null;
}

export async function chargerEvenementsFuturs(): Promise<EvenementFutur[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("evenementiel_evenements");

  if (error || !Array.isArray(data)) return [];

  return (data as Record<string, unknown>[]).map((ligne) => ({
    cle: `${ligne.source}:${ligne.id}`,
    source: ligne.source as "DEMANDE" | "CALENDRIER",
    libelle: texte(ligne.libelle),
    codeTerritoire: texte(ligne.code_territoire),
    dateDebut: ligne.date_debut as string,
    dateFin: texte(ligne.date_fin),
  }));
}

export async function chargerFenetre(parametres: {
  debut: string;
  fin: string;
  territoire: string | null;
  gammes: string[];
  salleMin: number | null;
}): Promise<FenetreEvenementielle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("evenementiel_fenetre", {
    p_debut: parametres.debut,
    p_fin: parametres.fin,
    p_territoire: parametres.territoire,
    p_gammes: parametres.gammes.length > 0 ? parametres.gammes : null,
    p_capacite_salle_min: parametres.salleMin,
  });

  if (error || !data || typeof data !== "object") return null;
  const f = data as Record<string, unknown>;

  const tableau = (valeur: unknown) => (Array.isArray(valeur) ? (valeur as Record<string, unknown>[]) : []);

  return {
    etablissements: nombre(f.etablissements) ?? 0,
    capaciteRecensee: nombre(f.capacite_recensee) ?? 0,
    masquePartenaires: f.masque_partenaires === true,
    partenairesDisponibles: nombre(f.partenaires_disponibles),
    recensesNonReservables: nombre(f.recenses_non_reservables) ?? 0,
    dejaVendu: nombre(f.deja_vendu),
    capaciteMobilisable: nombre(f.capacite_mobilisable),
    etablissementsSalles: nombre(f.etablissements_salles) ?? 0,
    placesSalles: nombre(f.places_salles) ?? 0,
    demandes: nombre(f.demandes) ?? 0,
    unitesDemandees: nombre(f.unites_demandees) ?? 0,
    unitesCouvertes: nombre(f.unites_couvertes) ?? 0,
    tauxTension: nombre(f.taux_tension),
    deficit: nombre(f.deficit),
    tauxCouverture: nombre(f.taux_couverture),
    fiabiliteCapacite: texte(f.fiabilite_capacite),
    fiabiliteSalles: texte(f.fiabilite_salles),
    fiabiliteTension: texte(f.fiabilite_tension),
    gammes: tableau(f.gammes).map((g) => ({
      code: g.code as string,
      capacite: nombre(g.capacite) ?? 0,
      etablissements: nombre(g.etablissements) ?? 0,
    })),
    paliers: tableau(f.paliers).map((p) => ({
      palier: p.palier as string,
      etablissements: nombre(p.etablissements) ?? 0,
      places: nombre(p.places) ?? 0,
    })),
    territoires: tableau(f.territoires).map((c) => ({
      code: c.code as string,
      libelle: c.libelle as string,
      etablissements: nombre(c.etablissements) ?? 0,
      masque: c.masque === true,
      mobilisable: nombre(c.mobilisable),
    })),
    listeDemandes: tableau(f.liste_demandes).map((d) => ({
      id: d.id as string,
      libelle: texte(d.libelle),
      type: texte(d.type),
      dateDebut: texte(d.date_debut),
      dateFin: texte(d.date_fin),
      demandees: nombre(d.demandees),
      couvertes: nombre(d.couvertes),
      statut: texte(d.statut),
    })),
    calculeA: (f.calcule_a as string) ?? new Date().toISOString(),
  };
}
