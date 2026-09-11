import { BadgeFiabilite } from "@/components/states/BadgeFiabilite";
import { EtatVide } from "@/components/states/EtatVide";
import { listerEnumeration } from "@/lib/enumerations";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

export type LigneIndice = {
  code: string;
  effectif: number;
  indice: number | null;
  niveauFiabilite: string | null;
};

/*
 * Zones 4 et 5 de M6_MATURITE (document 9 ter, I.6) : indice moyen par
 * categorie, en barres horizontales sur une echelle fixe de zero a cent.
 *
 * BarresClassees ne convient pas ici : elle rapporte chaque barre au total des
 * barres, ce qui a un sens pour un effectif et aucun pour une moyenne.
 *
 * Les categories suivent l'ordre du referentiel et non le classement : la gamme
 * se lit de l'economique au haut de gamme, et l'ordre reste le meme d'une
 * consultation a l'autre. L'effectif de chaque barre est toujours visible, et
 * son niveau de fiabilite quand il n'est pas consolide.
 */
export async function BarresIndice({ domaine, lignes }: { domaine: string; lignes: LigneIndice[] }) {
  if (lignes.length === 0) {
    return <EtatVide libelle={t("state.vide.repartition")} />;
  }

  const valeurs = await listerEnumeration(domaine);
  const rang = new Map(valeurs.map((valeur, index) => [valeur.code, index]));
  const libelle = new Map(valeurs.map((valeur) => [valeur.code, valeur.libelleFr]));
  const triees = [...lignes].sort(
    (a, b) =>
      (rang.get(a.code) ?? Number.MAX_SAFE_INTEGER) - (rang.get(b.code) ?? Number.MAX_SAFE_INTEGER)
  );

  return (
    <ul className="flex flex-col" style={{ gap: "var(--space-3)" }}>
      {triees.map((ligne) => {
        const largeur = Math.max(0, Math.min(100, ligne.indice ?? 0));
        const texteLibelle = libelle.get(ligne.code) ?? ligne.code;
        return (
          <li key={ligne.code} className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <span
              className="shrink-0 truncate text-right"
              title={texteLibelle}
              style={{ width: "9rem", fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
            >
              {texteLibelle}
            </span>
            <div
              aria-hidden="true"
              className="relative h-5 flex-1"
              style={{ backgroundColor: "var(--color-bg-panel)", borderRadius: "2px" }}
            >
              <div
                className="h-5"
                style={{
                  width: `${largeur}%`,
                  minWidth: largeur > 0 ? "2px" : 0,
                  borderRadius: "2px",
                  backgroundColor: "var(--color-primary-700)",
                }}
              />
            </div>
            <span
              className="chiffres-tabulaires w-10 shrink-0 text-right"
              style={{ fontSize: "var(--text-small)", fontWeight: 700, color: "var(--color-text)" }}
            >
              {ligne.indice === null ? t("state.non_renseigne") : formatNombre(ligne.indice)}
            </span>
            <span
              className="chiffres-tabulaires flex shrink-0 items-baseline justify-end"
              style={{
                width: "10rem",
                gap: "var(--space-1)",
                fontSize: "var(--text-meta)",
                color: "var(--color-text-muted)",
              }}
            >
              {t("m6.effectif", { n: formatNombre(ligne.effectif) })}
              {ligne.niveauFiabilite && ligne.niveauFiabilite !== "CONSOLIDE" && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <BadgeFiabilite code={ligne.niveauFiabilite} />
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
