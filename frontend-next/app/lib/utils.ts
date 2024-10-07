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
  const numeros = fone.replace(/\D/g, "");

  // Verifica o comprimento do número
  if (numeros.length === 10) {
    // Formato para números de fone de 10 dígitos (ex: (12) 3456-7890)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(
      6
    )}`;
  } else if (numeros.length === 11) {
    // Formato para números de fone de 11 dígitos (ex: (12) 9 1234-5678)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(
      3,
      7
    )}-${numeros.slice(7)}`;
  } else {
    // Retorna uma mensagem de erro se o número não tem o comprimento esperado
    return "Número de fone inválido!";
  }
}

export function formatToBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function onlyNumbers(input: string): string {
  // Remove tudo que não for dígito numérico (0-9)
  return input.replace(/\D/g, "");
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
