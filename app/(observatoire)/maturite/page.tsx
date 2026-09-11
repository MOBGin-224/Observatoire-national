import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { LegendeDensite, TuilesTerritoriales } from "@/components/charts/TuilesTerritoriales";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { BarresIndice } from "@/components/modules/maturite/BarresIndice";
import { ClassementTerritoires } from "@/components/modules/maturite/ClassementTerritoires";
import { DecompositionIndice } from "@/components/modules/maturite/DecompositionIndice";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatVide } from "@/components/states/EtatVide";
import { listerEnumeration } from "@/lib/enumerations";
import { formatNombre } from "@/lib/format";
import { resoudreIndicateur } from "@/lib/indicators";
import { t } from "@/lib/i18n";
import {
  chargerMaturiteCroisements,
  chargerMaturiteNationale,
  chargerMaturiteRegions,
} from "@/lib/queries/maturite";
import { chargerTerritoiresEnfants } from "@/lib/queries/territoire";

const STYLE_AIDE = {
  fontSize: "var(--text-small)",
  lineHeight: 1.5,
  color: "var(--color-text-muted)",
} as const;

/*
 * Ecran M6_MATURITE (document 9 ter, partie I ; libelles du document 16, D.3).
 *
 * Les six zones de la maquette I.6 sont presentes. La carte de la zone 2 se
 * rabat sur la grille de tuiles, faute de contours du decoupage d'aout 2026
 * (document 8, section 5.7).
 *
 * Trois regles que cet ecran applique et qu'il ne faut pas "ameliorer" :
 *
 *   La mention m6.avertissement est permanente et non masquable, sous le titre
 *   (document 16, D.3). L'indice mesure une numerisation, jamais une qualite.
 *
 *   Aucun filtre de statut de relation (I.7) : un partenaire de SIMANDOU
 *   SEJOUR a par construction un canal de reservation en ligne, filtrer sur
 *   eux produirait un indice artificiellement eleve.
 *
 *   Aucun etablissement n'est jamais nomme, y compris dans le classement, qui
 *   porte sur des territoires (I.10).
 *
 * Reste a construire : les filtres de typologie et de gamme (I.7). Comme pour
 * M1 a M3, ils supposent une agregation filtrable cote base, les vues sont
 * pre-agregees.
 */
