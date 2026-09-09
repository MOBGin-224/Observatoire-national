import { t } from "@/lib/i18n";
import { formatDateHeure } from "@/lib/format";

/*
 * Pied de page present a l'export uniquement (document 8, section 10) :
 * mention d'attribution, compte emetteur, horodatage.
 *
 * La navigation laterale, qui porte la mention d'attribution a l'ecran, est
 * retiree de l'export ; c'est ce pied qui la reprend, faute de quoi l'export
 * circulerait sans attribution, ce que le document 8, section 11, interdit.
 *
 * La reference unique d'export reste a produire cote serveur : elle doit etre
 * enregistree pour etre opposable, donc elle ne peut pas etre tiree au rendu.
 */
export function PiedImpression({ emetteur, date }: { emetteur: string; date: string }) {
  return (
    <footer
      className="hidden print:flex print:flex-wrap print:items-baseline"
      style={{
        gap: "var(--space-4)",
        marginTop: "var(--space-6)",
        paddingTop: "var(--space-3)",
        borderTop: "1px solid var(--color-border-strong)",
        fontSize: "var(--text-meta)",
        color: "var(--color-text-secondary)",
      }}
    >
      <span style={{ fontWeight: 600 }}>{t("app.attribution")}</span>
      <span>
        {t("impression.emis_par")} {emetteur}
      </span>
      <span className="chiffres-tabulaires">{formatDateHeure(date)}</span>
    </footer>
  );
}
