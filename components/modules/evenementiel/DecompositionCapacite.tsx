import { EtatVide } from "@/components/states/EtatVide";
import { TRAME_SANS_DONNEE } from "@/components/charts/geometrie";
import { formatNombre } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Zone 3 de M7_EVENEMENTIEL (document 9 ter, J.8 et J.10, criteres J.11.1 et
 * J.11.2).
 *
 * La capacite mobilisable n'est jamais presentee en total unique. Trois parts
 * de fiabilite differente, chacune sur sa propre barre, toutes a l'echelle de
 * la capacite recensee :
 *   partenaires disponibles, seule disponibilite reellement connue ;
 *   recenses non reservables, capacite theorique, en teinte claire pour qu'elle
 *   ne se lise pas comme du disponible ;
 *   deja vendu, retire du disponible.
 *
 * Trois barres et non une barre empilee : les parts ne portent pas le meme
 * statut de donnee (le vendu est observe, le recense est recense), et un
 * graphique ne melange jamais deux statuts.
 *
 * Masquage M1 : sous trois partenaires, ou quand l'un porte plus de la moitie
 * des unites, le vendu et le disponible partenaire ne sont pas publies. Les
 * deux lignes restent a l'ecran, trame et libelle invariable : la decomposition
 * garde ses trois parts, meme quand deux sont non publiees.
 */
type Part = {
  cle: "partenaires" | "recenses" | "vendu";
  valeur: number | null;
  teinte: string;
};

export function DecompositionCapacite({
  capaciteRecensee,
  partenairesDisponibles,
  recensesNonReservables,
  dejaVendu,
  masque,
}: {
  capaciteRecensee: number;
  partenairesDisponibles: number | null;
  recensesNonReservables: number;
  dejaVendu: number | null;
  masque: boolean;
}) {
  if (capaciteRecensee === 0) {
    return <EtatVide libelle={t("state.vide.capacite_decomposer")} />;
  }

  const parts: Part[] = [
    { cle: "partenaires", valeur: masque ? null : partenairesDisponibles, teinte: "var(--color-primary-700)" },
    { cle: "recenses", valeur: recensesNonReservables, teinte: "var(--seq-2)" },
    { cle: "vendu", valeur: masque ? null : dejaVendu, teinte: "var(--color-border-strong)" },
  ];

  return (
    <ul className="flex flex-col" style={{ gap: "var(--space-5)" }}>
      {parts.map((part) => {
        const nonPubliee = part.valeur === null;
        const largeur = nonPubliee ? 100 : Math.max(0, Math.min(100, (part.valeur! / capaciteRecensee) * 100));
        return (
          <li key={part.cle} className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <div className="flex items-baseline justify-between" style={{ gap: "var(--space-4)" }}>
              <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                <span style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text)" }}>
                  {t(`m7.z3.${part.cle}`)}
                </span>
                <span style={{ fontSize: "var(--text-meta)", lineHeight: 1.4, color: "var(--color-text-muted)" }}>
                  {t(`m7.z3.${part.cle}.aide`)}
                </span>
              </span>
              <span
                className="chiffres-tabulaires shrink-0"
                style={{
                  fontFamily: nonPubliee ? "var(--font-texte)" : "var(--font-titre)",
                  fontSize: nonPubliee ? "var(--text-meta)" : "var(--text-h2)",
                  fontWeight: nonPubliee ? 500 : 700,
                  color: nonPubliee ? "var(--color-text-muted)" : "var(--color-text)",
                }}
              >
                {nonPubliee ? t("state.masque_court") : formatNombre(part.valeur!)}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="h-3 w-full"
              style={{ backgroundColor: "var(--color-bg-panel)", borderRadius: "2px" }}
            >
              <div
                className="h-3"
                style={{
                  width: `${largeur}%`,
                  minWidth: largeur > 0 ? "2px" : 0,
                  borderRadius: "2px",
                  backgroundColor: nonPubliee ? "var(--hachure-fond)" : part.teinte,
                  backgroundImage: nonPubliee ? TRAME_SANS_DONNEE : undefined,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
