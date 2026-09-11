"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { previsualiserImport, validerImport } from "@/lib/actions/admin-recensement";
import { RapportControleImport } from "@/components/administration/RapportControleImport";
import { executerAction } from "@/lib/erreurs";
import { t } from "@/lib/i18n";
import { IMPORT } from "@/lib/config";
import type { RapportImport } from "@/lib/csv/parseRecensement";

/*
 * Document 9bis H.4.1 : previsualisation obligatoire, jamais d'import direct.
 *
 * Les deux actions passent par executerAction : un echec (session expiree,
 * refus de la base) s'annonce en clair au lieu de laisser un bouton muet.
 */
export function ZoneImportCSV() {
  const router = useRouter();
  const [nomFichier, setNomFichier] = useState<string | null>(null);
  const [contenu, setContenu] = useState<string | null>(null);
  const [rapport, setRapport] = useState<RapportImport | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [valide, setValide] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function surDepot(evenement: React.ChangeEvent<HTMLInputElement>) {
    const fichier = evenement.target.files?.[0];
    if (!fichier) return;
    setNomFichier(fichier.name);
    setRapport(null);
    setValide(false);

    const lecteur = new FileReader();
    lecteur.onload = () => setContenu(String(lecteur.result ?? ""));
    lecteur.readAsText(fichier, "utf-8");
  }

  async function previsualiser() {
    if (!contenu) return;
    setEnCours(true);
    setErreur(null);
    const issue = await executerAction(() => previsualiserImport(contenu));
    setEnCours(false);
    if (!issue.ok) {
      setErreur(t(issue.cle));
      router.refresh();
      return;
    }
    setRapport(issue.valeur);
  }

  async function valider() {
    if (!contenu || !nomFichier) return;
    setEnCours(true);
    setErreur(null);
    const issue = await executerAction(() => validerImport(contenu, nomFichier));
    setEnCours(false);
    if (!issue.ok) {
      setErreur(t(issue.cle));
      router.refresh();
      return;
    }
    setValide(true);
    router.refresh();
  }

  return (
    <div
      className="flex flex-col gap-4 rounded p-4"
      style={{ backgroundColor: "var(--color-bg-panel)", border: "1px solid var(--color-border)" }}
    >
      <div>
        <label
          className="inline-block cursor-pointer rounded px-4 py-2 font-semibold text-white"
          style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-titre)" }}
        >
          {t("admin.import.deposer")}
          <input type="file" accept=".csv,text/csv" onChange={surDepot} className="hidden" />
        </label>
        <p style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}>
          {t("admin.import.format")}{" "}
          {t("admin.import.plafond", { plafond: IMPORT.plafondLignes })}
        </p>
        {nomFichier && (
          <p style={{ fontSize: "var(--text-small)", marginTop: "var(--space-1)" }}>{nomFichier}</p>
        )}
      </div>

      {contenu && !rapport && (
        <button
          onClick={previsualiser}
          disabled={enCours}
          className="self-start rounded px-4 py-2 disabled:opacity-60"
          style={{ border: "1px solid var(--color-border-strong)", fontSize: "var(--text-body)" }}
        >
          {t("admin.import.previsualiser")}
        </button>
      )}

      {erreur && (
        <p role="alert" style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text)" }}>
          {erreur}
        </p>
      )}

      {rapport && <RapportControleImport rapport={rapport} />}

      {rapport && rapport.lignesValides.length > 0 && !valide && (
        <button
          onClick={valider}
          disabled={enCours}
          className="self-start rounded px-4 py-2 font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--color-success)", fontFamily: "var(--font-titre)" }}
        >
          {t("admin.import.valider")}
        </button>
      )}

      {valide && (
        <p style={{ color: "var(--color-success)", fontSize: "var(--text-small)", fontWeight: 600 }}>
          {t("admin.import.rapport.lignes_valides", { n: rapport?.lignesValides.length ?? 0 })}
        </p>
      )}
    </div>
  );
}
