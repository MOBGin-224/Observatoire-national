import { createClient } from "@/lib/supabase/server";

/**
 * Document 9 bis, partie F. La synthèse **ne produit aucun indicateur qui lui
 * soit propre** : elle relit les mêmes vues d'accès que les modules d'origine.
 *
 * C'est la seule façon de tenir le critère F.10.3, qui est bloquant : une
 * valeur affichée ici est strictement identique à celle de son module
 * d'origine, au même périmètre, état de masquage compris. Recalculer quoi que
 * ce soit ici produirait tôt ou tard une divergence entre deux écrans, et
 * cette divergence serait découverte en réunion.
 *
 * Phase 1, niveau national uniquement (document 15, section 4).
 */
export type ValeurBloc = {
  valeur: number | null;
  masque: boolean;
  niveauFiabilite: string | null;
};

export type ValeursSynthese = {
  parCode: Record<string, ValeurBloc>;
  calculeA: string;
};

/* Une entrée par vue d'accès : colonne à lire, et code d'indicateur servi. */
const SOURCES: { vue: string; colonnes: Record<string, string> }[] = [
  {
    vue: "acces_offre_national",
    colonnes: {
      off_etab_recenses: "OFF_ETAB_RECENSES",
      off_capacite_recensee: "OFF_CAPACITE_RECENSEE",
      off_taux_couverture: "OFF_TAUX_COUVERTURE",
      off_taux_numerisation: "OFF_TAUX_NUMERISATION",
      off_taux_reservabilite: "OFF_TAUX_RESERVABILITE",
      off_taux_verification: "OFF_TAUX_VERIFICATION",
      off_completude_fiche: "OFF_COMPLETUDE_FICHE",
    },
  },
  { vue: "acces_maturite_national", colonnes: { mat_indice: "MAT_INDICE" } },
  {
    vue: "acces_demande_national",
    colonnes: {
      dem_volume_recherches: "DEM_VOLUME_RECHERCHES",
      dem_booking_window: "DEM_BOOKING_WINDOW",
    },
  },
  {
    vue: "acces_tension_national",
    colonnes: {
      ten_taux_infructueux: "TEN_TAUX_INFRUCTUEUX",
      ten_capacite_manquante: "TEN_CAPACITE_MANQUANTE",
    },
  },
  {
    vue: "acces_conformite_national",
    colonnes: {
      conf_taux_enregistrement: "CONF_TAUX_ENREGISTREMENT",
      conf_taux_classification: "CONF_TAUX_CLASSIFICATION",
    },
  },
  {
    vue: "acces_evenementiel_national",
    colonnes: {
      eve_capacite_mobilisable: "EVE_CAPACITE_MOBILISABLE",
      eve_capacite_salles: "EVE_CAPACITE_SALLES",
    },
  },
];

/*
 * Trois indicateurs de la fiche F.4 n'ont aujourd'hui aucune source :
 *
 *   INS_DEFICIT                  la table demande_institutionnelle est vide
 *                                tant qu'aucune institution n'a declare de
 *                                besoin. Comportement normal, document 15, 7.1.
 *   TEN_FENETRES_SATURATION      le seuil est arrete (document 15, section 2)
 *                                mais la vue reste a construire.
 *   CTX_RECENSEMENT_PROGRESSION  la table etablissement n'a pas de date de
 *                                creation, seulement updated_at : "fiches
 *                                creees par semaine" n'est pas calculable.
 *
 * Ils s'affichent en etat vide, ce que la fiche prevoit (F.9). Aucun d'eux
 * n'est simule : une valeur inventee serait un manquement a la regle 3 du
 * CLAUDE.md, et elle finirait projetee en reunion.
 */
export async function chargerValeursSynthese(): Promise<ValeursSynthese> {
  const supabase = await createClient();

  const resultats = await Promise.all(
    SOURCES.map((source) =>
      supabase
        .from(source.vue)
        .select("*")
        .maybeSingle()
        .then(({ data, error }) => ({ source, data: error ? null : data }))
    )
  );

  const parCode: Record<string, ValeurBloc> = {};
  let calculeA: string | null = null;

  for (const { source, data } of resultats) {
    if (!data) continue;
    const ligne = data as Record<string, unknown>;

    /* Le verdict de masquage vient de la vue, il n'est jamais recalcule ici. */
    const masque = (ligne.masque as boolean) ?? false;
    const niveauFiabilite = (ligne.niveau_fiabilite as string) ?? null;

    for (const [colonne, code] of Object.entries(source.colonnes)) {
      const brut = ligne[colonne];
      parCode[code] = {
        valeur: typeof brut === "number" ? brut : brut === null ? null : Number(brut),
        masque,
        niveauFiabilite,
      };
    }

    /* La fraicheur affichee est la plus ancienne : c'est celle qui engage. */
    const vueCalculeA = ligne.calcule_a as string | undefined;
    if (vueCalculeA && (calculeA === null || vueCalculeA < calculeA)) calculeA = vueCalculeA;
  }

  return { parCode, calculeA: calculeA ?? new Date().toISOString() };
}
