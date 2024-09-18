import { decrypt } from "@/app/lib/crypto";
import Cookies from "js-cookie";
import { getCookies } from "next-client-cookies/server";
import { use } from "react";
import { ISessionCookie, IUser } from "../interfaces/auth";

export function getSession(): ISessionCookie | null {
  // Se estiver no lado do cliente
  if (typeof window !== "undefined") {
    const easycobSession = Cookies.get("easycob_session");
    if (!easycobSession) return null;

    const decryptedSession = decrypt(easycobSession);
    return decryptedSession || null;
  }

  // Se estiver no lado do servidor
  if (typeof global !== "undefined") {
    const cookies = getCookies();
    const easycobSession = cookies.get("easycob_session");
    if (!easycobSession) return null;

    const decryptedSession = decrypt(easycobSession);
    return decryptedSession || null;
  }

  return null;
}

export function getAccessToken(): string | null {
  const decryptedSession = getSession();
  return decryptedSession?.token || null;
}

export function getUser(): IUser | null {
  const decryptedSession = getSession();
  return decryptedSession?.user || null;
}

export function getAbilities(): string[] | null {
  const decryptedSession = getSession();
  return decryptedSession?.abilities || null;
}

export function isAuth(): boolean {
  const decryptedSession = getSession();
  if (decryptedSession && decryptedSession.user) {
    return true;
  }
  return false;
}

export function getUserInitials(): string | null {
  const user = getUser();

  if (!user) {
    return null;
  }
  const ignoreWords = ["da", "das", "de", "do", "dos", "e"];

  return user.name
    .split(" ") // Divide o nome por espaços
    .filter((word) => !ignoreWords.includes(word.toLowerCase())) // Ignora palavras específicas
    .map((word) => word[0].toUpperCase()) // Pega a primeira letra de cada palavra e transforma em maiúscula
    .slice(0, 2) // Pega apenas as duas primeiras iniciais
    .join(""); // Junta as iniciais
}
