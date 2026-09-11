import Link from "next/link";
import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { CourbeTemporelle } from "@/components/charts/CourbeTemporelle";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { TableauRegional, type LigneTableau } from "@/components/modules/TableauRegional";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatMasque } from "@/components/states/EtatMasque";
import { EtatVide } from "@/components/states/EtatVide";
import { listerEnumeration, type ValeurEnumeration } from "@/lib/enumerations";
import { formatCoefficient, formatDate, formatMois, nomPays } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  chargerCoefficientCourant,
  chargerRetombeesEvolution,
  chargerRetombeesNationales,
  chargerRetombeesRegions,
  chargerRetombeesRepartitions,
  type LigneRetombeesRepartition,
} from "@/lib/queries/retombees";
import { chargerTerritoiresEnfants } from "@/lib/queries/territoire";

const STATUT_OBSERVE = "OBSERVE";

const STYLE_AIDE = {
  fontSize: "var(--text-small)",
  lineHeight: 1.5,
  color: "var(--color-text-muted)",
} as const;

/*
 * Ecran M8_RETOMBEES (document 9 quater, partie M ; libelles du document 16, D.5).
 *
 * Le module le plus dangereux de l'Observatoire (M.3). Il reste desactive pour
 * tous les comptes tant qu'aucun coefficient courant, source, perimetre et date
 * de validation renseignes, n'est enregistre : la base le ferme (document 16,
 * B.4), et aucun coefficient n'est jamais produit par estimation. Aujourd'hui,
 * l'ecran s'arrete donc au bandeau de methode, qui dit pourquoi.
 *
 * Regles tenues ici, a ne pas "ameliorer" :
 *   le bandeau de methode est permanent et non masquable, et nomme coefficient,
 *   source, perimetre et date (M.6) ;
 *   depense observee et depense estimee ne partagent jamais un graphique (M.7) ;
 *   la depense observee suit la regle M1, et l'estimation suit l'observee (M.8) ;
 *   sans depense observee, aucune estimation (M.10.7) ;
 *   aucune estimation d'emplois, aucune donnee financiere de SIMANDOU SEJOUR (M.9).
 */
