import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION, seuilInactiviteMs } from "@/lib/config";

/*
 * Protection en liste blanche (document 11, section 1) : tout est protege par defaut,
 * seules les routes /auth/* restent accessibles sans session valide.
 */
const ROUTES_PUBLIQUES_EXACTES = ["/"];
const ROUTES_PUBLIQUES_PREFIXES = ["/auth"];

/*
 * Document 14, section 5.1 : les routes de taches planifiees ne sont pas des
 * routes publiques. Elles sont protegees par un secret verifie dans la route
 * elle-meme, pas par une session. Le proxy les laisse passer sans les traiter,
 * sinon le planificateur serait redirige vers l'ecran de connexion et aucune
 * tache ne s'executerait jamais.
 */
const PREFIXE_TACHES = "/api/taches";

/*
 * Deux compteurs d'expiration (document 13, section 2, confirme au document 14
 * section 5.4). Les reglages de session Supabase etant globaux au projet, ils
 * ne savent pas distinguer deux durees selon le profil : les compteurs sont
 * donc tenus ici.
 *
 * Ces marqueurs ne portent aucune donnee sensible, seulement des horodatages.
 * Ils sont httpOnly pour ne pas etre lisibles depuis la page.
 */
const COOKIE_DEBUT_SESSION = "obs_session_debut";
const COOKIE_DERNIERE_ACTIVITE = "obs_activite";
const COOKIE_RETOUR = "obs_retour";

const ATTRIBUTS_MARQUEUR = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(PREFIXE_TACHES)) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "observatoire" },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * Document 7, section 10 : second facteur obligatoire pour tous les
   * comptes. Une session qui n'a pas atteint aal2 n'a acces a aucune route
   * protegee, quel que soit l'etat de son mot de passe. Fail-closed : en cas
   * de doute (erreur, donnee absente), le niveau est traite comme insuffisant.
   */
  let aal2Atteint = false;
  /*
   * Le profil est relu a chaque requete plutot que porte par un marqueur : le
   * seuil de 20 minutes du profil ADMIN est une mesure de securite (document
   * 13, section 2), il ne peut pas dependre d'une valeur que le poste client
   * presenterait lui-meme.
   *
   * Les deux lectures partent ensemble : elles ne dependent pas l'une de
   * l'autre, et le proxy s'execute avant chaque rendu. Les enchainer y
   * ajouterait un aller-retour reseau sur toute navigation.
   */
  let profil = "";
  if (user) {
    const [niveauAssurance, compte] = await Promise.all([
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.rpc("compte_valide"),
    ]);
    aal2Atteint = niveauAssurance.data?.currentLevel === "aal2";
    profil = compte.data?.[0]?.profil ?? "";
  }
  const sessionComplete = !!user && aal2Atteint;

  const estRoutePublique =
    ROUTES_PUBLIQUES_EXACTES.includes(pathname) ||
    ROUTES_PUBLIQUES_PREFIXES.some((route) => pathname.startsWith(route));

  /*
   * Une fonction serveur n'est pas une route : c'est un POST vers la route qui
   * la porte, et le client qui l'appelle ne sait pas suivre une redirection.
   * Lui en renvoyer une produit "An unexpected response was received from the
   * server", message que personne ne peut interpreter.
   *
   * Le guide de la version installee le dit sans detour : l'autorisation se
   * verifie dans chaque fonction serveur, pas dans le proxy seul (voir
   * node_modules/next/dist/docs/.../proxy.md, section "Execution order"). Nos
   * actions le font deja, chacune relit le compte appelant.
   *
   * Le proxy garde donc son role sur la navigation, et repond franchement 401
   * au reste, apres avoir reellement ferme la session.
   */
  const estNavigation = request.method === "GET" || request.method === "HEAD";

  if (!sessionComplete && !estRoutePublique) {
    if (!estNavigation) return sessionRefusee(response);
    return redirigerVersConnexion(request, pathname + request.nextUrl.search);
  }

  if (sessionComplete && !estRoutePublique) {
    const maintenant = Date.now();
    const debutSession = lireHorodatage(request, COOKIE_DEBUT_SESSION) ?? maintenant;
    const derniereActivite = lireHorodatage(request, COOKIE_DERNIERE_ACTIVITE) ?? maintenant;

    const inactiviteDepassee = maintenant - derniereActivite > seuilInactiviteMs(profil);
    const plafondDepasse = maintenant - debutSession > SESSION.dureeMaximaleMs;

    /* Le premier des deux compteurs qui expire ferme la session. */
    if (inactiviteDepassee || plafondDepasse) {
      /*
       * La session est fermee dans les deux cas, y compris pour une fonction
       * serveur : le compteur est une mesure de securite, il ne se contourne
       * pas en evitant de naviguer.
       */
      await supabase.auth.signOut();

      if (!estNavigation) return sessionRefusee(response);

      /*
       * signOut ecrit ses marqueurs vides sur `response`. La redirection etant
       * une autre reponse, ces marqueurs doivent y etre reportes, sinon les
       * marqueurs de session resteraient poses sur le poste.
       */
      const redirection = redirigerVersConnexion(request, pathname + request.nextUrl.search);
      for (const marqueur of response.cookies.getAll()) {
        redirection.cookies.set(marqueur);
      }
      return redirection;
    }

    response.cookies.set(COOKIE_DEBUT_SESSION, String(debutSession), ATTRIBUTS_MARQUEUR);
    response.cookies.set(COOKIE_DERNIERE_ACTIVITE, String(maintenant), ATTRIBUTS_MARQUEUR);
  }

  if (sessionComplete && pathname === "/") {
    const url = request.nextUrl.clone();
    /*
     * Document 13, section 2 : a la reconnexion, l'utilisateur revient sur
     * l'ecran et le perimetre qu'il consultait. Le perimetre etant porte par
     * l'adresse (fil d'Ariane territorial, document 8 section 5.5), memoriser
     * l'adresse suffit.
     */
    const retour = request.cookies.get(COOKIE_RETOUR)?.value;
    url.pathname = "/synthese";
    url.search = "";
    if (retour?.startsWith("/") && !retour.startsWith("//")) {
      const cible = new URL(retour, request.nextUrl.origin);
      url.pathname = cible.pathname;
      url.search = cible.search;
    }

    const redirection = NextResponse.redirect(url);
    redirection.cookies.delete(COOKIE_RETOUR);
    /* Les deux compteurs repartent de zero a l'entree dans l'application. */
    const maintenant = String(Date.now());
    redirection.cookies.set(COOKIE_DEBUT_SESSION, maintenant, ATTRIBUTS_MARQUEUR);
    redirection.cookies.set(COOKIE_DERNIERE_ACTIVITE, maintenant, ATTRIBUTS_MARQUEUR);
    return redirection;
  }

  return response;
}

