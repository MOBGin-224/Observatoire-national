import type { ReactNode } from "react";

/*
 * Coquille commune a tout bloc de contenu. Fond blanc, filet de 1 px, rayon de
 * 4 px, aucune ombre portee (document 8, section 4). Le rang d'un panneau se lit
 * a son filet d'accent superieur, pas a une elevation.
 */
export function Panneau({
  titre,
  soustitre,
  actions,
  pied,
  accent,
  children,
  className = "",
}: {
  titre?: string;
  soustitre?: string;
  actions?: ReactNode;
  pied?: ReactNode;
  accent?: "bleu" | "vert";
  children: ReactNode;
  className?: string;
}) {
  const classeAccent =
    accent === "vert" ? "surface-accent-vert" : accent === "bleu" ? "surface-accent" : "";

  return (
    <section className={`surface ${classeAccent} flex flex-col ${className}`}>
      {(titre || actions) && (
        <header
          className="flex items-start justify-between"
          style={{
            gap: "var(--space-4)",
            padding: "var(--space-4) var(--space-5)",
            borderBottom: "1px solid var(--color-border-faint)",
          }}
        >
          <div className="flex min-w-0 flex-col" style={{ gap: "var(--space-1)" }}>
            {titre && (
              <h3
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "var(--text-h3)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                {titre}
              </h3>
            )}
            {soustitre && (
              <p style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
                {soustitre}
              </p>
            )}
          </div>
          {actions}
        </header>
      )}

      <div className="flex-1" style={{ padding: "var(--space-5)" }}>
        {children}
      </div>

      {pied && (
        <footer
          style={{
            padding: "var(--space-3) var(--space-5)",
            borderTop: "1px solid var(--color-border-faint)",
            backgroundColor: "var(--color-bg-subtle)",
          }}
        >
          {pied}
        </footer>
      )}
    </section>
  );
}
