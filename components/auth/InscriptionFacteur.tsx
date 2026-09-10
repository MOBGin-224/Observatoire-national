"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";
import { executerAction } from "@/lib/erreurs";
import { Squelette } from "@/components/states/Squelette";

/*
 * Inscription au second facteur (document 7, section 10 : "Second facteur
 * obligatoire pour tous les comptes"). Affiche ce composant plutot que
 * LoginForm quand l'utilisateur est authentifie (mot de passe correct) mais
 * n'a encore aucun facteur TOTP verifie. Reste une etape de l'ecran de
 * connexion unique (document 9, A.0), pas une nouvelle surface.
 */
export function InscriptionFacteur() {
  const router = useRouter();
  const identifiantCode = useId();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    let annule = false;

    async function preparerEnrolement() {
      const supabase = createClient();

      const { data: facteurs } = await supabase.auth.mfa.listFactors();
      const facteursNonVerifies = facteurs?.all.filter(
        (f) => f.factor_type === "totp" && f.status === "unverified"
      );
      for (const facteur of facteursNonVerifies ?? []) {
        await supabase.auth.mfa.unenroll({ factorId: facteur.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (annule) return;

      if (error || !data) {
        setErreur(t("state.erreur.action_echouee"));
        return;
      }

      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setPret(true);
    }

    /* Un rejet ici passerait en rejet non gere, sans un mot a l'ecran : le
       titulaire resterait devant un cadre vide sans savoir quoi faire. */
    preparerEnrolement().catch(() => {
      if (!annule) setErreur(t("state.erreur.action_echouee"));
    });
    return () => {
      annule = true;
    };
  }, []);

  async function verifier(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (!factorId) return;
    setErreur(null);
    setEnCours(true);

    const issue = await executerAction(async () => {
      const supabase = createClient();
      return supabase.auth.mfa.challengeAndVerify({ factorId, code });
    });

    setEnCours(false);

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

  /* Etat 1, chargement : squelette aux dimensions du contenu final, pour que
     l'arrivee du code QR ne fasse pas sauter la mise en page. */
  if (!pret) {
    return (
      <div className="flex w-full flex-col" style={{ gap: "var(--space-4)" }}>
        <Squelette hauteur="1.5rem" />
        <Squelette hauteur="3rem" />
        <Squelette hauteur="13rem" />
        <Squelette hauteur="2.75rem" />
      </div>
    );
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
          {t("auth.mfa.titre_inscription")}
        </h2>
        <p
          style={{
            fontSize: "var(--text-small)",
            lineHeight: 1.55,
            color: "var(--color-text-secondary)",
          }}
        >
          {t("auth.mfa.instruction_inscription")}
        </p>
      </header>

      {qrCode && (
        <div
          className="flex justify-center"
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--rayon)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          {/* Image de donnees produite par Supabase, jamais un appel reseau. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCode} alt={t("auth.mfa.titre_inscription")} width={176} height={176} />
        </div>
      )}

      {secret && (
        <div
          className="flex flex-col"
          style={{
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-4)",
            borderLeft: "var(--filet-accent) solid var(--color-border-strong)",
            backgroundColor: "var(--color-bg-subtle)",
          }}
        >
          <span
            style={{ fontSize: "var(--text-meta)", lineHeight: 1.5, color: "var(--color-text-muted)" }}
          >
            {t("auth.mfa.cle_secrete")}
          </span>
          <code
            style={{
              fontFamily: "var(--font-texte)",
              fontSize: "var(--text-small)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              wordBreak: "break-all",
              color: "var(--color-text)",
            }}
          >
            {secret}
          </code>
        </div>
      )}

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
      </form>
    </div>
  );
}
