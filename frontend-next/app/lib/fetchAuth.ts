import {
  IError,
  IFetchOptions,
  IFetchResponse,
  IHeaders,
} from "../interfaces/fetch";
import { getAccessToken } from "./auth";

export function buildQueryString(query: Record<string, any>): string {
  // Limpa os valores nulos, indefinidos e strings vazias ou com espaços em branco
  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (typeof value !== "string" || value.trim() !== "")
    )
  );

  // Converte arrays para múltiplos valores na query string
  return new URLSearchParams(
    Object.entries(cleanedQuery).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== null && v !== undefined) {
            acc.append(key, v.toString());
          }
        });
      } else if (value !== null && value !== undefined) {
        acc.append(key, value.toString());
      }
      return acc;
    }, new URLSearchParams())
  ).toString();
}

export function parseQueryString(
  searchParams: URLSearchParams
): Record<string, any> {
  const result: Record<string, any> = {};

  searchParams.forEach((value, key) => {
    // Verifica se a chave já existe para tratar múltiplos valores como arrays
    if (result[key]) {
      // Se já existe e não é um array, transforma em array
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      // Adiciona o novo valor ao array
      result[key].push(value);
    } else {
      // Caso contrário, adiciona o valor normalmente
      result[key] = value;
    }
  });

  return result;
}

export async function fetchAuth<T = any>(
  url: string,
  options: IFetchOptions = {}
): Promise<IFetchResponse<T>> {
  // Obtém o token de acordo com o ambiente
  const token = getAccessToken();

  const headers: IHeaders = {
    ...options.headers,
  };

  // Definir "Content-Type" somente se não for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Adiciona o token no header apenas se ele existir
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Converte o objeto query para query string, se existir
  //let finalUrl = url;
  /*
  if (options.query) {
    // Limpa os valores nulos, indefinidos e strings vazias ou com espaços em branco
    const cleanedQuery = Object.fromEntries(
      Object.entries(options.query).filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          (typeof value !== "string" || value.trim() !== "") // Se for string, remove strings vazias ou só com espaços
      )
    );

    // Converte arrays para múltiplos valores na query string
    const queryString = new URLSearchParams(
      Object.entries(cleanedQuery).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          // Para arrays, adiciona cada item individualmente no mesmo parâmetro
          value.forEach((v) => {
            if (v !== null && v !== undefined) {
              acc.append(key, v.toString());
            }
          });
        } else if (value !== null && value !== undefined) {
          // Verifica se value não é null ou undefined antes de adicionar
          acc.append(key, value.toString());
        }
        return acc;
      }, new URLSearchParams())
    ).toString();

    // Anexa a string de consulta à URL
    finalUrl = `${url}?${queryString}`;
  }
  */

  let finalUrl = url;
  if (options.query) {
    const queryString = buildQueryString(options.query);
    finalUrl = `${url}?${queryString}`;
  }

  try {
    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: IError[] = [];
      const responseBody = await response.json().catch(() => null);

      // Verifica os possíveis formatos da resposta de erro
      if (responseBody) {
        const { data, message, error, errors } = responseBody;

        // Verifica status para tratamento específico
        if (response.status === 401) {
          return {
            success: false,
            data: null,
            message: "Unauthorized",
            error: "Unauthorized",
            errors: errors || errorData,
          };
        }

        if (response.status === 403) {
          return {
            success: false,
            data: null,
            message: "Forbidden",
            error: "Forbidden",
            errors: errors || errorData,
          };
        }

        // Configuração da resposta de erro com múltiplas possibilidades
        return {
          success: false,
          data: data || null,
          message: message || `Erro HTTP! Status: ${response.status}`,
          error: error || `Erro HTTP! Status: ${response.status}`,
          errors: errors || errorData,
        };
      } else {
        const textError = await response.text();
        errorData.push({ message: textError });

        return {
          success: false,
          data: null,
          message: `Erro HTTP! Status: ${response.status}`,
          error: `Erro HTTP! Status: ${response.status}`,
          errors: errorData,
        };
      }
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    // Captura qualquer erro de rede ou de execução
    return { success: false, data: null, error: (error as Error).message };
  }
}
