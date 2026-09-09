import Image from "next/image";
import logoEditeur from "@/public/Logo avec slogan.svg";
import { InscriptionFacteur } from "@/components/auth/InscriptionFacteur";
import { LoginForm } from "@/components/auth/LoginForm";
import { ToileConnexion } from "@/components/auth/ToileConnexion";
import { VerificationFacteur } from "@/components/auth/VerificationFacteur";
import { createClient } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";

/*
 * Ecran de connexion, document 9 partie A.0, revise le 9 septembre 2026.
 *
 * La composition passe d'un bloc centre sur fond blanc a deux volets : un volet
 * de marque, qui porte le titre, l'accroche et une composition vectorielle du
 * relief, et un volet clair qui porte le formulaire. Le contenu est inchange au
 * mot pres : titre, accroche, mention d'acces reserve, formulaire, mot de passe
 * oublie, attribution. Rien n'a ete ajoute, la regle "aucune partie publique"
 * du document 1 tient telle quelle. Seule la mise en page evolue, et le
 * document 9, A.0, a ete corrige en consequence.
 *
 * Trois etapes possibles du meme ecran (document 7, section 10 : second
 * facteur obligatoire pour tous les comptes) : identifiants, inscription au
 * second facteur (aucun facteur verifie), verification (facteur deja
 * verifie). Le routage vers ces etapes plutot que vers /synthese est impose
 * par proxy.ts tant que le niveau aal2 n'est pas atteint.
 */
export default async function EcranConnexion() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let etape: "connexion" | "inscription_facteur" | "verification_facteur" = "connexion";
  let facteurId: string | null = null;

  if (user) {
    const { data: facteurs } = await supabase.auth.mfa.listFactors();
    const facteurVerifie = facteurs?.totp.find((f) => f.status === "verified");
    if (facteurVerifie) {
      etape = "verification_facteur";
      facteurId = facteurVerifie.id;
    } else {
      etape = "inscription_facteur";
    }
  }

  /* L'accroche est une phrase du catalogue, posee en trois lignes comme dans la
     maquette du document 9. Le decoupage est de la mise en page, pas du texte. */
  const accroche = t("auth.accroche")
    .split(/(?<=\.)\s+/)
    .filter(Boolean);

  return (
    <div className="grid min-h-screen flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Volet de marque. Retire sous 1024 px : le document 8 borne l'outil a
          l'ordinateur et a la tablette, et un volet decoratif empilé au-dessus
          d'un formulaire ne sert personne. */}
      <section
        className="relative hidden lg:flex lg:flex-col lg:justify-between"
        style={{
          overflow: "hidden",
          padding: "var(--space-12)",
          backgroundColor: "var(--color-primary-900)",
          color: "var(--color-on-primary)",
        }}
      >
        <ToileConnexion />
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "var(--voile-connexion)" }}
        />

        <header className="relative flex flex-col" style={{ gap: "var(--space-5)", marginTop: "80px" }}>
          <span
            className="etiquette"
            style={{ color: "var(--color-on-primary-faint)" }}
          >
            {t("auth.sous_titre")}
          </span>
          <h1
            className="max-w-[26ch]"
            style={{
              fontFamily: "var(--font-titre)",
              fontSize: "var(--text-display)",
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "var(--tracking-titre)",
              color: "var(--color-on-primary)",
            }}
          >
            {t("auth.titre")}
          </h1>
        </header>

        <div className="relative flex flex-col" style={{ gap: "var(--space-6)" }}>
          <p className="flex flex-col" style={{ gap: "var(--space-1)", marginTop: "calc(var(--space-4) + 40px)" }}>
            {accroche.map((ligne) => (
              <span
                key={ligne}
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "var(--text-h2)",
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: "var(--color-on-primary-muted)",
                }}
              >
                {ligne}
              </span>
            ))}
          </p>

          <span
            style={{
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--color-primary-700)",
              fontSize: "var(--text-meta)",
              color: "#ffffff",
              whiteSpace: "nowrap",
              marginTop: "40px",
            }}
          >
            {t("app.attribution")}
          </span>
        </div>
      </section>

      {/* Volet du formulaire. */}
      <section
        className="flex flex-col justify-center"
        style={{ padding: "var(--space-12) var(--space-8)", backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="mx-auto flex w-full flex-col"
          style={{ maxWidth: "23rem", gap: "var(--space-8)" }}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
            <Image
              src={logoEditeur}
              alt={t("app.editeur")}
              height={144}
              priority
              className="self-center"
              style={{ height: "144px", width: "auto", position: "relative", top: "-40px" }}
            />
            {/* Sur les largeurs ou le volet de marque est retire, le titre et
                l'accroche reviennent ici : l'ecran ne perd jamais son identite. */}
            <div className="flex flex-col lg:hidden" style={{ gap: "var(--space-2)" }}>
              <h1
                style={{
                  fontFamily: "var(--font-titre)",
                  fontSize: "var(--text-h1)",
                  fontWeight: 700,
                  letterSpacing: "var(--tracking-titre)",
                  color: "var(--color-primary-700)",
                }}
              >
                {t("auth.titre")}
              </h1>
              <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}>
                {t("auth.accroche")}
              </p>
            </div>
          </div>

          {etape === "connexion" && <LoginForm />}
          {etape === "inscription_facteur" && <InscriptionFacteur />}
          {etape === "verification_facteur" && facteurId && (
            <VerificationFacteur
              factorId={facteurId}
              devModeActif={process.env.NODE_ENV === "development"}
            />
          )}

          <span
            className="lg:hidden"
            style={{ fontSize: "var(--text-meta)", color: "var(--color-text-muted)" }}
          >
            {t("app.attribution")}
          </span>
        </div>
      </section>
    </div>
  );
}
