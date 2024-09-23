import "server-only";
import {ISessionCookie} from "@/app/interfaces/auth";
import { redirect } from "next/navigation";
import { decrypt, encrypt } from "@/app/lib/crypto";
import { getCookies } from "next-client-cookies/server";

export async function createSession(accessToken: ISessionCookie) {
  const cookies = getCookies();
  
  const expiresAt = new Date(accessToken.expiresAt);

  cookies.set("easycob_session", encrypt(accessToken), {
    expires: expiresAt,
    path: "/",
  });

  // Calcular o tempo restante até a expiração
  const now = new Date();
  const timeUntilExpiration = expiresAt.getTime() - now.getTime();

  // Atualize 60 segundos antes de expirar, ou qualquer outro tempo de segurança que desejar
  const refreshBeforeExpiration = Math.max(timeUntilExpiration - 60 * 1000, 0);

  // Configurar o temporizador para atualizar o token antes de expirar
  //setTimeout(updateSession, refreshBeforeExpiration);
}

export async function updateSession() {
  const cookies = getCookies();
  const easycobSession = cookies.get("easycob_session");

  if (!easycobSession) {
    redirect("/login");
  }

  const accessToken = decrypt(easycobSession);

  const payload = await refresh(accessToken);

  if (!payload) {
    return null; // Adicione controle de erro conforme necessário
  }

  const expiresAt = new Date(payload.expiresAt);

  // Definir o novo cookie com o token atualizado
  cookies.set("easycob_session", encrypt(accessToken), {
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  // Calcular o tempo restante até a expiração
  const now = new Date();
  const timeUntilExpiration = expiresAt.getTime() - now.getTime();

  // Atualize 60 segundos antes de expirar, ou qualquer outro tempo de segurança que desejar
  const refreshBeforeExpiration = Math.max(timeUntilExpiration - 60 * 1000, 0);

  // Configurar o temporizador para atualizar o token antes de expirar
  //setTimeout(updateSession, refreshBeforeExpiration);
}

export async function refresh(accessToken: ISessionCookie) {
  const url = process.env.API_URL ? process.env.API_URL : "";
  const response = await fetch(`${url}/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.token}`,
    },
  });

  // Verifica se a resposta está ok (status 200-299)
  if (!response.ok) {
    redirect("/login");
  }

  const payload:ISessionCookie= (await response.json()) as ISessionCookie;
  return payload;
}

export function deleteSession() {
  const cookies = getCookies();
  cookies.remove("easycob_session");
}
