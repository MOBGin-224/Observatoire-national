import Image from "next/image";
import Link from "next/link";
import logoEditeur from "@/public/Logo réactualisé.svg";
import iconeEditeur from "@/public/Icône.svg";
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
  profilLibelle,
  profilsDev = [],
}: {
  compte: MonCompte;
  /* Libelle du profil, resolu depuis la table enumeration (document 11, section 8). */
  profilLibelle: string;
  profilsDev?: ValeurEnumeration[];
}) {
  return (
    <header
      className="entete-outil flex shrink-0 items-center"
      style={{
        height: "var(--hauteur-entete)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <Link
        href="/synthese"
        className="entete-marque flex shrink-0 items-center justify-center"
        aria-label={t("app.editeur")}
      >
        <Image
          src={logoEditeur}
          alt={t("app.editeur")}
          className="logo-editeur-deplie"
          height={34}
          priority
        />
        <span
          className="logo-editeur-replie"
          aria-hidden="true"
        >
          <Image src={iconeEditeur} alt="" width={30} height={32} priority />
        </span>
      </Link>

      <div
        className="entete-contenu flex min-w-0 flex-1 items-center justify-between"
        style={{ padding: "0 var(--space-6)", gap: "var(--space-5)" }}
      >
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

        <div className="flex shrink-0 items-center" style={{ gap: "var(--space-5)" }}>
        {profilsDev.length > 0 && (
          <SelecteurProfilDev profilCourant={compte.profil} profils={profilsDev} />
        )}
        {/*
         * Le profil seul, sans nom de personne ni denomination d'institution.
         * L'utilisateur sait qui il est et pour qui il travaille ; ce qui lui
         * est utile en permanence, c'est le point de vue depuis lequel il lit
         * les chiffres, puisqu'il conditionne les modules et le perimetre.
         *
         * C'est aussi ce qui evite qu'une capture d'ecran de l'outil circule
         * en portant le nom d'un agent.
         */}
        <span className="etiquette" style={{ color: "var(--color-text-secondary)" }}>
          {profilLibelle}
        </span>
        </div>
      </div>
    </header>
  );
}
