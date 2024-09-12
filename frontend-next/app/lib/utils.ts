/**
 * Converte uma string de data no formato ISO para o formato de data padrão do Brasil (dd/MM/yyyy).
 * @param isoDateString A string da data no formato ISO (ex: 2024-09-04T00:00:00.000Z).
 * @returns A data formatada no padrão brasileiro (ex: 04/09/2024).
 */
export function formatDateToBR(isoDateString: string): string {
  const date = new Date(isoDateString);

  // Configuração para o formato de data brasileiro
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatarFone(fone: string): string {
    // Remove todos os caracteres que não são dígitos
    const numeros = fone.replace(/\D/g, '');

    // Verifica o comprimento do número
    if (numeros.length === 10) {
        // Formato para números de fone de 10 dígitos (ex: (12) 3456-7890)
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else if (numeros.length === 11) {
        // Formato para números de fone de 11 dígitos (ex: (12) 9 1234-5678)
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(3, 7)}-${numeros.slice(7)}`;
    } else {
        // Retorna uma mensagem de erro se o número não tem o comprimento esperado
        return 'Número de fone inválido!';
    }
}
