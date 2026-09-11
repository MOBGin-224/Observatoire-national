import Link from "next/link";
import { SECTIONS_ADMINISTRATION as CARTES } from "@/lib/administration/sections";
import { t } from "@/lib/i18n";

/*
 * Ecran d'atterrissage M11_ADMIN (document 9bis, partie H). Lot 1 : deux
 * cartes seulement (institutions/comptes, import du recensement). Les sept
 * autres sections s'ajouteront ici au fil des lots suivants.
 */
export default function Administration() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <h1 style={{ fontFamily: "var(--font-titre)", fontSize: "var(--text-h1)", fontWeight: 700 }}>
        {t("module.m11.titre")}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {CARTES.map((carte) => (
          <Link
            key={carte.href}
            href={carte.href}
            className="flex flex-col gap-2 rounded p-5"
            style={{
              backgroundColor: "var(--color-bg-panel)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-titre)",
                fontSize: "var(--text-h3)",
                fontWeight: 600,
                color: "var(--color-primary)",
              }}
            >
              {t(carte.titre)}
            </span>
            <span style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}>
              {t(carte.description)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
