import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { NatureEchecs } from "@/components/modules/tension/NatureEchecs";
import { t } from "@/lib/i18n";
import { chargerTensionNationale } from "@/lib/queries/tension";

/*
 * Ecran M4_TENSION (document 9, partie D). Z3 (carte de tension), Z4 (fenetres
 * de saturation) et Z5 (classement deficit) volontairement absentes : memes
 * raisons que sur les modules precedents (pas de bibliotheque de cartographie
 * retenue, pas de referentiel territorial charge pour donner du contenu a un
 * classement par territoire).
 *
 * Point signale a l'utilisateur : TEN_CAPACITE_MANQUANTE est calcule sans le
 * dedoublonnage par session prescrit par le document 4 (point ouvert non
 * tranche). A revoir des que cette regle sera arretee.
 */
export default async function Tension() {
  const tension = await chargerTensionNationale();

  if (!tension) {
    return <div className="p-8">{t("state.vide.defaut")}</div>;
  }

  const capaciteManquanteVide = tension.tenCapaciteManquanteEffectif < 10;

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m4.titre")}
      </h1>

      {/* Z1, blocs cles */}
      <div className="grid grid-cols-3 gap-3">
        <BlocIndicateurCle
          code="TEN_TAUX_INFRUCTUEUX"
          valeur={tension.tenTauxInfructueux}
          calculeA={tension.calculeA}
        />
        <BlocIndicateurCle
          code="TEN_CAPACITE_MANQUANTE"
          valeur={capaciteManquanteVide ? null : tension.tenCapaciteManquante}
          libelleVide={t("state.estimation_non_produite")}
          calculeA={tension.calculeA}
        />
        <BlocIndicateurCle
          code="TEN_INDICE_TENSION"
          valeur={tension.tenIndiceTension}
          libelleVide={t("state.tension_indefinie")}
          calculeA={tension.calculeA}
        />
      </div>

      {/* Z2, nature des recherches infructueuses */}
      <div className="flex flex-col gap-2">
        <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)", fontWeight: 600 }}>
          Nature des recherches infructueuses
        </h2>
        <NatureEchecs valeurs={tension.tenRepartitionEchec} />
      </div>
    </div>
  );
}