export default async function Retombees() {
  const [national, evolution, repartitions, regions, territoires, coefficient, typologies, gammes] =
    await Promise.all([
      chargerRetombeesNationales(),
      chargerRetombeesEvolution(),
      chargerRetombeesRepartitions(),
      chargerRetombeesRegions(),
      chargerTerritoiresEnfants(null, "REGION"),
      chargerCoefficientCourant(),
      listerEnumeration("TYPOLOGIE"),
      listerEnumeration("GAMME"),
    ]);

  const bandeau = coefficient
    ? t("m8.methode.format", {
        valeur: formatCoefficient(coefficient.valeur),
        source: coefficient.source,
        perimetre: coefficient.perimetre,
        date: formatDate(coefficient.dateValidation),
      })
    : t("m8.methode.absent");

  const pointsEvolution = evolution.map((point) => ({
    cle: point.mois,
    libelle: formatMois(point.mois),
    valeur: point.depense,
  }));
  const evolutionLisible = pointsEvolution.filter((point) => point.valeur !== null).length > 1;

  const colonnesRepartition = [
    { libelle: t("m8.z5.col.observee"), forme: "volume" as const },
    { libelle: t("m8.z5.col.nuitees"), forme: "volume" as const },
  ];

  const lignesRepartition = (
    dimension: LigneRetombeesRepartition["dimension"],
    referentiel?: ValeurEnumeration[]
  ): LigneTableau[] => {
    const lignes = repartitions.filter((ligne) => ligne.dimension === dimension);
    /* Typologie et gamme dans l'ordre du referentiel ; les pays par depense decroissante. */
    const ordonnees = referentiel
      ? referentiel
          .map((valeur) => lignes.find((ligne) => ligne.code === valeur.code))
          .filter((ligne): ligne is LigneRetombeesRepartition => ligne !== undefined)
      : [...lignes].sort((a, b) => (b.depense ?? -1) - (a.depense ?? -1));
    return ordonnees.map((ligne) => ({
      code: ligne.code,
      libelle: referentiel
        ? (referentiel.find((valeur) => valeur.code === ligne.code)?.libelleFr ?? ligne.code)
        : nomPays(ligne.code),
      valeurs: [ligne.depense, ligne.nuitees],
      masque: ligne.masque,
    }));
  };

  const parCode = new Map(regions.map((region) => [region.codeTerritoire, region]));
  const lignesRegions: LigneTableau[] = territoires.map((territoire) => {
    const region = parCode.get(territoire.code);
    return {
      code: territoire.code,
      libelle: territoire.libelle,
      /* Une region sans reservation honoree n'a aucune nuitee ; sa depense
         n'est pas une mesure, elle n'est pas renseignee. */
      valeurs: region ? [region.nuitees, region.depense, region.estimee] : [0, null, null],
      masque: region?.masque ?? false,
    };
  });

  return (
    <>
      <BarreControle echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m8.code")}
          titre={t("module.m8.titre")}
          question={t("module.m8.question")}
        />

        {/* Z1, bandeau de methode : permanent, non masquable, repris sur tout export (M.6). */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("m8.z1.titre")} />
          <Panneau accent="bleu">
            <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
              <p
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "var(--text-h3)",
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: "var(--color-primary-700)",
                }}
              >
                {bandeau}
              </p>
              <Link
                href="/methodologie"
                className="lien-sobre self-start"
                style={{ fontSize: "var(--text-small)", fontWeight: 600 }}
              >
                {t("m8.methode.lien")}
              </Link>
            </div>
          </Panneau>
          <p
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderLeft: "var(--filet-accent) solid var(--color-border-strong)",
              backgroundColor: "var(--color-bg-panel)",
              fontSize: "var(--text-small)",
              lineHeight: 1.5,
              color: "var(--color-text-secondary)",
            }}
          >
            {t("m8.avertissement")}
          </p>
        </section>

        {national && (
          <>
            {/* Z2, indicateurs cles. */}
            <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
              <TitreSection numero="02" titre={t("m8.z2.titre")} />
              <p style={STYLE_AIDE}>{t("m8.z2.aide")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-5)" }}>
                <BlocIndicateurCle
                  code="RET_DEPENSE_HEBERGEMENT"
                  valeur={national.retReservations === 0 ? null : national.retDepenseHebergement}
                  masque={national.retReservations > 0 && national.retMasque}
                  libelleVide={t("state.vide.reservations")}
                  niveauFiabilite={national.niveauFiabilite ?? undefined}
                  calculeA={national.calculeA}
                  variante="volume"
                  accent
                />
                <BlocIndicateurCle
                  code="RET_DEPENSE_TOTALE_ESTIMEE"
                  valeur={national.retDepenseTotaleEstimee}
                  masque={national.retReservations > 0 && national.retMasque}
                  libelleVide={t("state.vide.estimation_retombees")}
                  niveauFiabilite={national.niveauFiabilite ?? undefined}
                  calculeA={national.calculeA}
                  variante="volume"
                />
                <BlocIndicateurCle
                  code="ACT_NUITEES"
                  valeur={national.actNuitees}
                  calculeA={national.calculeA}
                  variante="volume"
                />
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
              {/* Z3, evolution de la depense observee. Jamais l'estimee sur la meme courbe. */}
              <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                <TitreSection numero="03" titre={t("m8.z3.titre")} />
                <Panneau
                  titre={t("m8.z3.titre")}
                  soustitre={t("m8.z3.aide")}
                  actions={<BadgeStatutDonnee code={STATUT_OBSERVE} />}
                  className="flex-1"
                >
                  {national.retMasque && national.retReservations > 0 ? (
                    <EtatMasque />
                  ) : evolutionLisible ? (
                    <CourbeTemporelle points={pointsEvolution} aire />
                  ) : (
                    <EtatVide libelle={t("state.vide.evolution_donnees")} />
                  )}
                </Panneau>
              </section>

              {/* Z4, repartitions. */}
              <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                <TitreSection numero="04" titre={t("m8.z4.titre")} />
                <Panneau
                  titre={t("m8.z4.titre")}
                  soustitre={t("m8.z4.aide")}
                  actions={<BadgeStatutDonnee code={STATUT_OBSERVE} />}
                  className="flex-1"
                >
                  {repartitions.length === 0 ? (
                    <EtatVide libelle={t("state.vide.depense")} />
                  ) : (
                    <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
                      <TableauRegional
                        enTetePremiereColonne={t("m8.z4.typologie")}
                        colonnes={colonnesRepartition}
                        lignes={lignesRepartition("TYPOLOGIE", typologies)}
                      />
                      <TableauRegional
                        enTetePremiereColonne={t("m8.z4.gamme")}
                        colonnes={colonnesRepartition}
                        lignes={lignesRepartition("GAMME", gammes)}
                      />
                      <TableauRegional
                        enTetePremiereColonne={t("m8.z4.origine")}
                        colonnes={colonnesRepartition}
                        lignes={lignesRepartition("ORIGINE")}
                      />
                    </div>
                  )}
                </Panneau>
              </section>
            </div>

            {/* Z5, detail par territoire. Un tableau, pas un graphique : observe et
                estime y ont chacun leur colonne. */}
            <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
              <TitreSection numero="05" titre={t("m8.z5.titre")} />
              <Panneau titre={t("m8.z5.titre")} actions={<BadgeStatutDonnee code={STATUT_OBSERVE} />}>
                {lignesRegions.length === 0 ? (
                  <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
                    {t("state.vide.subdivision")}
                  </p>
                ) : (
                  <TableauRegional
                    enTetePremiereColonne={t("m8.z5.col.territoire")}
                    colonnes={[
                      { libelle: t("m8.z5.col.nuitees"), forme: "volume" },
                      { libelle: t("m8.z5.col.observee"), forme: "volume" },
                      { libelle: t("m8.z5.col.estimee"), forme: "volume" },
                    ]}
                    lignes={lignesRegions}
                    total={[
                      national.actNuitees,
                      national.retDepenseHebergement,
                      national.retDepenseTotaleEstimee,
                    ]}
                  />
                )}
              </Panneau>
            </section>
          </>
        )}
      </div>
    </>
  );
}
