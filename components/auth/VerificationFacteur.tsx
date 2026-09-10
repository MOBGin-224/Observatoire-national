"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";
import { obtenirCodeTotpDev } from "@/lib/actions/dev-mfa";
import { executerAction } from "@/lib/erreurs";

/*
 * Verification du second facteur a chaque connexion (document 7, section 10),
 * une fois qu'un facteur TOTP verifie existe deja sur le compte. Etape de
 * l'ecran de connexion unique (document 9, A.0), pas une nouvelle surface.
 *
 * `devModeActif` n'affiche un bouton de remplissage automatique qu'en
 * developpement (voir lib/actions/dev-mfa.ts) : il calcule un vrai code TOTP
 * a partir de la cle secrete du compte de test, il ne contourne jamais la
 * verification. Absent de toute build de production.
 */
export function VerificationFacteur({
  factorId,
  devModeActif = false,
}: {
  factorId: string;
  devModeActif?: boolean;
}) {
  const router = useRouter();
  const identifiantCode = useId();
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function remplirCodeDev() {
    setErreur(null);
    const issue = await executerAction(() => obtenirCodeTotpDev());
    if (!issue.ok) {
      setErreur(t(issue.cle));
      return;
    }
    if (issue.valeur) setCode(issue.valeur);
  }

  async function verifier(evenement: React.FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEnCours(true);

    const issue = await executerAction(async () => {
      const supabase = createClient();
      return supabase.auth.mfa.challengeAndVerify({ factorId, code });
    });

    setEnCours(false);

    /* Panne d'appel : ni code juste, ni code faux, on ne dit pas "code incorrect". */
    if (!issue.ok) {
      setErreur(t(issue.cle));
      return;
    }

    if (issue.valeur.error) {
      setErreur(t("auth.erreur.code_invalide"));
      return;
    }

    router.push("/synthese");
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col" style={{ gap: "var(--space-6)" }}>
      <header className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <h2
          style={{
            fontFamily: "var(--font-titre)",
            fontSize: "var(--text-h2)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-titre)",
            color: "var(--color-text)",
          }}
        >
          {t("auth.mfa.titre_verification")}
        </h2>
        <p
          style={{
            fontSize: "var(--text-small)",
            lineHeight: 1.55,
            color: "var(--color-text-secondary)",
          }}
        >
          {t("auth.mfa.instruction_verification")}
        </p>
      </header>

      <form onSubmit={verifier} className="flex w-full flex-col" style={{ gap: "var(--space-5)" }}>
        <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
          <label htmlFor={identifiantCode} className="etiquette-champ">
            {t("auth.code_verification")}
          </label>
          <input
            id={identifiantCode}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="champ-saisie chiffres-tabulaires"
            style={{
              letterSpacing: "0.35em",
              textAlign: "center",
              fontSize: "var(--text-h2)",
              fontWeight: 600,
            }}
          />
        </div>

        {erreur && (
          <p role="alert" className="message-erreur">
            {erreur}
          </p>
        )}

        <button type="submit" disabled={enCours} className="bouton-principal">
          {t("auth.mfa.valider")}
        </button>

        {devModeActif && (
          <button
            type="button"
            onClick={remplirCodeDev}
            className="rounded border border-dashed"
            style={{
              padding: "var(--space-2)",
              borderColor: "var(--color-border-strong)",
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            {t("auth.mfa.aide_developpement")}
          </button>
        )}
      </form>
    </div>
  );
}
