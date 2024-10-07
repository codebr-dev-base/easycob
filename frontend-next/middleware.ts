import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/crypto";
import { getSession } from "./app/lib/auth";
import { ISessionCookie } from "./app/interfaces/auth";

// 1. Specify protected and public routes
const protectedRoutes: string[] = [];
const publicRoutes: string[] = ["/login"]; // TODO: ajustar isso antes de ir para prod


// Função para verificar o status do token
function checkTokenExpiration(tokenData: ISessionCookie) {
  const now = new Date();
  const expirationDate = new Date(tokenData.expiresAt);
  const hoursBeforeExpiration = 12 * 60 * 60 * 1000; // 12 horas em milissegundos

  // Verifica se o token já expirou
  if (now > expirationDate) {
    console.log("expire");
    return 'expire';
  }

  // Verifica se está no período de 12 horas antes da expiração
  const timeUntilExpiration = expirationDate.getTime() - now.getTime();
  if (timeUntilExpiration <= hoursBeforeExpiration) {
    console.log("refresh");
    return 'refresh'
  } else {
    console.log("valid");
    return 'valid'
  }
}

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const easycobSession = getSession();

  if (easycobSession) {
    const check = checkTokenExpiration(easycobSession);

    switch (check) {
      case 'expire':
        return NextResponse.redirect(new URL("/login", req.url));
        break;
      default:
        break;
    }
  }

  if (!easycobSession && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (easycobSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  /* 
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  } 
 */
  //const accessToken = decrypt(easycobSession);

  //const user = accessToken.user;

  //console.log(user)

  // 5. Redirect to /login if the user is not authenticated
  /*   if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  } */

  // 6. Redirect to /dashboard if the user is authenticated
  /*   if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  } */

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
