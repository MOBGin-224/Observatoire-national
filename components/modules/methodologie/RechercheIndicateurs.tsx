"use client";

import { useMemo, useState } from "react";
import { PastilleStatut } from "@/components/states/PastilleStatut";
import { t } from "@/lib/i18n";
import type { FicheIndicateur } from "@/lib/queries/methodologie";

/* Document 9 bis, G.7 : recherche sur le libelle, le code et la definition,
 * insensible a la casse et aux accents. Les familles reprennent les
 * prefixes de code du document 4 ; leurs libelles viennent de
 * module.<code>.court (deja utilises par la navigation laterale) plus
 * ctx.famille pour la famille de contexte, hors navigation. */
function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const FAMILLE_PAR_PREFIXE: Record<string, string> = {
  OFF: t("module.m1.court"),
  MAT: t("module.m6.court"),
  DEM: t("module.m2.court"),
  TEN: t("module.m4.court"),
  INS: t("module.m7.court"),
  ACT: t("module.m3.court"),
  CONF: t("module.m5.court"),
  EVE: t("module.m7.court"),
  RET: t("module.m8.court"),
};

function familleDe(code: string): string {
  const prefixe = code.split("_")[0];
  return FAMILLE_PAR_PREFIXE[prefixe] ?? prefixe;
}

export function RechercheIndicateurs({
  indicateurs,
  libellesStatut,
}: {
  indicateurs: FicheIndicateur[];
  /* Libelles de STATUT_DONNEE resolus cote serveur : la table enumeration reste
     la seule source des libelles, y compris pour un composant client. */
  libellesStatut: Record<string, string>;
}) {
  const [requete, setRequete] = useState("");
  const [selectionne, setSelectionne] = useState<string | null>(null);

  const filtres = useMemo(() => {
    if (!requete.trim()) return indicateurs;
    const q = normaliser(requete);
    return indicateurs.filter(
      (i) =>
        normaliser(i.libelleFr).includes(q) ||
        normaliser(i.code).includes(q) ||
        (i.definitionFr && normaliser(i.definitionFr).includes(q))
    );
  }, [indicateurs, requete]);

  const parFamille = useMemo(() => {
    const groupes = new Map<string, FicheIndicateur[]>();
    for (const i of filtres) {
      const famille = familleDe(i.code);
      groupes.set(famille, [...(groupes.get(famille) ?? []), i]);
    }
    return groupes;
  }, [filtres]);

  const fiche = indicateurs.find((i) => i.code === selectionne);

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
      <input
        type="search"
        placeholder={t("methodologie.rechercher")}
        value={requete}
        onChange={(e) => setRequete(e.target.value)}
        className="w-full"
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--rayon)",
          border: "1px solid var(--color-border-strong)",
          backgroundColor: "var(--color-bg-subtle)",
          fontSize: "var(--text-body)",
          color: "var(--color-text)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr]" style={{ gap: "var(--space-6)" }}>
        {/* Sommaire par famille. Le decompte evite d'avoir a derouler pour savoir
            si une recherche a ramene quelque chose dans une famille donnee. */}
        <nav
          className="flex flex-col"
          style={{
            gap: "var(--space-5)",
            maxHeight: "34rem",
            overflowY: "auto",
            paddingRight: "var(--space-2)",
          }}
        >
          {[...parFamille.entries()].map(([famille, items]) => (
            <div key={famille} className="flex flex-col" style={{ gap: "var(--space-1)" }}>
              <div
                className="flex items-baseline justify-between"
                style={{
                  gap: "var(--space-2)",
                  paddingBottom: "var(--space-2)",
                  marginBottom: "var(--space-1)",
                  borderBottom: "1px solid var(--color-border-faint)",
                }}
              >
                <span className="etiquette" style={{ color: "var(--color-primary-700)" }}>
                  {famille}
                </span>
                <span
                  className="chiffres-tabulaires"
                  style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}
                >
                  {items.length}
                </span>
              </div>
              {items.map((i) => (
                <button
                  key={i.code}
                  type="button"
                  onClick={() => setSelectionne(i.code)}
                  aria-current={selectionne === i.code}
                  className="item-liste"
                  style={{
                    fontSize: "var(--text-small)",
                    lineHeight: 1.4,
                    color: selectionne === i.code ? "var(--color-primary-700)" : "var(--color-text)",
                  }}
                >
                  {i.libelleFr}
                </button>
              ))}
            </div>
          ))}
          {filtres.length === 0 && (
            <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
              {t("methodologie.aucun_resultat")}
            </p>
          )}
        </nav>

        {fiche ? <Fiche fiche={fiche} libellesStatut={libellesStatut} /> : <FicheVide />}
      </div>
    </div>
  );
}

function FicheVide() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        minHeight: "16rem",
        padding: "var(--space-8)",
        borderRadius: "var(--rayon)",
        border: "1px dashed var(--color-border-strong)",
        backgroundColor: "var(--color-bg-subtle)",
      }}
    >
      <p
        className="max-w-[36ch] text-center"
        style={{ fontSize: "var(--text-body)", color: "var(--color-text-muted)" }}
      >
        {t("methodologie.selectionner")}
      </p>
    </div>
  );
}

