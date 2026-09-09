import { formatNombre } from "@/lib/format";

/*
 * Bullet graph (Few, 2006) : une mesure, une échelle, et un repère de
 * comparaison posé sur la même règle.
 *
 * Forme retenue pour la zone de conversion du module M3. Le document 9 quater,
 * K.7, impose de ne jamais montrer le taux de conversion sans le taux de
 * couverture en regard : « un taux de conversion de 1,2 % lu seul se comprend
 * comme une contre-performance commerciale ; lu à côté d'un taux de couverture
 * de 6,7 %, il se comprend comme une conséquence mécanique de la couverture ».
 *
 * Deux blocs d'indicateur côte à côte ne produisent pas cette lecture : l'œil
 * compare deux nombres, pas deux positions. Le bullet graph pose les deux sur la
 * même règle, et le rapport devient visible sans calcul. C'est exactement ce que
 * la fiche du module demande.
 */
export function BulletGraph({
  valeur,
  repere,
  maximum = 100,
  libelleValeur,
  libelleRepere,
  suffixe = " %",
  decimales = 1,
  teinte = "var(--color-primary-700)",
}: {
  valeur: number;
  repere: number | null;
  maximum?: number;
  libelleValeur: string;
  libelleRepere: string;
  suffixe?: string;
  decimales?: number;
  teinte?: string;
}) {
  const borner = (v: number) => Math.max(0, Math.min(100, (v / maximum) * 100));

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
      <div
        className="relative"
        style={{
          height: "34px",
          borderRadius: "2px",
          /* Trois bandes qualitatives, du plus clair au plus foncé, qui donnent
             l'échelle sans exiger de lire une graduation. */
          background:
            "linear-gradient(to right, var(--color-bg-panel) 0%, var(--color-bg-panel) 33%, var(--color-primary-050) 33%, var(--color-primary-050) 66%, var(--color-primary-100) 66%)",
        }}
      >
        {/* La mesure, barre pleine centrée sur la hauteur. */}
        <div
          style={{
            position: "absolute",
            top: "9px",
            left: 0,
            height: "16px",
            width: `${borner(valeur)}%`,
            minWidth: valeur > 0 ? "3px" : 0,
            backgroundColor: teinte,
            borderRadius: "2px",
          }}
        />

        {/* Le repère de comparaison, trait vertical traversant. */}
        {repere !== null && (
          <div
            title={`${libelleRepere} : ${formatNombre(repere, decimales)}${suffixe}`}
            style={{
              position: "absolute",
              top: "2px",
              bottom: "2px",
              left: `${borner(repere)}%`,
              width: "3px",
              transform: "translateX(-1.5px)",
              backgroundColor: "var(--color-success)",
              borderRadius: "1px",
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap items-baseline" style={{ gap: "var(--space-2) var(--space-6)" }}>
        <Mention
          pastille={teinte}
          libelle={libelleValeur}
          valeur={`${formatNombre(valeur, decimales)}${suffixe}`}
        />
        {repere !== null && (
          <Mention
            pastille="var(--color-success)"
            libelle={libelleRepere}
            valeur={`${formatNombre(repere, decimales)}${suffixe}`}
          />
        )}
      </div>
    </div>
  );
}

function Mention({
  pastille,
  libelle,
  valeur,
}: {
  pastille: string;
  libelle: string;
  valeur: string;
}) {
  return (
    <span className="flex items-baseline" style={{ gap: "var(--space-2)" }}>
      <span
        aria-hidden="true"
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "2px",
          backgroundColor: pastille,
          transform: "translateY(1px)",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
        {libelle}
      </span>
      <span
        className="chiffres-tabulaires"
        style={{ fontSize: "var(--text-small)", fontWeight: 700, color: "var(--color-text)" }}
      >
        {valeur}
      </span>
    </span>
  );
}
