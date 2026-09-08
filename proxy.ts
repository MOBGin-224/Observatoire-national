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

  const { pathname } = request.nextUrl;
  const estRoutePublique =
    ROUTES_PUBLIQUES_EXACTES.includes(pathname) ||
    ROUTES_PUBLIQUES_PREFIXES.some((route) => pathname.startsWith(route));

  if (!user && !estRoutePublique) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/") {
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
