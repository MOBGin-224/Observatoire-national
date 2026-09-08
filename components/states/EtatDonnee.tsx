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
 * Document 9, A.5 : elements presents sur tout bloc de donnee — badge de statut,
 * badge de fiabilite, horodatage de fraicheur, lien methodologie — plus les cinq
 * etats du document 9, A.4. Un composant assemble ici une fois pour toutes :
 * aucun ecran de module ne doit reimplementer sa propre logique d'etat.
 */
export function EtatDonnee<T>({
  etat,
  statutDonnee,
  niveauFiabilite,
  calculeA,
  onReessayer,
  hauteurSquelette,
  cleLibelleMasque,
  children,
}: {
  etat: EtatBloc<T>;
  statutDonnee?: string;
  niveauFiabilite?: string;
  calculeA?: string;
  onReessayer?: () => void;
  hauteurSquelette?: string;
  cleLibelleMasque?: string;
  children: (valeur: T) => ReactNode;
}) {
  if (etat.type === "chargement") {
    return <Squelette hauteur={hauteurSquelette} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {etat.type === "erreur" && <EtatErreur onReessayer={onReessayer} />}
      {etat.type === "vide" && <EtatVide libelle={etat.libelle} />}
      {etat.type === "masque" && <EtatMasque cleLibelle={cleLibelleMasque} />}
      {etat.type === "donnee" && children(etat.valeur)}

      {etat.type !== "erreur" && (statutDonnee || niveauFiabilite || calculeA) && (
        <div className="flex items-center gap-2">
          {statutDonnee && <BadgeStatutDonnee code={statutDonnee} />}
          {niveauFiabilite && <BadgeFiabilite code={niveauFiabilite} />}
          {calculeA && (
            <span style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
              {formatDateHeure(calculeA)}
            </span>
          )}
          <a
            href="/methodologie"
            className="underline"
            style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}
          >
            {t("nav.methodologie")}
          </a>
        </div>
      )}
    </div>
  );
}
