"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import { BoutonDeconnexion } from "./BoutonDeconnexion";
import { Icone, type NomIcone } from "./Icone";

const ORDRE_MODULES = [
  "M9_SYNTHESE",
  "M1_OFFRE",
  "M2_DEMANDE",
  "M3_ACTIVITE",
  "M4_TENSION",
  "M5_CONFORMITE",
  "M6_MATURITE",
  "M7_EVENEMENTIEL",
  "M8_RETOMBEES",
  "M10_METHODO",
  "M11_ADMIN",
] as const;

const CLE_LIBELLE: Record<string, string> = {
  M1_OFFRE: "module.m1.court",
  M2_DEMANDE: "module.m2.court",
  M3_ACTIVITE: "module.m3.court",
  M4_TENSION: "module.m4.court",
  M5_CONFORMITE: "module.m5.court",
  M6_MATURITE: "module.m6.court",
  M7_EVENEMENTIEL: "module.m7.court",
  M8_RETOMBEES: "module.m8.court",
  M9_SYNTHESE: "module.m9.court",
  M10_METHODO: "module.m10.titre",
  M11_ADMIN: "module.m11.titre",
};

/* Une icône par module, utilisée uniquement quand le rail est replié. */
const ICONE: Record<string, NomIcone> = {
  M1_OFFRE: "offre",
  M2_DEMANDE: "demande",
  M3_ACTIVITE: "activite",
  M4_TENSION: "tension",
  M5_CONFORMITE: "conformite",
  M6_MATURITE: "maturite",
  M7_EVENEMENTIEL: "evenementiel",
  M8_RETOMBEES: "retombees",
  M9_SYNTHESE: "synthese",
  M10_METHODO: "methodologie",
  M11_ADMIN: "administration",
};

/* Ecrans reellement construits a ce jour. Un module actif sans ecran reste visible, non cliquable. */
const ROUTES_CONSTRUITES: Record<string, string> = {
  M9_SYNTHESE: "/synthese",
  M1_OFFRE: "/offre",
  M2_DEMANDE: "/demande",
  M3_ACTIVITE: "/activite",
  M4_TENSION: "/tension",
  M5_CONFORMITE: "/conformite",
  M6_MATURITE: "/maturite",
  M7_EVENEMENTIEL: "/evenementiel",
  M8_RETOMBEES: "/retombees",
  M10_METHODO: "/methodologie",
  M11_ADMIN: "/administration",
};

const CLE_STOCKAGE = "observatoire.navigation.repliee";

/*
 * Le choix de repli vit dans le stockage du navigateur, qui est une source
 * exterieure a React : on le lit avec useSyncExternalStore plutot qu'en
 * recopiant sa valeur dans un etat local. Deux onglets ouverts sur l'outil
 * restent ainsi d'accord, grace a l'evenement `storage`.
 *
 * La mise en page, elle, ne depend pas de cet etat React : elle est decidee par
 * l'attribut `data-rail` de la racine du document, pose par un script synchrone
 * (voir app/layout.tsx) avant la premiere peinture. Sans cela, le serveur rend
 * toujours le rail deplie et le client le replie apres hydratation : le rail se
 * retracte sous les yeux a chaque rechargement. L'etat React ne sert donc plus
 * qu'aux attributs d'accessibilite et aux infobulles, ou un decalage d'une image
 * ne se voit pas.
 */
const abonnes = new Set<() => void>();

function souscrire(rappel: () => void) {
  abonnes.add(rappel);
  window.addEventListener("storage", rappel);
  return () => {
    abonnes.delete(rappel);
    window.removeEventListener("storage", rappel);
  };
}

function lireRepli(): boolean {
  try {
    return window.localStorage.getItem(CLE_STOCKAGE) === "1";
  } catch {
    return false;
  }
}

function ecrireRepli(valeur: boolean) {
  document.documentElement.dataset.rail = valeur ? "replie" : "";
  try {
    window.localStorage.setItem(CLE_STOCKAGE, valeur ? "1" : "0");
  } catch {
    /* Sans stockage, le choix ne survit pas au rechargement. */
  }
  for (const rappel of abonnes) rappel();
}

/* Numerotation affichee a gauche de chaque entree visible dans le profil. */
function numeroModule(position: number): string {
  return String(position + 1).padStart(2, "0");
}

