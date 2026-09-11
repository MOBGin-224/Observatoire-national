import { BarreControle, type EchelonTerritorial } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { BarresClassees } from "@/components/charts/BarresClassees";
import { LegendeDensite, TuilesTerritoriales } from "@/components/charts/TuilesTerritoriales";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { TableauRegional } from "@/components/modules/TableauRegional";
import { DecompositionCapacite } from "@/components/modules/evenementiel/DecompositionCapacite";
import { SelecteurFenetre, type EtatFenetre } from "@/components/modules/evenementiel/SelecteurFenetre";
import { TableauDemandes } from "@/components/modules/evenementiel/TableauDemandes";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { EtatVide } from "@/components/states/EtatVide";
import { EVENEMENTIEL } from "@/lib/config";
import { listerEnumeration } from "@/lib/enumerations";
import { formatDate, formatNombre } from "@/lib/format";
import { resoudreIndicateur } from "@/lib/indicators";
import { t } from "@/lib/i18n";
import {
  chargerEvenementsFuturs,
  chargerFenetre,
  type EvenementFutur,
} from "@/lib/queries/evenementiel";
import { chargerTerritoire } from "@/lib/queries/territoire";

type Recherche = { [cle: string]: string | string[] | undefined };

const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const JOUR_MS = 86_400_000;

const STYLE_AIDE = {
  fontSize: "var(--text-small)",
  lineHeight: 1.5,
  color: "var(--color-text-muted)",
} as const;

function premier(valeur: string | string[] | undefined): string | null {
  if (Array.isArray(valeur)) return valeur[0] ?? null;
  return valeur ?? null;
}

function liste(valeur: string | string[] | undefined): string[] {
  if (valeur === undefined) return [];
  return Array.isArray(valeur) ? valeur : [valeur];
}

function ajouterJours(iso: string, jours: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + jours);
  return date.toISOString().slice(0, 10);
}

