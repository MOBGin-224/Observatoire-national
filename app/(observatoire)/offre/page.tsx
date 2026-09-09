import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { PartDuParc } from "@/components/modules/offre/PartDuParc";
import { QualiteInventaire } from "@/components/modules/offre/QualiteInventaire";
import { RepartitionTerritoriale } from "@/components/modules/offre/RepartitionTerritoriale";
import { StructureOffre } from "@/components/modules/offre/StructureOffre";
import { TableauTerritorial } from "@/components/modules/offre/TableauTerritorial";
import { EtatVide } from "@/components/states/EtatVide";
import { t } from "@/lib/i18n";
import { chargerOffreNationale, chargerOffreRegions } from "@/lib/queries/offre";
import { chargerTerritoiresEnfants } from "@/lib/queries/territoire";

/* Les cinq taux de la zone Z1, lus en jauge sur une echelle fixe de zero a cent. */
const RATIOS = [
  "OFF_TAUX_COUVERTURE",
  "OFF_TAUX_NUMERISATION",
  "OFF_TAUX_RESERVABILITE",
  "OFF_TAUX_VERIFICATION",
  "OFF_COMPLETUDE_FICHE",
] as const;

/*
 * Ecran M1_OFFRE (document 9, partie B).
 *
 * Les cinq zones de la maquette B.5 sont presentes. Z1 est scindee en deux
 * lignes de lecture, trois volumes puis cinq ratios : ce sont les huit memes
 * indicateurs, mais un volume et un taux ne se lisent pas de la meme facon, et
 * les aligner sur une seule rangee de huit blocs identiques obligeait l'oeil a
 * refaire le tri a chaque consultation.
 *
 * Z2 se rabat sur une grille de tuiles tant qu'aucun contour du decoupage refondu
 * en aout 2026 n'est disponible (document 8, section 5.7 : l'ecran doit rester
 * utilisable sans aucun contour, ce qui est la situation du lancement).
 *
 * Reste a construire : les trois filtres de module du document 9, B.6 (typologie,
 * gamme, statut de relation). Ils supposent une agregation filtrable cote base ;
 * les vues materialisees actuelles sont pre-agregees au niveau territorial.
 */
export default async function Offre() {
  const [national, regions, territoires] = await Promise.all([
    chargerOffreNationale(),
    chargerOffreRegions(),
    chargerTerritoiresEnfants(null, "REGION"),
  ]);

  if (!national) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <EtatVide />
      </div>
    );
  }

  /* Le referentiel donne la liste complete des territoires, la vue donne leurs
     valeurs. Un territoire sans etablissement reste dans le tableau, a zero
     (document 9, critere d'acceptation B.10.1). */
  const parCode = new Map(regions.map((ligne) => [ligne.codeTerritoire, ligne]));
  const lignesTerritoriales = territoires.map((territoire) => {
    const valeurs = parCode.get(territoire.code);
    return {
      code: territoire.code,
      libelle: territoire.libelle,
      etablissements: valeurs?.offEtabRecenses ?? 0,
      capacite: valeurs?.offCapaciteRecensee ?? 0,
      partenaires: valeurs?.offEtabPartenaires ?? 0,
      couverture: valeurs?.offTauxCouverture ?? null,
      numerisation: valeurs?.offTauxNumerisation ?? null,
      reservabilite: valeurs?.offTauxReservabilite ?? null,
      verification: valeurs?.offTauxVerification ?? null,
    };
  });

  const statutDonnee = "RECENSE";
  const valeursRatios: Record<string, number | null> = {
    OFF_TAUX_COUVERTURE: national.offTauxCouverture,
    OFF_TAUX_NUMERISATION: national.offTauxNumerisation,
    OFF_TAUX_RESERVABILITE: national.offTauxReservabilite,
    OFF_TAUX_VERIFICATION: national.offTauxVerification,
    OFF_COMPLETUDE_FICHE: national.offCompletudeFiche,
  };

  return (
    <>
      <BarreControle
        echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]}
      />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m1.code")}
          titre={t("module.m1.titre")}
          question={t("module.m1.question")}
        />

        {/* Z1a, volumes recenses */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("module.m1.volumes")} />
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-5)" }}>
            <BlocIndicateurCle
              code="OFF_ETAB_RECENSES"
              valeur={national.offEtabRecenses}
              calculeA={national.calculeA}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              variante="volume"
              accent
            />
            <BlocIndicateurCle
              code="OFF_CAPACITE_RECENSEE"
              valeur={national.offCapaciteRecensee}
              calculeA={national.calculeA}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              variante="volume"
              accent
            />
            <BlocIndicateurCle
              code="OFF_ETAB_PARTENAIRES"
              valeur={national.offEtabPartenaires}
              calculeA={national.calculeA}
              niveauFiabilite={national.niveauFiabilite ?? undefined}
              variante="volume"
              accent
              pied={
                <PartDuParc
                  partenaires={national.offEtabPartenaires}
                  recenses={national.offEtabRecenses}
                />
              }
            />
          </div>
        </section>

        {/* Z1b, ratios d'inventaire */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="02" titre={t("module.m1.ratios")} />
          <div
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
            style={{ gap: "var(--space-5)" }}
          >
            {RATIOS.map((code) => (
              <BlocIndicateurCle
                key={code}
                code={code}
                valeur={valeursRatios[code]}
                calculeA={national.calculeA}
                niveauFiabilite={national.niveauFiabilite ?? undefined}
                variante="jauge"
                libelleVide={t("state.vide.etablissements")}
              />
            ))}
          </div>
        </section>

        {/* Z3, structure de l'offre */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="03" titre={t("module.m1.structure")} />
          <StructureOffre
            typologie={national.offRepartitionTypologie}
            gamme={national.offRepartitionGamme}
            statutDonnee={statutDonnee}
            niveauFiabilite={national.niveauFiabilite}
          />
        </section>

        {/* Z2 et Z4, lecture territoriale */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="04" titre={t("module.m1.territoires")} />
          <RepartitionTerritoriale
            cellules={lignesTerritoriales.map((ligne) => ({
              code: ligne.code,
              libelle: ligne.libelle,
              etablissements: ligne.etablissements,
              capacite: ligne.capacite,
            }))}
            statutDonnee={statutDonnee}
          />
          <Panneau
            titre={t("module.m1.tableau_territorial")}
            soustitre={t("module.m1.tableau_territorial_aide")}
          >
            <TableauTerritorial lignes={lignesTerritoriales} />
          </Panneau>
        </section>

        {/* Z5, qualite de l'inventaire */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="05" titre={t("module.m1.qualite_inventaire")} />
          <QualiteInventaire
            tauxVerification={national.offTauxVerification}
            completudeFiche={national.offCompletudeFiche}
            ecartListeAdmin={national.offEcartListeAdmin}
            statutDonnee={statutDonnee}
          />
        </section>
      </div>
    </>
  );
}
