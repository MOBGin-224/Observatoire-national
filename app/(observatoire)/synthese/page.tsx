import Link from "next/link";
import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { TitreSection } from "@/components/chrome/TitreSection";
import { Panneau } from "@/components/chrome/Panneau";
import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { TuilesTerritoriales } from "@/components/charts/TuilesTerritoriales";
import { CourbeTemporelle } from "@/components/charts/CourbeTemporelle";
import { NatureEchecs } from "@/components/modules/tension/NatureEchecs";
import { EtatVide } from "@/components/states/EtatVide";
import { chargerMonCompte, chargerMesModules } from "@/lib/queries/compte";
import { chargerValeursSynthese } from "@/lib/queries/synthese";
import { chargerOffreRegions } from "@/lib/queries/offre";
import { chargerDemandeSaisonnalite } from "@/lib/queries/demande";
import { chargerTensionNationale } from "@/lib/queries/tension";
import { chargerTerritoiresEnfants } from "@/lib/queries/territoire";
import { compterIndicateursParModule } from "@/lib/queries/methodologie";
import { blocsDuProfil, varianteDuBloc } from "@/lib/synthese/blocs";
import { t } from "@/lib/i18n";

/*
 * M9_SYNTHESE, document 9 bis partie F.
 *
 * Cet ecran ne produit aucun indicateur qui lui soit propre : il relit les
 * memes vues d'acces que les modules d'origine et les rassemble. C'est ce qui
 * tient le critere F.10.3, bloquant : une valeur relevee ici est identique a
 * celle de son module, etat de masquage compris.
 *
 * C'est l'ecran qui sera projete dans des reunions ou Simandou Sejour n'est pas
 * presente, et chaque projection porte le nom de l'entreprise. Il est donc le
 * plus expose et le plus soigne.
 *
 * Phase 1 (document 15, section 4) : niveau national, sans selecteur de periode
 * ni de niveau geographique. La barre de controle porte la mention "Vue
 * nationale" pour qu'une absence de selecteur se lise comme une decision et non
 * comme un defaut d'affichage.
 *
 * Aucun texte interpretatif nulle part sur cet ecran (F.8) : pas de "la demande
 * progresse", pas de "le deficit se creuse". Une phrase generee reprise dans un
 * communique officiel engagerait l'entreprise sur une lecture qu'elle n'a pas
 * validee.
 */

/* Ordre d'exposition des cartes d'acces, celui de la navigation laterale. */
const ORDRE_MODULES = [
  "M1_OFFRE",
  "M2_DEMANDE",
  "M3_ACTIVITE",
  "M4_TENSION",
  "M5_CONFORMITE",
  "M6_MATURITE",
  "M7_EVENEMENTIEL",
  "M8_RETOMBEES",
  "M10_METHODO",
  "M11_ADMIN",
] as const;

const CLE_MODULE: Record<string, string> = {
  M1_OFFRE: "m1",
  M2_DEMANDE: "m2",
  M3_ACTIVITE: "m3",
  M4_TENSION: "m4",
  M5_CONFORMITE: "m5",
  M6_MATURITE: "m6",
  M7_EVENEMENTIEL: "m7",
  M8_RETOMBEES: "m8",
  M10_METHODO: "m10",
  M11_ADMIN: "m11",
};

const ROUTE_MODULE: Record<string, string> = {
  M1_OFFRE: "/offre",
  M2_DEMANDE: "/demande",
  M3_ACTIVITE: "/activite",
  M4_TENSION: "/tension",
  M5_CONFORMITE: "/conformite",
  M6_MATURITE: "/maturite",
  M7_EVENEMENTIEL: "/evenementiel",
  M8_RETOMBEES: "/retombees",
  M10_METHODO: "/methodologie",
  M11_ADMIN: "/administration",
};

