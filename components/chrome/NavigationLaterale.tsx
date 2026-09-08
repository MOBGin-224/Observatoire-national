import Link from "next/link";
import { t } from "@/lib/i18n";

const ORDRE_MODULES = [
  "M9_SYNTHESE",
  "M1_OFFRE",
  "M2_DEMANDE",
  "M3_ACTIVITE",
  "M4_TENSION",
  "M5_CONFORMITE",
  "M6_MATURITE",
  "M7_EVENEMENTIEL",
  "M8_RETOMBEES",
  "M10_METHODO",
  "M11_ADMIN",
] as const;

const CLE_LIBELLE: Record<string, string> = {
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

/* Ecrans reellement construits a ce jour. Un module actif sans ecran reste visible, non cliquable. */
const ROUTES_CONSTRUITES: Record<string, string> = {
  M9_SYNTHESE: "/synthese",
  M1_OFFRE: "/offre",
};

export function NavigationLaterale({
  modulesActifs,
  moduleCourant,
}: {
  modulesActifs: string[];
  moduleCourant?: string;
}) {
  return (
    <nav
      className="flex w-[240px] shrink-0 flex-col gap-1 border-r px-3 py-4"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
    >
      <span
        className="px-2 pb-2"
        style={{
          fontFamily: "var(--font-texte)",
          fontSize: "var(--text-label)",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
        }}
      >
        {t("nav.modules")}
      </span>

      {ORDRE_MODULES.filter((code) => modulesActifs.includes(code)).map((code) => {
        const route = ROUTES_CONSTRUITES[code];
        const actif = moduleCourant === code;

        const style = {
          fontFamily: "var(--font-texte)",
          fontSize: "var(--text-body)",
          color: actif ? "var(--color-primary)" : "var(--color-text)",
          backgroundColor: actif ? "var(--color-bg-subtle)" : "transparent",
          fontWeight: actif ? 600 : 400,
        } as const;

        if (!route) {
          return (
            <span
              key={code}
              className="rounded px-2 py-1.5"
              style={{ ...style, color: "var(--color-text-muted)" }}
            >
              {t(CLE_LIBELLE[code])}
            </span>
          );
        }

        return (
          <Link key={code} href={route} className="rounded px-2 py-1.5" style={style}>
            {t(CLE_LIBELLE[code])}
          </Link>
        );
      })}
    </nav>
  );
}
