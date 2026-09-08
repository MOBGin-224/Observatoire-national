import { EtatDonnee } from "@/components/states/EtatDonnee";
import { appliquerM0 } from "@/lib/masking";
import { resoudreIndicateur } from "@/lib/indicators";
import { formatNombre, formatPourcentage } from "@/lib/format";

/*
 * Un bloc d'indicateur cle (document 9, B.5, zone Z1). Ne connait jamais son
 * libelle en dur : il connait son code et interroge lib/indicators
 * (document 11, section 6.4).
 */
export async function BlocIndicateurCle({
  code,
  valeur,
  calculeA,
}: {
  code: string;
  valeur: number | null;
  calculeA: string;
}) {
  const meta = await resoudreIndicateur(code);
  const etat = appliquerM0(valeur);

  return (
    <div
      className="flex flex-col gap-1 rounded border p-4"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
    >
      <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
        {meta?.libelleFr ?? code}
      </span>

      <EtatDonnee
        etat={etat}
        statutDonnee={meta?.statutDonnee ?? undefined}
        calculeA={calculeA}
      >
        {(v) => (
          <span
            style={{
              fontFamily: "var(--font-titre)",
              fontSize: "var(--text-display)",
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            {meta?.unite === "pourcentage"
              ? formatPourcentage(v, meta?.decimales ?? 1)
              : formatNombre(v, meta?.decimales ?? 0)}
          </span>
        )}
      </EtatDonnee>
    </div>
  );
}
