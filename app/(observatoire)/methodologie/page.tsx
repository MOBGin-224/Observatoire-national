import { BarreControle } from "@/components/chrome/BarreControle";
import { EnTeteModule } from "@/components/chrome/EnTeteModule";
import { Panneau } from "@/components/chrome/Panneau";
import { TitreSection } from "@/components/chrome/TitreSection";
import { RechercheIndicateurs } from "@/components/modules/methodologie/RechercheIndicateurs";
import { listerEnumeration } from "@/lib/enumerations";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";
import { chargerTousLesIndicateurs } from "@/lib/queries/methodologie";

/*
 * Ecran M10_METHODO (document 9 bis, partie G). Module documentaire : ne
 * restitue jamais de donnee chiffree du secteur (G.8). Fonctionne des le
 * premier jour, base de faits vide ou non (G.9, critere 1) puisqu'il ne lit
 * que la table indicateur.
 *
 * Ecran entierement textuel, donc entierement porte par la mise en page. Trois
 * partis pris :
 *   1. Les quatre textes de cadre deviennent quatre panneaux d'egale importance,
 *      lisibles en diagonale, plutot qu'une colonne de paragraphes.
 *   2. Les trois regles de masquage prennent leur code en tete de bloc, en gros.
 *      Ce sont les references que l'on cite en reunion : elles doivent se
 *      retrouver sans lire.
 *   3. Les survols sont volontairement tres retenus : le fond se teinte d'un cran,
 *      le filet se precise. Aucun deplacement, aucune ombre. Sur un ecran de
 *      documentation que l'on parcourt longuement, un survol appuye fatigue.
 *
 * Reduction assumee par rapport a la fiche complete : G.7 mentionne un acces
 * contextuel depuis chaque indicateur affiche ailleurs, avec retour au meme
 * perimetre. EtatDonnee pointe deja vers /methodologie (sans ancre par
 * indicateur) ; l'ancrage direct sur un indicateur precis et le retour au
 * perimetre d'origine restent a construire.
 */
export default async function Methodologie() {
  const [indicateurs, statuts] = await Promise.all([
    chargerTousLesIndicateurs(),
    listerEnumeration("STATUT_DONNEE"),
  ]);
  const libellesStatut = Object.fromEntries(statuts.map((s) => [s.code, s.libelleFr]));

  const CADRE = [
    "principes_generaux",
    "sources_canaux",
    "referentiel_territorial",
    "limites_connues",
  ] as const;

  const MASQUAGE = ["m0", "m1", "m2"] as const;

  return (
    <>
      <BarreControle intitule={t("module.m10.court")} />

      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: "1680px", gap: "var(--space-8)", padding: "var(--space-8)" }}
      >
        <EnTeteModule
          code={t("module.m10.code")}
          titre={t("module.m10.titre")}
          question={t("module.m10.question")}
        />

        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="01" titre={t("methodologie.section.cadre")} />
          <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-5)" }}>
            {CADRE.map((cle) => (
              <Panneau key={cle} titre={t(`methodologie.${cle}.titre`)} className="carte-douce">
                <p
                  className="max-w-[70ch]"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: 1.6,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {t(`methodologie.${cle}.texte`)}
                </p>
              </Panneau>
            ))}
          </div>
        </section>

        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="02" titre={t("methodologie.section.masquage")} />
          <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
            {t("methodologie.regles_masquage.aide")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-5)" }}>
            {MASQUAGE.map((regle) => (
              <article
                key={regle}
                className="surface surface-accent carte-douce flex flex-col"
                style={{ gap: "var(--space-3)", padding: "var(--space-5)" }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-titre)",
                    fontSize: "var(--text-h2)",
                    fontWeight: 700,
                    letterSpacing: "var(--tracking-titre)",
                    color: "var(--color-primary-700)",
                  }}
                >
                  {t(`methodologie.regles_masquage.${regle}_titre`)}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-small)",
                    lineHeight: 1.6,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {t(`methodologie.regles_masquage.${regle}_corps`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <TitreSection numero="03" titre={t("methodologie.section.dictionnaire")} />
          <Panneau
            titre={t("methodologie.sommaire.indicateurs_famille")}
            soustitre={t("methodologie.dictionnaire_aide", {
              n: formatNombre(indicateurs.length),
            })}
          >
            <RechercheIndicateurs indicateurs={indicateurs} libellesStatut={libellesStatut} />
          </Panneau>
        </section>
      </div>
    </>
  );
}
