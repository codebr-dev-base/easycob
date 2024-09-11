import { decrypt } from "@/app/lib/crypto";
import Cookies from "js-cookie";
import { getCookies } from "next-client-cookies/server";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

function getAccessToken(): string | null {
  // Se estiver no lado do cliente
  if (typeof window !== "undefined") {
    const easycobSession = Cookies.get("easycob_session");
    if (!easycobSession) return null;

    const decryptedSession = decrypt(easycobSession);
    return decryptedSession?.token || null;
  }

  // Se estiver no lado do servidor
  if (typeof global !== "undefined") {
    const cookies = getCookies();
    const easycobSession = cookies.get("easycob_session");
    if (!easycobSession) return null;

    const decryptedSession = decrypt(easycobSession);
    return decryptedSession?.token || null;
  }

  return null;
}

export async function fetchAuth<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T | null> {
  // Obtém o token de acordo com o ambiente
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Adiciona o token no header apenas se ele existir
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP! Status: ${response.status}`);
  }

  // Retorna a resposta como JSON
  return response.json() as Promise<T>;
}
