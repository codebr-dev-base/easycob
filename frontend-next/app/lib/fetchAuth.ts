import { IFetchOptions, IFetchResponse, IHeaders } from "../interfaces/fetch";
import { getAccessToken } from "./auth";

export async function fetchAuth<T = any>(
  url: string,
  options: IFetchOptions = {}
): Promise<IFetchResponse<T>> {
  // Obtém o token de acordo com o ambiente
  const token = getAccessToken();

  const headers: IHeaders = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Adiciona o token no header apenas se ele existir
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Converte o objeto query para query string, se existir
  let finalUrl = url;
  if (options.query) {
    // Limpa os valores nulos ou indefinidos
    const cleanedQuery = Object.fromEntries(
      Object.entries(options.query).filter(([_, value]) => value !== null && value !== undefined)
    );

    // Converte o objeto query para uma string de consulta
    const queryString = new URLSearchParams(cleanedQuery as Record<string, string>).toString();

    // Anexa a string de consulta à URL
    finalUrl = `${url}?${queryString}`;
  }

  try {
    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Verifica status para tratamento específico
      if (response.status === 401) {
        // Tratar caso de autenticação inválida (e.g., redirecionar para login)
        return { success: false, data: null, error: 'Unauthorized' };
      }

      if (response.status === 403) {
        // Tratar caso de acesso proibido
        return { success: false, data: null, error: 'Forbidden' };
      }

      // Para outros erros
      return { success: false, data: null, error: `Erro HTTP! Status: ${response.status}` };
    }

    const data = await response.json() as T;
    return { success: true, data };
  } catch (error) {
    // Captura qualquer erro de rede ou de execução
    return { success: false, data: null, error: (error as Error).message };
  }
}