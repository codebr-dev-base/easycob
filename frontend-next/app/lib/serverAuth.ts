import { decrypt } from "@/app/lib/crypto";
import { getCookies } from "next-client-cookies/server";

export function getAccessTokenFromCookie(): string | null {
  const cookies = getCookies();
  const easycobSession = cookies.get("easycob_session");

  if (!easycobSession) {
    return null;
  }

  const accessToken = decrypt(easycobSession);
  return accessToken.token; // Ajuste de acordo com a estrutura do token após decryption
}
