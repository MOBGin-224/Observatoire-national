import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { NatureEchecs } from "@/components/modules/tension/NatureEchecs";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatVide } from "@/components/states/EtatVide";
import { t } from "@/lib/i18n";
import { chargerTensionNationale } from "@/lib/queries/tension";

/*
 * Ecran M4_TENSION (document 9, partie D).
 *
 * Zones absentes, pour les memes raisons que sur les modules deja refondus :
 * Z3 (carte de tension), Z4 (fenetres de saturation) et Z5 (classement des
 * territoires en deficit) supposent toutes un agregat par territoire. Seule
 * mv_tension_national existe en base ; ouvrir ces trois zones demande de creer
 * des vues, ce que la consigne en cours interdit sans accord explicite. Z5
 * demande en outre les colonnes d'accessibilite de territoire_accessibilite,
 * imposees par D.7, sans lesquelles le classement "produit un ordre que
 * personne ne sait interpreter".
 *
 * Deux regles du document 9 que cet ecran applique et qu'il ne faut pas
 * "ameliorer" plus tard :
 *
 *   D.8, point a ne pas contourner : au lancement, TEN_TAUX_INFRUCTUEUX sera
 *   tres eleve. Il s'affiche seul, sans avertissement, sans phrase d'excuse et
 *   sans lissage. C'est la demonstration du probleme, pas un incident.
 *
 *   D.7, indice de tension indefini : sur un territoire a capacite reservable
 *   nulle le rapport n'existe pas. Le bloc affiche le message prevu, jamais un
 *   infini ni une erreur.
 *
 * Dette signalee de longue date : TEN_CAPACITE_MANQUANTE est calcule sans le
 * dedoublonnage par session prescrit par le document 4 (point ouvert jamais
 * tranche). Le nombre affiche sera a revoir des que la regle sera arretee.
 */
export default async function Tension() {
  const tension = await chargerTensionNationale();

  if (!tension) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <EtatVide />
      </div>
    );
  }

  /* D.8 : en dessous de dix recherches en echec, l'estimation n'est pas
     produite. Le seuil se lit sur l'effectif, pas sur la valeur. */
  const capaciteManquanteVide = tension.tenCapaciteManquanteEffectif < 10;

  return (
    <>
      <BarreControle echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m4.code")}
          titre={t("module.m4.titre")}
          question={t("module.m4.question")}
        />

        {/* Z1, blocs cles */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("module.m4.mesures")} />
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-5)" }}>
            <BlocIndicateurCle
              code="TEN_TAUX_INFRUCTUEUX"
              valeur={tension.tenTauxInfructueux}
              libelleVide={t("state.vide.recherches")}
              calculeA={tension.calculeA}
              niveauFiabilite={tension.niveauFiabilite ?? undefined}
              variante="jauge"
              accent
            />
            <BlocIndicateurCle
              code="TEN_CAPACITE_MANQUANTE"
              valeur={capaciteManquanteVide ? null : tension.tenCapaciteManquante}
              libelleVide={t("state.estimation_non_produite")}
              calculeA={tension.calculeA}
              niveauFiabilite={tension.tenCapaciteManquanteFiabilite ?? undefined}
              variante="volume"
              accent
            />
            <BlocIndicateurCle
              code="TEN_INDICE_TENSION"
              valeur={tension.tenIndiceTension}
              libelleVide={t("state.tension_indefinie")}
              calculeA={tension.calculeA}
              niveauFiabilite={tension.tenIndiceFiabilite ?? undefined}
              variante="volume"
              accent
            />
          </div>
        </section>

        {/* Z2, nature des recherches infructueuses. La zone la plus importante
            de l'outil (D.7) : elle nomme ce qui manque et qui doit agir. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="02" titre={t("module.m4.nature")} />
          <Panneau
            titre={t("module.m4.nature")}
            soustitre={t("module.m4.nature_aide")}
            actions={<BadgeStatutDonnee code="EXPRIME" />}
            pied={
              <p
                className="max-w-[80ch]"
                style={{
                  fontSize: "var(--text-small)",
                  lineHeight: 1.55,
                  color: "var(--color-text-secondary)",
                }}
              >
                {t("module.m4.lecture")}
              </p>
            }
          >
            <NatureEchecs valeurs={tension.tenRepartitionEchec} />
          </Panneau>
        </section>
      </div>
    </>
  );
}
