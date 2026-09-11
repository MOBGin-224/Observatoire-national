import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { LegendeDensite, TuilesTerritoriales } from "@/components/charts/TuilesTerritoriales";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { TableauRegional } from "@/components/modules/TableauRegional";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatVide } from "@/components/states/EtatVide";
import { listerEnumeration, type ValeurEnumeration } from "@/lib/enumerations";
import { formatDate, formatPourcentage } from "@/lib/format";
import { resoudreIndicateur } from "@/lib/indicators";
import { t } from "@/lib/i18n";
import {
  chargerConformiteCroisements,
  chargerConformiteNationale,
  chargerConformiteRegions,
  type LigneConformiteCroisement,
} from "@/lib/queries/conformite";
import { chargerTerritoiresEnfants } from "@/lib/queries/territoire";

/* Zones de recensement et zones administratives portent chacune leur statut,
   ce qui les distingue a l'ecran comme a l'export (critere L.10.10). Le statut
   administratif est celui des indicateurs CONF_ au dictionnaire. */
const STATUT_RECENSEMENT = "RECENSE";
const STATUT_ADMINISTRATIF = "DECLARE";

const STYLE_AIDE = {
  fontSize: "var(--text-small)",
  lineHeight: 1.5,
  color: "var(--color-text-muted)",
} as const;

/*
 * Ecran M5_CONFORMITE (document 9 quater, partie L ; libelles du document 16, D.2).
 *
 * Le module vide est l'offre faite a la tutelle, pas un defaut (L.3). Tant
 * qu'aucune donnee de conformite n'a ete transmise, les zones 1, 2, 3 et 6
 * affichent le libelle d'absence de transmission ; les zones 4 et 5, qui
 * reposent sur le recensement, fonctionnent des le premier jour (L.6, L.10.1).
 *
 * Regles tenues ici, a ne pas "ameliorer" :
 *   aucun etablissement n'est nomme, jamais, y compris pour une absence
 *   d'enregistrement : une liste nominative serait un signalement (L.9) ;
 *   le mot "informel" n'apparait nulle part (L.10.4) ;
 *   aucun message n'annonce une fonctionnalite a venir (L.10.9).
 *
 * Reste a construire : les filtres de typologie et de gamme (L.5), pour la meme
 * raison que sur M1 a M3 et M6 (vues pre-agregees).
 */
