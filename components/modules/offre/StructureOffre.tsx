import { Panneau } from "@/components/chrome/Panneau";
import { Anneau } from "@/components/charts/Anneau";
import { BarreRepartition } from "@/components/charts/BarreRepartition";
import { EtatVide } from "@/components/states/EtatVide";
import { BadgeStatutDonnee } from "@/components/states/BadgeStatutDonnee";
import { BadgeFiabilite } from "@/components/states/BadgeFiabilite";
import type { Part } from "@/components/charts/geometrie";
import { listerEnumeration } from "@/lib/enumerations";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Z3, structure de l'offre (document 9, B.5).
 *
 * Deux repartitions, deux formes, parce que les deux variables ne se lisent pas
 * de la meme facon :
 *
 *   typologie  variable nominale, sans ordre. Anneau ordonne du plus gros au plus
 *              petit, effectif total au centre. Le total au centre est ce qui
 *              distingue cet anneau d'un camembert : la part n'est jamais donnee
 *              sans l'effectif sur lequel elle porte.
 *
 *   gamme      variable ordonnee, de l'economique au haut de gamme. Barre a cent
 *              pour cent dont les paliers suivent l'ordre de la variable et non
 *              l'ordre des effectifs, ce qui rend deux territoires comparables
 *              d'un coup d'oeil.
 *
 * Le document 8 interdisait l'anneau au motif qu'on ne compare pas des categories
 * dans un disque d'un ecran a l'autre. La reserve est levee ici par la legende
 * chiffree et le total central, qui rendent la lecture exacte sans mesurer un angle.
 * Revision du 2026-09-08, tracee en section 6 du document 8.
 */
function versParts(
  valeurs: Record<string, number>,
  libelles: { code: string; libelleFr: string }[],
  garderZeros: boolean
): Part[] {
  return libelles
    .map((l) => ({ code: l.code, libelle: l.libelleFr, valeur: valeurs[l.code] ?? 0 }))
    .filter((p) => garderZeros || p.valeur > 0);
}

async function Provenance({
  statutDonnee,
  niveauFiabilite,
}: {
  statutDonnee: string;
  niveauFiabilite: string | null;
}) {
  return (
    <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
      <BadgeStatutDonnee code={statutDonnee} />
      {niveauFiabilite && (
        <>
          <span aria-hidden="true" style={{ color: "var(--color-border-strong)" }}>
            &middot;
          </span>
          <BadgeFiabilite code={niveauFiabilite} />
        </>
      )}
    </div>
  );
}

export async function StructureOffre({
  typologie,
  gamme,
  statutDonnee,
  niveauFiabilite,
}: {
  typologie: Record<string, number>;
  gamme: Record<string, number>;
  statutDonnee: string;
  niveauFiabilite: string | null;
}) {
  const [valeursTypologie, valeursGamme] = await Promise.all([
    listerEnumeration("TYPOLOGIE"),
    listerEnumeration("GAMME"),
  ]);

  /* La typologie ne montre que les categories presentes : un secteur a zero n'a
     pas de surface. La gamme les garde toutes, pour que la legende reste
     identique d'un territoire a l'autre. */
  const partsTypologie = versParts(typologie, valeursTypologie, false);
  const partsGamme = versParts(gamme, valeursGamme, true);
  const totalTypologie = partsTypologie.reduce((s, p) => s + p.valeur, 0);
  const totalGamme = partsGamme.reduce((s, p) => s + p.valeur, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-5)" }}>
      <Panneau
        titre={t("module.m1.repartition_typologie")}
        soustitre={t("module.m1.repartition_typologie_aide")}
        actions={<Provenance statutDonnee={statutDonnee} niveauFiabilite={niveauFiabilite} />}
      >
        {totalTypologie > 0 ? (
          <Anneau
            parts={partsTypologie}
            total={formatNombre(totalTypologie)}
            legendeCentre={t("module.m1.legende_etablissements")}
          />
        ) : (
          <EtatVide libelle={t("state.vide.repartition")} />
        )}
      </Panneau>

      <Panneau
        titre={t("module.m1.repartition_gamme")}
        soustitre={t("module.m1.repartition_gamme_aide")}
        actions={<Provenance statutDonnee={statutDonnee} niveauFiabilite={niveauFiabilite} />}
      >
        {totalGamme > 0 ? (
          <BarreRepartition parts={partsGamme} formaterValeur={(v) => formatNombre(v)} />
        ) : (
          <EtatVide libelle={t("state.vide.repartition")} />
        )}
      </Panneau>
    </div>
  );
}
