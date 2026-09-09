import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { chargerPerimetre } from "@/lib/queries/perimetre";
import { t } from "@/lib/i18n";

/*
 * Ecran d'atterrissage M9_SYNTHESE apres connexion (document 11, section 1).
 * Provisoire : le contenu complet du module reste a construire. Le bloc
 * ci-dessous demontre la chaine complete (vue securisee -> masquage ->
 * dictionnaire d'indicateurs -> cinq etats) sur un indicateur reel.
 */
export default async function Synthese() {
  const perimetre = await chargerPerimetre();

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <p style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h2)" }}>
        {t("module.m9.titre")} : {t("module.m9.en_construction")}
      </p>

      <div className="grid max-w-xs">
        <BlocIndicateurCle
          code="OFF_ETAB_RECENSES"
          valeur={perimetre?.etablissementsRecenses ?? null}
          calculeA={perimetre?.calculeA ?? new Date().toISOString()}
        />
      </div>
    </div>
  );
}
