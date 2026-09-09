import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Protection en liste blanche (document 11, section 1) : tout est protege par defaut,
 * seules les routes /auth/* restent accessibles sans session valide.
 */
const ROUTES_PUBLIQUES_EXACTES = ["/"];
const ROUTES_PUBLIQUES_PREFIXES = ["/auth"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
  if (user) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    aal2Atteint = aal?.currentLevel === "aal2";
  }
  const sessionComplete = !!user && aal2Atteint;

  const { pathname } = request.nextUrl;
  const estRoutePublique =
    ROUTES_PUBLIQUES_EXACTES.includes(pathname) ||
    ROUTES_PUBLIQUES_PREFIXES.some((route) => pathname.startsWith(route));

  if (!sessionComplete && !estRoutePublique) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (sessionComplete && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/synthese";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