function Fiche({
  fiche,
  libellesStatut,
}: {
  fiche: FicheIndicateur;
  libellesStatut: Record<string, string>;
}) {
  const attributs: { cle: string; libelle: string; valeur: React.ReactNode }[] = [];

  if (fiche.formule) {
    attributs.push({ cle: "formule", libelle: t("methodologie.formule"), valeur: fiche.formule });
  }
  if (fiche.unite) {
    attributs.push({
      cle: "unite",
      libelle: t("methodologie.unite"),
      valeur: fiche.decimales
        ? `${fiche.unite} · ${fiche.decimales} ${t("methodologie.decimales")}`
        : fiche.unite,
    });
  }
  if (fiche.regleMasquage) {
    attributs.push({
      cle: "masquage",
      libelle: t("methodologie.regle_masquage"),
      valeur: fiche.regleMasquage,
    });
  }
  if (fiche.seuilConsolide || fiche.seuilIndicatif) {
    attributs.push({
      cle: "seuils",
      libelle: t("methodologie.seuils_fiabilite"),
      valeur: t("methodologie.seuils_fiabilite_texte", {
        consolide: fiche.seuilConsolide ?? t("state.non_renseigne"),
        indicatif: fiche.seuilIndicatif ?? t("state.non_renseigne"),
      }),
    });
  }
  if (fiche.frequenceRafraichissement) {
    attributs.push({
      cle: "frequence",
      libelle: t("methodologie.frequence"),
      valeur: fiche.frequenceRafraichissement,
    });
  }

  return (
    <article
      className="flex flex-col"
      style={{
        borderRadius: "var(--rayon)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      {/* En-tete sur aplat : la fiche se distingue du sommaire sans ombre portee. */}
      <header
        className="flex flex-col"
        style={{
          gap: "var(--space-2)",
          padding: "var(--space-5)",
          backgroundColor: "var(--color-primary-700)",
        }}
      >
        <span className="etiquette" style={{ color: "var(--color-on-primary-muted)" }}>
          {t("methodologie.fiche_titre")}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-titre)",
            fontSize: "var(--text-h2)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-titre)",
            color: "var(--color-on-primary)",
          }}
        >
          {fiche.libelleFr}
        </h3>
        <code
          style={{
            fontFamily: "var(--font-texte)",
            fontSize: "var(--text-meta)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-label)",
            color: "var(--color-on-primary-muted)",
          }}
        >
          {fiche.code}
        </code>
      </header>

      <div className="flex flex-col" style={{ gap: "var(--space-5)", padding: "var(--space-5)" }}>
        {fiche.definitionFr && (
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <span className="etiquette">{t("methodologie.definition")}</span>
            <p
              className="max-w-[70ch]"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.6, color: "var(--color-text)" }}
            >
              {fiche.definitionFr}
            </p>
          </div>
        )}

        {fiche.statutDonnee && (
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <span className="etiquette">{t("methodologie.statut_donnee")}</span>
            <PastilleStatut
              code={fiche.statutDonnee}
              libelle={libellesStatut[fiche.statutDonnee] ?? fiche.statutDonnee}
            />
          </div>
        )}

        {attributs.length > 0 && (
          <dl className="flex flex-col">
            {attributs.map((attribut, index) => (
              <div
                key={attribut.cle}
                className="grid grid-cols-1 sm:grid-cols-[11rem_1fr]"
                style={{
                  gap: "var(--space-1) var(--space-4)",
                  padding: "var(--space-3) 0",
                  borderTop: index === 0 ? "1px solid var(--color-border)" : undefined,
                  borderBottom: "1px solid var(--color-border-faint)",
                }}
              >
                <dt className="etiquette" style={{ paddingTop: "2px" }}>
                  {attribut.libelle}
                </dt>
                <dd
                  style={{
                    fontSize: "var(--text-small)",
                    lineHeight: 1.55,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {attribut.valeur}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Le piege d'interpretation est la seule information de la fiche qui
            previent une erreur d'usage. Il est detache, jamais noye dans la liste. */}
        {fiche.pieges && (
          <div
            className="flex flex-col"
            style={{
              gap: "var(--space-1)",
              padding: "var(--space-3) var(--space-4)",
              borderLeft: "var(--filet-accent) solid var(--color-border-strong)",
              backgroundColor: "var(--color-bg-subtle)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-titre)",
                fontSize: "var(--text-h3)",
                fontWeight: 600,
                color: "var(--color-text)",
              }}
            >
              {t("methodologie.piege")}
            </span>
            <p
              className="max-w-[70ch]"
              style={{
                fontSize: "var(--text-small)",
                lineHeight: 1.55,
                color: "var(--color-text-secondary)",
              }}
            >
              {fiche.pieges}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
