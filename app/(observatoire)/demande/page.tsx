import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { Anneau } from "@/components/charts/Anneau";
import { BarreRepartition } from "@/components/charts/BarreRepartition";
import { BarresClassees } from "@/components/charts/BarresClassees";
import { CourbeTemporelle, Sparkline } from "@/components/charts/CourbeTemporelle";
import { LegendeDensite, TuilesTerritoriales } from "@/components/charts/TuilesTerritoriales";
import { Treemap } from "@/components/charts/Treemap";
import type { Part } from "@/components/charts/geometrie";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatVide } from "@/components/states/EtatVide";
import { listerEnumeration } from "@/lib/enumerations";
import { formatMois, formatNombre, formatPourcentage, nomPays } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  chargerDemandeNationale,
  chargerDemandeRegions,
  chargerDemandeSaisonnalite,
} from "@/lib/queries/demande";
import { chargerTerritoiresEnfants } from "@/lib/queries/territoire";

/*
 * Ecran M2_DEMANDE (document 9, partie C).
 *
 * Les six zones de la maquette C.5 sont desormais presentes. Z2 et Z4 ont ete
 * ouvertes par les vues mv_demande_region et mv_demande_saisonnalite : elles
 * etaient prescrites depuis l'origine mais n'avaient aucun agregat pour les
 * alimenter.
 *
 * Le choix de forme suit la nature de chaque variable, jamais l'envie de varier :
 *   Z2 destinations   grille de tuiles, faute de contours (document 8, 5.7)
 *   Z3 origine        barres classees, comparaison de categories distinctes
 *   Z4 saisonnalite   aire temporelle, la seule forme qui montre un volume
 *                     dans le temps et ses creux
 *   Z5 appareil       anneau, trois categories nominales, total au centre
 *   Z5 canal          barre de repartition, la composition d'un tout
 *   Z6 hors ref.      treemap, categories nombreuses, sans ordre, tres inegales
 *
 * Reste a construire : le selecteur de periode et les trois filtres de module
 * (C.6). Ils supposent une agregation filtrable cote base ; les vues actuelles
 * sont pre-agregees.
 */
