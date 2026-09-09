"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { creerCompte } from "@/lib/actions/admin-institutions";
import { modulesAutorises } from "@/lib/permissions/matrice";
import { t } from "@/lib/i18n";
import type { ValeurEnumeration } from "@/lib/enumerations";

const styleChamp = {
  borderColor: "var(--color-border-strong)",
  fontSize: "var(--text-body)",
} as const;

const CLE_LIBELLE_MODULE: Record<string, string> = {
  M1_OFFRE: "module.m1.court",
  M2_DEMANDE: "module.m2.court",
  M3_ACTIVITE: "module.m3.court",
  M4_TENSION: "module.m4.court",
  M5_CONFORMITE: "module.m5.court",
  M6_MATURITE: "module.m6.court",
  M7_EVENEMENTIEL: "module.m7.court",
  M8_RETOMBEES: "module.m8.court",
  M9_SYNTHESE: "module.m9.court",
  M10_METHODO: "module.m10.titre",
  M11_ADMIN: "module.m11.titre",
};

export function FormulaireCompte({
  idInstitution,
  profils,
  langues,
}: {
  idInstitution: string;
  profils: ValeurEnumeration[];
  langues: ValeurEnumeration[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [profil, setProfil] = useState(profils[0]?.code ?? "");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const modulesDisponibles = modulesAutorises(profil);

  async function soumettre(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    setEnCours(true);
    setErreur(null);
    setSucces(false);

    const resultat = await creerCompte(idInstitution, new FormData(evenement.currentTarget));

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
        {t("admin.comptes.nouveau")}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input name="nom" required placeholder={t("admin.comptes.nom")} className="rounded border px-3 py-2" style={styleChamp} />
        <input name="prenom" required placeholder={t("admin.comptes.prenom")} className="rounded border px-3 py-2" style={styleChamp} />
      </div>
      <input name="fonction" placeholder={t("admin.comptes.fonction")} className="rounded border px-3 py-2" style={styleChamp} />
      <input
        name="email"
        type="email"
        required
        placeholder={t("admin.comptes.email")}
        className="rounded border px-3 py-2"
        style={styleChamp}
      />

      <label className="flex flex-col gap-1" style={{ fontSize: "var(--text-small)" }}>
        {t("admin.comptes.profil")}
        <select
          name="profil"
          value={profil}
          onChange={(e) => setProfil(e.target.value)}
          className="rounded border px-3 py-2"
          style={styleChamp}
        >
          {profils.map((p) => (
            <option key={p.code} value={p.code}>
              {p.libelleFr}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1" style={{ fontSize: "var(--text-small)" }}>
        {t("admin.comptes.langue")}
        <select name="langue" defaultValue={langues[0]?.code ?? "FR"} className="rounded border px-3 py-2" style={styleChamp}>
          {langues.map((l) => (
            <option key={l.code} value={l.code}>
              {l.libelleFr}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1" style={{ fontSize: "var(--text-small)" }}>
        {t("admin.comptes.expiration")}
        <input name="dateExpiration" type="date" required className="rounded border px-3 py-2" style={styleChamp} />
      </label>

      <fieldset className="flex flex-col gap-1">
        <legend style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
          {t("admin.comptes.modules")}
        </legend>
        <div className="grid grid-cols-2 gap-1">
          {modulesDisponibles.map((code) => (
            <label key={code} className="flex items-center gap-2" style={{ fontSize: "var(--text-small)" }}>
              <input type="checkbox" name="modules" value={code} defaultChecked />
              {t(CLE_LIBELLE_MODULE[code])}
            </label>
          ))}
        </div>
      </fieldset>

      {erreur && <p style={{ color: "var(--color-alert)", fontSize: "var(--text-small)" }}>{erreur}</p>}
      {succes && (
        <p style={{ color: "var(--color-success)", fontSize: "var(--text-small)" }}>
          {t("admin.comptes.invitation_envoyee")}
        </p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className="self-start rounded px-4 py-2 font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-titre)" }}
      >
        {t("admin.comptes.inviter")}
      </button>
    </form>
  );
}
