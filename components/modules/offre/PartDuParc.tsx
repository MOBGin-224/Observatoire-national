import { appliquerM2 } from "@/lib/masking";
import { formatNombre, formatPourcentage } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Part des etablissements partenaires dans le parc recense, posee en pied du
 * bloc cle correspondant.
 *
 * Passe par la regle M2 (CLAUDE.md, regles de masquage) : en dessous de dix
 * observations le ratio s'ecrit en effectifs, "2 sur 3", jamais "66,7 %". Un
 * pourcentage sur trois etablissements donne une fausse impression de precision,
 * et c'est exactement le genre de chiffre qui se retrouve cite dans un rapport.
 */
export function PartDuParc({ partenaires, recenses }: { partenaires: number; recenses: number }) {
  const ratio = appliquerM2(partenaires, recenses);
  if (ratio.etat === "vide") return null;

  const part = ratio.etat === "pourcentage" ? ratio.valeur : (partenaires / recenses) * 100;
  const texte =
    ratio.etat === "pourcentage"
      ? t("module.m1.part_du_parc", { p: formatPourcentage(ratio.valeur) })
      : t("module.m1.part_du_parc_effectifs", {
          n: formatNombre(ratio.numerateur),
          d: formatNombre(ratio.denominateur),
        });

  return (
    <span className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <span
        aria-hidden="true"
        className="block w-full"
        style={{ height: "6px", backgroundColor: "var(--color-border-faint)", borderRadius: "2px" }}
      >
        <span
          className="block h-full"
          style={{
            width: `${Math.max(0, Math.min(100, part))}%`,
            backgroundColor: "var(--color-success)",
            borderRadius: "2px",
          }}
        />
      </span>
      <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
        {texte}
      </span>
    </span>
  );
}
