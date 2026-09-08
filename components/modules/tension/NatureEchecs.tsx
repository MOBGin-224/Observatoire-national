import { createClient } from "@/lib/supabase/server";
import { EtatVide } from "@/components/states/EtatVide";
import { formatNombre, formatPourcentage } from "@/lib/format";
/*
 * Z2, nature des recherches infructueuses (document 9, D.5/D.7) : "la zone la
 * plus importante de l'outil". Les quatre natures d'echec restent toujours
 * distinguees, jamais agregees en un total unique. --color-alert reserve aux
 * deux natures directement liees a la tension (AUCUNE_OFFRE, OFFRE_INDISPONIBLE),
 * document 9 D.3 et D.9.
 */
const COULEUR: Record<string, string> = {
  AUCUNE_OFFRE: "var(--color-alert)",
  OFFRE_INDISPONIBLE: "var(--color-alert)",
  NON_RESERVABLE: "var(--color-primary)",
  HORS_PERIMETRE: "var(--color-text-muted)",
};

const ORDRE = ["AUCUNE_OFFRE", "OFFRE_INDISPONIBLE", "NON_RESERVABLE", "HORS_PERIMETRE"];

export async function NatureEchecs({ valeurs }: { valeurs: Record<string, number> }) {
  const total = Object.values(valeurs).reduce((s, n) => s + n, 0);

  if (total === 0) {
    return <EtatVide libelle="Aucune recherche infructueuse sur la période." />;
  }

  const supabase = await createClient();
  const { data: libelles } = await supabase
    .from("enumeration")
    .select("code, libelle_fr")
    .eq("domaine", "STATUT_RESULTAT");
  const libelleParCode = new Map((libelles ?? []).map((l) => [l.code, l.libelle_fr]));

  const segments = ORDRE.filter((code) => valeurs[code]).map((code) => ({
    code,
    n: valeurs[code],
    part: (valeurs[code] / total) * 100,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-4 w-full overflow-hidden rounded" style={{ backgroundColor: "var(--color-bg-subtle)" }}>
        {segments.map((s) => (
          <div key={s.code} style={{ width: `${s.part}%`, backgroundColor: COULEUR[s.code] }} title={libelleParCode.get(s.code) ?? s.code} />
        ))}
      </div>
      <ul className="flex flex-col gap-1.5">
        {segments.map((s) => (
          <li key={s.code} className="flex items-center gap-2" style={{ fontSize: "var(--text-small)" }}>
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: COULEUR[s.code] }}
            />
            <span style={{ color: "var(--color-text-secondary)" }}>
              {libelleParCode.get(s.code) ?? s.code}
            </span>
            <span style={{ color: "var(--color-text-muted)", marginLeft: "auto" }}>
              {formatNombre(s.n)} · {formatPourcentage(s.part)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
