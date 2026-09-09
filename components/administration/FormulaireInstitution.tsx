"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { creerInstitution } from "@/lib/actions/admin-institutions";
import { t } from "@/lib/i18n";

const styleChamp = {
  borderColor: "var(--color-border-strong)",
  fontSize: "var(--text-body)",
} as const;

/* Suit le patron de components/auth/LoginForm.tsx : useState pour enCours/erreur. */
export function FormulaireInstitution() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  async function soumettre(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    setEnCours(true);
    setErreur(null);
    setSucces(false);

    const resultat = await creerInstitution(new FormData(evenement.currentTarget));

    setEnCours(false);
    if (!resultat.succes) {
      setErreur(t(resultat.erreurCle));
      return;
    }
    setSucces(true);
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      onSubmit={soumettre}
      className="flex flex-col gap-3 rounded p-4"
      style={{ backgroundColor: "var(--color-bg-panel)", border: "1px solid var(--color-border)" }}
    >
      <h2 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h3)", fontWeight: 600 }}>
        {t("admin.institutions.nouvelle")}
      </h2>

      <input
        name="denomination"
        required
        placeholder={t("admin.institutions.denomination")}
        className="rounded border px-3 py-2"
        style={styleChamp}
      />
      <input
        name="type"
        placeholder={t("admin.institutions.type")}
        className="rounded border px-3 py-2"
        style={styleChamp}
      />
      <input
        name="conventionReference"
        placeholder={t("admin.institutions.convention_reference")}
        className="rounded border px-3 py-2"
        style={styleChamp}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1" style={{ fontSize: "var(--text-small)" }}>
          {t("admin.institutions.convention_debut")}
          <input name="conventionDebut" type="date" className="rounded border px-3 py-2" style={styleChamp} />
        </label>
        <label className="flex flex-col gap-1" style={{ fontSize: "var(--text-small)" }}>
          {t("admin.institutions.convention_fin")}
          <input name="conventionFin" type="date" className="rounded border px-3 py-2" style={styleChamp} />
        </label>
      </div>

      {erreur && <p style={{ color: "var(--color-alert)", fontSize: "var(--text-small)" }}>{erreur}</p>}
      {succes && (
        <p style={{ color: "var(--color-success)", fontSize: "var(--text-small)" }}>
          {t("admin.institutions.creation_reussie")}
        </p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className="self-start rounded px-4 py-2 font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-titre)" }}
      >
        {t("admin.institutions.creer")}
      </button>
    </form>
  );
}
