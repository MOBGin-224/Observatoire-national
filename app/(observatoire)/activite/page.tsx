import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { BarresVerticales } from "@/components/charts/BarresVerticales";
import { BulletGraph } from "@/components/charts/BulletGraph";
import { CADRE_COLONNE, CourbeTemporelle, Sparkline } from "@/components/charts/CourbeTemporelle";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatMasque } from "@/components/states/EtatMasque";
import { EtatVide } from "@/components/states/EtatVide";
import { formatMois, formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";
import { chargerActiviteEvolution, chargerActiviteNationale } from "@/lib/queries/activite";
import { chargerOffreNationale } from "@/lib/queries/offre";

/*
 * Ecran M3_ACTIVITE (document 9 quater, partie K).
 *
 * Zone 2, evolution dans le temps, ouverte par la vue mv_activite_evolution.
 * Elle est rendue en petits multiples plutot qu'en courbes superposees : le
 * document 8 interdit le double axe, et occupation, ADR et RevPAR n'ont pas la
 * meme unite. Trois tracés cote a cote, chacun avec son echelle et son unite,
 * donnent la lecture recherchee sans mentir sur les ordres de grandeur.
 *
 * Zone 4, conversion, en bullet graph. Le point K.7 impose de ne jamais montrer
 * le taux de conversion sans le taux de couverture en regard. Deux blocs cote a
 * cote n'y suffisent pas : l'oeil compare deux nombres, pas deux positions. Le
 * bullet graph pose les deux sur la meme regle et le rapport devient visible
 * sans calcul.
 *
 * Zone 3, repartitions par typologie et par gamme, toujours absente : le
 * document 4 ne definit aucun indicateur ACT_REPARTITION_*, et la regle du
 * projet est de ne jamais inventer un indicateur. A ouvrir en modifiant d'abord
 * le document 4.
 *
 * Deux taux d'occupation distincts (K.7) : tant que inventaire_quotidien n'est
 * pas alimente, ACT_TAUX_OCCUPATION reste vide et seul
 * ACT_TAUX_OCCUPATION_CONTRACTUALISE est calculable, sous son propre libelle.
 * Les deux blocs restent affiches, jamais confondus.
 */
export default async function Activite() {
  const [activite, evolution, offre] = await Promise.all([
    chargerActiviteNationale(),
    chargerActiviteEvolution(),
    chargerOffreNationale(),
  ]);

  if (!activite) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <EtatVide />
      </div>
    );
  }

  const statutDonnee = "OBSERVE";
  const serie = (extraire: (point: (typeof evolution)[number]) => number | null) =>
    evolution.map((point) => ({
      cle: point.mois,
      libelle: formatMois(point.mois),
      valeur: extraire(point),
    }));

  const assezDePoints = evolution.length > 1;
  /* K.7 : en dessous de trente reservations sur la periode, une courbe d'ADR
     est illisible et trompeuse. On ne la trace pas. */
  const evolutionLisible = assezDePoints && activite.actReservations >= 30 && !activite.actMasque;

  const PETITS_MULTIPLES = [
    {
      cle: "occupation",
      titre: t("module.m3.evolution_occupation"),
      points: serie((p) => p.actTauxOccupationContractualise),
      suffixe: " %",
      decimales: 1,
    },
    {
      cle: "adr",
      titre: t("module.m3.evolution_adr"),
      points: serie((p) => p.actAdr),
      suffixe: "",
      decimales: 0,
    },
    {
      cle: "revpar",
      titre: t("module.m3.evolution_revpar"),
      points: serie((p) => p.actRevpar),
      suffixe: "",
      decimales: 0,
    },
  ];

  const reservationsParMois = evolution.map((point) => ({
    cle: point.mois,
    libelle: formatMois(point.mois),
    valeur: point.actReservations,
  }));

  return (
    <>
      <BarreControle echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m3.code")}
          titre={t("module.m3.titre")}
          question={t("module.m3.question")}
        />

        {/* Avertissement de périmètre propre au module (document 9 quater, K.3) */}
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
          {t("module.m3.avertissement_perimetre", {
            n: formatNombre(activite.actEffectifPartenaires),
          })}
        </p>

        {/* Z1a, volumes observés */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("module.m3.volumes")} />
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "var(--space-5)" }}>
            <BlocIndicateurCle
              code="ACT_RESERVATIONS"
              valeur={activite.actReservations}
              calculeA={activite.calculeA}
              variante="volume"
              accent
              pied={
                assezDePoints ? (
                  <Sparkline
                    valeurs={evolution.map((p) => p.actReservations)}
                    libelle={t("module.m3.sparkline_reservations")}
                    largeur={180}
                  />
                ) : null
              }
            />
            <BlocIndicateurCle
              code="ACT_NUITEES"
              valeur={activite.actNuitees}
              calculeA={activite.calculeA}
              variante="volume"
              accent
              pied={
                assezDePoints ? (
                  <Sparkline
                    valeurs={evolution.map((p) => p.actNuitees)}
                    libelle={t("module.m3.sparkline_nuitees")}
                    largeur={180}
                  />
                ) : null
              }
            />
          </div>
        </section>

        {/* Z1b, performance hôtelière */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="02" titre={t("module.m3.performance")} />
          <div
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            style={{ gap: "var(--space-5)" }}
          >
            <BlocIndicateurCle
              code="ACT_TAUX_OCCUPATION_CONTRACTUALISE"
              valeur={activite.actTauxOccupationContractualise}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="ACT_TAUX_OCCUPATION"
              valeur={activite.actTauxOccupation}
              masque={activite.actMasque}
              libelleVide={t("state.vide.inventaire")}
              calculeA={activite.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="ACT_ADR"
              valeur={activite.actAdr}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
            />
            <BlocIndicateurCle
              code="ACT_REVPAR"
              valeur={activite.actRevpar}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
            />
            <BlocIndicateurCle
              code="ACT_ALOS"
              valeur={activite.actAlos}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
            />
            <BlocIndicateurCle
              code="ACT_LEAD_TIME"
              valeur={activite.actLeadTime}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
            />
            <BlocIndicateurCle
              code="ACT_TAUX_ANNULATION"
              valeur={activite.actTauxAnnulation}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
              variante="jauge"
            />
            <BlocIndicateurCle
              code="ACT_TAUX_NON_PRESENTATION"
              valeur={activite.actTauxNonPresentation}
              masque={activite.actMasque}
              libelleVide={t("state.vide.reservations")}
              calculeA={activite.calculeA}
              variante="jauge"
            />
          </div>
        </section>

        {/* Z2, évolution dans le temps, en petits multiples */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="03" titre={t("module.m3.evolution")} />

          {activite.actMasque ? (
            <Panneau titre={t("module.m3.evolution")}>
              <EtatMasque />
            </Panneau>
          ) : evolutionLisible ? (
            <>
              <div
                className="grid grid-cols-1 xl:grid-cols-3"
                style={{ gap: "var(--space-5)" }}
              >
                {PETITS_MULTIPLES.map((multiple) => (
                  <Panneau
                    key={multiple.cle}
                    titre={multiple.titre}
                    actions={<BadgeStatutDonnee code={statutDonnee} />}
                  >
                    <CourbeTemporelle
                      points={multiple.points}
                      suffixeValeur={multiple.suffixe}
                      decimales={multiple.decimales}
                      cadre={CADRE_COLONNE}
                      aire
                    />
                  </Panneau>
                ))}
              </div>

              <Panneau
                titre={t("module.m3.reservations_par_mois")}
                soustitre={t("module.m3.reservations_par_mois_aide")}
                actions={<BadgeStatutDonnee code={statutDonnee} />}
              >
                <BarresVerticales barres={reservationsParMois} />
              </Panneau>
            </>
          ) : (
            <Panneau titre={t("module.m3.evolution")}>
              <EtatVide libelle={t("state.vide.evolution")} />
            </Panneau>
          )}
        </section>

        {/* Z4, conversion. Jamais seule : K.7. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="04" titre={t("module.m3.conversion")} />
          <Panneau
            titre={t("module.m3.conversion_titre")}
            soustitre={t("module.m3.conversion_aide")}
            actions={<BadgeStatutDonnee code={statutDonnee} />}
          >
            {activite.actTauxConversion !== null ? (
              <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
                <BulletGraph
                  valeur={activite.actTauxConversion}
                  repere={offre?.offTauxCouverture ?? null}
                  maximum={Math.max(
                    10,
                    Math.ceil(
                      Math.max(activite.actTauxConversion, offre?.offTauxCouverture ?? 0) * 1.25
                    )
                  )}
                  libelleValeur={t("module.m3.libelle_conversion")}
                  libelleRepere={t("module.m3.libelle_couverture")}
                />
                <p
                  className="max-w-[80ch]"
                  style={{
                    fontSize: "var(--text-small)",
                    lineHeight: 1.55,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {t("module.m3.conversion_lecture")}
                </p>
              </div>
            ) : (
              <EtatVide libelle={t("state.vide.conversion")} />
            )}
          </Panneau>
        </section>
      </div>
    </>
  );
}
