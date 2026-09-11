"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

export type OptionFenetre = { cle: string; libelle: string };

export type EtatFenetre = {
  mode: "evenement" | "dates";
  evenement: string | null;
  debut: string | null;
  fin: string | null;
  territoire: string | null;
  gammes: string[];
  salleMin: number | null;
};

const STYLE_CHAMP = {
  padding: "var(--space-2) var(--space-3)",
  fontSize: "var(--text-small)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: "var(--rayon)",
  backgroundColor: "var(--color-bg)",
  color: "var(--color-text)",
} as const;

/*
 * Selecteur de fenetre de M7_EVENEMENTIEL (document 9 ter, J.5 et J.7).
 *
 * Tout l'etat vit dans l'adresse : une fenetre se partage, se recharge et
 * s'exporte telle quelle. Le composant ne calcule rien ; il reecrit l'adresse,
 * et la page serveur recalcule.
 *
 * Le passage du mode evenement au mode dates libres conserve les dates et le
 * territoire de la fenetre affichee (critere J.11.3) : on change de mode sans
 * perdre ce qu'on regardait.
 */
export function SelecteurFenetre({
  etat,
  evenements,
  gammes,
  capacitesSalle,
}: {
  etat: EtatFenetre;
  evenements: OptionFenetre[];
  gammes: OptionFenetre[];
  capacitesSalle: readonly number[];
}) {
  const router = useRouter();
  const chemin = usePathname();

  function naviguer(changement: Partial<EtatFenetre>) {
    const suivant = { ...etat, ...changement };
    const parametres = new URLSearchParams();
    parametres.set("mode", suivant.mode);
    if (suivant.mode === "evenement") {
      if (suivant.evenement) parametres.set("evenement", suivant.evenement);
    } else {
      if (suivant.debut) parametres.set("debut", suivant.debut);
      if (suivant.fin) parametres.set("fin", suivant.fin);
      if (suivant.territoire) parametres.set("territoire", suivant.territoire);
    }
    for (const gamme of suivant.gammes) parametres.append("gamme", gamme);
    if (suivant.salleMin !== null) parametres.set("salle_min", String(suivant.salleMin));
    router.push(`${chemin}?${parametres.toString()}`, { scroll: false });
  }

  function basculerGamme(code: string) {
    const actives = etat.gammes.includes(code)
      ? etat.gammes.filter((gamme) => gamme !== code)
      : [...etat.gammes, code];
    naviguer({ gammes: actives });
  }

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
      <div className="flex flex-wrap items-end" style={{ gap: "var(--space-5)" }}>
        <Champ libelle={t("m7.selecteur.titre")}>
          <div
            role="group"
            aria-label={t("m7.selecteur.titre")}
            className="inline-flex"
            style={{
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--rayon)",
              overflow: "hidden",
            }}
          >
            <Segment
              actif={etat.mode === "evenement"}
              desactive={evenements.length === 0}
              surClic={() => naviguer({ mode: "evenement", evenement: etat.evenement ?? evenements[0]?.cle ?? null })}
            >
              {t("m7.selecteur.evenement")}
            </Segment>
            <Segment actif={etat.mode === "dates"} surClic={() => naviguer({ mode: "dates" })}>
              {t("m7.selecteur.dates_libres")}
            </Segment>
          </div>
        </Champ>

        {etat.mode === "evenement" ? (
          <Champ libelle={t("m7.selecteur.choisir_evenement")} pour="m7-evenement">
            <select
              id="m7-evenement"
              value={etat.evenement ?? ""}
              onChange={(evenement) => naviguer({ evenement: evenement.target.value })}
              style={STYLE_CHAMP}
            >
              {evenements.map((option) => (
                <option key={option.cle} value={option.cle}>
                  {option.libelle}
                </option>
              ))}
            </select>
          </Champ>
        ) : (
          <>
            <Champ libelle={t("m7.selecteur.date_debut")} pour="m7-debut">
              <input
                id="m7-debut"
                type="date"
                value={etat.debut ?? ""}
                max={etat.fin ?? undefined}
                onChange={(evenement) => naviguer({ debut: evenement.target.value || null })}
                style={STYLE_CHAMP}
              />
            </Champ>
            <Champ libelle={t("m7.selecteur.date_fin")} pour="m7-fin">
              <input
                id="m7-fin"
                type="date"
                value={etat.fin ?? ""}
                min={etat.debut ?? undefined}
                onChange={(evenement) => naviguer({ fin: evenement.target.value || null })}
                style={STYLE_CHAMP}
              />
            </Champ>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-end" style={{ gap: "var(--space-5)" }}>
        <Champ libelle={t("controle.filtre.gamme")}>
          <div role="group" aria-label={t("controle.filtre.gamme")} className="flex flex-wrap" style={{ gap: "var(--space-2)" }}>
            <Pastille actif={etat.gammes.length === 0} surClic={() => naviguer({ gammes: [] })}>
              {t("controle.filtre.toutes")}
            </Pastille>
            {gammes.map((gamme) => (
              <Pastille key={gamme.cle} actif={etat.gammes.includes(gamme.cle)} surClic={() => basculerGamme(gamme.cle)}>
                {gamme.libelle}
              </Pastille>
            ))}
          </div>
        </Champ>

        <Champ libelle={t("m7.filtre.capacite_salle")} pour="m7-salle">
          <select
            id="m7-salle"
            value={etat.salleMin === null ? "" : String(etat.salleMin)}
            onChange={(evenement) =>
              naviguer({ salleMin: evenement.target.value ? Number(evenement.target.value) : null })
            }
            style={STYLE_CHAMP}
          >
            <option value="">{t("m7.filtre.aucune")}</option>
            {capacitesSalle.map((capacite) => (
              <option key={capacite} value={capacite}>
                {t("m7.filtre.places", { n: capacite })}
              </option>
            ))}
          </select>
        </Champ>
      </div>
    </div>
  );
}

function Champ({ libelle, pour, children }: { libelle: string; pour?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
      {pour ? (
        <label htmlFor={pour} className="etiquette">
          {libelle}
        </label>
      ) : (
        <span className="etiquette">{libelle}</span>
      )}
      {children}
    </div>
  );
}

function Segment({
  actif,
  desactive = false,
  surClic,
  children,
}: {
  actif: boolean;
  desactive?: boolean;
  surClic: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      disabled={desactive}
      onClick={surClic}
      className="disabled:opacity-50"
      style={{
        padding: "var(--space-2) var(--space-4)",
        fontSize: "var(--text-small)",
        fontWeight: actif ? 600 : 500,
        backgroundColor: actif ? "var(--color-primary-700)" : "var(--color-bg)",
        color: actif ? "var(--color-on-primary)" : "var(--color-text-secondary)",
        transition: "background-color 150ms ease-out, color 150ms ease-out",
      }}
    >
      {children}
    </button>
  );
}

function Pastille({ actif, surClic, children }: { actif: boolean; surClic: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={surClic}
      style={{
        padding: "var(--space-1) var(--space-3)",
        fontSize: "var(--text-small)",
        fontWeight: actif ? 600 : 500,
        borderRadius: "var(--rayon)",
        border: `1px solid ${actif ? "var(--color-primary-700)" : "var(--color-border-strong)"}`,
        backgroundColor: actif ? "var(--color-primary-700)" : "var(--color-bg)",
        color: actif ? "var(--color-on-primary)" : "var(--color-text-secondary)",
        transition: "background-color 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out",
      }}
    >
      {children}
    </button>
  );
}
