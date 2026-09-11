"use client";

import { useMemo, useState } from "react";
import { CelluleTaux, CelluleVolume } from "@/components/modules/offre/TableauTerritorial";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

export type LigneClassement = {
  code: string;
  libelle: string;
  etablissements: number;
  indice: number | null;
  presence: number | null;
  reservation: number | null;
  paiement: number | null;
  /* Libelle du niveau de fiabilite, fourni seulement quand il n'est pas consolide. */
  fiabilite: string | null;
};

type Ordre = "asc" | "desc";

/*
 * Zone 6 de M6_MATURITE (document 9 ter, I.6, I.8, critere I.11.5).
 *
 * Classement des territoires par indice, basculable. L'ordre croissant, retenu
 * par defaut, met en tete les territoires en retard, ceux qui appellent un
 * programme d'appui ; le decroissant, ceux qui servent de reference. C'est
 * l'ordre croissant qui repond a la question du module : ou se situent les
 * retards.
 *
 * Le classement porte sur des territoires, jamais sur des etablissements
 * (I.10). Un territoire sans etablissement recense reste dans la liste, en fin
 * de classement dans les deux sens : l'absence de mesure n'est pas un indice nul.
 */
export function ClassementTerritoires({ lignes }: { lignes: LigneClassement[] }) {
  const [ordre, setOrdre] = useState<Ordre>("asc");

  const triees = useMemo(
    () =>
      [...lignes].sort((a, b) => {
        if (a.indice === null && b.indice === null) return a.libelle.localeCompare(b.libelle, "fr");
        if (a.indice === null) return 1;
        if (b.indice === null) return -1;
        return ordre === "asc" ? a.indice - b.indice : b.indice - a.indice;
      }),
    [lignes, ordre]
  );

  const maximumEtablissements = useMemo(
    () => Math.max(...lignes.map((l) => l.etablissements), 0),
    [lignes]
  );

  if (lignes.length === 0) {
    return (
      <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}>
        {t("state.vide.subdivision")}
      </p>
    );
  }

  const colonnes = [
    { cle: "territoire", libelle: t("m6.z6.col.territoire"), droite: false },
    { cle: "etablissements", libelle: t("m6.z6.col.etablissements"), droite: true },
    { cle: "indice", libelle: t("m6.z6.col.indice"), droite: true },
    { cle: "presence", libelle: t("m6.z6.col.presence"), droite: true },
    { cle: "reservation", libelle: t("m6.z6.col.reservation"), droite: true },
    { cle: "paiement", libelle: t("m6.z6.col.paiement"), droite: true },
  ];

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
      <div
        role="group"
        aria-label={t("m6.z6.titre")}
        className="inline-flex self-start"
        style={{
          border: "1px solid var(--color-border-strong)",
          borderRadius: "var(--rayon)",
          overflow: "hidden",
        }}
      >
        {(["asc", "desc"] as const).map((sens) => {
          const actif = ordre === sens;
          return (
            <button
              key={sens}
              type="button"
              aria-pressed={actif}
              onClick={() => setOrdre(sens)}
              style={{
                padding: "var(--space-2) var(--space-4)",
                fontSize: "var(--text-small)",
                fontWeight: actif ? 600 : 500,
                backgroundColor: actif ? "var(--color-primary-700)" : "var(--color-bg)",
                color: actif ? "var(--color-on-primary)" : "var(--color-text-secondary)",
                transition: "background-color 150ms ease-out, color 150ms ease-out",
              }}
            >
              {t(sens === "asc" ? "m6.z6.tri_croissant" : "m6.z6.tri_decroissant")}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ fontSize: "var(--text-small)", lineHeight: 1.4 }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-primary-700)" }}>
              {colonnes.map((colonne) => (
                <th
                  key={colonne.cle}
                  scope="col"
                  aria-sort={
                    colonne.cle === "indice" ? (ordre === "asc" ? "ascending" : "descending") : undefined
                  }
                  style={{
                    padding: "var(--space-3)",
                    textAlign: colonne.droite ? "right" : "left",
                    fontFamily: "var(--font-texte)",
                    fontSize: "var(--text-label)",
                    fontWeight: colonne.cle === "indice" ? 700 : 600,
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color:
                      colonne.cle === "indice" ? "var(--color-on-primary)" : "var(--color-on-primary-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {colonne.libelle}
                </th>
              ))}
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
                <CelluleVolume valeur={ligne.etablissements} maximum={maximumEtablissements} />
                <CelluleIndice valeur={ligne.indice} fiabilite={ligne.fiabilite} />
                <CelluleTaux valeur={ligne.presence} />
                <CelluleTaux valeur={ligne.reservation} />
                <CelluleTaux valeur={ligne.paiement} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Indice sur cent, avec sa micro-barre sur la meme echelle fixe que les taux. */
function CelluleIndice({ valeur, fiabilite }: { valeur: number | null; fiabilite: string | null }) {
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
        <span className="chiffres-tabulaires" style={{ whiteSpace: "nowrap" }}>
          {fiabilite && (
            <span
              style={{
                marginRight: "var(--space-2)",
                fontSize: "var(--text-meta)",
                fontWeight: 500,
                color: "var(--color-text-muted)",
              }}
            >
              {fiabilite}
            </span>
          )}
          <span style={{ fontWeight: 700, color: "var(--color-primary-700)" }}>{formatNombre(valeur)}</span>
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
              backgroundColor: "var(--color-primary-500)",
              borderRadius: "2px",
            }}
          />
        </span>
      </span>
    </td>
  );
}