function nuitsEntre(debut: string, fin: string): number {
  return Math.round((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${debut}T00:00:00Z`)) / JOUR_MS);
}

/*
 * Ecran M7_EVENEMENTIEL (document 9 ter, partie J ; libelles du document 16, D.4).
 *
 * Ce module raisonne en fenetre (J.3). La fenetre vient d'un evenement
 * enregistre, mode par defaut des qu'un evenement futur existe, ou de dates
 * libres (J.5). Sans evenement et sans dates, l'ecran s'arrete au selecteur :
 * aucune fenetre n'est inventee pour remplir les zones.
 *
 * Regles tenues ici, a ne pas "ameliorer" :
 *   la capacite mobilisable n'est jamais un total unique (J.10, J.11.1) ;
 *   --color-alert n'apparait que sur une tension superieure a cent pour cent
 *   (J.8, J.11.5 et 6) ;
 *   aucun nom ni contact d'etablissement, aucune action de reservation, de
 *   contact ou de dossier (J.10, J.11.8 et 9) : l'ecran mesure, il ne promet pas ;
 *   sous le seuil de la regle M1, la part partenaires n'est pas publiee, et
 *   avec elle tout ce qui en derive (document 7).
 */
export default async function Evenementiel({ searchParams }: { searchParams: Promise<Recherche> }) {
  const recherche = await searchParams;

  const [evenements, gammesReferentiel, paliers, indicateurMobilisable] = await Promise.all([
    chargerEvenementsFuturs(),
    listerEnumeration("GAMME"),
    listerEnumeration("PALIER_SALLE"),
    resoudreIndicateur("EVE_CAPACITE_MOBILISABLE"),
  ]);

  /* Dates libres si l'adresse le demande ou s'il n'existe aucun evenement futur ;
     evenement sinon, qui est le mode par defaut (J.5). */
  const mode: EtatFenetre["mode"] =
    premier(recherche.mode) !== "dates" && evenements.length > 0 ? "evenement" : "dates";

  const gammesValides = new Set(gammesReferentiel.map((gamme) => gamme.code));
  const gammes = liste(recherche.gamme).filter((code) => gammesValides.has(code));
  const salleDemandee = Number(premier(recherche.salle_min));
  const salleMin = (EVENEMENTIEL.capacitesSalleMinimales as readonly number[]).includes(salleDemandee)
    ? salleDemandee
    : null;

  let evenement: EvenementFutur | null = null;
  let debut: string | null = null;
  let fin: string | null = null;
  let codeTerritoire: string | null = null;

  if (mode === "evenement") {
    const cle = premier(recherche.evenement);
    evenement = evenements.find((e) => e.cle === cle) ?? evenements[0];
    debut = evenement.dateDebut;
    /* Une fenetre compte au moins une nuit, meme pour un evenement d'une journee. */
    fin =
      evenement.dateFin && evenement.dateFin > evenement.dateDebut
        ? evenement.dateFin
        : ajouterJours(evenement.dateDebut, 1);
    codeTerritoire = evenement.codeTerritoire;
  } else {
    const debutDemande = premier(recherche.debut);
    const finDemandee = premier(recherche.fin);
    debut = debutDemande && DATE_ISO.test(debutDemande) ? debutDemande : null;
    fin = finDemandee && DATE_ISO.test(finDemandee) ? finDemandee : null;
    codeTerritoire = premier(recherche.territoire);
  }

  const territoire = codeTerritoire ? await chargerTerritoire(codeTerritoire) : null;
  const fenetreValide = debut !== null && fin !== null && fin > debut;
  const fenetre = fenetreValide
    ? await chargerFenetre({
        debut: debut!,
        fin: fin!,
        territoire: territoire?.code ?? null,
        gammes,
        salleMin,
      })
    : null;

  const libelleTerritoire = territoire?.libelle ?? t("controle.national");
  const echelons: EchelonTerritorial[] = [{ code: "NATIONAL", libelle: t("controle.national") }];
  if (territoire) echelons.push({ code: territoire.code, libelle: territoire.libelle });

  /* Z1, bandeau de fenetre (document 16, D.4). */
  const bandeau = fenetreValide
    ? mode === "evenement" && evenement
      ? t("m7.fenetre.format", {
          evenement: evenement.libelle ?? t("state.non_renseigne"),
          territoire: libelleTerritoire,
          debut: formatDate(debut!),
          fin: formatDate(fin!),
          nuits: nuitsEntre(debut!, fin!),
        })
      : t("m7.fenetre.dates_libres", {
          territoire: libelleTerritoire,
          debut: formatDate(debut!),
          fin: formatDate(fin!),
          nuits: nuitsEntre(debut!, fin!),
        })
    : null;

  const etat: EtatFenetre = {
    mode,
    evenement: evenement?.cle ?? null,
    debut,
    fin,
    territoire: territoire?.code ?? null,
    gammes,
    salleMin,
  };

  const optionsEvenements = evenements.map((e) => ({
    cle: e.cle,
    libelle: `${e.libelle ?? t("state.non_renseigne")} · ${
      e.dateFin && e.dateFin !== e.dateDebut
        ? t("m7.z7.periode", { debut: formatDate(e.dateDebut), fin: formatDate(e.dateFin) })
        : formatDate(e.dateDebut)
    }`,
  }));

  return (
    <>
      <BarreControle echelons={echelons} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m7.code")}
          titre={t("module.m7.titre")}
          question={t("module.m7.question")}
        />

        {/* Mention obligatoire (document 16, D.4). */}
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
          {t("m7.avertissement")}
        </p>

        {/* Z1, fenetre analysee. */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("m7.z1.titre")} />
          <Panneau accent="bleu">
            <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
              {bandeau && (
                <p
                  className="chiffres-tabulaires"
                  style={{
                    fontFamily: "var(--font-titre)",
                    fontSize: "var(--text-h3)",
                    fontWeight: 600,
                    color: "var(--color-primary-700)",
                  }}
                >
                  {bandeau}
                </p>
              )}
              {evenements.length === 0 && <p style={STYLE_AIDE}>{t("m7.fenetre.aucune")}</p>}
              <SelecteurFenetre
                etat={etat}
                evenements={optionsEvenements}
                gammes={gammesReferentiel.map((gamme) => ({ cle: gamme.code, libelle: gamme.libelleFr }))}
                capacitesSalle={EVENEMENTIEL.capacitesSalleMinimales}
              />
            </div>
          </Panneau>
        </section>

        {fenetreValide && !fenetre && <EtatVide />}

        {fenetre && (
          <>
            {/* Z2, indicateurs cles. */}
            <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
              <TitreSection numero="02" titre={t("m7.z2.titre")} />
              <p style={STYLE_AIDE}>{t("m7.z2.aide")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-5)" }}>
                <BlocIndicateurCle
                  code="EVE_CAPACITE_MOBILISABLE"
                  valeur={fenetre.etablissements === 0 ? null : fenetre.capaciteMobilisable}
                  masque={fenetre.etablissements > 0 && fenetre.masquePartenaires}
                  libelleVide={t("state.vide.etablissements")}
                  niveauFiabilite={fenetre.fiabiliteCapacite ?? undefined}
                  calculeA={fenetre.calculeA}
                  variante="volume"
                  accent
                />
                <BlocIndicateurCle
                  code="EVE_CAPACITE_SALLES"
                  valeur={fenetre.etablissementsSalles > 0 ? fenetre.etablissementsSalles : null}
                  libelleVide={t(salleMin === null ? "state.vide.salles" : "state.vide.salles_critere")}
                  niveauFiabilite={fenetre.fiabiliteSalles ?? undefined}
                  calculeA={fenetre.calculeA}
                  variante="volume"
                  pied={
                    <span
                      className="chiffres-tabulaires"
                      style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
                    >
                      {t("m7.z6.col.places")} : {formatNombre(fenetre.placesSalles)}
                    </span>
                  }
                />
                <BlocIndicateurCle
                  code="EVE_TAUX_TENSION_EVENEMENT"
                  valeur={fenetre.tauxTension}
                  masque={fenetre.demandes > 0 && fenetre.masquePartenaires}
                  libelleVide={t("state.vide.demande_institutionnelle")}
                  niveauFiabilite={fenetre.fiabiliteTension ?? undefined}
                  calculeA={fenetre.calculeA}
                  variante="volume"
                  alerte={fenetre.tauxTension !== null && fenetre.tauxTension > 100}
                />
                <BlocIndicateurCle
                  code="INS_DEFICIT"
                  valeur={fenetre.deficit}
                  masque={fenetre.demandes > 0 && fenetre.masquePartenaires}
                  libelleVide={t("state.vide.demande_institutionnelle")}
                  niveauFiabilite={fenetre.fiabiliteTension ?? undefined}
                  calculeA={fenetre.calculeA}
                  variante="volume"
                />
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
              {/* Z3, decomposition obligatoire de la capacite mobilisable. */}
              <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                <TitreSection numero="03" titre={t("m7.z3.titre")} />
                <Panneau titre={t("m7.z3.titre")} soustitre={t("m7.z3.aide")} className="flex-1">
                  <DecompositionCapacite
                    capaciteRecensee={fenetre.capaciteRecensee}
                    partenairesDisponibles={fenetre.partenairesDisponibles}
                    recensesNonReservables={fenetre.recensesNonReservables}
                    dejaVendu={fenetre.dejaVendu}
                    masque={fenetre.masquePartenaires}
                  />
                </Panneau>
              </section>

              {/* Z4, capacite mobilisable par territoire enfant. */}
              <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                <TitreSection numero="04" titre={t("m7.z4.titre")} />
                <Panneau
                  titre={t("m7.z4.titre")}
                  pied={
                    fenetre.territoires.length > 0 ? (
                      <LegendeDensite
                        cellules={fenetre.territoires.map((c) => ({
                          code: c.code,
                          libelle: c.libelle,
                          valeur: c.mobilisable ?? 0,
                          sansDonnee: c.mobilisable === null,
                        }))}
                        etiquette={indicateurMobilisable?.libelleFr}
                        libelleSansDonnee={fenetre.etablissements === 0 ? t("carte.aucune_capacite") : undefined}
                      />
                    ) : undefined
                  }
                  className="flex-1"
                >
                  {fenetre.territoires.length === 0 ? (
                    <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
                      {t("state.vide.subdivision")}
                    </p>
                  ) : (
                    <TuilesTerritoriales
                      cellules={fenetre.territoires.map((c) => ({
                        code: c.code,
                        libelle: c.libelle,
                        valeur: c.mobilisable ?? 0,
                        sansDonnee: c.mobilisable === null,
                        texteSansDonnee:
                          c.masque && c.etablissements > 0 ? t("state.masque_court") : t("carte.aucune_capacite"),
                      }))}
                    />
                  )}
                </Panneau>
              </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
              {/* Z5, capacite par gamme tarifaire. */}
              <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                <TitreSection numero="05" titre={t("m7.z5.titre")} />
                <Panneau
                  titre={t("m7.z5.titre")}
                  soustitre={t("m7.z5.aide")}
                  actions={<BadgeStatutDonnee code="RECENSE" />}
                  className="flex-1"
                >
                  {fenetre.gammes.length === 0 ? (
                    <EtatVide libelle={t("state.vide.repartition")} />
                  ) : (
                    <BarresClassees
                      parts={fenetre.gammes.map((gamme) => ({
                        code: gamme.code,
                        libelle:
                          gammesReferentiel.find((valeur) => valeur.code === gamme.code)?.libelleFr ?? gamme.code,
                        valeur: gamme.capacite,
                      }))}
                      formaterValeur={(valeur) => formatNombre(valeur)}
                      monochrome
                    />
                  )}
                </Panneau>
              </section>

              {/* Z6, salles de reunion par palier de capacite. */}
              <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                <TitreSection numero="06" titre={t("m7.z6.titre")} />
                <Panneau
                  titre={t("m7.z6.titre")}
                  soustitre={t("m7.z6.aide")}
                  actions={<BadgeStatutDonnee code="RECENSE" />}
                  className="flex-1"
                >
                  {fenetre.paliers.length === 0 ? (
                    <EtatVide
                      libelle={t(salleMin === null ? "state.vide.salles" : "state.vide.salles_critere")}
                    />
                  ) : (
                    <TableauRegional
                      enTetePremiereColonne={t("m7.z6.col.palier")}
                      colonnes={[
                        { libelle: t("m7.z6.col.etablissements"), forme: "volume" },
                        { libelle: t("m7.z6.col.places"), forme: "volume" },
                      ]}
                      lignes={paliers
                        .filter((palier) => fenetre.paliers.some((p) => p.palier === palier.code))
                        .map((palier) => {
                          const valeurs = fenetre.paliers.find((p) => p.palier === palier.code)!;
                          return {
                            code: palier.code,
                            libelle: palier.libelleFr,
                            valeurs: [valeurs.etablissements, valeurs.places],
                          };
                        })}
                    />
                  )}
                </Panneau>
              </section>
            </div>

            {/* Z7, demandes institutionnelles sur la fenetre. */}
            <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
              <TitreSection numero="07" titre={t("m7.z7.titre")} />
              <Panneau
                titre={t("m7.z7.titre")}
                soustitre={t("m7.z7.aide")}
                actions={<BadgeStatutDonnee code="DECLARE" />}
              >
                <TableauDemandes lignes={fenetre.listeDemandes} />
              </Panneau>
            </section>
          </>
        )}
      </div>
    </>
  );
}
