export const parseStringToQuery = (
  searchParams: URLSearchParams
): Record<string, string | string[]> => {
  const result: Record<string, string | string[]> = {};

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
};

export function buildQueryString(query: Record<string, unknown>): string {
  // Limpa os valores nulos, indefinidos e strings vazias ou com espaços em branco
  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "null" && // Remove a string "null"
        (typeof value !== "string" || value.trim() !== "")
    )
  );
  // Converte arrays para múltiplos valores na query string
  return new URLSearchParams(
    Object.entries(cleanedQuery).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== null && v !== undefined && v !== "null") {
            acc.append(key, v.toString());
          }
        });
      } else if (value !== null && value !== undefined && value !== "null") {
        acc.append(key, value.toString());
      }
      return acc;
    }, new URLSearchParams())
  ).toString();
}

export const convertToRecord = (obj: object): Record<string, string | string[]> => {
    const record: Record<string, string | string[]> = {};
  
    if (typeof obj === 'object' && obj !== null) { // Verificação importante!
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) { // Outra verificação importante!
          const value = (obj as Record<string, unknown>)[key]; // Type assertion para acessar as propriedades
  
          if (Array.isArray(value)) {
            record[key] = value.map(item => item.toString());
          } else if (typeof value === 'object' && value !== null) {
            record[key] = JSON.stringify(value);
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            record[key] = value.toString();
          } else if (typeof value === 'string') {
            record[key] = value;
          } else if (value === null || value === undefined) {
            record[key] = "";
          } else {
            record[key] = value?.toString() ?? ""; // Converte outros tipos para string ou string vazia
          }
        }
      }
    }
  
    return record;
  };
