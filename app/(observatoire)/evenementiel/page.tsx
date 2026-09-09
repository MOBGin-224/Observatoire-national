import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { EtatVide } from "@/components/states/EtatVide";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";
import { chargerEvenementielNational } from "@/lib/queries/evenementiel";

/*
 * Ecran M7_EVENEMENTIEL (document 9 ter, partie J), tres fortement reduit.
 * Le selecteur de fenetre (mode evenement / dates libres, J.5) n'est pas
 * implemente : aucune bibliotheque de calendrier retenue, et la base ne
 * contient a ce jour aucun evenement ni aucune demande institutionnelle.
 * L'ecran affiche une photo a partir d'aujourd'hui, pas une fenetre choisie.
 * Zones 4 (carte), 5 (gammes) et 7 (liste des demandes) absentes pour les
 * memes raisons que sur les autres modules (pas de carte, pas de referentiel
 * territorial complet, pas de donnee institutionnelle a lister). La
 * decomposition en trois parts de la zone 3 est en revanche conservee : elle
 * est une exigence non negociable du document (J.8, J.10, critere 1).
 */
export default async function Evenementiel() {
  const evenementiel = await chargerEvenementielNational();

  if (!evenementiel) {
    return (
      <div className="p-8">
        <EtatVide />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m7.titre")}
      </h1>

      {/* Z1, bandeau de fenetre */}
      {evenementiel.eveEffectifEvenements === 0 && (
        <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
          {t("state.vide.evenement")}
        </p>
      )}

      {/* Z2, blocs cles */}
      <div className="grid grid-cols-4 gap-3">
        <BlocIndicateurCle
          code="EVE_CAPACITE_MOBILISABLE"
          valeur={evenementiel.eveCapaciteMobilisable}
          libelleVide={t("state.vide.etablissements")}
          calculeA={evenementiel.calculeA}
        />
        <BlocIndicateurCle
          code="EVE_CAPACITE_SALLES"
          valeur={evenementiel.eveCapaciteSalles === 0 ? null : evenementiel.eveCapaciteSalles}
          libelleVide={t("state.vide.salles")}
          calculeA={evenementiel.calculeA}
        />
        <BlocIndicateurCle
          code="EVE_TAUX_TENSION_EVENEMENT"
          valeur={evenementiel.eveTauxTensionEvenement}
          libelleVide={t("state.vide.demande_institutionnelle")}
          calculeA={evenementiel.calculeA}
        />
        <BlocIndicateurCle
          code="INS_DEFICIT"
          valeur={
            evenementiel.eveEffectifDemandes === 0
              ? null
              : Math.max(0, evenementiel.insVolumeDemande - evenementiel.eveCapaciteMobilisable)
          }
          libelleVide={t("state.vide.demande_institutionnelle")}
          calculeA={evenementiel.calculeA}
        />
      </div>

      {/* Z3, decomposition obligatoire de la capacite mobilisable (J.8, J.10) */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Décomposition de la capacité
        </h2>
        {evenementiel.eveCapacitePartenaires === 0 &&
        evenementiel.eveCapaciteRecenseeNonPartenaire === 0 ? (
          <EtatVide />
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
                {t("module.m7.decomposition_partenaires")}
              </span>
              <span style={{ fontSize: "var(--text-small)", fontWeight: 600 }}>
                {formatNombre(evenementiel.eveCapacitePartenaires)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
                {t("module.m7.decomposition_recenses")}
              </span>
              <span style={{ fontSize: "var(--text-small)", fontWeight: 600 }}>
                {formatNombre(evenementiel.eveCapaciteRecenseeNonPartenaire)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Z6, salles de reunion */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Salles de réunion
        </h2>
        <BlocIndicateurCle
          code="EVE_CAPACITE_SALLES"
          valeur={evenementiel.eveNbEtabSalles === 0 ? null : evenementiel.eveNbEtabSalles}
          libelleVide={t("state.vide.salles")}
          calculeA={evenementiel.calculeA}
        />
      </div>
    </div>
  );
}
