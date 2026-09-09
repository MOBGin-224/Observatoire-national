import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { EtatVide } from "@/components/states/EtatVide";
import { t } from "@/lib/i18n";
import { chargerConformiteNationale } from "@/lib/queries/conformite";

/*
 * Ecran M5_CONFORMITE (document 9 quater, partie L). Reserve au profil
 * TUTELLE (document 6, section 3 ; lib/permissions/matrice.ts) : l'acces
 * effectif est garanti par acces_conformite_national (module_actif), pas par
 * cette page. Zones 2 (carte), 3 (croisements) et 6 (tableau territorial)
 * absentes : pas de bibliotheque cartographique retenue, pas de referentiel
 * territorial complet (memes limites que M1/M2/M4). Zones 4 et 5 fonctionnent
 * des le premier jour, sans aucune transmission administrative (L.6) : ce
 * sont les seules zones utiles avant convention avec la tutelle.
 */
export default async function Conformite() {
  const conformite = await chargerConformiteNationale();

  if (!conformite) {
    return (
      <div className="p-8">
        <EtatVide />
      </div>
    );
  }

  const aucuneTransmission = conformite.confEffectifTransmission === 0;

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m5.titre")}
      </h1>

      {/* Z1, blocs cles */}
      <div className="grid grid-cols-4 gap-3">
        <BlocIndicateurCle
          code="OFF_ETAB_RECENSES"
          valeur={conformite.offEtabRecenses}
          calculeA={conformite.calculeA}
        />
        <BlocIndicateurCle
          code="CONF_TAUX_ENREGISTREMENT"
          valeur={conformite.confTauxEnregistrement}
          libelleVide={t("state.vide.conformite")}
          calculeA={conformite.calculeA}
        />
        <BlocIndicateurCle
          code="CONF_TAUX_CLASSIFICATION"
          valeur={conformite.confTauxClassification}
          libelleVide={t("state.vide.conformite")}
          calculeA={conformite.calculeA}
        />
        <BlocIndicateurCle
          code="CONF_ECART_ENREGISTREMENT"
          valeur={conformite.confEcartEnregistrement}
          libelleVide={t("state.vide.conformite")}
          calculeA={conformite.calculeA}
        />
      </div>

      {/* Z4, preparation a la classification, fonctionne sans donnee administrative */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Préparation à la classification
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <BlocIndicateurCle
            code="OFF_ETAB_RECENSES"
            valeur={conformite.confEtabRecensesPrep}
            libelleVide={t("state.vide.etablissements")}
            calculeA={conformite.calculeA}
          />
          <BlocIndicateurCle
            code="OFF_COMPLETUDE_FICHE"
            valeur={
              conformite.confEtabRecensesPrep > 0 ? conformite.confEtabPretsClassification : null
            }
            libelleVide={t("state.vide.etablissements")}
            calculeA={conformite.calculeA}
          />
        </div>
      </div>

      {/* Z5, ecart entre liste administrative et terrain */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Écart entre liste administrative et terrain
        </h2>
        <BlocIndicateurCle
          code="OFF_ECART_LISTE_ADMIN"
          valeur={conformite.offEcartListeAdmin}
          libelleVide={t("state.vide.ecart_terrain")}
          calculeA={conformite.calculeA}
        />
      </div>

      {aucuneTransmission && (
        <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
          {t("state.vide.conformite")}
        </p>
      )}
    </div>
  );
}
