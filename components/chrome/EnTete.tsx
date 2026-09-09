import Image from "next/image";
import Link from "next/link";
import logoEditeur from "@/public/Logo réactualisé.svg";
import { t } from "@/lib/i18n";
import type { MonCompte } from "@/lib/queries/compte";
import type { ValeurEnumeration } from "@/lib/enumerations";
import { SelecteurProfilDev } from "@/components/chrome/SelecteurProfilDev";

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
export function EnTete({
  compte,
  profilsDev = [],
}: {
  compte: MonCompte;
  profilsDev?: ValeurEnumeration[];
}) {
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
      <Link href="/synthese" className="flex min-w-0 items-center" style={{ gap: "var(--space-4)" }}>
        <Image
          src={logoEditeur}
          alt={t("app.editeur")}
          height={40}
          priority
          style={{ height: "40px", width: "auto" }}
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
      </Link>

      <div className="flex shrink-0 items-center" style={{ gap: "var(--space-5)" }}>
        {profilsDev.length > 0 && (
          <SelecteurProfilDev profilCourant={compte.profil} profils={profilsDev} />
        )}
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
