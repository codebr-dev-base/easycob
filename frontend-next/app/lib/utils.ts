/**
 * Converte uma string de data no formato ISO para o formato de data padrão do Brasil (dd/MM/yyyy).
 * @param isoDateString A string da data no formato ISO (ex: 2024-09-04T00:00:00.000Z).
 * @returns A data formatada no padrão brasileiro (ex: 04/09/2024).
 */

export function formatDateToBR(
  isoDateString: string | null | undefined
): string {
  if (!isoDateString) {
    return "";
  }

  let dateString = isoDateString;

  // Verifica se contém "T" e, se sim, remove o horário
  if (isoDateString.includes("T")) {
    dateString = isoDateString.split("T")[0]; // Pega apenas a parte "YYYY-MM-DD"
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day)); // Define o UTC 00:00 do dia
  //const date = new Date(dateString);

  // Adiciona três horas para compensar o fuso horário local
  date.setUTCHours(date.getUTCHours() + 3);

  if (isNaN(date.getTime())) {
    return "";
  }

  // Formata para o padrão brasileiro
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateToISO(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

export function formatDateToDatePtBr(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

export function formatTimeToDatePtBr(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR");
}

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);

  // Extrai a data em UTC para evitar problemas de fuso horário
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Mês em UTC
  const day = String(date.getUTCDate()).padStart(2, "0"); // Dia em UTC

  return `${year}-${month}-${day}`;
}

export function formatarFone(fone: string | null | undefined): string {
  if (typeof fone !== "string" || !fone.trim()) {
    return ""; // Retorna string vazia se a variável não for uma string válida
  }

  // Remove todos os caracteres que não são dígitos
  const numeros = fone.replace(/\D/g, "");

  // Verifica o comprimento do número
  if (numeros.length === 10) {
    // Formato para números de telefone de 10 dígitos (ex: (92) 8246-1020)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(
      6
    )}`;
  } else if (numeros.length === 11 && numeros[2] === "9") {
    // Formato para números de telefone de 11 dígitos (ex: (92) 9 8246-1020)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(
      3,
      7
    )}-${numeros.slice(7)}`;
  } else {
    // Se o número não é compatível com o formato esperado
    return `Número de fone inválido! ${fone}`;
  }
}

