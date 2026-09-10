"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";
import { executerAction } from "@/lib/erreurs";

/*
 * Formulaire d'identifiants, premiere etape de l'ecran de connexion unique
 * (document 9, A.0).
 *
 * Les libelles sont de vraies etiquettes au-dessus des champs, et non des
 * textes de substitution. Un texte de substitution disparait des que
 * l'utilisateur commence a saisir : il ne reste alors aucun moyen de savoir ce
 * que contient le champ, ce qui pose surtout probleme au moment de corriger une
 * erreur. Les deux libelles viennent du catalogue, inchanges.
 */
export function LoginForm() {
  const router = useRouter();
  const identifiantEmail = useId();
  const identifiantMotDePasse = useId();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function seConnecter(evenement: React.FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEnCours(true);

    const issue = await executerAction(async () => {
      const supabase = createClient();
      return supabase.auth.signInWithPassword({ email, password: motDePasse });
    });

    setEnCours(false);

    /* Panne d'appel : ne jamais l'annoncer comme des identifiants incorrects,
       l'utilisateur reessaierait indefiniment un mot de passe pourtant juste. */
    if (!issue.ok) {
      setErreur(t(issue.cle));
      return;
    }

    if (issue.valeur.error) {
      setErreur(t("auth.erreur.identifiants"));
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={seConnecter} className="flex w-full flex-col" style={{ gap: "var(--space-5)" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <label htmlFor={identifiantEmail} className="etiquette-champ">
          {t("auth.email")}
          <span style={{ color: "var(--color-alert)", marginLeft: "4px" }}>*</span>
        </label>
        <input
          id={identifiantEmail}
          type="email"
          required
          autoComplete="username"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="champ-saisie"
        />
      </div>

      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <label htmlFor={identifiantMotDePasse} className="etiquette-champ">
          {t("auth.mot_de_passe")}
          <span style={{ color: "var(--color-alert)", marginLeft: "4px" }}>*</span>
        </label>
        <input
          id={identifiantMotDePasse}
          type="password"
          required
          autoComplete="current-password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="champ-saisie"
        />
      </div>

      {erreur && (
        <p role="alert" className="message-erreur">
          {erreur}
        </p>
      )}

      <button type="submit" disabled={enCours} className="bouton-principal">
        {t("auth.connexion")}
      </button>

      <div
        className="flex flex-col"
        style={{
          gap: "var(--space-3)",
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--color-border-faint)",
        }}
      >
        <a
          href="/auth/reinitialisation"
          className="lien-sobre"
          style={{ fontSize: "var(--text-small)", fontWeight: 700 }}
        >
          {t("auth.mot_de_passe_oublie")}
        </a>
        {/* Document 9, A.0 : la mention renvoie au point focal, jamais a un
            formulaire d'inscription. Aucun lien ne quitte cet ecran. */}
        <p
          style={{ fontSize: "var(--text-meta)", lineHeight: 1.5, color: "#000000" }}
        >
          {t("auth.pas_de_compte")}
        </p>
      </div>
    </form>
  );
}
