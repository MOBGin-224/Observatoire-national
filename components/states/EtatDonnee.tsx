import type { ReactNode } from "react";
import { t } from "@/lib/i18n";
import { formatDateHeure } from "@/lib/format";
import { Squelette } from "./Squelette";
import { EtatVide } from "./EtatVide";
import { EtatMasque } from "./EtatMasque";
import { EtatErreur } from "./EtatErreur";
import { BadgeStatutDonnee } from "./BadgeStatutDonnee";
import { BadgeFiabilite } from "./BadgeFiabilite";
import type { EtatBloc } from "./types";

/*
 * Document 9, A.5 : elements presents sur tout bloc de donnee (badge de statut,
 * badge de fiabilite, horodatage de fraicheur, lien methodologie), plus les cinq
 * etats du document 9, A.4. Un composant assemble ici une fois pour toutes :
 * aucun ecran de module ne doit reimplementer sa propre logique d'etat.
 *
 * La ligne de provenance est separee du contenu par un filet et posee en
 * 11 px : elle doit etre lisible sans jamais concurrencer la valeur.
 */
export function EtatDonnee<T>({
  etat,
  statutDonnee,
  niveauFiabilite,
  calculeA,
  onReessayer,
  hauteurSquelette,
  cleLibelleMasque,
  renduVide,
  children,
}: {
  etat: EtatBloc<T>;
  statutDonnee?: string;
  niveauFiabilite?: string;
  calculeA?: string;
  onReessayer?: () => void;
  hauteurSquelette?: string;
  cleLibelleMasque?: string;
  renduVide?: (libelle?: string) => ReactNode;
  children: (valeur: T) => ReactNode;
}) {
  if (etat.type === "chargement") {
    return <Squelette hauteur={hauteurSquelette} />;
  }

  const provenance = etat.type !== "erreur" && (statutDonnee || niveauFiabilite || calculeA);

  return (
    <div className="flex flex-1 flex-col justify-between" style={{ gap: "var(--space-3)" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        {etat.type === "erreur" && <EtatErreur onReessayer={onReessayer} />}
        {etat.type === "vide" &&
          (renduVide ? renduVide(etat.libelle) : <EtatVide libelle={etat.libelle} />)}
        {etat.type === "masque" && <EtatMasque cleLibelle={cleLibelleMasque} />}
        {etat.type === "donnee" && children(etat.valeur)}
      </div>

      {provenance && (
        <div
          className="flex flex-wrap items-center"
          style={{
            gap: "var(--space-1) var(--space-2)",
            paddingTop: "var(--space-2)",
            borderTop: "1px solid var(--color-border-faint)",
          }}
        >
          {statutDonnee && <BadgeStatutDonnee code={statutDonnee} />}
          {niveauFiabilite && (
            <>
              <Separateur />
              <BadgeFiabilite code={niveauFiabilite} />
            </>
          )}
          {calculeA && (
            <>
              <Separateur />
              <span
                className="chiffres-tabulaires"
                style={{
                  fontSize: "var(--text-meta)",
                  color: "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDateHeure(calculeA)}
              </span>
            </>
          )}
          <Separateur />
          <a
            href="/methodologie"
            className="lien-sobre"
            style={{
              fontSize: "var(--text-meta)",
              color: "var(--color-text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {t("nav.methodologie")}
          </a>
        </div>
      )}
    </div>
  );
}

function Separateur() {
  return (
    <span aria-hidden="true" style={{ fontSize: "var(--text-meta)", color: "var(--color-border-strong)" }}>
      &middot;
    </span>
  );
}
