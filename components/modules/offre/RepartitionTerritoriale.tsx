import { Panneau } from "@/components/chrome/Panneau";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { LegendeDensite, TuilesTerritoriales } from "@/components/charts/TuilesTerritoriales";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

export type CelluleOffre = {
  code: string;
  libelle: string;
  etablissements: number;
  capacite: number;
};

/*
 * Z2, répartition territoriale de l'offre (document 9, B.5 et B.7).
 *
 * La grille de tuiles et sa légende sont mutualisées dans components/charts :
 * le module M2 s'en sert pour les destinations recherchées, avec le même
 * vocabulaire visuel. Ce composant ne fait plus que traduire le vocabulaire
 * du module en cellules.
 */
export async function RepartitionTerritoriale({
  cellules,
  statutDonnee,
}: {
  cellules: CelluleOffre[];
  statutDonnee: string;
}) {
  const tuiles = cellules.map((cellule) => ({
    code: cellule.code,
    libelle: cellule.libelle,
    valeur: cellule.etablissements,
    mention: t("module.m1.unites", { n: formatNombre(cellule.capacite) }),
  }));

  return (
    <Panneau
      titre={t("module.m1.territoires_repartition")}
      soustitre={t("module.m1.territoires_repartition_aide")}
      actions={<BadgeStatutDonnee code={statutDonnee} />}
      pied={<LegendeDensite cellules={tuiles} />}
    >
      {cellules.length === 0 ? (
        <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
          {t("state.vide.subdivision")}
        </p>
      ) : (
        <TuilesTerritoriales cellules={tuiles} />
      )}
    </Panneau>
  );
}
