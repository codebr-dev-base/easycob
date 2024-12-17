import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/crypto";
import { getSession } from "./app/lib/auth";
import { ISessionCookie, ISkill } from "./app/interfaces/auth";

// 1. Specify protected and public routes
const protectedRoutes: string[] = ["/operation", "/supervision", "/admin"];
const publicRoutes: string[] = ["/login"]; // TODO: ajustar isso antes de ir para prod

// Mapeamento de módulos para rotas
const routeModules = {
  "/operation": "operator",
  "/supervision": "supervisor",
  "/admin": "admin",
};

// Define a hierarquia de acesso
const moduleHierarchy = {
  admin: ["admin", "supervisor", "operator"],
  supervisor: ["supervisor", "operator"],
  operator: ["operator"],
};

type Route = keyof typeof routeModules; // Obtém as chaves como um tipo

// Função para verificar o status do token
function checkTokenExpiration(tokenData: ISessionCookie) {
  const now = new Date();
  const expirationDate = new Date(tokenData.expiresAt);
  const hoursBeforeExpiration = 12 * 60 * 60 * 1000; // 12 horas em milissegundos

  // Verifica se o token já expirou
  if (now > expirationDate) {
    console.log("expire");
    return "expire";
  }

  // Verifica se está no período de 12 horas antes da expiração
  const timeUntilExpiration = expirationDate.getTime() - now.getTime();
  if (timeUntilExpiration <= hoursBeforeExpiration) {
    console.log("refresh");
    return "refresh";
  } else {
    console.log("valid");
    return "valid";
  }
}

// Função para verificar permissões (abilities)
function hasAbility(abilities: string[], requiredAbility: string): boolean {
  return abilities.includes("*") || abilities.includes(requiredAbility);
}

// Verifica se o usuário tem acesso ao módulo
function hasModuleAccess(
  modules: { shortName: string }[],
  requiredModule: string
): boolean {
  return modules.some((module) => module.shortName === requiredModule);
}

// Função para verificar o acesso com base na hierarquia
function hasAccessToRoute(
  userModules: string[],
  requiredModule: string
): boolean {
  return userModules.some((userModule) => {
    if (userModule in moduleHierarchy) {
      return moduleHierarchy[
        userModule as keyof typeof moduleHierarchy
      ].includes(requiredModule);
    }
    return false;
  });
}

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const matchedRoute = protectedRoutes.find((route) => path.startsWith(route));

  // 3. Decrypt the session from the cookie
  const easycobSession = getSession();

  if (easycobSession) {
    const check = checkTokenExpiration(easycobSession);
    switch (check) {
      case "expire":
        return NextResponse.redirect(new URL("/login", req.url));
        break;
      default:
        break;
    }

    // Verifica habilidades do usuário para rotas protegidas
    if (isProtectedRoute) {
      if (matchedRoute && matchedRoute in routeModules) {
        const requiredModule =
          routeModules[matchedRoute as keyof typeof routeModules];

        console.log("Required Module:", requiredModule);
        // Use `requiredModule` normalmente

        if (
          matchedRoute &&
          matchedRoute in routeModules &&
          easycobSession.user
        ) {
          const requiredModule =
            routeModules[matchedRoute as keyof typeof routeModules];
          const userModules = easycobSession.user.skills
            .filter(
              (skill): skill is ISkill =>
                typeof skill === "object" && skill !== null
            )
            .map((skill) => skill.module.shortName);

          // Verifica acesso considerando a hierarquia
          const hasAccess = hasAccessToRoute(userModules, requiredModule);

          if (!hasAccess) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
          }
        }
      }
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
