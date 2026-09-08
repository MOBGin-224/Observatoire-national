"use client";

import { t } from "@/lib/i18n";

/*
 * Etat 5, erreur (document 9, A.4). Message court, action de reprise.
 */
export function EtatErreur({ onReessayer }: { onReessayer?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <p style={{ fontSize: "var(--text-body)", color: "var(--color-text)" }}>
        {t("state.erreur.titre")}
      </p>
      {onReessayer && (
        <button
          onClick={onReessayer}
          className="self-start underline"
          style={{ fontSize: "var(--text-small)", color: "var(--color-primary)" }}
        >
          {t("state.erreur.action")}
        </button>
      )}
      <p style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
        {t("state.erreur.persistante")}
      </p>
    </div>
  );
}
