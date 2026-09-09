import { BlocIndicateurCle } from "@/components/indicators/BlocIndicateurCle";
import { EtatVide } from "@/components/states/EtatVide";
import { t } from "@/lib/i18n";
import { chargerRetombeesNationales } from "@/lib/queries/retombees";

/*
 * Ecran M8_RETOMBEES (document 9 quater, partie M). CE MODULE RESTE DESACTIVE
 * POUR TOUS LES COMPTES (compte_module.actif = false) : les trois conditions
 * imperatives de la section M.3 ne sont pas reunies (coefficient
 * multiplicateur non arrete, methodologie non publiee dans M10_METHODO,
 * validation de la direction absente : document 4, point ouvert 3). Cette
 * page existe et fonctionne, mais acces_retombees_national ne renvoie jamais
 * de ligne tant que le module n'est pas reactive : elle s'affichera donc
 * toujours en etat vide en pratique. RET_DEPENSE_TOTALE_ESTIMEE n'est jamais
 * calculee ici, faute de coefficient publie.
 */
export default async function Retombees() {
  const retombees = await chargerRetombeesNationales();

  if (!retombees) {
    return (
      <div className="p-8">
        <EtatVide />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m8.titre")}
      </h1>

      {/* Z1, bandeau de methode, permanent, non masquable */}
      <div
        className="rounded border p-3"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}
      >
        <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-secondary)" }}>
          Estimation. Coefficient multiplicateur non encore arrêté :{" "}
          {t("state.vide.estimation_retombees")}{" "}
          <a href="/methodologie" className="underline">
            {t("nav.methodologie")}
          </a>
          .
        </p>
      </div>

      {/* Z2, blocs cles */}
      <div className="grid grid-cols-3 gap-3">
        <BlocIndicateurCle
          code="RET_DEPENSE_HEBERGEMENT"
          valeur={retombees.retDepenseHebergement}
          masque={retombees.retMasque}
          libelleVide={t("state.vide.reservations")}
          calculeA={retombees.calculeA}
        />
        <BlocIndicateurCle
          code="RET_DEPENSE_TOTALE_ESTIMEE"
          valeur={null}
          libelleVide={t("state.vide.estimation_retombees")}
          calculeA={retombees.calculeA}
        />
        <BlocIndicateurCle
          code="ACT_NUITEES"
          valeur={retombees.actNuitees}
          calculeA={retombees.calculeA}
        />
      </div>
    </div>
  );
}