/*
 * Navigation laterale permanente (document 8, section 4), repliable depuis le
 * 8 septembre 2026.
 *
 * Repliee, elle passe de 240 a 60 px et les libelles cedent la place aux
 * icones. Le passage d'un etat a l'autre s'anime : la colonne se resserre et
 * les libelles s'effacent ensemble, voir app/globals.css. Les deux versions
 * restent rendues, le CSS decide laquelle occupe de la place. C'est la seule zone de l'outil ou une icone est admise : le libelle
 * n'y a plus la place de s'ecrire, donc l'icone n'est pas decorative, elle est
 * le dernier porteur d'information. Chaque entree conserve son `title` et son
 * `aria-label` avec le libelle exact.
 *
 * "Permanente" au sens du document 8 veut dire jamais escamotee toute seule :
 * le rail ne disparait jamais, il se resserre, et le module courant reste
 * visible dans les deux etats, marque par son filet vert et son fond plus clair.
 */
export function NavigationLaterale({ modulesActifs }: { modulesActifs: string[] }) {
  const chemin = usePathname();
  const replie = useSyncExternalStore(souscrire, lireRepli, () => false);

  return (
    <nav
      data-impression="masquer"
      aria-label={t("nav.modules")}
      className="flex shrink-0 flex-col justify-between"
      style={{
        width: "var(--largeur-rail)",
        backgroundColor: "var(--color-primary-900)",
        paddingBottom: "var(--space-3)",
        transition: "width var(--transition-rail)",
        overflow: "visible",
      }}
    >
      <div className="navigation-modules flex flex-col">
        <div
          className="rail-entete nav-section-heading flex items-center justify-end"
          style={{ gap: "var(--space-2)", padding: "var(--space-5) var(--space-4) var(--space-4)" }}
        >
          <button
            type="button"
            onClick={() => ecrireRepli(!replie)}
            className="bouton-porte"
            aria-expanded={!replie}
            title={replie ? t("nav.deplier") : t("nav.replier")}
            aria-label={replie ? t("nav.deplier") : t("nav.replier")}
          >
            <span className="porte-deplie flex">
              <Icone nom="replier" taille={18} />
            </span>
            <span className="porte-replie flex">
              <Icone nom="deplier" taille={18} />
            </span>
          </button>
        </div>

        {ORDRE_MODULES.filter((code) => modulesActifs.includes(code)).map((code, index) => {
          const route = ROUTES_CONSTRUITES[code];
          const actif = route !== undefined && chemin.startsWith(route);
          const libelle = t(CLE_LIBELLE[code]);
          const numero = numeroModule(index);

          /* Les deux versions sont rendues, le CSS choisit laquelle s'affiche.
             C'est ce qui evite que le rail se reconfigure apres hydratation. */
          const contenu = (
            <>
              <span className="rail-replie flex">
                <Icone nom={ICONE[code]} />
              </span>
              <span
                className="rail-deplie nav-number chiffres-tabulaires shrink-0"
                style={{
                  width: "1.4rem",
                  fontSize: "calc(var(--text-meta) + 4px)",
                  fontWeight: 600,
                  color: actif ? "var(--color-on-primary-muted)" : "var(--color-on-primary-faint)",
                }}
              >
                {numero}
              </span>
              <span
                className="rail-deplie"
                style={{ fontSize: "calc(var(--text-body) + 4px)" }}
              >
                {libelle}
              </span>
            </>
          );

          const styleCommun = {
            backgroundColor: actif ? "var(--color-primary-600)" : "var(--color-primary-800)",
            color: actif ? "var(--color-on-primary)" : "var(--color-on-primary-muted)",
            fontWeight: actif ? 600 : 400,
          } as const;

          if (!route) {
            return (
              <span
                key={code}
                className="entree-navigation"
                style={{ ...styleCommun, color: "var(--color-on-primary-faint)", cursor: "default" }}
                data-tooltip={`${numero} · ${libelle}`}
              >
                {contenu}
              </span>
            );
          }

          return (
            <Link
              key={code}
              href={route}
              aria-current={actif ? "page" : undefined}
              aria-label={libelle}
              data-tooltip={`${numero} · ${libelle}`}
              className="entree-navigation"
              style={styleCommun}
            >
              {contenu}
            </Link>
          );
        })}
      </div>

      <div
        className="flex flex-col"
        style={{ gap: "var(--space-5)", paddingBottom: "var(--space-4)" }}
      >
        <BoutonDeconnexion />

        {/* Document 8, section 11 : la mention d'attribution ne se masque pas.
            Repliee, la colonne n'a plus la largeur de l'ecrire ; elle reparait
            avec le rail, et l'export la porte de toute facon en pied de page. */}
        <span
          className="rail-deplie"
          style={{
            margin: "0 var(--space-4)",
            paddingTop: "var(--space-3)",
            borderTop: "1px solid var(--color-primary-800)",
            fontSize: "var(--text-meta)",
            lineHeight: 1.4,
            color: "var(--color-on-primary)",
          }}
        >
          {t("app.attribution")}
        </span>
      </div>
    </nav>
  );
}
