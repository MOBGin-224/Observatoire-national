"use client";

import { useState, useTransition } from "react";
import {
  suspendreCompte,
  reactiverCompte,
  prolongerExpiration,
  renvoyerInvitation,
} from "@/lib/actions/admin-institutions";
import { formatDateHeure } from "@/lib/format";
import { t } from "@/lib/i18n";
import { EtatVide } from "@/components/states/EtatVide";
import type { CompteInstitutionnel } from "@/lib/queries/admin";

const COULEUR_STATUT: Record<string, string> = {
  ACTIF: "var(--color-success)",
  SUSPENDU: "var(--color-alert)",
  EXPIRE: "var(--color-text-muted)",
};

function LigneCompte({
  compte,
  idInstitution,
}: {
  compte: CompteInstitutionnel;
  idInstitution: string;
}) {
  const [enCours, startTransition] = useTransition();
  const [dateProlongation, setDateProlongation] = useState("");

  return (
    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
      <td className="px-2 py-1.5">
        {compte.prenom} {compte.nom}
        <div style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
          {compte.email}
        </div>
      </td>
      <td className="px-2 py-1.5">{compte.profil}</td>
      <td className="px-2 py-1.5">
        {compte.dateExpiration ? formatDateHeure(compte.dateExpiration).split(" à")[0] : t("state.non_renseigne")}
      </td>
      <td className="px-2 py-1.5" style={{ color: COULEUR_STATUT[compte.statut] ?? undefined, fontWeight: 600 }}>
        {t(`admin.comptes.statut.${compte.statut.toLowerCase()}`)}
      </td>
      <td className="px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-2">
          {compte.statut === "ACTIF" ? (
            <button
              disabled={enCours}
              onClick={() => {
                if (!confirm(t("admin.comptes.confirmation.suspendre"))) return;
                startTransition(() => suspendreCompte(compte.id, idInstitution));
              }}
              className="rounded px-2 py-1 disabled:opacity-60"
              style={{ fontSize: "var(--text-meta)", border: "1px solid var(--color-border-strong)" }}
            >
              {t("admin.comptes.action.suspendre")}
            </button>
          ) : (
            <button
              disabled={enCours}
              onClick={() => {
                if (!confirm(t("admin.comptes.confirmation.reactiver"))) return;
                startTransition(() => reactiverCompte(compte.id, idInstitution));
              }}
              className="rounded px-2 py-1 disabled:opacity-60"
              style={{ fontSize: "var(--text-meta)", border: "1px solid var(--color-border-strong)" }}
            >
              {t("admin.comptes.action.reactiver")}
            </button>
          )}

          <input
            type="date"
            value={dateProlongation}
            onChange={(e) => setDateProlongation(e.target.value)}
            className="rounded border px-1 py-1"
            style={{ fontSize: "var(--text-meta)", borderColor: "var(--color-border-strong)" }}
          />
          <button
            disabled={enCours || !dateProlongation}
            onClick={() =>
              startTransition(() => prolongerExpiration(compte.id, idInstitution, dateProlongation))
            }
            className="rounded px-2 py-1 disabled:opacity-60"
            style={{ fontSize: "var(--text-meta)", border: "1px solid var(--color-border-strong)" }}
          >
            {t("admin.comptes.action.prolonger")}
          </button>

          {compte.email && (
            <button
              disabled={enCours}
              onClick={() => startTransition(() => renvoyerInvitation(compte.email!))}
              className="rounded px-2 py-1 disabled:opacity-60"
              style={{ fontSize: "var(--text-meta)", border: "1px solid var(--color-border-strong)" }}
            >
              {t("admin.comptes.action.renvoyer_invitation")}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function TableauComptes({
  comptes,
  idInstitution,
}: {
  comptes: CompteInstitutionnel[];
  idInstitution: string;
}) {
  if (comptes.length === 0) {
    return <EtatVide libelle={t("admin.comptes.vide")} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ fontSize: "var(--text-small)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
            {[
              t("admin.comptes.nom"),
              t("admin.comptes.profil"),
              t("admin.comptes.expiration"),
              t("nav.compte"),
              "",
            ].map((colonne, i) => (
              <th
                key={i}
                className="px-2 py-1.5 text-left"
                style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}
              >
                {colonne}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comptes.map((compte) => (
            <LigneCompte key={compte.id} compte={compte} idInstitution={idInstitution} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