export default async function Maturite() {
  const [national, regions, croisements, territoires, fiabilites, indice] = await Promise.all([
    chargerMaturiteNationale(),
    chargerMaturiteRegions(),
    chargerMaturiteCroisements(),
    chargerTerritoiresEnfants(null, "REGION"),
    listerEnumeration("FIABILITE"),
    resoudreIndicateur("MAT_INDICE"),
  ]);

  if (!national) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <EtatVide />
      </div>
    );
  }

  const statutDonnee = "RECENSE";
  const libelleFiabilite = new Map(fiabilites.map((f) => [f.code, f.libelleFr]));

  /* Le referentiel donne la liste complete des regions, la vue leurs valeurs.
     Une region sans etablissement recense reste presente, sans mesure. */
  const parCode = new Map(regions.map((region) => [region.codeTerritoire, region]));
  const lignes = territoires.map((territoire) => {
    const region = parCode.get(territoire.code);
    const niveau = region?.niveauFiabilite ?? null;
    return {
      code: territoire.code,
      libelle: territoire.libelle,
      etablissements: region?.offEtabRecenses ?? 0,
      indice: region?.matIndice ?? null,
      presence: region?.tauxPresence ?? null,
      reservation: region?.tauxReservation ?? null,
      /* Sans aucune donnee de paiement collectee, le taux n'est pas un zero :
         il n'est pas renseigne (document 16, C.2). */
      paiement: region && region.effectifPaiementConnu > 0 ? region.tauxPaiement : null,
      fiabilite: niveau && niveau !== "CONSOLIDE" ? (libelleFiabilite.get(niveau) ?? niveau) : null,
    };
  });

  const tuiles = lignes.map((ligne) => ({
    code: ligne.code,
    libelle: ligne.libelle,
    valeur: ligne.indice ?? 0,
    sansDonnee: ligne.indice === null,
    mention:
      ligne.etablissements > 0 ? t("m6.effectif", { n: formatNombre(ligne.etablissements) }) : undefined,
  }));

  const versLigneIndice = (dimension: "TYPOLOGIE" | "GAMME") =>
    croisements
      .filter((c) => c.dimension === dimension)
      .map((c) => ({
        code: c.code,
        effectif: c.effectif,
        indice: c.matIndice,
        niveauFiabilite: c.niveauFiabilite,
      }));

  return (
    <>
      <BarreControle echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m6.code")}
          titre={t("module.m6.titre")}
          question={t("module.m6.question")}
        />

        {/* Mention obligatoire, permanente et non masquable (document 16, D.3). */}
        <p
          style={{
            marginTop: "calc(-1 * var(--space-4))",
            padding: "var(--space-3) var(--space-4)",
            borderLeft: "var(--filet-accent) solid var(--color-border-strong)",
            backgroundColor: "var(--color-bg-panel)",
            fontSize: "var(--text-small)",
            lineHeight: 1.5,
            color: "var(--color-text-secondary)",
          }}
        >
          {t("m6.avertissement")}
        </p>

        {/* Z1, blocs cles. Quatre taux lus sur une meme echelle de zero a cent. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("m6.z1.titre")} />
          <p style={STYLE_AIDE}>{t("m6.z1.aide")}</p>
          <div className="grid grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-5)" }}>
            <BlocIndicateurCle
              code="MAT_INDICE"
              valeur={national.matIndice}
              libelleVide={t("state.vide.etablissements")}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              calculeA={national.calculeA}
              variante="jauge"
              accent
            />
            <BlocIndicateurCle
              code="OFF_TAUX_NUMERISATION"
              valeur={national.offTauxNumerisation}
              libelleVide={t("state.vide.etablissements")}
              niveauFiabilite={national.fiabiliteInventaire ?? undefined}
              calculeA={national.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="OFF_TAUX_RESERVABILITE"
              valeur={national.offTauxReservabilite}
              libelleVide={t("state.vide.etablissements")}
              niveauFiabilite={national.fiabiliteInventaire ?? undefined}
              calculeA={national.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="MAT_TAUX_PAIEMENT_NUMERIQUE"
              valeur={national.effectifPaiementConnu > 0 ? national.matTauxPaiementNumerique : null}
              libelleVide={t("state.vide.evaluation")}
              niveauFiabilite={national.fiabilitePaiement ?? undefined}
              calculeA={national.calculeA}
              variante="jauge"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
          {/* Z2, indice par territoire. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="02" titre={t("m6.z2.titre")} />
            <Panneau
              titre={t("m6.z2.titre")}
              soustitre={t("m6.z2.aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
              pied={<LegendeDensite cellules={tuiles} etiquette={indice?.libelleFr} />}
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

          {/* Z3, decomposition de l'indice : la zone la plus instructive (I.8). */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="03" titre={t("m6.z3.titre")} />
            <Panneau
              titre={t("m6.z3.titre")}
              soustitre={t("m6.z3.aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
              className="flex-1"
            >
              <DecompositionIndice
                decomposition={national.decomposition}
                ponderation={national.ponderation}
                effectif={national.offEtabRecenses}
                effectifCarteRenseigne={national.effectifCarteRenseigne}
                effectifMobileRenseigne={national.effectifMobileRenseigne}
              />
            </Panneau>
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
          {/* Z4, maturite par typologie. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="04" titre={t("m6.z4.titre")} />
            <Panneau
              titre={t("m6.z4.titre")}
              soustitre={t("m6.z4.aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
              className="flex-1"
            >
              <BarresIndice domaine="TYPOLOGIE" lignes={versLigneIndice("TYPOLOGIE")} />
            </Panneau>
          </section>

          {/* Z5, maturite par gamme tarifaire. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="05" titre={t("m6.z5.titre")} />
            <Panneau
              titre={t("m6.z5.titre")}
              soustitre={t("m6.z5.aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
              className="flex-1"
            >
              <BarresIndice domaine="GAMME" lignes={versLigneIndice("GAMME")} />
            </Panneau>
          </section>
        </div>

        {/* Z6, classement des territoires. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="06" titre={t("m6.z6.titre")} />
          <Panneau
            titre={t("m6.z6.titre")}
            soustitre={t("m6.z6.aide")}
            actions={<BadgeStatutDonnee code={statutDonnee} />}
          >
            <ClassementTerritoires lignes={lignes} />
          </Panneau>
        </section>
      </div>
    </>
  );
}
