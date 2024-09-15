import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/crypto";

// 1. Specify protected and public routes
const protectedRoutes: string[] = [];
const publicRoutes: string[] = ["/login", "/", "/admin", "/supervision"]; // TODO: ajustar isso antes de ir para prod

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const easycobSession = req.cookies.get("easycob_session")?.value;

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
