import { createClient } from "@/lib/supabase/server";
import { EtatVide } from "@/components/states/EtatVide";
import { formatNombre } from "@/lib/format";

/*
 * Repartition en barres horizontales, reutilisee par tous les modules
 * (document 9). Pas de camembert ni d'anneau (document 8, section 2.5 ;
 * document 11, section 12 : interdictions verifiables sur /components/charts).
 * `domaine` resout les libelles depuis la table enumeration (document 11,
 * section 8). Sans domaine (ex : codes pays ISO, hors enumeration du
 * document 2), les codes bruts sont affiches tels quels.
 */
export async function Repartition({
  titre,
  domaine,
  valeurs,
}: {
  titre: string;
  domaine?: string;
  valeurs: Record<string, number>;
}) {
  const entrees = Object.entries(valeurs).sort((a, b) => b[1] - a[1]);
  const total = entrees.reduce((s, [, n]) => s + n, 0);

  if (entrees.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h3 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)" }}>{titre}</h3>
        <EtatVide />
      </div>
    );
  }

  let libelleParCode = new Map<string, string>();
  if (domaine) {
    const supabase = await createClient();
    const { data: libelles } = await supabase
      .from("enumeration")
      .select("code, libelle_fr")
      .eq("domaine", domaine);
    libelleParCode = new Map((libelles ?? []).map((l) => [l.code, l.libelle_fr]));
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)" }}>{titre}</h3>
      <div className="flex flex-col gap-1.5">
        {entrees.map(([code, n]) => {
          const part = total > 0 ? (n / total) * 100 : 0;
          return (
            <div key={code} className="flex items-center gap-2">
              <span
                className="w-32 shrink-0 truncate"
                style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
              >
                {libelleParCode.get(code) ?? code}
              </span>
              <div
                className="h-3 flex-1 rounded"
                style={{ backgroundColor: "var(--color-bg-subtle)" }}
              >
                <div
                  className="h-3 rounded"
                  style={{ width: `${part}%`, backgroundColor: "var(--color-primary)" }}
                />
              </div>
              <span
                className="w-10 shrink-0 text-right"
                style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}
              >
                {formatNombre(n)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
