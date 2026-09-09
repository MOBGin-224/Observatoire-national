import Image from "next/image";
import logoEditeur from "@/public/simandou-sejour.svg";
import { t } from "@/lib/i18n";
import type { MonCompte } from "@/lib/queries/compte";

/*
 * En-tete de l'outil. La marque de l'editeur occupe le coin superieur gauche,
 * suivie d'un filet vertical puis du titre du produit.
 *
 * A ne pas confondre avec la regle 6 du CLAUDE.md ("aucune institution n'existe
 * dans le code") : cette regle vise les institutions partenaires, dont le nom et
 * le logo sont des donnees de configuration en base. La marque de l'editeur, elle,
 * fait partie du produit, au meme titre que la mention d'attribution du
 * document 8, section 10, et son libelle vient du catalogue, pas du composant.
 */
export function EnTete({ compte }: { compte: MonCompte }) {
  return (
    <header
      className="flex shrink-0 items-center justify-between"
      style={{
        height: "var(--hauteur-entete)",
        padding: "0 var(--space-6)",
        gap: "var(--space-5)",
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="flex min-w-0 items-center" style={{ gap: "var(--space-4)" }}>
        <Image
          src={logoEditeur}
          alt={t("app.editeur")}
          height={30}
          priority
          style={{ height: "30px", width: "auto" }}
        />
        <span
          aria-hidden="true"
          style={{ width: "1px", height: "28px", backgroundColor: "var(--color-border)" }}
        />
        <span
          className="truncate"
          style={{
            fontFamily: "var(--font-titre)",
            fontSize: "var(--text-h2)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-titre)",
            color: "var(--color-primary-700)",
          }}
        >
          {t("app.titre")}
        </span>
      </div>

      <div className="flex shrink-0 items-center" style={{ gap: "var(--space-5)" }}>
        {compte.institutionDenomination && (
          <span
            className="etiquette"
            style={{ color: "var(--color-text-muted)" }}
            title={compte.institutionDenomination}
          >
            {compte.institutionDenomination}
          </span>
        )}
        <span
          aria-hidden="true"
          style={{ width: "1px", height: "18px", backgroundColor: "var(--color-border)" }}
        />
        <span style={{ fontSize: "var(--text-small)", fontWeight: 500, color: "var(--color-text)" }}>
          {compte.prenom} {compte.nom}
        </span>
      </div>
    </header>
  );
}
