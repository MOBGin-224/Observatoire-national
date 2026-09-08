import { LoginForm } from "@/components/auth/LoginForm";
import { t } from "@/lib/i18n";

/*
 * Ecran de connexion, document 9 partie A.0.
 * Unique, centre, sobre. Aucune image d'illustration, aucune animation,
 * aucun contenu descriptif du produit. Aucun lien ne quitte cet ecran
 * hormis la reinitialisation de mot de passe.
 */
export default function EcranConnexion() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <h1
          style={{
            fontFamily: "var(--font-titre)",
            fontSize: "var(--text-h1)",
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          {t("auth.titre")}
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-body)" }}>
          {t("auth.accroche")}
        </p>
      </div>

      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-small)" }}>
        {t("auth.sous_titre")}
      </p>

      <LoginForm />

      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-meta)" }}>
        {t("app.attribution")}
      </p>
    </div>
  );
}
