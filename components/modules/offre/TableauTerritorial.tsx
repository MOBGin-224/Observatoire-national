"use client";

import { useMemo, useState } from "react";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

export type LigneTerritoriale = {
  code: string;
  libelle: string;
  etablissements: number;
  capacite: number;
  partenaires: number;
  couverture: number | null;
  numerisation: number | null;
  reservabilite: number | null;
  verification: number | null;
};

type Colonne = {
  cle: keyof LigneTerritoriale;
  libelle: string;
  forme: "libelle" | "volume" | "taux";
};

/*
 * Z4, tableau des territoires enfants (document 9, B.5 et B.7).
 *
 * Trois choix qui font la difference entre un tableau de chiffres et un tableau
 * qui se lit en projection :
 *
 *   1. Toutes les subdivisions du referentiel sont presentes, y compris celles a
 *      zero (critere d'acceptation B.10.1). Un territoire vide se voit ; c'est
 *      souvent l'information la plus utile de l'ecran au lancement.
 *   2. Chaque cellule chiffree porte sa micro-barre. Le rang d'un territoire se
 *      lit sans comparer douze nombres a trois metres.
 *   3. Une ligne de total ferme le tableau. Elle permet de verifier d'un coup
 *      d'oeil que la somme des capacites egale le bloc cle national
 *      (critere d'acceptation B.10.10).
 *
 * Tri sur toute colonne, aucune pagination en dessous de 50 lignes
 * (document 8, section 5.6).
 */
