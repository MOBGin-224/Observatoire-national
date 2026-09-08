import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { Repartition } from "@/components/modules/Repartition";
import { TableauTerritorial } from "@/components/modules/offre/TableauTerritorial";
import { EtatVide } from "@/components/states/EtatVide";
import { t } from "@/lib/i18n";
import { chargerOffreNationale, chargerOffreRegions } from "@/lib/queries/offre";

const INDICATEURS_CLES = [
  "OFF_ETAB_RECENSES",
  "OFF_CAPACITE_RECENSEE",
  "OFF_ETAB_PARTENAIRES",
  "OFF_TAUX_COUVERTURE",
  "OFF_TAUX_NUMERISATION",
  "OFF_TAUX_RESERVABILITE",
  "OFF_TAUX_VERIFICATION",
  "OFF_COMPLETUDE_FICHE",
] as const;

/*
 * Ecran M1_OFFRE (document 9, partie B). Zone Z2 (carte de densite) volontairement
 * absente de cette version : ni bibliotheque de cartographie retenue (document 11,
 * point ouvert 16.2), ni referentiel geographique charge (document 2, point ouvert
 * 20.1) pour lui donner du contenu. Les quatre autres zones sont completes.
 */
export default async function Offre() {
  const national = await chargerOffreNationale();
  const regions = await chargerOffreRegions();

  if (!national) {
    return (
      <div className="p-8">
        <EtatVide />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m1.titre")}
      </h1>

      {/* Z1, blocs cles */}
      <div className="grid grid-cols-4 gap-3">
        {INDICATEURS_CLES.map((code) => (
          <BlocIndicateurCle
            key={code}
            code={code}
            valeur={
              {
                OFF_ETAB_RECENSES: national.offEtabRecenses,
                OFF_CAPACITE_RECENSEE: national.offCapaciteRecensee,
                OFF_ETAB_PARTENAIRES: national.offEtabPartenaires,
                OFF_TAUX_COUVERTURE: national.offTauxCouverture,
                OFF_TAUX_NUMERISATION: national.offTauxNumerisation,
                OFF_TAUX_RESERVABILITE: national.offTauxReservabilite,
                OFF_TAUX_VERIFICATION: national.offTauxVerification,
                OFF_COMPLETUDE_FICHE: national.offCompletudeFiche,
              }[code]
            }
            calculeA={national.calculeA}
          />
        ))}
      </div>

      {/* Z3, repartitions (Z2 carte reportee, voir commentaire ci-dessus) */}
      <div className="grid grid-cols-2 gap-8">
        <Repartition
          titre="Répartition par typologie"
          domaine="TYPOLOGIE"
          valeurs={national.offRepartitionTypologie}
        />
        <Repartition
          titre="Répartition par gamme"
          domaine="GAMME"
          valeurs={national.offRepartitionGamme}
        />
      </div>

      {/* Z4, tableau des territoires enfants */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Territoires
        </h2>
        <TableauTerritorial lignes={regions} />
      </div>

      {/* Z5, qualite de l'inventaire */}
      <div className="flex flex-col gap-3">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Qualité de l&rsquo;inventaire
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <BlocIndicateurCle
            code="OFF_TAUX_VERIFICATION"
            valeur={national.offTauxVerification}
            calculeA={national.calculeA}
          />
          <BlocIndicateurCle
            code="OFF_COMPLETUDE_FICHE"
            valeur={national.offCompletudeFiche}
            calculeA={national.calculeA}
          />
          <BlocIndicateurCle
            code="OFF_ECART_LISTE_ADMIN"
            valeur={national.offEcartListeAdmin}
            calculeA={national.calculeA}
          />
        </div>
      </div>
    </div>
  );
}
