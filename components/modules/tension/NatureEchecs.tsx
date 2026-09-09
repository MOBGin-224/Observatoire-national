import { createClient } from "@/lib/supabase/server";
import { EtatVide } from "@/components/states/EtatVide";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Z2, nature des recherches infructueuses (document 9, D.5 et D.7) : "la zone la
 * plus importante de l'outil".
 *
 * L'ecran ne se contente pas de repartir des effectifs, il nomme une
 * responsabilite. Le document 9, D.3, associe a chaque etat d'echec ce qui
 * manque et qui doit agir ; ces deux colonnes sont posees a cote de chaque
 * ligne. Sans elles, la repartition se lit comme une statistique ; avec elles,
 * elle se lit comme une commande publique.
 *
 * Pourquoi un composant dedie plutot que BarreRepartition : la barre generique
 * teinte ses segments avec la rampe sequentielle, qui suppose une variable
 * ordonnee (une gamme tarifaire va de l'economique au haut de gamme). Les etats
 * d'echec ne sont pas ordonnes, et le document 9, D.7 et D.9, reserve
 * --color-alert aux deux seuls etats qui traduisent une tension reelle. Une
 * rampe ordonnee mentirait deux fois : sur l'ordre et sur l'alerte.
 *
 * Pas de ligne de total : le document 9, D.9, interdit d'agreger les quatre
 * etats en un total unique. Le detail suffit, chaque ligne portant son effectif
 * et sa part.
 */

/* Document 9, D.3 et D.9 : --color-alert sur les deux seuls etats qui disent une
   tension, jamais ailleurs sur cet ecran. */
const COULEUR: Record<string, string> = {
  AUCUNE_OFFRE: "var(--color-alert)",
  OFFRE_INDISPONIBLE: "var(--color-alert)",
  NON_RESERVABLE: "var(--color-primary-500)",
  HORS_PERIMETRE: "var(--color-text-muted)",
};

/* Ordre d'exposition, du manque le plus structurel au moins actionnable. */
const ORDRE = ["AUCUNE_OFFRE", "OFFRE_INDISPONIBLE", "NON_RESERVABLE", "HORS_PERIMETRE"];

/* HORS_PERIMETRE n'a pas de ligne dans la table du document 9, D.3 : aucun
   libelle n'est invente pour lui, ses deux colonnes tombent sur le repli
   documente. */
const DOCUMENTES = new Set(["AUCUNE_OFFRE", "OFFRE_INDISPONIBLE", "NON_RESERVABLE"]);

export async function NatureEchecs({ valeurs }: { valeurs: Record<string, number> }) {
  const total = Object.values(valeurs).reduce((somme, n) => somme + n, 0);

  if (total === 0) {
    return <EtatVide libelle={t("state.vide.echecs")} />;
  }

  const supabase = await createClient();
  const { data: libelles } = await supabase
    .from("enumeration")
    .select("code, libelle_fr")
    .eq("domaine", "STATUT_RESULTAT");
  const libelleParCode = new Map((libelles ?? []).map((l) => [l.code, l.libelle_fr]));

  const segments = ORDRE.filter((code) => valeurs[code]).map((code) => ({
    code,
    libelle: libelleParCode.get(code) ?? code,
    effectif: valeurs[code],
    part: (valeurs[code] / total) * 100,
    documente: DOCUMENTES.has(code),
  }));

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
      <div
        className="flex overflow-hidden"
        style={{ height: "28px", borderRadius: "2px", gap: "2px" }}
        role="img"
        aria-label={segments
          .map((s) => `${s.libelle} ${formatNombre(s.effectif)}`)
          .join(", ")}
      >
        {segments.map((segment) => (
          <div
            key={segment.code}
            style={{
              width: `${segment.part}%`,
              backgroundColor: COULEUR[segment.code],
            }}
            title={`${segment.libelle} : ${formatNombre(segment.effectif)}`}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ fontSize: "var(--text-small)", lineHeight: 1.4 }}
        >
          <thead>
            <tr style={{ backgroundColor: "var(--color-primary-700)" }}>
              <EnTeteColonne libelle={t("module.m4.colonne_etat")} />
              <EnTeteColonne libelle={t("module.m4.colonne_manque")} />
              <EnTeteColonne libelle={t("module.m4.colonne_agir")} />
              <EnTeteColonne libelle={t("module.m4.colonne_recherches")} aDroite />
              <EnTeteColonne libelle={t("module.m4.colonne_part")} aDroite />
            </tr>
          </thead>

          <tbody>
            {segments.map((segment, index) => (
              <tr
                key={segment.code}
                style={{
                  backgroundColor:
                    index % 2 === 1 ? "var(--color-bg-subtle)" : "var(--color-bg)",
                  borderBottom: "1px solid var(--color-border-faint)",
                }}
              >
                <th
                  scope="row"
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "left",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="flex items-center" style={{ gap: "var(--space-2)" }}>
                    <span
                      aria-hidden="true"
                      className="shrink-0"
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "2px",
                        backgroundColor: COULEUR[segment.code],
                      }}
                    />
                    {segment.libelle}
                  </span>
                </th>
                <CelluleTexte
                  texte={
                    segment.documente
                      ? t(`module.m4.manque.${segment.code}`)
                      : t("state.non_renseigne")
                  }
                  attenue={!segment.documente}
                />
                <CelluleTexte
                  texte={
                    segment.documente
                      ? t(`module.m4.agir.${segment.code}`)
                      : t("state.non_renseigne")
                  }
                  attenue={!segment.documente}
                />
                <td
                  className="chiffres-tabulaires"
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "right",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatNombre(segment.effectif)}
                </td>
                <td
                  className="chiffres-tabulaires"
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "right",
                    color: "var(--color-text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatPourcentage(segment.part)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EnTeteColonne({ libelle, aDroite = false }: { libelle: string; aDroite?: boolean }) {
  return (
    <th
      scope="col"
      className="etiquette"
      style={{
        padding: "var(--space-3)",
        textAlign: aDroite ? "right" : "left",
        color: "var(--color-on-primary-muted)",
        whiteSpace: "nowrap",
      }}
    >
      {libelle}
    </th>
  );
}

function CelluleTexte({ texte, attenue }: { texte: string; attenue: boolean }) {
  return (
    <td
      style={{
        padding: "var(--space-3)",
        textAlign: "left",
        color: attenue ? "var(--color-text-muted)" : "var(--color-text-secondary)",
      }}
    >
      {texte}
    </td>
  );
}
