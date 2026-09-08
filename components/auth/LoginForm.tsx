"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function seConnecter(evenement: React.FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEnCours(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    setEnCours(false);

    if (error) {
      setErreur(t("auth.erreur.identifiants"));
      return;
    }

    router.push("/synthese");
    router.refresh();
  }

  return (
    <form onSubmit={seConnecter} className="flex w-full max-w-xs flex-col gap-3">
      <input
        type="email"
        required
        autoComplete="username"
        placeholder={t("auth.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded border px-3 py-2 text-[length:var(--text-body)]"
        style={{ borderColor: "var(--color-border-strong)" }}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        placeholder={t("auth.mot_de_passe")}
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        className="rounded border px-3 py-2 text-[length:var(--text-body)]"
        style={{ borderColor: "var(--color-border-strong)" }}
      />

      {erreur && (
        <p style={{ color: "var(--color-alert)", fontSize: "var(--text-small)" }}>{erreur}</p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className="rounded py-2 font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-titre)" }}
      >
        {t("auth.connexion")}
      </button>

      <a
        href="/auth/reinitialisation"
        className="text-center underline"
        style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-small)" }}
      >
        {t("auth.mot_de_passe_oublie")}
      </a>
    </form>
  );
}
