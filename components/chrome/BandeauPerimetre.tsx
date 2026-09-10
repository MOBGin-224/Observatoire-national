import { t } from "@/lib/i18n";
import { formatNombre, formatPourcentage, formatDateHeure } from "@/lib/format";
import type { Perimetre } from "@/lib/queries/perimetre";

/*
 * Document 9, A.1 : non masquable, present sur tous les ecrans, reste visible
 * apres defilement. Document 4, regle M0 : les volumes bruts s'affichent
 * toujours, y compris a zero.
 *
 * Deux variantes, document 15 section 6, determinees par le profil du compte
 * et par lui seul, jamais par un choix d'utilisateur.
 *
 * La variante institutionnelle ne porte aucune donnee du portefeuille
 * commercial de Simandou Sejour : le nombre de partenaires et la capacite
 * couverte decrivent l'entreprise, pas le secteur. La numerisation du parc est
 * mesuree a la place par le nombre d'etablissements reservables en ligne,
 * toutes plateformes confondues, et la representativite par la part du pays
 * que l'inventaire couvre.
 *
 * Trois elements ne sont jamais conditionnels, dans aucune variante : la
 * taille du perimetre recense, la date et l'heure d'observation, et la mention
 * de non-exhaustivite. Ils ne dependent d'aucune propriete. C'est la fonction
 * meme du bandeau : la probite, pas la decoration.
 *
 * Presentation en couples etiquette/valeur plutot qu'en phrase courante : c'est
 * la seule forme qui reste lisible en projection a trois metres, et c'est aussi
 * celle qui se transpose telle quelle dans l'export PDF (document 8, section 10).
 */
function Mesure({ etiquette, valeur }: { etiquette: string; valeur: string }) {
  return (
    <div className="flex flex-col" style={{ gap: "1px" }}>
      <span className="etiquette" style={{ color: "var(--color-text-muted)" }}>
        {etiquette}
      </span>
      <span
        className="chiffres-tabulaires"
        style={{
          fontFamily: "var(--font-titre)",
          fontSize: "var(--text-h3)",
          fontWeight: 600,
          color: "var(--color-primary-700)",
        }}
      >
        {valeur}
      </span>
    </div>
  );
}

function Separateur() {
  return (
    <span
      aria-hidden="true"
      style={{ width: "1px", alignSelf: "stretch", backgroundColor: "var(--color-border)" }}
    />
  );
}

export function BandeauPerimetre({
  perimetre,
  profil,
}: {
  perimetre: Perimetre | null;
  /* Code de profil du compte. La variante interne est reservee a ADMIN. */
  profil: string;
}) {
  const varianteInterne = profil === "ADMIN";

  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center"
      style={{
        gap: "var(--space-6)",
        padding: "var(--space-3) var(--space-8)",
        backgroundColor: "var(--color-bg-panel)",
        borderBottom: "1px solid var(--color-border-strong)",
        borderLeft: "var(--filet-accent) solid var(--color-success)",
      }}
    >
      <span className="etiquette" style={{ color: "var(--color-text-secondary)" }}>
        {t("perimetre.titre")}
      </span>
      <Separateur />

      {perimetre ? (
        <>
          <Mesure
            etiquette={t("perimetre.label.etablissements")}
            valeur={formatNombre(perimetre.etablissementsRecenses)}
          />
          {varianteInterne ? (
            <>
              <Mesure
                etiquette={t("perimetre.label.partenaires")}
                valeur={formatNombre(perimetre.partenaires)}
              />
              <Mesure
                etiquette={t("perimetre.label.couverture")}
                valeur={
                  perimetre.tauxCouverture !== null
                    ? formatPourcentage(perimetre.tauxCouverture)
                    : t("state.non_renseigne")
                }
              />
              <Mesure
                etiquette={t("perimetre.label.verifiees")}
                valeur={
                  perimetre.tauxVerification !== null
                    ? formatPourcentage(perimetre.tauxVerification)
                    : t("state.non_renseigne")
                }
              />
            </>
          ) : (
            <>
              <Mesure
                etiquette={t("perimetre.label.reservables")}
                valeur={formatNombre(perimetre.reservablesEnLigne)}
              />
              <Mesure
                etiquette={t("perimetre.label.territoires")}
                valeur={t("perimetre.valeur.rapport", {
                  n: formatNombre(perimetre.territoiresCouverts),
                  total: formatNombre(perimetre.territoiresTotal),
                })}
              />
            </>
          )}
          <Separateur />
          <Mesure
            etiquette={t("perimetre.label.observation")}
            valeur={formatDateHeure(perimetre.calculeA)}
          />
        </>
      ) : (
        <span style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
          {t("state.vide.defaut")}
        </span>
      )}

      {/* Document 9, A.1 : l'avertissement de portee accompagne le perimetre. */}
      <p
        className="min-w-[16rem] flex-1 text-right"
        style={{ fontSize: "var(--text-meta)", lineHeight: 1.4, color: "var(--color-text-muted)" }}
      >
        {t("perimetre.avertissement")}
      </p>
    </div>
  );
}