export default async function Synthese() {
  const compte = await chargerMonCompte();
  if (!compte) return <EtatVide />;

  const [valeurs, modulesActifs, regions, territoires, saisonnalite, tension, nbIndicateurs] =
    await Promise.all([
      chargerValeursSynthese(),
      chargerMesModules(),
      chargerOffreRegions(),
      chargerTerritoiresEnfants(null, "REGION"),
      chargerDemandeSaisonnalite(),
      chargerTensionNationale(),
      compterIndicateursParModule(),
    ]);

  const blocs = blocsDuProfil(compte.profil);

  /* Z2 : densite d'etablissements recenses par region. Repli sur les tuiles,
     l'application devant fonctionner sans aucun contour (document 3, point 3). */
  const libelleTerritoire = new Map(territoires.map((ter) => [ter.code, ter.libelle]));
  const cellules = regions
    .filter((region) => region.codeTerritoire !== null)
    .map((region) => ({
      code: region.codeTerritoire as string,
      libelle: libelleTerritoire.get(region.codeTerritoire as string) ?? (region.codeTerritoire as string),
      valeur: region.offEtabRecenses,
    }))
    .sort((a, b) => b.valeur - a.valeur);

  const pointsRecherches = saisonnalite.map((point) => ({
    cle: point.mois,
    libelle: point.mois,
    valeur: point.demVolumeRecherches,
  }));

  return (
    <>
      <BarreControle
        echelons={[{ code: "NATIONAL", libelle: t("controle.national") }]}
        actions={<span className="etiquette">{t("controle.vue_nationale")}</span>}
      />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m9.code")}
          titre={t("module.m9.titre")}
          question={t("module.m9.description")}
        />

        {/* Z1. Huit blocs, six pour le profil evenementiel. Jamais complete
            artificiellement jusqu'a huit (critere F.10.4). */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("module.m9.blocs_cles")} />
          <div
            /* Document 9 bis, F.5 : huit sur une ligne a 1440 px, quatre par
               ligne a 1024 px. Le palier de 1440 n'existe pas dans l'echelle
               par defaut, il est donc pose explicitement : a 1280 px les huit
               blocs se serrent au point de couper les libelles. */
            className="grid grid-cols-2 md:grid-cols-4 min-[1440px]:grid-cols-8"
            style={{ gap: "var(--space-4)" }}
          >
            {blocs.map((code) => {
              const bloc = valeurs.parCode[code];
              return (
                <BlocIndicateurCle
                  key={code}
                  code={code}
                  valeur={bloc?.valeur ?? null}
                  masque={bloc?.masque ?? false}
                  niveauFiabilite={bloc?.niveauFiabilite ?? undefined}
                  calculeA={valeurs.calculeA}
                  variante={varianteDuBloc(code)}
                />
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-8)" }}>
          {/* Z2. Densite d'etablissements recenses par region. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="02" titre={t("module.m9.carte")} />
            <Panneau titre={t("module.m9.carte")} soustitre={t("module.m9.carte_aide")}>
              {cellules.length > 0 ? <TuilesTerritoriales cellules={cellules} /> : <EtatVide />}
            </Panneau>
          </section>

          {/* Z3. Deux graphiques empiles : evolution des recherches, puis
              nature des echecs. */}
          <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <TitreSection numero="03" titre={t("module.m9.evolution")} />
            <Panneau
              titre={t("module.m9.evolution")}
              soustitre={t("module.m2.saisonnalite_aide")}
            >
              {pointsRecherches.length > 0 ? (
                <CourbeTemporelle points={pointsRecherches} aire />
              ) : (
                <EtatVide />
              )}
            </Panneau>
            <Panneau titre={t("module.m4.nature")} soustitre={t("module.m4.nature_aide")}>
              {tension ? <NatureEchecs valeurs={tension.tenRepartitionEchec} /> : <EtatVide />}
            </Panneau>
          </section>
        </div>

        {/* Z4. Cartes d'acces. Les modules non autorises pour le profil
            n'apparaissent jamais (critere F.10.5). */}
        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="04" titre={t("module.m9.acces")} />
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            style={{ gap: "var(--space-4)" }}
          >
            {ORDRE_MODULES.filter((code) => modulesActifs.includes(code)).map((code) => {
              const cle = CLE_MODULE[code];
              const nombre = nbIndicateurs[code] ?? 0;
              return (
                <Link
                  key={code}
                  href={ROUTE_MODULE[code]}
                  className="carte-douce flex flex-col rounded"
                  style={{
                    gap: "var(--space-2)",
                    padding: "var(--space-5)",
                    backgroundColor: "var(--color-bg-panel)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-titre)",
                      fontSize: "var(--text-h3)",
                      fontWeight: 600,
                      color: "var(--color-primary-700)",
                    }}
                  >
                    {t(`module.${cle}.titre`)}
                  </span>
                  <span
                    className="max-w-[46ch]"
                    style={{
                      fontSize: "var(--text-small)",
                      lineHeight: 1.5,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {t(`module.${cle}.description`)}
                  </span>
                  {nombre > 0 && (
                    <span className="etiquette" style={{ color: "var(--color-text-muted)" }}>
                      {t("methodologie.nb_indicateurs", { n: nombre })}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