export function TableauTerritorial({
  lignes,
  libelleVide,
}: {
  lignes: LigneTerritoriale[];
  libelleVide?: string;
}) {
  const [triSur, setTriSur] = useState<keyof LigneTerritoriale>("etablissements");
  const [ordre, setOrdre] = useState<"asc" | "desc">("desc");

  const colonnes: Colonne[] = [
    { cle: "libelle", libelle: t("tableau.territoire"), forme: "libelle" },
    { cle: "etablissements", libelle: t("tableau.etablissements"), forme: "volume" },
    { cle: "capacite", libelle: t("tableau.capacite"), forme: "volume" },
    { cle: "partenaires", libelle: t("tableau.partenaires"), forme: "volume" },
    { cle: "couverture", libelle: t("tableau.couverture"), forme: "taux" },
    { cle: "numerisation", libelle: t("tableau.numerisation"), forme: "taux" },
    { cle: "reservabilite", libelle: t("tableau.reservabilite"), forme: "taux" },
    { cle: "verification", libelle: t("tableau.verification"), forme: "taux" },
  ];

  const maxima = useMemo(
    () => ({
      etablissements: Math.max(...lignes.map((l) => l.etablissements), 0),
      capacite: Math.max(...lignes.map((l) => l.capacite), 0),
      partenaires: Math.max(...lignes.map((l) => l.partenaires), 0),
    }),
    [lignes]
  );

  const totaux = useMemo(
    () =>
      lignes.reduce(
        (somme, l) => ({
          etablissements: somme.etablissements + l.etablissements,
          capacite: somme.capacite + l.capacite,
          partenaires: somme.partenaires + l.partenaires,
        }),
        { etablissements: 0, capacite: 0, partenaires: 0 }
      ),
    [lignes]
  );

  const triees = useMemo(() => {
    const sens = ordre === "asc" ? 1 : -1;
    return [...lignes].sort((a, b) => {
      const va = a[triSur];
      const vb = b[triSur];
      if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb, "fr") * sens;
      /* Une valeur absente se range toujours en fin de tri, dans les deux sens :
         "non renseigne" n'est pas la plus petite valeur, c'est l'absence de valeur. */
      if (va === null) return 1;
      if (vb === null) return -1;
      return ((va as number) - (vb as number)) * sens;
    });
  }, [lignes, triSur, ordre]);

  function basculerTri(cle: keyof LigneTerritoriale) {
    if (cle === triSur) {
      setOrdre(ordre === "asc" ? "desc" : "asc");
    } else {
      setTriSur(cle);
      setOrdre(cle === "libelle" ? "asc" : "desc");
    }
  }

  if (lignes.length === 0) {
    return (
      <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
        {libelleVide ?? t("state.vide.subdivision")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse"
        style={{ fontSize: "var(--text-small)", lineHeight: 1.4 }}
      >
        <thead>
          <tr style={{ backgroundColor: "var(--color-primary-700)" }}>
            {colonnes.map((colonne) => {
              const actif = triSur === colonne.cle;
              return (
                <th
                  key={colonne.cle}
                  scope="col"
                  aria-sort={actif ? (ordre === "asc" ? "ascending" : "descending") : "none"}
                  style={{
                    padding: 0,
                    textAlign: colonne.forme === "libelle" ? "left" : "right",
                    borderBottom: `2px solid ${actif ? "var(--color-success)" : "transparent"}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => basculerTri(colonne.cle)}
                    className="w-full"
                    style={{
                      padding: "var(--space-3)",
                      textAlign: "inherit",
                      fontFamily: "var(--font-texte)",
                      fontSize: "var(--text-label)",
                      fontWeight: actif ? 700 : 600,
                      letterSpacing: "var(--tracking-label)",
                      textTransform: "uppercase",
                      color: actif ? "var(--color-on-primary)" : "var(--color-on-primary-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {colonne.libelle}
                    <span aria-hidden="true" style={{ marginLeft: "var(--space-1)", opacity: actif ? 1 : 0 }}>
                      {ordre === "asc" ? "▴" : "▾"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {triees.map((ligne, index) => (
            <tr
              key={ligne.code}
              style={{
                backgroundColor: index % 2 === 1 ? "var(--color-bg-subtle)" : "var(--color-bg)",
                borderBottom: "1px solid var(--color-border-faint)",
              }}
            >
              <th
                scope="row"
                style={{
                  padding: "var(--space-3)",
                  textAlign: "left",
                  fontWeight: 600,
                  color: ligne.etablissements > 0 ? "var(--color-text)" : "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {ligne.libelle}
              </th>
              <CelluleVolume valeur={ligne.etablissements} maximum={maxima.etablissements} />
              <CelluleVolume valeur={ligne.capacite} maximum={maxima.capacite} />
              <CelluleVolume valeur={ligne.partenaires} maximum={maxima.partenaires} teinte="var(--color-success)" />
              <CelluleTaux valeur={ligne.couverture} />
              <CelluleTaux valeur={ligne.numerisation} />
              <CelluleTaux valeur={ligne.reservabilite} />
              <CelluleTaux valeur={ligne.verification} />
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr
            style={{
              borderTop: "2px solid var(--color-border-strong)",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <th
              scope="row"
              className="etiquette"
              style={{ padding: "var(--space-3)", textAlign: "left", color: "var(--color-text-secondary)" }}
            >
              {t("tableau.total")}
            </th>
            <CelluleTotal valeur={totaux.etablissements} />
            <CelluleTotal valeur={totaux.capacite} />
            <CelluleTotal valeur={totaux.partenaires} />
            <td colSpan={4} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* Micro-barre posee sous le chiffre : le rang se lit sans comparer les nombres.
   Exportee pour les tableaux territoriaux des autres modules (M5, M6). */
export function CelluleVolume({
  valeur,
  maximum,
  teinte = "var(--color-primary-500)",
}: {
  valeur: number;
  maximum: number;
  teinte?: string;
}) {
  const part = maximum > 0 ? (valeur / maximum) * 100 : 0;
  return (
    <td style={{ padding: "var(--space-3)", textAlign: "right", verticalAlign: "middle" }}>
      <span className="flex flex-col items-end" style={{ gap: "var(--space-1)" }}>
        <span
          className="chiffres-tabulaires"
          style={{ fontWeight: 600, color: valeur > 0 ? "var(--color-text)" : "var(--color-text-muted)" }}
        >
          {formatNombre(valeur)}
        </span>
        <span
          aria-hidden="true"
          className="block w-full"
          style={{ height: "3px", backgroundColor: "var(--color-border-faint)", borderRadius: "2px" }}
        >
          <span
            className="block h-full"
            style={{ width: `${part}%`, backgroundColor: teinte, borderRadius: "2px" }}
          />
        </span>
      </span>
    </td>
  );
}

/* Un taux se lit sur une echelle fixe de zero a cent, la meme pour toutes les lignes. */
export function CelluleTaux({ valeur }: { valeur: number | null }) {
  if (valeur === null) {
    return (
      <td
        style={{
          padding: "var(--space-3)",
          textAlign: "right",
          fontSize: "var(--text-meta)",
          color: "var(--color-text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        {t("state.non_renseigne")}
      </td>
    );
  }

  return (
    <td style={{ padding: "var(--space-3)", textAlign: "right", verticalAlign: "middle" }}>
      <span className="flex flex-col items-end" style={{ gap: "var(--space-1)" }}>
        <span className="chiffres-tabulaires" style={{ fontWeight: 600 }}>
          {formatPourcentage(valeur)}
        </span>
        <span
          aria-hidden="true"
          className="block w-full"
          style={{ height: "3px", backgroundColor: "var(--color-border-faint)", borderRadius: "2px" }}
        >
          <span
            className="block h-full"
            style={{
              width: `${Math.max(0, Math.min(100, valeur))}%`,
              backgroundColor: "var(--color-primary-700)",
              borderRadius: "2px",
            }}
          />
        </span>
      </span>
    </td>
  );
}

export function CelluleTotal({ valeur }: { valeur: number }) {
  return (
    <td
      className="chiffres-tabulaires"
      style={{
        padding: "var(--space-3)",
        textAlign: "right",
        fontWeight: 700,
        color: "var(--color-primary-700)",
      }}
    >
      {formatNombre(valeur)}
    </td>
  );
}
