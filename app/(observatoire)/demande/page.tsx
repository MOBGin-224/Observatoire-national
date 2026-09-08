import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { Repartition } from "@/components/modules/Repartition";
import { t } from "@/lib/i18n";
import { formatPourcentage } from "@/lib/format";
import { chargerDemandeNationale } from "@/lib/queries/demande";

/*
 * Ecran M2_DEMANDE (document 9, partie C). Z2 (carte des destinations) et Z4
 * (courbe de saisonnalite avec reperes d'evenements) volontairement absentes :
 * memes raisons que Z2 sur M1_OFFRE (pas de bibliotheque de cartographie ni de
 * graphiques retenue, document 11, points ouverts).
 */
export default async function Demande() {
  const demande = await chargerDemandeNationale();

  if (!demande) {
    return <div className="p-8">{t("state.vide.defaut")}</div>;
  }

  const budgetMasque = demande.demBudgetEffectif < 10;

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m2.titre")}
      </h1>

      {/* Z1, blocs cles */}
      <div className="grid grid-cols-4 gap-3">
        <BlocIndicateurCle
          code="DEM_VOLUME_RECHERCHES"
          valeur={demande.demVolumeRecherches}
          calculeA={demande.calculeA}
        />
        <BlocIndicateurCle
          code="DEM_BOOKING_WINDOW"
          valeur={demande.demBookingWindow}
          niveauFiabilite={demande.niveauFiabilite}
          calculeA={demande.calculeA}
        />
        <BlocIndicateurCle
          code="DEM_DUREE_SEJOUR_RECHERCHEE"
          valeur={demande.demDureeSejourRecherchee}
          niveauFiabilite={demande.niveauFiabilite}
          calculeA={demande.calculeA}
        />
        <BlocIndicateurCle
          code="DEM_BUDGET_RECHERCHE"
          valeur={demande.demBudgetRecherche}
          masque={budgetMasque}
          cleLibelleMasque="state.masque_budget"
          calculeA={demande.calculeA}
          pied={
            demande.demBudgetPartPct !== null && (
              <span style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
                {formatPourcentage(demande.demBudgetPartPct)} des recherches avec filtre budget
              </span>
            )
          }
        />
      </div>

      {/* Z3, origine des connexions (jamais "origine des voyageurs", document 9 C.7) */}
      <div className="grid grid-cols-2 gap-8">
        <Repartition titre="Origine des connexions" valeurs={demande.demOriginePays} />
        <Repartition
          titre="Répartition par canal"
          domaine="CANAL"
          valeurs={demande.demRepartitionCanal}
        />
      </div>

      {/* Z5, contexte d'usage */}
      <div className="grid grid-cols-2 gap-8">
        <Repartition
          titre="Répartition par appareil"
          domaine="APPAREIL"
          valeurs={demande.demRepartitionAppareil}
        />

        {/* Z6, destinations hors referentiel */}
        <Repartition
          titre="Destinations hors référentiel"
          valeurs={demande.demDestinationsNonReconnues}
        />
      </div>
    </div>
  );
}
