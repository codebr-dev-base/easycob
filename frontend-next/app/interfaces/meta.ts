export interface IMeta {
    currentPage: number; // Página atual
    firstPage: number; // Primeira página
    firstPageUrl: string; // URL da primeira página
    lastPage: number; // Última página
    lastPageUrl: string; // URL da última página
    nextPageUrl: string | null; // URL da próxima página (pode ser null)
    perPage: number; // Itens por página
    previousPageUrl: string | null; // URL da página anterior (pode ser null)
    total: number; // Total de itens
  }