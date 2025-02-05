import CryptoJS from "crypto-js";
import { ISessionCookie } from "../interfaces/auth";

// Sua chave secreta (deve ser uma chave segura e secreta!)
const secretKey =
  process.env.SESSION_SECRET ||
  process.env.NEXT_PUBLIC_SESSION_SECRET ||
  "default_secret_key";

// Função para criptografar dados
export function encrypt(data: ISessionCookie): string {
  // Converte o objeto para uma string JSON e o criptografa
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return ciphertext; // Retorna o texto criptografado
}

// Função para descriptografar dados
export function decrypt(encryptedData: string): ISessionCookie {
  // Descriptografa o texto e converte de volta para JSON
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  // Converte a string JSON de volta para um objeto
  return JSON.parse(decryptedData) as ISessionCookie;
}