export function formatCurrencyToBRL(
  value: number | string | undefined | null
): string {
  // Verifica se o valor é null e trata como undefined
  if (value === null) {
    value = undefined;
  }

  // Tenta converter strings para número
  let numericValue: number | undefined;

  if (typeof value === "string") {
    // Remove espaços e converte para número, caso possível
    numericValue = parseFloat(value.replace(/,/g, "").trim());

    // Verifica se o valor convertido é válido
    if (isNaN(numericValue)) {
      numericValue = undefined;
    }
  } else {
    numericValue = value;
  }

  // Formata o número ou retorna "R$ 0,00" se o valor for undefined ou inválido
  if (numericValue !== undefined && !isNaN(numericValue)) {
    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Caso o valor seja inválido ou indefinido, retorna "R$ 0,00"
  return (0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function onlyNumbers(input: string): string {
  // Remove tudo que não for dígito numérico (0-9)
  return input.replace(/\D/g, "");
}

export function parseFromBRL(
  value: string | number | null | undefined
): number {
  // Se o valor for null ou undefined, retornamos 0
  if (value === null || value === undefined) {
    return 0;
  }

  // Se o valor for numérico, convertemos diretamente para número
  if (typeof value === "number") {
    return value;
  }

  // Se o valor não for string, convertemos para string
  const stringValue = String(value);

  // Remove o símbolo de moeda, pontos de milhares e substitui a vírgula decimal por ponto
  const cleanedValue = stringValue
    .replace(/[R$\s]/g, "") // Remove "R$", espaço
    .replace(/\./g, "") // Remove pontos de milhares
    .replace(/,/g, "."); // Substitui a vírgula decimal por ponto

  return parseFloat(cleanedValue) || 0; // Converte para número e retorna 0 se for inválido
}

// Função para gerar cores aleatórias (opcional)
export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const rgbToHex = (rgb: string): string => {
  // Remove 'rgb(' e ')' e divide a string em três partes (r, g, b)
  const [r, g, b] = rgb
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .map(Number);

  // Converte cada valor de r, g e b para hexadecimal e garante que tenha 2 dígitos
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  // Retorna a string no formato '#rrggbb'
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hexToRgb = (hex: string): string => {
  // Remove o '#' caso exista
  hex = hex.replace("#", "");

  // Converte a string hexadecimal para valores numéricos RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Retorna a string no formato 'rgb(r, g, b)'
  return `rgb(${r}, ${g}, ${b})`;
};

// Função para inverter a cor (hex -> hex)
export const getInverseColor = (color: string): string => {
  if (color.startsWith("#")) {
    // Remove o '#' e inverte a cor hexadecimal
    const hex = color.replace("#", "");
    const inverseHex = (parseInt(hex, 16) ^ 0xffffff)
      .toString(16)
      .padStart(6, "0");
    return `#${inverseHex}`;
  } else if (color.startsWith("rgb")) {
    // Extrai valores RGB e inverte cada componente
    const [r, g, b] = color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map(Number);

    const inverseRgb = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
    return inverseRgb;
  }

  throw new Error("Formato de cor inválido");
};

// Função para gerar variação de cor (hex -> hex ou rgb -> rgb)
export const getColorVariation = (color: string, factor: number): string => {
  const adjustColor = (component: number) => {
    // Ajusta o componente com o fator dado, limitando entre 0 e 255
    return Math.min(255, Math.max(0, Math.round(component * factor)));
  };

  if (color.startsWith("#")) {
    // Remove o '#' e converte hex para RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Aplica o fator para gerar a variação
    const newR = adjustColor(r);
    const newG = adjustColor(g);
    const newB = adjustColor(b);

    // Converte de volta para hexadecimal
    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  } else if (color.startsWith("rgb")) {
    // Extrai valores RGB e aplica o fator
    const [r, g, b] = color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map(Number);

    const newR = adjustColor(r);
    const newG = adjustColor(g);
    const newB = adjustColor(b);

    return `rgb(${newR}, ${newG}, ${newB})`;
  }

  throw new Error("Formato de cor inválido");
};

// Função que transforma uma cor RGB em RGBA
export const rgbToRgba = (rgbColor: string, alpha: number): string => {
  if (!rgbColor.startsWith("rgb")) {
    throw new Error("Formato de cor inválido, a cor precisa estar em RGB.");
  }

  // Extrai os valores RGB
  const [r, g, b] = rgbColor
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .map(Number);

  // Verifica se o alpha está no intervalo entre 0 e 1
  if (alpha < 0 || alpha > 1) {
    throw new Error("O valor do alpha deve estar entre 0 e 1.");
  }

  // Retorna a cor no formato RGBA
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getFirstAndLastName = (fullName: string): string => {
  // Divide o nome completo em partes usando o espaço como separador
  const nameParts = fullName.trim().split(" ");

  // Se houver apenas um nome, retorna o nome
  if (nameParts.length === 1) {
    return fullName;
  }

  // Retorna o primeiro e o último nome
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  return `${firstName} ${lastName}`;
};

export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Verifica se o valor é uma string vazia, null, ou "null"
    if (value === "" || value === null || value === "null") {
      return acc; // Não inclui propriedades com valores vazios ou nulos
    }

    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
};

export const formatStringToCpfCnpj = (document: any): string | null => {
  // Verifica se o valor existe e é uma string
  if (typeof document !== "string" || !document.trim()) {
    return null; // Retorna null se a variável não for uma string válida
  }

  // Remove todos os caracteres não numéricos
  const cleanedDocument = document.replace(/\D/g, "");

  // Verifica se o tamanho corresponde ao CPF ou CNPJ
  if (cleanedDocument.length === 11) {
    // Formata como CPF: 999.999.999-99
    return cleanedDocument.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
  } else if (cleanedDocument.length === 14) {
    // Formata como CNPJ: 99.999.999/9999-99
    return cleanedDocument.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return null; // Retorna null se não for nem CPF nem CNPJ
};

export const calcDaylate = (datVenci: string) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const date = new Date(new Date(datVenci).setHours(24, 0, 0, 0));
  return Math.round((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
};