export default async function Conformite() {
  const [national, regions, croisements, territoires, typologies, gammes, indicateurTaux] =
    await Promise.all([
      chargerConformiteNationale(),
      chargerConformiteRegions(),
      chargerConformiteCroisements(),
      chargerTerritoiresEnfants(null, "REGION"),
      listerEnumeration("TYPOLOGIE"),
      listerEnumeration("GAMME"),
      resoudreIndicateur("CONF_TAUX_ENREGISTREMENT"),
    ]);

  if (!national) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <EtatVide />
      </div>
    );
  }

  const transmission = national.confEffectifTransmission > 0;
  const parCode = new Map(regions.map((region) => [region.codeTerritoire, region]));
  const lignesRegions = territoires.map((territoire) => ({
    territoire,
    valeurs: parCode.get(territoire.code) ?? null,
  }));

  /* Source et date de la transmission, sur les zones administratives (L.7). */
  const provenance = transmission
    ? t("m5.provenance", {
        source: national.confSources ?? t("state.non_renseigne"),
        date: national.confDateDonnees ? formatDate(national.confDateDonnees) : t("state.non_renseigne"),
      })
    : null;

  const tuiles = lignesRegions.map(({ territoire, valeurs }) => {
    const taux = valeurs?.confTauxEnregistrement ?? null;
    return {
      code: territoire.code,
      libelle: territoire.libelle,
      valeur: taux ?? 0,
      sansDonnee: taux === null,
      valeurAffichee: taux === null ? undefined : formatPourcentage(taux),
    };
  });

  const lignesPreparation = lignesRegions.map(({ territoire, valeurs }) => ({
    code: territoire.code,
    libelle: territoire.libelle,
    valeurs: [
      valeurs?.offEtabRecenses ?? 0,
      valeurs?.confFichesCompletes ?? 0,
      valeurs?.confFichesVerifiees ?? 0,
      valeurs?.confEtabPretsClassification ?? 0,
    ],
  }));

  const lignesEcart = lignesRegions.map(({ territoire, valeurs }) => ({
    code: territoire.code,
    libelle: territoire.libelle,
    valeurs: [
      valeurs?.confEcartFermes ?? 0,
      valeurs?.confEcartInexistants ?? 0,
      valeurs?.confEcartReclasses ?? 0,
      valeurs?.offEcartListeAdmin ?? 0,
    ],
  }));

  const lignesDetail = lignesRegions.map(({ territoire, valeurs }) => ({
    code: territoire.code,
    libelle: territoire.libelle,
    valeurs: [
      valeurs?.offEtabRecenses ?? 0,
      valeurs?.confEnregistres ?? null,
      valeurs?.confClasses ?? null,
      valeurs?.confEcartEnregistrement ?? null,
    ],
  }));

  const colonnesCroisement = [
    { libelle: t("m5.z6.col.recenses"), forme: "volume" as const },
    { libelle: t("m5.z6.col.enregistres"), forme: "volume" as const },
    { libelle: t("m5.z6.col.classes"), forme: "volume" as const },
  ];

  /* Les categories suivent l'ordre du referentiel. */
  const lignesCroisement = (dimension: "TYPOLOGIE" | "GAMME", referentiel: ValeurEnumeration[]) => {
    const parCategorie = new Map<string, LigneConformiteCroisement>(
      croisements.filter((c) => c.dimension === dimension).map((c) => [c.code, c])
    );
    return referentiel
      .filter((valeur) => parCategorie.has(valeur.code))
      .map((valeur) => {
        const ligne = parCategorie.get(valeur.code)!;
        return {
          code: valeur.code,
          libelle: valeur.libelleFr,
          valeurs: [ligne.offEtabRecenses, ligne.confEnregistres, ligne.confClasses],
        };
      });
  };

  return (
    <>
      <BarreControle echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m5.code")}
          titre={t("module.m5.titre")}
          question={t("module.m5.question")}
        />

        {/* Z1, blocs cles. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("m5.z1.titre")} />
          <p style={STYLE_AIDE}>{t("m5.z1.aide")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-5)" }}>
            <BlocIndicateurCle
              code="OFF_ETAB_RECENSES"
              valeur={national.offEtabRecenses}
              niveauFiabilite={national.fiabiliteRecensement ?? undefined}
              calculeA={national.calculeA}
              variante="volume"
              accent
            />
            <BlocIndicateurCle
              code="CONF_TAUX_ENREGISTREMENT"
              valeur={national.confTauxEnregistrement}
              libelleVide={t("state.vide.conformite")}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              calculeA={national.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="CONF_TAUX_CLASSIFICATION"
              valeur={national.confTauxClassification}
              libelleVide={t("state.vide.conformite")}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              calculeA={national.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="CONF_ECART_ENREGISTREMENT"
              valeur={national.confEcartEnregistrement}
              libelleVide={t("state.vide.conformite")}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              calculeA={national.calculeA}
              variante="volume"
            />
          </div>
          {provenance && <p style={STYLE_AIDE}>{provenance}</p>}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
          {/* Z2, taux d'enregistrement par territoire. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="02" titre={t("m5.z2.titre")} />
            <Panneau
              titre={t("m5.z2.titre")}
              soustitre={t("m5.z2.aide")}
              actions={<BadgeStatutDonnee code={STATUT_ADMINISTRATIF} />}
              pied={
                <LegendeDensite
                  cellules={tuiles}
                  etiquette={indicateurTaux?.libelleFr}
                  libelleSansDonnee={transmission ? undefined : t("carte.aucune_donnee_conformite")}
                />
              }
              className="flex-1"
            >
              {tuiles.length === 0 ? (
                <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
                  {t("state.vide.subdivision")}
                </p>
              ) : (
                <TuilesTerritoriales cellules={tuiles} />
              )}
            </Panneau>
          </section>

          {/* Z3, repartition par typologie et par gamme. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="03" titre={t("m5.z3.titre")} />
            <Panneau
              titre={t("m5.z3.titre")}
              soustitre={t("m5.z3.aide")}
              actions={<BadgeStatutDonnee code={STATUT_ADMINISTRATIF} />}
              className="flex-1"
            >
              {transmission ? (
                <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
                  <TableauRegional
                    enTetePremiereColonne={t("controle.filtre.typologie")}
                    colonnes={colonnesCroisement}
                    lignes={lignesCroisement("TYPOLOGIE", typologies)}
                  />
                  <TableauRegional
                    enTetePremiereColonne={t("controle.filtre.gamme")}
                    colonnes={colonnesCroisement}
                    lignes={lignesCroisement("GAMME", gammes)}
                  />
                </div>
              ) : (
                <EtatVide libelle={t("state.vide.conformite")} />
              )}
            </Panneau>
          </section>
        </div>

        {/* Z4, preparation a la classification : la zone la plus utile a la
            tutelle avant toute transmission (L.6). */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="04" titre={t("m5.z4.titre")} />
          <Panneau
            titre={t("m5.z4.titre")}
            soustitre={t("m5.z4.aide")}
            actions={<BadgeStatutDonnee code={STATUT_RECENSEMENT} />}
          >
            {national.offEtabRecenses === 0 ? (
              <EtatVide libelle={t("state.vide.etablissements")} />
            ) : (
              <TableauRegional
                enTetePremiereColonne={t("m5.z4.col.territoire")}
                colonnes={[
                  { libelle: t("m5.z4.col.recenses"), forme: "volume" },
                  { libelle: t("m5.z4.col.completes"), forme: "volume" },
                  { libelle: t("m5.z4.col.verifiees"), forme: "volume" },
                  { libelle: t("m5.z4.col.prets"), forme: "volume" },
                ]}
                lignes={lignesPreparation}
                total={[
                  national.offEtabRecenses,
                  national.confFichesCompletes,
                  national.confFichesVerifiees,
                  national.confEtabPretsClassification,
                ]}
              />
            )}
          </Panneau>
        </section>

        {/* Z5, ecart entre liste administrative et terrain. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="05" titre={t("m5.z5.titre")} />
          <Panneau
            titre={t("m5.z5.titre")}
            soustitre={t("m5.z5.aide")}
            actions={<BadgeStatutDonnee code={STATUT_RECENSEMENT} />}
          >
            {national.offEcartListeAdmin === 0 ? (
              <EtatVide libelle={t("state.vide.ecart_terrain")} />
            ) : (
              <TableauRegional
                enTetePremiereColonne={t("m5.z5.col.territoire")}
                colonnes={[
                  { libelle: t("m5.z5.col.fermes"), forme: "volume" },
                  { libelle: t("m5.z5.col.inexistants"), forme: "volume" },
                  { libelle: t("m5.z5.col.reclasses"), forme: "volume" },
                  { libelle: t("m5.z5.col.total"), forme: "volume" },
                ]}
                lignes={lignesEcart}
                total={[
                  national.confEcartFermes,
                  national.confEcartInexistants,
                  national.confEcartReclasses,
                  national.offEcartListeAdmin,
                ]}
              />
            )}
          </Panneau>
        </section>

        {/* Z6, detail par territoire. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="06" titre={t("m5.z6.titre")} />
          <Panneau
            titre={t("m5.z6.titre")}
            soustitre={t("m5.z6.aide")}
            actions={<BadgeStatutDonnee code={STATUT_ADMINISTRATIF} />}
            pied={provenance ? <p style={STYLE_AIDE}>{provenance}</p> : undefined}
          >
            {transmission ? (
              <TableauRegional
                enTetePremiereColonne={t("m5.z6.col.territoire")}
                colonnes={[
                  { libelle: t("m5.z6.col.recenses"), forme: "volume" },
                  { libelle: t("m5.z6.col.enregistres"), forme: "volume" },
                  { libelle: t("m5.z6.col.classes"), forme: "volume" },
                  { libelle: t("m5.z6.col.non_documentes"), forme: "volume" },
                ]}
                lignes={lignesDetail}
                total={[
                  national.offEtabRecenses,
                  national.confEnregistres,
                  national.confClasses,
                  national.confEcartEnregistrement,
                ]}
              />
            ) : (
              <EtatVide libelle={t("state.vide.conformite")} />
            )}
          </Panneau>
        </section>
      </div>
    </>
  );
}