export default async function Demande() {
  const [demande, saisonnalite, destinations, territoires, appareils, canaux] = await Promise.all([
    chargerDemandeNationale(),
    chargerDemandeSaisonnalite(),
    chargerDemandeRegions(),
    chargerTerritoiresEnfants(null, "REGION"),
    listerEnumeration("APPAREIL"),
    listerEnumeration("CANAL"),
  ]);

  if (!demande) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <EtatVide />
      </div>
    );
  }

  const statutDonnee = "EXPRIME";
  const budgetMasque = demande.demBudgetEffectif < 10;

  const pointsSaisonnalite = saisonnalite.map((point) => ({
    cle: point.mois,
    libelle: formatMois(point.mois),
    valeur: point.demVolumeRecherches,
  }));

  /* Le référentiel donne toutes les régions, la vue donne celles qui ont été
     recherchées. Une région jamais recherchée reste visible, hachurée. */
  const parCode = new Map(destinations.map((d) => [d.codeTerritoire, d]));
  const tuiles = territoires.map((territoire) => ({
    code: territoire.code,
    libelle: territoire.libelle,
    valeur: parCode.get(territoire.code)?.demVolumeRecherches ?? 0,
    mention: t("module.m2.sessions", {
      n: formatNombre(parCode.get(territoire.code)?.demSessions ?? 0),
    }),
  }));

  const versParts = (
    valeurs: Record<string, number>,
    libelle: (code: string) => string
  ): Part[] =>
    Object.entries(valeurs)
      .filter(([, n]) => n > 0)
      .map(([code, n]) => ({ code, libelle: libelle(code), valeur: n }));

  const partsPays = versParts(demande.demOriginePays, nomPays)
    .sort((a, b) => b.valeur - a.valeur)
    .slice(0, 10);

  const libelleAppareil = new Map(appareils.map((a) => [a.code, a.libelleFr]));

  const partsAppareil = versParts(
    demande.demRepartitionAppareil,
    (code) => libelleAppareil.get(code) ?? code
  );
  /* Les canaux gardent l'ordre de l'énumération, pas celui des effectifs :
     la barre reste comparable d'une période à l'autre. */
  const partsCanal = canaux
    .map((canal) => ({
      code: canal.code,
      libelle: canal.libelleFr,
      valeur: demande.demRepartitionCanal[canal.code] ?? 0,
    }))
    .filter((p) => p.valeur > 0);

  const partsHorsReferentiel = versParts(demande.demDestinationsNonReconnues, (code) => code);
  const totalAppareil = partsAppareil.reduce((s, p) => s + p.valeur, 0);

  return (
    <>
      <BarreControle echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m2.code")}
          titre={t("module.m2.titre")}
          question={t("module.m2.question")}
        />

        {/* Z1, intention de séjour */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("module.m2.intention")} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-5)" }}>
            <BlocIndicateurCle
              code="DEM_VOLUME_RECHERCHES"
              valeur={demande.demVolumeRecherches}
              calculeA={demande.calculeA}
              niveauFiabilite={demande.niveauFiabilite}
              variante="volume"
              accent
              pied={
                pointsSaisonnalite.length > 1 ? (
                  <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                    <Sparkline
                      valeurs={pointsSaisonnalite.map((p) => p.valeur)}
                      libelle={t("module.m2.sparkline_volume")}
                      largeur={150}
                    />
                    <span style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
                      {t("module.m2.sparkline_volume")}
                    </span>
                  </span>
                ) : null
              }
            />
            <BlocIndicateurCle
              code="DEM_BOOKING_WINDOW"
              valeur={demande.demBookingWindow}
              niveauFiabilite={demande.niveauFiabilite}
              calculeA={demande.calculeA}
              libelleVide={t("state.vide.mediane")}
            />
            <BlocIndicateurCle
              code="DEM_DUREE_SEJOUR_RECHERCHEE"
              valeur={demande.demDureeSejourRecherchee}
              niveauFiabilite={demande.niveauFiabilite}
              calculeA={demande.calculeA}
              libelleVide={t("state.vide.mediane")}
            />
            <BlocIndicateurCle
              code="DEM_BUDGET_RECHERCHE"
              valeur={demande.demBudgetRecherche}
              masque={budgetMasque}
              cleLibelleMasque="state.masque_budget"
              libelleVide={t("state.vide.budget")}
              calculeA={demande.calculeA}
              pied={
                demande.demBudgetPartPct !== null ? (
                  <span style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
                    {t("module.m2.part_filtre_budget", {
                      p: formatPourcentage(demande.demBudgetPartPct),
                    })}
                  </span>
                ) : null
              }
            />
          </div>
        </section>

        {/* Z4, saisonnalité de l'intention */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="02" titre={t("module.m2.saisonnalite")} />
          <Panneau
            titre={t("module.m2.saisonnalite_titre")}
            soustitre={t("module.m2.saisonnalite_aide")}
            actions={<BadgeStatutDonnee code={statutDonnee} />}
          >
            {pointsSaisonnalite.length > 1 ? (
              <CourbeTemporelle points={pointsSaisonnalite} aire />
            ) : (
              <EtatVide libelle={t("state.vide.saisonnalite")} />
            )}
          </Panneau>
        </section>

        {/* Z2 destinations et Z3 origine, posées côte à côte : la comparaison
            des deux est le point de méthode du module (document 9, C.7). */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="03" titre={t("module.m2.geographie")} />
          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr]" style={{ gap: "var(--space-5)" }}>
            <Panneau
              titre={t("module.m2.destinations")}
              soustitre={t("module.m2.destinations_aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
              pied={<LegendeDensite cellules={tuiles} />}
            >
              {tuiles.length > 0 ? (
                <TuilesTerritoriales cellules={tuiles} />
              ) : (
                <EtatVide libelle={t("state.vide.carte")} />
              )}
            </Panneau>

            <Panneau
              titre={t("module.m2.origine")}
              soustitre={t("module.m2.origine_aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
            >
              {partsPays.length > 0 ? (
                <BarresClassees parts={partsPays} formaterValeur={(v) => formatNombre(v)} />
              ) : (
                <EtatVide libelle={t("state.vide.recherches")} />
              )}
            </Panneau>
          </div>
        </section>

        {/* Z5, contexte d'usage */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="04" titre={t("module.m2.contexte")} />
          <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-5)" }}>
            <Panneau
              titre={t("module.m2.appareil")}
              soustitre={t("module.m2.appareil_aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
            >
              {totalAppareil > 0 ? (
                <Anneau
                  parts={partsAppareil}
                  total={formatNombre(totalAppareil)}
                  legendeCentre={t("module.m2.legende_recherches")}
                />
              ) : (
                <EtatVide libelle={t("state.vide.recherches")} />
              )}
            </Panneau>

            <Panneau
              titre={t("module.m2.canal")}
              soustitre={t("module.m2.canal_aide")}
              actions={<BadgeStatutDonnee code={statutDonnee} />}
            >
              {partsCanal.length > 0 ? (
                <BarreRepartition parts={partsCanal} formaterValeur={(v) => formatNombre(v)} />
              ) : (
                <EtatVide libelle={t("state.vide.recherches")} />
              )}
            </Panneau>
          </div>
        </section>

        {/* Z6, destinations hors référentiel */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="05" titre={t("module.m2.hors_referentiel")} />
          <Panneau
            titre={t("module.m2.hors_referentiel_titre")}
            soustitre={t("module.m2.hors_referentiel_aide")}
            actions={<BadgeStatutDonnee code={statutDonnee} />}
          >
            {partsHorsReferentiel.length > 0 ? (
              <Treemap parts={partsHorsReferentiel} />
            ) : (
              <EtatVide libelle={t("state.vide.hors_referentiel")} />
            )}
          </Panneau>
        </section>
      </div>
    </>
  );
}