/*
 * Refus adresse a autre chose qu'une navigation, une fonction serveur en
 * pratique. Les marqueurs poses par signOut sont reportes, sinon la session
 * resterait ouverte cote poste alors qu'elle est fermee cote serveur.
 */
function sessionRefusee(response: NextResponse): NextResponse {
  const refus = new NextResponse(null, { status: 401 });
  for (const marqueur of response.cookies.getAll()) {
    refus.cookies.set(marqueur);
  }
  refus.cookies.delete(COOKIE_DEBUT_SESSION);
  refus.cookies.delete(COOKIE_DERNIERE_ACTIVITE);
  return refus;
}

function lireHorodatage(request: NextRequest, nom: string): number | null {
  const brut = request.cookies.get(nom)?.value;
  if (!brut) return null;
  const valeur = Number(brut);
  return Number.isFinite(valeur) ? valeur : null;
}

function redirigerVersConnexion(request: NextRequest, adresseCourante: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  const redirection = NextResponse.redirect(url);

  /* Adresse interne uniquement : jamais une adresse fournie de l'exterieur. */
  if (adresseCourante.startsWith("/") && !adresseCourante.startsWith("//")) {
    redirection.cookies.set(COOKIE_RETOUR, adresseCourante, ATTRIBUTS_MARQUEUR);
  }
  redirection.cookies.delete(COOKIE_DEBUT_SESSION);
  redirection.cookies.delete(COOKIE_DERNIERE_ACTIVITE);
  return redirection;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
