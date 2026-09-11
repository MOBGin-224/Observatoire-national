import type { ReactNode } from "react";
import { EtatDonnee } from "@/components/states/EtatDonnee";
import { JaugeRadiale } from "@/components/charts/JaugeRadiale";
import { appliquerM0, appliquerM1 } from "@/lib/masking";
import { resoudreIndicateur } from "@/lib/indicators";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Un bloc d'indicateur cle (document 9, B.5, zone Z1). Ne connait jamais son
 * libelle en dur : il connait son code et interroge lib/indicators
 * (document 11, section 6.4). `masque` applique la regle M1 quand le module le
 * demande (ex: DEM_BUDGET_RECHERCHE en dessous de 10 recherches filtrees).
 *
 * Trois variantes, une seule logique de donnee :
 *   compact  volume en 32 px, forme par defaut, huit blocs sur une ligne en 1440 px ;
 *   volume   volume en 44 px, pour les trois ou quatre chiffres de tete d'un ecran ;
 *   jauge    ratio lu sur une echelle fixe de zero a cent, pour les taux.
 *
 * La variante jauge n'introduit pas de camembert : le document 8 interdit de
 * comparer des categories dans un disque, pas de representer une grandeur unique
 * sur une echelle bornee, qui reste comparable d'un ecran et d'une periode a l'autre.
 */
export type VarianteBloc = "compact" | "volume" | "jauge";

export async function BlocIndicateurCle({
  code,
  valeur,
  calculeA,
  masque = false,
  cleLibelleMasque,
  libelleVide,
  niveauFiabilite,
  variante = "compact",
  accent = false,
  alerte = false,
  pied,
}: {
  code: string;
  valeur: number | null;
  calculeA: string;
  masque?: boolean;
  cleLibelleMasque?: string;
  libelleVide?: string;
  niveauFiabilite?: string;
  variante?: VarianteBloc;
  accent?: boolean;
  /* Valeur en --color-alert. Reserve aux seuls signaux de tension que prevoit une
     fiche (document 9, D.7 ; document 9 ter, J.8) : jamais un choix decoratif. */
  alerte?: boolean;
  pied?: ReactNode;
}) {
  const meta = await resoudreIndicateur(code);
  const etat = masque ? appliquerM1(valeur, true) : appliquerM0(valeur, libelleVide);
  const estPourcentage = meta?.unite === "pourcentage";
  const uniteAffichee =
    meta?.unite && meta.unite !== "pourcentage" && meta.unite !== "entier" ? meta.unite : null;

  function formater(v: number): string {
    return estPourcentage
      ? formatPourcentage(v, meta?.decimales ?? 1)
      : formatNombre(v, meta?.decimales ?? 0);
  }

  return (
    <div
      className={`surface ${accent ? "surface-accent" : ""} flex flex-col`}
      style={{ gap: "var(--space-3)", padding: "var(--space-4) var(--space-5) var(--space-3)" }}
    >
      <span className="etiquette" style={{ lineHeight: 1.35 }}>
        {meta?.libelleFr ?? code}
      </span>

      <EtatDonnee
        etat={etat}
        statutDonnee={meta?.statutDonnee ?? undefined}
        niveauFiabilite={niveauFiabilite}
        calculeA={calculeA}
        cleLibelleMasque={cleLibelleMasque}
        hauteurSquelette={variante === "jauge" ? "116px" : variante === "volume" ? "3rem" : "2.5rem"}
        renduVide={
          /* Une jauge sans donnee garde son anneau et ses dimensions
             (document 9, A.4, etat 3). Cinq fois la meme phrase cote a cote ne
             compose pas un ecran ; cinq anneaux eteints, si. */
          variante === "jauge"
            ? () => (
                <div
                  className="flex items-center justify-center"
                  style={{ padding: "var(--space-1) 0" }}
                >
                  <JaugeRadiale valeur={null} texteVide={t("state.non_renseigne")} />
                </div>
              )
            : undefined
        }
      >
        {(v) =>
          variante === "jauge" ? (
            <div className="flex items-center justify-center" style={{ padding: "var(--space-1) 0" }}>
              <JaugeRadiale
                valeur={v}
                texte={estPourcentage ? formatNombre(v, 0) + " %" : formatNombre(v, meta?.decimales ?? 0)}
              />
            </div>
          ) : (
            <>
              <span
                className="valeur-cle chiffres-tabulaires"
                style={{
                  fontSize: variante === "volume" ? "var(--text-display-xl)" : "var(--text-display)",
                  color: alerte ? "var(--color-alert)" : undefined,
                }}
              >
                {formater(v)}
                {uniteAffichee && (
                  <span
                    style={{
                      fontFamily: "var(--font-texte)",
                      fontSize: "var(--text-small)",
                      fontWeight: 400,
                      letterSpacing: 0,
                      color: "var(--color-text-muted)",
                      marginLeft: "var(--space-2)",
                    }}
                  >
                    {uniteAffichee}
                  </span>
                )}
              </span>
              {pied}
            </>
          )
        }
      </EtatDonnee>
    </div>
  );
}
