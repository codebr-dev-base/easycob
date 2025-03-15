export function extractTextInsideBrackets(text: string): string {
  const regex = /\[(.*?)\]/; // Captura o conteúdo dentro de colchetes
  const match = text.match(regex);
  return match ? match[1] : text; // Retorna o conteúdo ou o texto original se não houver colchetes
}

export function removeAccentsAndSymbols(text: string): string {
  return text
    .normalize('NFD') // Normaliza caracteres acentuados para sua forma decomposta
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .replace(/[^a-zA-Z0-9_]/g, ''); // Remove tudo que não for letra, número ou underline
}
