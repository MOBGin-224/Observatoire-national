import { Panneau } from "@/components/chrome/Panneau";
import { CompteurSegmente } from "@/components/charts/CompteurSegmente";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { resoudreIndicateur } from "@/lib/indicators";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Z5, qualite de l'inventaire (document 9, B.5).
 *
 * Cette zone ne decrit pas le secteur, elle decrit ce que l'Observatoire sait du
 * secteur. C'est la zone qui fait la difference entre un tableau de bord et une
 * source citable : elle dit a un cadre institutionnel jusqu'ou il peut aller dans
 * l'usage des chiffres du dessus. D'ou la lecture en reglette et non en jauge :
 * on ne cherche pas une valeur, on cherche un niveau de confiance.
 *
 * Aucun signal orange ici. L'orange est reserve au deficit d'offre du module M4
 * (document 8, section 2.2) ; un ecart d'inventaire est un defaut de couverture
 * documentaire, pas une tension du marche.
 */
async function Mesure({
  code,
  valeur,
  forme,
}: {
  code: string;
  valeur: number | null;
  forme: "reglette" | "volume";
}) {
  const meta = await resoudreIndicateur(code);
  const libelle = meta?.libelleFr ?? code;
  const estPourcentage = meta?.unite === "pourcentage";

  return (
    <div className="flex flex-col justify-between" style={{ gap: "var(--space-4)" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <span className="etiquette" style={{ lineHeight: 1.35 }}>
          {libelle}
        </span>

        {valeur === null ? (
          <span style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
            {t("state.vide.evaluation")}
          </span>
        ) : (
          <span className="flex items-baseline" style={{ gap: "var(--space-2)" }}>
            <span className="valeur-cle chiffres-tabulaires" style={{ fontSize: "var(--text-display)" }}>
              {estPourcentage ? formatPourcentage(valeur, 0) : formatNombre(valeur)}
            </span>
            {forme === "reglette" && !estPourcentage && (
              <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
                {t("module.m1.sur_cent")}
              </span>
            )}
          </span>
        )}
      </div>

      {forme === "reglette" && valeur !== null ? (
        <CompteurSegmente valeur={valeur} libelle={`${libelle} : ${formatNombre(valeur)}`} />
      ) : (
        <p style={{ fontSize: "var(--text-meta)", lineHeight: 1.45, color: "var(--color-text-muted)" }}>
          {t("module.m1.ecart_admin_aide")}
        </p>
      )}
    </div>
  );
}

export async function QualiteInventaire({
  tauxVerification,
  completudeFiche,
  ecartListeAdmin,
  statutDonnee,
}: {
  tauxVerification: number | null;
  completudeFiche: number | null;
  ecartListeAdmin: number;
  statutDonnee: string;
}) {
  return (
    <Panneau
      titre={t("module.m1.qualite_inventaire")}
      soustitre={t("module.m1.qualite_inventaire_aide")}
      actions={<BadgeStatutDonnee code={statutDonnee} />}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ gap: "var(--space-8)" }}
      >
        <Mesure code="OFF_TAUX_VERIFICATION" valeur={tauxVerification} forme="reglette" />
        <Mesure code="OFF_COMPLETUDE_FICHE" valeur={completudeFiche} forme="reglette" />
        <Mesure code="OFF_ECART_LISTE_ADMIN" valeur={ecartListeAdmin} forme="volume" />
      </div>
    </Panneau>
  );
}
