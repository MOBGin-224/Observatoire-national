import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { DecompositionIndice } from "@/components/modules/maturite/DecompositionIndice";
import { EtatVide } from "@/components/states/EtatVide";
import { t } from "@/lib/i18n";
import { chargerMaturiteNationale } from "@/lib/queries/maturite";

/*
 * Ecran M6_MATURITE (document 9 ter, partie I). Zone 2 (carte), zones 4/5
 * (croisements typologie/gamme) et zone 6 (classement territorial) absentes :
 * pas de bibliotheque cartographique retenue, pas de referentiel territorial
 * complet (memes limites que M1/M2/M4). Aucun indicateur de ce module n'est
 * soumis a la regle M1 (I.9) : tout s'affiche, y compris a zero.
 */
export default async function Maturite() {
  const maturite = await chargerMaturiteNationale();

  if (!maturite) {
    return (
      <div className="p-8">
        <EtatVide />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m6.titre")}
      </h1>

      {/* Z1, blocs cles */}
      <div className="grid grid-cols-4 gap-3">
        <BlocIndicateurCle
          code="MAT_INDICE"
          valeur={maturite.matIndice}
          libelleVide={t("state.vide.etablissements")}
          calculeA={maturite.calculeA}
        />
        <BlocIndicateurCle
          code="OFF_TAUX_NUMERISATION"
          valeur={maturite.decomposition.presenceLigne}
          libelleVide={t("state.vide.etablissements")}
          calculeA={maturite.calculeA}
        />
        <BlocIndicateurCle
          code="OFF_TAUX_RESERVABILITE"
          valeur={maturite.decomposition.canalReservation}
          libelleVide={t("state.vide.etablissements")}
          calculeA={maturite.calculeA}
        />
        <BlocIndicateurCle
          code="MAT_TAUX_PAIEMENT_NUMERIQUE"
          valeur={maturite.matTauxPaiementNumerique}
          libelleVide={t("state.vide.etablissements")}
          calculeA={maturite.calculeA}
        />
      </div>

      {/* Z3, decomposition de l'indice */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Décomposition de l&rsquo;indice
        </h2>
        <DecompositionIndice
          decomposition={maturite.decomposition}
          effectif={maturite.offEtabRecenses}
        />
      </div>
    </div>
  );
}
